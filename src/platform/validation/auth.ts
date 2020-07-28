import { minLength } from './length';
import { ValidatorFn } from './types';

const emailPattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;

const dotEndPattern = /\.$/;
const doubleDotPattern = /\.{2,}/;

const MIN_PASSWORD_LENGTH = 7;
const MIN_PASSWORD_ERROR_MESSAGE =
  'Слишком короткий пароль. Пароль должен содержать 7 и более символов.';

export const MAX_PASSWORD_LENGTH = 200;

// eslint-disable-next-line no-useless-escape
const passwordPattern = /[\.a-zA-Zа-яА-Я0-9!»№%:,?*()#$]{7,200}$/;

export const emailInput: ValidatorFn = (input) => {
  if (!input) {
    return undefined;
  }
  const inputData = input && input.trim().toLowerCase();
  return emailPattern.test(inputData) &&
    !dotEndPattern.test(inputData) &&
    !doubleDotPattern.test(inputData)
    ? undefined
    : 'Неверный формат email';
};

export const minPasswordLength: ValidatorFn = (input) => {
  return minLength({ input, length: MIN_PASSWORD_LENGTH, message: MIN_PASSWORD_ERROR_MESSAGE });
};

export const passwordInput: ValidatorFn = (input) => {
  return passwordPattern.test(input)
    ? undefined
    : 'Введены недопустимые символы в пароле. Проверьте еще раз.';
};
