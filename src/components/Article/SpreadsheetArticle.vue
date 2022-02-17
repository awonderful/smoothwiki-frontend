<template>
  <div class="spreadsheet-article">
    <article-window
      :isReadOnly   = "article.isReadOnly"
      :isEditing    = "article.isEditing"
      :isFreshNew   = "isFreshNew"
      :isFullScreen = "isFullScreen"
      :title.sync   = "article.editingTitle"
      :buttons      = "buttons"
      :menuItems    = "menuItems"
      @clickButton  = "clickButton"
      @clickMenu    = "clickMenu"
      ref           = "window">
      <template v-slot:editor>
        <div
          :id="editor.id"
          :class="[
            'editor',
            {'hide-horizontal-scrollbar': editor.hideHorizontalScrollbar},
            {'hide-vertical-scrollbar': editor.hideVerticalScrollbar},
            {'hide-toolbar': editor.hideToolbar},
            {'hide-bottombar': editor.hideBottombar}
          ]"
          ref="editor"
        />
      </template>
      <template v-slot:view>
        <div
          :id="viewer.id"
          :class="[
            'viewer',
            {'hide-horizontal-scrollbar': viewer.hideHorizontalScrollbar},
            {'hide-vertical-scrollbar': viewer.hideVerticalScrollbar},
            {'hide-toolbar': viewer.hideToolbar},
            {'hide-bottombar': viewer.hideBottombar}
          ]"
          ref="viewer"
        />
      </template>
    </article-window>
  </div>
</template>

