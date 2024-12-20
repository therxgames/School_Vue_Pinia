import {defineStore} from 'pinia';
import {parseISO} from 'date-fns';
import useUserStore from '~/stores/user';
import {differenceInSeconds} from 'date-fns';

export default defineStore({
  id: 'test-run',
  state() {
    return {
      test: {},
      attempt: null,
      answers: [],
      fetching: false
    };
  },
  getters: {
    taskById() {
      return (id) => this.test?.tasks?.find((task) => task.id === id);
    },
    answerById: (state) => (id) => {
      const answer = state.answers.find((a) => a.task_id === id);

      if (answer) {
        return answer;
      } else {
        return {
          id: null,
          task_id: id,
          answer: null,
          files: null
        };
      }
    },
    parts() {
      if (this.test) {
        if (this.test.type === 'demovariant') {
          return getParts(this.test.tasks);
        } else {
          return [{
            name: null,
            num: null,
            tasks: this.test.tasks
          }];
        }
      } else {
        return null;
      }
    }
  },
  actions: {
    setTaskField(id, key, value) {
      const task = this.taskById(id);

      if (task) {
        task[key] = value;
      }
    },
    async postView() {
      try {
        if (this.test) {
          await useApi(`/api/test/${this.test.id}/views`, {...methodPost});
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async fetch(id) {
      this.fetching = true;

      try {
        let test = null;
        let response = await useApi(`/api/test/${id}`, {...methodGet});

        if (response.data.done) {
          test = {...response.data.test};
        }

        response = await useApi(`/api/test/${id}/tasks`, {...methodGet});

        if (response.data.done && test) {
          const tasks = sortTasks(response.data.tasks, test.type === 'demovariant' ? 'parts' : 'zeroPage');
          test.tasks = [];

          for (let i = 0; i < tasks.length; i++) {
            test.tasks.push(await processRawTask(tasks[i]));
          }

          response.data.answers.forEach((answer) => {
            if (answer.answer) {
              answer.answer = JSON.parse(answer.answer);
            }

            const seen = this.answers.find((a) => a.task_id === answer.task_id);

            if (seen) {
              if (parseISO(answer.created_at) > parseISO(seen.created_at)) {
                this.answers.splice(this.answers.indexOf(seen), 1, answer);
              }
            } else {
              this.answers.push(answer);
            }
          });
        }

        this.test = test;
      } catch (e) {
        console.error(e.message);
      } finally {
        this.fetching = false;
      }
    },
    async fetchAttempt() {
      if (useUserStore().logged) {
        try {
          const {data} = await useApi(`/api/test/${this.test.id}/attempt/active`, {
            ...methodGet
          });

          if (data.done) {
            const {is_finished, mode, started_at, now} = data.attempt;

            if (!is_finished) {
              await useApi(`/api/test/${this.test.id}/attempt/active`, {
                ...methodGet,
                query: {
                  ...this.test.attempt_time > 0 ? {action: 'restart'} : null
                }
              });
            }

            if (mode === 'control') {
              const time = passingTestDuration(this.test).seconds - differenceInSeconds(new Date(now), new Date(started_at));
              data.attempt.time = time > 0 ? time : 0;
            }

            this.attempt = data.attempt;
          }
        } catch (e) {
          console.error(e.message);
        }
      } else {
        const attempt = localServer.getAttempt({
          test_id: this.test.id,
          is_active: true
        });

        if (attempt) {
          const {mode, started_at} = attempt;
          if (mode === 'control') {
            const time = passingTestDuration(this.test).seconds - differenceInSeconds(new Date(), new Date(started_at));
            attempt.time = time > 0 ? time : 0;
          }

          this.attempt = attempt;
        }
      }
    },
    async fetchAnswers() {
      for (let i = 0; i < this.test.tasks.length; i++) {
        const task = this.test.tasks[i];

        const answers = await localServer.getAnswers({
          test_id: this.test.id,
          task_id: task.id,
          is_active: true
        });

        answers.forEach((answer) => {
          const seen = this.answers.find((a) => a.task_id === answer.task_id);

          if (seen) {
            if (parseISO(answer.created_at) > parseISO(seen.created_at)) {
              this.answers.splice(this.answers.indexOf(seen), 1, answer);
            }
          } else {
            this.answers.push(answer);
          }
        });
      }
    },
    tick() {
      if (this.attempt) {
        if (this.attempt.mode === 'control') {
          this.attempt.time--;

          if (this.attempt.time < 0) {
            this.attempt.time = 0;
          }
        } else {
          this.attempt.time++;
        }
      }
    },
    setAnswer(id, answer) {
      const seen = this.answers.find((answer) => answer.task_id === id);

      if (seen) {
        this.answers.splice(this.answers.indexOf(seen), 1, answer);
      } else {
        this.answers.push(answer);
      }
    },
    async save(check = true, action) {
      if (!this.attempt) {
        return;
      }

      try {
        for (let i = 0; i < this.answers.length; i++) {
          const answer = this.answers[i];

          if ((!answer.answer || (Array.isArray(answer.answer) && !answer.answer.length)) && !answer.files) {
            continue;
          }

          if (useUserStore().logged) {
            if (answer.result === 'unchecked') {
              await useApi(`/api/answer/${answer.id}/change`, {
                ...methodPatch,
                body: {
                  answer: JSON.stringify(answer.answer),
                  check
                }
              });

              const task = this.test.tasks.find((task) => task.id === answer.task_id);

              if (task.type === taskType.FREE_ANSWER) {
                if ((answer.files && answer.files.length) || answer.filenames.find((f) => f.deleted)) {
                  const formData = new FormData();
                  formData.append('task_id', answer.task_id);

                  if (answer.files) {
                    answer.files.forEach((file) => {
                      formData.append('files[]', file);
                    });
                  }

                  if (answer.filenames.find((f) => f.deleted)) {
                    answer.filenames.filter((f) => f.deleted).forEach((f) => {
                      formData.append('delete[]', f.id);
                    });
                  }

                  await useApi(`/api/answer/${answer.id}/files`, {formData});
                }
              }
            } else {
              const formData = new FormData();
              formData.append('answer', JSON.stringify(answer.answer));
              formData.append('check', check);

              if (answer.files) {
                answer.files.forEach((file) => {
                  formData.append('files[]', file);
                });
              }

              await useApi(`/api/test/${this.test.id}/task/${answer.task_id}/answer`, {formData});
            }
          } else {
            const task = this.test.tasks.find((task) => task.id === answer.task_id);

            if (task) {
              if (answer.result === 'unchecked') {
                localServer.patchAnswer(answer.id, {
                  answer: answer.answer
                }, check, task);

                if (task.type === 'FREE_ANSWER') {
                  if ((answer.files && answer.files.length) || answer.filenames.find((f) => f.deleted)) {
                    const toDelele = [];

                    if (answer.filenames.find((f) => f.deleted)) {
                      answer.filenames.filter((f) => f.deleted).forEach((f) => {
                        toDelele.push(f.id);
                      });
                    }

                    await localServer.postAnswerFiles(answer.id, answer.files, toDelele);
                  }
                }
              } else {
                await localServer.addAnswer(this.test.id, answer.task_id, task.version_number, answer.answer, answer.files, check, task);
              }
            }
          }
        }

        if (useUserStore().logged) {
          await useApi(`/api/test/${this.test.id}/attempt`, {
            ...methodPatch,
            body: {
              time: this.attempt.time,
              ...action === testAction.PAUSE ? {action: 'pause_attempt'} : null,
              ...action === testAction.FORCE_COMPLETION ? {action: 'test_force_stop'} : null,
              ...action === testAction.COMPLETION ? {action: 'test_auto_stop'} : null
            }
          });
        } else {
          localServer.patchAttempt(this.attempt.id, {
            time: this.attempt.time
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    },
    async check() {
      if (!this.attempt) {
        return;
      }

      if (useUserStore().logged) {
        await useApi(`/api/test/${this.test.id}/check`, {...methodPatch});
      }
    },
    async finish() {
      if (!this.attempt) {
        return;
      }

      if (useUserStore().logged) {
        const response = await useApi(`/api/test/${this.test.id}/attempt`, {
          ...methodPatch,
          body: {
            status: 'finished'
          }
        });

        if (response.data.done) {
          this.attempt.is_finished = true;
        }
      } else {
        localServer.patchAttempt(this.attempt.id, {
          is_finished: true
        });

        this.attempt.is_finished = true;
      }
    },
    reset() {
      this.test = {};
      this.attempt = null;
      this.answers = [];
      this.fetching = false;
    }
  }
});
