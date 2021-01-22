import React from 'react';
import { Form } from 'react-final-form';
import { act, render, RenderResult, screen } from '@testing-library/react';
import { createForm, FormApi } from 'final-form';
import { merge } from 'ramda';

import { referenceData as defaultReferenceData } from '../../__tests__/data';
import { getCombobox, initializeProjectForm } from '../../__tests__/utils';
import { validator } from '../../ProjectForm';
import { FormValues } from '../../types';

import { DescriptionStep, getYearStartOptions, isValidYear, StepProps } from './DescriptionStep';

type RenderComponentResult = {
  component: RenderResult;
  form: FormApi<FormValues>;
};

type Props = StepProps & {
  initialValue: Partial<FormValues>;
  onSubmit(): void;
};

const defaultProps: Omit<Props, 'form'> = {
  mode: 'create',
  referenceData: defaultReferenceData,
  initialValue: initializeProjectForm(),
  onSubmit: () => {},
};

const renderComponent = (props?: Partial<Props>): RenderComponentResult => {
  const withDefaults = merge(defaultProps);
  const { mode, referenceData, initialValue, onSubmit } = props
    ? withDefaults(props)
    : defaultProps;

  const form = createForm<FormValues>({
    onSubmit,
    initialValues: initialValue,
    validate: validator,
  });

  const component = render(
    <Form form={form} onSubmit={onSubmit}>
      {() => {
        return <DescriptionStep mode={mode} referenceData={referenceData} form={form} />;
      }}
    </Form>,
  );

  return {
    form,
    component,
  };
};

describe('DescriptionStep', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('getYearStartOptions', () => {
    it('возвращает список дат на 10 лет вперед, начиная с предыдущего года', () => {
      const years = getYearStartOptions();

      const currentYear = new Date().getFullYear();
      const result = [];

      for (let i = -1; i < 11; i += 1) {
        const year = currentYear + i;
        const option = {
          label: `${year}`,
          value: year.toString(),
        };

        result.push(option);
      }

      expect(years).toEqual(result);
    });
  });

  describe('isValidYear', () => {
    test.each`
      str         | expected | description
      ${'2000'}   | ${true}  | ${'является'}
      ${'2999'}   | ${true}  | ${'является'}
      ${'300000'} | ${false} | ${'не является'}
      ${'3'}      | ${false} | ${'не является'}
    `('проверяет строку $str, что она $description 4х значным числом', ({ str, expected }) => {
      const isValid = isValidYear(str);
      expect(isValid).toBe(expected);
    });
  });

  it('рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  describe('регион', () => {
    it('выставляет значение списка регионов по умолчанию', () => {
      renderComponent();
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.region);
      const combobox = getCombobox(comboboxElement);

      combobox.toggle();

      const list = screen.getByRole('listbox');

      expect(list.textContent).toContain('ЕвропаРоссия');
    });
  });

  describe('год начала планирования', () => {
    it('выставляет значение "следующего года", если это форма создания проекта', () => {
      renderComponent();
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);

      expect(comboboxElement.textContent).toContain('2022');
    });

    it('не выставляет значение "следующего года", если это форма редактирования ', () => {
      renderComponent({ mode: 'edit' });
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);

      expect(comboboxElement.textContent).toContain('Выберите год');
    });

    it('инициализирует значение в форме и добавляет в начало списка, если это форма создания проекта', () => {
      renderComponent({ initialValue: { yearStart: 2040 } });
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);
      const combobox = getCombobox(comboboxElement);

      combobox.toggle();

      const options = combobox.options();

      expect(options[0].textContent).toContain('2040');
      expect(options[1].textContent).toContain('2020');
    });

    it('добавляет год в начало списка, если его нет в списке и он валидный', () => {
      renderComponent();
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);
      const combobox = getCombobox(comboboxElement);

      combobox.type('3020');

      combobox.selectOption(0);

      combobox.toggle();

      const options = combobox.options();

      expect(options[0].textContent).toContain('3020');
      expect(options[1].textContent).toContain('2020');
    });

    it('не добавляет невалидное значение в список', () => {
      renderComponent();
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);
      const combobox = getCombobox(comboboxElement);

      combobox.type('ff11');

      combobox.selectOption(0);

      combobox.toggle();

      const options = combobox.options();

      expect(options[0].textContent).toContain('2020');
    });

    it('показывает ошибку валидации после ввода', () => {
      renderComponent();
      const comboboxElement = screen.getByTestId(DescriptionStep.testId.yearStart);
      const combobox = getCombobox(comboboxElement);

      combobox.type('fffaa');

      combobox.selectOption(0);

      const error = screen.getByTestId(`${DescriptionStep.testId.yearStart}:error`);

      expect(error).toBeInTheDocument();
    });

    it('показывает ошибку валидации по сабмиту', () => {
      const onSubmit = () => {
        return {
          yearStart: 'error',
        };
      };
      const { form } = renderComponent({ onSubmit });

      act(() => {
        form.change('name', 'testing');
        form.submit();
      });

      const error = screen.getByTestId(`${DescriptionStep.testId.yearStart}:error`);

      expect(error).toBeInTheDocument();
    });
  });
});
