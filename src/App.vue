<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$state.systemAction.pullSystemInfo()

    setInterval(function () {
      const isTouchDevice = ('ontouchstart' in window)
                  || (navigator.maxTouchPoints > 0)
                  || (navigator.msMaxTouchPoints > 0)
      if (this.$state.system.isTouchDevice !== isTouchDevice) {
        this.$state.system.isTouchDevice = isTouchDevice
      }
    }.bind(this), 1000)
  }
}
</script>

<style>
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
