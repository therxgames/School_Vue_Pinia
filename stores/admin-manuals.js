import {defineStore} from 'pinia';

export default defineStore({
  id: 'admin-manuals',
  state() {
    return {
      manuals: {}
    };
  },
  getters: {
    manual() {
      return async (id, force = false) => {
        if (!this.manuals[id] || force) {
          await this.fetchManual(id);
        }
        return this.manuals[id];
      };
    }
  },
  actions: {
    async fetchManual(id) {
      try {
        const response = await useApi(`/api/registry_references/${id}`, {
          method: 'GET'
        });
        if (response.data.done) {
          this.manuals[response.data.data.id] = response.data.data;
        }
      } catch (e) {
        console.log('Ошибка получения словаря', e);
      }
    }
  }
});
