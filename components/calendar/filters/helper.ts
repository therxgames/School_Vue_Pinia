import { TEvent, TRouteQuery } from "./types";

export const olympiadLevel = [
  {
    id: 1,
    name: "I уровень",
  },
  {
    id: 2,
    name: "II уровень",
  },
  {
    id: 3,
    name: "III уровень",
  },
];

export const selectAddValueToFilter = (
  list: any[],
  key: string,
  options: TEvent[],
  functionSetFilterByKey: any,
  searchValue = "code"
) => {
  if (list.length < 1) {
    functionSetFilterByKey(key, null);
    return;
  }

  const items = [];

  for (let itemId of list) {
    const currentValue = getKeyFromAnArray(itemId, options, searchValue);
    items.push(currentValue);
  }

  functionSetFilterByKey(key, items.join());
};

export function getCount(itemObject: any) {
  let count = 0;

  for (let key in itemObject) {
    if (key !== "eventDateTo" && key !== "publishedAtTo") {
      itemObject[key] && count++;
    }
  }

  return count;
}

export function replaceNullParams(itemObject: TRouteQuery) {
  const cloneObject = { ...itemObject };
  const resultObject: TRouteQuery = {};

  for (const [key, value] of Object.entries(cloneObject)) {
    if (value) {
      resultObject[key] = value;
    }
  }

  return resultObject;
}

export function stringToArrayNumber(propStr: string) {
  const str: string = propStr;
  return str.split(",").map((item) => Number(item));
}

export function getIdArrayByList(
  strStore: string,
  storeList: TEvent[],
  key: any,
  isNumber = false
) {
  const itemStr: string = strStore;
  const itemList = itemStr.split(",");
  const itemArrayId: any = [];

  itemList.forEach((itemId: number | string) => {
    if (isNumber) {
      itemId = Number(itemId);
    }

    const currentId: any = storeList.find((el: any) => el[key] === itemId);

    if (currentId?.id) {
      itemArrayId.push(currentId?.id);
    }
  });

  return itemArrayId;
}

export function getRadioId(val: string, list: any, key: string) {
  return Number(list.find((item: any) => item[key] === val).id);
}
