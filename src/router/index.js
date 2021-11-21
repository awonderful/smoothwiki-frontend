import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Space from '@/views/Space.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import Search from '@/views/Search.vue'
import { UserState } from '@/state/user.js'
import { UserAction } from '@/state/userAction.js'
import { USER_STATUS } from '@/common/constants.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      mustBeLoggedIn: true
    }
  },
  {
    path: '/space/:spaceId/:category/:nodeId',
    name: 'space-node',
    component: Space,
    meta: {
      mustBeLoggedIn: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      mustBeLoggedIn: false
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      mustBeLoggedIn: false
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: {
      mustBeLoggedIn: false
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
    meta: {
      mustBeLoggedIn: false
    }
  },
  {
    path: '/search/:type',
    name: 'search',
    component: Search,
    meta: {
      mustBeLoggedIn: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.mustBeLoggedIn === true) {
    if (UserState.getUserStatus() === USER_STATUS.NONE) {
      await UserAction.pullUserInfo()
    }
    if (UserState.getUserStatus() === USER_STATUS.NOT_LOGGED_IN) {
      next({name: 'login'})
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
