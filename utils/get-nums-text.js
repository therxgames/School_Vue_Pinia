export const getNumsText = (nums) => {
  let res = [];
  let currentStart = null;

  nums.forEach((num, index) => {
    if (nums[index + 1] === num + 1) {
      if (!currentStart) {
        currentStart = num;
      }
    } else {
      if (currentStart) {
        if (currentStart < num - 1) {
          res.push(`${currentStart} - ${num}`);
        } else {
          res.push(currentStart.toString());
          res.push(num.toString());
        }

        currentStart = null;
      } else {
        res.push(num.toString());
      }
    }
  });

  return res.join(', ');
};
