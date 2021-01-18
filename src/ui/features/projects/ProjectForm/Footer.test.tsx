import React from 'react';
import { Field, Form } from 'react-final-form';
import { act, fireEvent, render, RenderResult, screen } from '@testing-library/react';
import { createForm } from 'final-form';
import { merge } from 'ramda';

import { ProjectStatusEnum, ProjectTypeEnum } from '../../../../__generated__/types';

import { Footer, FooterProps } from './Footer';
import { FormValues } from './types';

type Props = Omit<FooterProps, 'isFormDirty'> & {
  onSubmit(values: FormValues): void;
};

const initialize = (fields?: FormValues): FormValues =>
  fields ?? {
    name: '',
    description: '',
    region: null,
    status: ProjectStatusEnum.Blank,
    coordinates: '',
    yearStart: undefined,
    type: ProjectTypeEnum.Geo,
  };

type RenderComponentResult = {
  component: RenderResult;
  dirtyForm(): void;
  invalidForm(): void;
};

const defaultProps: Props = {
  mode: 'create',
  activeStep: 1,
  stepsAmount: 3,
  onStepChange: () => {},
  onCancel: () => {},
  onSubmit: () => {},
};

const renderComponent = (props?: Partial<Props>): RenderComponentResult => {
  const withDefaults = merge(defaultProps);
  const { mode, activeStep, stepsAmount, onStepChange, onSubmit, onCancel } = props
    ? withDefaults(props)
    : defaultProps;

  const form = createForm<FormValues>({
    onSubmit,
    initialValues: initialize(),
    validate: (values) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors: Record<any, string> = {};

      if (values.name === 'invalid') {
        errors.name = 'invalid';
      }

      return errors;
    },
  });

  const component = render(
    <Form form={form} onSubmit={onSubmit}>
      {({ dirty, handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            {/* https://github.com/final-form/final-form/issues/169 */}
            <Field name="name">{() => null}</Field>
            <Footer
              mode={mode}
              isFormDirty={dirty}
              activeStep={activeStep}
              stepsAmount={stepsAmount}
              onStepChange={onStepChange}
              onCancel={onCancel}
            />
          </form>
        );
      }}
    </Form>,
  );

  return {
    component,
    dirtyForm() {
      form.change('name', 'testing');
    },
    invalidForm() {
      form.change('name', 'invalid');
    },
  };
};

describe('Footer', () => {
  it('рендерит без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  describe('моды', function () {
    it('показывает футер для создания проекта', function () {
      renderComponent();

      const rootCreate = screen.queryByTestId(Footer.testId.footerCreate);
      const rootEdit = screen.queryByTestId(Footer.testId.footerEdit);

      expect(rootCreate).toBeInTheDocument();
      expect(rootEdit).not.toBeInTheDocument();
    });

    it('показывает футер для редактирования проекта, если в форме были изменения', function () {
      const { dirtyForm } = renderComponent({
        mode: 'edit',
      });

      act(() => {
        dirtyForm();
      });

      const rootEdit = screen.queryByTestId(Footer.testId.footerEdit);
      const rootCreate = screen.queryByTestId(Footer.testId.footerCreate);

      expect(rootEdit).toBeInTheDocument();
      expect(rootCreate).not.toBeInTheDocument();
    });

    it('скрывает футер для редактирования проекта, если в форме нет изменений', function () {
      renderComponent({
        mode: 'edit',
      });

      const rootEdit = screen.queryByTestId(Footer.testId.footerEdit);
      const rootCreate = screen.queryByTestId(Footer.testId.footerCreate);

      expect(rootEdit).not.toBeInTheDocument();
      expect(rootCreate).not.toBeInTheDocument();
    });
  });

  describe('создание проекта', () => {
    describe('шаги', () => {
      it('увеличивает шаг ', () => {
        const onStepChange = jest.fn();

        const { component } = renderComponent({ onStepChange });

        const nextStep = component.getByTestId(Footer.testId.nextStep);

        fireEvent.click(nextStep);

        expect(onStepChange).toBeCalledTimes(1);
        expect(onStepChange).toHaveBeenCalledWith(2);
      });

      it('уменьшает шаг ', () => {
        const onStepChange = jest.fn();

        const { component } = renderComponent({
          activeStep: 2,
          onStepChange,
        });

        const prevStep = component.getByTestId(Footer.testId.prevStep);

        fireEvent.click(prevStep);

        expect(onStepChange).toBeCalledTimes(1);
        expect(onStepChange).toHaveBeenCalledWith(1);
      });

      it('показывает кнопку создания проекта, если шаг последний', () => {
        const { component } = renderComponent({
          activeStep: 2,
        });

        const createButton = component.getByTestId(Footer.testId.createButton);

        expect(createButton).toBeInTheDocument();
      });
    });

    it('выключает кнопку создания, если есть ошибки в форме', function () {
      const { component, invalidForm } = renderComponent({
        activeStep: 2,
      });

      act(() => {
        invalidForm();
      });

      const createButton = component.getByTestId(Footer.testId.createButton);

      expect(createButton).toBeDisabled();
    });

    it('тригерит обработчик отмены создания', function () {
      const onCancel = jest.fn();

      const { component } = renderComponent({
        activeStep: 2,
        onCancel,
      });

      const cancelCreate = component.getByTestId(Footer.testId.cancelCreate);

      fireEvent.click(cancelCreate);

      expect(onCancel).toBeCalled();
    });

    it('меняет статус при сабмите', function () {
      const onSubmit = jest.fn((v) => v);

      const { component } = renderComponent({
        activeStep: 2,
        onSubmit: (values) => onSubmit(values.status),
      });

      const createButton = component.getByTestId(Footer.testId.createButton);

      fireEvent.click(createButton);

      expect(onSubmit).toBeCalled();
      expect(onSubmit).toHaveBeenCalledWith(ProjectStatusEnum.Unpublished);
    });
  });

  describe('редактирование проекта', () => {
    it('тригерит обработчик отмены редактирования', function () {
      const onCancel = jest.fn();

      const { component, dirtyForm } = renderComponent({
        mode: 'edit',
        activeStep: 2,
        onCancel,
      });

      act(() => {
        dirtyForm();
      });

      const cancelEdit = component.getByTestId(Footer.testId.cancelEdit);

      fireEvent.click(cancelEdit);

      expect(onCancel).toBeCalled();
    });

    it('происходит сабмит формы', function () {
      const onSubmit = jest.fn();

      const { component, dirtyForm } = renderComponent({
        mode: 'edit',
        activeStep: 2,
        onSubmit,
      });

      act(() => {
        dirtyForm();
      });

      const saveEdit = component.getByTestId(Footer.testId.saveEdit);

      fireEvent.submit(saveEdit);

      expect(onSubmit).toBeCalled();
    });
    it('выключает кнопку сохранения, если есть ошибки в форме', function () {
      const { component, invalidForm } = renderComponent({
        mode: 'edit',
        activeStep: 2,
      });

      act(() => {
        invalidForm();
      });

      const saveEdit = component.getByTestId(Footer.testId.saveEdit);

      expect(saveEdit).toBeDisabled();
    });
  });
});
