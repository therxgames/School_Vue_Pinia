export const answerIsFilled = (task, answer) => {
  if (!answer || !answer.answer) {
    return false;
  }

  switch (task.type) {
    case 'ENTER_ANSWER':
    case 'CHOOSE_ANSWER':
    case 'ORDER_ANSWER':
    case 'GAP_MATCH_TEXT_ANSWER':
    case 'GAP_MATCH_TABLE_ANSWER':
      return Array.isArray(answer.answer) && answer.answer.length;

    case 'FREE_ANSWER':
      if (task?.variants?.length) {
        return answer.answer.variant && (answer.answer.comment || (answer.files && answer.files.length));
      } else {
        return answer.answer.comment || (answer.files && answer.files.length);
      }
  }

  return false;
};
