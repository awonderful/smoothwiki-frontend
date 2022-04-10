<template>
  <div class="apimock-article">
    <article-window
      :isReadOnly   = "article.isReadOnly"
      :isEditing    = "article.isEditing"
      :isFreshNew   = "isFreshNew"
      :isFullScreen = "isFullScreen"
      :title.sync   = "article.editingTitle"
      :buttons      = "buttons"
      :menuItems    = "menuItems"
      @clickButton  = "clickButton"
      @clickMenu    = "clickMenu"
      ref           = "window">
      <template v-slot:editor>
        <v-divider></v-divider>
          <v-container>
            <v-row>
              <v-col>
                <v-autocomplete>

                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                
              </v-col>
            </v-row>
          </v-container>
      </template>
      <template v-slot:view>
      </template>
    </article-window>
  </div>
</template>

<script>
import BaseArticle from './BaseArticle.vue'
import ArticleWindow from './ArticleWindow.vue'

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
  },
  computed: {
    isEditing () {
      return this.article.isEditing
    },
  },
  data: function () {
    return {
      conditions: [],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      operatorMap: {
        equal: '=',
        greater: '>',
        equalOrGreater: '>=',
        less: '<',
        equalOrLess: '<=',
        startWith: 'STARTS WITH',
        match: 'MATCH',
        in: 'IN',
        include: 'INCLUDES'
      },
      request: {
        method: 'GET',
        path: ''
      },
      response: {
        statusCode: 200,
        type: 'text',
        content: '',
      }
    }
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>