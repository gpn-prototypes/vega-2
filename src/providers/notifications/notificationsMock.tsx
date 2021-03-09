import { Notifications } from '../../../types/notifications';

export const notificationsMock: Notifications = {
  add(props) {
    return 'string';
  },
  remove(key) {},
  subscribe(topic, payload) {
    return () => {};
  },
  getAll() {
    return [];
  },
  on(action, payload) {
    return () => {};
  },
};
