import { TSortItem } from "./types";

export const sortList: TSortItem[] = [
  {
    id: "publishedAt",
    title: "Дате",
  },
  {
    id: "title",
    title: "Названию",
  },
];

export const findTextById = (currentId: string, list: TSortItem[]) => {
  const validCurrentId = currentId[0] === "-" ? currentId.substring(1) : currentId;

  return String(
    list.find((elem) => elem.id === validCurrentId)?.title
  ).toLocaleLowerCase();
};
