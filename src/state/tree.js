import Vue from 'vue'

export const TreeState = new Vue({
  data: {
    treeMap: {}
  },
  methods: {
    getTree(spaceId, treeId) {
      if (this.treeMap[spaceId] === undefined || this.treeMap[spaceId][treeId] === undefined) {
        return undefined
      }

      return this.treeMap[spaceId][treeId]
    },
    ensureTree(spaceId, treeId) {
      if (this.treeMap[spaceId] === undefined) {
        Vue.set(this.treeMap, spaceId, {})
      }

      if (this.treeMap[spaceId][treeId] === undefined) {
        Vue.set(this.treeMap[spaceId], treeId, {
          data: [],
          version: ''
        })
      }
    },
    setTreeProps(spaceId, treeId, props) {
      Object.assign(this.treeMap[spaceId][treeId], props)
    }
  }
})