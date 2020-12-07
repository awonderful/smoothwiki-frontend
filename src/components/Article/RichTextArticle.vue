<template>
  <div>
    <article-window
      :isReadOnly   = "article.isReadOnly"
      :isEditing    = "article.isEditing"
      :isFreshNew   = "article.id === 0"
      :isFullScreen = "article.isFullScreen"
      :title.sync   = "article.editingTitle"
      @clickButton  = "clickButton"
      ref="window">
      <template v-slot:editor>
        <editor-menu-bar dense :editor="editor" v-slot="{ commands, isActive }">
          <v-toolbar dense class="toolbar elevation-0">
              <v-btn
                dense
                small
                :color="item.isActive(isActive) ? 'grey lighten-1': 'white'"
                v-for="item of menuBarButtons"
                :key="item.name"
                :class="['editor-button', 'elevation-0', {'active': item.isActive(isActive)}]"
                @click="item.exec(commands)">
                <v-icon small color="grey darken-1">{{item.icon}}</v-icon>
              </v-btn>
              <template v-if="isActive.table()">
                <v-btn
                  dense
                  small
                  color="white"
                  v-for="item of menuBarTableButtons"
                  :key="item.name"
                  class="editor-button elevation-0"
                  @click="item.exec(commands)">
                  <v-icon small color="grey darken-1">{{item.icon}}</v-icon>
                </v-btn>
              </template>
          </v-toolbar>
        </editor-menu-bar>
        <editor-content class="content editing" :editor="editor" :spellcheck="false" />
      </template>
      <template v-slot:view>
        <editor-content class="content view" :editor="editor" :spellcheck="false" />
      </template>
    </article-window>
  </div>
</template>



