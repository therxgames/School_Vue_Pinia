import {defineStore} from 'pinia';
import _cloneDeep from 'lodash.clonedeep';
import _isEqual from 'lodash.isequal';
import useUserStore from '~/stores/user';
import useCommonStore from '~/stores/common';

export default defineStore({
  id: 'search',

  state() {
    return {
      list: [],
      themes: [],
      counters: {
        all: 0,
        tasks: 0,
        tests: 0
      },
      fetching: false,
      fetchEnabled: true,
      setuped: false,
      comesFrom: null,
      lastNextOffset: 0,
      lastPage: 1,
      contentRev: null,
      ..._cloneDeep(mixins.stores.filters.state)
    };
  },

  getters: {
    filtersOptions() {
      const self = this;

      return {
        build: {
          onBuild(apiQuery) {
            return apiQuery;
          }
        },
        filtersInvolved() {
          return self.getFilterValue('classes').length > 0
            || self.getFilterValue('subjects').length > 0
            || self.getFilterValue('years').length > 0
            || self.getFilterValue('status') !== null
            || self.getFilterValue('complexity').length > 0
            || self.getFilterValue('type').length > 0
            || self.getFilterValue('part').length > 0
            || self.getFilterValue('attestation') !== null;
        },
        sync: {
          apiPath() {
            if (self.getFilterValue('content') === 'tasks') {
              return '/api/filters/task';
            }

            if (self.getFilterValue('content') === 'tests') {
              return '/api/filters/test';
            }
          },
          onDataItemChange(filterItem, dataItem, index) {
            dataItem.hidden = filterItem?.hideWhenItDisable && dataItem?.disabled;
          }
        }
      };
    },
    fetchApiMeta() {
      switch (this.filters.content.value) {
        case 'tasks':
          return {
            apiPath: '/api/content/tasks'
          };
        case 'tests':
          return {
            apiPath: '/api/content/tests'
          };
        case 'all':
        default:
          return {
            apiPath: '/api/content/all'
          };
      }
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

      const offset = this.lastPage + 1 === this.filters.page.current && this.filters.content.value === 'all'
        ? {offset: this.lastNextOffset}
        : null;

      const query = {
        ...this.builtFilters,
        ...offset
      };

      await this.syncFiltersWithContent();

      try {
        const response = await useApi(this.fetchApiMeta.apiPath, {
          ...methodGet,
          query
        });
        if (response.data.done) {
          if (this.filters.page.append === true) {
            listLast(this.list).delimiterAfter = true;
            listLast(this.list).page = this.filters.page.current;
            this.list = [...this.list, ...response.data.content];
          } else {
            this.list = [...response.data.content];
          }
          this.lastNextOffset = response.data.next_offset;
        }

        this.counters.tasks = response.data.total.tasks || 0;
        this.counters.tests = response.data.total.tests || 0;
        this.counters.all = response.data.total.all || 0;

        this.filters.page.total = this.counters[this.filters.content.value];
        this.filters.page.last_page = response.data.last_page;
        this.filters.page.append = false;
      } catch (e) {
        console.error('searchStore -> fetch', e.message);
      }

      this.lastPage = this.filters.page.current;
      this.fetching = false;
      this.contentRev = generateString();
    },
    async setup() {
      await this.setFilterValue('order', getUserSetting('search.sort.by', 'popular'));

      this.filters.content.data.unshift({id: 'all', name: 'Все'});
      this.filters.content.value = 'all';
      this.filters.content.default = 'all';

      this.filters.q.canReset = false;
      this.filters.mode.canReset = false;

      this.filters.subjects.hideWhenItDisable = true;
      this.filters.years.hideWhenItDisable = true;

      this.setuped = true;
    },
    async addToFavorite(id) {
      let apiPath = null;
      const contentType = this.itemByParentId[id].content_type;
      if (contentType === 'task') {
        apiPath = '/api/task/{id}/status';
      } else if (contentType === 'test') {
        apiPath = '/api/test/{id}/status';
      }
      const response = await useCommonStore().addToFavorite(id, apiPath);
      if (response.data.done) {
        this.itemByParentId[id].is_favorite = true;
      }
      return response.data.done;
    },
    async removeFromFavorite(id) {
      let apiPath = null;
      const contentType = this.itemByParentId[id].content_type;
      if (contentType === 'task') {
        apiPath = '/api/task/{id}/status';
      } else if (contentType === 'test') {
        apiPath = '/api/test/{id}/status';
      }
      const response = await useCommonStore().removeFromFavorite(id, apiPath);
      if (response.data.done) {
        this.itemByParentId[id].is_favorite = false;
      }
      return response.data.done;
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

      if (options.all) {
        this.counters.tasks = 0;
        this.counters.tests = 0;
        this.counters.all = 0;
      }

      this.presets = {};
      this.fetching = false;
      this.lastNextOffset = 0;
      this.lastPage = 1;
    },
    ...mixins.stores.filters.actions
  }
});
