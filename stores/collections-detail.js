import { defineStore } from "pinia";

const ROLE = "student";

export default defineStore({
  id: "collections-detail",
  state() {
    return {
      collectionsTitle: null,
      collectionsList: [],
      collectionsListIsLoading: true,
      collectionsListIsNoResult: false,
      token: null,
    };
  },
  getters: {},
  actions: {
    async fetchExternalToken () {
      try {
        const response = await useApi('/api/external_token');

        this.token = response.data?.token;
      } catch(e) {
        console.log(e, 'не удалось получить external_token')
      }
    },

    async fetchCollectionsList(id) {
      // const queryParams = { role: ROLE };

      try {
        this.collectionsListIsLoading = true;

        const fullData = []

        const { data } = await useApi(
          `/api/thematicCollections/selections/${id}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (Array.isArray(data?.data?.items)) {
          for (const item of data?.data?.items) {
            if (item.subsystem === 'calendar') {
              const response = await useApi(`/api/calendar/events/${item.itemId}`, { ...methodGet });
              fullData.push({
                subsystem: 'calendar',
                ...response?.data?.data,
              })
            }

            if (item.subsystem === 'material_library') {
              const response = await useApi(`/api/library/materials/${item.itemId}`, { ...methodGet });
              fullData.push({
                subsystem: 'material_library',
                ...response?.data?.data,
              })
            }
          }
          

          console.log('fullData', fullData)
          this.collectionsList = fullData;
        }

        if (data?.data?.title) {
          this.collectionsTitle = data.data.title;
        }
      } catch (e) {
        console.error("Ошибка получения тематических подборок", e);
      } finally {
        this.collectionsListIsLoading = false;
        this.collectionsListIsNoResult = this.collectionsList.length < 1;
      }
    },
  },
});
