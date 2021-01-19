import React from 'react';
import * as tl from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectStatusEnum } from '../../../__generated__/types';

import { EditedAt } from './EditedAt';
import { ProjectsTable, ProjectsTableProps } from './ProjectsTable';

const noop = () => {};

// const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
//   window.history.pushState({}, 'Test page', route);

//   return tl.render(ui, { wrapper: BrowserRouter });
// };

const projectRowMock = [
  {
    id: 'id-0',
    isFavorite: false,
    name: 'name 1',
    version: 0,
    status: ProjectStatusEnum.Unpublished,
  },
  {
    id: 'id-1',
    isFavorite: false,
    name: 'name 2',
    version: 0,
    status: ProjectStatusEnum.Unpublished,
  },
];

function renderComponent(props: ProjectsTableProps): tl.RenderResult {
  const { placeholder, onFavorite = noop, rows = [] } = props;
  return tl.render(
    <>
      <ProjectsTable rows={rows} placeholder={placeholder} onFavorite={onFavorite} />
    </>,
  );
}

describe('ProjectsTable', () => {
  test('рендерится без ошибок', () => {
    const func = jest.fn();

    expect(renderComponent({ onFavorite: func }).getByText('Регион')).toBeInTheDocument();
  });

  test('рендерится placeholder по умолчанию', () => {
    const func = jest.fn();
    const table = renderComponent({ onFavorite: func });

    expect(table.getByText('Пока нет ни одного проекта :(')).toBeInTheDocument();
  });

  test('рендерится строка placeholder', () => {
    const func = jest.fn();
    const placeholder = 'Нет данных';
    const table = renderComponent({ onFavorite: func, placeholder });

    expect(table.getByText(placeholder)).toBeInTheDocument();
  });

  test('рендерится компонент placeholder', () => {
    const func = jest.fn();
    const placeholder = <div data-testid="placeholder">Нет данных</div>;
    const table = renderComponent({ onFavorite: func, placeholder });

    expect(table.getByTestId('placeholder')).toBeInTheDocument();
  });

  test('рендерится строка с данными', () => {
    const func = jest.fn();
    const table = renderComponent({ onFavorite: func, rows: projectRowMock });

    expect(table.getByText(projectRowMock[0].name)).toBeInTheDocument();
  });

  test('добавляется аттрибут title для названия строки', () => {
    const func = jest.fn();
    const name = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.';
    const table = renderComponent({
      onFavorite: func,
      rows: [{ ...projectRowMock[0], name }],
    });

    expect(table.getByTitle(name)).toBeInTheDocument();
  });

  test('рендерится описание проекта', () => {
    const func = jest.fn();
    const description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.';
    const table = renderComponent({
      onFavorite: func,
      rows: [{ ...projectRowMock[0], description }],
    });

    expect(table.getByText(description)).toBeInTheDocument();
  });

  test('отображается кнопка «избранное»', () => {
    const func = jest.fn();
    renderComponent({ onFavorite: func, rows: projectRowMock });

    userEvent.hover(tl.screen.getByText(projectRowMock[0].name));

    tl.waitFor(() => {
      expect(
        tl.screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0],
      ).toBeVisible();
    });
  });

  test('отображается кнопка «избранное» в активном состоянии', () => {
    const func = jest.fn();
    renderComponent({
      onFavorite: func,
      rows: [{ ...projectRowMock[0], isFavorite: true }],
    });

    userEvent.hover(tl.screen.getByText(projectRowMock[0].name));

    expect(tl.screen.getByTestId(ProjectsTable.testId.favoriteSelectedButton)).toBeVisible();
  });

  test('вызывается onFavorite', () => {
    const func = jest.fn();
    renderComponent({
      onFavorite: func,
      rows: projectRowMock,
    });

    userEvent.click(tl.screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0]);

    tl.waitFor(() => {
      expect(func).toBeCalled();
    });
  });

  test('отображается кнопка «меню»', () => {
    const func = jest.fn();
    renderComponent({ onFavorite: func, rows: projectRowMock });

    tl.waitFor(() => {
      expect(tl.screen.getAllByTestId(EditedAt.testId.buttonMenu)[0]).not.toBeVisible();
    });

    userEvent.hover(tl.screen.getByText(projectRowMock[0].name));

    tl.waitFor(() => {
      expect(tl.screen.getAllByTestId(EditedAt.testId.buttonMenu)[0]).toBeVisible();
    });
  });

  test('при открытом меню, строка становится активной', () => {
    const func = jest.fn();
    const table = renderComponent({ onFavorite: func, rows: projectRowMock });

    userEvent.click(table.getAllByTestId(EditedAt.testId.buttonMenu)[0]);

    expect(table.container.querySelectorAll('.Table-ContentCell_isActive').length).toBe(6);

    userEvent.click(table.getAllByTestId(EditedAt.testId.buttonMenu)[0]);

    expect(table.container.querySelectorAll('.Table-ContentCell_isActive').length).toBe(0);
  });
});
