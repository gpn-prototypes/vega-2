import React from 'react';
import { Form } from 'react-final-form';
import * as tl from '@testing-library/react';
import { createForm, FormApi } from 'final-form';

import { Footer, FooterProps } from './Footer';
import { FormValues } from './types';

type Props = Omit<FooterProps, 'isFormDirty'> & {
  onSubmit(): void;
};

const renderComponent = (
  props?: Props,
): { component: tl.RenderResult; form: FormApi<FormValues> } => {
  const {
    mode = 'create',
    activeStep = 1,
    stepsAmount = 3,
    onStepChange = () => {},
    onSubmit = () => {},
  } = props ?? {};
  const form = createForm<FormValues>({ onSubmit });

  const component = tl.render(
    <Form form={form} onSubmit={() => {}}>
      {({ dirty }) => {
        return (
          <Footer
            mode={mode}
            isFormDirty={dirty}
            activeStep={activeStep}
            stepsAmount={stepsAmount}
            onStepChange={onStepChange}
            onCancel={() => {}}
          />
        );
      }}
    </Form>,
  );

  return {
    component,
    form,
  };
};

describe('Footer', () => {
  it('рендерит без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  describe('моды', function () {
    it('показывает контент для создания проекта', function () {});
    it('показывает контент для редактирования проекта', function () {});
  });

  describe('создание проекта', () => {
    describe('шаги', () => {
      it('увеличивает шаг ', () => {});
      it('уменьшает шаг ', () => {});
      it('показывает кнопку создания проекта, если шаг последний', () => {});
    });

    it('выключает кнопку создания, если есть ошибки в форме', function () {});
    it('тригерит обработчик отмены создания', function () {});
    it('меняет статус при сабмите', function () {});
  });

  describe('редактирование проекта', () => {
    it('тригерит обработчик отмены редактирования', function () {});
    it('происходит сабмит формы', function () {});
    it('выключает кнопку сохранения, если есть ошибки в форме', function () {});
  });
});
