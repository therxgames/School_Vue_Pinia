import { defineStore } from "pinia";

const CALENDAR_ITEM_STATE = {
  id: null,
  roles: [],
  eventType: null,
  name: null,
  shortName: null,
  description: null,
  dateStart: null,
  dateEnd: null,
  timeStart: null,
  timeEnd: null,
  timezone: null,
  address: null,
  coordinates: [],
  place: null,
  url: null,
  online: null,
  courses: [],
  fields: [],
  disciplines: [],
  holdForms: [],
  participationTypes: [],
  classes: [],
  ageFrom: null,
  ageTo: null,
  hours: null,
  rules: null,
  cover: null,
  createdAt: null,
  updatedAt: null,
  datePublished: null,
  olympiadLevel: null,
  cost: null,
  onlinePlatforms: [],
  files: [],
  favoriteItemId: null,
  inMinistryRegister: null,
  externalLinks: null,
  duration: null,
  eventSchedules: [],
  region: null,
  eventLevel: null,
  organizer: null
};

export default defineStore({
  id: 'calendar-item',
  state() {
    return {
      data: CALENDAR_ITEM_STATE
    };
  },
  actions: {
    setCalendarItem(item) {
      this.data = item
    },
    async fetchCalendarItem(id) {
      try {
        const response = await useApi(`/api/calendar/events/${id}`, { ...methodGet });

        this.data = response?.data?.data
      } catch (e) {
        console.error(e.message);
      }
    },
  }
});