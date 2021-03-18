import React from 'react';
import { act, fireEvent, render, RenderResult, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmissionErrors } from 'final-form';
import { merge } from 'ramda';

import { Country, ProjectStatusEnum, Region } from '../../../../__generated__/types';

import { getCombobox, initializeProjectForm } from './__tests__/utils';
import { minYearStart, ProjectForm } from './ProjectForm';
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

const getTextInput = (
  testid: string,
  tag?: 'input' | 'textarea',
): HTMLInputElement | HTMLTextAreaElement => {
  const field = screen.getByTestId(testid);
  const input = field.querySelector(tag ?? 'input');
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

    const nameInput = getTextInput(DescriptionStep.testId.name);
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

    const nameInput = getTextInput(DescriptionStep.testId.name);
    userEvent.type(nameInput, 'projectName');

    userEvent.click(cancelButton);

    expect(onCancel).toBeCalled();
  });

  it.skip('происходит смена статус на Blank, если статус был Unpublished', async () => {
    const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));
    const initialValues = {
      status: ProjectStatusEnum.Unpublished,
    };

    renderComponent({ initialValues, onSubmit });

    const nameInput = getTextInput(DescriptionStep.testId.name);
    userEvent.type(nameInput, 'projectName');

    expect(onSubmit).toBeCalledWith(
      expect.objectContaining({ status: ProjectStatusEnum.Blank }),
      expect.any(Object),
    );
  });

  it.todo('происходит смена шага');

  describe('автосохранение', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    /*
      Добавил тесты в саму форму, так как кажется, что лучше тестировать уже на реальном использовании.
      Тем более, что ProjectForm покрывает все кейсы использования AutosaveFormSpy
    */
    test('происходит автосохрание на форме создания проекта', async () => {
      const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));
      const initialValues = {
        ...initializeProjectForm(),
      };

      renderComponent({ initialValues, onSubmit });

      const nameInput = getTextInput(DescriptionStep.testId.name);
      userEvent.type(nameInput, 'Lorem');

      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(onSubmit).toBeCalled();
      });
    });

    test('не происходит автосохранение на форме редактирования проекта', async () => {
      const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));
      const initialValues = {
        ...initializeProjectForm(),
      };

      renderComponent({ initialValues, onSubmit, mode: 'edit' });

      const nameInput = getTextInput(DescriptionStep.testId.name);
      userEvent.type(nameInput, 'Lorem');

      fireEvent.blur(nameInput);

      await act(async () => {
        expect(onSubmit).not.toBeCalled();
      });
    });

    test('срабатывает повторное автосохранение', async () => {
      const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));
      renderComponent({
        onSubmit,
        initialValues: { ...initializeProjectForm, region: 'region-1' },
        mode: 'create',
      });

      const nameInput = getTextInput(DescriptionStep.testId.name);
      userEvent.type(nameInput, 'Lorem');

      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(onSubmit).toBeCalledTimes(1);
      });

      const combobox = getCombobox(screen.getByTestId(DescriptionStep.testId.region));

      await combobox.clear();

      await waitFor(() => {
        expect(onSubmit).toBeCalledTimes(2);
      });
    });

    it('не происходит автосохранение, если форма невалидна', async () => {
      const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));
      const initialValues = {
        ...initializeProjectForm(),
        status: ProjectStatusEnum.Unpublished,
      };

      renderComponent({ initialValues, onSubmit });

      const nameInput = getTextInput(DescriptionStep.testId.name);
      fireEvent.change(nameInput, {
        target: {
          value:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, s',
        },
      });

      await act(async () => {
        expect(onSubmit).not.toBeCalled();
      });
    });

    test('при очищении региона происходит автосохранение', async () => {
      const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));

      const initialValues = {
        ...initializeProjectForm(),
        status: ProjectStatusEnum.Unpublished,
        region: 'region-1',
      };

      renderComponent({ initialValues, onSubmit });

      const combobox = getCombobox(screen.getByTestId(DescriptionStep.testId.region));

      await combobox.clear();

      await act(async () => {
        expect(onSubmit).toBeCalled();
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

    it('очищает поле при редактировании', async () => {
      const onSubmit = jest.fn().mockImplementation((values) => Promise.resolve(values));

      const initialValues = {
        ...initializeProjectForm(),
        region: 'region-1',
      };

      renderComponent({ initialValues, onSubmit });

      const comboboxElement = screen.getByTestId(DescriptionStep.testId.region);

      const combobox = getCombobox(comboboxElement);

      await combobox.clear();

      expect(onSubmit).toBeCalledWith(
        expect.objectContaining({ region: null }),
        expect.any(Object),
      );
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
    describe('название проекта', () => {
      it.each`
        value              | errorText                                                                 | description
        ${''}              | ${'Заполните обязательное поле'}                                          | ${'обязательного поля'}
        ${'a'.repeat(257)} | ${'Название проекта не может быть менее 2 символов и более 256 символов'} | ${'если символов больше 256'}
        ${'a'}             | ${'Название проекта не может быть менее 2 символов и более 256 символов'} | ${'если символов меньше 2'}
      `('показывает ошибку $description', async ({ value, errorText }) => {
        renderComponent();

        const nameInput = getTextInput(DescriptionStep.testId.name);
        userEvent.type(nameInput, value);

        act(() => {
          submitForm();
        });

        const error = await screen.findByText(errorText);

        expect(error).toBeInTheDocument();
      });
    });

    describe('система координат', () => {
      it('показывает ошибку, если символов больше 2000', async () => {
        renderComponent();

        const value = 'a'.repeat(2001);

        const comboboxElement = screen.getByTestId(DescriptionStep.testId.coordinates);
        const combobox = getCombobox(comboboxElement);
        const input = combobox.input();

        fireEvent.change(input, {
          target: {
            value,
          },
        });

        act(() => {
          submitForm();
        });

        const error = await screen.findByText('Координаты не могут быть более 2000 символов');

        expect(error).toBeInTheDocument();
      });
    });

    describe('год начала планирования', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('показывает ошибку обязательного поля', async () => {
        renderComponent();

        const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);
        const combobox = getCombobox(comboboxElement);

        combobox.clear();

        act(() => {
          submitForm();
        });

        const [, yearError] = await screen.findAllByText('Заполните обязательное поле');

        expect(yearError).toBeInTheDocument();
      });

      it.each`
        value     | errorText                                                            | description
        ${'asd'}  | ${'Значение должно быть годом'}                                      | ${'если значение не год'}
        ${'123'}  | ${'Год начала планирования проекта должен быть четырехзначным'}      | ${'если значение не четырехзначное'}
        ${'2010'} | ${`Год начала планирования не может быть раньше ${minYearStart} г.`} | ${'если значение меньше минимального года планирование'}
      `('показывает ошибку $description', async ({ value, errorText }) => {
        renderComponent();

        const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);
        const combobox = getCombobox(comboboxElement);

        combobox.type(value);

        await combobox.selectOption(0);

        act(() => {
          submitForm();
        });

        const error = await screen.findByText(errorText);

        expect(error).toBeInTheDocument();
      });
    });

    describe('описание проекта', () => {
      it('показывает ошибку если более 2000 символов', async () => {
        renderComponent();

        const input = getTextInput(DescriptionStep.testId.description, 'textarea');

        fireEvent.change(input, { target: { value: 'a'.repeat(2001) } });

        act(() => {
          submitForm();
        });

        const error = await screen.findByText('Описание проекта не может быть более 2000 символов');

        expect(error).toBeInTheDocument();
      });
    });
  });
});
