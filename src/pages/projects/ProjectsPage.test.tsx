import React from 'react';
import * as tl from '@testing-library/react';

import { ProjectsPage } from './ProjectsPage';

function renderComponent(): tl.RenderResult {
  return tl.render(<ProjectsPage />);
}

describe('ProjectsPage', () => {
  test('рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });
});
