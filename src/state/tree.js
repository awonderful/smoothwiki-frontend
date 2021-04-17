import Vue from 'vue'

export const TreeState = new Vue({
  data: {
    treeMap: {}
  },
  methods: {
    getTree(spaceId, category) {
      if (this.treeMap[spaceId] === undefined || this.treeMap[spaceId][category] === undefined) {
        return undefined
      }

      return this.treeMap[spaceId][category]
    },
    initTree(spaceId, category) {
      if (this.treeMap[spaceId] === undefined) {
        this.$set(this.treeMap, spaceId, {})
      }

      if (this.treeMap[spaceId][category] === undefined) {
        this.$set(this.treeMap[spaceId], category, {
          data: [],
          version: ''
        })
      }
    },
    setTreeProps(spaceId, category, props) {
      Object.assign(this.treeMap[spaceId][category], props)
    }
  }
})