export type ValidatorFn = (value: string) => string | undefined;
export type MultipleValidation = (x: string) => ValidatorFn;
export type ValidationScheme = {
  [key: string]: ValidatorFn | MultipleValidation;
};
