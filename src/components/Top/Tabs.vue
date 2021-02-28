<template>
 <div>
 </div>
</template>

<script>
  export default {
    name: 'Tabs',
    computed: {
      pages () {
        const pageMap = this.$state.page.getPageMap()

        return pageMap
      }
    },
    data: function() {
      return {

      }
    },

  }
</script>
