import { defineStore } from "pinia";

const DEFAULT_FILTERS = {
  region: null,
  term: null,
  supplier: null,
  generalEducationLevel: null,
  collection: null,
};

Object.freeze(DEFAULT_FILTERS);

export default defineStore({
  id: "library-projects",

  state() {
    return {
      list: [],
      sort: null,
      filters: {...DEFAULT_FILTERS},
      detail: null,
      page: {
        current: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        append: false,
      },
      fetching: false,
      calendar: {
        date: [],
      },
      listNoResult: false,
    };
  },
  getters: {
    filtersQuery() {
      const query = {};

      if (this.page.current && this.page.current > 1) {
        query["page"] = this.page.current;
      }

      return query;
    },
  },

  actions: {
    setSort(value) {
      this.sort = value;
    },

    setFilterByKey(keyFilter, value) {
      this.filters[keyFilter] = value;
    },

    resetAll() {
      (this.tern = null),
        (this.sort = null),
        (this.filters = {...DEFAULT_FILTERS}),
        (this.calendar.date = []);
    },

    async fetch(options = { resetBefore: false }) {
      if (options?.resetBefore) {
        this.list = [];
      }

      await this.fetchProjects();
    },

    async invoke({ onFetch = () => null, onUpdateRoute = () => null }) {
      this.fw = watch(
        () => ({
          query: this.filtersQuery,
        }),
        async (payload) => {
          await onUpdateRoute(payload);
          await onFetch(payload);
        }
      );
    },

    async fetchProjects(queryParams) {
      this.fetching = true;

      try {
        const { data } = await useApi("/api/library/materials", {
          method: "GET",
          query: {
            state: "PUBLISHED",
            pageSize: 12,
            role: "student",
            sort: "-publishedAt",
            page: this.page.current,
            ...queryParams,
          },
        });

        if (data.data) {
          if (this.page.append === true) {
            this.list = [...this.list, ...data.data.items];
          } else {
            this.list = [...data.data.items];
          }

          this.page.total = data.data.page;
          this.page.last_page = Math.floor(
            data.data.total / data.data.pageSize
          );
          this.page.append = false;

          this.list.length < 1
            ? (this.listNoResult = true)
            : (this.listNoResult = false);
        }
      } catch (e) {
        console.log("Ошибка получения списка материалов", e);
        this.listNoResult = true
      }

      this.fetching = false;
    },

  },
});
