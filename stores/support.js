import { defineStore } from 'pinia'

export default defineStore({
  id: 'support',

  state () {
    return {
      from: {
        value: '',
        id: null
      },
      subjects: [],
      currentsubject: null,
      files: [],
      filesEvent: [],
      wrongFiles: [],
      totalCollect: [],
      fields: [
        { isField: true, name: 'subject', value: '', isValid: false },
        { isField: true, name: 'message', value: '', isValid: false },
        { isField: true, name: 'call_you', value: '', isValid: false },
        { isField: true, name: 'email', value: '', isValid: false },
        { isField: true, name: 'test_number', value: '', isValid: false },
        { isField: false, name: 'captcha', value: '', isValid: false }
      ],
      checkFields: false,
      captcha: {
        src: '',
        show: false,
        hasAttempt: false
      },
      agreement: false,
      sending: false,
      submit: false
    }
  },

  getters: {
    previewFiles () {
      if (this.files.length > 0) {
        return [...this.files].map((file, ind) => {
          return {
            data: file,
            index: ind,
            name: file.name,
            type: file.type,
            src: URL.createObjectURL(file),
            size: file.size
          }
        })
      }
      return []
    },
    totalLoaded () {
      if (this.totalCollect.length > 0) {
        return [...this.totalCollect].reduce((acc, el) => acc + el)
      }
      return 0
    },
    fieldsValid () {
      const fields = this.fields.filter(f => f.isField)
      const res = fields.every(f => f.isValid)
      if (res) {
        this.checkFields = false
      }
      return res
    },
    isValid () {
      return this.agreement && this.fields.every((f) => f.isValid)
    },
    getSubjects () {
      if (this.from.value === 'task') {
        return [...this.subjects].filter((s) => s.id !== 2)
      }
      if (this.from.value === 'test') {
        return [...this.subjects].filter((s) => s.id !== 1)
      }
      return [...this.subjects]
    }
  },

  actions: {
    async fetchSubjects () {
      const url = '/api/support/themes'
      try {
        const res = await useApi(url, {
          ...methodGet
        })
        if (res.data.done) {
          this.subjects = res.data.themes
        }
      } catch (e) {
        console.error(e)
      }
    },
    async getCaptcha () {
      try {
        const res = await useApi('/api/captcha', {
          ...methodGet
        })
        if (res.data.done) {
          this.captcha.src = res.data.captcha
        }
      } catch (e) {
        console.error(e)
      }
    },
    async sendForm () {
      this.sending = true
      this.captcha.hasAttempt = true
      const formData = new FormData()
      this.fields.forEach((f) => {
        formData.append(f.name, f.value)
      })
      if (this.files.length > 0) {
        this.files.forEach((
          file,
          index
        ) => formData.append(`file${index + 1}`, file))
      }
      try {
        const res = await useApi('/api/support/send', { formData })
        if (res.data.done) {
          this.submit = true
        }
      } catch (e) {
        this.checkFields = true
        const res = JSON.parse(e.response.data.error)
        const errorsArr = Object.keys(res)
        errorsArr.forEach((err) => {
          const field = this.fields.find((f) => f.name === err)
          field.isValid = false
        })
      } finally {
        this.sending = false
      }
    }
  }
})
