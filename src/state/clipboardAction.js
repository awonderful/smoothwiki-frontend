import Vue from 'vue'
import * as API from '@/common/API.js'
import { CLIPBOARD_STATUS } from '@/common/constants.js'
import { generateUniqId } from '@/common/util.js'
import { ClipboardState } from './clipboard.js'
import { PageState } from './page.js'
import { PageAction } from './pageAction.js'

export const ClipboardAction = new Vue({
  methods: {
    async pasteArticleTo (nodeId, order) {

      if (ClipboardState.status === CLIPBOARD_STATUS.COPY_ARTICLE) {
          const page = PageState.getPage(nodeId)
          if (page.isReadOnly === true) {
            return
          }

          const oldArticle = PageState.getArticle(ClipboardState.src.nodeId, ClipboardState.src.uniqId)

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

          PageState.insertArticle(nodeId, order, newArticle)
          await PageAction.saveArticle(newArticle.spaceId, nodeId, newArticle.uniqId)
          ClipboardState.clear()

      } else if (ClipboardState.status === CLIPBOARD_STATUS.CUT_ARTICLE) {
          const page = PageState.getPage(nodeId)
          if (page.isReadOnly === true) {
            return
          }

          const oldArticle = PageState.getArticle(ClipboardState.src.nodeId, ClipboardState.src.uniqId)

          let newArticle = Object.assign({}, oldArticle)
          newArticle.articleId = 0
          newArticle.uniqId = generateUniqId()
          newArticle.order = order
          newArticle.isReadOnly = false
          newArticle.isEditing = true
          PageState.insertArticle(nodeId, order, article)
          await PageAction.saveArticle(newArticle.spaceId, nodeId, newArticle.uniqId)

      }

    }
  }
})