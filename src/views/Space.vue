<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="left"
      app
      left
      :disable-route-watcher="true"
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
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" :href="homeUrl" target="_blank">
            <v-icon>{{mdiHome}}</v-icon>
          </v-btn>
        </template>
        <span>{{$t('appBar.home')}}</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <search></search>
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

    <global-dialog></global-dialog>

  </v-app>
</template>

<script>
import { mdiHome } from '@mdi/js'

import Left from '@/components/left/Index.vue'
import ArticlePage from '@/components/pages/ArticlePage.vue'
import ArticleList from '@/components/right/ArticleList.vue'
import Viewer from '@/components/top/Viewer.vue'
import Search from '@/components/top/Search.vue'
import GlobalDialog from '@/components/globalDialogs/Index.vue'
import GeneralErrorHandling from '@/common/generalErrorHandling.js'
import SpaceRouteParamsHandling from '@/common/spaceRouteParamsHandling.js'

export default {
  components: {
    Left, 
    ArticlePage, 
    ArticleList, 
    Viewer, 
    GlobalDialog,
    Search
  },
  mixins: [
    GeneralErrorHandling,
    SpaceRouteParamsHandling
  ],
  data: function () {
    return {
      mdiHome,

      left: null,
      right: null,
      homeUrl: null,
    }
  },
  mounted () {
    this.homeUrl = this.$router.resolve({
      name: 'home',
      params: {}
    }).href
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
