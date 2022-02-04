import Vue from 'vue'
import { CLIPBOARD_STATUS } from '@/common/constants.js'
import { PageState } from './page.js'
import { LocalStorage } from './localStorage.js'
import { Notify } from './notify.js'

export const ClipboardState = new Vue({
  data: function () {
    return {
      instanceId: Date.now(),
      status: CLIPBOARD_STATUS.NONE,
      src: {
        nodeId: 0,
        uniqIds: [],
        articles: []
      }
    }
  },
  computed: {
    hasAnArticle() {
      const statuses = [
        CLIPBOARD_STATUS.COPY_ARTICLES,
        CLIPBOARD_STATUS.CUT_ARTICLES,
        CLIPBOARD_STATUS.MIRROR_ARTICLES,
      ]

      return statuses.includes(this.status)
    }
  },
  methods: {
    clear () {
      this.status = CLIPBOARD_STATUS.NONE
      this.src.nodeId = 0
      this.src.uniqIds.splice(0, this.src.uniqIds.length)
      this.src.articles.splice(0, this.src.uniqIds.length)
      this.sendExternalNotification()
    },
    sendExternalNotification() {
      Notify.sendExternalNotification('CLIPBOARD_STATUS_CHANGE', {
        status: this.status,
        src: this.src
      })
    },
    copyArticles (nodeId, uniqIds) {
      const clonedUniqIds = [...uniqIds]
      const articleMap = PageState.getArticleMap(nodeId)
      clonedUniqIds.sort(function(uniqId1, uniqId2) {
        return articleMap[uniqId1].order - articleMap[uniqId2].order
      })

      let articles = []
      for (const uniqId of clonedUniqIds) {
        articles.push(articleMap[uniqId])
      }

      this.status = CLIPBOARD_STATUS.COPY_ARTICLES,
      this.src.nodeId = nodeId
      this.src.uniqIds.splice(0, this.src.uniqIds.length, ...clonedUniqIds)
      this.src.articles.splice(0, this.src.articles.length, ...articles)

      this.sendExternalNotification()
    },
    copyArticle (nodeId, uniqId) {
      this.copyArticles(nodeId, [uniqId])
    },
    copyHistoryArticle (nodeId, uniqId, version) {
      const article = PageState.getArticle(nodeId, uniqId)
      const versions = article.historyVersions || []
      let historyArticle = null

      for (const temp of versions) {
        if (temp.version === version) {
          historyArticle = Object.assign({}, temp, {
            spaceId:        article.spaceId,
            nodeId:         article.nodeId,
            uniqId:         article.uniqId,
            id:             article.id,
            level:          article.level,
            type:           article.type,
            editingTitle:   temp.title,
            editingBody:    temp.body,
            editingSearch:  temp.search,
            isEditing:      false,
            isUploading:    false,
            isRequesting:   false
          })
        }
      }

      if (historyArticle !== null) {
        this.status = CLIPBOARD_STATUS.COPY_ARTICLES,
        this.src.nodeId = nodeId
        this.src.uniqIds.splice(0, this.src.uniqIds.length, uniqId)
        this.src.articles.splice(0, this.src.articles.length, historyArticle)

        this.sendExternalNotification()
      }
    },
    copyTrashArticle (nodeId, articleId) {
      const page = PageState.getPage(nodeId)
      const trashArticles = page.trash && page.trash.articles
                            ? page.trash.articles
                            : []
      let article = null

      for (const temp of trashArticles) {
        if (temp.id === articleId) {
          article = Object.assign({}, temp, {
            editingTitle:   temp.title,
            editingBody:    temp.body,
            editingSearch:  temp.search,
            isEditing:      false,
            isUploading:    false,
            isRequesting:   false
          })
        }
      }

      if (article !== null) {
        this.status = CLIPBOARD_STATUS.COPY_ARTICLES,
        this.src.nodeId = nodeId
        this.src.uniqIds.splice(0, this.src.uniqIds.length)
        this.src.articles.splice(0, this.src.articles.length, article)
        this.sendExternalNotification()
      }
    },
    cutArticles (nodeId, uniqIds) {
      const clonedUniqIds = [...uniqIds]
      const articleMap = PageState.getArticleMap(nodeId)
      clonedUniqIds.sort(function(uniqId1, uniqId2) {
        return articleMap[uniqId1].order - articleMap[uniqId2].order
      })

      let articles = []
      for (const uniqId of clonedUniqIds) {
        articles.push(articleMap[uniqId])
      }

      this.status = CLIPBOARD_STATUS.CUT_ARTICLES,
      this.src.nodeId = nodeId
      this.src.uniqIds.splice(0, this.src.uniqIds.length, ...clonedUniqIds)
      this.src.articles.splice(0, this.src.articles.length, ...articles)

      this.sendExternalNotification()
    }
  },
  created() {
    Notify.$on('EXTERNAL_CLIPBOARD_STATUS_CHANGE', function (event) {
      if (Date.now() - event.timestamp < 10 * 60 * 1000) {
        this.status = event.data.status
        this.src.nodeId = event.data.src.nodeId
        this.src.uniqIds.splice(0, this.src.uniqIds.length, ...event.data.src.uniqIds)
        this.src.articles.splice(0, this.src.articles.length, ...event.data.src.articles)
      }
    }.bind(this))
  }
})