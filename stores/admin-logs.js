import {defineStore} from 'pinia';

export default defineStore({
  id: 'admin-logs',

  state() {
    return {
      list: [],
      localList: [],
      fetching: false,
      filters: {
        id: {
          value: '',
          accepted: '',
          default: '',
          data: null
        },
        type: {
          value: 0,
          default: 0,
          data: [
            {
              name: 'Пользователи',
              id: 1
            },
            {
              name: 'Сервис',
              id: 2
            }
          ]
        },
        result: {
          value: 0,
          default: 0,
          data: [
            {
              name: 'Успешно',
              id: 1
            },
            {
              name: 'Ошибка',
              id: 2
            }
          ]
        },
        event_id: {
          value: '',
          accepted: '',
          default: '',
          data: null
        },
        user_id: {
          value: '',
          accepted: '',
          default: '',
          data: null
        },
        page: {
          current: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
          append: false
        },
        order: {
          by: 'id',
          dir: 'desc'
        }
      }
    };
  },
  getters: {
    builtFilters() {
      const builtFilters = {};

      if (this.filters.type.value > 0) {
        builtFilters['type'] = this.filters.type.value;
      }

      if (this.filters.result.value > 0) {
        builtFilters['result'] = this.filters.result.value;
      }

      if (this.filters.id.value) {
        let searchValue = this.filters.id.value;

        if (
          searchValue.match(/^#\d+$/)
          || searchValue.match(/^t\d+$/)
          || searchValue.match(/^№\d+$/)
        ) {
          searchValue = searchValue.replace( /^\D+/g, '');
        }
        builtFilters['id'] = searchValue;
      }

      if (this.filters.event_id.value) {
        let searchValue = this.filters.event_id.value;

        if (
          searchValue.match(/^#\d+$/)
          || searchValue.match(/^t\d+$/)
          || searchValue.match(/^№\d+$/)
        ) {
          searchValue = searchValue.replace( /^\D+/g, '');
        }
        builtFilters['event_id'] = searchValue;
      }

      if (this.filters.user_id.value) {
        let searchValue = this.filters.user_id.value;

        if (
          searchValue.match(/^#\d+$/)
          || searchValue.match(/^t\d+$/)
          || searchValue.match(/^№\d+$/)
        ) {
          searchValue = searchValue.replace( /^\D+/g, '');
        }
        builtFilters['user_id'] = searchValue;
      }

      if (this.filters.page.current && this.filters.page.current > 1) {
        builtFilters['page'] = this.filters.page.current;
      }

      builtFilters['per_page'] = this.filters.page.per_page;
      builtFilters['sort_by'] = this.filters.order.by;
      builtFilters['sort_dir'] = this.filters.order.dir;

      return builtFilters;
    },
    filtersQuery() {
      const query = {};

      if (this.filters.type.value && this.filters.type.value !== 0) {
        query['type'] = this.filters.type.value;
      }

      if (this.filters.result.value && this.filters.result.value !== 0) {
        query['result'] = this.filters.result.value;
      }

      if (this.filters.id.accepted) {
        query['id'] = this.filters.id.accepted;
      }

      if (this.filters.event_id.accepted) {
        query['event_id'] = this.filters.event_id.accepted;
      }

      if (this.filters.user_id.accepted) {
        query['user_id'] = this.filters.user_id.accepted;
      }

      if (this.filters.page.current && this.filters.page.current > 1) {
        query['page'] = this.filters.page.current;
      }

      query['order'] = this.filters.order.by + ',' + this.filters.order.dir;

      return query;
    },
    filtersInvolved() {
      return this.filters.type.value > 0
        || this.filters.result.value > 0
        || this.filters.id.value.length > 0
        || this.filters.event_id.value.length > 0
        || this.filters.user_id.value.length > 0;
    }
  },

  actions: {
    async invoke({onFetch = () => null, onUpdateRoute = () => null}) {
      this.fw = watch(
        () => ({
          query: this.filtersQuery
        }),
        async (payload) => {
          await onUpdateRoute(payload);
          await onFetch(payload);
        }
      );
    },
    async fetch(options = {resetBefore: false}) {
      this.fetching = true;
      if (options?.resetBefore) {
        this.list = [];
      }
      const query = {...this.builtFilters};

      try {
        const response = await useApi('/api/log', {
          ...methodGet,
          query
        });

        if (response.data.done) {
          if (this.filters.page.append === true) {
            this.list = [...this.list, ...response.data.data.data];
          } else {
            this.list = [...response.data.data.data];
          }
          const localDate = (created_at) => {
            const logDate = new Date(created_at);
            let timeZone = new Date().getTimezoneOffset();
            const localLogDate = new Date(logDate.getTime() - (timeZone * 60 * 1000));
            return localLogDate.toLocaleString("ru-RU");
          };
          const prettyJson = (json) => JSON.stringify(JSON.parse(json), null, 2);

          this.localList = this.list.map((log, index) => ({
            ...log,
            created_at: localDate(log.created_at),
            prettyJson: log.jdata?prettyJson(log.jdata):log.jdata
          }));

          this.filters.page.total = response.data.data.total;
          this.filters.page.last_page = response.data.data.last_page;
          this.filters.page.append = false;
        }
      } catch (e) {
        console.error(e.message);
      }

      this.fetching = false;
    },
    resetFilters() {
      this.filters.type.value = 0;
      this.filters.result.value = 0;
      this.filters.id.value = this.filters.id.accepted = '';
      this.filters.event_id.value = this.filters.id.accepted = '';
      this.filters.user_id.value = this.filters.id.accepted = '';
    },
    reset() {
      this.fw();
    }
  }
});
