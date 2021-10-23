<template>
  <div class="page" ref="page" @contextmenu="handleContextmenuEvent($event)" :style="{'background-color': $state.theme.articlePage.bgColor}">
    <v-alert
      elevation="2"
      class="text-center outdated-alert"
      color="warning"
      dark
      v-if="isOutdated"
    >
      {{$t('page.articlePage.outdatedAlert')}}
      <v-btn small light @click="refreshPage()"> 
        {{$t('page.articlePage.refresh')}} 
      </v-btn>
    </v-alert>
    <v-container fluid v-if="page !== undefined">
      <v-row class="mx-2 flex-column flex-nowrap">
        <v-col class="pa-2 mt-5" cols="12" :style="{order: article.order}" :key="article.uniqId" v-for="article of articleMap">
          <component
            :ref="'article-' + article.uniqId"
            :is="articleComponentMap[article.type]"
            :article="article"
            @save="saveArticle"
            @remove="removeArticle"
            @history="showArticleHistoryVersions"/>
        </v-col>
      </v-row>
      <v-row v-if="page.isReadOnly === false" justify="center" class="mt-5 mb-3" @contextmenu.stop="doNothing()">
        <v-col cols="2">
          <v-btn color="primary" @click="addFreshArticle(articleType.MARKDOWN)">{{ $t('page.articlePage.buttons.markdown') }}</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" @click="addFreshArticle(articleType.RICHTEXT)">{{ $t('page.articlePage.buttons.richText') }}</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" @click="addFreshArticle(articleType.MIND)">{{ $t('page.articlePage.buttons.mind') }}</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" @click="addFreshArticle(articleType.ATTACHMENT)">{{ $t('page.articlePage.buttons.attachment') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <history-dialog
      v-model="historyDialog.isVisible"
      :spaceId="spaceId"
      :nodeId="nodeId"
      :uniqId="historyDialog.uniqId"
    ></history-dialog>

    <v-menu
      v-model="contextmenu.show"
      v-if="!page.isReadOnly"
      fixed
      :position-x="contextmenu.x"
      :position-y="contextmenu.y"
    >
      <v-list dense>
        <v-list-item-group>
          <v-list-item :disabled="!isPastable" @click="paste()">
            <v-list-item-icon>
              <v-icon>mdi-content-paste</v-icon>
            </v-list-item-icon>
            <v-list-item-title>粘贴</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { API_CODE, ARTICLE_COMPONENT_MAP, ARTICLE_TYPE, PAGE_VERSION_CHECKING_INTERVAL } from '@/common/constants.js'
import SpaceRouteParamsHandling from '@/common/spaceRouteParamsHandling.js'
import MarkdownArticle from '@/components/Article/MarkdownArticle.vue'
import RichTextArticle from '@/components/Article/RichTextArticle.vue'
import AttachmentArticle from '@/components/Article/AttachmentArticle/Index.vue'
import MindArticle from '@/components/Article/MindArticle.vue'
import PdfArticle from '@/components/Article/PdfArticle.vue'
import HistoryDialog from '@/components/Dialog/HistoryDialog.vue'
import * as API from '@/common/API.js'

