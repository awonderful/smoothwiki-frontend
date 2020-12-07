<template>
  <div>
    <article-window
      :isReadOnly   = "article.isReadOnly"
      :isEditing    = "article.isEditing"
      :isFreshNew   = "article.id === 0"
      :isFullScreen = "article.isFullScreen"
      :title.sync   = "editingTitle"
      @clickButton  = "clickButton"
      ref           = "window">
      <template v-slot:editor>
        <mavon-editor 
          :boxShadow        = "false"
          :toolbars         = "toolbars"
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
  computed: {
    editingTitle: {
      get () {
        return this.article.editingTitle
      },
      set (val) {
        this.$store.commit('SET_ARTICLE_PROPS', {
          uniqId: this.article.uniqId,
          props: {
            editingTitle: val
          }
        })
      }
    },
    editingBody: {
      get () {
        return this.article.editingBody
      },
      set (val) {
        this.$store.commit('SET_ARTICLE_PROPS', {
          uniqId: this.article.uniqId,
          props: {
            editingBody: val
          }
        })
      }
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
        alignleft:     true,
        aligncenter:   true,
        alignright:    true,
        subfield:      true,
        preview:       true
      }
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
</style>
