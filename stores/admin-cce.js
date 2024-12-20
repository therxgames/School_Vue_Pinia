import {defineStore} from 'pinia';
import useCommonStore from '~/stores/common';
import _cloneDeep from 'lodash.clonedeep';
import _isEqual from 'lodash.isequal';
import useUserStore from '~/stores/user';

export default defineStore({
  id: 'admin-cce',

  state() {
    return {
      cce: {
        list: [],
        fetching: false
      },
      list: [],
      newRecord: null,
      editRecord: null,
      fetching: false,
      saving: false,
      setuped: false,
      contentRev: null,
      ..._cloneDeep(mixins.stores.filters.state)
    };
  },

  getters: {
    filtersOptions() {
      const self = this;
      return {
        build: {
          onBuild(apiQuery) {
            if (self.filters.order.value) {
              const [sortBy, sortDir] = self.filters.order.value.split(',');
              if (sortBy !== 'none') {
                apiQuery.sort_by = sortBy;
                apiQuery.sort_dir = sortDir;
              }
            }

            apiQuery.per_page = 50;
            return apiQuery;
          }
        },
        autoloadParts: false
      };
    },
    addRecordTrigger() {
      return this.newRecord !== null;
    },
    addRecordDefaultData() {
      let attestation = this.getFilterValue('attestation') || null;
      let year = this.getFilterValue('year');
      let subject_id = this.getFilterValue('subject');
      let parallel_id = this.getFilterValue('class');
      let cce_name = '';
      let cce_id = '';

      return {
        attestation,
        year,
        subject_id,
        parallel_id,
        cce_id,
        cce_name
      };
    },
    resolvedItems() {
      return this.list.map((item) => {
        let resolvedData = {};

        if (item.attestation) {
          resolvedData.attestationName = attestationToName([item.attestation]);
        }

        if (item.subject_id) {
          resolvedData.subjectName = useCommonStore().subjectNameById[item.subject_id]?.name;
        }

        if (item.parallel_id) {
          resolvedData.className = `${item.parallel_id} класс`;
        }

        return {
          ...item,
          ...resolvedData
        };
      });
    },
    itemById() {
      return this.resolvedItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
    },
    editRecordId() {
      return this.editRecord?.id || 0;
    },
    ...mixins.stores.filters.getters
  },

  actions: {
    async invoke({onFetch = () => null, onUpdateRoute = () => null}) {
      this.rw = watch(
        () => JSON.stringify({
          query: useRouter().currentRoute.value.query,
          name: useRouter().currentRoute.value.name
        }),
        (n, o) => {
          if (JSON.parse(n).name !== JSON.parse(o).name) {
            return this.rw();
          }
          if (_isEqual({}, JSON.parse(n).query)) {
            this.resetFilters();
          }
        }
      );

      this.fw = watch(
        () => JSON.stringify({
          query: this.filtersQuery,
          user: useUserStore().entity,
          role: useUserStore().currentRole
        }),
        async (n, o) => {
          const payloadNew = n ? JSON.parse(n) : {};
          const payloadOld = o ? JSON.parse(o) : {};

          if (_isEqual(payloadNew, payloadOld)) {
            return;
          }

          await onUpdateRoute(payloadNew);
          await onFetch(payloadNew);
        }
      );

      this.fq = watch(
        () => JSON.stringify(this.filtersQuery),
        (n, o) => {
          this.queriesTimeline[0] = o;
          this.queriesTimeline[1] = n;
        }
      );
    },
    async fetch(options = {resetBefore: false, query: null}) {
      this.fetching = true;

      this.cancelNewRecord();

      await this.getOrFetchFilters();

      if (!this.setuped) {
        await this.setup(options);
      }

      if (options?.resetBefore) {
        this.list = [];
      }

      const query = {...this.builtFilters};

      try {
        const response = await useApi('/api/cce_to_sfa', {
          ...methodGet,
          query
        });

        if (response.data.done) {
          if (this.filters.page.append === true) {
            this.list = [...this.list, ...response.data.data.data];
          } else {
            this.list = [...response.data.data.data];
          }
          this.filters.page.total = response.data.data.total;
          this.filters.page.last_page = response.data.data.last_page;
          this.filters.page.append = false;
        }
      } catch (e) {
        console.error(e.message);
      }

      this.fetching = false;
      this.contentRev = generateString();
    },
    async findCceByName(name, mode) {
      if (this.cce.fetching) {
        return;
      }
      if (!name.length) {
        this.cce.list = [];
        this[`${mode}Record`].cce_id = '';
        return;
      }
      if (name === this[`${mode}Record`].cce_name) {
        return;
      }
      this.cce.fetching = true;
      const url = '/api/references';
      const query = {
        table_name: 'ref_keses',
        per_page: 5,
        page: 1,
        name
      };
      try {
        const res = await useApi(url, {...methodGet, query});
        if (res.data.done) {
          this.cce.list = res.data.data.data;
        }
      } catch (e) {
        console.error(e.message);
      } finally {
        this.cce.fetching = false;
      }
    },
    async findCceById(id, mode = 'new') {
      if (this.cce.fetching) {
        return;
      }
      if (id === this[`${mode}Record`].cce_id) {
        return;
      }
      this[`${mode}Record`].cce_id = id;
      if (!+id) {
        id = id.replace(/\D/g, '');
      }
      if (!id.length) {
        this[`${mode}Record`].cce_name = '';
        this[`${mode}Record`].cce_id = '';
        return;
      }
      this.cce.fetching = true;
      const url = `/api/references/${id}`;
      const query = {
        table_name: 'ref_keses'
      };
      try {
        const res = await useApi(url, {...methodGet, query});
        if (res.data.done) {
          this[`${mode}Record`].cce_name = res.data.data?.name || '';
          this[`${mode}Record`].cce_id = id;
          if (!res.data.data) {
            this[`${mode}Record`].cce_id = '';
          }
        }
      } catch (e) {
        console.error(e.message);
      } finally {
        this.cce.fetching = false;
      }
    },
    addNewRecord() {
      this.cancelEditRecord();
      this.newRecord = _cloneDeep(this.addRecordDefaultData);
      eventBus.emit('admin-cce:new-record');
    },
    cancelNewRecord() {
      this.newRecord = null;
    },
    async saveNewRecord() {
      if (!this.newRecord || !this.newRecord.cce_id.length || !this.newRecord.cce_name.length) {
        return;
      }

      this.saving = true;

      try {
        const {attestation, year, parallel_id, subject_id, cce_id} = this.newRecord;

        const response = await useApi(`/api/cce_to_sfa`, {
          ...methodPost,
          body: {
            attestation,
            year,
            parallel_id,
            subject_id,
            cce_id
          }
        });

        if (response.data.done) {
          this.cancelNewRecord();
          await this.fetch();
        }
      } catch (e) {
        console.error(e.message);
        eventBus.emit('admin-cce:save-error', e);
      }

      this.saving = false;
    },
    async removeRecord(id) {
      try {
        const response = await useApi(`/api/cce_to_sfa/${id}`, {
          ...methodDelete,
          body: {id}
        });
        if (response.data.done) {
          await this.fetch();
        }
        return response.data.done;
      } catch (e) {
        console.error(e.message);
      }
    },
    setEditableRecordId(id) {
      this.cancelNewRecord();
      this.editRecord = _cloneDeep(this.itemById[id]);
    },
    async saveEditRecord(id) {
      if (!this.editRecord) {
        return;
      }

      this.fetching = true;

      try {
        const {attestation, year, parallel_id, subject_id, cce_id} = this.editRecord;

        const response = await useApi(`/api/cce_to_sfa/${id}`, {
          ...methodPut,
          body: {
            id,
            attestation,
            year,
            parallel_id,
            subject_id,
            cce_id
          }
        });

        if (response.data.done) {
          this.cancelEditRecord();
          await this.fetch();
        }

        return response.data.done;
      } catch (e) {
        console.error(e.message);
        eventBus.emit('admin-cce:save-error', e);
      }

      this.fetching = false;
    },
    cancelEditRecord() {
      this.editRecord = null;
    },
    setup() {
      this.filters.order.value = 'attestation,desc';
      this.setuped = true;
    },
    reset() {
      this.list = [];
      this.newRecord = null;
      this.fetching = false;
      this.contentRev = null;
    },
    ...mixins.stores.filters.actions
  }
});
