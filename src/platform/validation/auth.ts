const emailPattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;

const dotEndPattern = /\.$/;
const doubleDotPattern = /\.{2,}/;

export const emailInput = (input: string): string | undefined => {
  const inputData = input && input.trim().toLowerCase();
  return emailPattern.test(inputData) &&
    !dotEndPattern.test(inputData) &&
    !doubleDotPattern.test(inputData)
    ? undefined
    : 'Неверный формат email';
};
