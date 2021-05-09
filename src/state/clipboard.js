import Vue from 'vue'
import { CLIPBOARD_STATUS } from '@/common/constants.js'

export const ClipboardState = new Vue({
  data: function () {
    return {
      status: CLIPBOARD_STATUS.NONE,
      src: {
        nodeId: 0,
        uniqIds: []
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
    },
    copyArticles (nodeId, uniqIds) {
      this.status = CLIPBOARD_STATUS.COPY_ARTICLES,
      this.src.nodeId = nodeId
      this.src.uniqIds.splice(0, this.src.uniqIds.length, ...uniqIds)
    },
    cutArticles (nodeId, uniqIds) {
      this.status = CLIPBOARD_STATUS.CUT_ARTICLES,
      this.src.nodeId = nodeId
      this.src.uniqIds.splice(0, this.src.uniqIds.length, ...uniqIds)
    }
  }
})