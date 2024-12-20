export const showZeroPageTitle = (task, tasks) => {
  if (task.zeropage_guid) {
    const i = tasks.indexOf(task);

    if (i > -1) {
      return i === 0 || tasks[i - 1].zeropage_guid !== task.zeropage_guid;
    }
  }

  return false;
};

export const getZeroPageTasks = (task, tasks) => {
  const i = tasks.indexOf(task);

  if (i > -1) {
    for (let j = i + 1; j < tasks.length; j++) {
      if (tasks[j].zeropage_guid !== task.zeropage_guid) {
        return tasks.slice(i, j);
      } else if (j === tasks.length - 1) {
        return tasks.slice(i);
      }
    }
  }

  return null;
};

export const isSingleZeroPage = (task, tasks) => {
  const i = tasks.indexOf(task);

  if (i > -1) {
    return task.zeropage_guid
      && (i === 0 || !tasks[i - 1].zeropage_guid || tasks[i - 1].zeropage_guid !== task.zeropage_guid)
      && (i === tasks.length - 1 || !tasks[i + 1].zeropage_guid || tasks[i + 1].zeropage_guid !== task.zeropage_guid);
  }

  return false;
};

export const isLastZeroPageTask = (task, tasks) => {
  const i = tasks.indexOf(task);

  if (i > -1) {
    const nextTask = tasks[i + 1];

    if (i === tasks.length - 1) {
      return true;
    } else if (task.zeropage_guid !== nextTask.zeropage_guid) {
      if (!task.zeropage_guid || isSingleZeroPage(task, tasks)) {
        return nextTask.zeropage_guid && !isSingleZeroPage(nextTask, tasks);
      } else {
        return true;
      }
    }
  }

  return false;
};
