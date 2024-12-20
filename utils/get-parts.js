export const getParts = (tasks) => {
  const res = [];

  tasks.forEach((task) => {
    const part = res.find((part) => part.name === task.part_name);

    if (part) {
      part.tasks.push(task);
    } else {
      let num = null;

      if (task.part_name) {
        const match = task.part_name.match(/Часть (\d+)/);

        if (match) {
          num = parseInt(match[1]);
        }
      }


      res.push({
        name: task.part_name,
        num,
        tasks: [task]
      });
    }
  });

  res.sort((a, b) => {
    if (a.num === null) {
      return -1;
    }

    if (b.num === null) {
      return 1;
    }

    return a.num - b.num;
  });

  res.forEach((part) => {
    part.tasks.sort((a, b) => {
      return a.number - b.number;
    });
  });

  return res;
};
