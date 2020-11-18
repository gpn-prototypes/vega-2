import * as React from 'react';
import { Item } from '@consta/uikit/SnackBar';
import { SnackBar, usePortal, usePortalRender } from '@gpn-prototypes/vega-ui';

import './Snackbar.css';

type State = Item[];
type Action = { type: 'add'; item: Item } | { type: 'remove'; key: number | string };

export type SnackbarContextType = {
  items: State;
  addItem: (payload: Item) => void;
  removeItem: (payload: number | string) => void;
};

const styles = {
  snackbar: 'vega-sp-snackbar',
  portal: 'vega-sp-snackbar-portal',
};

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

const SnackbarContext = React.createContext<SnackbarContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
});

export const useSnackbar = (): SnackbarContextType => {
  return React.useContext(SnackbarContext);
};

export const SnackbarProvider: React.FC = ({ children }) => {
  const { portal } = usePortal({ name: 'snackbar', className: styles.portal });
  const { renderPortalWithTheme } = usePortalRender();

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

  return (
    <SnackbarContext.Provider value={{ items, addItem, removeItem }}>
      {children}
      <SnackbarContext.Consumer>
        {(value) =>
          portal &&
          renderPortalWithTheme(
            <SnackBar className={styles.snackbar} items={value.items} />,
            portal,
          )
        }
      </SnackbarContext.Consumer>
    </SnackbarContext.Provider>
  );
};
