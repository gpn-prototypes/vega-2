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
  const { baseApiUrl, apiPath = '/', useApiProxy = false } = params;

  if (useApiProxy) {
    axiosConfig.baseURL = apiPath;
  } else {
    axiosConfig.baseURL = `${baseApiUrl}${apiPath}`;
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
  const { token, urlParams } = params;

  client.interceptors.request.use(authInterceptor(token));
  client.interceptors.request.use(baseUrlInterceptor(urlParams));

  return client;
};

export class HTTPClient {
  private client: AxiosInstance;

  private cookies: Cookie;

  public constructor(cookies: Cookie, urlParams: BaseUrlInterceptorParams) {
    this.cookies = cookies;
    this.client = createClient({ token: this.getToken(), urlParams });
  }

  public request<Response>(config: ConfigWithAuth): Promise<ApiClientSuccess<Response>> {
    return this.client(config)
      .then((response: AxiosResponse<Response>) => response.data)
      .catch((error: AxiosError) => {
        return Promise.reject(error);
      });
  }

  public setToken(token: string): void {
    this.cookies.set(COOKIES_KEYS.AUTH_TOKEN, token, { path: '/' });
  }

  public removeToken(): void {
    this.cookies.remove(COOKIES_KEYS.AUTH_TOKEN, { path: '/' });
  }

  public getToken(): string {
    return this.cookies.get(COOKIES_KEYS.AUTH_TOKEN);
  }
}
