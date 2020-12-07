<template>
  <TWTree
    ref="tree"
    class="tree"
    :tree="tree"
    :fnBeforeDrop="beforeDrop"
    :fnBeforeContextMenu="beforeContextMenu"
    :autoHideContextMenu="false"
    :default-attrs="{
      style:{
        titleMaxWidth: '-5%', 
        titleOverflow: 'ellipsis'
    }}"
    @click="viewPage"
    @blur="inputBlur"
  >
    <template v-slot:contextmenu="{node}">
      <v-menu
        v-model="contextMenu.show" 
        elevation="2" 
        class="contextmenu" 
        :position-x="contextMenu.pageX" 
        :position-y="contextMenu.pageY">
        <v-list dense>
          <v-list-item-group v-model="selectedItem">
            <v-list-item class="menu-item" @click.prevent="clickContextMenu('create', node)">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-left font-weight-regular pr-2">create</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="menu-item" @click="clickContextMenu('rename', node)">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-pencil</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-left font-weight-regular pr-2">rename</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="menu-item" @click="clickContextMenu('remove', node)" v-if="node.__.depth > 1">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-trash-can-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-left font-weight-regular pr-2">remove</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="menu-item" @click="clickContextMenu('settings', node)">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-cog-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-left font-weight-regular pr-2">settings</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </template>
  </TWTree>
</template>

<script>
import TWTree from './TWTree'
import { API_CODE_SUCC, NODE_TYPE } from '@/common/constants.js'
import * as API from '@/common/API.js'

export default {
  components: { TWTree },
  data: function () {
    return {
      spaceId: null,
      treeId: 1,
      tree: [],
      treeVersion: null,
      selectedItem: null,

      freshIdCounter: 0,

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
      API.getTree({
        spaceId: this.spaceId,
        treeId: this.treeId
      }).then((res) => {
        this.tree = [res.data.data.tree]
        this.treeVersion = res.data.data.treeVersion
        this.$nextTick(() => {
          if (this.$route.params.nodeId !== undefined) {
            const routerNodeId = parseInt(this.$route.params.nodeId)
            let selectedNode = this.$refs.tree.getSelectedOne()
            let routerNode   = this.$refs.tree.getById(routerNodeId)
            if (selectedNode === null && routerNode !== null) {
              this.$refs.tree.select(routerNode)
            }
          }
        })
      }).catch ((error) => {
        this.handleApiFailure(error)
      })
    },
    generateFreshNewId () {
      this.freshIdCounter += 1
      return `fresh_new_${this.freshIdCounter}`
    },
    beforeContextMenu(node, event) {
      this.contextMenu.pageX = event.pageX
      this.contextMenu.pageY = event.pageY
      if (!this.contextMenu.show) {
        this.contextMenu.show = true
      }
    },
    clickContextMenu (action, node) {
      switch (action) {
        case 'create': {
          const freshNewId = this.generateFreshNewId()
          this.$refs.tree.createAndEdit({
            id: freshNewId,
            title: 'UNTITLED',
            type: NODE_TYPE.ARTICLE_PAGE,
            hasChild: false,
            freshNew: true
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
            API.removeTreeNode({
              spaceId:     this.spaceId,
              treeId:      this.treeId,
              nodeId:      node.id,
              treeVersion: this.treeVersion
            }).then((res) => {
              this.treeVersion = res.data.data.treeVersion
              this.$refs.tree.remove(node)
            }).catch((error) => {
              this.handleApiFailure(error)
            })
          }
          break
        }
      }
    },
    inputBlur (node) {
      this.$refs.tree.quitEdit(node)

      // create a node
      if (node.freshNew) {
        const title = this.$refs.tree.getNewTitle(node)
        API.appendTreeNode({
          spaceId:     this.spaceId,
          treeId:      this.treeId,
          title:       title,
          type:        node.type,
          pid:         node.__.parent.id,
          treeVersion: this.treeVersion
        }).then((res) => {
          this.treeVersion = res.data.data.treeVersion
          this.$refs.tree.setAttr(node, 'freshNew', false)
          this.$refs.tree.setAttr(node, 'title', title)
          this.$refs.tree.setAttr(node, 'id', res.data.data.nodeId)
        }).catch((error) => {
          this.$refs.tree.remove(node)
          this.handleApiFailure(error)
        })

      // rename a node
      } else {
        API.renameTreeNode({
          spaceId:     this.spaceId,
          treeId:      this.treeId,
          nodeId:      node.id,
          newTitle:    node.title,
          treeVersion: this.treeVersion
        }).then((res) => {
          this.treeVersion = res.data.data.treeVersion
        }).catch((error) => {
          this.$refs.tree.setAttr(node, 'title', node.__.oldTitle)
          this.handleApiFailure(error)
        })
      }
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
    viewPage (node) {
      this.$router.push({name: 'space-node', params: {spaceId: this.spaceId, nodeId: node.id}})
    }
  },
  mounted () {
    this.spaceId = parseInt(this.$route.params.spaceId)
    this.getTree()
  }
}
</script>

<style scoped>
.tree {
  width: 100%;
  height: 500px;
}
.menu-item:hover {
  background-color: lightblue;
}
.contextmenu {
  z-index: 999;
}
</style>
