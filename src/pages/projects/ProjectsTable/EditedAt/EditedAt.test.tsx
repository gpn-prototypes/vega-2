import React from 'react';
import * as tl from '@testing-library/react';

import { EditedAt, EditedAtProps } from './EditedAt';

const noop = () => {};

function renderComponent(props: EditedAtProps): tl.RenderResult {
  const { onMenuToggle = noop, date, menu } = props;
  return tl.render(<EditedAt onMenuToggle={onMenuToggle} date={date} menu={menu} />);
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

const date = {
  date: '12 ноября 2020',
  time: '3:00',
};

describe('EditedAt', () => {
  test('рендерится без ошибок', () => {
    const func = jest.fn();

    const component = renderComponent({ onMenuToggle: func, date });

    expect(component.getByText(date.date)).toBeInTheDocument();
  });

  test('рендерится кнопка «меню»', () => {
    const func = jest.fn();
    const component = renderComponent({ onMenuToggle: func, date });

    expect(component.getByText(date.date)).toBeInTheDocument();
  });

  test('рендерится всплывающий блок', () => {
    const func = jest.fn();
    const component = renderComponent({ onMenuToggle: func, date, menu });

    tl.fireEvent.click(component.getByTestId(EditedAt.testId.buttonMenu));

    expect(component.getByTestId(EditedAt.testId.menuList)).toBeInTheDocument();
  });

  test('всплывающий блок закрывается при клике на пункт меню', () => {
    const func = jest.fn();
    const component = renderComponent({ onMenuToggle: func, date, menu });

    tl.fireEvent.click(component.getByTestId(EditedAt.testId.buttonMenu));

    const menuList = component.getByTestId(EditedAt.testId.menuList);

    expect(menuList).toBeInTheDocument();

    tl.fireEvent.click(component.getByTestId(`${EditedAt.testId.menuList}:edit`));

    expect(menuList).not.toBeInTheDocument();
  });

  test.skip('всплывающий блок закрывается при клике вне меню', () => {
    const func = jest.fn();
    const component = renderComponent({ onMenuToggle: func, date, menu });

    tl.fireEvent.click(component.getByTestId(EditedAt.testId.buttonMenu));

    const menuList = component.getByTestId(EditedAt.testId.menuList);

    expect(menuList).toBeInTheDocument();

    tl.fireEvent.click(component.getByTestId(EditedAt.testId.buttonMenu));

    expect(func).toBeCalled();
  });
});
