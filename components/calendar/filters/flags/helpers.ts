import { TSortItem } from "./types";

export const sortList: TSortItem[] = [
  {
    id: "date",
    title: "Дате события",
  },
];

export const findTextById = (currentId: string, list: TSortItem[]) => {
  return String(
    list.find((elem) => elem.id === currentId)?.title
  ).toLocaleLowerCase();
};
