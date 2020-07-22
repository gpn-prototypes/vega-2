import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type ApiNoContent = void;

interface ApiContent<T> {
  data: T;
}

export type ApiSuccessResponse<T = ApiNoContent> = T extends ApiNoContent
  ? ApiNoContent
  : ApiContent<T>;

export type BaseUrlInterceptorParams = {
  baseApiUrl: string;
  apiPath?: string;
  useApiProxy?: boolean;
};

export type HTTPClientParams = {
  urlParams: BaseUrlInterceptorParams;
  token: string;
};

export type ConfigWithAuth = AxiosRequestConfig & {
  withAuth?: boolean;
};

export type ApiClientSuccess<T> = AxiosResponse<T>['data'];
