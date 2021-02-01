import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EditedAt, EditedAtProps } from './EditedAt';

const noop = () => {};

function renderComponent(props: EditedAtProps): RenderResult {
  const { onMenuToggle = noop, date, menu } = props;
  return render(<EditedAt onMenuToggle={onMenuToggle} date={date} menu={menu} />);
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

    renderComponent({ onMenuToggle: func, date });

    expect(screen.getByText(date.date)).toBeVisible();
  });

  test('рендерится кнопка «меню»', () => {
    const func = jest.fn();
    renderComponent({ onMenuToggle: func, date });

    expect(screen.getByText(date.date)).toBeVisible();
  });

  test('рендерится всплывающий блок', () => {
    const func = jest.fn();
    renderComponent({ onMenuToggle: func, date, menu });

    userEvent.click(screen.getByTestId(EditedAt.testId.buttonMenu));

    expect(screen.getByTestId(EditedAt.testId.menuList)).toBeVisible();
  });

  test('всплывающий блок закрывается при клике на пункт меню', () => {
    const func = jest.fn();
    renderComponent({ onMenuToggle: func, date, menu });

    userEvent.click(screen.getByTestId(EditedAt.testId.buttonMenu));

    const menuList = screen.getByTestId(EditedAt.testId.menuList);

    expect(menuList).toBeVisible();

    userEvent.click(screen.getByTestId(`${EditedAt.testId.menuList}:edit`));

    expect(menuList).not.toBeInTheDocument();
  });

  test('всплывающий блок закрывается при клике вне меню', () => {
    const func = jest.fn();
    renderComponent({ onMenuToggle: func, date, menu });

    userEvent.click(screen.getByTestId(EditedAt.testId.buttonMenu));

    const menuList = screen.getByTestId(EditedAt.testId.menuList);

    expect(menuList).toBeVisible();

    userEvent.click(screen.getByText(date.date));

    expect(func).toBeCalled();
  });
});
