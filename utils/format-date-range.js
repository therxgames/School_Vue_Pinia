import { format } from "date-fns";

import { parseDate } from "./parse-date";

export const formatDateRange = (range, options) => {
  const [from, to] = range.map((date) => parseDate(date));
  const {
    rangePrefix = "",
    rangePrefixSame = "",
    delimiter = " – ",
    dayFormat = "dd.MM",
    monthFormat = "yyyy",
    dayMonthFormat = `dd.MM`,
    dayMonthDelimiter = ".",
    monthYearDelimiter = ".",
    dateFormat = `dd.MM.yyyy`,
    yearFormat = "yyyy",
    fullFormat = false,
  } = options || {};

  if (!from || !to) return "—";

  if (from.getFullYear() !== to.getFullYear() || fullFormat) {
    const textRange = [format(from, dateFormat), format(to, dateFormat)].join(
      delimiter
    );

    return `${rangePrefix}${textRange}`;
  }

  if (from.getMonth() !== to.getMonth()) {
    const dayMonthRange = [
      format(from, dayMonthFormat),
      format(to, dayMonthFormat),
    ].join(delimiter);
    const textRange = [dayMonthRange, format(from, yearFormat)].join(
      monthYearDelimiter
    );

    return `${rangePrefix}${textRange}`;
  }

  if (from.getDate() !== to.getDate()) {
    const dayRange = [format(from, dayFormat), format(to, dayFormat)].join(
      delimiter
    );
    const textRange = [dayRange, format(from, monthFormat)].join(
      dayMonthDelimiter
    );

    return `${rangePrefix}${textRange}`;
  }

  return `${rangePrefixSame}${format(from, dateFormat)}`;
};
