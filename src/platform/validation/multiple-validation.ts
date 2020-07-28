import { compose, find, is, juxt } from 'ramda';

import { MultipleValidation, ValidatorFn } from './types';

export const multipleValidation = (validators: ValidatorFn[]): MultipleValidation =>
  compose(find(is(String)), juxt(validators));
