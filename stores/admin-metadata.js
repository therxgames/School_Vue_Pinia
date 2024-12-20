import {defineStore} from 'pinia';
import useCommonStore from '~/stores/common';
import _cloneDeep from 'lodash.clonedeep';
import _isEqual from 'lodash.isequal';
import useUserStore from '~/stores/user';

export default defineStore({
  id: 'admin-metadata',

  state() {
    return {
      list: [],
      fetching: false,
      setuped: false,
      contentRev: null,
      ..._cloneDeep(mixins.stores.filters.state)
    };
  },

  getters: {
    show() {
      if (this.getFilterValue('year') !== null && this.getFilterValue('subject') !== null && this.getFilterValue('class') !== null) 
        return `${this.getFilterValue('year')}_${this.getFilterValue('subject')}_${this.getFilterValue('class')}`

      return '';  
    },
    dualMode() {
      const dual = ['Английский язык', 'Французский язык', 'Немецкий язык ', 'Испанский язык'];
      const subject = this.filters.subjects.data.find((item) => item.id === this.getFilterValue('subject'));
      return dual.includes(subject.name);
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

      await this.getOrFetchFilters();

      if (!this.setuped) {
        await this.setup(options);
      }

      if (options?.resetBefore) {
        this.list = [];
      }

      const query = {...this.builtFilters};

      try {
        const response = await useApi('/api/test_descriptions', {
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
        console.error('Ошибка получения инструкций', JSON.parse(e.response.data.error));
      }

      this.fetching = false;
      this.contentRev = generateString();
    },
    async saveDescription(data) {
      //api/content/cache_clear
      this.fetching = true;
      const body = {
        year: this.getFilterValue('year'),
        subject_id: this.getFilterValue('subject'),
        parallel_id: this.getFilterValue('class'),
        ...data
      }

      const url = data.id ? `/api/test_descriptions/${data.id}` : '/api/test_descriptions';
      const method = data.id ? methodPut : methodPost;
      const response = await useApi(url, {
        ...method,
        body
      });

      if (response?.data?.done) {
        eventBus.emit('toast:show', {
          text: data.id ? 'Инструкция/описание обновлены' : 'Инструкция/описание добавлены'
        });
      }
      this.fetch();
    },
    setup() {
      this.filters.order.value = 'attestation,desc';
      this.setuped = true;
    },
    reset() {
      this.list = [];
      this.fetching = false;
      this.contentRev = null;

    },
    ...mixins.stores.filters.actions
  }
});
