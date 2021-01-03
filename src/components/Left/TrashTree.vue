<template>
  <TWTree
    ref="tree"
    class="tree"
    :tree="tree"
    :autoHideContextMenu="false"
    :default-attrs="{
      directoryState: 'collapsed',
      style:{
        titleMaxWidth: '-5%', 
        titleOverflow: 'ellipsis'
    }}"
    @click="viewPage"
  >
    <template v-slot:icon="{node}">
      <v-icon small color="brown" v-if="node.__.parent === null">mdi-trash-can</v-icon>
      <v-icon small color="light-blue darken-3" v-else-if="node.hasChild === true && node.directoryState === 'collapsed'">mdi-folder</v-icon>
      <v-icon small color="light-blue darken-3" v-else-if="node.hasChild === true && node.directoryState === 'expanded'">mdi-folder-open</v-icon>
      <v-icon small color="teal" v-else>mdi-file</v-icon>
    </template>
  </TWTree>
</template>

<script>
import TWTree from 'twtree'
import { API_CODE_SUCC, NODE_TYPE } from '@/common/constants.js'
import * as API from '@/common/API.js'

export default {
  components: { TWTree },
  computed: {
    spaceId () {
      return parseInt(this.$route.params.spaceId)
    },
    nodeId () {
      return this.$route.params.nodeId !== undefined
        ? parseInt(this.$route.params.nodeId)
        : 0
    }
  },
  data: function () {
    return {
      treeId: 1,
      tree: [],
      treeVersion: null,
      selectedItem: null,

      message: '',
      showMessage: false,

      contextMenu: {
        pageX: 0,
        pageY: 0,
        show: true
      }
    }
  },
  methods: {
    handleApiFailure (error) {
      if (error.wrongCode) {
        this.message = error.wrongCode.response.data.message
      } else {
        this.message = 'network error!'
      }
      this.showMessage = true
    },
    getTree () {
      API.getTrashTree({
        spaceId: this.spaceId,
        treeId: this.treeId
      }).then((res) => {
        res.data.data.tree.directoryState = "collapsed"
        res.data.data.tree.title = "回收站"
        this.tree = [res.data.data.tree]
      })
    },
    viewPage (node) {
      if (this.nodeId !== node.id) {
        this.$router.push({name: 'space-node', params: {spaceId: this.spaceId, nodeId: node.id}})
      }
    },
    refresh () {
      this.getTree()
    }
  },
  mounted () {
    this.getTree()
  }
}
</script>

<style scoped>
.tree {
  width: 100%;
  height: auto;
}
.menu-item:hover {
  background-color: lightblue;
}
.contextmenu {
  z-index: 999;
}
.tree >>> .twtree-title {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-weight: normal;
}
</style>