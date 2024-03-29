<template>
  <TWTree
    ref="tree"
    class="tree"
    :tree="treeData"
    :dropToMove="false"
    :default-attrs="{
      directoryState: 'collapsed',
      style:{
        fontSize: '12px',
        height: '2.1em',
        titleMaxWidth: '-5%', 
        titleOverflow: 'ellipsis',
        extraFloatRight: true,
    }}"
    :fnBeforeSelect="beforeSelect"
    @select="select"
    @deselect="deselect"
    @blur="inputBlur"
    @drop="drop"
    v-if="treeData.length > 0"
  >
    <template v-slot:icon="{node}">
      <v-icon small color="green" v-if="node.__.parent === null">{{mdiPineTree}}</v-icon>
      <v-icon small color="teal" v-else-if="node.hasChild === true && node.directoryState === 'collapsed'">{{mdiFolder}}</v-icon>
      <v-icon small color="teal" v-else-if="node.hasChild === true && node.directoryState === 'expanded'">{{mdiFolderOpen}}</v-icon>
      <v-icon small color="teal" v-else>{{mdiFile}}</v-icon>
    </template>
    <template v-slot:extra="{node}">
      <context-menu open-on-hover :close-delay="300">
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            x-small 
            icon 
            v-bind="attrs" 
            v-on="on" 
            class="button"
          >
            <v-icon small>{{mdiDotsVertical}}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="doAction('create', node)">
            <v-list-item-icon><v-icon small>{{mdiPlus}}</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('docTree.contextMenu.create') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="doAction('rename', node)">
            <v-list-item-icon><v-icon small>{{mdiPencil}}</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('docTree.contextMenu.rename') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="doAction('remove', node)">
            <v-list-item-icon><v-icon small>{{mdiTrashCanOutline}}</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('docTree.contextMenu.remove') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </context-menu>
    </template>
  </TWTree>
</template>

<script>
import TWTree from 'twtree'
import ContextMenu from '@/components/utils/ContextMenu.vue'
import { API_CODE, NODE_TYPE, TREE_VERSION_CHECKING_INTERVAL } from '@/common/constants.js'
import * as API from '@/common/API.js'
import SpaceRouteParamsHandling from '@/common/spaceRouteParamsHandling.js'
import {
  mdiPineTree,
  mdiFolder,
  mdiFolderOpen,
  mdiFile,
  mdiPlus,
  mdiPencil,
  mdiTrashCanOutline,
  mdiDotsVertical,
} from '@mdi/js'

