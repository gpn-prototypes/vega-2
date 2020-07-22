import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookie from 'universal-cookie';

export type ApiNoContent = void;

interface ApiContent<T> {
  data: T;
}

export type ApiSuccessResponse<T = ApiNoContent> = T extends ApiNoContent
  ? ApiNoContent
  : ApiContent<T>;

export type BaseUrlInterceptorParams = {
  baseUrl: string;
  apiUrl?: string;
  useProxy?: boolean;
};

export type HTTPClientParams = {
  urlParams: BaseUrlInterceptorParams;
  cookies: Cookie;
};

export type ConfigWithAuth = AxiosRequestConfig & {
  withAuth?: boolean;
};

export type ApiClientSuccess<T> = AxiosResponse<T>['data'];
