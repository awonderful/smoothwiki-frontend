import Vue from 'vue'
import { CLIPBOARD_STATUS } from '@/common/constants.js'

export const ClipboardState = new Vue({
  data: function () {
    return {
      status: CLIPBOARD_STATUS.NONE,
      src: {
        nodeId: 0,
        uniqId: 0
      }
    }
  },
  computed: {
    hasAnArticle() {
      const statuses = [
        CLIPBOARD_STATUS.COPY_ARTICLE,
        CLIPBOARD_STATUS.CUT_ARTICLE,
        CLIPBOARD_STATUS.COPY_ARTICLE_MIRROR,
      ]

      return statuses.includes(this.status)
    }
  },
  methods: {
    clear () {
      this.status = CLIPBOARD_STATUS.NONE
    },
    copyArticle (nodeId, uniqId) {
      this.status = CLIPBOARD_STATUS.COPY_ARTICLE,
      this.src.nodeId = nodeId
      this.src.uniqId = uniqId
    },
    cutArticle (nodeId, uniqId) {
      this.status = CLIPBOARD_STATUS.CUT_ARTICLE,
      this.src.nodeId = nodeId
      this.src.uniqId = uniqId
    }
  }
})