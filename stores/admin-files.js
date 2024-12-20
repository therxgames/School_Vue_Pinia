import {defineStore} from 'pinia';
import {steps} from '~/components/admin/uploads/consts';

export default defineStore({
  id: 'admin-files',

  state() {
    return {
      step: steps.INIT,
      file: null,
      conflicts: null
    };
  },
  actions: {
    setStep(step) {
      this.step = step;
    },
    setFile(payload) {
      this.file = payload;
    },
    setConflicts(payload) {
      this.conflicts = payload;
    },
    reset() {
      this.step = steps.INIT;
      this.file = null;
    }
  }
});
