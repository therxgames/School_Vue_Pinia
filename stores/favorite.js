import {defineStore} from 'pinia';
import useCommonStore from '~/stores/common';
import _cloneDeep from 'lodash.clonedeep';
import _isEqual from 'lodash.isequal';
import useUserStore from '~/stores/user';

export default defineStore({
  id: 'favorite',

  state() {
    return {
      list: [],
      fetching: false,
      setuped: false,
      contentRev: null,
      _cache: {
        lastContent: null
      },
      ..._cloneDeep(mixins.stores.filters.state)
    };
  },

  getters: {
    filtersOptions() {
      const self = this;

      return {
        build: {
          onBuild(apiQuery) {
            let statusFilter = apiQuery.status || '';
            statusFilter = statusFilter.split(',').filter((status) => !!status);
            statusFilter.push('favorite');
            apiQuery.status = statusFilter.join(',');
            return apiQuery;
          }
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
            if (dataItem.id === 'favorite') {
              dataItem.hidden = true;
              return;
            }

            dataItem.hidden = filterItem?.hideWhenItDisable && dataItem?.disabled;
          }
        },
      };
    },
    itemById() {
      return this.list.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
    },
    content() {
      return this.filters.content.value;
    },
    apiMeta() {
      return {
        fetch: {
          ...this.content === 'tasks' ? {
            path: '/api/tasks',
            dataField: 'tasks'
          } : {
            path: '/api/tests',
            dataField: 'tests'
          }
        },
        favorite: {
          ...this.content === 'tasks' ? {
            path: '/api/task/{id}/status'
          } : {
            path: '/api/test/{id}/status'
          }
        }
      };
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

      if (options?.resetBefore || this.content !== this._cache.lastContent) {
        this.list = [];
      }

      const query = {...this.builtFilters};

      await this.syncFiltersWithContent();

      try {
        const response = await useApi(this.apiMeta.fetch.path, {
          ...methodGet,
          query
        });
        if (response.data.done) {
          if (this.filters.page.append === true) {
            listLast(this.list).delimiterAfter = true;
            listLast(this.list).page = this.filters.page.current;
            this.list = [...this.list, ...response.data[this.apiMeta.fetch.dataField]];
          } else {
            this.list = [...response.data[this.apiMeta.fetch.dataField]];
          }

          this.filters.page.total = response.data.total;
          this.filters.page.last_page = response.data.last_page;
          this.filters.page.append = false;
        }
      } catch (e) {
        console.error(e.message);
      }

      this._cache.lastContent = this.filters.content.value;
      this.fetching = false;
      this.contentRev = generateString();
    },
    async setup() {
      this.filters.content.value = getUserSetting('favorite.filters.content', 'tasks');
      this.filters.order.value = getUserSetting('favorite.sort.by', 'popular');
      let favoriteStatus = this.filters.status.data.find((data) => data.id === 'favorite');
      favoriteStatus.hidden = true;

      this.filters.subjects.hideWhenItDisable = true;
      this.filters.years.hideWhenItDisable = true;

      this.setuped = true;
    },
    async removeFromFavorite(id) {
      const response = await useCommonStore().removeFromFavorite(id, this.apiMeta.favorite.path);
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
        this.pagination = {
          total: 0,
          current: 1,
          last_page: 0,
          per_page: 20
        };
      }

      if (options.filters || options.all) {
        this.resetFilters();
      }

      this._cache.lastContent = null;
    },
    ...mixins.stores.filters.actions
  }
});
