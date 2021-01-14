/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { Bus, MessageInput, QueueListener, QueueMessage, QueuePattern } from '../../../types/bus';

type ContextValues = Bus;

const noop = (): void => {};

const BusContext = React.createContext<ContextValues>({
  send(message: MessageInput) {},
  peek(pattern: QueuePattern) {},
  log(pattern: QueuePattern) {
    const res: QueueMessage[] = [];
    return res;
  },
  subscribe(pattern: QueuePattern, cb: QueueListener) {
    return noop;
  },
});

export const useBus = (): Bus => {
  return React.useContext(BusContext);
};

type BusProps = {
  bus?: Bus;
};

export const BusProvider: React.FC<BusProps> = ({ bus, children }) => {
  const value = bus || {
    send(message: MessageInput) {},
    subscribe(pattern: QueuePattern, cb: QueueListener) {
      return noop;
    },
    peek(pattern: QueuePattern) {},
    log(pattern: QueuePattern) {
      const res: QueueMessage[] = [];
      return res;
    },
  };

  return <BusContext.Provider value={value}>{children}</BusContext.Provider>;
};