export default {
  components: {
    MarkdownArticle,
    RichTextArticle,
    AttachmentArticle,
    MindArticle,
    PdfArticle,
    HistoryDialog
  },
  mixins: [
    SpaceRouteParamsHandling
  ],
  data: function () {
    return {
      articleComponentMap: ARTICLE_COMPONENT_MAP,
      articleType: ARTICLE_TYPE,

      contextmenu: {
        show: false,
        order: -1,
        x: 0,
        y: 0
      },

      lastViewRefreshingInterval: null,
      outdateCheckingInterval: null,

      historyDialog: {
        isVisible: false,
        uniqId: '',
        articleId: 0,
      }
    }
  },
  computed: {
    articleMap () {
      return this.$state.page.getArticleMap(this.nodeId)
    },
    page () {
      return this.nodeId > 0
             ? this.$state.page.getPage(this.nodeId)
             : undefined
    },
    scrollTo () {
      const page = this.$state.page.getPage(this.nodeId)

      return page.scrollTo
    },
    isPastable () {
      return this.$state.clipboard.hasAnArticle
    },
    isOutdated () {
      return typeof this.page === 'object' && this.page.isOutdated === true
    }
  },
  watch: {
    nodeId: {
      immediate: true,
      handler: function(newVal) {
        let nodeId = newVal
        const page = this.$state.page.getPage(nodeId)

        if (page === undefined && nodeId > 0) {
          this.$state.page.initArticlePage(this.spaceId, nodeId)
          this.$state.pageAction.pullArticlePage(this.spaceId, nodeId)
        }
        this.$state.page.refreshPageLastViewTimestamp(nodeId)
      }
    },
    scrollTo(newVal) {
      this.$nextTick(function(){
        const uniqId = newVal
        if (this.articleMap[uniqId] !== undefined ) {
          this.scrollToArticle(uniqId)
        }
      }.bind(this))
    }
  },
  mounted () {
    this.lastViewRefreshingInterval = setInterval(function () {
      this.$state.page.refreshPageLastViewTimestamp(this.nodeId)
    }.bind(this), 10000)
    this.outdateCheckingInterval = setInterval(function () {
      this.$state.pageAction.checkIfPageIsOutdated(this.spaceId, this.nodeId)
    }.bind(this), PAGE_VERSION_CHECKING_INTERVAL)
  },
  beforeDestroy() {
    clearInterval(this.lastViewRefreshingInterval)
    clearInterval(this.outdateCheckingInterval)
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
    showArticleHistoryVersions (uniqId) {
      this.historyDialog.uniqId = uniqId
      this.historyDialog.isVisible = true
    },
    addFreshArticle(type) {
      switch (type) {
        case ARTICLE_TYPE.MARKDOWN:
        case ARTICLE_TYPE.RICHTEXT:
        case ARTICLE_TYPE.MIND:
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
          break

        case ARTICLE_TYPE.ATTACHMENT:
          this.$state.page.appendArticle(this.nodeId, {
              spaceId:  this.spaceId,
              nodeId:   this.nodeId,
              id:       0,
              type:     this.articleType.ATTACHMENT,
              title:    this.$t('article.attachment.defaultTitle'),
              body:     JSON.stringify({
                items: []
              }),
              search:   '',
              isEditing: false
          })
          break
      }
    },
    getArticleElement(uniqId) {
      const ref = 'article-' + uniqId
      return this.$refs[ref][0].$el
    },
    scrollToArticle(uniqId) {
      const el = this.getArticleElement(uniqId)
      window.scrollTo({top: el.offsetTop - 40})
    },
    handleContextmenuEvent (event) {
      if (this.page.isReadOnly === true) {
        return
      }

      const articleList = this.$state.page.getArticleList(this.nodeId)
      let articleRectList = []
      let order = -1

      for (let i=0; i<articleList.length; i++) {
        const uniqId = articleList[i].uniqId
        const element = this.getArticleElement(uniqId)
        const rect = element.getBoundingClientRect()
        articleRectList.push(rect)

        if (event.clientY < rect.top) {
          if (i === 0) {
            order = 0
            break
          } else if (event.clientY > articleRectList[i-1].bottom) {
            order = i
            break
          }
        }
      }

      if (order === -1 && event.clientY > articleRectList[articleList.length - 1].bottom) {
        order = articleList.length
      }

      this.contextmenu.order = order
      if (this.contextmenu.order !== -1) {
        this.contextmenu.x = event.clientX
        this.contextmenu.y = event.clientY
        this.contextmenu.show = true
        event.preventDefault()
      } else {
        this.contextmenu.show = false
      }
    },
    doNothing () {
      return true
    },
    paste () {
      this.$state.clipboardAction.pasteArticleTo(this.nodeId, this.contextmenu.order)
    },
    refreshPage () {
      if (this.$state.page.hasUnsavedArticles(this.nodeId) === true) {
        this.$state.globalDialogs.showErrorDialog({
          message: this.$t('errors.unsavedArticles')
        })
      } else {
        this.$state.pageAction.pullArticlePage(this.spaceId, this.nodeId)
      }
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

.refresh-button {
  animation: glow 800ms ease-out infinite alternate;
}

.outdated-alert {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 999;
}
</style>
