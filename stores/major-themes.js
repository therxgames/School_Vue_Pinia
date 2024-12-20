import { defineStore } from "pinia";

export default defineStore({
  id: "task-theme",
  state() {
    return {
      themes: [
        {
          id: 1,
          maxCount: 21,
          counter: 0,
          checked: false,
          label: "Эту тему",
        },
        {
          id: 2,
          maxCount: 28,
          counter: 0,
          checked: false,
          label: "И немного этой",
        },
        {
          id: 3,
          maxCount: 16,
          counter: 0,
          checked: false,
          label: "Может быть и вот эту",
        },
      ],
    };
  },
  getters: {
    tasksCount() {
      return this.themes.reduce((acc, item) => acc + item.maxCount, 0);
    },
    getById() {
      return (id) => this.themes.find((item) => item.id === id);
    },
  },
  actions: {
    countIncrement(id) {
      const theme = this.getById(id);

      theme.counter++;
      theme.checked = true;
    },
    countDecrement(id) {
      const theme = this.getById(id);

      theme.counter--;
      if (theme.counter === 0) {
        theme.checked = false;
      }
    },
    themesCheckedLength() {
      return this.themes.filter((item) => item.checked).length;
    },
    tasksCheckedCount() {
      return this.themes.reduce((acc, item) => acc + item.counter, 0);
    },
    selectAllTask(id) {
      const item = this.getById(id);
      if (item.checked) {
        item.counter = item.maxCount;
      } else {
        item.counter = 0;
      }
    },
    countChange(value, id) {
      const item = this.getById(id);
      if (value > item.maxCount) item.counter = item.maxCount;
      if (value < 0) item.counter = 0;
    },
  },
});