export default {
  components: {
    TWTree,
    ContextMenu,
  },
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
      let tree = this.$state.tree.getTree(this.spaceId, 'doc')

      if (tree === undefined) {
        this.$state.tree.initTree(this.spaceId, 'doc')
        tree = this.$state.tree.getTree(this.spaceId, 'doc')
        this.$state.treeAction.pullTree(this.spaceId, 'doc')
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
            this.$refs.tree.expand(rootNode)
          }

          if (this.category === 'trash') {
            const selectedOne = this.$refs.tree.getSelectedOne()
            if (selectedOne !== null) {
              this.$refs.tree.deselect(selectedOne)
            }

          } else if (this.category === 'doc' && this.nodeId > 0) {
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
      if (this.$refs.tree !== undefined && this.category === 'trash') {
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
      mdiPineTree,
      mdiFolder,
      mdiFolderOpen,
      mdiFile,
      mdiPlus,
      mdiPencil,
      mdiTrashCanOutline,
      mdiDotsVertical,
      
      treeId: 1,
      selectedItem: null,

      freshIdCounter: 0,

      treeVersionCheckingInterval: null
    }
  },
  methods: {
    handleApiFailure () {
    },
    generateFreshId () {
      this.freshIdCounter += 1
      return `fresh_new_${this.freshIdCounter}`
    },
    async doAction (action, node) {
      switch (action) {
        case 'create': {
          const freshId = this.generateFreshId()
          this.$refs.tree.createAndEdit({
            id: freshId,
            title: this.$t('docTree.defaultTitle'),
            type: NODE_TYPE.ARTICLE_PAGE,
            hasChild: false,
            fresh: true
          }, node)
          break
        }

        case 'rename': {
          this.$refs.tree.setAttr(node, '__', 'oldTitle', node.title)
          this.$refs.tree.edit(node)
          break
        }

        case 'remove': {
          if (node.__.depth > 1) {
            const res = await API.removeTreeNode({
              spaceId:     this.spaceId,
              treeId:      this.treeId,
              nodeId:      node.id,
              treeVersion: this.treeVersion
            })
            this.treeVersion = res.data.data.treeVersion
            this.$refs.tree.remove(node)
            this.$state.treeAction.pullTree(this.spaceId, 'trash')
            this.$emit('node-removed', node.id)
          }
          break
        }
      }
    },
    async inputBlur (node) {
      this.$refs.tree.quitEdit(node)

      // create a node
      if (node.fresh === true) {
        try {
          const title = this.$refs.tree.getNewTitle(node)
          const res = await API.appendTreeNode({
            spaceId:     this.spaceId,
            treeId:      this.treeId,
            title:       title,
            type:        node.type,
            pid:         node.__.parent.id,
            treeVersion: this.treeVersion
          })
          this.treeVersion = res.data.data.treeVersion
          this.$refs.tree.setAttr(node, 'fresh', false)
          this.$refs.tree.setAttr(node, 'title', title)
          this.$refs.tree.setAttr(node, 'id', res.data.data.nodeId)
        } catch (err) {
          this.$refs.tree.remove(node)
          throw err
        }

      // rename a node
      } else {
        try {
          const res = await API.renameTreeNode({
            spaceId:     this.spaceId,
            treeId:      this.treeId,
            nodeId:      node.id,
            newTitle:    node.title,
            treeVersion: this.treeVersion
          })
          this.treeVersion = res.data.data.treeVersion
        } catch (err) {
          this.$refs.tree.setAttr(node, 'title', node.__.oldTitle)
          throw err
        }
      }
    },
    async drop (dragAndDrop) {
      let node = dragAndDrop.dragNode
      let overNode = dragAndDrop.overNode
      let newParent = null
      let newPos    = 0

      switch (dragAndDrop.overArea) {
        case 'prev':
          newParent = overNode.__.parent
          newPos    = overNode.__.pos
          break

        case 'next':
          newParent = overNode.__.parent
          newPos    = overNode.__.pos + 1
          break

        case 'self':
          newParent = overNode
          newPos    = overNode.hasChild
                    ? overNode.children.length
                    : 0
          break
      }

      const res = await API.moveTreeNode({
        spaceId:     this.spaceId,
        treeId:      this.treeId,
        nodeId:      node.id,
        newPid:      newParent.id,
        newLocation: newPos,
        treeVersion: this.treeVersion
      })
      this.treeVersion = res.data.data.treeVersion
      this.$refs.tree.move(node, newParent, newPos)
    },
    async beforeDrop(dragAndDrop) {
      let node = dragAndDrop.dragNode
      let overNode = dragAndDrop.overNode
      let newParent = null
      let newPos    = 0

      switch (dragAndDrop.overArea) {
        case 'prev':
          newParent = overNode.__.parent
          newPos    = overNode.__.pos
          break

        case 'next':
          newParent = overNode.__.parent
          newPos    = overNode.__.pos + 1
          break

        case 'self':
          newParent = overNode
          newPos    = overNode.hasChild
                    ? overNode.children.length
                    : 0
          break
      }

      try {
        const res = await API.moveTreeNode({
          spaceId:     this.spaceId,
          treeId:      this.treeId,
          nodeId:      node.id,
          newPid:      newParent.id,
          newLocation: newPos,
          treeVersion: this.treeVersion
        })
        this.treeVersion = res.data.data.treeVersion
        this.$refs.tree.move(node, node.__.parent, node.__.pos, newParent, newPos)
        return true
      } catch (error) {
        this.handleApiFailure(error)
        return false
      }
    },
    beforeSelect (node) {
      if (this.nodeId > 0 && this.nodeId !== node.id && this.$state.page.hasUnsavedArticles(this.nodeId)) {
        this.$state.globalDialogs.showErrorDialog({message: this.$t('errors.unsavedArticles')})
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
        this.$router.push({name: 'space-node', params: {spaceId: this.spaceId, category: 'doc', nodeId: node.id}})
      }
    }
  },
  mounted () {
    this.treeVersionCheckingInterval = setInterval(async function () {
      const res = await API.getTreeVersion({
        spaceId: this.spaceId,
        treeId: this.treeId
      })
      if (res.data.data.treeVersion !== this.treeVersion) {
        this.$state.treeAction.pullTree(this.spaceId, 'doc')
        this.$state.treeAction.pullTree(this.spaceId, 'trash')
      }
    }.bind(this), TREE_VERSION_CHECKING_INTERVAL)
  },
  beforeDestroy () {
    clearInterval(this.treeVersionCheckingInterval)
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
.tree >>> .twtree-switcher-icon {
  color: grey;
}
</style>
