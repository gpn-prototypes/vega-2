import React from 'react';
import * as tl from '@testing-library/react';

import { PageLayout } from './PageLayout';

const testId = 'test-id';
function renderComponent(): tl.RenderResult {
  return tl.render(
    <PageLayout>
      <div data-testid={testId}>тело</div>
    </PageLayout>,
  );
}

describe('PageLayout', () => {
  test('рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  test('рендерится содержимое body', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId(testId)).toBeInTheDocument();
  });
});
