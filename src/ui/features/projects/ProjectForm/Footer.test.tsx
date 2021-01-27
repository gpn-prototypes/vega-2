import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { merge } from 'ramda';

import { Footer, FooterProps } from './Footer';

const defaultProps: FooterProps = {
  mode: 'create',
  activeStep: 0,
  stepsAmount: 3,
  isVisibleEdit: false,
  onStepChange: () => {},
  onCancel: () => {},
  onCreate: () => {},
};

const renderComponent = (props?: Partial<FooterProps>): RenderResult => {
  const withDefaults = merge(defaultProps);
  const { mode, activeStep, stepsAmount, onStepChange, onCreate, onCancel, isVisibleEdit } = props
    ? withDefaults(props)
    : defaultProps;

  return render(
    <Footer
      onCreate={onCreate}
      mode={mode}
      isVisibleEdit={isVisibleEdit}
      activeStep={activeStep}
      stepsAmount={stepsAmount}
      onStepChange={onStepChange}
      onCancel={onCancel}
    />,
  );
};

describe('Footer', () => {
  it('рендерит без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  describe('моды', () => {
    it('показывает футер для создания проекта', () => {
      renderComponent();

      const buttons = screen.getAllByRole('button');

      const [cancel, next] = buttons;

      expect(buttons.length).toEqual(2);
      expect(cancel.textContent).toEqual('Отмена');
      expect(next.textContent).toEqual('Далее');
    });

    it('показывает футер для редактирования проекта', () => {
      const { rerender } = renderComponent({ mode: 'edit', isVisibleEdit: true });

      const buttons = screen.getAllByRole('button');

      const [cancel, save] = buttons;

      expect(buttons.length).toEqual(2);
      expect(cancel.textContent).toEqual('Отменить');
      expect(save.textContent).toEqual('Сохранить изменения');

      rerender(<Footer {...defaultProps} mode="edit" isVisibleEdit={false} />);

      expect(screen.queryAllByRole('button').length).toEqual(0);
    });

    it('не показывает футер для редактирования проекта, если isVisibleEdit=false', () => {
      renderComponent({ mode: 'edit', isVisibleEdit: false });

      const buttons = screen.queryAllByRole('button');

      expect(buttons.length).toEqual(0);
    });
  });

  describe('создание проекта', () => {
    describe('шаги', () => {
      it('увеличивает шаг ', () => {
        const onStepChange = jest.fn();

        renderComponent({ onStepChange });

        const [, next] = screen.getAllByRole('button');

        userEvent.click(next);

        expect(onStepChange).toBeCalledTimes(1);
        expect(onStepChange).toHaveBeenCalledWith(1);
      });

      it('уменьшает шаг ', () => {
        const onStepChange = jest.fn();

        renderComponent({
          activeStep: 2,
          onStepChange,
        });

        const [, prev] = screen.getAllByRole('button');

        userEvent.click(prev);

        expect(onStepChange).toBeCalledTimes(1);
        expect(onStepChange).toHaveBeenCalledWith(1);
      });

      it('показывает кнопку создания проекта, если шаг последний', () => {
        renderComponent({
          activeStep: 2,
        });

        const [, create] = screen.getAllByRole('button');

        expect(create).toBeInTheDocument();
      });
    });

    it('вызывает обработчик onCancel', () => {
      const onCancel = jest.fn();

      renderComponent({
        activeStep: 1,
        onCancel,
      });

      const [cancel] = screen.getAllByRole('button');

      userEvent.click(cancel);

      expect(onCancel).toBeCalled();
    });

    it('вызывает обработчик onCreate', () => {
      const onCreate = jest.fn();

      renderComponent({
        activeStep: 2,
        onCreate,
      });

      const [, , create] = screen.getAllByRole('button');

      userEvent.click(create);

      expect(onCreate).toBeCalled();
    });
  });

  describe('редактирование проекта', () => {
    it('вызывает обработчик onCancel', () => {
      const onCancel = jest.fn();

      renderComponent({
        mode: 'edit',
        activeStep: 2,
        onCancel,
        isVisibleEdit: true,
      });

      const [cancel] = screen.getAllByRole('button');

      userEvent.click(cancel);

      expect(onCancel).toBeCalled();
    });
  });
});
