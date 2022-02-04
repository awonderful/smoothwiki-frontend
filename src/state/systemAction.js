import Vue from 'vue'
import { SystemState } from './system.js'
import * as API from '@/common/API.js'

export const SystemAction = new Vue({
  methods: {
    async pullSystemInfo () {
      const res = await API.getSystemInfo({})
      SystemState.appName = res.data.data.appName
      if (SystemState.title === '') {
        SystemState.title = SystemState.appName
      }
    }
  }
})