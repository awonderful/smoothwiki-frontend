<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="left"
      app
      left
      class="drawer"
    >
      <left></left>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="right"
      app
      right
      class="drawer">
      <article-list></article-list>
    </v-navigation-drawer>

    <v-app-bar 
      app
      dense
      :dark="$state.theme.top.dark"
      :color="$state.theme.top.bgColor"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon  @click="left = !left" v-bind="attrs" v-on="on"></v-app-bar-nav-icon>
        </template>
        <span>{{$t('appBar.leftDrawer')}}</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <viewer></viewer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon  @click="right = !right" v-bind="attrs" v-on="on"></v-app-bar-nav-icon>
        </template>
        <span>{{$t('appBar.rightDrawer')}}</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <article-page v-if="nodeId > 0"></article-page>
    </v-main>

    <global-dialogs></global-dialogs>

  </v-app>
</template>

<script>
import Left from '@/components/Left/Index.vue'
import ArticlePage from '@/components/Page/ArticlePage.vue'
import ArticleList from '@/components/Right/ArticleList.vue'
import Viewer from '@/components/Top/Viewer.vue'
import GlobalDialogs from '@/components/GlobalDialogs/Index.vue'
import GeneralErrorHandling from '@/common/generalErrorHandling.js'
import SpaceRouteParamsHandling from '@/common/spaceRouteParamsHandling.js'

export default {
  components: {
    Left, 
    ArticlePage, 
    ArticleList, 
    Viewer, 
    GlobalDialogs
  },
  mixins: [
    GeneralErrorHandling,
    SpaceRouteParamsHandling
  ],
  data: function () {
    return {
      left: null,
      right: null,
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
