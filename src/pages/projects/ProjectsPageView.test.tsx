import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as tl from '@testing-library/react';

import { ProjectsPageView } from './ProjectsPageView';

function renderComponent(): tl.RenderResult {
  return tl.render(
    <Router>
      <ProjectsPageView projects={[]} isLoading={false} />
    </Router>,
  );
}

describe('ProjectsPage', () => {
  test('рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });
});
