import { isValid, parseISO } from "date-fns";

export const parseDate = (date) => {
  if (!date) return undefined;

  const dateObj = typeof date === "string" ? parseISO(date) : date;

  return isValid(dateObj) ? dateObj : undefined;
};
