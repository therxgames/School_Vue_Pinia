export const sortTasks = (tasks, by = 'parts') => {
  if (by === 'parts') {
    const parts = [];

    tasks.forEach((task) => {
      const part = parts.find((part) => part.name === task.part_name);
  
      if (part) {
        part.tasks.push(task);
      } else {
        parts.push({
          name: task.part_name,
          tasks: [task]
        });
      }
    });
  
    parts.sort((a, b) => {
      if (a.num === null) {
        return -1;
      }
  
      if (b.num === null) {
        return 1;
      }
  
      return a.num - b.num;
    });
  
    parts.forEach((part) => {
      part.tasks.sort((a, b) => {
        return a.number - b.number;
      });
    });
  
    let res = [];
    let order = 1;
  
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
  
      for (let j = 0; j < part.tasks.length; j++) {
        const task = part.tasks[j];
  
        res.push({
          ...task,
          order
        });
  
        order++;
      }
    }
  
    return res;
  } else if (by === 'zeroPage') {
    return tasks.slice().sort((a, b) => (b.zeropage_text || '').localeCompare(a.zeropage_text || '')).map((task, index) => {
      return {...task, order: index + 1};
    });
  } else {
    return tasks;
  }
};
