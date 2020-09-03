import { useMemo, useReducer } from 'react';

enum ActionType {
  add,
  remove,
}

type Action =
  | {
      type: ActionType.add;
      files: File[];
    }
  | { type: ActionType.remove; name: string };

type FileListAPI = {
  fileList: File[];
  addFiles: (files: File[]) => void;
  removeFile: (name: string) => void;
};

class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}

function reducer(state: File[], action: Action): File[] {
  switch (action.type) {
    case ActionType.add: {
      const { files } = action;
      const filesToAdd = files.filter(
        (newFile) => !state.find((stateFile) => stateFile.name === newFile.name),
      );

      return [...state, ...filesToAdd];
    }
    case ActionType.remove: {
      const { name } = action;

      return state.filter((file) => file.name !== name);
    }
    default:
      throw new UnreachableCaseError(action);
  }
}

export function useFileList(initialState: File[] = []): FileListAPI {
  const [fileList, dispatch] = useReducer(reducer, initialState);

  const callbacks = useMemo(
    () => ({
      addFiles: (files: File[]): void => dispatch({ type: ActionType.add, files }),
      removeFile: (name: string): void => dispatch({ type: ActionType.remove, name }),
    }),
    [],
  );

  return useMemo(() => ({ fileList, ...callbacks }), [fileList, callbacks]);
}
