import Vue from 'vue'
import { isJsonString } from '@/common/util.js'

export const LocalStorage = new Vue({
  data: function () {
    return {
      data: {
        locale: 'zh_CN',
        event: {
          from: 0,
          to: 0,
          name: '',
          data: {},
          timestamp: 0
        }
      },
    }
  },
  methods: {
    setProp(key, val) {
      this.data[key] = val

      if (val === null || val === undefined) {
        this.removeProp(key)
      } else if (typeof val === 'object' && val !== null) {
        window.localStorage.setItem(key, JSON.stringify(val))
      } else {
        window.localStorage.setItem(key, val)
      }
    },
    getProp(key) {
      return this.data.hasOwnProperty(key)
             ? this.data[key]
             : undefined
    },
    removeProp(key) {
      window.localStorage.removeItem(key)
    },
    loadDataFromLocalStorage() {
      for (const key in window.localStorage) {
        let val = window.localStorage.getItem(key)
        if (isJsonString(val)) {
          val = JSON.parse(val)
        }
        this.$set(this.data, key, val)
      }
    },
    clear() {
      window.localStorage.clear()
    }
  },
  created() {
    window.addEventListener("storage", function () {
      this.loadDataFromLocalStorage()
    }.bind(this))

    this.loadDataFromLocalStorage()
  }
})