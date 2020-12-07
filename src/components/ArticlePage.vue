<template>
  <div class="page">
    <v-container fluid v-if="nodeId > 0">
      <v-row class="my-7 mx-2" :key="article.uniqId" v-for="article of articles">
        <v-col class="pa-0" cols="12">
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
          <v-btn @click="addFreshNewArticle(articleType.MARKDOWN)">+ Markdown</v-btn>
          <v-btn @click="addFreshNewArticle(articleType.RICHTEXT)">+ 富文本</v-btn>
          <v-btn @click="addFreshNewAttachment()">+ 附件</v-btn>
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
import { generateUniqId } from '@/common/util.js'

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
      treeId: 1,
      articleComponentMap: ARTICLE_COMPONENT_MAP,
      articleType: ARTICLE_TYPE,
      uniqIdCounter : 0
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
    articles () {
      return this.$store.getters.getArticles(this.nodeId)
    }
  },
  watch: {
    nodeId: {
      immediate: true,
      handler: function(newVal) {
        let nodeId = newVal
        const page = this.$store.getters.getPage(nodeId)

        if (page === undefined) {
          this.$store.commit('ENSURE_ARTICLE_PAGE', {
            nodeId: nodeId
          })
          this.$store.dispatch('pullArticlePage', {
            spaceId: this.spaceId,
            nodeId: nodeId
          })
        }
      }
    }
  },
  methods: {
    handleApiFailure (error) {
      console.log(error)
    },
    saveArticle (uniqId) {
      this.$store.dispatch('saveArticle', {
        spaceId: this.spaceId,
        nodeId:  this.nodeId,
        uniqId:  uniqId
      })
    },
    removeArticle (uniqId) {
      this.$store.dispatch('removeArticle', {
        spaceId: this.spaceId,
        nodeId:  this.nodeId,
        uniqId:  uniqId
      })
    },
    addFreshNewArticle(type) {
      const uniqId = generateUniqId()
      this.$store.commit('PUT_ARTICLE', {
        nodeId: this.nodeId,
        article: {
          uniqId:   uniqId,
          spaceId:  this.spaceId,
          nodeId:   this.nodeId,
          id:       0,
          type:     type,
          title:    '',
          body:     '',
          search:   '',
          isEditing: true
        }
      })
      this.$store.commit('APPEND_ARTICLE', {
        nodeId: this.nodeId,
        uniqId: uniqId
      })
    },
    addFreshNewAttachment() {
      const uniqId = generateUniqId()
      this.$store.commit('PUT_ARTICLE', {
        nodeId: this.nodeId,
        article: {
          uniqId:   uniqId,
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
        }
      })
      this.$store.commit('APPEND_ARTICLE', {
        nodeId: this.nodeId,
        uniqId: uniqId
      })
     
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
