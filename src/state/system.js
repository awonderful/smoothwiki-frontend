import Vue from 'vue'

export const SystemState = new Vue({
  data: function () {
    return {
			isTouchDevice: false,
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
	}
})