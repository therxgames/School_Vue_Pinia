import {defineStore} from 'pinia';
import useUserStore from '~/stores/user';

export default defineStore({
  id: 'task-view',
  state() {
    return {
      task: {},
      recommendedTasks: [],
      containingTests: [],
      nextTaskId: 0,
      answer: {
        id: null,
        answer: null,
        files: null
      },
      fetching: false,
      switchVersionTrigger: null
    };
  },
  actions: {
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
      if (!this.answer.id) {
        return;
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
        await localServer.patchAnswer(this.answer.id, {answer: this.answer.answer}, true, this.task);

        this.answer.score = this.answer.answer.score;

        if (this.answer.score > 0) {
          this.answer.result = 'correct';
        } else {
          this.answer.result = 'wrong';
        }
      }
    },
    async sendToExpertise() {
      if (!this.answer.id) {
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
          response = await useApi(`/api/task/${this.task.id}/answer/last`, {...methodGet});

          if (response.data.done) {
            this.answer = response.data.answer;
          }
        }

        return response.data.done;
      } catch (e) {
        console.error(e.message);
      }
    },
    async fetch(id, options = {
      fetchAnswers: true,
      fetchRecommended: true,
      fetchContainingTests: true
    }) {
      this.fetching = true;
      await this.fetchTask(id);
      if (options?.fetchAnswers !== false) {
        await this.fetchAnswers(this.task.parent_id);
      }
      if (options?.fetchRecommended !== false) {
        await this.fetchRecommended(id);
      }
      if (options?.fetchContainingTests !== false) {
        await this.fetchContainingTests(id);
      }
      await this.fetchNextTask(id);
      this.fetching = false;
    },
    async fetchTask(id) {
      try {
        const response = await useApi(`/api/task/${id}`, {...methodGet});
        if (response.data.done) {
          this.task = response.data.task;
          this.task.answer = JSON.parse(this.task.answer);
          this.task.variants = shuffleTaskVariants(this.task);
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async fetchAnswers(id) {
      if (useUserStore().logged) {
        try {
          const response = await useApi(`/api/task/${id}/answers`, {...methodGet});

          if (response.data.done) {
            this.resetAnswer();

            const actualAnswers = response.data.answers
              .filter((answerItem) => answerItem.task_version_number === this.task.version_number)
              .sort((a, b) => b.id - a.id);

            this.answer = actualAnswers[0] || this.answer;
          }
        } catch (e) {
          console.error(e.message);
        }
      } else {
        const answers = await localServer.getAnswers({task_parent_id: id, test_id: 0});

        if (answers) {
          this.resetAnswer();

          const actualAnswers = answers
            .filter((answerItem) => answerItem.task_version_number === this.task.version_number);

          this.answer = actualAnswers[0] || this.answer;
        }
      }
    },
    async fetchRecommended(id) {
      try {
        const response = await useApi(`/api/task/${id}/recommended`, {...methodGet});
        if (response.data.done) {
          this.recommendedTasks = [...response.data.tasks];
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async fetchContainingTests(id) {
      try {
        const response = await useApi(`/api/task/${id}/demovariants`, {...methodGet});
        if (response.data.done) {
          this.containingTests = response.data.tests;
          this.task.demovariant_themes = this.containingTests;
        }
      } catch (e) {
        console.log(e.message);
      }
    },
    async fetchNextTask(id) {
      try {
        const response = await useApi(`/api/task/${id}/next`, {...methodGet});
        if (response.data.done) {
          this.nextTaskId = response.data.next_id;
          return response.data.next_id;
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async toggleFavorite() {
      if (!this.task) {
        return;
      }

      try {
        const response = await useApi(`/api/task/${this.task.parent_id}/status`, {
          ...methodPatch,
          body: {is_favorite: !this.task.is_favorite}
        });
        if (response.data.done) {
          this.task.is_favorite = !this.task.is_favorite;
        }
        return this.task.is_favorite;
      } catch (e) {
        console.error(e.message);
      }
    },
    reset() {
      this.task = {};
      this.recommendedTasks = [];
      this.containingTests = [];
      this.answer = {
        id: null,
        answer: null,
        files: null
      };
      this.fetching = false;
      this.switchVersionTrigger = false;
    }
  }
});
