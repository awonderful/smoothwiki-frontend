import Vue from 'vue'

export const ThemeState = new Vue({
  data: function () {
    return {
      top: {
        bgColor: 'blue darken-1',
        dark: true
      },
      left: {
        bgColor: '#f5f5f5'
      },
      right: {
        bgColor: '#f5f5f5'
      },
      articlePage: {
        bgColor: '#eff3f8',
        outdatedBgColor: 'lightred'
      }
    }
  }
})