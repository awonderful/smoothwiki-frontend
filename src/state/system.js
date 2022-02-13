import Vue from 'vue'
import * as API from '@/common/API.js'

export const SystemState = new Vue({
  data: function () {
    return {
      isTouchDevice: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0),
      appName: '',
      title: '',
    }
  },
  watch: {
    title (val) {
      window.document.title = val
    }
  },
  methods: {
    async pullSystemInfo () {
      const res = await API.getSystemInfo({})
      this.appName = res.data.data.appName
      if (this.title === '') {
        this.title = this.appName
      }
    }
  },
  created () {
    this.pullSystemInfo()
  }
})