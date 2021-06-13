import { DEFAULT_LOCALE } from '@/common/constants.js'

export default {
  computed: {
    locale() {
      return this.$i18n.locale
    }
  },
  watch: {
    locale (newVal) {
      window.localStorage.locale = newVal
    }
  },
  created () {
    this.$i18n.locale = window.localStorage.locale !== undefined
                      ? window.localStorage.locale
                      : DEFAULT_LOCALE
  }
}