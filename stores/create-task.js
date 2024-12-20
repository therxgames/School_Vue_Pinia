import {defineStore} from 'pinia';

export default defineStore({
  id: 'create-task',
  state() {
    return {
      parts: null
    };
  },
  getters: {
    selectedRows({parts}) {
      const res = {};
      if (parts) {
        for (const partId in parts) {
          const part = parts[partId];
          for (const rowId in part.rows) {
            const row = part.rows[rowId]
            if (row.selected) res[rowId] = row.selected;
          }
        }
      }

      return res; 
    },
    rowCompleted: ({parts}) => (partId, rowId) => {
      if (parts && !parts[partId].showReady) {
        return parts[partId].rows[rowId].completed;
      }

      return 0;
    },
    rowSelected: ({parts}) => (partId, rowId) => {
      if (parts) {
        return parts[partId].rows[rowId].selected;
      }

      return 0;
    },
    partsTaskSum({parts}) {
      if (parts) return Object.keys(parts).reduce((acc, partId) => acc + this.partTaskSum(partId), 0);

      return 0;
    },
    partTaskSum({parts}) {
      if (parts) return (partId) => Object.values(parts[partId].rows).reduce((acc, row) => acc + row.selected, 0);

      return () => 0;
    },
    partsThemeSum({parts}) {
      let count = 0;

      if (parts) {
        for (let partId in parts) {
          const part = parts[partId];
          Object.values(part.rows).forEach((row) => {
            if (row.selected) count++;
          });
        }
      }

      return count;
    },
    noParts({parts}) {
      return Object.keys(parts).length === 1;
    }
  },
  actions: {
    initState(payload) {
      this.parts = payload;
    },
    changeRowTask({partId, rowId, value}) {
      this.parts[partId].rows[rowId].selected = value;
    },
    setShowReady(partId, value) {
      this.parts[partId].showReady = value;
    }
  }
});
