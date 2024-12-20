import {defineStore} from 'pinia';

export default defineStore({
  id: 'common',

  state() {
    return {
      swRegistered: false,
      switchVersionTrigger: null,
      resolvedTasks: {},
      filtersData: {
        data: {
          done: false
        }
      }
    };
  },

  getters: {
    subjectNameById() {
      return this.filtersData.data.subjects?.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}) || null;
    }
  },

  actions: {
    async patchItemStatus(id, type, status) {
      if (!id || (type !== 'task' && type !== 'test')) {
        return false;
      }

      try {
        const response = await useApi(`/api/${type}/${id}/status`, {
          ...methodPatch,
          body: status
        });

        return response.data.done;
      } catch (e) {
        return false;
      }
    },
    async addToFavorite(id, useApiPath = '/api/task/{id}/status') {
      if (!id) {
        return;
      }

      const apiPath = useApiPath.replace('{id}', id);

      try {
        return useApi(apiPath, {
          ...methodPatch,
          body: {is_favorite: true}
        });
      } catch (e) {
        console.error(e.message);
        return e.response;
      }
    },
    async removeFromFavorite(id, useApiPath = '/api/task/{id}/status') {
      if (!id) {
        return;
      }

      const apiPath = useApiPath.replace('{id}', id);

      try {
        return useApi(apiPath, {
          ...methodPatch,
          body: {is_favorite: false}
        });
      } catch (e) {
        console.error(e.message);
        return e.response;
      }
    },
    async storageGet(key, def = null) {
      try {
        const response = await useApi('/api/storage', {
          ...methodGet,
          query: {key}
        });
        return response.data || def;
      } catch (e) {
        console.error(e.message);
        return def;
      }
    },
    async storageSet(key, data) {
      try {
        return await useApi('/api/storage', {
          ...methodPost,
          body: {
            key,
            data
          }
        });
      } catch (e) {
        console.error(e.message);
      }
    },
    async startTest({id, mode, time = 0}) {
      try {
        const response = await useApi(`/api/test/${id}/attempt`, {
          ...methodPost,
          body: {
            time,
            mode
          }
        });
        return response.data.done;
      } catch (e) {
        console.error(e.message);
      }
    },
    async resolveFilters(fetchForce = false) {
      try {
        const response = this.filtersData.data?.done === true && fetchForce === false
          ? this.filtersData
          : await useApi('/api/subjects', {...methodGet});

        Object.assign(this.filtersData.data, response.data);

        this.filtersData.data.years  = Array.from({ length: 14 }, (_, i) => new Date().getFullYear() - i)
            .map((year) => ({name: year.toString(), id: year}));

        this.filtersData.data.classes = Array.from({length: 5}, (_, i) => 5 + i)
          .map((_class) => ({name: `${_class.toString()} класс`,  short: _class.toString(), id: _class}));

        return this.filtersData;
      } catch (e) {
        console.error(e.message);
      }
    },
    async resolveTopics(topics = []) {
      const getResolvedMeta = () => {
        const filterTopics = this.filtersData.data.topics;
        const unresolvedTopics = [];
        const resolvedTopics = [];

        topics.map((id) => {
          filterTopics.find((_topic) => _topic.id === id)
            ? resolvedTopics.push(id)
            : unresolvedTopics.push(id);
        });

        return {
          resolvedTopics,
          unresolvedTopics
        };
      };
      const getResolved = () => {
        const filterTopics = this.filtersData.data.topics;
        const resolved = [];
        topics.map((_topic) => resolved.push(
          filterTopics.find((__topic) => __topic.id === _topic)
        ));
        return resolved;
      };
      const fetch = async (ids = []) => {
        try {
          const response = await useApi('/api/topics', {
            ...methodGet,
            query: {
              id: ids.join(',')
            }
          });
          if (response.data.done) {
            this.filtersData.data.topics = [...this.filtersData.data.topics, ...response.data.topics];
          }
        } catch (e) {
          console.error(e.message);
        }
      };

      if (!('topics' in this.filtersData.data)) {
        this.filtersData.data.topics = [];
      }

      const resolvedMeta = getResolvedMeta();

      if (resolvedMeta.unresolvedTopics.length > 0) {
        await fetch(resolvedMeta.unresolvedTopics);
      }

      return getResolved();
    },
    async resolveTask(id) {
      if (this.resolvedTasks[id]) {
        return this.resolvedTasks[id];
      }

      try {
        const response = await useApi(`/api/task/${id}`, {...methodGet});
        if (response.data.done) {
          this.resolvedTasks[id] = response.data.task;
          return this.resolvedTasks[id];
        }
      } catch (e) {
        console.error(e.message);
      }
    },
    async createTaskVersion(id) {
      try {
        return await useApi(`/api/test_dev/create_version`, {
          ...methodGet,
          query: {task_parent_id: id}
        });
      } catch (e) {
        console.error(e.message);
      }
    },
    async createTestVersion(id) {
      try {
        return await useApi(`/api/test_dev/create_test_version`, {
          ...methodGet,
          query: {test_parent_id: id}
        });
      } catch (e) {
        console.error(e.message);
      }
    }
  }
});
