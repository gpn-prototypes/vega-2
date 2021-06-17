import { act } from '@testing-library/react';

export async function waitRequests(amount = 100): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, amount));
  });
}