<script>
import BaseArticle from './BaseArticle.vue'
import ArticleWindow from './ArticleWindow.vue'
import Spreadsheet from 'x-data-spreadsheet'
import { isNumeric } from '@/common/util.js'
import zh_cn from 'x-data-spreadsheet/dist/locale/zh-cn.js'
import en from 'x-data-spreadsheet/dist/locale/en.js'

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
  },
  computed: {
    isEditing () {
      return this.article.isEditing
    },
    data () {
      return JSON.parse(this.article.editingBody)
    },
    locale () {
      return this.$i18n.locale
    },
  },
  data: function () {
    return {
      toolbarHeight: 48,
      bottombarHeight: 39,
      defaultRowHeight: 25,
      defaultColWidth: 100,
      headerHeight: 25,
      lineNumberColWidth: 100,

      viewer: {
        id: `viewer_${this.article.uniqId}`,
        instance: null,
        width: 0,
        height: 0,
        minHeight: 200,
        hideToolbar: true,
        hideBottombar: true,
        hideHorizontalScrollbar: false,
        hideVerticalScrollbar: false,
      },

      editor: {
        id: `editor_${this.article.uniqId}`,
        instance: null,
        width: 0,
        height: 0,
        minHeight: 200,
        hideToolbar: false,
        hideBottombar: true,
        hideHorizontalScrollbar: false,
        hideVerticalScrollbar: false,
      }
    }
  },
  watch: {
    article (newVal) {
      if (JSON.stringify(this.data) !== newVal.editingBody) {
        this.data = JSON.parse(newVal.editingBody)
        if (this.article.isEditing) {
          this.editor.instance.loadData(this.data)
        } else {
          this.viewer.instance.loadData(this.data)
        }
      }
    },
    isEditing: {
      immediate: true,
      handler: function () {
       this.$nextTick(() => {
         this.reload()
       })
      }
    },
    isFullScreen () {
      this.$nextTick(() => {
        this.reload()
      })
    }
  },
  methods: {
    getEditingBody() {
      return JSON.stringify(this.editor.instance.getData())
    },
    getEditingSearch() {
      const words = []

      const data = this.editor.instance.getData()
      if (data[0] && data[0].rows) {
        const sheet = data[0]
        for (const rkey in sheet.rows) {
          if (isNumeric(rkey) && sheet.rows[rkey]['cells']) {
            for (const ckey in sheet.rows[rkey]['cells']) {
              if (isNumeric(ckey) && sheet.rows[rkey]['cells'][ckey] && sheet.rows[rkey]['cells'][ckey]['text']) {
                words.push(sheet.rows[rkey]['cells'][ckey]['text'])
              }
            }
          }
        }
      }

      return words.join(' ')
    },
    getMaxRowIdx () {
      if (!Array.isArray(this.data) || !this.data[0]) {
        return -1
      }

      let maxRowIdx = -1
      const sheet = this.data[0]
      if (sheet.rows) {
        for (const key in sheet.rows) {
          if (isNumeric(key)) {
            if (parseInt(key) > maxRowIdx) {
              maxRowIdx = parseInt(key)
            }
          }
        }
      }

      return maxRowIdx
    },
    getMaxColIdx () {
      if (!Array.isArray(this.data) || !this.data[0]) {
        return -1
      }

      let maxColIdx = -1
      const sheet = this.data[0]
      if (sheet.cols) {
        for (const key in sheet.cols) {
          if (isNumeric(key)) {
            if (parseInt(key) > maxColIdx) {
              maxColIdx = parseInt(key)
            }
          }
        }
      }
      if (sheet.rows) {
        for (const rkey in sheet.rows) {
          if (!isNumeric(rkey) || !sheet.rows[rkey]['cells']) {
            continue
          }
          for (const ckey in sheet.rows[rkey]['cells']) {
            if (!isNumeric(ckey)) {
              continue
            }
            if (parseInt(ckey) > maxColIdx) {
              maxColIdx = parseInt(ckey)
            }
          }
        }
      }
      return maxColIdx
    },
    calcViewerProps () {
      // width
      this.viewer.width = this.$refs.window.getBodyWidth()

      // height
      let gridHeight = 0
      const maxRowIdx = this.getMaxRowIdx()
      if (maxRowIdx >= 0) {
        const sheet = this.data[0]
        let customHeightRowCount = 0;
        if (sheet.rows) {
          for (const key in sheet.rows) {
            if (isNumeric(key) && sheet.rows[key].height) {
              gridHeight += sheet.rows[key].height
              customHeightRowCount += 1
            }
          }
          gridHeight += (maxRowIdx + 1 - customHeightRowCount) * this.defaultRowHeight
        }
      }

      if (this.article.isEditing || !this.data) {
        this.viewer.height = this.viewer.minHeight
      } else if (this.isFullScreen) {
        this.viewer.height = this.$refs.window.getBodyHeight() + this.bottombarHeight
      } else if (gridHeight + this.headerHeight + 3 * this.defaultRowHeight > this.viewer.minHeight) {
        this.viewer.height = gridHeight + this.headerHeight + 3 * this.defaultRowHeight
      } else {
        this.viewer.height = this.viewer.minHeight
      }

      // hideVerticalScrollbar
      this.viewer.hideVerticalScrollbar = !this.isFullScreen || gridHeight + 2 * this.defaultRowHeight <= this.$refs.window.getBodyHeight()

      // hideHorizontalScrollbar
      let gridWidth = 0
      const maxColIdx = this.getMaxColIdx()
      if (maxColIdx >= 0) {
        const sheet = this.data[0]
        let customWidthColCount = 0
        if (sheet.cols) {
          for (const key in sheet.cols) {
            if (isNumeric(key) && sheet.cols[key]['width']) {
              gridWidth += sheet.cols[key]['width']
              customWidthColCount += 1
            }
          }
          gridWidth += (maxColIdx + 1 - customWidthColCount) * this.defaultColWidth
        }
      }

      this.viewer.hideHorizontalScrollbar = gridWidth + this.lineNumberColWidth < this.viewer.width
    },
    calcEditorProps () {
      // width
      this.editor.width = this.$refs.window.getBodyWidth()

      // height
      if (this.isFullScreen) {
        this.editor.height = this.$refs.window.getBodyHeight() + this.bottombarHeight
      } else {
        this.editor.height = window.innerHeight > 500
              ? window.innerHeight - 150
              : 500
      }
    },
    reload () {
      Spreadsheet.locale(this.locale === 'zh_CN' ? 'zh-cn' : 'en')
      if (this.article.isEditing) {
        this.calcEditorProps()
        const container = document.getElementById(this.editor.id)
        container.innerHTML = ''
        this.editor.instance = new Spreadsheet(container, {
          mode: 'edit',
          view: {
            width: () => this.editor.width,
            height: () => this.editor.height
          }
        })
        this.editor.instance.loadData(this.data)
      } else {
        this.calcViewerProps()
        const container = document.getElementById(this.viewer.id)
        container.innerHTML = ''
        this.viewer.instance = new Spreadsheet(container, {
          mode: 'read',
          showToolbar: false,
          showContextmenu: false,
          view: {
            width: () => this.viewer.width,
            height: () => this.viewer.height
          }
        })
        this.viewer.instance.loadData(this.data)
      }
    }
  }
}
</script>

<style scoped>
  .spreadsheet-article >>> .body {
    overflow: hidden;
  }

  .hide-vertical-scrollbar >>> .x-spreadsheet-scrollbar.vertical {
    display: none !important;
  }

  .hide-horizontal-scrollbar >>> .x-spreadsheet-scrollbar.horizontal {
    display: none !important;
  }

  .hide-bottombar >>> .x-spreadsheet-bottombar {
    display: none !important;
  }
</style>