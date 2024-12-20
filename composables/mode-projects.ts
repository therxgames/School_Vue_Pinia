export const useModeProjects = () =>
  useState<"list" | "tile">("stateModeProjects", () => "list");
