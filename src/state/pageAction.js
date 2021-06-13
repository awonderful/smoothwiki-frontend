import Vue from 'vue'
import * as API from '@/common/API.js'
import { PAGE_STATUS } from '@/common/constants'
import { PageState } from './page.js'

export const PageAction = new Vue({
  methods: {
    async pullArticlePage(spaceId, nodeId) {
      const res = await API.getArticles({
        spaceId: spaceId,
        nodeId:  nodeId
      })

      PageState.clearAllArticles(nodeId)
      let articles = res.data.data.articles
      let isReadOnly = res.data.data.isReadOnly
      for (let article of articles) {
        article.isReadOnly = isReadOnly
        PageState.putArticle(nodeId, article)
      }
      PageState.setPageProps(nodeId, {
        status: PAGE_STATUS.SUCC_PULL,
        isReadOnly: isReadOnly,
        isOutdated: false
      })
      PageState.refreshNumbers(nodeId)
    },
    async removeArticle(spaceId, nodeId, uniqId) {
      const article = PageState.getArticle(nodeId, uniqId)

      if (article === null) {
        console.log("article doesn't exists")
        return
      }

      if (article.id === 0) {
        PageState.removeArticle(nodeId, uniqId)
        return
      }

      PageState.setArticleProps(nodeId, uniqId, {isRequesting: true})
      try {
        const res = await API.removeArticle({
          spaceId:        spaceId,
          nodeId:         nodeId,
          articleId:      article.id,
          articleVersion: article.version
        })
        PageState.removeArticle(nodeId, uniqId)
        PageState.refreshNumbers(nodeId)
      } finally {
        if (PageState.getArticle(nodeId, uniqId) !== undefined) {
          PageState.setArticleProps(nodeId, uniqId, {isRequesting: false})
        }
      }
    },
    async saveFreshArticle(spaceId, nodeId, uniqId) {
      const article = PageState.getArticle(nodeId, uniqId)

      let prevArticleId = 0
      if (article.order > 0) {
        const articleMap = PageState.getArticleMap(nodeId)
        let order = -1
        for (let tmpUniqId in articleMap) {
          const tmpArticle = articleMap[tmpUniqId]
          if (tmpArticle.id > 0 && tmpArticle.order < article.order && tmpArticle.order > order) {
            order = tmpArticle.order
            prevArticleId = tmpArticle.id
          }
        }
      }

      PageState.setArticleProps(nodeId, uniqId, {isRequesting: true})
      try {
        const res = await API.addArticle({
          spaceId:       spaceId,
          nodeId:        nodeId,
          type:          article.type,
          title:         article.editingTitle,
          body:          article.editingBody,
          search:        article.editingSearch,
          prevArticleId: prevArticleId,
          attachmentIds: article.attachmentIds.join(',')
        })
        PageState.setArticleProps(nodeId, uniqId, {
          id:        res.data.data.id,
          version:   res.data.data.version,
          title:     article.editingTitle,
          body:      article.editingBody,
          search:    article.editingSearch,
          isEditing: false
        })
      } finally {
        PageState.setArticleProps(nodeId, uniqId, {isRequesting: false})
      }
    },
    async saveUpdatedArticle(spaceId, nodeId, uniqId) {
      const article = PageState.getArticle(nodeId, uniqId)

      PageState.setArticleProps(nodeId, uniqId, {isRequesting: true})
      try {
        let res = await API.updateArticle({
          spaceId:        spaceId,
          nodeId:         nodeId,
          articleId:      article.id,
          articleVersion: article.version,
          title:          article.editingTitle,
          body:           article.editingBody,
          search:         article.editingSearch,
        })
        PageState.setArticleProps(nodeId, uniqId, {
          version:   res.data.data.version,
          title:     article.editingTitle,
          body:      article.editingBody,
          search:    article.editingSearch,
          isEditing: false
        })
      } finally {
        PageState.setArticleProps(nodeId, uniqId, {isRequesting: false})
      }
    },
    async saveArticle(spaceId, nodeId, uniqId) {
      const article = PageState.getArticle(nodeId, uniqId)

      if (article === null) {
        throw "article doesn't exist!"
      }

      if (article.id === 0) {
        await this.saveFreshArticle(spaceId, nodeId, uniqId)
      } else {
        await this.saveUpdatedArticle(spaceId, nodeId, uniqId)
      }
    },
    async moveArticle(spaceId, nodeId, uniqId, newOrder) {
      const article = PageState.getArticle(nodeId, uniqId)

      //move a fresh article
      if (article.id === 0) {
        PageState.moveArticle(nodeId, uniqId, newOrder)
        return
      } 

      //move an old article
      let prevArticleId = 0
      const oldOrder = article.order
      if (newOrder > 0) {
        const articleMap = PageState.getArticleMap(nodeId)
        let order = -1
        for (let tmpUniqId in articleMap) {
          const tmpArticle = articleMap[tmpUniqId]
          if (tmpArticle.uniqId !== uniqId && tmpArticle.id > 0 && tmpArticle.order <= newOrder && tmpArticle.order > order 
            && ( (newOrder > oldOrder && tmpArticle.order <= newOrder) || (newOrder < oldOrder && tmpArticle.order < newOrder) )) {
            order = tmpArticle.order
            prevArticleId = tmpArticle.id
          }
        }
      }
      const res = await API.moveArticle({
          spaceId:        spaceId,
          nodeId:         nodeId,
          articleId:      article.id,
          prevArticleId:  prevArticleId
      })
      PageState.moveArticle(nodeId, uniqId, newOrder)
    },
    async addAttachmentToArticle(spaceId, nodeId, uniqId, file) {
      const article = PageState.getArticle(nodeId, uniqId)

      let form = new FormData()
      form.append('spaceId',   spaceId)
      form.append('nodeId',    nodeId)
      form.append('articleId', article.id)
      form.append('file',      file)

      const res = await API.uploadAttachment(form)
      article.attachmentIds.push(res.data.data.id)

      return res
    },
    async refreshArticle(spaceId, nodeId, uniqId) {
      const article = PageState.getArticle(nodeId, uniqId)

      if (article.id > 0 && !article.isEditing) {
        const res = await API.getArticle({
          spaceId:   spaceId, 
          nodeId:    nodeId,
          articleId: article.id
        })
        let refreshedArticle = res.data.data.article
        refreshedArticle.uniqId = uniqId
        refreshedArticle.order = article.order
        refreshedArticle.number = article.number
        PageState.putArticle(nodeId, refreshedArticle)
      }
    },
    async setArticleLevel(spaceId, nodeId, uniqId, level) {
      const article = PageState.getArticle(nodeId, uniqId)
      const oldLevel = article.level

      PageState.setArticleProps(nodeId, uniqId, {level: level})
      try {
        await API.setArticleLevel({
          spaceId: spaceId, 
          nodeId: nodeId, 
          articleId: article.id, 
          level: level})
      } catch (err) {
        PageState.setArticleProps(nodeId, uniqId, {level: oldLevel})
        throw err
      }
    },
    async checkIfPageIsOutdated(spaceId, nodeId) {
      let oldVersion = ''
      const oldArticleList = PageState.getArticleList(nodeId)
      if (oldArticleList === undefined) {
        return
      }

      oldArticleList.forEach(function (article) {
        if (article.id > 0) {
          oldVersion = oldVersion + article.version
        }
      })

      let newVersion = ''
      const res = await API.getArticlesVersions({
        spaceId: spaceId,
        nodeId: nodeId
      })
      res.data.data.versions.forEach(function(item) {
        newVersion = newVersion + item.version
      })

      console.log('------------------------')
      console.log(oldArticleList)
      console.log(res.data.data.versions)
      console.log(oldVersion)
      console.log(newVersion)

      PageState.setPageProps(nodeId, {
        isOutdated: newVersion !== oldVersion
      })
    }
  }
})