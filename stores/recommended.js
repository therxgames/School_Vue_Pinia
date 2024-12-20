import {defineStore} from 'pinia';

export default defineStore({
  id: 'recommended',

  state: () => ({
    materials: [],
    total: 0,
    materialsFetching: false
  }),


  getters: {
    materialsRes: (state) => {
      if (!state.materials) {
        return {
          content: [],
          total: 0
        };
      }
      return {
        content: state.materials,
        total: state.total
      };
    },
    showMore: (state) => {
      if (!state.materials || !state.total) {
        return false;
      }
      return state.total > state.materials.length;
    }
  },


  actions: {
    async fetchMaterials(query) {
      try {
        this.materialsFetching = true;
        let response = await useApi(`/api/lib_tsok/page_local`, {
          ...methodGet,
          query
        });
        response.data.data.data = [...this.materials || [], ...response?.data?.data?.data || []];
        this.materials = response.data.data.data;
        this.total = response.data.data.total;
      } catch (e) {
        console.log(e);
      } finally {
        this.materialsFetching = false;
      }
    },
    resetData() {
      this.materials = [];
      this.total = 0;
    }
  }
});

