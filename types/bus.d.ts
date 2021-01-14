// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Message<P = any> {
  channel: string;
  topic: string;
  payload?: P;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageInput<P = any> = Message<P> & Partial<MessageParams>;

export interface Unsubscribe {
  (): void;
}

interface MessageParams {
  self: boolean;
  broadcast: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface QueueMessage<P = any> {
  payload: P;
  params: MessageParams;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface QueueListener<P = any> {
  (message: QueueMessage<P>): void;
}

export interface QueuePattern {
  channel: string;
  topic: string;
}

export declare type Bus = {
  send(message: MessageInput): void;
  peek(pattern: QueuePattern): QueueMessage | void;
  log(pattern: QueuePattern): QueueMessage[];
  subscribe<P>(pattern: QueuePattern, cb: QueueListener<P>): VoidFunction;
};
