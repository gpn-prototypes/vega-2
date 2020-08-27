import { getPluralForm } from './index';

describe('getPluralForm', () => {
  test('первая форма', () => {
    expect(getPluralForm(1, ['форма', 'формы', 'форм'])).toBe('форма');
  });

  test('вторая форма', () => {
    expect(getPluralForm(2, ['форма', 'формы', 'форм'])).toBe('формы');
  });

  test('третья форма', () => {
    expect(getPluralForm(5, ['форма', 'формы', 'форм'])).toBe('форм');
  });

  test('числовое значение не передано', () => {
    expect(getPluralForm(null, ['форма', 'формы', 'форм'])).toBe('');
  });

  test('дробное значение, меньше 5', () => {
    expect(getPluralForm(2.23, ['форма', 'формы', 'форм'])).toBe('формы');
  });

  test('дробное значение, больше 5', () => {
    expect(getPluralForm(7.77, ['форма', 'формы', 'форм'])).toBe('форм');
  });

  test('отрицательное значение', () => {
    expect(getPluralForm(-2233, ['форма', 'формы', 'форм'])).toBe('формы');
  });

  test('ноль', () => {
    expect(getPluralForm(0, ['форма', 'формы', 'форм'])).toBe('форм');
  });
});
