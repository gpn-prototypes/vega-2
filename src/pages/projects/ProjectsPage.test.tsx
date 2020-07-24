import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as tl from '@testing-library/react';

import { ProjectsPage } from './ProjectsPage';

function renderComponent(): tl.RenderResult {
  return tl.render(
    <Router>
      <ProjectsPage />
    </Router>,
  );
}

describe('ProjectsPage', () => {
  test('рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });
});
