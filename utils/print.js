import useUserStore from '~/stores/user';
import {parseISO} from 'date-fns';
import {localServer} from '~/utils/local-server';

const showError = () => {
  eventBus.emit('toast:show', {
    text: 'При формировании печатной формы произошла ошибка.'
  });
};

export const printTask = async (id, withCorrectAnswer = true) => {
  eventBus.emit('loader:show');

  try {
    let response = await useApi(`/pdf/task/${id}?with-correct-answer=${withCorrectAnswer}`, {
      ...methodGet,
      responseType: 'blob'
    });

    window.open(URL.createObjectURL(response.data));
  } catch (e) {
    showError();
  }

  eventBus.emit('loader:hide');
};

export const printTopic = async (id, selectedTasks) => {
  eventBus.emit('loader:show');

  try {
    const response = await useApi(`/pdf/topic/${id}` + '?tasks=' + selectedTasks.map((task) => task.id).join(','), {
      ...methodGet,
      responseType: 'blob'
    });

    window.open(URL.createObjectURL(response.data));
  } catch (e) {
    showError();
  }

  eventBus.emit('loader:hide');
};

export const printTest = async (id, attemptId) => {
  eventBus.emit('loader:show');

  let answers = [];
  let fetchedAnswersCount = 0;

  try {
    if (attemptId) {
      let response;
      let attempts;
      let test;

      const logged = useUserStore().logged;

      if (logged) {
        response = await useApi(`/api/test_attempts/list`, {
          ...methodGet,
          query: {
            test_id: id
          }
        });

        if (response.data.done) {
          attempts = response.data.data;
        }
      } else {
        response = localServer.getAttempts({test_id: id});

        if (response) {
          attempts = response;
        }
      }

      if (attempts) {
        const attempt = attempts.find((a) => a.id === attemptId);

        if (attempt) {
          response = await useApi(`/api/test/${id}`, {...methodGet});

          if (response.data.done) {
            test = response.data.test;

            response = await useApi(`/api/test/${id}/tasks`, {...methodGet});

            if (response.data.done) {
              test.tasks = response.data.tasks.map((task) => {
                if (task.answer) {
                  task.answer = JSON.parse(task.answer);
                }

                return task;
              });
            }

            for (let i = 0; i < test.tasks.length; i++) {
              const task = test.tasks[i];

              if (logged) {
                response = await useApi(`/api/test/${id}/task/${task.parent_id}/answers`, {...methodGet});

                if (response.data.done) {
                  response.data.answers.forEach((answer) => {
                    if (parseISO(answer.created_at) >= parseISO(attempt.started_at)
                      && parseISO(answer.created_at) <= parseISO(attempt.last_action_at)) {
                      answers.push({
                        ...answer,
                        task_id: task.id
                      });
                    }
                  });
                }
              } else {
                response = await localServer.getAnswers({
                  task_parent_id: task.parent_id,
                  test_id: id
                });

                if (response) {
                  response.forEach((answer) => {
                    if (parseISO(answer.created_at) >= parseISO(attempt.started_at)
                      && parseISO(answer.created_at) <= parseISO(attempt.last_action_at)) {
                      answers.push({
                        ...answer,
                        task_id: task.id
                      });
                    }
                  });
                }
              }

              fetchedAnswersCount++;

              eventBus.emit('loader:caption',
                `Пожалуйста, подождите (${calculateProgress(fetchedAnswersCount, test.tasks.length)}%)`);

              if (fetchedAnswersCount === test.tasks.length) {
                eventBus.emit('loader:caption',
                  `Почти готово...`);
              }
            }
          }
        }
      }
    }

    const response = await useApi(`/pdf/test/${id}`, {
      ...methodPost,
      responseType: 'blob',
      body: answers
    });

    window.open(URL.createObjectURL(response.data));
  } catch (e) {
    showError();
  }

  eventBus.emit('loader:hide');
};
