import { getPluralForm } from './index';

describe('getPluralForm', () => {
  test('Первая форма', () => {
    expect(getPluralForm(1, ['форма', 'формы', 'форм'])).toBe('форма');
  });

  test('Вторая форма', () => {
    expect(getPluralForm(2, ['форма', 'формы', 'форм'])).toBe('формы');
  });

  test('Третья форма', () => {
    expect(getPluralForm(5, ['форма', 'формы', 'форм'])).toBe('форм');
  });

  test('Числовое значение не передано', () => {
    expect(getPluralForm(null, ['форма', 'формы', 'форм'])).toBe('');
  });

  test('Дробное значение, меньше 5', () => {
    expect(getPluralForm(2.23, ['форма', 'формы', 'форм'])).toBe('формы');
  });

  test('Дробное значение, больше 5', () => {
    expect(getPluralForm(7.77, ['форма', 'формы', 'форм'])).toBe('форм');
  });

  test('Отрицательное значение', () => {
    expect(getPluralForm(-2233, ['форма', 'формы', 'форм'])).toBe('формы');
  });

  test('Ноль', () => {
    expect(getPluralForm(0, ['форма', 'формы', 'форм'])).toBe('форм');
  });
});
