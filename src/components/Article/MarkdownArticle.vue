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
        <mavon-editor 
          :boxShadow        = "false"
          :toolbars         = "toolbars"
          :ishljs           = "true"
          :language         = "language"
          :html             = "true"
          :externalLink     = "externalLink"
          :xssOptions       = "xssOptions"
          fontSize          = "16px"
          codeStyle         = "github"
          @imgAdd           = "addImage"
          v-model           = "article.editingBody"
          class             = "markdown-editor"
          previewBackground = "#ffffff"
          ref               = "editor"/>
      </template>
      <template v-slot:view>
        <mavon-editor
          :value            = "article.body" 
          :boxShadow        = "false" 
          :editable         = "false" 
          :subfield         = "false" 
          :toolbarsFlag     = "false"
          :ishljs           = "true"
          :language         = "language"
          :html             = "true"
          :externalLink     = "externalLink"
          :xssOptions       = "xssOptions"
          fontSize          = "16px"
          codeStyle         = "github"
          class             = "markdown-viewer" 
          defaultOpen       = "preview" 
          previewBackground = "#ffffff"
          ref               = "viewer"/>
      </template>
    </article-window>
  </div>
</template>

<script>
import BaseArticle from './BaseArticle.vue'
import ArticleWindow from './ArticleWindow.vue'
import { mavonEditor } from 'mavon-editor'
import { ATTACHMENT_SHOW_URL } from '@/common/constants.js'
import 'mavon-editor/dist/css/index.css'

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
    mavonEditor
  },
  computed: {
    language () {
      return this.$i18n.locale.replace('_', '-')
    }
  },
  data: function () {
    return {
      toolbars: {
        bold:          true,
        italic:        true,
        header:        true,
        underline:     true,
        strikethrough: true,
        mark:          true,
        superscript:   true,
        subscript:     true,
        quote:         true,
        ol:            true,
        ul:            true,
        link:          true,
        imagelink:     true,
        code:          true,
        table:         true,
        undo:          true,
        redo:          true,
        subfield:      true,
        preview:       true
      },
      xssOptions: {
        whiteList: {
          br: []
        }
      },
      externalLink: {
        markdown_css: function() {
          return '/markdown/github-markdown.min.css'
        },
        hljs_js: function() {
          return '/highlightjs/highlight.min.js'
        },
        hljs_css: function(css) {
          return '/highlightjs/styles/' + css + '.min.css'
        },
        hljs_lang: function(lang) {
          return '/highlightjs/languages/' + lang + '.min.js'
        },
        katex_js: function() {
          return '/katex/katex.min.js'
        },
        katex_css: function() {
          return '/katex/katex.min.css'
        }
      },
    }
  },
  methods: {
    async addImage(pos, file) {
      const res = await this.$state.pageAction.addAttachmentToArticle(this.article.spaceId, this.article.nodeId, this.article.uniqId, file)
      const url = ATTACHMENT_SHOW_URL + res.data.data.id
      this.$refs.editor.$img2Url(pos, url)
    },
    getEditingSearch() {
      const ref = this.article.isEditing
                   ? this.$refs.editor
                   : this.$refs.viewer
      const div = document.createElement('DIV')
      div.innerHTML = ref.d_render
      return div.innerText
    },
  }
}
</script>

<style scoped>
.markdown-editor >>> img, .markdown-viewer >>> img {
  max-width: 100%;
}
.markdown-editor >>> .v-note-img-wrapper img, .markdown-viewer >>> .v-note-img-wrapper img {
  max-width: 100% !important;
}
.markdown-editor, .markdown-viewer {
  border: 0;
  z-index: 0;
}
.markdown-editor >>> .v-show-content, .markdown-viewer >>> .v-show-content {
  font-size: 16px;
}
.markdown-editor >>> code, .markdown-viewer >>> code {
  line-height: 1.6;
  font-family: monospace;
  font-weight: normal;
  background-color: #f6f8fa !important;
  font-size: 14px;
}
.markdown-editor >>> pre, .markdown-viewer >>> pre {
  border-radius: 5px;
  padding: 0.7rem 1rem;
}
.markdown-editor >>> .hljs, .markdown-viewer >>> .hljs {
  padding: 0;
  background-color: #f6f8fa;
}
</style>