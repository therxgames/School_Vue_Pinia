import { defineStore } from 'pinia'
import useCommonStore from '~/stores/common'
import _get from 'lodash.get'
import _setWith from 'lodash.setwith'
import _cloneDeep from 'lodash.clonedeep'
import { useSessionStorage } from '@vueuse/core'

export default defineStore({
  id: 'user',

  state () {
    return {
      entity: null,
      roles: null,
      currentRole: null,
      authSource: null,
      settings: null,
      token: null,
      cookie: null,
      fetching: false,
      fetched: false,
      etdTokenFetched: false,
      test_login: false
    }
  },

  getters: {
    logged () {
      return this.entity !== null && this.entity !== ''
    },
    settingsKey () {
      if (!this.logged) {
        return null
      }
      return `user_settings_${this.entity.id}`
    },
    hasRole () {
      return (id) => id && Array.isArray(this.roles) && this.roles.includes(id)
    },
    hasDifferentRoles () {
      return this.logged && Array.isArray(this.roles) && this.roles.length > 1
    },
    allowedRoles () {
      return this.logged && this.roles.filter((role) => role !== this.currentRole)
    },
    userIsCOSUser () {
      return this.logged && this.currentRole === 'user'
    },
    userIsAdmin () {
      return this.logged && this.currentRole === 'admin'
    },
    userIsStudent () {
      console.log(this.state)
      return this.logged && this.currentRole === 'student'
    },
    firstName () {
      const credSetting = getUserSetting('user.login.credentials', null)
      return credSetting?.first_name || this.entity?.given_name || ''
    },
    lastName () {
      const credSetting = getUserSetting('user.login.credentials', null)
      return credSetting?.last_name || this.entity?.family_name || ''
    },
    maskedFullName () {
      return this.firstName + ' ' + this.lastName.toString()[0] + '.'
    },
    fullName () {
      return this.firstName + ' ' + this.lastName
    },
    nameInitials () {
      return this.firstName.toString()[0] + this.lastName.toString()[0]
    },
    shouldShowRoleInfoModal () {
      return () => {
        const shouldToShow = this.logged
          && this.userIsStudent
          && (localStorage.getItem('etd-auth-attempt') !== null || localStorage.getItem('vk-auth-attempt') !== null)

        if (shouldToShow) {
          localStorage.removeItem('etd-auth-attempt')
          localStorage.removeItem('vk-auth-attempt')
        }

        return shouldToShow
      }
    },
    studentId () {
      return  this.userIsStudent && this.entity.id;
    }
  },

  actions: {
    async fetch () {
      this.fetching = true
      this.fetched = false
      // await this.testLogin()
      await this.fetchToken()
      await this.fetchUser()
      await this.fetchSettings()
      this.fetching = false
      this.fetched = true
    },
    async testLogin () {
      const url = '/api/test_dev/test_login/1/admin'
      try {
        const res = await useApi(url, {
          ...methodGet
        })
        if (res.data.done) {
          this.test_login = res.data
        }
      } catch (e) {
        console.error(e)
      }
    },
    async fetchUser () {
      try {
        const response = await useApi('/api/user/current', {
          ...methodGet
        })
        if (response.data.done) {
          this.entity = response.data.user
          this.roles = response.data.roles
          this.currentRole = response.data.currentRole
          this.authSource = response.data.authSource
        }
      } catch (e) {
        /*console.error(e.message);*/
      }
    },
    async fetchToken () {
      try {
        const response = await useApi('/api/auth/token', {
          ...methodGet
        })
        if (response.data.token) {
          this.token = response.data.token
        }
      } catch (e) {
        /*console.error(e.message);*/
      }
    },
    async fetchSettings () {
      if (!this.logged) {
        return
      }

      try {
        const response = await useCommonStore().storageGet(this.settingsKey)
        if (response && response.data.done && response.data.data) {
          this.settings = response.data.data
        }
        else {
          this.settings = {}
        }
      } catch (e) {
        console.error(e.message)
        this.settings = {}
      }
    },
    async saveFetch () {
      if (!this.fetched) {
        await this.fetch()
      }
    },
    async saveSettings () {
      if (!this.logged) {
        return
      }

      try {
        await useCommonStore().storageSet(this.settingsKey, this.settings)
      } catch (e) {
        console.error(e.message)
      }
    },
    async setSetting (key, value, options = { autoSave: true }) {
      if (!this.logged) {
        return
      }

      let _value = _cloneDeep(value)

      if (options?.push === true) {
        let setting = this.getSetting(key, [])
        let limit = options?.limit || 10
        setting.push(value)
        if (setting.length >= limit) {
          setting.splice(0, 1)
        }
        _value = setting
      }

      _setWith(this.settings, key, _value)

      if (options.autoSave) {
        await this.saveSettings()
      }
    },
    getSetting (key, def = null) {
      return _get(this.settings, key, def)
    },
    // TODO delete
    async loginWithId (id = 1, role = 'student') {
      try {
        const response = await useApi(`/api/test_dev/test_login/${id}/${role}`, {
          ...methodGet
        })
        if (response.data.done) {
          await this.fetch()
        }
        return response
      } catch (e) {
        console.error(e.message)
        return e.response
      }
    },
    // TODO delete
    async logoutWithId () {
      try {
        const response = await useApi('/api/test_dev/test_logout', {
          ...methodGet
        })
        if (response.data.done) {
          this.entity = null
        }
      } catch (e) {
        console.error(e.message)
      }
    },
    async loginWithEtd (code, state) {
      try {
        return await useApi('/api/auth/login', {
          ...methodGet,
          query: { code, state }
        })
      } catch (e) {
        console.error(e.message)
        return e.response
      }
    },
    async fetchAuthLink () {
      try {
        const response = await useApi('/api/auth/get_auth_link', { ...methodGet })
        return response.data.link
      } catch (e) {
        console.error(e.message)
      }
    },
    async logout () {
      try {
        useSessionStorage('etd-token', { invoked: 0 }).value.invoked = 0
        const response = await useApi('/api/auth/logout', { ...methodGet })
        return response?.data
      } catch (e) {
        console.log(e.message)
      }
    },
    async loginWithVk ({ silentToken = '', uuid = '' }) {
      try {
        return await useApi('/api/auth_vk_id/login', {
          ...methodGet,
          query: {
            silent_token: silentToken,
            uuid
          }
        })
      } catch (e) {
        console.error(e.message)
        return e.response?._data
      }
    },
    async switchRole (role) {
      if (!this.logged || !role) {
        return
      }

      try {
        const response = await useApi('/api/auth/set_current_role', {
          ...methodPost,
          body: { role }
        })

        if (response.data.done) {
          await this.fetch()
        }
        return response.data
      } catch (e) {
        console.error(e.message)
        return e.response
      }
    },
    async refreshEtdToken () {
      try {
        const response = await useApi('/api/auth/refresh_access_token', { ...methodGet })
        return response?.data?.done
      } catch (e) {
        console.error(e.message)
      }
    },
    async refreshEtdTokenWorker () {
      /*if (!this.logged || this.authSource !== 'etd') {
       return;
       }

       const refreshData = useSessionStorage('etd-token', {invoked: 0});

       if (refreshData.value.invoked === 0) {
       refreshData.value.invoked = 1;
       await this.refreshEtdToken();

       try {
       if ('sendBeacon' in navigator) {
       window.addEventListener(
       'unload',
       () => navigator.sendBeacon('/api/auth/refresh_access_token'),
       false
       );
       }
       } catch (e) {
       console.error('refreshEtdTokenWorker -> ', e.message);
       }
       }*/
    }
  }
})
