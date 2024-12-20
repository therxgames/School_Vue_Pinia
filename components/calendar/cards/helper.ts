import {format, isSameDay, isValid, parseISO, set} from 'date-fns';
// ruLocale - нужна для того что бы месяц в formatEventDates был на русском языке (а то по умолчанию англ. версию вставляет)
import ruLocale from 'date-fns/locale/ru/index.js';

export const toRoman = (number) => {
  let result = '';
  const romanNumerals = {
    1000: 'M',
    900: 'CM',
    500: 'D',
    400: 'CD',
    100: 'C',
    90: 'XC',
    50: 'L',
    40: 'XL',
    10: 'X',
    9: 'IX',
    5: 'V',
    4: 'IV',
    1: 'I'
  };

  for (let key in romanNumerals) {
    while (number >= key) {
      result += romanNumerals[key];
      number -= key;
    }
  }

  return result;
}

export const parseDate = (date?: string | Date | null) => {
  if (!date) return undefined;

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  return isValid(dateObj) ? dateObj : undefined;
};


export const getDateAndTime = (dateStr?: string, timeStr?: string) => {
  const date = parseDate(dateStr);
  const regex = /^(\d+):(\d+)$/;

  if (!date) return undefined;

  const [, hoursStr, minutesStr] = timeStr?.match(regex) || [];

  return set(date, {
    hours: Number(hoursStr) || 0,
    minutes: Number(minutesStr) || 0
  });
};

export const formatEventDates = (dateStart?: string, dateEnd?: string, timeStart?: string, timeEnd?: string) => {
  const now = new Date();

  const fromDate = parseDate(dateStart);
  const toDate = parseDate(dateEnd);

  if (toDate && (!fromDate || fromDate < now)) {
    return `до ${format(toDate, 'd MMMM', {locale: ruLocale})}`;
  }

  if (!fromDate) return null;

  if (!toDate) return format(fromDate, 'd MMMM', {locale: ruLocale});

  if (isSameDay(fromDate, toDate)) {
    return [format(toDate, 'd MMMM', {locale: ruLocale}), [timeStart, timeStart ? timeEnd : false].filter(Boolean).join(' — ')]
    .filter(Boolean)
    .join(' ');
  }

  return [format(fromDate, 'd MMMM', {locale: ruLocale}), format(toDate, 'd MMMM', {locale: ruLocale})].join(' — ');
};

export const pluralize = (
  value: number,
  forms: [string, string] | [string, string, string],
  inclusive = false
): string => {
  const valueRem = value % 100;
  const coefficient = valueRem > 20 ? valueRem % 10 : valueRem;
  const prefix = inclusive ? `${value} ` : '';

  switch (forms.length) {
    case 2: {
      const [one, many] = forms;
      return `${prefix}${coefficient === 1 ? one : many}`;
    }

    case 3: {
      const [one, few, many] = forms;
      return `${prefix}${coefficient === 1 ? one : coefficient > 1 && coefficient < 5 ? few : many}`;
    }

    default: {
      return `${value}`;
    }
  }
};

export const isCorrectSrc = (src) => !!src && ['http://', 'https://', '/'].some((prefix) => src.startsWith(prefix)) ? src : undefined;
