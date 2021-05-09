<template>
  <TWTree
    ref="tree"
    class="tree"
    :tree="treeData"
    :autoHideContextMenu="false"
    :default-attrs="{
      directoryState: 'collapsed',
      style:{
        titleMaxWidth: '-5%', 
        titleOverflow: 'ellipsis'
    }}"
    :fnBeforeSelect="beforeSelect"
    @select="viewPage"
  >
    <template v-slot:icon="{node}">
      <v-icon small color="brown" v-if="node.__.parent === null">mdi-trash-can</v-icon>
      <v-icon small color="brown lighten-2" v-else-if="node.hasChild === true && node.directoryState === 'collapsed'">mdi-folder</v-icon>
      <v-icon small color="brown lighten-2" v-else-if="node.hasChild === true && node.directoryState === 'expanded'">mdi-folder-open</v-icon>
      <v-icon small color="brown lighten-2" v-else>mdi-file</v-icon>
    </template>
  </TWTree>
</template>

<script>
import TWTree from 'twtree'
import SpaceRouteParamsHandling from '@/common/spaceRouteParamsHandling.js'

export default {
  components: { TWTree },
  mixins: [
    SpaceRouteParamsHandling
  ],
  props: {
    keyword: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    tree () {
      let tree = this.$state.tree.getTree(this.spaceId, 'trash')

      if (tree === undefined) {
        this.$state.tree.initTree(this.spaceId, 'trash')
        tree = this.$state.tree.getTree(this.spaceId, 'trash')
        this.$state.treeAction.pullTree(this.spaceId, 'trash')
      }

      return tree
    },
    treeData () {
      return this.tree.data
    }
  },
  watch: {
    treeData: {
      immediate: true,
      handler () {
        this.$nextTick(function () {
          if (this.$refs.tree === undefined) {
            return
          }

          const tree = this.$refs.tree.getNestedTree()
          if (Array.isArray(tree) && tree.length > 0) {
            const rootNode = tree[0]
            this.$refs.tree.setTitle(rootNode, this.$t('trashTree.root'))
          }

          if (this.category === 'doc') {
            const selectedOne = this.$refs.tree.getSelectedOne()
            if (selectedOne !== null) {
              this.$refs.tree.deselect(selectedOne)
            }

          } else if (this.category === 'trash' && this.nodeId > 0) {
            const selectedOne = this.$refs.tree.getSelectedOne()
            const node = this.$refs.tree.getById(this.nodeId)
            if (node !== null && selectedOne !== node) {
              this.$refs.tree.expandAncestors(node)
              this.$refs.tree.select(node)
            }
          }
        }.bind(this))
      }
    },
    category () {
      if (this.$refs.tree !== undefined && this.category === 'doc') {
        const selectedOne = this.$refs.tree.getSelectedOne()
        if (selectedOne !== null) {
          this.$refs.tree.deselect(selectedOne)
        }
      }
    },
    keyword (val) {
      if (val === '') {
        this.$refs.tree.clearSearchResult()
      } else {
        this.$refs.tree.search(this.keyword)
      }
    }
  },
  data: function () {
    return {
      treeId: 1,

      contextMenu: {
        pageX: 0,
        pageY: 0,
        show: true
      }
    }
  },
  methods: {
    beforeSelect (node) {
      if (this.nodeId !== node.id && this.$state.page.hasUnsavedArticles(this.nodeId)) {
        this.$state.globalDialogs.showErrorDialog({message: this.$t('errors.unsavedArticles')})
        return false
      }

      return true
    },
    viewPage (node) {
      if (this.nodeId !== node.id) {
        this.$router.push({name: 'space-node', params: {spaceId: this.spaceId, category: 'trash', nodeId: node.id}})
      }
    }
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