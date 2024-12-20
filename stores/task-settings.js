import {defineStore} from 'pinia';
import _cloneDeep from 'lodash.clonedeep';

export default defineStore({
  id: 'task-setting',
  state() {
    return {
      task: {},
      themes: [],
      fetching: false,
      updating: false,
      setuped: false,
      versions: [],
      ..._cloneDeep(mixins.stores.filters.state)
    };
  },
  getters: {
    filtersOptions() {
      return {};
    },
    currentVersion() {
      return this.versions.find((version) => version.status_id === 2);
    },
    ...mixins.stores.filters.getters
  },
  actions: {
    async fetch(id) {
      this.fetching = true;

      if (!this.setuped) {
        await this.setup();
      }

      try {
        let response1 = await useApi(`/api/task/${id}`, {...methodGet});
        let response2 = await useApi(`/api/tasks/ref_fields`, {...methodGet});

        if (response1.data.done) {
          this.task = response1.data.task;
        }
        if (response2.data.done) {
          this.themes = response2.data.data.themeIds;
        }

        await this.fetchVersions();

      } catch (e) {
        console.error(e.message);
      } finally {
        this.fetching = false;
      }
    },
    async editTask(data) {
      this.updating = true;

      try {
        const response = await useApi('/api/tasks/update', {
          ...methodPut,
          body: data
        });
        return response.data.done;
      } catch (e) {
        console.error(e.message);
      }

      this.updating = false;
    },
    async setup() {
      await this.getOrFetchFilters();
      this.setuped = true;
    },
    async fetchVersions() {
      try {
        const response = await useApi(`/api/task/${this.task.parent_id}/versions`, {...methodGet});
        if (response.data.done) {
          this.versions = response.data.versions;
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    reset() {
      this.task = {};
      this.themes = [];
      this.versions = [];
      this.fetching = false;
      this.updating = false;
      this.setuped = false;
    },
    ...mixins.stores.filters.actions
  }
});