<script>
import BaseArticle from './BaseArticle'
import ArticleWindow from './ArticleWindow'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import php from 'highlight.js/lib/languages/php'
import java from 'highlight.js/lib/languages/java'
import go from 'highlight.js/lib/languages/go'
import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import cpp from 'highlight.js/lib/languages/cpp'
import csp from 'highlight.js/lib/languages/csp'
import shell from 'highlight.js/lib/languages/shell'
import python from 'highlight.js/lib/languages/python'
import ini from 'highlight.js/lib/languages/ini'
import json from 'highlight.js/lib/languages/json'

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Strike,
  Underline,
  History,
  CodeBlockHighlight
} from 'tiptap-extensions'

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
    EditorContent,
    EditorMenuBar
  },
  data() {
    return {
      extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Table({ resizable: true }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              typescript,
              python,
              css,
              scss,
              bash,
              sql,
              cpp,
              csp,
              php,
              java,
              go,
              xml,
              yaml,
              ini,
              json
            }
          })
      ],
      editor: null,
      menuBarButtons: [
        {
          name:     'undo',
          icon:     'mdi-undo',
          isActive: function () {
            return false
          },
          exec:     function (commands) {
            commands.undo()
          }
        },
        {
          name:     'redo',
          icon:     'mdi-redo',
          isActive: function () {
            return false
          },
          exec:     function (commands) {
            commands.redo()
          }
        },
        {
          name:     'bold',
          icon:     'mdi-format-bold',
          isActive: function (isActive) {
            return isActive.bold()
          },
          exec:     function (commands) {
            commands.bold()
          }
        },
        {
          name:     'italic',
          icon:     'mdi-format-italic',
          isActive: function (isActive) {
            return isActive.italic()
          },
          exec:     function (commands) {
            commands.italic()
          }
        },
        {
          name:     'strike',
          icon:     'mdi-format-strikethrough',
          isActive: function (isActive) {
            return isActive.strike()
          },
          exec:     function (commands) {
            commands.strike()
          }
        },
        {
          name:     'underline',
          icon:     'mdi-format-underline',
          isActive: function (isActive) {
            return isActive.underline()
          },
          exec:     function (commands) {
            commands.underline()
          }
        },
        {
          name:     'heading0',
          icon:     'mdi-format-header-1',
          isActive: function (isActive) {
            return isActive.heading({level: 1})
          },
          exec:     function (commands) {
            commands.heading({level: 1})
          }
        },
        {
          name:     'heading1',
          icon:     'mdi-format-header-2',
          isActive: function (isActive) {
            return isActive.heading({level: 2})
          },
          exec:     function (commands) {
            commands.heading({level: 2})
          }
        },
        {
          name:     'heading2',
          icon:     'mdi-format-header-3',
          isActive: function (isActive) {
            return isActive.heading({level: 3})
          },
          exec:     function (commands) {
            commands.heading({level: 3})
          }
        },
        {
          name:     'bulletList',
          icon:     'mdi-format-list-bulleted',
          isActive: function (isActive) {
            return isActive.bullet_list()
          },
          exec:     function (commands) {
            commands.bullet_list()
          }
        },
        {
          name:     'orderedList',
          icon:     'mdi-format-list-numbered',
          isActive: function (isActive) {
            return isActive.ordered_list()
          },
          exec:     function (commands) {
            commands.ordered_list()
          }
        },
        {
          name:     'blockQuote',
          icon:     'mdi-format-quote-close',
          isActive: function (isActive) {
            return isActive.blockquote()
          },
          exec:     function (commands) {
            commands.blockquote()
          }
        },
        {
          name:     'codeBlock',
          icon:     'mdi-code-tags',
          isActive: function (isActive) {
            return isActive.code_block()
          },
          exec:     function (commands) {
            commands.code_block()
          }
        },
        {
          name:     'table',
          icon:     'mdi-table-plus',
          isActive: function () {
            return false
          },
          exec:     function (commands) {
            commands.createTable({
              rowsCount:     3,
              colsCount:     3,
              withHeaderRow: true})
          }
        }
      ],
      menuBarTableButtons: [
        {
          name:     'deleteTable',
          icon:     'mdi-table-minus',
          exec:     function (commands) {
            commands.deleteTable()
          }
        },
        {
          name:     'addColBefore',
          icon:     'mdi-table-column-plus-before',
          exec:     function (commands) {
            commands.addColumnBefore()
          }
        },
        {
          name:     'addColAfter',
          icon:     'mdi-table-column-plus-after',
          exec:     function (commands) {
            commands.addColumnAfter()
          }
        },
        {
          name:     'deleteColumn',
          icon:     'mdi-table-column-remove',
          exec:     function (commands) {
            commands.deleteColumn()
          }
        },
        {
          name:     'addRowBefore',
          icon:     'mdi-table-row-plus-before',
          exec:     function (commands) {
            commands.addRowBefore()
          }
        },
        {
          name:     'addRowAfter',
          icon:     'mdi-table-row-plus-after',
          exec:     function (commands) {
            commands.addRowAfter()
          }
        },
        {
          name:     'deleteRow',
          icon:     'mdi-table-row-remove',
          exec:     function (commands) {
            commands.deleteRow()
          }
        },
        {
          name:     'toggleCellMerge',
          icon:     'mdi-table-merge-cells',
          exec:     function (commands) {
            commands.toggleCellMerge()
          }
        }
      ]
    }
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
    isEditing () {
      return this.article.isEditing
    }
  },
  methods: {
    getEditingBody() {
      return this.editor.getHTML()
    },
    getEditingSearch() {
      let body = this.getEditingBody()
      let search = body.replace(/<[^>]*>?/gm, '')

      return search
    }
  },
  created () {
    this.editor = new Editor({
      extensions: this.extensions,
      content: this.article.editingBody
    })
  },
  watch: {
    isEditing: {
      immediate: true,
      handler (newVal) {
        if (this.editor === null) {
          return
        }

        if (newVal) {
          this.editor.setOptions({editable: true, autoFocus: true})
        } else {
          this.editor.setOptions({editable: false, autoFocus: false})
        }
      }
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style scoped>
  .content {
    text-align: left;
    padding: 8px 25px;
  }
  .content.editing >>> .ProseMirror {
    min-height: 10em;
  }
  .content >>> .ProseMirror {
    position: relative;
  }
  .content >>> .ProseMirror:focus {
    outline-width: 0;
  }
  .content >>> .ProseMirror table {
    border-collapse: collapse;
    width: auto;
    table-layout: fixed;
    margin: 0;
    overflow: hidden;
  }
  .content >>> .ProseMirror table td {
    border: 1px solid lightgray;
    padding: 0 0.5em;
    height: 2em;
    vertical-align: middle;
    box-sizing: border-box;
    position: relative;
  }
  .content >>> .ProseMirror table th {
    border: 1px solid lightgray;
    font-weight: bold;
    min-width: 5em;
    height: 2em;
    padding: 0 0.5em;
    vertical-align: middle;
    box-sizing: border-box;
    position: relative;
  }
  .content >>> .ProseMirror table td > * {
    margin-bottom: 0;
  }
  .content >>> .ProseMirror table th > * {
    margin-bottom: 0;
  }
  .content >>> .ProseMirror table .selectedCell:after {
    z-index: 2;
    position: absolute;
    content: "";
    left: 0; right: 0; top: 0; bottom: 0;
    background: rgba(200, 200, 255, 0.4);
    pointer-events: none;
  }
  content >>> .ProseMirror table .column-resize-handle {
    position: absolute;
    right: -2px; top: 0; bottom: 0;
    width: 4px;
    z-index: 20;
    background-color: #adf;
    pointer-events: none;
  }
  content >>> .ProseMirror .resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
  .content >>> .ProseMirror blockquote {
    border-left: 3px solid rgba(0,0,0,.1);
    color: rgba(0,0,0,.8);
    padding-left: .8rem;
    font-style: italic;
  }
  .content >>> .ProseMirror blockquote p {
    margin: 0;
  }
  .content >>> .ProseMirror pre {
    padding: 0.7rem 1rem;
    border-radius: 5px;
    background: black;
    color: white;
    font-size: 0.8rem;
    overflow-x: auto;
  }
  .content >>> .ProseMirror pre code {
    display: block;
    background: black;
    color: white;
    font-size: 0.8rem;
  }
  .content >>> .ProseMirror p code {
      padding: 0.2rem 0.4rem;
      border-radius: 5px;
      font-size: 0.8rem;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.8);
  }

  .content >>> .ProseMirror code .hljs-variable,
  .content >>> .ProseMirror code .hljs-template-variable,
  .content >>> .ProseMirror code .hljs-attribute,
  .content >>> .ProseMirror code .hljs-tag,
  .content >>> .ProseMirror code .hljs-name,
  .content >>> .ProseMirror code .hljs-regexp,
  .content >>> .ProseMirror code .hljs-link,
  .content >>> .ProseMirror code .hljs-name,
  .content >>> .ProseMirror code .hljs-selector-id,
  .content >>> .ProseMirror code .hljs-selector-class {
    color: #f2777a;
  }
  .content >>> .ProseMirror code .hljs-number,
  .content >>> .ProseMirror code .hljs-meta,
  .content >>> .ProseMirror code .hljs-built_in,
  .content >>> .ProseMirror code .hljs-builtin-name,
  .content >>> .ProseMirror code .hljs-literal,
  .content >>> .ProseMirror code .hljs-type,
  .content >>> .ProseMirror code .hljs-params {
    color: #f99157;
  }
  .content >>> .ProseMirror code .hljs-string,
  .content >>> .ProseMirror code .hljs-symbol,
  .content >>> .ProseMirror code .hljs-bullet {
    color: #99cc99;
  }
  .content >>> .ProseMirror code .hljs-title,
  .content >>> .ProseMirror code .hljs-section {
    color: #ffcc66;
  }
  .content >>> .ProseMirror code .hljs-keyword,
  .content >>> .ProseMirror code .hljs-selector-tag {
    color: #6699cc;
  }
  .content >>> .ProseMirror code .hljs-emphasis {
    font-style: italic;
  }
  .content >>> .ProseMirror code .hljs-strong {
    font-weight: 700;
  }
  .divider {
    height: 14px;
  }
  .toolbar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
</style>