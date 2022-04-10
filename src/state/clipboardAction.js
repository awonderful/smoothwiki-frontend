import Vue from 'vue'
import * as API from '@/common/API.js'
import { CLIPBOARD_STATUS } from '@/common/constants.js'
import { generateUniqId } from '@/common/util.js'
import { ClipboardState } from './clipboard.js'
import { PageState } from './page.js'
import { PageAction } from './pageAction.js'

export const ClipboardAction = new Vue({
  methods: {
    async pasteArticlesTo (nodeId, order) {

      if (ClipboardState.status === CLIPBOARD_STATUS.COPY_ARTICLES) {
          const page = PageState.getPage(nodeId)
          if (page.isReadOnly === true) {
            return
          }

          for (let i=0; i<ClipboardState.src.articles.length; i++) {
            const oldArticle = ClipboardState.src.articles[i]

            let newArticle = {
              spaceId:       page.spaceId,
              nodeId:        nodeId,
              uniqId:        generateUniqId(),
              id:            0,
              level:         oldArticle.level,
              type:          oldArticle.type,
              title:         oldArticle.title,
              body:          oldArticle.body,
              search:        oldArticle.search,
              editingTitle:  oldArticle.editingTitle,
              editingBody:   oldArticle.editingBody,
              editingSearch: oldArticle.editingSearch,
              order:         order,
              isReadOnly:    false,
              isEditing:     true,
            }

            PageState.insertArticle(nodeId, order + i, newArticle)
            if (oldArticle.id !== 0 && oldArticle.isEditing === false) {
              await PageAction.saveArticle(page.spaceId, nodeId, newArticle.uniqId)
            }
          }
          ClipboardState.clear()

      } else if (ClipboardState.status === CLIPBOARD_STATUS.CUT_ARTICLES) {
          const page = PageState.getPage(nodeId)
          if (page.isReadOnly === true) {
            return
          }

          let prevArticleId = 0
          const articleList = PageState.getArticleList(nodeId)
          for (let i=articleList.length-1; i>=0; i--) {
            const article = articleList[i]
            if (article.order < order && article.id > 0) {
              prevArticleId = article.id
              break
            }
          }

          for (let i=0; i<ClipboardState.src.articles.length; i++) {
            const article = ClipboardState.src.articles[i]

            if (article.id > 0) {
              await API.transferArticle({
                spaceId: article.spaceId,
                nodeId: article.nodeId,
                articleId: article.id,
                toNodeId: nodeId,
                toPrevArticleId: prevArticleId
              })
              prevArticleId = article.id

              const articleMap = PageState.getArticleMap(article.nodeId)
              if (articleMap !== undefined && articleMap !== null) {
                for (const tUniqId in articleMap) {
                  if (articleMap[tUniqId].id === article.id) {
                    PageState.removeArticle(article.nodeId, tUniqId)
                  }
                }
              }
            }

            article.uniqId = generateUniqId()
            article.nodeId = nodeId
            article.order = order + i
            PageState.insertArticle(nodeId, order + i, article)
          }
          ClipboardState.clear()
      }

    }
  }
})