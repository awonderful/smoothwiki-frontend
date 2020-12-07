<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      class="drawer"
    >
      <Tree />
    </v-navigation-drawer>

    <v-app-bar dense app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <ArticlePage/>
    </v-main>

    <v-alert v-if="showMessage" class="alert" type="error" dense :dismissible="true" elevation="4">
      {{ message }}
    </v-alert>

  </v-app>
</template>

<script>
import Tree from '@/components/Tree'
import ArticlePage from '@/components/ArticlePage'
import { API_CODE_SUCC, NODE_TYPE } from '@/common/constants.js'
import * as API from '@/common/API.js'

export default {
  components: { Tree, ArticlePage },
  data: function () {
    return {
      drawer: null,
      spaceId: 0,
      treeId: 1,
      nodeId: 0,

      message: '',
      showMessage: false,
    }
  },
  methods: {
    viewPage (node) {
      this.nodeId = node.id
    }
  },
  mounted () {
    this.spaceId = parseInt(this.$route.params.id)
  }
}
</script>

<style scoped>
.menu-item:hover {
  background-color: lightblue;
}
.alert {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 9999;
}
.contextmenu {
  z-index: 99999;
}
</style>
