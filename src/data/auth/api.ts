import { HTTPClient } from '@vega/platform/http-client';

import { AuthData, AuthResponse } from './types';

export const login = (client: HTTPClient, params: AuthData): Promise<AuthResponse> =>
  client.request({ url: '/auth', method: 'get', params });
