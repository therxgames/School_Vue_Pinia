import {defineStore} from 'pinia';

export default defineStore({
  id: 'admin-users',

  state() {
    return {
      list: [],
      fetching: false,
      filters: {
        role: {
          value: 0,
          default: 0,
          data: [
            ...rolesList
          ]
        },
        id: {
          value: '',
          accepted: '',
          default: '',
          data: null
        },
        name: {
          value: '',
          accepted: '',
          default: '',
          data: null
        },
        page: {
          current: 1,
          last_page: 1,
          per_page: 25,
          total: 0,
          append: false
        },
        order: {
          by: 'id',
          dir: 'asc'
        }
      }
    };
  },

  getters: {
    builtFilters() {
      const builtFilters = {};

      if (this.filters.role.value > 0) {
        builtFilters['role_id'] = this.filters.role.value;
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

      if (this.filters.name.value) {
        builtFilters['name'] = this.filters.name.value;
      }

      if (this.filters.page.current && this.filters.page.current > 1) {
        builtFilters['page'] = this.filters.page.current;
      }

      builtFilters['sort_by'] = this.filters.order.by;
      builtFilters['sort_dir'] = this.filters.order.dir;
      builtFilters['per_page'] = this.filters.page.per_page;

      return builtFilters;
    },
    filtersQuery() {
      const query = {};

      if (this.filters.role.value && this.filters.role.value !== 0) {
        query['role'] = this.filters.role.value;
      }

      if (this.filters.id.accepted) {
        query['id'] = this.filters.id.accepted;
      }

      if (this.filters.name.accepted) {
        query['name'] = this.filters.name.accepted;
      }

      if (this.filters.page.current && this.filters.page.current > 1) {
        query['page'] = this.filters.page.current;
      }

      query['order'] = this.filters.order.by + ',' + this.filters.order.dir;

      return query;
    },
    filtersInvolved() {
      return this.filters.role.value > 0
        || this.filters.id.value.length > 0
        || this.filters.name.value.length > 0;
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
        const response = await useApi('/api/users', {
          ...methodGet,
          query
        });

        if (response.data.done) {
          if (this.filters.page.append === true) {
            this.list = [...this.list, ...response.data.users.data];
          } else {
            this.list = [...response.data.users.data];
          }

          this.filters.page.total = response.data.users.total;
          this.filters.page.last_page = response.data.users.last_page;
          this.filters.page.append = false;
        }
      } catch (e) {
        console.error(e.message);
      }

      this.fetching = false;
    },
    async getUserRole(id) {
      try {
        const response = await useApi(`/api/user_roles/${id}`, {...methodGet});
        return response.data;
      } catch (e) {
        console.error(e.message);
      }
    },
    async addRole(id, roleId) {
      try {
        const response = await useApi(`/api/user_roles`, {
          ...methodPost,
          body: {
            user_id: id,
            role_id: roleId
          }
        });
        return response.data.done;
      } catch (e) {
        console.error(e.message);
      }
    },
    async deleteRole(id, roleId) {
      try {
        await useApi(`/api/user_roles/${id}`, {
          ...methodDelete,
          body: {
            user_id: id,
            role_id: roleId
          }
        });
      } catch (e) {
        console.error(e.message);
      }
    },
    resetFilters() {
      this.filters.role.value = 0;
      this.filters.id.value = this.filters.id.accepted = '';
      this.filters.name.value = this.filters.name.accepted = '';
    },
    reset() {
      this.fw();
    }
  }
});
