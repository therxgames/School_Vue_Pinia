import { defineStore } from "pinia";

export default defineStore({
  id: "dictionaries-calendar",
  state() {
    return {
      optionsTypes: [],
      regionOptions: [],
      optionsCourses: [],
      optionsClasses: [],
      optionsCollections: [],
      optionsSuppliers: [],
      optionsGeneralEducationLevels: [],
      optionsGeneralEducationLevels: [],
      optionsMinAges: [],
      eventLevels: [],
    };
  },
  actions: {
    async fetchTypes() {
      try {
        const { data } = await useApi(
          `/api/calendar/eventTypes?pageSize=100`,
          {
            method: "GET",
          }
        );

        if (Array.isArray(data?.data?.items)) {
          this.optionsTypes = data?.data?.items;
        }
      } catch (e) {
        console.error("Ошибка получения типов", e);
      }
    },
    async fetchCourses() {
      try {
        const { data } = await useApi(
          `/api/dictionary/courses?page=1&pageSize=100&sort=name&state=active`,
          {
            method: "GET",
          }
        );

        if (Array.isArray(data?.data?.items)) {
          this.optionsCourses = data?.data?.items;
        }
      } catch (e) {
        console.error("Ошибка получения списка курсов", e);
      }
    },
    async fetchRegions() {
      try {
        const { data } = await useApi(
          `/api/dictionary/regions?page=1&pageSize=100&sort=name&state=active`,
          {
            method: "GET",
          }
        );

        const regions = data?.data?.items?.map((item) => ({
          value: item.code,
          label: item.name,
        }));

        regions.unshift({
          value: "ALL",
          label: "Все регионы РФ",
        });

        this.regionOptions = regions;
      } catch (e) {
        console.error("Ошибка получения регионов", e);
      }
    },
    async fetchEventLevels() {
      try {
        const { data } = await useApi(
          `/api/dictionary/eventLevels?page=1&pageSize=100&sort=name&state=active`,
          {
            method: "GET",
          }
        );

        if (Array.isArray(data?.data?.items)) {
          this.eventLevels = data?.data?.items;
        }
      } catch (e) {
        console.error("Ошибка получения eventLevels", e);
      }
    },
    async fetchClasses() {
      try {
        const { data } = await useApi(
          `/api/dictionary/classes?page=1&pageSize=100&sort=name&state=active`,
          {
            method: "GET",
          }
        );

        if (Array.isArray(data?.data?.items)) {
          const sortOptions = data?.data?.items.sort((a, b) => ( Number(a.number) > Number(b.number) ? 1 : -1));
          this.optionsClasses = [...sortOptions];
        }
      } catch (e) {
        console.error("Ошибка получения классов", e);
      }
    },
    async fetchCollections() {
      try {
        const { data } = await useApi(`/api/library/collections`, {
          method: "GET",
        });

        if (Array.isArray(data?.data?.items)) {
          this.optionsCollections = data?.data?.items;
        }
      } catch (e) {
        console.error("Ошибка получения классов", e);
      }
    },
    async fetchSuppliers() {
      try {
        const { data } = await useApi(`/api/library/suppliers`, {
          method: "GET",
        });

        if (Array.isArray(data?.data?.items)) {
          this.optionsSuppliers = data?.data?.items;
        }
      } catch (e) {
        console.error("Ошибка получения классов", e);
      }
    },
    async fetchGeneralEducationLevels() {
      try {
        const { data } = await useApi(`/api/library/generalEducationLevels`, {
          method: "GET",
        });

        if (Array.isArray(data?.data?.items)) {
          this.optionsGeneralEducationLevels = data?.data?.items;
        }
      } catch (e) {
        console.error("Ошибка получения классов", e);
      }
    },
    async fetchMinAges() {
      try {
        const { data } = await useApi(`/api/library/minAges`, {
          method: "GET",
        });

        if (Array.isArray(data?.data?.items)) {
          this.optionsMinAges = data?.data?.items;
        }
      } catch (e) {
        console.error("Ошибка получения классов", e);
      }
    },
  },
});
