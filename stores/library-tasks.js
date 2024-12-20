import {defineStore} from 'pinia';
import useCommonStore from '~/stores/common';
import useUserStore from '~/stores/user';
import _cloneDeep from 'lodash.clonedeep';
import _isEqual from 'lodash.isequal';

export default defineStore({
  id: 'library-tasks',

  state() {
    return {
      list: [],
      fetching: false,
      setuped: false,
      contentRev: null,
      ..._cloneDeep(mixins.stores.filters.state)
    };
  },

  getters: {
    filtersOptions() {
      const self = this;

      return {
        build: {
          onApiQueryBegin() {
            if (self.fetching && !self.contentRev && !self.filtersInvolved) {
              self.filters.attestation.value = 'oge';
            }
          }
        },
        sync: {
          apiPath: '/api/filters/task',
          onDataItemChange(filterItem, dataItem, index) {
            dataItem.hidden = (filterItem?.hideWhenItDisable && dataItem?.disabled) || false;
          }
        },
      };
    },
    taskById() {
      return (id) => {
        return this.list?.find((task) => task.id === id);
      };
    },
    taskByParentId() {
      return this.list.reduce((acc, item) => {
        acc[item.parent_id] = item;
        return acc;
      }, {});
    },
    ...mixins.stores.filters.getters
  },

  actions: {
    setTaskField(id, key, name) {
      const task = this.taskById(id);

      if (task) {
        task[key] = name;
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
          const payloadNew = n ? JSON.parse(n) : {};
          const payloadOld = o ? JSON.parse(o) : {};

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
        await this.setup(options);
      }

      await this.mergeFiltersWith(options?.query);

      if (options?.resetBefore) {
        this.list = [];
      }

      const query = {...this.builtFilters};

      await this.syncFiltersWithContent();

      try {
        const response = await useApi('/api/tasks', {...methodGet, query});

        if (response.data.done) {
          if (this.filters.page.append === true) {
            listLast(this.list).delimiterAfter = true;
            listLast(this.list).page = this.filters.page.current;
            this.list = [...this.list, ...response.data.tasks];
          } else {
            this.list = [...response.data.tasks];
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
    async setup(options = {}) {
      this.filters.order.value = getUserSetting('library.tasks.sort.by', 'popular');

      this.filters.subjects.hideWhenItDisable = true;
      this.filters.years.hideWhenItDisable = true;

      this.setuped = true;
    },
    async addToFavorite(id) {
      const response = await useCommonStore().addToFavorite(id);
      if (response.data.done) {
        this.taskByParentId[id].is_favorite = true;
      }
    },
    async removeFromFavorite(id) {
      const response = await useCommonStore().removeFromFavorite(id);
      if (response.data.done) {
        this.taskByParentId[id].is_favorite = false;
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
      this.contentRev = null;
    },
    ...mixins.stores.filters.actions
  }
});
