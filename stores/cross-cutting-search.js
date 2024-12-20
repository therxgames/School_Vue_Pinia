import {defineStore} from 'pinia';
import _cloneDeep from 'lodash.clonedeep';

export default defineStore({
  id: 'cross-cutting-search',

  state() {
    return {
      list: [],
      themes: [],
      changeList: [],
      counters: 0,
      fetching: false,
      fetchEnabled: true,
      setuped: false,
      comesFrom: null,
      lastNextOffset: 0,
      lastPage: 1,
      contentRev: null,
      citySelect: {
        region: null,
      },
      calendar: {
        labels: [],
        row: "day",
        date: [],
        select: 1,
        monthDate: null,
        updated: true,
        activeButtonFilter: 0,
        queryPageCount: 2,
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
    async fetchData(queryParams) {
      this.fetching = true
      const query = {
        page: queryParams.page ?? this.filters.page.current,
        role: 'student',
      };

      if (!!queryParams?.q) {
        query['term'] = queryParams.q
      }

      if (!!queryParams?.sort) {
        query['sort'] = queryParams.sort
      }

      if (!!queryParams?.content) {
        query['source'] = queryParams.content
      } else {
        query['source'] = "material_library"
      }

      if (!!queryParams?.dateFrom) {
        query['dateFrom'] = queryParams.dateFrom
      }

      if (!!queryParams?.dateTo) {
        query['dateTo'] = queryParams.dateTo
      }

      if (!!queryParams?.region) {
        query['region'] = queryParams.region
      }


      try {
        const response = await useApi('/api/search/search', {
          method: 'GET',
          query,
        })
        if (response.data.data) {
          if (this.filters.page.append === true) {
            this.list = [
              ...this.list,
              ...response.data.data.items.filter(item => !this.changeList.includes(item.id))
            ]
          } else {
            this.list = [...response.data.data.items]
          }

          this.filters.page.total = response.data.data.total
          this.filters.page.last_page = Math.ceil(response.data.data.total / response.data.data.pageSize);
          this.filters.page.append = false
        }
      } catch (e) {
        console.log('Ошибка получения данных сквозного поиска', e)
      }

      this.fetching = false
    },
    resetDate() {
      this.calendar.date = [];
    },
    setFilterByKey(keyFilter, value) {
      this.citySelect[keyFilter] = value;
    },
    async invoke() {
    },
    reset(options = {list: true, pagination: true, filters: false, watchers: false, all: false}) {
      if (options.list || options.all) {
        this.list = [];
      }

      if (options.pagination || options.all) {
        this.resetPagination();
      }

      if (options.filters || options.all) {
        this.resetFilters();
      }

      this.presets = {};
      this.fetching = false;
      this.lastNextOffset = 0;
      this.lastPage = 1;
    },
    ...mixins.stores.filters.actions
  }
});
