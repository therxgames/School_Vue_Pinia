const extractNumberFromString = (str) => {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

const getMinMaxNumbers = (arr) => {
  if (arr.length === 0) {
    return '';
  }

  const min = Math.min(...arr);
  const max = Math.max(...arr);

  if (min === max) {
    return `${min}кл`;
  } else {
    return `${min}-${max}кл`;
  }
}

export const parserClasses = (classes) => {
  const numClasses = [];

  classes.forEach(item => {
    const num = extractNumberFromString(item.name)

    if (num) {
      numClasses.push(num)
    }
  })

  return getMinMaxNumbers(numClasses)
}
