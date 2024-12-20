export type CalendarView = "days" | "months" | "years";

export type CalendarOptions<T> = {
  view: CalendarView;
  fillEmpty?: boolean;
  date?: Date;
  min?: Date;
  max?: Date;
  selection?: [Date] | [Date, Date];
  data?: {
    date: Date;
    value: T;
  }[];
};

export type СalendarItem<T = unknown> = {
  date: Date;
  value?: T[];
  isCurrent?: boolean;
  isDisabled?: boolean;
  inCurrentView?: boolean;
  inSelection?: "start" | "end" | "both" | boolean;
  hasData?: boolean;
};