import {parse, format} from 'date-fns';
import ru from 'date-fns/locale/ru/index.js';

export const formatDate = (date, formatter = 'd MMM yyyy') => {
  if (date) {
    date = parse(date, 'yyyy-MM-dd HH:mm:ss', new Date());
    return `${format(date, formatter, {locale: ru})}`;
  }

  return '';
};


export const formatDateByMask = (
  date,
  mask,
) => format(new Date(date), mask, { locale: ru })
