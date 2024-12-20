import {defineStore} from 'pinia';
import _cloneDeep from 'lodash.clonedeep';
import _isEqual from 'lodash.isequal';
import useUserStore from '~/stores/user';

export default defineStore({
  id: 'library-subjects',

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
      return {
        build: {
          autoloadParts: false,
          onBuild(apiQuery) {
            if ('sort' in apiQuery) {
              delete apiQuery.sort;
            }

            if ('page' in apiQuery) {
              delete apiQuery.page;
            }

            return apiQuery;
          },
        },
        sync: {
          //skip: ['classes', 'attestation'],
          apiPath: '/api/filters/task',
          onDataItemChange(filterItem, dataItem, index) {
            dataItem.hidden = filterItem?.hideWhenItDisable && dataItem?.disabled;
          }
        }
      };
    },
    content() {
      let content = 'subjects';

      if (this.getFilterValue('subjects').length === 0) {
        content = 'subjects';
      }

      if (this.getFilterValue('subjects').length > 0) {
        content = 'themes';
      }

      return content;
    },
    fetchApiMeta() {
      switch (this.content) {
        case 'subjects':
          return {
            path: '/api/subjects/tasks_count',
            dataField: 'subjects'
          };
        case 'themes':
          return {
            path: '/api/topics/tasks_count',
            dataField: 'topics'
          };
      }
    },
    getTasksListByClasses() {
      if (this.content !== 'subjects') {
        return [];
      }

      let tasksList = [];

      const classes = {};

      this.list.forEach((item) => {
        if ( !classes[`class-${item.parallel_id}`] ) {
          classes[`class-${item.parallel_id}`] = {
            class: item.parallel_id,
            subjects: []
          };
        }
        classes[`class-${item.parallel_id}`].subjects.push(item);
      });

      tasksList = Object.values(classes);

      return tasksList;
    },
    getThemeListByClasses() {
      if (this.content !== 'themes') {
        return [];
      }

      let themesList = [];

      const classes = {};

      this.list.forEach((item) => {
        if ( !classes[`class-${item.parallel_id}`] ) {
          classes[`class-${item.parallel_id}`] = {
            class: item.parallel_id,
            themes: []
          };
        }
        classes[`class-${item.parallel_id}`].themes.push(item);
      });

      themesList = Object.values(classes);

      return themesList;
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
        const response = await useApi(this.fetchApiMeta.path, {
          ...methodGet,
          query
        });

        if (response.data.done) {
          this.list = [...response.data[this.fetchApiMeta.dataField]];
        }
      } catch (e) {
        console.error(e.message);
      }

      this._cache.lastContent = this.content;
      this.fetching = false;
      this.contentRev = generateString();
    },
    async setup() {
      this.setuped = true;

      this.filters.subjects.hideWhenItDisable = true;
      this.filters.years.hideWhenItDisable = true;
    },
    reset(options = {list: true, filters: false, watchers: false, all: false}) {
      if (options.watchers || options.all) {
        this.fw();
        this.fq();
      }
      if (options.list || options.all) {
        this.list = [];
      }
      if (options.filters || options.all) {
        this.resetFilters();
      }

      this._cache.lastContent = null;
    },
    ...mixins.stores.filters.actions
  }
});
