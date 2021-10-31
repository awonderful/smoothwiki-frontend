<template>
  <div>
    <article-window
      :isReadOnly   = "article.isReadOnly"
      :isEditing    = "article.isEditing"
      :isFreshNew   = "article.id === 0"
      :isFullScreen = "isFullScreen"
      :title.sync   = "article.editingTitle"
      :buttons      = "buttons"
      :menuItems    = "menuItems"
      @clickButton  = "clickButton"
      @clickMenu    = "clickMenu"
      ref="window">
      <template v-slot:editor>
        <!-- 链接窗口 -->
        <v-dialog
          v-model="linkDialog.show"
          persistent
          max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ $t('article.richText.insertLinkDialog.title') }}</span>
              <v-spacer></v-spacer>
              <v-btn icon dense elevation="0" @click="hideLinkDialog()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="linkDialog.title" :placeholder="$t('article.richText.insertLinkDialog.titlePlaceHolder')" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="linkDialog.url" placeholder="https://" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="hideLinkDialog">{{ $t('article.richText.insertLinkDialog.cancel') }}</v-btn>
              <v-btn color="blue darken-1" text @click="applyLink()">{{ $t('article.richText.insertLinkDialog.ok') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 网络图片窗口 -->
        <v-dialog
          v-model="networkImageDialog.show"
          persistent
          max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline"> {{ $t('article.richText.insertNetworkImageDialog.title') }} </span>
              <v-spacer></v-spacer>
              <v-btn icon dense elevation="0" @click="hideNetworkImageDialog()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="networkImageDialog.url" placeholder="https://" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="hideNetworkImageDialog()"> {{ $t('article.richText.insertNetworkImageDialog.cancel') }} </v-btn>
              <v-btn color="blue darken-1" text @click="insertNetworkImage()"> {{ $t('article.richText.insertNetworkImageDialog.ok') }} </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--上传本地图片-->
        <input
          type="file"
          ref="file"
          @change=uploadLocalImage()
          accept="image/*"
          :style="{display: 'none'}" />
       
        <editor-menu-bar dense :editor="editor" v-slot="{ commands, isActive }">
          <v-toolbar dense class="toolbar elevation-0">
              <v-btn
                dense
                small
                :color="item.isActive(isActive) ? 'grey lighten-1': 'white'"
                v-for="item of menuBarButtons"
                :key="item.name"
                :class="[item.name, 'editor-button', 'elevation-0', {'active': item.isActive(isActive)}]"
                @click="item.exec(commands)">
                <v-icon small color="grey darken-1">{{item.icon}}</v-icon>
              </v-btn>
              <v-menu
                :offset-y="true"
                open-on-hover
                bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dense
                    small
                    v-bind="attrs"
                    v-on="on"
                    color="white"
                    class="editor-button elevation-0">
                    <v-icon small color="grey darken-1">mdi-image</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item-group>
                    <v-list-item @click="showNetworkImageDialog()">
                      <v-list-item-content>
                        <v-list-item-title>{{ $t('article.richText.toolbar.insertNetworkImage') }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="showUploadDialog()">
                      <v-list-item-content>
                        <v-list-item-title>{{ $t('article.richText.toolbar.uploadLocalImage') }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
              <v-btn
                dense
                small
                color="white"
                class="editor-button elevation-0"
                @click="insertTable()">
                <v-icon small color="grey darken-1">mdi-table-plus</v-icon>
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
import BaseArticle from '@/components/Article/BaseArticle'
import ArticleWindow from '@/components/Article/ArticleWindow'
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

import { ATTACHMENT_SHOW_URL } from '@/common/constants.js'
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
  CodeBlockHighlight,
  Image
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
      linkDialog: {
        show: false,
        title: '',
        url: ''
      },

      networkImageDialog: {
        show: false,
        url: ''
      },

      editor: null,
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
          new Link({openOnClick: false}),
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
          new Image(),
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
              json,
              shell
            }
          })
      ],
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
          name:     'link',
          icon:     'mdi-link-variant',
          isActive: function (isActive) {
            return isActive.link()
          },
          exec:     function () {
            this.showLinkDialog()
          }.bind(this)
        },
        {
          name:     'unlink',
          icon:     'mdi-link-variant-off',
          isActive: function (isActive) {
            return false
          },
          exec:     function (commands) {
            commands.link({href: ''})
          }.bind(this)
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
    },

    //--------------------------link-------------------------
    linkAround(state, pos) {
      const $pos = state.doc.resolve(pos)

      const { parent, parentOffset } = $pos;
      const start = parent.childAfter(parentOffset)
      if (!start.node) return null

      const link = start.node.marks.find((mark) => mark.type === state.schema.marks.link)
      if (!link) return null

      let startIndex = $pos.index()
      let startPos = $pos.start() + start.offset
      let endIndex = startIndex + 1
      let endPos = startPos + start.node.nodeSize
      while (startIndex > 0 && link.isInSet(parent.child(startIndex - 1).marks)) {
        startIndex -= 1
        startPos -= parent.child(startIndex).nodeSize
      }
      while (endIndex < parent.childCount && link.isInSet(parent.child(endIndex).marks)) {
        endPos += parent.child(endIndex).nodeSize
        endIndex += 1
      }
      return { from: startPos, to: endPos }
    },
    showLinkDialog() {
      this.linkDialog.title = ''
      this.linkDialog.url   = ''
      if (this.editor.isActive.link()) {
        const around = this.linkAround(this.editor.state, this.editor.selection.from)
        this.editor.setSelection(around.from, around.to)
        const attrs = this.editor.getMarkAttrs('link')
        this.linkDialog.url = attrs.href
      }

      const title = this.editor.state.doc.textBetween(this.editor.selection.from, this.editor.selection.to)
      this.linkDialog.title = title
      this.linkDialog.show = true
    },
    hideLinkDialog() {
      this.linkDialog.show = false
    },
    applyLink() {
      this.hideLinkDialog()

      const selectionTitle = this.editor.state.doc.textBetween(this.editor.selection.from, this.editor.selection.to)
      if (this.linkDialog.title !== selectionTitle) {
        const mark = this.editor.schema.marks.link.create({ href: this.linkDialog.url, target: '_blank' })
        const from = this.editor.state.selection.from
        const transaction = this.editor.state.tr.deleteSelection()
        transaction.insertText(this.linkDialog.title)
        transaction.addMark(from, from + this.linkDialog.title.length, mark)
        this.editor.view.dispatch(transaction)
      } else {
        this.editor.commands.link({href: this.linkDialog.url, target: '_blank'})
      }
    },
    unlink() {
      this.editor.commands.link({href: ''})
    },



    //--------------------------network image-------------------------
    showNetworkImageDialog () {
      this.networkImageDialog.url  = ''
      this.networkImageDialog.show = true
    },
    hideNetworkImageDialog () {
      this.networkImageDialog.show = false
    },
    insertNetworkImage () {
      this.editor.commands.image({src: this.networkImageDialog.url})
      this.hideNetworkImageDialog()
    },

    //--------------------------local image-------------------------
    showUploadDialog () {
      const input = this.$refs.file
      input.focus()
      input.click()
    },
    async uploadLocalImage() {
      const input = this.$refs.file
      const res = await this.$state.pageAction.addAttachmentToArticle(this.article.spaceId, this.article.nodeId, this.article.uniqId, input.files[0])
      const url = ATTACHMENT_SHOW_URL + res.data.data.id
      this.editor.commands.image({src: url})
    },

    //----------------------------table-----------------------------
    insertTable() {
      this.editor.commands.createTable({
        rowsCount:     3,
        colsCount:     3,
        withHeaderRow: true
      })
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
  .editor-button {
    min-width: 2em;
  }
  .content {
    text-align: left;
    padding: 8px 25px;
  }
  .content >>> img {
    max-width: min(100%, 800px);
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