import { Item } from '@consta/uikit/SnackBar';

export interface Unsubscribe {
  (): void;
}

export declare type Notifications = {
  add(item: Item): void;
  remove(key: string | number): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(topic: string, payload: any): Unsubscribe;
};
