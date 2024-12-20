import {defineStore} from 'pinia'

export default defineStore({
  id: 'admin-achievements',

  state() {
    return {
      list: [],
      changeList: [],
      themeList: [],
      filters: {
        currentThemes: [],
        courseTypeGia: [],
        status: [],
        subject: [],
        class: [],
      },
      sort: {
        status: {
          value: '',
          accepted: '',
          default: '',
          data: null
        },
        name: {
          value: '',
          accepted: '',
          default: '',
          data: null
        },
        dateCreate: {
          value: '',
          accepted: '',
          default: '',
          data: null
        },
      },
      page: {
        current: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        append: false
      },
      order: {
        by: '',
        dir: 'desc'
      },
      directory: null,
      fetching: false,
      errorForm: null,
      messSuccess: ''
    }
  },
  getters: {
    filtersQuery() {
      const query = {}

      if (this.page.current && this.page.current > 1) {
        query['page'] = this.page.current
      }

      return query
    }
  },

  actions: {
    async fetch(options = {resetBefore: false}) {
      if (options?.resetBefore) {
        this.list = []
      }

      if (!this.directory) {
        await this.fetchDirectory()
      }
      await this.fetchAchievements()
    },
    async invoke({onFetch = () => null, onUpdateRoute = () => null}) {
      this.fw = watch(
        () => ({
          query: this.filtersQuery
        }),
        async (payload) => {
          await onUpdateRoute(payload)
          await onFetch(payload)
        }
      )
    },
    async fetchDirectory() {
      try {
        const response = await useApi('/api/achievements/directory', {
          method: 'GET'
        })
        if (response.data.done) {
          this.directory = response.data
        }
      } catch (e) {
        console.log('Ошибка получения словаря', e)
      }
    },
    async fetchAchievementsSetReached(userId) {
      const query = {};

      if (!!userId) {
        query['user_id'] = userId
      }

      try {
        const response = await useApi('/api/achievements/set_reached', {
          method: 'GET',
          query,
        })

        if (response.data.done) {
          console.log(response.data)

          return response.data;
        }
      } catch (e) {
        console.log('Ошибка установки достижений', e)
      }
    },
    async fetchAchievementsTheme(value) {
      const query = {};

      if (!!value) {
        query['find'] = value
      }

      try {
        const response = await useApi('/api/achievements/theme', {
          method: 'GET',
          query,
        })

        if (response.data.done) {
          this.themeList = response.data.themes;
          return response.data.themes;
        }
      } catch (e) {
        console.log('Ошибка получения достижений', e)
      }
    },
    async fetchAchievements(queryParams) {
      this.fetching = true
      const query = {
        page: queryParams.page ?? this.page.current
      };

      if (!!queryParams?.findName) {
        query['find'] = queryParams.findName
      }

      if (!!queryParams?.theme) {
        query['theme'] = queryParams.theme
      }

      if (!!queryParams?.course_type_gia) {
        query['course_type_gia'] = queryParams.course_type_gia
      }

      if (!!queryParams?.status) {
        query['status'] = queryParams.status
      }

      if (!!queryParams?.subject) {
        query['subject'] = queryParams.subject
      }

      if (!!queryParams?.class) {
        query['class'] = queryParams.class
      }

      if (!!queryParams?.sort) {
        query['sort'] = queryParams.sort
      }


      try {
        const response = await useApi('/api/achievements', {
          method: 'GET',
          query,
        })
        if (response.data.done) {
          if (this.page.append === true) {
            console.log('--this.page.append:', this.page.append)
            this.list = [
              ...this.list,
              ...response.data.achievements.filter(item => !this.changeList.includes(item.id))
            ]
          } else {
            this.list = [...response.data.achievements]
          }

          this.page.total = response.data.total
          this.page.last_page = response.data.last_page
          this.page.append = false
        }
      } catch (e) {
        console.log('Ошибка получения достижений', e)
      }

      this.fetching = false
    },
    async achievementsCreate(formData) {
      try {
        const response = await useApi('/api/achievements/create', {
          method: 'POST',
          body: formData
        })

        if (response.data.done) {
          this.messSuccess = 'Успешно создано'
          this.errorForm = null

          return response.data.id
        }
      } catch (e) {
        this.errorForm = JSON.parse(JSON.parse(e.request.response).error)
        console.log('Ошибка создания достижения', e)
      }
    },
    async achievementsUpdate(id, body) {
      try {
        const response = await useApi(`/api/achievements/${id}/update`, {
          method: 'POST',
          body
        })
        if (response.data.done) {
          this.messSuccess = 'Успешно изменено'
          this.errorForm = null

          return response.data.id
        }
      } catch (e) {
        this.errorForm = JSON.parse(JSON.parse(e.request.response).error)
        console.log('Ошибка редактирования достижения', e)
      }
    },
    async achievementsDelete(id) {
      try {
        const response = await useApi(`/api/achievements/${id}/delete`, {
          method: 'DELETE'
        })
        if (response.data.done) {
          // this.list =
        }
      } catch (e) {
        console.log('Ошибка удаления достижения', e)
      }
    },
    errorFormClear() {
      this.errorForm = null
    },
    reset() {
      this.fw()
    },
    resetState() {
      this.changeList = []
    },
    addAchievement(id, body) {
      this.addChangeList(id)
      this.list = [...this.list, body]
    },
    updateAchievement(id, body) {
      this.addChangeList(id)
      this.list = this.list.map((item) => {
        if (item.id === id) return body
        return item
      })
    },
    addChangeList(id) {
      this.changeList = [...this.changeList, id]
    }
  }
})
