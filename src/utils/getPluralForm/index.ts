/*
  forms передавать в следующем формате: [одна единица, две единицы, пять единиц]
  одна форма, две формы, пять форм -> ['форма', 'формы', 'форм']
*/

export const getPluralForm = (number: number | null, forms: string[]): string => {
  if (number === null) {
    return '';
  }

  const naturalNumber = Math.trunc(Math.abs(number));
  const cases = [2, 0, 1, 1, 1, 2];

  return forms[
    naturalNumber % 100 > 4 && naturalNumber % 100 < 20
      ? 2
      : cases[naturalNumber % 10 < 5 ? naturalNumber % 10 : 5]
  ];
};
