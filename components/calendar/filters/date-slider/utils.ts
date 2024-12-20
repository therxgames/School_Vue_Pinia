import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfISOWeek,
  endOfMonth,
  endOfYear,
  format,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameYear,
  isWithinInterval,
  setYear,
  startOfISOWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";

import type {
  CalendarView,
  СalendarItem,
  CalendarOptions,
} from './types'

export const getCalendar = <T>({ view, ...options }: CalendarOptions<T>) => {
  const currentDate = new Date();
  const viewDate = options?.date || currentDate;

  const getData = () =>
    (options?.data || []).reduce((data, { date, value }) => {
      const key = format(date, getDataDateFormat(view));

      if (!data.has(key)) data.set(key, []);

      data.get(key)?.push(value);

      return data;
    }, new Map<string, T[]>());

  const data = getData()

  const selection = options?.selection?.sort((a, b) => a.getTime() - b.getTime());

  const days: СalendarItem<T>[] = getDateInterval(
    view,
    viewDate,
    options?.fillEmpty
  ).map((date) => {
    const value = data.get(format(date, getDataDateFormat(view)));

    return {
      date,
      value,
      isCurrent: isCurrentDate(view, date, currentDate),
      inCurrentView: isDateInCurrentView(view, date, viewDate),
      inSelection: isDateInSelection(view, date, selection),
      isDisabled: !isDateInRange(date, options?.min, options?.max),
      hasData: value !== undefined,
    };
  });

  return days;
};

const getDateInterval = (
  view: CalendarView,
  viewDate: Date,
  fillEmpty = true
) => {
  switch (view) {
    case "days": {
      const startOfMonthDate = startOfMonth(viewDate);
      const endOfMonthDate = endOfMonth(viewDate);

      if (!fillEmpty) {
        return eachDayOfInterval({
          start: startOfMonthDate,
          end: endOfMonthDate,
        });
      }

      const startDate = startOfISOWeek(startOfMonthDate);
      const endDate = endOfISOWeek(endOfMonthDate);

      return eachDayOfInterval({
        start: startDate,
        end:
          differenceInCalendarDays(endDate, startDate) < 35
            ? addDays(
                endDate,
                differenceInCalendarDays(endDate, startDate) < 28 ? 14 : 7
              )
            : endDate,
      });
    }

    case "months": {
      return eachMonthOfInterval({
        start: startOfYear(viewDate),
        end: endOfYear(viewDate),
      });
    }

    case "years": {
      const startYear = Math.floor(getYear(viewDate) / 20) * 20;

      return eachYearOfInterval({
        start: startOfYear(setYear(viewDate, startYear)),
        end: endOfYear(setYear(viewDate, startYear + 19)),
      });
    }
  }
};

const getDataDateFormat = (view: CalendarView) => {
  switch (view) {
    case "days":
      return "yyyy-MM-dd";
    case "months":
      return "yyyy-MM";
    case "years":
      return "yyyy";
  }
};

const isCurrentDate = (
  view: CalendarView,
  date: Date,
  currentDate: Date
) => {
  const fn =
    view === "days" ? isSameDay : view === "months" ? isSameMonth : isSameYear;

  return fn(date, currentDate);
};

const isDateInCurrentView = (
  view: CalendarView,
  date: Date,
  viewDate: Date
) => {
  if (view === "days") return getMonth(date) === getMonth(viewDate);

  return true;
};

const isDateInSelection = (
  view: CalendarView,
  date: Date,
  selection?: [Date] | [Date, Date]
) => {
  if (!selection) return false;

  const start = selection[0];
  const end =
    selection.length > 1 ? selection[selection.length - 1] : selection[0];

  const isStart = start && isCurrentDate(view, date, start);
  const isEnd = end && isCurrentDate(view, date, end);

  if (isStart && isEnd) return "both";
  if (isStart) return "start";
  if (isEnd) return "end";
  if (start && end) return isWithinInterval(date, { start, end });

  return false;
};

const isDateInRange = (date: Date, start?: Date, end?: Date) => {
  if (!!start && !!end) return isWithinInterval(date, { start, end });
  if (!!start) return isAfter(date, start);
  if (!!end) return isBefore(date, end);

  return true;
};
