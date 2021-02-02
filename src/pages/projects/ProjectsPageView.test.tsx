import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { merge } from 'ramda';

import { ProjectStatusEnum } from '../../__generated__/types';

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
};

function renderComponent(props?: Partial<ProjectsPageViewProps>): RenderResult {
  const withDefault = merge(defaultProps);
  const {
    isLoading,
    onFavorite,
    projects,
    counterProjects,
    onLoadMore,
    isLoadingMore,
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

    expect(func).toBeCalled();
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

      expect(loadButton).not.toBeInTheDocument();
    });
  });
});
