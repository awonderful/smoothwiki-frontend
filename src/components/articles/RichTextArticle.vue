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
      ref="window">

      <!-- editor begins -->
      <template v-slot:editor>
        <classic-editor-layout :isFullScreen="isFullScreen">

          <!-- editor toolbar begins --> 
          <template v-slot:classic-editor-toolbar>

            <!-- the link dialog -->
            <insert-link-dialog
              v-model="linkDialog.show"
              :title.sync="linkDialog.title"
              :url.sync="linkDialog.url"
              @ok="applyLink()"
            />

            <!-- the network image dialog -->
            <insert-network-image-dialog
              v-model="networkImageDialog.show"
              :url.sync="networkImageDialog.url"
              @ok="insertNetworkImage()"
            />

            <!-- upload local image -->
            <input
              type="file"
              ref="file"
              @change=uploadLocalImage()
              accept="image/*"
              :style="{display: 'none'}" />
          
            <v-toolbar dense class="toolbar elevation-0">
              <template v-for="(item, idx) of menuBarButtons">
                <!-- divider -->
                <v-divider
                  :key="item.name + idx"
                  vertical
                  class="vertical-divider mx-2"
                  v-if="item.name === 'divider'">
                </v-divider>

                <!-- image -->
                <v-menu
                  :offset-y="true"
                  open-on-hover
                  bottom
                  :key="item.name"
                  v-else-if="item.name === 'insertImage'">
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

                <!-- symbol -->
                <v-menu
                  :offset-y="true"
                  open-on-hover
                  bottom
                  :key="item.name"
                  v-else-if="item.name === 'insertSymbol'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      dense
                      small
                      v-bind="attrs"
                      v-on="on"
                      color="white"
                      class="editor-button elevation-0">
                      <v-icon small color="grey darken-1">{{item.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <insert-symbol-board @ok="insertSymbol($event)"/>
                </v-menu>

                <!-- table -->
                <v-menu
                  :offset-y="true"
                  open-on-hover
                  bottom
                  :key="item.name"
                  v-else-if="item.name === 'insertTable'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      dense
                      small
                      v-bind="attrs"
                      v-on="on"
                      color="white"
                      class="editor-button elevation-0"
                      :disabled="item.isDisabled && item.isDisabled()"
                      >
                      <v-icon small color="grey darken-1">{{item.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <insert-table-board @ok="insertTable($event.row, $event.col)"/>
                </v-menu>

                <!-- ordinary buttons -->
                <v-tooltip
                  bottom
                  :key="item.name"
                  v-else>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      dense
                      small
                      :color="item.isActive && item.isActive() ? 'grey lighten-1': 'white'"
                      :key="item.name"
                      :class="[item.name, 'editor-button', 'elevation-0', {'active': item.isActive && item.isActive()}]"
                      :disabled="item.isDisabled && item.isDisabled()"
                      @click="item.exec()"
                      v-bind="attrs"
                      v-on="on">
                      <v-icon small color="grey darken-1">{{typeof item.icon === 'function' ? item.icon() : item.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ typeof item.tip === 'function' ? item.tip() : $t('article.richText.toolbar.buttonTips.' + item.name)}}</span>
                </v-tooltip>
              </template>
            </v-toolbar>
            <v-divider></v-divider>
          </template>
          <!-- editor toolbar ends --> 

          <!-- editor body -->
          <template v-slot:classic-editor-body>
            <editor-content class="content editing" :editor="editor" :spellcheck="false" />
          </template>

        </classic-editor-layout>
      </template>
      <!-- editor ends -->

      <!-- view -->
      <template v-slot:view>
        <editor-content class="content view" :editor="editor" :spellcheck="false" />
      </template>
    </article-window>
  </div>
</template>

<script>
import BaseArticle from './BaseArticle.vue'
import ArticleWindow from './ArticleWindow.vue'
import InsertLinkDialog from './widgets/InsertLinkDialog.vue'
import InsertNetworkImageDialog from './widgets/InsertNetworkImageDialog.vue'
import InsertTableBoard from './widgets/InsertTableBoard.vue'
import InsertSymbolBoard from './widgets/InsertSymbolBoard.vue'
import ClassicEditorLayout from './widgets/ClassicEditorLayout.vue'
import { ATTACHMENT_SHOW_URL } from '@/common/constants.js'
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TableRow from '@tiptap/extension-table-row'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { lowlight } from 'lowlight'

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-is-symbol': null,
    }
  },
})

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
    EditorContent,
    InsertLinkDialog,
    InsertNetworkImageDialog,
    InsertTableBoard,
    InsertSymbolBoard,
    ClassicEditorLayout,
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
          StarterKit.configure({codeBlock: false}),
          CodeBlockLowlight.configure({lowlight}),
          Link.configure({openOnClick: false}),
          Underline,
          Table,
          TableHeader,
          TableCell,
          TableRow,
          CustomImage,
          Subscript,
          Superscript,
          Highlight,
          TaskItem,
          TaskList,
      ],
      menuBarButtons: [
        {
          name:       'undo',
          icon:       'mdi-undo',
          isActive:   () => {
            return false
          },
          isDisabled: () => {
            return !this.editor.can().undo()
          },
          exec:       () => {
            this.editor.chain().focus().undo().run()
          }
        },
        {
          name:      'redo',
          icon:      'mdi-redo',
          isActive:  () => {
            return false
          },
          isDisabled: () => {
            return !this.editor.can().redo()
          },
          exec:      () => {
            this.editor.chain().focus().redo().run()
          }
        },
        {
          name:      'divider'
        },
        {
          name:      'bold',
          icon:      'mdi-format-bold',
          isActive:  () => {
            return this.editor.isActive('bold')
          },
          exec:      () => {
            this.editor.chain().focus().toggleBold().run()
          }
        },
        {
          name:      'italic',
          icon:      'mdi-format-italic',
          isActive:  () => {
            return this.editor.isActive('italic')
          },
          exec:      () => {
            this.editor.chain().focus().toggleItalic().run()
          }
        },
        {
          name:      'strike',
          icon:      'mdi-format-strikethrough',
          isActive:  () => {
            return this.editor.isActive('strike')
          },
          exec:      () => {
            this.editor.chain().focus().toggleStrike().run()
          }
        },
        {
          name:      'underline',
          icon:      'mdi-format-underline',
          isActive:  () => {
            return this.editor.isActive('underline')
          },
          exec:      () => {
            this.editor.chain().focus().toggleUnderline().run()
          }
        },
        {
          name:      'subscript',
          icon:      'mdi-format-subscript',
          isActive:  () => {
            return this.editor.isActive('subscript')
          },
          exec:      () => {
            this.editor.chain().focus().toggleSubscript().run()
          }
        },
        {
          name:      'superscript',
          icon:      'mdi-format-superscript',
          isActive:  () => {
            return this.editor.isActive('superscript')
          },
          exec:      () => {
            this.editor.chain().focus().toggleSubscript().run()
          }
        },
        {
          name:      'highlight',
          icon:      'mdi-format-color-highlight',
          isActive:  () => {
            return this.editor.isActive('highlight')
          },
          exec:      () => {
            this.editor.chain().focus().toggleHighlight({color: '#ffcc00'}).run()
          }
        },
        {
          name:      'heading1',
          icon:      'mdi-format-header-1',
          isActive:  () => {
            return this.editor.isActive('heading', {level: 1})
          },
          exec:      () => {
            this.editor.chain().focus().toggleHeading({level: 1}).run()
          }
        },
        {
          name:      'heading2',
          icon:      'mdi-format-header-2',
          isActive:  () => {
            return this.editor.isActive('heading', {level: 2})
          },
          exec:      () => {
            this.editor.chain().focus().toggleHeading({level: 2}).run()
          }
        },
        {
          name:      'heading3',
          icon:      'mdi-format-header-3',
          isActive:  () => {
            return this.editor.isActive('heading', {level: 3})
          },
          exec:      () => {
            this.editor.chain().focus().toggleHeading({level: 3}).run()
          }
        },
        {
          name:      'divider'
        },
        {
          name:      'bulletedList',
          icon:      'mdi-format-list-bulleted',
          isActive:  () => {
            return this.editor.isActive('bulletList')
          },
          exec:      () => {
            this.editor.chain().focus().toggleBulletList().run()
          }
        },
        {
          name:      'numberedList',
          icon:      'mdi-format-list-numbered',
          isActive:  () => {
            return this.editor.isActive('orderedList')
          },
          exec:      () => {
            this.editor.chain().focus().toggleOrderedList().run()
          }
        },
        {
          name:      'taskList',
          icon:      'mdi-format-list-checks',
          isActive:  () => {
            return this.editor.isActive('taskList')
          },
          exec:      () => {
            this.editor.chain().focus().toggleTaskList().run()
          }
        },
        {
          name:      'quote',
          icon:      'mdi-format-quote-close',
          isActive:  () => {
            return this.editor.isActive('blockquote')
          },
          exec:      () => {
            this.editor.chain().focus().toggleBlockquote().run()
          }
        },
        {
          name:      'codeBlock',
          icon:      'mdi-code-tags',
          isActive:  () => {
            return this.editor.isActive('codeBlock')
          },
          exec:      () => {
            this.editor.chain().focus().toggleCodeBlock().run()
          }
        },
        {
          name:      'link',
          icon:      'mdi-link-variant',
          isActive:  () => {
            return this.editor.isActive('link')
          },
          exec:      () => {
            this.showLinkDialog()
          }
        },
        {
          name:      'unlink',
          icon:      'mdi-link-variant-off',
          isActive:  () => {
            return false
          },
          exec:      () => {
            this.editor.chain().focus().unsetLink().run()
          }
        },
        {
          name:      'insertImage'
        },
        {
          name:      'horizontalRule',
          icon:      'mdi-minus',
          exec:      () => {
            this.editor.chain().focus().setHorizontalRule().run()
          }
        },
        {
          name:      'insertSymbol',
          icon:      'mdi-copyright',
          isActive:  () => {
            return false
          }
        },
        {
          name:      'divider'
        },
        {
          name:      'insertTable',
          icon:      'mdi-table-plus',
          isDisabled: () => {
            return !this.editor.can().insertTable()
          }
        },
        {
          name:      'deleteTable',
          icon:      'mdi-table-minus',
          isDisabled: () => {
            return !this.editor.can().deleteTable()
          },
          exec:      () => {
            this.editor.chain().focus().deleteTable().run()
          }
        },
        {
          name:      'addColBefore',
          icon:      'mdi-table-column-plus-before',
          isDisabled: () => {
            return !this.editor.can().addColumnBefore()
          },
          exec:      () => {
            this.editor.chain().focus().addColumnBefore().run()
          }
        },
        {
          name:      'addColAfter',
          icon:      'mdi-table-column-plus-after',
          isDisabled: () => {
            return !this.editor.can().addColumnAfter()
          },
          exec:      () => {
            this.editor.chain().focus().addColumnAfter().run()
          }
        },
        {
          name:      'deleteColumn',
          icon:      'mdi-table-column-remove',
          isDisabled: () => {
            return !this.editor.can().deleteColumn()
          },
          exec:      () => {
            this.editor.chain().focus().deleteColumn().run()
          }
        },
        {
          name:      'addRowBefore',
          icon:      'mdi-table-row-plus-before',
          isDisabled: () => {
            return !this.editor.can().addRowBefore()
          },
          exec:      () => {
            this.editor.chain().focus().addRowBefore().run()
          }
        },
        {
          name:      'addRowAfter',
          icon:      'mdi-table-row-plus-after',
          isDisabled: () => {
            return !this.editor.can().addRowAfter()
          },
          exec:      () => {
            this.editor.chain().focus().addRowAfter().run()
          }
        },
        {
          name:      'deleteRow',
          icon:      'mdi-table-row-remove',
          isDisabled: () => {
            return !this.editor.can().deleteRow()
          },
          exec:      () => {
            this.editor.chain().focus().deleteRow().run()
          }
        },
        {
          name:      'mergeOrSplitCells',
          icon:      () => {
            return this.editor.can().splitCell()
              ? 'mdi-table-split-cell'
              : 'mdi-table-merge-cells'
          },
          tip:       () => {
            return this.editor.can().splitCell()
              ? this.$t('article.richText.toolbar.buttonTips.splitCell')
              : this.$t('article.richText.toolbar.buttonTips.mergeCells')
          },
          isDisabled: () => {
            return !this.editor.can().mergeCells() && !this.editor.can().splitCell()
          },
          exec:      () => {
            this.editor.chain().focus().mergeOrSplit().run()
          }
        }
      ],
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
      return this.editor.getText() 
    },
    afterExitEditing() {
      this.editor.chain().setContent(this.article.editingBody).run()
    },
    //--------------------------link-------------------------
    showLinkDialog() {
      this.linkDialog.title = ''
      this.linkDialog.url   = ''
      if (this.editor.isActive('link')) {
        this.editor.chain().focus().extendMarkRange('link').run()
        this.linkDialog.url = this.editor.getAttributes('link').href
      }

      const title = this.editor.state.doc.textBetween(this.editor.state.selection.from, this.editor.state.selection.to)
      this.linkDialog.title = title
      this.linkDialog.show = true
    },
    hideLinkDialog() {
      this.linkDialog.show = false
    },
    applyLink() {
      this.hideLinkDialog()

      const selectionTitle = this.editor.state.doc.textBetween(this.editor.state.selection.from, this.editor.state.selection.to)
      if (this.linkDialog.title !== selectionTitle) {
        const mark = this.editor.schema.marks.link.create({ href: this.linkDialog.url, target: '_blank' })
        const from = this.editor.state.selection.from
        const transaction = this.editor.state.tr.deleteSelection()
        transaction.insertText(this.linkDialog.title)
        transaction.addMark(from, from + this.linkDialog.title.length, mark)
        this.editor.view.dispatch(transaction)
      } else {
        this.editor.chain().focus().setLink({href: this.linkDialog.url, target: '_blank'}).run()
      }
    },
    unlink() {
      this.editor.chain().focus().unsetLink().run()
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
      this.editor.chain().focus().setImage({src: this.networkImageDialog.url}).run()
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
      this.editor.chain().focus().setImage({src: url}).run()
    },

    //----------------------------table-----------------------------
    insertTable(row, col) {
      this.editor.chain().focus().insertTable({
        rows: row,
        cols: col,
        resizable: true,
        withHeaderRow: true,
      }).run()
    },

    //----------------------------table-----------------------------
    insertSymbol(symbol) {
      this.editor.chain().focus().setImage({
        src: `/symbol/${symbol}.png`,
        'data-is-symbol': 'true',
      }).run()
    },
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
    min-width: 2em !important;
  }
  .editor-button.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: white !important;
  }
  .vertical-divider {
    min-height: 50%;
    max-height: 50%;
    position: relative;
    top: 25%;
  }
  .content {
    text-align: left;
    padding: 8px 25px;
  }
  .content >>> img {
    max-width: 100%;
  }
  .content >>> img[data-is-symbol] {
    width: 1em;
    height: 1em;
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
  .toolbar >>> .v-toolbar__content {
    flex-wrap: wrap;
  }
</style>

<style lang="scss">
  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    p {
      margin: 0;
    }

    li {
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
</style>