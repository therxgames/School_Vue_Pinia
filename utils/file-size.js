export const fileSize = (num) => {
  const MB = 1048576; const KB = 1024;
  if (num > MB) return `${(num / MB).toFixed(1)} MB`;
  if (num > KB) return `${(num / KB).toFixed(1)} KB`;
  return `${num} bytes`;
};
