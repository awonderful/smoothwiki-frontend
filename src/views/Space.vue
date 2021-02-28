<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="left"
      app
      clipped
      left
      class="drawer">
      <Left/>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="right"
      app
      clipped
      right
      class="drawer">
      <ArticleList></ArticleList>
    </v-navigation-drawer>

    <v-app-bar 
      dense 
      app
      clipped-right
      clipped-left>
      <v-app-bar-nav-icon @click="left = !left"></v-app-bar-nav-icon>
      <Tabs/>
      <v-app-bar-nav-icon @click="right = !right"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <ArticlePage/>
    </v-main>

  </v-app>
</template>

<script>
import Left from '@/components/Left/Index'
import Tabs from '@/components/Top/Tabs'
import ArticlePage from '@/components/ArticlePage'
import ArticleList from '@/components/Right/ArticleList'
import { API_CODE_SUCC, NODE_TYPE } from '@/common/constants.js'
import * as API from '@/common/API.js'

export default {
  components: { Left, ArticlePage, ArticleList, Tabs },
  data: function () {
    return {
      left: null,
      right: null
    }
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
