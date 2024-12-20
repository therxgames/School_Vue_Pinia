export const useModeCalendar = () =>
  useState<"list" | "tile">("stateModeCalendar", () => "list");
