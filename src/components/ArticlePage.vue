<template>
  <div class="page" ref="page">
    <v-container fluid v-if="nodeId > 0">
      <v-row class="mx-2 flex-column flex-nowrap">
        <v-col class="pa-0 mt-5" cols="12" :style="{order: article.order}" :key="article.uniqId" v-for="article of articleMap">
          <component
            :ref="'article-' + article.uniqId"
            :is="articleComponentMap[article.type]"
            :article="article"
            @save="saveArticle"
            @remove="removeArticle"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn @click="addFreshArticle(articleType.MARKDOWN)">+ Markdown</v-btn>
          <v-btn @click="addFreshArticle(articleType.RICHTEXT)">+ 富文本</v-btn>
          <v-btn @click="addFreshAttachment()">+ 附件</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { API_CODE_SUCC, ARTICLE_COMPONENT_MAP, ARTICLE_TYPE, PAGE_STATUS } from '@/common/constants.js'
import MarkdownArticle from '@/components/Article/MarkdownArticle.vue'
import RichTextArticle from '@/components/Article/RichTextArticle.vue'
import AttachmentArticle from '@/components/Article/AttachmentArticle.vue'
import MindArticle from '@/components/Article/MindArticle.vue'
import PdfArticle from '@/components/Article/PdfArticle.vue'
import * as API from '@/common/API.js'

export default {
  components: {
    MarkdownArticle,
    RichTextArticle,
    AttachmentArticle,
    MindArticle,
    PdfArticle
  },
  data: function () {
    return {
      articleComponentMap: ARTICLE_COMPONENT_MAP,
      articleType: ARTICLE_TYPE,
    }
  },
  computed: {
    spaceId () {
      return parseInt(this.$route.params.spaceId)
    },
    nodeId () {
      return this.$route.params.nodeId !== undefined
        ? parseInt(this.$route.params.nodeId)
        : 0
    },
    articleMap () {
      return this.$state.page.getArticleMap(this.nodeId)
    },
    scrollTo () {
      const page = this.$state.page.getPage(this.nodeId)

      return page.scrollTo
    }
  },
  watch: {
    nodeId: {
      immediate: true,
      handler: function(newVal) {
        let nodeId = newVal
        const page = this.$state.page.getPage(nodeId)

        if (page === undefined) {
          this.$state.page.ensureArticlePage(nodeId)
          this.$state.pageAction.pullArticlePage(this.spaceId, nodeId)
        }
      }
    },
    scrollTo(newVal) {
      const uniqId = newVal
      this.scrollToArticle(uniqId)
    }
  },
  methods: {
    handleApiFailure (error) {
      console.log(error)
    },
    saveArticle (uniqId) {
      this.$state.pageAction.saveArticle(this.spaceId, this.nodeId, uniqId)
    },
    removeArticle (uniqId) {
      this.$state.pageAction.removeArticle(this.spaceId, this.nodeId, uniqId)
    },
    addFreshArticle(type) {
      this.$state.page.appendArticle(this.nodeId, {
        spaceId:  this.spaceId,
        nodeId:   this.nodeId,
        id:       0,
        type:     type,
        title:    '',
        body:     '',
        search:   '',
        isEditing: true
      })
    },
    addFreshAttachment() {
      this.$state.page.appendArticle(this.nodeId, {
          spaceId:  this.spaceId,
          nodeId:   this.nodeId,
          id:       0,
          type:     this.articleType.ATTACHMENT,
          title:    '附件',
          body:     JSON.stringify({
            items: []
          }),
          search:   '',
          isEditing: false
      })
    },
    getArticleElement(uniqId) {
      const ref = 'article-' + uniqId
      return this.$refs[ref][0].$el
    },
    scrollToArticle(uniqId) {
      const el = this.getArticleElement(uniqId)
      window.scrollTo({top: el.offsetTop - 40})
    }
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  background-color: #eff3f8;
  min-height: 100vh;
}

.article-container {
  background-color: #ffffff;
}
</style>
