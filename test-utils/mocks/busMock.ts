import { Bus } from '../../types/bus';

export const busMock: Bus = {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  send: (message) => {},
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  subscribe: (pattern, cb) => {
    return () => {};
  },
};
