export const chunk = (arr, n) => arr.reduce((acc, item, idx) => {
  if (!(idx % n)) acc.push([]);
  acc[Math.floor(idx / n)].push(item);
  return acc;
}, []);
