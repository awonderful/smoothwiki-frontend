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
          <v-col cols="12" class="d-flex flex-row justify-end">
            <search target="_self"></search>
            <viewer></viewer>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row v-for="item of items" :key="item.id + '_' + item.searchType">
          <v-col cols="12">
            <v-card elevation="0" outlined>
              <v-card-title>
                <v-btn 
                  class="ma-2"
                  color="primary"
                  small
                  rounded
                  depressed
                  target="_blank"
                  :href="item.spaceUrl"
                >
                  {{ item.spaceTitle }}
                </v-btn>
                <v-btn 
                  plain
                  color="primary"
                >
                  {{ item.title }}
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-0">
                <v-row>
                  <v-col cols="3">
                    <div class="pa-2">
                      <TWTree :tree="item.tree">
                      </TWTree>
                    </div>
                  </v-col>
                  <v-col cols="9">
                    <div class="content-wrapper pa-2">
                      <template v-if="Array.isArray(item.articles) && item.articles.length > 0">
                        <v-list>
                          <v-list-item :key="article.id" v-for="article of item.articles">
                            <v-list-item-title>
                              {{article.title}}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </template>
                      <template v-else>
                        {{item.content}}
                      </template>
                    </div>
                  </v-col>
                </v-row>
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
import Search from '@/components/Top/Search.vue'
import GeneralErrorHandling from '@/common/generalErrorHandling.js'
import { SEARCH_TYPE } from '@/common/constants.js'
import * as API from '@/common/API.js'
import TWTree from 'twtree'

export default {
  components: {
    GlobalDialogs,
    Viewer,
    TWTree,
    Search
  },
  mixins: [
    GeneralErrorHandling
  ],
  computed: {
    type () {
      return this.$route.params.type
    },
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
      for (const item of rs.data.data.items) {
        switch (item.searchType) {
          case SEARCH_TYPE.SPACE_TITLE:
          case SEARCH_TYPE.SPACE_DESC:
            item.url = this.$router.resolve({
              name: 'space-node',
              params: {
                spaceId: item.spaceId,
                category: 'doc',
                nodeId: 0
              }
            }).href
            break

          case SEARCH_TYPE.NODE_TITLE:
            item.url = this.$router.resolve({
              name: 'space-node',
              params: {
                spaceId: item.spaceId,
                category: 'doc',
                nodeId: item.id
              }
            }).href
            break

          case SEARCH_TYPE.ARTICLE_TITLE:
          case SEARCH_TYPE.ARTICLE_BODY:
             item.url = this.$router.resolve({
              name: 'space-node',
              params: {
                spaceId: item.spaceId,
                category: 'doc',
                nodeId: item.belongId
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

        /*for (const pathItem of item.path) {
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

        item.path[0].text = item.spaceTitle*/

        const root = {};
        let node = root;
        for (let i=0; i<item.path.length; i++) {
          if (i === 0) {
            Object.assign(node, {
              id: item.path[i].id,
              title: item.path[i].title,
              hasChild: false
            })
          } else {
            node.hasChild = true
            node.children = [{
              id: item.path[i].id,
              title: item.path[i].title,
              hasChild: false
            }]
            node = node.children[0]
            if (i === item.path.length - 1) {
              node.__ = {isSearchResult: true}
            }
            if (i === item.path.length - 1 && Array.isArray(item.children) && item.children.length > 0) {
              node.hasChild = true
              node.children = []
              for (let j=0; j<item.children.length && j<5; j++) {
                const child = item.children[j]
                node.children.push({
                  id: child.id,
                  title: child.title,
                  hasChild: false
                })
              }
            }
          }
        }

        item.tree = [root]
      }
      this.items = rs.data.data.items
      console.log(this.items)
    }
  },
  mounted () {
    this.search()
  }
}
</script>

<style scoped>

.content-wrapper {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 0;
  border-top: 0;
  border-bottom: 0;
  height: 100%;
}

.vertical-divider {
  border: 0;
  width: 0;
  height: calc(100% + 32px);
  border-left: 1px solid lightgrey;
  position: relative;
  top: -16px;
}

</style>