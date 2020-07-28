import { compose, curry, Dictionary, evolve, filter, is, map } from 'ramda';

import { ValidationScheme } from './types';

const addDefaultValuesAnValidators = curry((funcs, obj) => {
  const defaults = map(() => '', funcs);
  const defaultValidator = (): undefined => undefined;
  const defaultValidators = map(() => defaultValidator, obj);
  const validators = { ...defaultValidators, ...funcs };
  const objWithDefaults = { ...defaults, ...obj };

  return evolve(validators, objWithDefaults);
});

export const validateForm = <T>(
  validationScheme: ValidationScheme,
): ((values: T) => Dictionary<ValidationScheme>) =>
  compose(filter(is(String)), addDefaultValuesAnValidators(filter(is(Function), validationScheme)));
