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
          <v-col cols="12" class="d-flex flex-row justify-end align-center">
            <search target="_self"></search>
            <viewer></viewer>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row v-for="item of items" :key="item.objectType + '_' + item.objectId" class="mb-10" justify="center">
          <v-col cols="12" xl="6">
            <v-sheet elevation="0" class="d-flex flex-column mb-2">
                <v-breadcrumbs :items="item.path" class="search-breadcrumbs pa-0">
                  <template v-slot:divider>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-breadcrumbs-item
                      :href="item.href"
                      target="_blank"
                      class="search-breadcrumbs-item"
                    >
                      {{ item.text }}
                    </v-breadcrumbs-item>
                  </template>
                </v-breadcrumbs>


                <a :href="item.url" target="_blank" class="search-title text-h6">
                  {{ item.objectTitle }}
                </a>

                <div class="search-conent grey--text">
                  <template v-if="item.objectType === SEARCH_OBJECT_TYPE.ARTICLE">
                    {{ item.objectContent }}
                  </template>
                  <template v-if="item.objectType === SEARCH_OBJECT_TYPE.SPACE">
                    {{ item.objectContent }}
                  </template>
                  <template v-if="item.objectType === SEARCH_OBJECT_TYPE.TREE_NODE">
                    <ul>
                      <li v-for="article of item.articles" :key="'article_' + article.id">
                        {{ article.title }}
                      </li>
                      <li v-for="child of item.children" :key="'node_' + child.id">
                        {{ child.title}}
                      </li>
                    </ul>
                  </template>
                </div>
            </v-sheet>
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-pagination
              v-model="whichPage"
              :length="pageCount"
              :total-visible="10"
            ></v-pagination> 
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
import Search from '@/components/Top/Search.vue'
import GeneralErrorHandling from '@/common/generalErrorHandling.js'
import { SEARCH_OBJECT_TYPE } from '@/common/constants.js'
import * as API from '@/common/API.js'

export default {
  components: {
    GlobalDialogs,
    Viewer,
    Search
  },
  mixins: [
    GeneralErrorHandling
  ],
  computed: {
    range () {
      return this.$route.params.range
    },
    whichPage: {
      get () {
        return this.$route.query.whichPage
              ? parseInt(this.$route.query.whichPage)
              : 1
      },
      set (val) {
        this.$router.push({
          name: 'search',
          params: {
            range: this.range
          },
          query: {
            spaceId: this.$route.query.spaceId,
            whichPage: val,
            pageSize: this.pageSize,
            keyword: this.$route.query.keyword
          }
        })
      }
    },
    pageSize () {
      return this.$route.query.pageSize
             ? parseInt(this.$route.query.pageSize)
             : 20
    }
  },
  data: function() {
    return {
      pageCount: 0,
      items: [],
      SEARCH_OBJECT_TYPE: SEARCH_OBJECT_TYPE
    }
  },
  methods: {
    async search() {
      const rs = await API.search({
        spaceId: this.$route.query.spaceId,
        keyword: this.$route.query.keyword,
        whichPage: this.whichPage,
        pageSize: 20,
        range: this.range
      })
      this.pageCount = rs.data.data.pageCount
      for (const item of rs.data.data.items) {
        switch (item.objectType) {
          case SEARCH_OBJECT_TYPE.SPACE:
            item.url = this.$router.resolve({
              name: 'space-node',
              params: {
                spaceId: item.spaceId,
                category: 'doc',
                nodeId: 0
              }
            }).href
            break

          case SEARCH_OBJECT_TYPE.TREE_NODE:
            item.url = this.$router.resolve({
              name: 'space-node',
              params: {
                spaceId: item.spaceId,
                category: 'doc',
                nodeId: item.objectId
              }
            }).href
            break

          case SEARCH_OBJECT_TYPE.ARTICLE:
             item.url = this.$router.resolve({
              name: 'space-node',
              params: {
                spaceId: item.spaceId,
                category: 'doc',
                nodeId: item.nodeId
              }
            }).href
            break
        }

        item.spaceUrl = this.$router.resolve({
          name: 'space-node',
          params: {
            spaceId: item.spaceId,
            category: 'doc',
            nodeId: 0
          }
        }).href

        if (!Array.isArray(item.path)) {
          continue
        }

        for (const pathItem of item.path) {
          const router = this.$router.resolve({
            name: 'space-node',
            params: {
              spaceId: item.spaceId,
              category: 'doc',
              nodeId: pathItem.id
            }
          })
          pathItem.text = pathItem.title
          pathItem.href = router.href
          pathItem.target = '_blank'
        }
        item.path[0].text = item.spaceTitle
      }
      this.items = rs.data.data.items
    }
  },
  watch: {
    '$route.query': function () {
      this.search()
    },
    '$route.params': function () {
      this.search()
    }
  },
  mounted () {
    this.search()
  }
}
</script>

<style scoped>

.search-title {
  text-decoration: none;
}

.search-title:hover {
  text-decoration: underline;
}

.search-breadcrumbs >>> .search-breadcrumbs-item:not(:hover) a {
  color: grey;
}
</style>