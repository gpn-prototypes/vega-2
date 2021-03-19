/* eslint-disable class-methods-use-this */
import fetch from 'cross-fetch';

import '@testing-library/jest-dom';

import { cleanup } from './src/testing';
import { AppConfig } from './app-config';

declare global {
  interface Window {
    appConfig: AppConfig;
  }
}

global.window.appConfig = {
  projectName: 'settlement-platform',
  root: '',
  entry: '',
  buildDirPath: '',
  mode: 'development',
  env: 'testing',
  baseApiUrl: '',
  useApiProxy: false,
  apiPath: '',
  assetsPath: '',
  port: 3000,
  apiURL: '',
};

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    // eslint-disable-next-line class-methods-use-this
    observe(): void {}

    // eslint-disable-next-line class-methods-use-this
    unobserve(): void {}

    // eslint-disable-next-line class-methods-use-this
    disconnect(): void {}
  };
});

afterAll(() => {
  delete global.ResizeObserver;
});

afterEach(cleanup);

global.fetch = fetch;
