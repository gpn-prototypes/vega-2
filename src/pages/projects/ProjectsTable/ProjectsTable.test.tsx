import React from 'react';
import userEvent from '@testing-library/user-event';

import { ProjectStatusEnum } from '../../../__generated__/types';
import { render, RenderResult, screen, waitFor } from '../../../testing';

import { EditedAt } from './EditedAt';
import { ProjectsTable, ProjectsTableProps } from './ProjectsTable';

const noop = () => {};

const CELLS_NUMBER = 6;

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

  test('вызывается onFavorite', async () => {
    const func = jest.fn();
    renderComponent({
      onFavorite: func,
      rows: projectRowMock,
    });

    userEvent.click(screen.getAllByTestId(ProjectsTable.testId.favoriteNotSelectedButton)[0]);

    expect(func).toBeCalled();
  });

  it('не затемняет всю таблицу, если активный элемент был удалён', () => {
    const { rerender, container } = render(
      <ProjectsTable rows={projectRowMock} onFavorite={() => {}} />,
    );

    const rows = container.querySelectorAll('.Table-CellsRow');

    const buttonsEdit = screen.getAllByTestId(EditedAt.testId.buttonMenu);

    userEvent.click(buttonsEdit[0]);

    expect(rows[1].querySelectorAll('.Table-ContentCell_isDarkned').length).toBe(CELLS_NUMBER);

    rerender(<ProjectsTable rows={projectRowMock.slice(1)} onFavorite={() => {}} />);

    expect(rows[1].querySelectorAll('.Table-ContentCell_isDarkned').length).toBe(0);
  });

  test('при открытом меню, строка становится активной', () => {
    const func = jest.fn();
    const table = renderComponent({ onFavorite: func, rows: projectRowMock });

    userEvent.click(table.getAllByTestId(EditedAt.testId.buttonMenu)[0]);

    expect(table.container.querySelectorAll('.Table-ContentCell_isActive').length).toBe(
      CELLS_NUMBER,
    );

    userEvent.click(table.getAllByTestId(EditedAt.testId.buttonMenu)[0]);

    expect(table.container.querySelectorAll('.Table-ContentCell_isActive').length).toBe(0);
  });
});
