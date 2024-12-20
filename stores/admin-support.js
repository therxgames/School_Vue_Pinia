import {defineStore} from 'pinia';

export default defineStore({
  id: 'adminSupport',

  state() {
    return {
      emailSettings: {},
      currentEmail: '',
      newEmail: '',
      subjects: {},
      newSubject: '',
      selectSubject: null
    };
  },

  actions: {
    async getEmail() {
      const url = '/api/settings';
      try {
        const res = await useApi(url, {
          ...methodGet
        });
        if (res.data.done) {
          const emailSettings = res.data.settings.data.find((s) => s.id === 1);
          this.emailSettings = {
            value: emailSettings.value,
            id: emailSettings.id,
            name: emailSettings.name,
            description: emailSettings.description
          };
        }
      } catch (e) {
        console.error(e);
      }
    },
    async changeEmail() {
      this.emailSettings.value = this.newEmail;
      const url = `/api/settings/${this.emailSettings.id}`;
      try {
        const res = await useApi(url, {
          ...methodPatch,
          body: this.emailSettings
        });
        if (res.data.done) {
          this.getEmail();
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getSubjects() {
      const url = '/api/references';
      const query = {table_name: 'ref_support_themes'};
      try {
        const res = await useApi(url, {
          ...methodGet,
          query
        });
        if (res.data.done) {
          this.subjects = res.data.data;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async addSubject() {
      const url = '/api/references';
      try {
        const res = await useApi(url, {
          ...methodPost,
          body: {
            table_name: 'ref_support_themes',
            name: this.newSubject,
            weight: (this.subjects.data.length + 1) * 10
          }
        });
        if (res.data.done) {
          this.getSubjects();
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.newSubject = '';
      }
    },
    async editSubject() {
      if (this.selectSubject) {
        const {id, name, weight} = this.selectSubject;
        const url = `/api/references/${id}`;
        this.selectSubject = null;
        try {
          const res = await useApi(url, {
            ...methodPut,
            body: {
              table_name: 'ref_support_themes',
              id,
              name,
              weight
            }
          });
          if (res.data.done) {
            this.getSubjects();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    async deleteSubject() {
      if (this.selectSubject) {
        const num = this.selectSubject.id;
        const url = `/api/references/${num}`;
        const query = {table_name: 'ref_support_themes', id: num};
        try {
          const res = await useApi(url, {
            ...methodDelete,
            body: query
          });
          if (res.data.done) {
            this.getSubjects();
            this.selectSubject = null;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
});
