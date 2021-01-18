import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as tl from '@testing-library/react';

import { ProjectsPageView, ProjectsPageViewProps } from './ProjectsPageView';

const noop = () => {};

function renderComponent(props: ProjectsPageViewProps): tl.RenderResult {
  const { isLoading = false, onFavorite = noop, projects = [] } = props;
  return tl.render(
    <Router>
      <ProjectsPageView projects={projects} isLoading={isLoading} onFavorite={onFavorite} />
    </Router>,
  );
}

describe('ProjectsPage', () => {
  test.skip('рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  test('отображается индикатор загрузки', () => {
    const component = renderComponent({ isLoading: true, onFavorite: noop, projects: [] });
    const loader = component.getByTestId(ProjectsPageView.testId.loader);
    expect(loader).toBeInTheDocument();
    expect(component.queryByTestId(ProjectsPageView.testId.table)).toBeNull();
  });
});
