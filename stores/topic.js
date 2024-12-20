import {defineStore} from 'pinia';

export default defineStore({
  id: 'topic',
  state() {
    return {
      topic: {
        tasks: []
      },
      recommendedTasks: [],
      fetching: false,
      fetched: false,
      fetchingRecommended: false
    };
  },
  getters: {
    title: (state) => state.topic.name ? `Задания на тему: «${state.topic.name}»` : 'Задания на тему',
    taskById() {
      return (id) => this.topic?.tasks?.find((task) => task.id === id);
    },
    recommendedTaskById() {
      return (id) => this.recommendedTasks?.find((task) => task.id === id);
    }
  },
  actions: {
    setTaskField(id, key, value) {
      const task = this.taskById(id);

      if (task) {
        task[key] = value;
      }
    },
    setRecommendedTaskField(id, key, value) {
      const task = this.recommendedTaskById(id);

      if (task) {
        task[key] = value;
      }
    },
    async fetch(id) {
      this.fetching = true;
      await this.fetchTopic(id);
      await this.fetchTopicTasks();
      this.fetching = false;
      this.fetched = true;
    },
    async fetchTopic(id) {
      try {
        const response = await useApi(`/api/topics/${id}`, {...methodGet});

        if (response.data.done) {
          this.topic = {
            ...response.data.topic,
            tasks: []
          };
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async fetchTopicTasks() {
      try {
        const response = await useApi(`/api/topics/${this.topic.id}/tasks`, {...methodGet});

        if (response.data.done) {
          this.topic.tasks = [];

          for (let i = 0; i < response.data.tasks.length; i++) {
            this.topic.tasks.push(await processRawTask(response.data.tasks[i]));
          }
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async fetchRecommended(exclude = []) {
      this.fetchingRecommended = true;

      try {
        const response = await useApi(`/api/topics/${this.topic.id}/recommended`, {
          ...methodGet,
          query: {
            limit: 40,
            ...exclude && exclude.length ? {
              excluded_tasks: exclude
            } : null
          }
        });
        if (response.data.done) {
          this.recommendedTasks = response.data.tasks;
        }
      } catch (e) {
        console.error(e.message);
      }

      this.fetchingRecommended = false;
    }
  }
});
