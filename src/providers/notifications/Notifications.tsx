/* istanbul ignore file */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { Notifications } from '../../../types/notifications';

type ContextValues = Notifications | null;

const NotificationsContext = React.createContext<ContextValues>(null);

type NotificationsProps = {
  notifications: Notifications;
};

export const useNotifications = (): Notifications => {
  const notifications = React.useContext(NotificationsContext);

  if (notifications === null) {
    throw new Error('useNotifications called outside from NotificationsProvider');
  }

  return notifications;
};

export const NotificationsProvider: React.FC<NotificationsProps> = ({
  notifications,
  children,
}) => {
  return (
    <NotificationsContext.Provider value={notifications}>{children}</NotificationsContext.Provider>
  );
};
