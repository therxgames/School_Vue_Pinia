export const useModeCollectionsDetail = () =>
  useState<"list" | "tile">("stateModeCollectionsDetail ", () => "list");
