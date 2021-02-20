import { SnackBarItem } from '../types/notifications';

type Topics = 'change';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (payload: any) => void;

type Handlers = Map<Topics, Set<Callback>>;

interface Unsubscribe {
  (): void;
}

type Props = {
  addMock(arg: SnackBarItem): void;
  removeMock(key: string | number): void;
};

export class MockNotifications {
  private items: SnackBarItem[];

  private handlers: Handlers;

  private addMock: (arg: SnackBarItem) => void;

  private removeMock: (key: string | number) => void;

  constructor({ addMock, removeMock }: Props) {
    this.items = [];
    this.handlers = new Map();
    this.addMock = addMock;
    this.removeMock = removeMock;
  }

  public getAll(): SnackBarItem[] {
    return this.items;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private publish(topic: Topics, payload: any): void {
    if (!this.handlers.has(topic)) return;
    const handlers = this.handlers.get(topic);

    if (handlers) {
      handlers.forEach((cb) => cb(payload));
    }
  }

  public subscribe(topic: Topics, cb: Callback): Unsubscribe {
    const set = this.handlers.get(topic) ?? new Set();
    set.add(cb);

    this.handlers.set(topic, set);

    return (): void => {
      set.delete(cb);
    };
  }

  public add(item: SnackBarItem): void {
    this.addMock(item);

    this.items = [...this.items, item];

    this.publish('change', { items: this.items });
  }

  public find(key: string | number): SnackBarItem | undefined {
    return this.items.find((item) => item.key === key);
  }

  public remove(key: string | number): void {
    this.removeMock(key);
    this.items = this.items.filter((item) => item.key !== key);

    this.publish('change', { items: this.items });
  }
}
