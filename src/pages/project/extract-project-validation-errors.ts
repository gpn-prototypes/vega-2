import { ValidationError } from '@/__generated__/types';

export function extractProjectValidationErrors(
  error: ValidationError,
): Record<string, string | undefined> {
  return (
    error.items?.reduce((acc: Record<string, string | undefined>, cur) => {
      const path = cur?.path ?? [];
      if (path.length === 2 && path[1]) {
        // for project path[0] is always 'data'
        acc[path[1]] = cur?.message || cur?.code;
      }
      return acc;
    }, {}) || {}
  );
}
