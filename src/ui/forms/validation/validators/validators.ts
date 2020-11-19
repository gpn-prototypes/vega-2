import { AnyValue } from '../types';

import { createValidator } from './create-validator';

/* eslint-disable */
export const emailPattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
/* eslint-enable */

export const required = createValidator<void, AnyValue>({
  messageFn: () => 'Обязательное поле',
  strictValidate(value) {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number' && Number.isNaN(value)) {
      return false;
    }

    return typeof value === 'string' && value.trim() !== '';
  },
});

export const pattern = createValidator<RegExp, string>({
  messageFn: () => `Недопустипое значение`,
  validate: (value, regexp) => regexp.test(value),
});

export const email = (): ReturnType<typeof pattern> =>
  pattern(emailPattern, () => 'Неверный формат email');

export const min = createValidator<number, number | string>({
  messageFn: (minValue) => `Минимальное значение ${minValue}`,
  validate: (value, minValue) => minValue <= Number(value),
});

export const max = createValidator<number, number | string>({
  messageFn: (maxValue) => `Максимальное значение ${maxValue}`,
  validate: (value, maxValue) => maxValue >= Number(value),
});

export const minLength = createValidator<number, string>({
  messageFn: (length) => `Минимальное количество символов ${length}`,
  validate: (value, length) => value.length >= length,
});

export const maxLength = createValidator<number, string>({
  messageFn: (length) => `Вы превысили максимальное количество символов в ${length} символов`,
  validate: (value, length) => value.length <= length,
});

export const validators = {
  required,
  pattern,
  email,
  min,
  max,
  minLength,
  maxLength,
};
