import Vue from 'vue'
import { USER_STATUS } from '@/common/constants.js'

export const UserState = new Vue({
  data: function () {
    return {
      status: USER_STATUS.NONE,
      user: null
    }
  },
  computed: {

  },
  methods: {
    isLoggedIn () {
      return this.status === USER_STATUS.LOGGED_IN
    },
    getUserInfo () {
      return this.user
    },
    setUserInfo (user) {
      this.user = Vue.observable(user)
    },
    setUserStatus (status) {
      this.status = status
    },
    getUserStatus () {
      return this.status
    }
  }
})