import { HTTPClient } from '@vega/platform/http-client';

import { AuthData, AuthResponse } from './types';

export const login = (client: HTTPClient, data: AuthData): Promise<AuthResponse> =>
  client.request({ url: '/auth', method: 'post', data });

export const getCurrentUser = (client: HTTPClient): Promise<void> =>
  client.request({ url: '/krb-user', method: 'get', withAuth: true });
