export const truncate = (str, length = 50) =>{
  if (str.length > length) {
    return str.substring(0, length).trimEnd() + '...';
  }
  return str;
};
