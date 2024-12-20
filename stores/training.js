import {defineStore} from 'pinia';
import useCommonStore from '~/stores/common';
import useUserStore from '~/stores/user';
import _isEqual from 'lodash.isequal';
import _cloneDeep from 'lodash.clonedeep';

export default defineStore({
  id: 'training',

  state() {
    return {
      list: [],
      hasCollection: false,
      fetching: false,
      setuped: false,
      contentRev: null,
      ..._cloneDeep(mixins.stores.filters.state)
    };
  },

  getters: {
    testById() {
      return (id) => this.list?.find((test) => test.id === id);
    },
    filtersOptions() {
      return {
        build: {
          onBuild(apiQuery) {
            if ('has_correct_answer' in apiQuery) {
              apiQuery.is_finished = apiQuery.has_correct_answer;
            }

            return apiQuery;
          }
        },
        sync: {
          apiPath: '/api/filters/test',
          onDataItemChange(filterItem, dataItem, index) {
            dataItem.hidden = filterItem?.hideWhenItDisable && dataItem?.disabled;
          }
        }
      };
    },
    itemById() {
      return this.list.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
    },
    itemByParentId() {
      return this.list.reduce((acc, item) => {
        acc[item.parent_id] = item;
        return acc;
      }, {});
    },
    ...mixins.stores.filters.getters
  },

  actions: {
    setTestField(id, key, name) {
      const test = this.testById(id);

      if (test) {
        test[key] = name;
      }
    },
    async invoke({onFetch = () => null, onUpdateRoute = () => null}) {
      this.rw = watch(
        () => JSON.stringify({
          query: useRouter().currentRoute.value.query,
          name: useRouter().currentRoute.value.name
        }),
        (n, o) => {
          if (JSON.parse(n).name !== JSON.parse(o).name) {
            return this.rw();
          }
          if (_isEqual({}, JSON.parse(n).query)) {
            this.resetFilters();
          }
        }
      );

      this.fw = watch(
        () => JSON.stringify({
          query: this.filtersQuery,
          user: useUserStore().entity,
          role: useUserStore().currentRole
        }),
        async (n, o) => {
          const payloadNew = JSON.parse(n);
          const payloadOld = JSON.parse(o);

          if (_isEqual(payloadNew, payloadOld)) {
            return;
          }

          await onUpdateRoute(payloadNew);
          await onFetch(payloadNew);
        }
      );

      this.fq = watch(
        () => JSON.stringify(this.filtersQuery),
        (n, o) => {
          this.queriesTimeline[0] = o;
          this.queriesTimeline[1] = n;
        }
      );
    },
    async fetch(options = {resetBefore: false, query: null}) {
      this.fetching = true;

      await this.getOrFetchFilters();

      if (!this.setuped) {
        await this.setup();
      }

      await this.mergeFiltersWith(options?.query);

      if (options?.resetBefore) {
        this.list = [];
      }

      const query = {...this.builtFilters};

      await this.syncFiltersWithContent();

      try {
        const response = await useApi('/api/tests', {...methodGet, query});
        if (response.data.done) {
          if (this.filters.page.append === true) {
            listLast(this.list).delimiterAfter = true;
            listLast(this.list).page = this.filters.page.current;
            this.list = [...this.list, ...response.data.tests];
          } else {
            this.list = [...response.data.tests];
          }

          this.filters.page.total = response.data.total;
          this.filters.page.last_page = response.data.last_page;
          this.filters.page.append = false;
        }
      } catch (e) {
        console.error(e.message);
      }

      this.fetching = false;
      this.contentRev = generateString();
    },
    async fetchUserTests() {
      if (!useUserStore().logged) {
        return;
      }

      try {
        const response = await useApi('/api/tests', {
          ...methodGet,
          query: {type: 'usertest'}
        });

        if (response.data.done) {
          this.hasCollection = response.data.total > 0;
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async setup() {
      this.filters.order.value = getUserSetting('training.sort.by', 'popular');

      if (!useUserStore().logged) {
        this.filters.category.value = 'demovariant';
      }

      this.filters.subjects.hideWhenItDisable = true;
      this.filters.years.hideWhenItDisable = true;

      this.setuped = true;
    },
    async testExists(id) {
      try {
        const response = await useApi(`/api/test/${id}/name`, {...methodGet});
        return response.data.done && response.data.name;
      } catch (e) {
        return false;
      }
    },
    async testCanBeAdded(id) {
      try {
        const response = await useApi(`/api/test/${id}/ownership`, {...methodGet});
        if (response.data.done) {
          return response.data.test.type === 'usertest'
            && !response.data.test.is_mine
            && !response.data.test.in_collection
            && !response.data.test.in_ownership_archive
        }
        return false;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    },
    async addToFavorite(id) {
      const response = await useCommonStore().addToFavorite(id, '/api/test/{id}/status');
      if (response.data.done) {
        this.filters.category.value === 'usertest'
          ? this.itemById[id].is_favorite = true
          : this.itemByParentId[id].is_favorite = true;
      }
    },
    async removeFromFavorite(id) {
      const response = await useCommonStore().removeFromFavorite(id, '/api/test/{id}/status');
      if (response.data.done) {
        this.filters.category.value === 'usertest'
          ? this.itemById[id].is_favorite = false
          : this.itemByParentId[id].is_favorite = false;
      }
    },
    async addToArchive(id) {
      try {
        const response = await useApi(`/api/test/${id}/status`, {
          ...methodPatch,
          body: {in_archive: true}
        });
        if (response.data.done) {
          this.itemById[id].in_archive = true;
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async removeFromArchive(id) {
      try {
        const response = await useApi(`/api/test/${id}/status`, {
          ...methodPatch,
          body: {in_archive: false}
        });
        if (response.data.done) {
          this.itemById[id].in_archive = false;
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async removeFromCollection(id) {
      try {
        const response = await useApi(`/api/test/${id}/in_collection`, {
          ...methodPut,
          body: {in_collection: false}
        });
        return response.data.done;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    },
    reset(options = {list: true, pagination: true, filters: false, watchers: false, all: false}) {
      if (options.watchers || options.all) {
        this.fw();
        this.fq();
      }

      if (options.list || options.all) {
        this.list = [];
      }

      if (options.pagination || options.all) {
        this.resetPagination();
      }

      if (options.filters || options.all) {
        this.resetFilters();
      }
    },
    ...mixins.stores.filters.actions
  }
});
