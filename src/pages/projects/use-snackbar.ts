import * as React from 'react';
import { Item } from '@consta/uikit/SnackBar';

type State = Item[];
type Action = { type: 'add'; item: Item } | { type: 'remove'; key: number | string };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'add':
      return [...state, action.item];
    case 'remove':
      return state.filter((item) => item.key !== action.key);
    default:
      return state;
  }
}

export type useSnackbarHook = [
  State,
  {
    addItem: (payload: Item) => void;
    removeItem: (payload: number | string) => void;
  },
];

export function useSnackbar(): useSnackbarHook {
  const [items, dispatchItems] = React.useReducer(reducer, []);

  const addItem = (payload: Item): void => {
    dispatchItems({
      type: 'add',
      item: { onClose: () => dispatchItems({ type: 'remove', key: payload.key }), ...payload },
    });
  };

  const removeItem = (payload: number | string): void => {
    dispatchItems({ type: 'remove', key: payload });
  };

  return [items, { addItem, removeItem }];
}
