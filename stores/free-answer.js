import {defineStore} from 'pinia';

export default defineStore({
  id: 'free-answer',

  state() {
    return {
      files: [],
      filesEvent: [],
      wrongFiles: []
    };
  },

  getters: {
    selectFilesEvent() {
      return [...this.filesEvent].filter((f) => f.select);
    }
  }
});
