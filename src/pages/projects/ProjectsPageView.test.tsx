import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as tl from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectStatusEnum } from '../../__generated__/types';

import { ProjectsPageView, ProjectsPageViewProps } from './ProjectsPageView';
import { ProjectsTable } from './ProjectsTable';

const noop = () => {};

function renderComponent(props: ProjectsPageViewProps): tl.RenderResult {
  const { isLoading = false, onFavorite, projects = [] } = props;
  return tl.render(
    <Router>
      <ProjectsPageView projects={projects} isLoading={isLoading} onFavorite={onFavorite} />
    </Router>,
  );
}

const projectRowMock = [
  {
    id: 'id-0',
    isFavorite: false,
    name: 'name 1',
    version: 0,
    status: ProjectStatusEnum.Unpublished,
  },
];

describe('ProjectsPageView', () => {
  test('рендерится без ошибок', () => {
    const component = renderComponent({ isLoading: false, onFavorite: noop, projects: [] });
    expect(component.getByText('Название')).toBeVisible();
  });

  test('отображается индикатор загрузки', () => {
    const component = renderComponent({ isLoading: true, onFavorite: noop, projects: [] });
    const loader = component.getByTestId(ProjectsPageView.testId.loader);
    expect(loader).toBeVisible();
    expect(component.queryByTestId(ProjectsPageView.testId.table)).not.toBeInTheDocument();
  });

  test('срабатывает функция для добавления в избранное', () => {
    const func = jest.fn();
    const pageView = renderComponent({
      isLoading: false,
      onFavorite: func,
      projects: projectRowMock,
    });

    userEvent.hover(pageView.getByText(projectRowMock[0].name));
    tl.fireEvent.click(pageView.getByTestId(ProjectsTable.testId.favoriteNotSelectedButton));

    expect(func).toBeCalledTimes(1);
  });
});
