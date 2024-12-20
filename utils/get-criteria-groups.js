export const getCriteriaGroups = (task, variant) => {
  if (Array.isArray(task.criteria)) {
    if (Array.isArray(task.variants)) {
      return task.criteria.filter((group) => group.number === variant || !group.number);
    } else {
      return task.criteria;
    }
  }

  return null;
};
