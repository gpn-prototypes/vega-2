import { getPluralForm } from './index';

describe('getPluralForm', () => {
  describe('параматры по умолчанию', () => {
    const pluralForm = getPluralForm(['минута', 'минуты', 'минут']);

    test('первая форма', () => {
      expect(pluralForm(1)).toBe('минута');
    });

    test('вторая форма', () => {
      expect(pluralForm(2)).toBe('минуты');
    });

    test('третья форма', () => {
      expect(pluralForm(5)).toBe('минут');
    });

    test('дробное значение, меньше 5', () => {
      expect(pluralForm(2.23)).toBe('минуты');
    });

    test('дробное значение, больше 5', () => {
      expect(pluralForm(7.77)).toBe('минут');
    });

    test('ноль', () => {
      expect(pluralForm(0)).toBe('минут');
    });

    test('отрицательное значение', () => {
      expect(pluralForm(-2233)).toBe('минуты');
    });

    test('числовое значение не передано', () => {
      expect(pluralForm(null)).toBe('');
    });
  });

  describe('параметры includeNumber и delimiter', () => {
    test('includeNumber = false и delimiter = undefined', () => {
      const pluralForm = getPluralForm(['минута', 'минуты', 'минут'], {
        includeNumber: false,
        delimiter: undefined,
      });
      expect(pluralForm(1)).toBe('минута');
    });

    test('includeNumber = false и delimiter = "-"', () => {
      const pluralForm = getPluralForm(['минута', 'минуты', 'минут'], {
        includeNumber: false,
        delimiter: '-',
      });
      expect(pluralForm(1)).toBe('минута');
    });

    test('includeNumber = true и delimiter = undefined', () => {
      const pluralForm = getPluralForm(['минута', 'минуты', 'минут'], {
        includeNumber: true,
        delimiter: undefined,
      });
      expect(pluralForm(1)).toBe('1 минута');
    });

    test('includeNumber = true и delimiter = "-"', () => {
      const pluralForm = getPluralForm(['минута', 'минуты', 'минут'], {
        includeNumber: true,
        delimiter: '-',
      });
      expect(pluralForm(1)).toBe('1-минута');
    });
  });

  describe('параметр discardFractionalPart', () => {
    test('discardFractionalPart = true', () => {
      const pluralForm = getPluralForm(['минута', 'минуты', 'минут'], {
        includeNumber: false,
        delimiter: undefined,
        discardFractionalPart: true,
      });

      expect(pluralForm(1.55)).toBe('минута');
    });

    test('discardFractionalPart = false', () => {
      const pluralForm = getPluralForm(['минута', 'минуты', 'минут'], {
        includeNumber: true,
        delimiter: undefined,
        discardFractionalPart: false,
      });

      expect(pluralForm(1.55)).toBe('1.55 минуты');
    });
  });
});
