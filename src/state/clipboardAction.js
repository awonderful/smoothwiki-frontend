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

          for (let i=0; i<ClipboardState.src.uniqIds.length; i++) {
            const uniqId = ClipboardState.src.uniqIds[i]
            const oldArticle = PageState.getArticle(ClipboardState.src.nodeId, uniqId)

            let newArticle = {
              spaceId:       oldArticle.spaceId,
              nodeId:        nodeId,
              uniqId:        generateUniqId(),
              id:            0,
              type:          oldArticle.type,
              title:         oldArticle.title,
              body:          oldArticle.body,
              search:        oldArticle.search,
              editingTitle:  oldArticle.editingTitle,
              editingBody:   oldArticle.editingBody,
              editingSearch: oldArticle.editingSearch,
              order:         order,
              isReadOnly:    false,
              isEditing:     true
            }

            PageState.insertArticle(nodeId, order + i, newArticle)
            if (oldArticle.id !== 0) {
              await PageAction.saveArticle(oldArticle.spaceId, nodeId, newArticle.uniqId)
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
            }
          }

          for (let i=0; i<ClipboardState.src.uniqIds.length; i++) {
            const uniqId = ClipboardState.src.uniqIds[i]
            await API.moveArticle()

            const oldArticle = PageState.getArticle(ClipboardState.src.nodeId, uniqId)

            let newArticle = {
              spaceId:       oldArticle.spaceId,
              nodeId:        nodeId,
              uniqId:        generateUniqId(),
              id:            0,
              type:          oldArticle.type,
              title:         oldArticle.title,
              body:          oldArticle.body,
              search:        oldArticle.search,
              editingTitle:  oldArticle.editingTitle,
              editingBody:   oldArticle.editingBody,
              editingSearch: oldArticle.editingSearch,
              order:         order,
              isReadOnly:    false,
              isEditing:     true
            }

            PageState.insertArticle(nodeId, order + i, newArticle)
            if (oldArticle.id !== 0) {
              await PageAction.saveArticle(oldArticle.spaceId, nodeId, newArticle.uniqId)
            }

          }
          ClipboardState.clear()
      }

    }
  }
})