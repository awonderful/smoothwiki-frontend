import Vue from 'vue'
import VueRouter from 'vue-router'
import { UserState } from '@/state/user.js'
import { UserAction } from '@/state/userAction.js'
import { USER_STATUS } from '@/common/constants.js'

const Home = () => import('@/views/Home.vue')
const Space = () => import('@/views/Space.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const ForgotPassword = () => import('@/views/ForgotPassword.vue')
const ResetPassword = () => import('@/views/ResetPassword.vue')
const Search = () => import('@/views/Search.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: {
      name: 'home'
    }
  },
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
    path: '/search/:range',
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
      next({
        name: 'login',
        query: {
          from: window.location.href,
        },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
