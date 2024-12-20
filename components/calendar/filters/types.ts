export type TEvent = {
  id: number | string;
  name?: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
  code?: string;
};

export type TMode = "list" | "tile";

export type TRouteQuery = {
  [key: string]: string | number | null;
};
