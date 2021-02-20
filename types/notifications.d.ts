import { SnackBarProps } from '@gpn-prototypes/vega-ui/dist/components/snack-bar/SnackBar';

export interface Unsubscribe {
  (): void;
}

export type SnackBarItem = Pick<SnackBarProps, 'items'>['items'][number];

export declare type Notifications = {
  add(item: SnackBarItem): void;
  remove(key: string | number): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(topic: string, payload: any): Unsubscribe;
  getAll(): SnackBarItem[];
};
