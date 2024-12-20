import {defineStore} from 'pinia';
import useUserStore from '~/stores/user';

const getDefaultAnswer = () => {
  return {
    id: null,
    answer: null,
    files: null
  };
};

const getDefaultState = () => {
  return {
    task: null,
    recommendedTasks: [],
    containingTests: [],
    nextTaskId: 0,
    answer: getDefaultAnswer()
  };
};

export default defineStore({
  id: 'task',
  state() {
    return getDefaultState();
  },
  getters: {
    recommendedTaskById() {
      return (id) => this.recommendedTasks?.find((task) => task.id === id);
    }
  },
  actions: {
    setTaskField(key, value) {
      if (this.task) {
        this.task[key] = value;
      }
    },
    setRecommendedTaskField(id, key, value) {
      const task = this.recommendedTaskById(id);

      if (task) {
        task[key] = value;
      }
    },
    setAnswer(value) {
      this.answer = value;
    },
    resetAnswer() {
      this.answer = {
        id: null,
        answer: null,
        files: null
      };
    },
    async addAnswer() {
      if (!this.task) {
        return;
      }

      if (useUserStore().logged) {
        const formData = new FormData();
        formData.append('answer', JSON.stringify(this.answer.answer));
        formData.append('check', true);

        if (this.answer.files) {
          this.answer.files.forEach((file) => {
            formData.append('files[]', file);
          });
        }

        try {
          let response = await useApi(`/api/task/${this.task.id}/answer`, {formData});

          if (response.data.done) {
            this.answer.result = response.data.result;
            this.answer.id = response.data.id;

            if (this.answer.files) {
              this.answer.filenames = this.answer.files.map((file) => {
                return {
                  filename: URL.createObjectURL(file),
                  original_name: file.name,
                  filesize: file.size
                };
              });
            }
          }
        } catch (e) {
          console.error(e.message);
        }
      } else {
        const response = await localServer.addAnswer(0, this.task.id, this.task.version_number, this.answer.answer, this.answer.files, true, this.task);

        if (response) {
          this.answer.result = response.result;
          this.answer.id = response.id;

          if (this.answer.files) {
            this.answer.filenames = this.answer.files.map((file) => {
              return {
                filename: URL.createObjectURL(file),
                original_name: file.name,
                filesize: file.size
              };
            });
          }
        }
      }
    },
    async patchAnswer() {
      if (!this.task || !this.answer.id) {
        return;
      }

      if (this.task.type === 'FREE_ANSWER' && typeof this.answer.answer.maxScore !== 'number') {
        this.answer.answer.maxScore = this.task.maxScore;
      }

      if (useUserStore().logged) {
        try {
          const response = await useApi(`/api/answer/${this.answer.id}/patch`, {
            ...methodPatch,
            body: {
              answer: JSON.stringify(this.answer.answer)
            }
          });

          if (response.data.done) {
            this.answer.score = this.answer.answer.score;

            if (this.answer.score > 0) {
              this.answer.result = 'correct';
            } else {
              this.answer.result = 'wrong';
            }
          }
        } catch (e) {
          console.error(e.message);
        }
      } else {
        localServer.patchAnswer(this.answer.id, {answer: this.answer.answer}, true, this.task);

        this.answer.score = this.answer.answer.score;

        if (this.answer.score > 0) {
          this.answer.result = 'correct';
        } else {
          this.answer.result = 'wrong';
        }
      }
    },
    async sendToExpertise() {
      if (!this.task || !this.answer.id) {
        return;
      }

      try {
        let response = await useApi('/api/expertise_free_answer/send_to_expertise', {
          ...methodPost,
          body: {
            answer_id: this.answer.id
          }
        });

        if (response.data.done) {
          response = await useApi(`/api/task/${this.task.id}/answer/last`);

          if (response.data.done) {
            this.answer = response.data.answer;
          }
        }

        return response.data.done;
      } catch (e) {
        console.error(e.message);
      }
    },
    async fetch(id, options = {task: true, answer: true, recommendedTasks: true, containingTests: true, nextTaskId: true}) {
      const data = getDefaultState();

      if (options?.task !== false) {
        data.task = await this.getTask(id);
      }

      if (options?.answer !== false && data.task) {
        data.answer = await this.getAnswer(data.task.parent_id, data.task.version_number);
      }

      if (options?.recommendedTasks !== false) {
        data.recommendedTasks = await this.getRecommendedTasks(id);
      }

      if (options?.containingTests !== false) {
        data.containingTests = await this.getContainingTests(id);
      }

      if (options?.nextTaskId !== false) {
        data.nextTaskId = await this.getNextTaskId(id);
      }

      this.task = data.task;
      this.answer = data.answer;
      this.recommendedTasks = data.recommendedTasks;
      this.containingTests = data.containingTests;
      this.nextTaskId = data.nextTaskId;
    },
    async getTask(id) {
      try {
        const response = await useApi(`/api/task/${id}`);

        if (response.data.done) {
          return await processRawTask(response.data.task);
        }
      } catch (e) {
        console.error(e.message);
        return null;
      }
    },
    async getAnswer(id, versionNumber) {
      if (useUserStore().logged) {
        try {
          const response = await useApi(`/api/task/${id}/answers`);

          if (response.data.done) {
            const actualAnswers = response.data.answers
              .filter((answerItem) => answerItem.task_version_number === versionNumber)
              .sort((a, b) => b.id - a.id);

            return actualAnswers[0] || getDefaultAnswer();
          }
        } catch (e) {
          console.error(e.message);
          return getDefaultAnswer();
        }
      } else {
        const answers = await localServer.getAnswers({task_parent_id: id, test_id: 0});
        const actualAnswers = answers
          .filter((answerItem) => answerItem.task_version_number === versionNumber);
        return actualAnswers[0] || getDefaultAnswer();
      }
    },
    async getRecommendedTasks(id) {
      try {
        const response = await useApi(`/api/task/${id}/recommended`);

        if (response.data.done) {
          return response.data.tasks;
        }
      } catch (e) {
        console.error(e.message);
        return [];
      }
    },
    async getContainingTests(id) {
      try {
        const response = await useApi(`/api/task/${id}/demovariants`);

        if (response.data.done) {
          return response.data.tests;
        }
      } catch (e) {
        console.log(e.message);
        return [];
      }
    },
    async getNextTaskId(id) {
      try {
        const response = await useApi(`/api/task/${id}/next`);

        if (response.data.done) {
          return response.data.next_id;
        }
      } catch (e) {
        console.error(e.message);
        return 0;
      }
    }
  }
});
