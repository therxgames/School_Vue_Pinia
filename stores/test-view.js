import {defineStore} from 'pinia';
import {parseISO} from 'date-fns';
import useCommonStore from '~/stores/common';
import useUserStore from '~/stores/user';

export default defineStore({
  id: 'test-view',

  state() {
    return {
      test: {},
      themes: [],
      attempts: [],
      attempt: null,
      answers: [],
      recommendedTests: [],
      fetching: false
    };
  },

  getters: {
    answerById() {
      return (id) => {
        const answer = this.answers.find((a) => a.task_id === id);

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
      }
    },
    freeAnswerTasks() {
      const res = [];

      if (this.test.tasks) {
        this.test.tasks.forEach((task, index) => {
          if (task.type === taskType.FREE_ANSWER) {
            const answer = this.answerById(task.id);

            if (answer && (answer.answer || answer.filenames)) {
              const score = answer.answer ? answer.answer.score : 0;

              let maxScore = null;

              if (Array.isArray(task.criteria)) {
                maxScore = task.criteria.reduce((acc, item) => {
                  const maxItem = item.variants.slice().sort((a, b) => b.score - a.score)[0];
                  return maxItem ? acc + maxItem.score : acc;
                }, 0);
              }

              res.push({
                num: index + 1,
                task,
                score,
                maxScore,
                answer
              });
            }
          }
        });
      }

      return res;
    },
    needScoring() {
      return this.freeAnswerTasks.some((info) => {
        if (info.answer.result === 'scoring') {
          return true;
        }
      });
    },
    tasksCount() {
      return this.themes.reduce((count, theme) => count + theme.tasks_count, 0);
    },
    answeredCount() {
      return this.answers.length;
    },
    taskByParentId() {
      return this.test.tasks?.reduce((acc, item) => {
        acc[item.parent_id] = item;
        return acc;
      }, {}) || {};
    }
  },

  actions: {
    async fetch(id, options = {
      fetchRecommended: true
    }) {
      this.fetching = true;
      await this.fetchTest(id);
      await this.fetchTestTasks(id);
      await this.fetchAttempt();
      
      if (options?.fetchRecommended !== false) {
        await this.fetchRecommended(id);
      }
      this.fetching = false;
    },
    async fetchTest(id) {
      try {
        const response = await useApi(`/api/test/${id}`, {...methodGet});
        if (response.data.done) {
          this.test = response.data.test;
          this.themes = response.data.topics;
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async fetchTestTasks() {
      if (!this.test.id) {
        return;
      }

      try {
        const response = await useApi(`/api/test/${this.test.id}/tasks`, {...methodGet});
        if (response.data.done) {
          this.test.tasks = response.data.tasks.map((task) => {
            if (task.answer) {
              task.answer = JSON.parse(task.answer);
            }

            return task;
          });

          response.data.answers.forEach((answer) => {
            if (typeof answer.answer === 'string') {
              answer.answer = JSON.parse(answer.answer);
            }

            const seen = this.answers.find((a) => a.task_id === answer.task_id);

            if (seen) {
              if (parseISO(answer.updated_at) > parseISO(seen.updated_at)) {
                this.answers.splice(this.answers.indexOf(seen), 1, answer);
              }
            } else {
              this.answers.push(answer);
            }
          });
        }
      } catch (e) {
        console.error(e.message);
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
    async fetchAttempt() {
      if (!this.test.id) {
        return;
      }

      if (useUserStore().logged) {
        try {
          const response = await useApi(`/api/test/${this.test.id}/attempt/active`, {...methodGet});
          if (response.data.done) {
            this.attempt = response.data.attempt;
          }
        } catch (e) {
          /**/
        }
      } else {
        this.attempt = localServer.getAttempt({
          test_id: this.test.id,
          is_active: true
        });
      }
    },
    async fetchAttempts(id) {
      if (useUserStore().logged) {
        try {
          const response = await useApi(`/api/test_attempts/list`, {
            ...methodGet,
            query: {
              test_id: id
            }
          });

          if (response.data.done) {
            this.attempts = response.data.data;
          }
        } catch (e) {
          console.error(e.message);
        }
      } else {
        this.attempts = localServer.getAttempts({
          test_id: id
        });
      }
    },
    async fetchRecommended(id) {
      try {
        const response = await useApi(`/api/test/${id}/recommended`, {
          ...methodGet,
          query: {
            limit: 40
          }
        });
        if (response.data.done) {
          this.recommendedTests = [...response.data.tests];
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async addToCollection() {
      try {
        return useApi(`/api/test/${this.test.id}/in_collection`, {
          ...methodPut,
          body: {in_collection: true}
        });
      } catch (e) {
        console.error(e.message);
        return false;
      }
    },
    async addToFavorite() {
      try {
        const response = await useCommonStore().addToFavorite(this.test.parent_id, '/api/test/{id}/status');
        if (response && response.data.done) {
          this.test.is_favorite = true;
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async removeFromFavorite() {
      const response = await useCommonStore().removeFromFavorite(this.test.parent_id, '/api/test/{id}/status');
      if (response && response.data.done) {
        this.test.is_favorite = false;
      }
    },
    async toggleFavorite(id) {
      const task = this.taskByParentId[id];

      if (!task) {
        return;
      }

      try {
        const response = await useApi(`/api/task/${task.parent_id}/status`, {
          ...methodPatch,
          body: {is_favorite: !task.is_favorite}
        });
        if (response.data.done) {
          task.is_favorite = !task.is_favorite;
        }
        return task.is_favorite;
      } catch (e) {
        console.error(e.message);
      }
    },
    async addToArchive() {
      try {
        const response = await useApi(`/api/test/${this.test.id}/status`, {
          ...methodPatch,
          body: {in_archive: true}
        });
        if (response.data.done) {
          this.test.in_archive = true;
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async setTestStatus(status) {
      try {
        const response = await useApi(`/api/test/${this.test.id}/attempt`, {
          ...methodPatch,
          body: {status}
        });

        if (response.data.done) {
          await this.fetchAttempt();
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async removeFromArchive() {
      try {
        const response = await useApi(`/api/test/${this.test.id}/status`, {
          ...methodPatch,
          body: {in_archive: false}
        });
        if (response.data.done) {
          this.test.in_archive = false;
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async startTest(control = false, time = 0) {
      if (useUserStore().logged) {
        try {
          const response = await useApi(`/api/test/${this.test.id}/attempt`, {
            ...methodPost,
            body: {
              time,
              mode: control ? 'control' : 'training'
            }
          });

          return response.data.done;
        } catch (e) {
          console.error(e.message);
        }
      } else {
        localServer.addAttempt(this.test.id, time, control ? 'control' : 'training');
        return true;
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
    resetAttempt() {
      this.test.is_finished = false;
      this.test.attempt_started_at = '';
      this.test.last_action_at = '';
      this.test.mode = undefined;
      this.attempt = null;
    },
    async saveScore() {
      try {
        const answers = [];

        for (let i = 0; i < this.freeAnswerTasks.length; i++) {
          const info = this.freeAnswerTasks[i];
          const answer = JSON.parse(JSON.stringify(info.answer));

          if (!answer.id) {
            continue;
          }

          if (typeof answer.answer.maxScore !== 'number') {
            answer.answer.maxScore = info.maxScore;
          }

          if (useUserStore().logged) {
            const response = await useApi(`/api/answer/${answer.id}/patch`, {
              ...methodPatch,
              body: {
                answer: JSON.stringify(answer.answer)
              }
            });

            if (response.data.done) {
              const newAnswer = {...answer};
              newAnswer.score = newAnswer.answer.score;

              if (newAnswer.score > 0) {
                newAnswer.result = 'correct';
              } else {
                newAnswer.result = 'wrong';
              }

              answers.push(newAnswer);
            }
          } else {
            localServer.patchAnswer(answer.id, {
              answer: answer.answer
            }, true, info.task);

            const newAnswer = {...answer};
            newAnswer.score = newAnswer.answer.score;

            if (newAnswer.score > 0) {
              newAnswer.result = 'correct';
            } else {
              newAnswer.result = 'wrong';
            }

            answers.push(newAnswer);
          }
        }

        answers.forEach((answer) => {
          this.setAnswer(answer.task_id, answer);
        });
      } catch (e) {
        console.log(e.message);
      }
    },
    async sendScore() {
      try {
        const answers = [];

        for (let i = 0; i < this.freeAnswerTasks.length; i++) {
          const info = this.freeAnswerTasks[i];
          const answer = info.answer;

          if (!answer || !answer.id) {
            continue;
          }

          let response = await useApi('/api/expertise_free_answer/send_to_expertise', {
            ...methodPost,
            body: {
              answer_id: answer.id
            }
          });

          if (response.data.done) {
            response = await useApi(`/api/task/${answer.task_id}/answer/last`, {...methodGet});

            if (response.data.done) {
              const newAnswer = {...answer};
              newAnswer.answer_expertises_id = response.data.answer.answer_expertises_id;
              answers.push(newAnswer);
            }
          }

          answers.forEach((answer) => {
            this.setAnswer(answer.task_id, answer);
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    },
    reset() {
      this.test = {};
      this.themes = [];
      this.attempts = [];
      this.attempt = null;
      this.answers = [];
      this.recommendedTests = [];
      this.fetching = false;
    },
  }
});
