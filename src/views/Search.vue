<template>
  <v-app id="inspire">

    <v-app-bar 
      app 
      dense 
      :dark="$state.theme.top.dark"
      :color="$state.theme.top.bgColor"
    >
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" class="text-right">
          <viewer></viewer>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card elevation="0">
              <v-card-title>
              </v-card-title>
              <v-card-text>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <global-dialogs></global-dialogs>

  </v-app>
</template>

<script>
import GlobalDialogs from '@/components/GlobalDialogs/Index.vue'
import Viewer from '@/components/Top/Viewer.vue'
import GeneralErrorHandling from '@/common/generalErrorHandling.js'
import * as API from '@/common/API.js'

export default {
  components: {
    GlobalDialogs,
    Viewer
  },
  mixins: [
    GeneralErrorHandling
  ],
  computed: {
    type () {
      return this.$route.params.type
    }
  },
  data: function() {
    return {
      items: []
    }
  },
  methods: {
    search() {
      switch (this.type) {
        case 'space':
          let keyword = this.$route.query.keyword
          let spaceId = this.$route.query.spaceId
          this.searchInSpace(spaceId, keyword)
          break
      }
    },
    async searchInSpace(spaceId, keyword) {
      const rs = await API.searchInSpace({
        spaceId: spaceId,
        keyword: keyword
      })
      this.items = rs.data.items
    }
  },
  mounted () {
    this.search()
  }
}
</script>

<style scoped>
</style>