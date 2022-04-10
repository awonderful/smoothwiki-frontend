<template>
  <div class="graph">
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
        <iframe
          ref="editor"
          src="/mxgraph/index.html"
          key="editor"
          :class="['graph-editor', {'fullscreen': isFullScreen}]">
        </iframe>
      </template>
      <template v-slot:view>
        <iframe 
          ref="view"
          src="/mxgraph/view.html"
          key="view"
          :class="['graph-view', {'fullscreen': isFullScreen}]">
        </iframe>
      </template>
    </article-window>
  </div>
</template>

<script>
import BaseArticle from './BaseArticle.vue'
import ArticleWindow from './ArticleWindow.vue'

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
  },
  computed: {
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
      viewIframeHeight: '300px',
    }
  },
  watch: {
    isEditing: {
      immediate: true,
      handler: function (val) {
        if (val === true) {
          this.reloadEditor()
        } else {
          this.reloadView()
        }
      }
    },
    isFullScreen (val) {
      if (!this.article.isEditing && val == false) {
        this.adjustViewHeight()
      }
    } 
  },
  methods: {
    getEditingBody () {
      const iframe = this.$refs.editor
      const iwindow = iframe.contentWindow
      const editor = iwindow.EDITORUI.editor
			const enc = new iwindow.mxCodec();
			const node = enc.encode(editor.graph.getModel())
			const xml = iwindow.mxUtils.getPrettyXml(node)
      return xml
    },
    getEditingSearch() {
      const iframe = this.$refs.editor
      const iwindow = iframe.contentWindow
			const obj = iwindow.EDITORUI.editor.getGraphXml() 

      let search = ''

      if (obj?.children?.[0]?.children?.[0]?.tagName === 'root') {
        const root = obj?.children?.[0]?.children?.[0]

        for (const node of root.children) {
          if (['Diagram', 'Layer'].includes(node.tagName)) {
            continue
          }

          const label = node.getAttribute('label')
          if (label) {
            search += label
          }
        }
      }

      return search
    },
    reloadView () {
      if (this.article.isEditing) {
        return
      }
      setTimeout(function () {
        const iwindow = this.$refs?.view?.contentWindow
        if (iwindow && iwindow.show) {
          iwindow.show(this.article.editingBody)
          this.adjustViewHeight()
        } else {
          this.reloadView()
        }
      }.bind(this), 50)
    },
    reloadEditor () {
      setTimeout(function () {
        const iwindow = this.$refs?.editor?.contentWindow
        if (iwindow && iwindow.EDITORUI && iwindow.mxUtils) {
          const doc = iwindow.mxUtils.parseXml(this.article.editingBody)
          const node = doc.documentElement
          iwindow.EDITORUI.editor.setGraphXml(node)
          iwindow.onbeforeunload = null
        } else {
          this.reloadEditor()
        }
      }.bind(this), 10)
    },
    adjustViewHeight () {
      if (this.article.isEditing || this.isFullScreen) {
        return
      }
      setTimeout( function () {
        const iwindow = this.$refs?.view?.contentWindow
        if (iwindow && iwindow?.document?.documentElement?.scrollHeight) {
          this.$refs.view.style.height = this.$refs.view.contentWindow.document.documentElement.scrollHeight + 'px'
          this.$refs.view.contentWindow.graph.center()
        } else {
          this.adjustViewHeight()
        }
      }.bind(this), 10)
    },
    fullscreen () {
      this.hidePageScrollbar()
      this.isFullScreen = true
    },
    exitFullscreen() {
      this.isFullScreen = false
      setTimeout(function () {
        this.showPageScrollbar()
      }.bind(this), 0)
    },
  },
  mounted () {

  }
}
</script>

<style scoped>
  .graph-editor {
    width: 100%;
    height: 800px;
    border: 0;
  }

  .graph-view {
    width: 100%;
    height: 300px;
    border: 0;
  }

  .graph-editor.fullscreen, .graph-view.fullscreen {
    height: 100%;
  }

  .graph >>> .article-container .body {
    overflow: hidden;
  }
</style>