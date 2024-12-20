import {defineStore} from 'pinia';
import _cloneDeep from 'lodash.clonedeep';

export default defineStore('test', {
  id: 'test-setting',
  state() {
    return {
      test: {},
      subjects: [],
      fetching: false,
      updating: false,
      setuped: false,
      ..._cloneDeep(mixins.stores.filters.state)
    };
  },
  getters: {
    filtersOptions() {
      return {};
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
        let response1 = await useApi(`/api/test/${id}`, {...methodGet});
        let response2 = await useApi(`/api/tests/ref_fields`, {...methodGet});

        if (response1.data.done) {
          this.test = response1.data.test;
        }
        if (response2.data.done) {
          this.subjects = response2.data.data.subjectIds;
        }
      } catch (e) {
        console.error(e.message);
      } finally {
        this.fetching = false;
      }
    },
    async editTest(data) {
      this.updating = true;

      try {
        const response = await useApi('/api/tests/update', {
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
    ...mixins.stores.filters.actions
  }
});
