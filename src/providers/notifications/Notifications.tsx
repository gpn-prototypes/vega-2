/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { Notifications, Unsubscribe } from '../../../types/notifications';

const noop = (): void => {};
const subscribe = (): Unsubscribe => {
  return (): void => {};
};

type ContextValues = Notifications;

const NotificationsContext = React.createContext<ContextValues>({
  add: noop,
  remove: noop,
  subscribe,
});

type NotificationsProps = {
  notifications?: Notifications;
};

export const useNotifications = (): Notifications => {
  return React.useContext(NotificationsContext);
};

export const NotificationsProvider: React.FC<NotificationsProps> = ({
  notifications,
  children,
}) => {
  const value: ContextValues = {
    add: (item) => {
      if (notifications?.add) {
        notifications.add(item);
      }
    },
    remove: (key) => {
      if (notifications?.remove) {
        notifications.remove(key);
      }
    },
    subscribe: (topic, payload) => {
      if (notifications?.subscribe) {
        return notifications.subscribe(topic, payload);
      }
      return subscribe;
    },
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};
