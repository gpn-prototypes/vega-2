import { getYearStartOptions, isValidYear } from './DescriptionStep';

describe('isValidYear', () => {
  test.each`
    str         | expected | description
    ${'2000'}   | ${true}  | ${'является'}
    ${'2999'}   | ${true}  | ${'является'}
    ${'300000'} | ${false} | ${'не является'}
    ${'3'}      | ${false} | ${'не является'}
  `('проверяет строку $str, что она $description 4х значным числом', ({ str, expected }) => {
    const isValid = isValidYear(str);
    expect(isValid).toBe(expected);
  });
});

describe('getYearStartOptions', () => {
  it('возвращает список дат на 10 лет вперед, начиная с предыдущего года', () => {
    const years = getYearStartOptions();

    const currentYear = new Date().getFullYear();
    const result = [];

    for (let i = -1; i < 11; i += 1) {
      const year = currentYear + i;
      const option = {
        label: `${year}`,
        value: year.toString(),
      };

      result.push(option);
    }

    expect(years).toEqual(result);
  });
});
