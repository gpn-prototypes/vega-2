import { APIClient } from '@vega/platform/api-client';

import { AuthResponse, Credentials } from './types';

export const login = (client: APIClient, data: Credentials): Promise<AuthResponse> =>
  client.request({ url: '/auth', method: 'post', data });

export const getCurrentUser = (client: APIClient): Promise<void> =>
  client.request({ url: '/krb-user', method: 'get', withAuth: true });
