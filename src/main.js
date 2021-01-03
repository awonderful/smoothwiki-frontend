import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {state} from './state/index'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import messages from './langs/messages.js'

Vue.use(VueI18n)
Vue.use(state)

const i18n = new VueI18n({
  locale: 'en',
  messages
})

new Vue({
  router,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
