import { defineStore } from "pinia";

const DEFAULT_FILTERS = {
  region: null,
  term: null,
  supplier: null,
  generalEducationLevel: null,
  collection: null,
  course: null,
  class: null,
  minAgeFrom: null,
};

Object.freeze(DEFAULT_FILTERS);

export default defineStore({
  id: "materials-library",

  state() {
    return {
      list: [],
      sort: null,
      filters: { ...DEFAULT_FILTERS },
      detail: null,
      page: 1,
      total: null,
      queryPageCount: 2,
      fetching: false,
      calendar: {
        date: [],
      },
      listIsLoading: true,
      listNoResult: false,
    };
  },

  actions: {
    setSort(value) {
      this.sort = value;
    },

    setFilterByKey(keyFilter, value) {
      this.filters[keyFilter] = value;
    },

    resetDate() {
      this.calendar.date = [];
    },

    resetAll() {
      (this.tern = null),
        (this.sort = null),
        (this.filters = { ...DEFAULT_FILTERS }),
        (this.calendar.date = []);
    },

    setDatesFromTextToDate(eventDate, value) {
      if (eventDate === "publishedAtFrom") {
        this.calendar.date[0] = value;
      }

      if (eventDate === "publishedAtTo") {
        this.calendar.date[1] = value;
      }
    },

    async fetch(options = { resetBefore: false }) {
      if (options?.resetBefore) {
        this.list = [];
      }

      await this.fetchMaterials();
    },

    async fetchMaterials(queryParams) {
      this.listIsLoading = true;

      try {
        if (!queryParams?.page) {
          queryParams.page = 1;
        }

        const { data } = await useApi("/api/library/materials", {
          method: "GET",
          query: {
            state: "PUBLISHED",
            pageSize: 12,
            role: "student",
            sort: "-publishedAt",
            ...queryParams,
          },
        });

        if (data.data) {
          if (queryParams.page === 1) {
            this.list = data?.data?.items;
          } else {
            this.list = [...this.list, ...data.data.items];
          }

          this.total = data.data.total;
        }
      } catch (e) {
        console.log("Ошибка получения списка материалов", e);
      } finally {
        this.listIsLoading = false;
        this.listNoResult = this.list.length < 1;
      }
    },

    async fetchMaterialById(id) {
      this.fetching = true;

      try {
        const { data } = await useApi(`/api/library/materials/${id}`, {
          method: "GET",
        });

        if (data.data) {
          this.detail = data.data;
        }
      } catch (e) {
        console.log("Ошибка получения детальной материалов", e);
      }

      this.fetching = false;
    },
  },
});
