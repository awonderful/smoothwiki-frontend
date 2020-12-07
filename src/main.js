import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/page'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import messages from './langs/messages.js'
// Vue.config.productionTip = false

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages
})

new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
