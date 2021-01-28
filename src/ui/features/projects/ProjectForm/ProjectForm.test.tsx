import React from 'react';
import { act, fireEvent, render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmissionErrors } from 'final-form';
import { merge } from 'ramda';

import { Country, ProjectStatusEnum, Region } from '../../../../__generated__/types';

import { getCombobox, initializeProjectForm } from './__tests__/utils';
import { ProjectForm } from './ProjectForm';
import { DescriptionStep } from './steps';
import { FormProps } from './types';

type Props = FormProps;

type CreateRegionProps = {
  region: {
    id: string;
    name: string;
    fullName?: string;
  };
  country?: {
    id: string;
    name: string;
  };
};

type CreateRegionResult = { __typename: 'Region' } & Pick<Region, 'vid' | 'name' | 'fullName'> & {
    country?: { __typename: 'Country' } & Pick<Country, 'vid' | 'name'>;
  };

export const createRegion = (props: CreateRegionProps): CreateRegionResult => {
  const { region } = props;
  return {
    __typename: 'Region',
    name: region.name,
    fullName: region.fullName,
    vid: region.id,
    country: props.country
      ? { __typename: 'Country', vid: props.country.id, name: props.country.name }
      : undefined,
  };
};

const defaultProps: Props = {
  mode: 'create',
  referenceData: {
    regionList: [
      createRegion({
        region: {
          id: 'region-1',
          name: 'СССР',
        },
        country: { id: 'country-1', name: 'Москва' },
      }),
    ],
  },
  initialValues: initializeProjectForm(),
  onCancel: () => {},
  onSubmit: () => {
    return new Promise<SubmissionErrors>((resolve) => resolve({}));
  },
};

const getInput = (testid: string): HTMLInputElement => {
  const field = screen.getByTestId(testid);
  const input = field.querySelector('input');
  if (input === null) {
    throw new Error('input not found');
  }

  return input;
};

const submitForm = () => {
  const submitElement = screen.getByText('Создать проект');

  userEvent.click(submitElement);
};

const renderComponent = (props?: Partial<Props>): RenderResult => {
  const withDefaults = merge(defaultProps);
  const { mode, referenceData, initialValues, onSubmit, onCancel } = props
    ? withDefaults(props)
    : defaultProps;

  return render(
    <ProjectForm
      mode={mode}
      referenceData={referenceData}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />,
  );
};

describe('ProjectForm', () => {
  it('рендерит без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  it('вызывает onSubmit', async () => {
    const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));
    renderComponent({ onSubmit });

    const nameInput = getInput(DescriptionStep.testId.name);
    userEvent.type(nameInput, 'projectName');

    await act(async () => {
      await submitForm();
    });

    expect(onSubmit).toBeCalled();
  });

  it('вызывает onCancel', () => {
    const onCancel = jest.fn();
    renderComponent({ onCancel });

    const cancelButton = screen.getByText('Отмена');

    const nameInput = getInput(DescriptionStep.testId.name);
    userEvent.type(nameInput, 'projectName');

    act(() => {
      userEvent.click(cancelButton);
    });

    expect(onCancel).toBeCalled();
  });

  it.todo('происходит смена шага');

  describe('автосохранение', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('происходит смена статус на Blank, если статус был Unpublished', async () => {
      const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));
      const initialValues = {
        status: ProjectStatusEnum.Unpublished,
      };

      renderComponent({ initialValues, onSubmit });

      const nameInput = getInput(DescriptionStep.testId.name);
      userEvent.type(nameInput, 'projectName');

      await act(async () => {
        jest.runAllTimers();
      });

      expect(onSubmit).toBeCalled();
      expect(onSubmit.mock.calls[0][0]).toEqual(
        expect.objectContaining({ status: ProjectStatusEnum.Blank }),
      );
    });

    it('не происходит автосохранение, если форма невалидна', async () => {
      const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));
      const initialValues = {
        ...initializeProjectForm(),
        status: ProjectStatusEnum.Unpublished,
      };

      renderComponent({ initialValues, onSubmit });

      const nameInput = getInput(DescriptionStep.testId.name);
      fireEvent.change(nameInput, {
        target: {
          value:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, s',
        },
      });

      await act(async () => {
        jest.runAllTimers();
        expect(onSubmit).not.toBeCalled();
      });
    });
  });

  describe('регион', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('выставляет значение списка регионов по умолчанию', () => {
      renderComponent();
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.region);
      const combobox = getCombobox(comboboxElement);

      combobox.toggle();

      const list = screen.getByRole('listbox');

      expect(list.textContent).toContain('СССР');
    });
  });

  describe('год начала планирования', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('не выставляет значение "следующего года", если это форма редактирования ', () => {
      renderComponent({ mode: 'edit' });
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);

      expect(comboboxElement.textContent).toContain('Выберите год');
    });

    it('инициализирует значение в форме и добавляет в начало списка, если это форма создания проекта', async () => {
      renderComponent({ initialValues: { yearStart: 2040 } });
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);
      const combobox = getCombobox(comboboxElement);

      combobox.toggle();

      const options = await combobox.options();

      expect(options[0].textContent).toContain('2040');
    });

    it('добавляет год в начало списка, если его нет в списке и он валидный', async () => {
      renderComponent();

      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);
      const combobox = getCombobox(comboboxElement);

      combobox.type('3020');

      await combobox.selectOption(0);

      combobox.toggle();

      const options = await combobox.options();

      expect(await options[0].textContent).toContain('3020');
    });

    it('не добавляет невалидное значение в список', async () => {
      renderComponent();
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);
      const combobox = getCombobox(comboboxElement);

      combobox.type('ff11');

      await combobox.selectOption(0);

      combobox.toggle();

      const options = await combobox.options();

      expect(options[0].textContent).not.toContain('ff11');
    });
  });

  it.todo('скрывает футер для редактирования проекта, если в форме нет изменений');

  describe('валидация полей', () => {
    describe('создание проекта', () => {
      it.todo('название проекта');
      it.todo('система координат');
      it.todo('год начала планирования');
      it.todo('описание проекта');
    });

    describe('редактирование проекта', () => {
      it.todo('название проекта');
      it.todo('система координат');
      it.todo('год начала планирования');
      it.todo('описание проекта');
    });
  });
});
