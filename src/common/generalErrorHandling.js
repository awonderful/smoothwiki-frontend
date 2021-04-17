export default {
  data: function () {
    return {
      alert: {
        show: false,
        message: ''
      }
    }
  },
  errorCaptured () {
    this.alert.message = '网络错误，请稍候再试！'
    this.alert.show = true
  }
}