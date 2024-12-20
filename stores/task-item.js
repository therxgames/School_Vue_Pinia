import {defineStore} from 'pinia';

export default (id) => {
  return defineStore('task-item-' + id, {
    state() {
      return {
        id,
        taskType: null,
        expertise: {
          id: null,
          point: null,
          comment: null
        },
        answers: []
      };
    },
    actions: {
      async postView(parent_id) {
        try {
          await useApi(`/api/task/${parent_id}/views`, {...methodPost});
        } catch (e) {
          console.error(e.message);
        }
      },
      async fetchAnswers(id) {
        try {
          const response = await useApi(`/api/task/${id}/answers`, {...methodGet});

          if (response.data.done) {
            this.answers = response.data.answers;
          }
        } catch (e) {
          console.error(e.message);
        }
      },
      async changeFavorite(isFavorite) {
        try {
          const response = await useApi(`/api/task/${this.id}/status`, {
            ...methodPatch,
            body: {is_favorite: isFavorite}
          });

          if (response.data.done) {
            return !isFavorite;
          } else {
            return isFavorite;
          }
        } catch (e) {
          console.error(e.message);
          return isFavorite;
        }
      },
      async fetchTaskType() {
        try {
          const response = await useApi(`/api/task/${id}`, {...methodGet});
          this.taskType = response.data.task.type;
        } catch (e) {
          console.error(e.message);
        }
      },
      reset() {
        this.answer = null;
        this.result = null;
        this.answers = [];
      }
    }
  });
};
