import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookie from 'universal-cookie';

import { COOKIES_KEYS } from '../cookies';

import {
  ApiClientSuccess,
  BaseUrlInterceptorParams,
  ConfigWithAuth,
  HTTPClientParams,
} from './types';

const baseUrlInterceptor = (params: BaseUrlInterceptorParams) => (
  config: ConfigWithAuth,
): AxiosRequestConfig => {
  const axiosConfig = { ...config };
  const { baseUrl, apiUrl = '/', useProxy = false } = params;

  if (useProxy) {
    axiosConfig.baseURL = apiUrl;
  } else {
    axiosConfig.baseURL = `${baseUrl}${apiUrl}`;
  }

  return axiosConfig;
};

const authInterceptor = (token?: string) => (config: ConfigWithAuth): ConfigWithAuth => {
  const baseHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const axiosConfig = { ...config };

  const headers = { ...config.headers, ...baseHeaders };

  axiosConfig.headers = headers;

  if (axiosConfig.withAuth && token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  }

  return axiosConfig;
};

export const createClient = (params: HTTPClientParams): AxiosInstance => {
  const client = axios.create();
  const { cookies } = params;

  client.interceptors.request.use(authInterceptor(cookies.get(COOKIES_KEYS.AUTH_TOKEN)));
  client.interceptors.request.use(baseUrlInterceptor(params.urlParams));

  return client;
};

export class HTTPClient {
  private client: AxiosInstance;

  private cookies: Cookie;

  public constructor(cookies: Cookie, urlParams: BaseUrlInterceptorParams) {
    this.client = createClient({ cookies, urlParams });
    this.cookies = cookies;
  }

  public request<Response>(config: ConfigWithAuth): Promise<ApiClientSuccess<Response>> {
    return this.client(config)
      .then((response: AxiosResponse<Response>) => response.data)
      .catch((error: AxiosError) => {
        throw error.response;
      });
  }

  public setToken(token: string): void {
    this.cookies.set(COOKIES_KEYS.AUTH_TOKEN, token, { path: '/' });
  }

  public removeToken(): void {
    this.cookies.remove(COOKIES_KEYS.AUTH_TOKEN, { path: '/' });
  }
}
