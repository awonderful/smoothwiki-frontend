import Vue from 'vue'
import { generateUniqId } from '@/common/util.js'
import { PAGE_STATUS } from '../common/constants'


export const PageState = new Vue({
  data: {
    pageMap: {}
  },
  methods: {

    //---page----
    getPage(nodeId) {
      return this.pageMap[nodeId]
    },
    setPageProps (nodeId, props) {
      const page = this.getPage(nodeId)

      for (const key in props) {
        Vue.set(page, key, Vue.observable(props[key]))
      }
    },
    ensurePage(nodeId) {
      if (this.pageMap[nodeId] === undefined) {
        Vue.set(this.pageMap, nodeId, {})
        this.setPageProps(nodeId, {
          status: PAGE_STATUS.INITED,
          scrollTo: 0
        })
      }
    },


    //---article-page---------------    
    ensureArticlePage(nodeId) {
      this.ensurePage(nodeId)
      const page = this.getPage(nodeId)

      if (page.articleMap === undefined) {
        this.setPageProps(nodeId, {articleMap: {}})
      }
    },
    getArticleMap(nodeId) {
      const page = this.getPage(nodeId)

      return page.articleMap
    },
    getArticle(nodeId, uniqId) {
      const articleMap = this.getArticleMap(nodeId)
      return articleMap[uniqId]
    },
    setArticleProps (nodeId, uniqId, props) {
      let article = this.getArticle(nodeId, uniqId)

      Object.assign(article, props)
    },
    putArticle(nodeId, article) {
      const page = this.getPage(nodeId)
      const articleMap = this.getArticleMap(nodeId)

      const defaultArticleProp = {
        editingTitle:  article.title,
        editingBody:   article.body,
        editingSearch: article.search,
        isEditing:     false,
        isRequesting:  false,
        isFullScreen:  false,
        isReadOnly:    false,
        attachments:   []
      }
      for (let key in defaultArticleProp) {
        if (article[key] === undefined) {
          article[key] = defaultArticleProp[key]
        }
      }

      if (article.uniqId === undefined) {
        article.uniqId = generateUniqId()
      }

      if (article.order === undefined) {
        article.order = Object.keys(articleMap).length
      }

      Vue.set(articleMap, article.uniqId, article)
    },
    insertArticle(nodeId, order, article) {
      const articleMap = this.getArticleMap(nodeId)

      for (const tmpArticle of articleMap) {
        if (tmpArticle.order >= order) {
          this.setArticleProps(nodeId, uniqId, {
            order: tmpArticle.order + 1
          })
        }
      }

      article.order = order
      this.putArticle(nodeId, article)
    },
    appendArticle(nodeId, article) {
      const articleMap = this.getArticleMap(nodeId)
      article.order = Object.keys(articleMap).length

      this.putArticle(nodeId, article)
    },
    removeArticle(nodeId, uniqId) {
      const articleMap = this.getArticleMap(nodeId)

      Vue.delete(articleMap, uniqId)
    },
    moveArticle(nodeId, uniqId, newOrder) {
      const articleMap = this.getArticleMap(nodeId)
      const article = this.getArticle(nodeId, uniqId)
      const oldOrder = article.order

      if (oldOrder === newOrder) {
        return
      }

      if (newOrder > oldOrder) {
        for (let uniqId in articleMap) {
          const tmpArticle = articleMap[uniqId]
          if (tmpArticle.order > oldOrder && tmpArticle.order <= newOrder) {
            this.setArticleProps(nodeId, uniqId, {order: tmpArticle.order - 1})
          }
        }
      } else {
         for (let uniqId in articleMap) {
          const tmpArticle = articleMap[uniqId]
          if (tmpArticle.order >= newOrder && tmpArticle.order < oldOrder) {
            this.setArticleProps(nodeId, uniqId, {order: tmpArticle.order + 1})
          }
        }
      }
      this.setArticleProps(nodeId, uniqId, {order: newOrder})
    },
    scrollToArticle(nodeId, uniqId) {
      this.setPageProps(nodeId, {
        scrollTo: uniqId
      })
    }
  }
})