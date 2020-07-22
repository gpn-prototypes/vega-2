import { HTTPClient } from '@vega/platform/http-client';

import { AuthData, AuthResponse } from './types';

export const login = (client: HTTPClient, data: AuthData): Promise<AuthResponse> =>
  client.request({ url: '/auth', method: 'post', data });
