/* eslint-disable class-methods-use-this */
import '@testing-library/jest-dom';

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
  // @ts-expect-error: TODO https://github.com/gpn-prototypes/vega-ui/blob/e9b832cde379550166dcce920c3a1587a1922469/setup-tests.tsx
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
  // @ts-expect-error: TODO https://github.com/gpn-prototypes/vega-ui/blob/e9b832cde379550166dcce920c3a1587a1922469/setup-tests.tsx
  delete global.ResizeObserver;
});
