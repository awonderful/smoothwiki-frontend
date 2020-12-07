import Vue from 'vue'
import Vuex from 'vuex'
import * as API from '@/common/API.js'
import { generateUniqId } from '@/common/util.js'
import { PAGE_STATUS } from '../common/constants'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageMap: {},
    articleMap: {}
  },
  getters: {
    getPage(state) {
      return function (nodeId) {
        return state['pageMap'][nodeId]
      }
    },
    getArticle(state) {
      return function (uniqId) {
        return state.articleMap[uniqId]
      }
    },
    getArticles(state) {
      return function (nodeId) {
        if (state['pageMap'][nodeId] === undefined) {
          return []
        }
        return state['pageMap'][nodeId]['articles'].map(function (uniqId) {
          return state['articleMap'][uniqId]
        })
      }
    }
  },
  mutations: {
    ENSURE_ARTICLE_PAGE(state, payload) {
      const nodeId  = payload.nodeId

      if (state.pageMap[nodeId] === undefined) {
        Vue.set(state.pageMap, nodeId, {
          status: PAGE_STATUS.INITED,
          articles: []
        })
      }
    },
    INSERT_ARTICLE(state, payload) {
      const nodeId = payload.nodeId
      const uniqId = payload.uniqId
      const idx    = payload.idx

      state['pageMap'][nodeId]['articles'].splice(idx, 0, uniqId)
    },
    APPEND_ARTICLE(state, payload) {
      const nodeId = payload.nodeId
      const uniqId = payload.uniqId

      state['pageMap'][nodeId]['articles'].push(uniqId)
    },
    REMOVE_ARTICLE(state, payload) {
      const nodeId  = payload.nodeId
      const uniqId  = payload.uniqId
      const articles = state['pageMap'][nodeId]['articles']
      
      for (let i=0; i<articles.length; i++) {
        if (articles[i] === uniqId) {
          articles.splice(i, 1)
          break
        }
      }
    },
    PUT_ARTICLE(state, payload) {
      let article = payload.article

      const defaultArticleProp = {
        editingTitle:  article.title,
        editingBody:   article.body,
        editingSearch: article.search,
        isEditing:     false,
        isRequesting:  false,
        isFullScreen:  false,
        isReadOnly:    false,
      }
      for (let key in defaultArticleProp) {
        if (article[key] === undefined) {
          article[key] = defaultArticleProp[key]
        }
      }

      Vue.set(state.articleMap, article.uniqId, article)
    },
    SET_ARTICLE_PROPS(state, payload) {
      const uniqId  = payload.uniqId
      const props   = payload.props

      if (state['articleMap'][uniqId] === undefined) {
        Vue.set(state['articleMap'], uniqId, props)
      } else {
        Object.assign(state['articleMap'][uniqId], props)
      }
    },
    SET_PAGE_PROPS(state, payload) {
      const nodeId  = payload.nodeId
      const props   = payload.props

      Object.assign(state['pageMap'][nodeId], props)
    }
  },
  actions: {
    ensureArticlePage({commit}, params) {
      commit('ENSURE_ARTICLE_PAGE', params)
    },
    pullArticlePage({commit}, params) {
      const spaceId = params.spaceId
      const nodeId  = params.nodeId

      API.getArticles({
        spaceId: spaceId,
        nodeId:  nodeId
      }).then((res) => {
        let articles = res.data.data.articles
        for (let article of articles) {
          const uniqId = generateUniqId()
          article.uniqId = uniqId
          commit('PUT_ARTICLE', {article: article})
          commit('APPEND_ARTICLE', {
            nodeId: nodeId,
            uniqId: uniqId
          })
        }
        commit('SET_PAGE_PROPS', {
          spaceId: spaceId,
          nodeId:  nodeId,
          props:  {
            spaceId: spaceId,
            status: PAGE_STATUS.SUCC_PULL
          }
        })
      })
    },
    removeArticle({commit, getters}, params) {
      const spaceId = params.spaceId
      const nodeId  = params.nodeId
      const uniqId  = params.uniqId
      const article = getters.getArticle(uniqId)

      if (article === null) {
        console.log('article not exists')
        return
      }

      if (article.articleId === 0) {
        commit('REMOVE_ARTICLE', {
          nodeId: nodeId,
          uniqId: uniqId
        })
        return
      }

      commit('SET_ARTICLE_PROPS', {
        uniqId:  uniqId,
        props:   {
          isRequesting: true
        }
      })
      API.removeArticle({
        spaceId:        spaceId,
        nodeId:         nodeId,
        articleId:      article.id,
        articleVersion: article.version
      }).then(function() {
        commit('REMOVE_ARTICLE', {
          nodeId: nodeId,
          uniqId: uniqId
        })
      }).catch(function(error) {
        commit('SET_ARTICLE_PROPS', {
          uniqId:  uniqId,
          props:   {
            isRequesting: false
          }
        })
        throw error
      })
    },
    saveArticle({commit, getters}, params) {
      const spaceId = params.spaceId
      const nodeId  = params.nodeId
      const uniqId  = params.uniqId
      const article = getters.getArticle(uniqId)
      const page    = getters.getPage(nodeId)

      if (article === null) {
        throw 'article not exist!'
      }

      if (article.id === 0) {
        //add a new article

        let prevArticleId = 0
        for (let i in page.articles) {
          if (page.articles[i] === uniqId) {
            if (i > 0) {
              const prevArticle = getters.getArticle(page.articles[i - 1])
              prevArticleId = prevArticle.id
            }
            break
          }
        }

        commit('SET_ARTICLE_PROPS', {
          uniqId:  uniqId,
          props:   {
            isRequesting: true
          }
        })
        API.addArticle({
          spaceId:       spaceId,
          nodeId:        nodeId,
          type:          article.type,
          title:         article.editingTitle,
          body:          article.editingBody,
          search:        article.editingSearch,
          prevArticleId: prevArticleId
        }).then(function(res) {
          commit('SET_ARTICLE_PROPS', {
            uniqId:  uniqId,
            props:   {
              id:        res.data.data.id,
              version:   res.data.data.version,
              title:     article.editingTitle,
              body:      article.editingBody,
              search:    article.editingSearch,
              isEditing: false
            }
          })
        }).catch(function (error) {
          throw error
        }).finally(function() {
          commit('SET_ARTICLE_PROPS', {
            uniqId:  uniqId,
            props:   {
              isRequesting: false
            }
          })
        })

      } else {
        //update an article

        commit('SET_ARTICLE_PROPS', {
          uniqId:  uniqId,
          props:   {
            isRequesting: true
          }
        })
        API.updateArticle({
          spaceId:        spaceId,
          nodeId:         nodeId,
          articleId:      article.id,
          articleVersion: article.version,
          title:          article.editingTitle,
          body:           article.editingBody,
          search:         article.editingSearch,
        }).then(function(res) {
          commit('SET_ARTICLE_PROPS', {
            uniqId:  uniqId,
            props:   {
              version:   res.data.data.version,
              title:     article.editingTitle,
              body:      article.editingBody,
              search:    article.editingSearch,
              isEditing: false
            }
          })
        }).catch(function (error) {
          throw error
        }).finally(function() {
          commit('SET_ARTICLE_PROPS', {
            uniqId:  uniqId,
            props:   {
              isRequesting: false
            }
          })
        })
      }
    },
  },
  modules: {
  }
})
