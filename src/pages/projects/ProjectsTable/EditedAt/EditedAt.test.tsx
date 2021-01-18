import React from 'react';
import * as tl from '@testing-library/react';

import { EditedAt, EditedAtProps } from './EditedAt';

const noop = () => {};

function renderComponent(props: EditedAtProps): tl.RenderResult {
  const { isVisible, onMenuToggle = noop, date, menu } = props;
  return tl.render(
    <EditedAt isVisible={isVisible} onMenuToggle={onMenuToggle} date={date} menu={menu} />,
  );
}

const EditButton = ({ close, ...rest }: { close(): void }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
      {...rest}
    >
      элемент меню
    </button>
  );
};

const menu = [{ key: 'edit', Element: EditButton }];

describe('EditedAt', () => {
  test('рендерится без ошибок', () => {
    const func = jest.fn();
    const date = '2020-11-12T00:00:00';
    const component = renderComponent({ isVisible: false, onMenuToggle: func, date });

    expect(component.getByText(date)).toBeInTheDocument();
  });

  test('рендерится кнопка «меню»', () => {
    const func = jest.fn();
    const date = '2020-11-12T00:00:00';
    const component = renderComponent({ isVisible: true, onMenuToggle: func, date });

    expect(component.getByText(date)).toBeInTheDocument();
  });

  test('рендерится всплывающий блок', () => {
    const func = jest.fn();
    const date = '2020-11-12T00:00:00';
    const component = renderComponent({ isVisible: true, onMenuToggle: func, date, menu });

    tl.fireEvent.click(component.getByTestId(EditedAt.testId.buttonMenu));

    expect(component.getByTestId(EditedAt.testId.menuList)).toBeInTheDocument();
  });

  test('всплывающий блок закрывается при клике на пункт меню', () => {
    const func = jest.fn();
    const date = '2020-11-12T00:00:00';
    const component = renderComponent({ isVisible: true, onMenuToggle: func, date, menu });

    tl.fireEvent.click(component.getByTestId(EditedAt.testId.buttonMenu));

    const menuList = component.getByTestId(EditedAt.testId.menuList);

    expect(menuList).toBeInTheDocument();

    tl.fireEvent.click(component.getByTestId(`${EditedAt.testId.menuList}:edit`));

    expect(menuList).not.toBeInTheDocument();
  });

  test.skip('всплывающий блок закрывается при клике вне меню', () => {
    const func = jest.fn();
    const date = '2020-11-12T00:00:00';
    const component = renderComponent({ isVisible: true, onMenuToggle: func, date, menu });

    tl.fireEvent.click(component.getByTestId(EditedAt.testId.buttonMenu));

    const menuList = component.getByTestId(EditedAt.testId.menuList);

    expect(menuList).toBeInTheDocument();

    tl.fireEvent.click(component.getByTestId(EditedAt.testId.buttonMenu));

    expect(func).toBeCalled();
  });
});
