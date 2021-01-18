/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { Bus } from '../../../types/bus';

type ContextValues = Bus | null;

const BusContext = React.createContext<ContextValues>(null);

export const useBus = (): Bus => {
  const ctx = React.useContext(BusContext);

  if (ctx === null) {
    throw new Error('Отсутствует context, проверьте BusProvider');
  }

  return ctx;
};

type BusProps = {
  bus: Bus;
};

export const BusProvider: React.FC<BusProps> = ({ bus, children }) => {
  return <BusContext.Provider value={bus}>{children}</BusContext.Provider>;
};
