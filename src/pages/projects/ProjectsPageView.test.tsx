import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { merge } from 'ramda';

import { ProjectStatusEnum } from '../../__generated__/types';
import { fireEvent, render, RenderResult, screen, waitFor } from '../../testing';

import { ProjectsPageView, ProjectsPageViewProps } from './ProjectsPageView';
import { ProjectsTable } from './ProjectsTable';

const noop = () => {};

const projectRowMock = [
  {
    id: 'id-0',
    isFavorite: false,
    name: 'name 1',
    version: 0,
    status: ProjectStatusEnum.Unpublished,
  },
];

const defaultProps: ProjectsPageViewProps = {
  isLoading: false,
  isLoadingMore: false,
  counterProjects: { current: 20, total: 100 },
  projects: projectRowMock,
  onFavorite: noop,
  onLoadMore: noop,
  onSort: noop,
  searchString: '',
  setSearchString: noop,
};

function renderComponent(props?: Partial<ProjectsPageViewProps>): RenderResult {
  const withDefault = merge(defaultProps);
  const {
    isLoading,
    onFavorite,
    onSort,
    projects,
    counterProjects,
    onLoadMore,
    isLoadingMore,
    searchString,
    setSearchString,
  } = withDefault(props ?? {});
  return render(
    <Router>
      <ProjectsPageView
        projects={projects}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        counterProjects={counterProjects}
        onFavorite={onFavorite}
        onLoadMore={onLoadMore}
        onSort={onSort}
        searchString={searchString}
        setSearchString={setSearchString}
      />
    </Router>,
  );
}

describe('ProjectsPageView', () => {
  test('рендерится без ошибок', () => {
    const component = renderComponent();
    expect(component.getByText('Название')).toBeVisible();
  });

  test('отображается индикатор загрузки', () => {
    const component = renderComponent({ isLoading: true });
    const loader = component.getByTestId(ProjectsPageView.testId.loader);

    expect(loader).toBeVisible();
    expect(component.queryByTestId(ProjectsPageView.testId.table)).not.toBeInTheDocument();
  });

  test('срабатывает функция для добавления в избранное', () => {
    const func = jest.fn();
    renderComponent({
      onFavorite: func,
    });

    userEvent.hover(screen.getByText(projectRowMock[0].name));
    userEvent.click(screen.getByTestId(ProjectsTable.testId.favoriteNotSelectedButton));

    expect(func).toBeCalledTimes(1);
  });

  describe('пагинация', () => {
    it('выводит счётчики проектов', () => {
      renderComponent({ counterProjects: { current: 40, total: 201 } });
      expect(screen.getByText('40 из 201')).toBeInTheDocument();
    });

    it('срабатывает обработчик загрузки проектов', () => {
      const onLoadMore = jest.fn();
      renderComponent({ onLoadMore });

      const loadButton = screen.getByText('Загрузить ещё');
      userEvent.click(loadButton);

      expect(onLoadMore).toBeCalled();
    });

    it('показывает кнопку загрузки, если есть проекты', () => {
      renderComponent({ counterProjects: { current: 40, total: 99 } });
      const loadButton = screen.getByText('Загрузить ещё');

      expect(loadButton).toBeInTheDocument();
    });

    it('не показывает кнопку, если показаны все проекты', () => {
      renderComponent({ counterProjects: { current: 100, total: 100 } });
      const loadButton = screen.queryByText('Загрузить ещё');

      waitFor(() => expect(loadButton).toBeNull());
    });
  });

  describe('Строка поиска', () => {
    it('Отображает строку поиска с нужными данными', () => {
      const mockSearchString = 'mocked';
      renderComponent({ searchString: mockSearchString });
      const searchInput = screen.queryByPlaceholderText('Введите название проекта или имя автора');

      expect(searchInput).toHaveValue(mockSearchString);
    });

    it('Если в строке поиска меньше 3 букв показывает предупреждение', () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('Введите название проекта или имя автора');
      userEvent.type(searchInput, 'wa');

      expect(screen.queryByText('Введите хотя бы 3 символа для поиска')).toBeVisible();

      userEvent.type(searchInput, 'aaaaargh');

      waitFor(() => expect(screen.queryByText('Введите хотя бы 3 символа для поиска')).toBeNull());
    });

    it('вызывает setSearchString', () => {
      const mockSetSearchString = jest.fn();
      const mockedSearchString = 'mockedSearch';
      renderComponent({ setSearchString: mockSetSearchString });

      const searchInput = screen.getByPlaceholderText('Введите название проекта или имя автора');
      userEvent.type(searchInput, mockedSearchString);

      waitFor(() => expect(mockSetSearchString).toBeCalledWith(mockedSearchString));
    });

    it('После onBlur предупреждение не показывается', () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('Введите название проекта или имя автора');
      userEvent.type(searchInput, 'wa');
      userEvent.type(searchInput, '');

      waitFor(() =>
        expect(screen.queryByText('Введите хотя бы 3 символа для поиска')).toBeVisible(),
      );

      fireEvent.blur(searchInput);

      waitFor(() => expect(screen.queryByText('Введите хотя бы 3 символа для поиска')).toBeNull());
    });
  });
});
