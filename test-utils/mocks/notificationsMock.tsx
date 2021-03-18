import { Notifications } from '../../types/notifications';

export const notificationsMock: Notifications = {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  add(props) {
    return 'string';
  },
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  remove(key) {},
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  subscribe(topic, payload) {
    return () => {};
  },
  getAll() {
    return [];
  },
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  on(action, payload) {
    return () => {};
  },
};
