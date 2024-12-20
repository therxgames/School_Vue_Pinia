import { defineStore } from "pinia";
import { startOfMonth } from "date-fns";

const DEFAULT_FILTERS = {
  region: null,
  eventType: null,
  course: null,
  class: null,
  eventLevel: null,
  olympiadLevel: null,
  all: null,
  online: null,
  term: null,
  eventDateFrom: null,
  eventDateTo: null,
};

Object.freeze(DEFAULT_FILTERS);

const ROLE = "student";

export default defineStore({
  id: "calendar",
  state() {
    return {
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
      sort: null,
      filters: { ...DEFAULT_FILTERS },
      eventsList: [],
      eventsListTotal: null,
      eventsLoading: true,
      eventsListNoResult: false,
    };
  },
  getters: {},
  actions: {
    setSort(value) {
      this.sort = value;
    },
    setFilterByKey(keyFilter, value) {
      this.filters[keyFilter] = value;
    },
    setMoreEventsList(moreList) {
      this.eventsList = [...this.eventsList, ...moreList];
    },
    resetAll() {
      (this.tern = null),
        (this.sort = null),
        (this.filters = { ...DEFAULT_FILTERS }),
        (this.calendar.date = []),
        (this.calendar.monthDate = startOfMonth(new Date()));
    },
    resetDate() {
      this.calendar.date = [];
    },
    setDatesFromTextToDate(eventDate, value) {
      if (eventDate === "eventDateFrom") {
        this.calendar.date[0] = value;
      }

      if (eventDate === "eventDateTo") {
        this.calendar.date[1] = value;
      }
    },
    async fetchEventsList(queryParams = {}) {
      try {
        this.eventsLoading = true;

        queryParams.role = ROLE;

        if (!queryParams?.eventDateFrom && !this.filters.all) {

          queryParams.eventDateFrom = formatDateByMask(
            new Date(),
            "yyyy-MM-dd"
          );
        }

        if (!queryParams?.sort) {
          queryParams.sort = "date";
        }

        if (!queryParams?.page) {
          queryParams.page = 1;
        }

        if (!queryParams?.pageSize) {
          queryParams.pageSize = 12;
        }

        const { data } = await useApi(
          `/api/calendar/events`,
          {
            ...methodGet,
            query: queryParams,
          }
        );

        if (Array.isArray(data?.data?.items)) {
          if (queryParams.page === 1) {
            this.eventsList = data?.data?.items;
          } else {
            // это для подгрузки новых элементов
            this.setMoreEventsList(data?.data?.items);
          }

          this.eventsListTotal = data?.data?.total;
        }
      } catch (e) {
        console.error("Ошибка получения eventLevels", e);
      } finally {
        this.eventsLoading = false;
        this.eventsListNoResult = this.eventsList.length < 1;
      }
    },
  },
});
