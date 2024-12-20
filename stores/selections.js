import { defineStore } from "pinia";

const SELECTIONS_STATE = {
  token: null,
  selections: {
    all: [],
    materials: [],
    events: [],
  },
};

export default defineStore({
  id: "selections",

  state() {
    return SELECTIONS_STATE;
  },
  getters: {},
  actions: {
    async fetch(selectionsParams = {}) {
      await this.fetchToken();
      await this.fetchSelections(selectionsParams);
    },
    async fetchToken() {
      try {
        const response = await useApi("/api/external_token");

        this.token = response.data?.token;
      } catch (e) {
        // console.error(e.message);
      }
    },
    async fetchSelections(queryParams = {}) {
      try {
        const response = await useApi("/api/thematicCollections/selections", {
          method: "GET",
          query: {
            ...queryParams,
          },
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        switch (queryParams?.selectionType) {
          case "materials":
            this.selections.materials = response.data?.data?.data || [];
            return;
          case "events":
            this.selections.events = response.data?.data?.data || [];
            return;
          default:
            this.selections.all = response.data?.data?.data || [];
        }
      } catch (e) {
        // console.error(e.message);
      }
    },
  },
});
