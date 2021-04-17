import Vue from 'vue'
import { TreeState } from './tree.js'
import * as API from '@/common/API.js'

export const TreeAction = new Vue({
  methods: {
    async pullTree (spaceId, category) {
      if (category === 'doc') {
        const res = await API.getTree({
          spaceId: spaceId,
          treeId: 1
        })
        TreeState.setTreeProps(spaceId, category, {
          data: [res.data.data.tree],
          version: res.data.data.treeVersion
        })

      } else {
        const res = await API.getTrashTree({
          spaceId: spaceId,
          treeId: 1
        })
        TreeState.setTreeProps(spaceId, category, {
          data: [res.data.data.tree],
          version: ''
        })
      }
    }
  }
})