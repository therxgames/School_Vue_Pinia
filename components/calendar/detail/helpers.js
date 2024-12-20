import { format, isSameDay } from 'date-fns';
import ruLocale from 'date-fns/locale/ru/index.js';
import useCalendarItemStore from '@/stores/calendar-item';

export const formatEventDates = (dateStart, dateEnd, timeStart, timeEnd) => {
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
  value,
  forms,
  inclusive = false
) => {
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

export const exportEventIsc = async () => {
  try {
    const calendarItemStore = useCalendarItemStore();
    const icsFileUrl = URL.createObjectURL(new Blob([getEventIcs(calendarItemStore.data)], { type: 'text/calendar' }));
    const link = document.createElement('a');

    link.href = icsFileUrl;
    link.target = '_blank';
    link.click();
    link.remove();

    URL.revokeObjectURL(icsFileUrl);
  } catch (e) {
    console.error(`Unable to get event info: ${e.message}`);
  }
};


export const getEventIcs = (event) => {
  console.log('event', event)
  const startDate = getDateAndTime(event.dateStart, event.timeStart);
  const endDate = getDateAndTime(event.dateEnd, event.timeEnd);
  const onlineUrl = event.onlinePlatforms?.map(({ link }) => link)[0];

  if (!startDate) throw new Error('Start date must be provided');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    startDate &&
      [`DTSTART:${format(startDate, "yyyyMMdd'T'HHmmss")}`, `TZOFFSETFROM:${format(startDate, 'XX')}`].join('\n'),
    endDate && [`DTEND:${format(endDate, "yyyyMMdd'T'HHmmss")}`, `TZOFFSETTO:${format(endDate, 'XX')}`].join('\n'),
    `SUMMARY:${event.name}`,
    onlineUrl && `URL:${onlineUrl}`,
    event.description && `X-ALT-DESC;FMTTYPE=text/html:<!doctype html><html><body>${event.description}</body></html>`,
    event.address && `LOCATION:${event.address}`,
    event.coordinates && event.coordinates.length === 2 && `GEO:${event.coordinates.join(',')}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${event.name}`,
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ]
    .filter(Boolean)
    .join('\n');
};
