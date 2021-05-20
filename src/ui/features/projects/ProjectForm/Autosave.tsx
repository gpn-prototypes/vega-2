import { useCallback, useRef } from 'react';
import { FormSpyProps, useFormState } from 'react-final-form';
import { usePreviousRef } from '@gpn-prototypes/vega-ui';
import { FormState } from 'final-form';
import { intersection } from 'ramda';

export type SaveOptions = {
  valid: boolean;
};

type TriggeredFields<T> = (keyof T)[];

export interface AutosaveFormSpyProps<T> {
  onChange: FormSpyProps['onChange'];
  enabled?: boolean;
  triggerFields?: TriggeredFields<T>;
  onSave: (values: T, options: SaveOptions) => void;
}

type SaveFunction<T> = (fs: FormState<T>) => void;

export function Autosave<T>(props: AutosaveFormSpyProps<T>): null {
  const { enabled = true, onChange, triggerFields = [], onSave } = props;

  const saveRef = useRef<null | SaveFunction<T>>(null);

  const state = useFormState({
    onChange: (formState) => {
      if (onChange) {
        onChange(formState);
      }
      if (enabled && saveRef.current !== null) {
        saveRef.current(formState as FormState<T>);
      }
    },
    subscription: {
      dirtyFields: true,
      values: true,
      active: true,
      dirty: true,
      errors: true,
      validating: true,
    },
  });

  const prevActive = usePreviousRef(state.active);

  const save = useCallback(
    (formState: FormState<T>) => {
      const { values, active, dirty, validating, dirtyFields, errors } = formState;
      const isBlurEvent =
        (prevActive.current !== undefined && active === undefined) ||
        (prevActive.current !== undefined && active !== undefined && prevActive.current !== active);

      const fieldsWithErrors = Object.keys((errors as Record<string, unknown>) || {});
      const fieldsDirty = Object.keys(dirtyFields);
      const valid = intersection(fieldsWithErrors, fieldsDirty).length === 0;

      const hasTriggerField = triggerFields.some((f) => dirtyFields[f as string]);

      const hasAutosaveTrigger =
        valid && !validating && ((isBlurEvent && dirty) || hasTriggerField);

      onSave(values, { valid: hasAutosaveTrigger });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSave, triggerFields],
  );

  saveRef.current = save;

  return null;
}
