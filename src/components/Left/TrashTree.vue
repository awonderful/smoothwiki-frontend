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
    :fnBeforeContextMenu="beforeContextMenu"
    :fnBeforeDrag="beforeDrag"
    @select="viewPage"
  >
    <template v-slot:icon="{node}">
      <v-icon small color="brown" v-if="node.__.parent === null">mdi-trash-can</v-icon>
      <v-icon small color="brown lighten-2" v-else-if="node.hasChild === true && node.directoryState === 'collapsed'">mdi-folder</v-icon>
      <v-icon small color="brown lighten-2" v-else-if="node.hasChild === true && node.directoryState === 'expanded'">mdi-folder-open</v-icon>
      <v-icon small color="brown lighten-2" v-else>mdi-file</v-icon>
    </template>
    <template v-slot:contextmenu="{node}">
      <v-menu
        v-model="contextMenu.show" 
        elevation="2" 
        class="contextmenu"
        fixed
        :position-x="contextMenu.clientX" 
        :position-y="contextMenu.clientY">
        <v-list dense>
          <v-list-item-group v-model="selectedItem">
            <v-list-item class="menu-item" @click="clickContextMenu('restore', node)" v-if="node.__.depth > 1">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-delete-off-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-left font-weight-regular pr-2">{{ $t('trashTree.contextMenu.restore') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </template>

  </TWTree>
</template>

<script>
import TWTree from 'twtree'
import * as API from '@/common/API.js'
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
      treeId: 1,
      selectedItem: null,

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
    },
    beforeDrag () {
      return false
    },
    beforeContextMenu(node, event) {
      this.contextMenu.pageX = event.pageX
      this.contextMenu.pageY = event.pageY
      this.contextMenu.clientX = event.clientX
      this.contextMenu.clientY = event.clientY
      if (!this.contextMenu.show) {
        this.contextMenu.show = true
      }
    },
    async clickContextMenu (action, node) {
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