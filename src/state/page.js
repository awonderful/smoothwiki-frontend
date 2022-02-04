import Vue from 'vue'
import { generateUniqId } from '@/common/util.js'
import { PAGE_STATUS, PAGE_TYPE } from '../common/constants'


export const PageState = new Vue({
  data: {
    pageMap: {},
  },
  methods: {

    //---page----
    getPageMap() {
      return this.pageMap
    },
    getPage(nodeId) {
      return this.pageMap[nodeId]
    },
    setPageProps (nodeId, props) {
      const page = this.getPage(nodeId)

      for (const key in props) {
        this.$set(page, key, Vue.observable(props[key]))
      }
    },
    initPage(spaceId, nodeId) {
      if (this.pageMap[nodeId] === undefined) {
        this.$set(this.pageMap, nodeId, {})
        this.setPageProps(nodeId, {
          spaceId: spaceId,
          status: PAGE_STATUS.INITED,
          scrollTo: 0,
          isReadOnly: true,
          isOutdated: false,
          lastViewTimestamp: 0
        })
      }
    },
    refreshPageLastViewTimestamp(nodeId) {
      this.setPageProps(nodeId, {
        lastViewTimestamp: Date.now()
      })
    },

    //---article-page---------------    
    initArticlePage(spaceId, nodeId) {
      this.initPage(spaceId, nodeId)
      const page = this.getPage(nodeId)

      if (page.articleMap === undefined) {
        this.setPageProps(nodeId, {
          type: PAGE_TYPE.ARTICLE_PAGE,
          articleMap: {}
        })
      }
    },
    getArticleMap(nodeId) {
      const page = this.getPage(nodeId)

      return page === undefined
             ? undefined
             : page.articleMap
    },
    getArticleList(nodeId) {
      const articleMap = this.getArticleMap(nodeId)
      let articleList = Object.values(articleMap)

      articleList.sort(function (a, b) {
        return a.order - b.order
      })

      return articleList
    },
    getArticle(nodeId, uniqId) {
      const articleMap = this.getArticleMap(nodeId)

      if (!articleMap.hasOwnProperty(uniqId)) {
        console.log(`article doesn't exist! (nodeId=${nodeId}, uniqId=${uniqId})`)
      }

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
        number:          '',
        level:           0,
        editingTitle:    article.title,
        editingBody:     article.body,
        editingSearch:   article.search,
        isEditing:       false,
        isRequesting:    false,
        isReadOnly:      false,
        isUploading:     false,
        attachmentIds:   [],
        historyVersions: [],
        trash:           {
          pulled: false,
          timestamp: 0,
          articles: [],
        },
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

      this.$set(articleMap, article.uniqId, article)
    },
    insertArticle(nodeId, order, article) {
      const articleMap = this.getArticleMap(nodeId)

      for (const tmpUniqId in articleMap) {
        let tmpArticle = articleMap[tmpUniqId]
        if (tmpArticle.order >= order) {
          this.setArticleProps(nodeId, tmpUniqId, {
            order: tmpArticle.order + 1
          })
        }
      }

      article.order = order
      this.putArticle(nodeId, article)
      this.refreshNumbers(nodeId)
    },
    appendArticle(nodeId, article) {
      const articleMap = this.getArticleMap(nodeId)
      article.order = Object.keys(articleMap).length

      this.putArticle(nodeId, article)
      this.refreshNumbers(nodeId)
    },
    removeArticle(nodeId, uniqId) {
      const articleMap = this.getArticleMap(nodeId)

      Vue.delete(articleMap, uniqId)
      this.refreshNumbers(nodeId)
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
      this.refreshNumbers(nodeId)
    },
    refreshNumbers(nodeId) {
      const articleMap = this.getArticleMap(nodeId)

      let articleList = []
      for (const uniqId in articleMap) {
        articleList.push(articleMap[uniqId])
      }
      
      const sortedArticleList = articleList.sort(function (article1, article2) {
        return article1.order - article2.order
      })

      for (let i=0; i<sortedArticleList.length; i++) {
        const article = sortedArticleList[i]
        this.setArticleProps(nodeId, article.uniqId, {
          number: i + 1
        })
      }
    },
    scrollToArticle(nodeId, uniqId) {
      this.setPageProps(nodeId, {
        scrollTo: uniqId
      })
    },
    hasUnsavedArticles(nodeId) {
      const page = this.getPage(nodeId)
      if (page.isReadOnly === true) {
        return false
      }

      const articleMap = this.getArticleMap(nodeId)
      for (let uniqId in articleMap) {
        const article = articleMap[uniqId]
        if (article.isEditing === true || article.isUploading === true) {
          return true
        }
      }

      return false
    },
    clearAllArticles(nodeId) {
      const articleMap = this.getArticleMap(nodeId)
      for(const uniqId in articleMap) {
        delete articleMap[uniqId]
      }
    },
    clear() {
      this.pageMap = {}
    }
  }
})