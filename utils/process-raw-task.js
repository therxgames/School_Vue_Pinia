export const processRawTask = async (task) => {
  const newTask = {
    ...task,
    answer: JSON.parse(task.answer)
  };

  newTask.question = wrapContent(newTask.question);
  newTask.zeropage_text = wrapContent(newTask.zeropage_text);
  newTask.variants = shuffleTaskVariants(newTask);

  if (newTask.type === taskType.FREE_ANSWER) {
    const criteria = newTask.criteria;
    if (criteria) {
      newTask.multiTask = await checkMultiTask(newTask);
      newTask.criteria = newTask.multiTask.number
        ? await parseCriteriaMultiple(task, newTask.multiTask.number, Object.keys(newTask.multiTask.variants).length)
        : await parseCriteria(criteria);

      newTask.answer = await parseAnswer(criteria);
    } else {
      newTask.criteria = [{
        list: [{
          name: null,
          variants: [{content: '', score: 1}, {content: '', score: 0}]
        }],
        number: null,
        maxScore: 1,
        instructions: null
      }];
    }
  }

  return newTask;
};
