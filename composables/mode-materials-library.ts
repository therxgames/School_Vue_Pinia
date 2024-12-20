export const useModeMaterialsLibrary = () =>
  useState<"list" | "tile">("stateModeMaterialsLibrary", () => "list");
