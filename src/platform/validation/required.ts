import { ValidatorFn } from './types';

export const required: ValidatorFn = (value) => (!value ? 'Обязательное поле' : undefined);
