import React from 'react';
import * as tl from '@testing-library/react';

import { Layout } from './Layout';

const testId = 'test-id';
function renderComponent(): tl.RenderResult {
  return tl.render(
    <Layout>
      <div data-testid={testId}>тело</div>
    </Layout>,
  );
}

describe('Layout', () => {
  test('рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  test('рендерится содержимое body', async () => {
    const component = await renderComponent().findByTestId(testId);
    expect(component).toBeInTheDocument();
  });
});
