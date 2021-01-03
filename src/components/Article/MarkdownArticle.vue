<template>
  <div>
    <article-window
      :isReadOnly   = "article.isReadOnly"
      :isEditing    = "article.isEditing"
      :isFreshNew   = "article.id === 0"
      :isFullScreen = "article.isFullScreen"
      :title.sync   = "article.editingTitle"
      @clickButton  = "clickButton"
      ref           = "window">
      <template v-slot:editor>
        <mavon-editor 
          :boxShadow        = "false"
          :toolbars         = "toolbars"
          @imgAdd           = "addImage"
          v-model           = "article.editingBody"
          class             = "markdown-editor" 
          previewBackground = "#ffffff"
          ref               = "editor"/>
      </template>
      <template v-slot:view>
        <mavon-editor
          :value        = "article.body" 
          :boxShadow    = "false" 
          :editable     = "false" 
          :subfield     = "false" 
          :toolbarsFlag = "false"
          :ishljs       = "true"
          :externalLink = "{
            hljs_js: function() {
              return '/highlightjs/highlight.min.js';
            },
            hljs_css: function(css) {
              return '/highlightjs/styles/' + css + '.min.css';
            },
            hljs_lang: function(lang) {
              return '/highlightjs/languages/' + lang + '.min.js';
            }
          }"
          codeStyle     = "github"
          class         = "markdown-viewer" 
          defaultOpen   = "preview" 
          previewBackground = "#ffffff"
          ref           = "viewer"/>
      </template>
    </article-window>
  </div>
</template>

<script>
import BaseArticle from './BaseArticle'
import ArticleWindow from './ArticleWindow'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
    mavonEditor
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
      }
    }
  },
  methods: {
    async addImage(pos, file) {
      const res = await this.$state.pageAction.addAttachmentToArticle(this.article.spaceId, this.article.nodeId, this.article.uniqId, file)
      const id  = res.data.data.id
      const url = `http://www.smoothwiki.com/api/attachment/download?attachmentId=${id}`
      this.$refs.editor.$img2Url(pos, url)
    }
  }
}
</script>

<style scoped>
.markdown-editor, .markdown-viewer {
  border: 0;
  z-index: 0;
}
.markdown-editor >>> .v-show-content, .markdown-viewer >>> .v-show-content {
  font-size: 14px;
}
.markdown-editor >>> code, .markdown-viewer >>> code {
  font-size: 12px;
  line-height: 1.6;
  font-family: Menlo,Monaco,Consolas,Courier,monospace;
  font-weight: normal;
  background-color: #f6f8fa;
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