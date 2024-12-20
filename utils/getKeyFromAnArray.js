export function getKeyFromAnArray(id, list, key) {
  return list.find((item) => item?.id === id)[key]
}
