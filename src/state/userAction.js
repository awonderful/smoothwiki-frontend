import Vue from 'vue'
import { UserState } from './user.js'
import * as API from '@/common/API.js'
import { USER_STATUS, API_CODE } from '@/common/constants.js'

export const UserAction = new Vue({
  methods: {
    async pullUserInfo () {
      try {
        const res = await API.getUserInfo({})
        UserState.setUserInfo(res.data.data.user)
        UserState.setUserStatus(USER_STATUS.LOGGED_IN)
      } catch (err) {
        if (err.wrongCode === API_CODE.NOT_LOGGED_IN) {
          UserState.setUserStatus(USER_STATUS.NOT_LOGGED_IN)
        }
      }
    },

    async login (data) {
      const res = await API.login(data)
      UserState.setUserStatus(USER_STATUS.LOGGED_IN)
      UserState.setUserInfo(res.data.data.user)
    },

    async logout () {
      const res = await API.logout()
      UserState.setUserStatus(USER_STATUS.NOT_LOGGED_IN)
      UserState.setUserInfo(null)
    },

    async register (data) {
      await API.register(data)
      await this.pullUserInfo()
    }
  }
})