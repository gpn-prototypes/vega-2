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
