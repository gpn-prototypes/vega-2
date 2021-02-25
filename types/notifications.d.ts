/* eslint-disable @typescript-eslint/no-explicit-any */
export type View = 'normal' | 'system' | 'success' | 'warning' | 'alert';

export type OnCloseAction = { action: string; payload: any };

export type NotificationProps = {
  id: string;
  body: string;
  view?: View;
  closable?: boolean;
  shared?: boolean;
  actions?: Action[];
  onCloseAction?: OnCloseAction;
  icon?: string;
  withShowMore?: boolean;
  truncatedLength?: number;
  autoClose?: number;
};

export interface Unsubscribe {
  (): void;
}

export declare type Notifications = {
  add(item: { id?: string } & Omit<NotificationProps, 'id'>): void;
  remove(key: string): void;
  subscribe(topic: string, payload: any): Unsubscribe;
  getAll(): any[];
  on(action: string, payload: any): Unsubscribe;
};
