/*
  Значения в forms необходимо передавать в следующем формате: [одна единица, две единицы, пять единиц]
  Например, получим все формы для слова "минута": одна минута, две минуты, пять минут. В forms запишем: ['минута', 'минуты', 'минут']
*/

type FormsType = [string, string, string];

type OptionsType = {
  includeNumber?: boolean;
  delimiter?: string;
  discardFractionalPart?: boolean;
};

/*
  includeNumber - добавить в вывод число, например "1 минута"
  delimiter - если включена опция includeNumber, то в этом параметре можно указать разделитель. Например, если добавить "-", то получим вывод "1-минута"
  discardFractionalPart - отбросить дробную часть числа при получении формы. Например, с включенном опцией для 1.55 мы получим "минута", а с выключенной получим "минуты" - читаем как "одна целая и пятьдесят пять сотых минуты"
*/

const defaultOptions = {
  includeNumber: false,
  delimiter: ' ',
  discardFractionalPart: true,
};

const formatResult = (
  number: number,
  form: string,
  includeNumber: boolean,
  delimiter: string,
): string => {
  return includeNumber ? `${number}${delimiter}${form}` : form;
};

export const getPluralForm = (forms: FormsType, options: OptionsType = defaultOptions) => (
  number: number | null,
): string => {
  if (number === null) {
    return '';
  }

  const {
    includeNumber = defaultOptions.includeNumber,
    delimiter = defaultOptions.delimiter,
    discardFractionalPart = defaultOptions.discardFractionalPart,
  } = options;

  if (!Number.isInteger(number) && !discardFractionalPart) {
    const form = forms[1];
    return formatResult(number, form, includeNumber, delimiter);
  }

  const naturalNumber = Math.trunc(Math.abs(number));
  const cases = [2, 0, 1, 1, 1, 2];

  const form =
    forms[
      naturalNumber % 100 > 4 && naturalNumber % 100 < 20
        ? 2
        : cases[naturalNumber % 10 < 5 ? naturalNumber % 10 : 5]
    ];
  return formatResult(number, form, includeNumber, delimiter);
};
