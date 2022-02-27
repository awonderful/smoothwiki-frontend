<template>
  <div>
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
          :id="editorId" 
          :class="['mind-editor', {'mind-fullscreen': isFullScreen}]"
          :style="{'height': containerHeight + 'px'}"
        >
        </div>
      </template>
      <template v-slot:view>
        <div 
          :id="viewId" 
          :class="['mind-view', {'mind-fullscreen': isFullScreen}]"
          :style="{'height': containerHeight + 'px'}"
        >
        </div>
      </template>
    </article-window>
  </div>
</template>

<script>
import BaseArticle from './BaseArticle.vue'
import ArticleWindow from './ArticleWindow.vue'
import MindElixir, { E } from "mind-elixir";

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
  },
  computed: {
    viewId () {
      return 'mind-view-' + this.article.uniqId
    },
    editorId () {
      return 'mind-edit-' + this.article.uniqId
    },
    isEditing () {
      return this.article.isEditing
    },
    locale () {
      return this.$i18n.locale
    }
  },
  data: function () {
    return {
      view: null,
      editor: null,
      containerHeight: 500
    }
  },
  watch: {
    isEditing (val) {
      if (val === true) {
        this.reloadEditor()
      } else {
        this.reloadView()
      }
    }
  },
  methods: {
    getEditingBody () {
      if (this.article.isEditing === true && this.editor !== null) {
        const data = JSON.parse(this.editor.getAllDataString())
        data.direction = this.editor.direction
        return JSON.stringify(data)
      }

      return this.article.editingBody
    },
    getEditingSearch() {
      const data   = this.editor.getAllData()
      const root   = data.nodeData
      let   topics = []

      let stack = [root]
      while (true) {
        const node = stack.pop()
        if (node === undefined) {
          break
        }
        if (Array.isArray(node.children) && node.children.length > 0) {
          node.children.forEach(function (childNode) {
            stack.push(childNode)
          })
        }

        topics.push(node.topic)
      }

      return topics.join(' ')
    },
    reloadView () {
      setTimeout(function () {
        this.view = new MindElixir({
          el: '#' + this.viewId,
          direction: this.article.body === ''
                     ? MindElixir.LEFT
                     : JSON.parse(this.article.body).direction,
          data: this.article.body === ''
                ? MindElixir.new(this.$t('article.mind.defaultRootNodeText'))
                : JSON.parse(this.article.body),
          draggable: false, 
          contextMenu: false,
          toolBar: true,
          nodeMenu: false,
          keypress: false,
          locale: this.locale,
          editable: false,
          overflowHidden: true,
        });
        this.view.init()
        this.adjustHeight()
      }.bind(this), 0)
    },
    reloadEditor () {
      setTimeout(function () {
        this.editor = new MindElixir({
          el: '#' + this.editorId,
          direction: this.article.editingBody === ''
                     ? MindElixir.LEFT
                     : JSON.parse(this.article.editingBody).direction,
          data: this.article.editingBody === '' 
                ? MindElixir.new(this.$t('article.mind.defaultRootNodeText'))
                : JSON.parse(this.article.editingBody),
          draggable: true, 
          contextMenu: true,
          contextMenuOption: {
            link: false
          },
          toolBar: true,
          nodeMenu: true,
          keypress: true,
          locale: this.locale,
          editable: true
        });
        this.editor.init()
      }.bind(this), 0)
    },
    fullscreen () {
      this.hidePageScrollbar()
      this.isFullScreen = true
      setTimeout(function () {
        if (this.article.isEditing === true) {
          this.editor.toCenter()
        } else {
          this.view.toCenter()
        }
      }.bind(this), 0)
    },
    exitFullscreen() {
      this.isFullScreen = false
      setTimeout(function () {
        this.showPageScrollbar()
          if (this.article.isEditing === true) {
            this.editor.toCenter()
          } else {
            this.view.toCenter()
          }
      }.bind(this), 0)
    },
    adjustHeight() {
      const data = this.view.getAllData()
      const root = data.nodeData
      let minTop = null
      let maxBottom = null

      let stack = [root]
      while (true) {
        const node = stack.pop()
        if (node === undefined) {
          break
        }
        if (Array.isArray(node.children) && node.children.length > 0) {
          node.children.forEach(function (childNode) {
            stack.push(childNode)
          })
        }

        const el = E(node.id)
        const rect = el.getBoundingClientRect()
        if (minTop === null || rect.top < minTop) {
          minTop = rect.top
        }
        if (maxBottom === null || rect.bottom > maxBottom) {
          maxBottom = rect.bottom
        }
      }

      const properHeight = maxBottom - minTop + 100
      if (properHeight > this.containerHeight) {
        this.containerHeight = properHeight
      }

      setTimeout(function () {
        this.view.toCenter()
      }.bind(this), 0)
    }
  },
  mounted () {
    if (this.article.isEditing === true) {
      this.reloadEditor()
    } else {
      this.reloadView()
    }
  }
}
</script>

<style scoped>
.mind-view, .mind-editor {
  width: 100%;
  position: relative;
}
.mind-editor {
  height: 500px;
}
.mind-view >>> .lt, .mind-editor >>> .lt {
  box-sizing: content-box;
}
.mind-editor.mind-fullscreen, .mind-view.mind-fullscreen {
  height: 100% !important;
}
</style>