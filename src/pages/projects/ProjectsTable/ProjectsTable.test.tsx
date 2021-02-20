import React from 'react';
import { render, RenderResult, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectStatusEnum } from '../../../__generated__/types';

import { EditedAt } from './EditedAt';
import { ProjectsTable, ProjectsTableProps } from './ProjectsTable';

const noop = () => {};

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

function renderComponent(props: ProjectsTableProps): RenderResult {
  const { placeholder, onFavorite = noop, rows = [] } = props;
  return render(
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
    renderComponent({ onFavorite: func });

    expect(screen.getByText('Пока нет ни одного проекта :(')).toBeInTheDocument();
  });

  test('рендерится строка placeholder', () => {
    const func = jest.fn();
    const placeholder = 'Нет данных';
    renderComponent({ onFavorite: func, placeholder });

    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  test('рендерится компонент placeholder', () => {
    const func = jest.fn();
    const placeholder = <div data-testid="placeholder">Нет данных</div>;
    renderComponent({ onFavorite: func, placeholder });

    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });

  test('рендерится строка с данными', () => {
    const func = jest.fn();
    renderComponent({ onFavorite: func, rows: projectRowMock });

    expect(screen.getByText(projectRowMock[0].name)).toBeInTheDocument();
  });

  test('добавляется аттрибут title для названия строки', () => {
    const func = jest.fn();
    const name = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.';
    renderComponent({
      onFavorite: func,
      rows: [{ ...projectRowMock[0], name }],
    });

    expect(screen.getByTitle(name)).toBeInTheDocument();
  });

  test('рендерится описание проекта', () => {
    const func = jest.fn();
    const description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.';
    renderComponent({
      onFavorite: func,
      rows: [{ ...projectRowMock[0], description }],
    });

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  test('отображается кнопка «избранное»', () => {
    const func = jest.fn();
    renderComponent({ onFavorite: func, rows: projectRowMock });

    userEvent.hover(screen.getByText(projectRowMock[0].name));

    waitFor(() => {
      expect(
        screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0],
      ).toBeVisible();
    });
  });

  test('отображается кнопка «избранное» в активном состоянии', () => {
    const func = jest.fn();
    renderComponent({
      onFavorite: func,
      rows: [{ ...projectRowMock[0], isFavorite: true }],
    });

    userEvent.hover(screen.getByText(projectRowMock[0].name));

    expect(screen.getByTestId(ProjectsTable.testId.favoriteSelectedButton)).toBeVisible();
  });

  test('вызывается onFavorite', () => {
    const func = jest.fn();
    renderComponent({
      onFavorite: func,
      rows: projectRowMock,
    });

    userEvent.click(screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0]);

    waitFor(() => {
      expect(func).toBeCalled();
    });
  });

  test('отображается кнопка «меню»', () => {
    const func = jest.fn();
    renderComponent({ onFavorite: func, rows: projectRowMock });

    waitFor(() => {
      expect(screen.getAllByTestId(EditedAt.testId.buttonMenu)[0]).not.toBeVisible();
    });

    userEvent.hover(screen.getByText(projectRowMock[0].name));

    waitFor(() => {
      expect(screen.getAllByTestId(EditedAt.testId.buttonMenu)[0]).toBeVisible();
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
