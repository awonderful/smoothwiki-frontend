<template>
  <TWTree
    ref="tree"
    class="tree"
    :tree="treeData"
    :default-attrs="{
      directoryState: 'collapsed',
      style:{
        titleMaxWidth: '-5%', 
        titleOverflow: 'ellipsis',
        extraFloatRight: true,
    }}"
    :fnBeforeSelect="beforeSelect"
    :fnBeforeDrag="beforeDrag"
    @select="select"
    @deselect="deselect"
  >
    <template v-slot:icon="{node}">
      <v-icon small color="brown" v-if="node.__.parent === null">{{mdiTrashCan}}</v-icon>
      <v-icon small color="brown lighten-2" v-else-if="node.hasChild === true && node.directoryState === 'collapsed'">{{mdiFolder}}</v-icon>
      <v-icon small color="brown lighten-2" v-else-if="node.hasChild === true && node.directoryState === 'expanded'">{{mdiFolderOpen}}</v-icon>
      <v-icon small color="brown lighten-2" v-else>{{mdiFile}}</v-icon>
    </template>
    <template v-slot:extra="{node}">
      <v-btn icon x-small class="mr-2" @click="doAction('restore', node)" v-if="node.__.gpos > 0">
        <v-icon small>{{mdiDeleteOffOutline}}</v-icon>
      </v-btn>
    </template>
  </TWTree>
</template>

<script>
import TWTree from 'twtree'
import * as API from '@/common/API.js'
import SpaceRouteParamsHandling from '@/common/spaceRouteParamsHandling.js'
import {
  mdiTrashCan,
  mdiFolder,
  mdiFolderOpen,
  mdiFile,
  mdiDeleteOffOutline,
} from '@mdi/js'

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
    },
    treeVersion: {
      get () {
        return this.tree.version
      },
      set (val) {
        this.$state.tree.setTreeProps(this.spaceId, this.category, {
          version: val
        })
      }
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
      mdiTrashCan,
      mdiFolder,
      mdiFolderOpen,
      mdiFile,
      mdiDeleteOffOutline,

      treeId: 1,
      selectedItem: null,
    }
  },
  methods: {
    beforeSelect (node) {
      if (this.nodeId !== node.id && this.$state.page.hasUnsavedArticles(this.nodeId)) {
        this.$state.globalDialogs.showErrorDialog({message: this.$t('errors.unsavedArticles')})
        return false
      }

      if (node.id === 0) {
        return false
      }

      return true
    },
    select (node) {
      if (this.$state.system.isTouchDevice) {
        this.$refs.tree.setAttr(node, 'style', 'extraAlwaysVisible', true)
      }
      this.viewPage(node)
    },
    deselect (node) {
      this.$refs.tree.setAttr(node, 'style', 'extraAlwaysVisible', false)
    },
    viewPage (node) {
      if (this.nodeId !== node.id) {
        this.$router.push({name: 'space-node', params: {spaceId: this.spaceId, category: 'trash', nodeId: node.id}})
      }
    },
    beforeDrag () {
      return false
    },
    async doAction (action, node) {
      switch (action) {
        case 'restore': {
          if (node.__.depth > 1) {
            const res = await API.restoreTreeNode({
              spaceId:     this.spaceId,
              treeId:      this.treeId,
              nodeId:      node.id,
              treeVersion: this.treeVersion
            })
            this.treeVersion = res.data.data.treeVersion
            this.$refs.tree.remove(node)
            this.$state.treeAction.pullTree(this.spaceId, 'doc')
            this.$emit('node-restored', node.id)
          }
          break
        }
      }
    },
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