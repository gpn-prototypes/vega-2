import { APIClient } from '@vega/platform/api-client';

import { AuthResponse, Credentials } from './types';

export const login = (client: APIClient, params: Credentials): Promise<AuthResponse> =>
  client.request({ url: '/krb', method: 'post', params });

export const getCurrentUser = (client: APIClient): Promise<void> =>
  client.request({ url: '/krb-user', method: 'get', withAuth: true });
