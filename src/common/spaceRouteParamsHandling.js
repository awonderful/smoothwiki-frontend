export default {
  computed: {
    spaceId () {
      return parseInt(this.$route.params.spaceId)
    },
    category () {
      return this.$route.params.category === 'trash'
             ? 'trash'
             : 'doc'
    },
    nodeId () {
      return parseInt(this.$route.params.nodeId)
    }
  }
}