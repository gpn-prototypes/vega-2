import { getYearStartOptions, isValidYear } from './DescriptionStep';

describe('isValidYear', () => {
  test.each`
    str         | expected | description
    ${'2000'}   | ${true}  | ${'является'}
    ${'2999'}   | ${true}  | ${'является'}
    ${'300000'} | ${false} | ${'не является'}
    ${'3'}      | ${false} | ${'не является'}
    ${'3ff'}    | ${false} | ${'не является'}
  `('проверяет строку $str, что она $description 4х значным числом', ({ str, expected }) => {
    const isValid = isValidYear(str);
    expect(isValid).toBe(expected);
  });
});

describe('getYearStartOptions', () => {
  it('возвращает список дат на 11 лет вперед, начиная с предыдущего года', () => {
    const years = getYearStartOptions();

    const currentYear = new Date().getFullYear();
    const expectedFirstYear = currentYear - 1;

    expect(years[0].value).toEqual(String(expectedFirstYear));
    expect(years[years.length - 1].value).toEqual(String(expectedFirstYear + 11));
  });
});
