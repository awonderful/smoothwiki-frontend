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
      :containerId  = "containerId"
      @clickButton  = "clickButton"
      @clickMenu    = "clickMenu"
      ref="window">

      <!-- editor begins -->
      <template v-slot:editor>
        <classic-editor-layout
          :isFullScreen="isFullScreen"
          :containerId="containerId"
          :enableAffixToolbar="article.isEditing && !isFullScreen"
        >

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
                      <v-icon small color="grey darken-1">{{item.icon}}</v-icon>
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
            <editor-content class="content editing" :editor="editor" :spellcheck="false" @paste="handlePasteEvent($event)" />
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
import BaseArticle from '../BaseArticle.vue'
import ArticleWindow from '../ArticleWindow.vue'
import InsertLinkDialog from '../widgets/InsertLinkDialog.vue'
import InsertNetworkImageDialog from '../widgets/InsertNetworkImageDialog.vue'
import InsertTableBoard from '../widgets/InsertTableBoard.vue'
import InsertSymbolBoard from '../widgets/InsertSymbolBoard.vue'
import ClassicEditorLayout from '../widgets/ClassicEditorLayout.vue'
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
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
//import Image from '@tiptap/extension-image'
import EnhancedImage from './EnhancedImage.js'
import { lowlight } from 'lowlight'
import {
  mdiUndo,
  mdiRedo,
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatStrikethrough,
  mdiFormatUnderline,
  mdiFormatSubscript,
  mdiFormatSuperscript,
  mdiFormatColorHighlight,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatListChecks,
  mdiFormatQuoteClose,
  mdiCodeTags,
  mdiImage,
  mdiLinkVariant,
  mdiLinkVariantOff,
  mdiMinus,
  mdiCopyright,
  mdiTablePlus,
  mdiTableMinus,
  mdiTableColumnPlusBefore,
  mdiTableColumnPlusAfter,
  mdiTableColumnRemove,
  mdiTableRowPlusBefore,
  mdiTableRowPlusAfter,
  mdiTableRowRemove,
  mdiTableSplitCell,
  mdiTableMergeCells,
} from '@mdi/js'

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
          Table.configure({resizable: true}),
          TableHeader,
          TableCell,
          TableRow,
          EnhancedImage,
          Subscript,
          Superscript,
          Highlight,
          TaskItem,
          TaskList,
      ],
      menuBarButtons: [
        {
          name:       'undo',
          icon:       mdiUndo,
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
          icon:      mdiRedo,
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
          icon:      mdiFormatBold,
          isActive:  () => {
            return this.editor.isActive('bold')
          },
          exec:      () => {
            this.editor.chain().focus().toggleBold().run()
          }
        },
        {
          name:      'italic',
          icon:      mdiFormatItalic,
          isActive:  () => {
            return this.editor.isActive('italic')
          },
          exec:      () => {
            this.editor.chain().focus().toggleItalic().run()
          }
        },
        {
          name:      'strike',
          icon:      mdiFormatStrikethrough,
          isActive:  () => {
            return this.editor.isActive('strike')
          },
          exec:      () => {
            this.editor.chain().focus().toggleStrike().run()
          }
        },
        {
          name:      'underline',
          icon:      mdiFormatUnderline,
          isActive:  () => {
            return this.editor.isActive('underline')
          },
          exec:      () => {
            this.editor.chain().focus().toggleUnderline().run()
          }
        },
        {
          name:      'subscript',
          icon:      mdiFormatSubscript,
          isActive:  () => {
            return this.editor.isActive('subscript')
          },
          exec:      () => {
            this.editor.chain().focus().toggleSubscript().run()
          }
        },
        {
          name:      'superscript',
          icon:      mdiFormatSuperscript,
          isActive:  () => {
            return this.editor.isActive('superscript')
          },
          exec:      () => {
            this.editor.chain().focus().toggleSubscript().run()
          }
        },
        {
          name:      'highlight',
          icon:      mdiFormatColorHighlight,
          isActive:  () => {
            return this.editor.isActive('highlight')
          },
          exec:      () => {
            this.editor.chain().focus().toggleHighlight({color: '#ffcc00'}).run()
          }
        },
        {
          name:      'heading1',
          icon:      mdiFormatHeader1,
          isActive:  () => {
            return this.editor.isActive('heading', {level: 1})
          },
          exec:      () => {
            this.editor.chain().focus().toggleHeading({level: 1}).run()
          }
        },
        {
          name:      'heading2',
          icon:      mdiFormatHeader2,
          isActive:  () => {
            return this.editor.isActive('heading', {level: 2})
          },
          exec:      () => {
            this.editor.chain().focus().toggleHeading({level: 2}).run()
          }
        },
        {
          name:      'heading3',
          icon:      mdiFormatHeader3,
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
          icon:      mdiFormatListBulleted,
          isActive:  () => {
            return this.editor.isActive('bulletList')
          },
          exec:      () => {
            this.editor.chain().focus().toggleBulletList().run()
          }
        },
        {
          name:      'numberedList',
          icon:      mdiFormatListNumbered,
          isActive:  () => {
            return this.editor.isActive('orderedList')
          },
          exec:      () => {
            this.editor.chain().focus().toggleOrderedList().run()
          }
        },
        {
          name:      'taskList',
          icon:      mdiFormatListChecks,
          isActive:  () => {
            return this.editor.isActive('taskList')
          },
          exec:      () => {
            this.editor.chain().focus().toggleTaskList().run()
          }
        },
        {
          name:      'quote',
          icon:      mdiFormatQuoteClose,
          isActive:  () => {
            return this.editor.isActive('blockquote')
          },
          exec:      () => {
            this.editor.chain().focus().toggleBlockquote().run()
          }
        },
        {
          name:      'codeBlock',
          icon:      mdiCodeTags,
          isActive:  () => {
            return this.editor.isActive('codeBlock')
          },
          exec:      () => {
            this.editor.chain().focus().toggleCodeBlock().run()
          }
        },
        {
          name:      'link',
          icon:      mdiLinkVariant,
          isActive:  () => {
            return this.editor.isActive('link')
          },
          exec:      () => {
            this.showLinkDialog()
          }
        },
        {
          name:      'unlink',
          icon:      mdiLinkVariantOff,
          isActive:  () => {
            return false
          },
          exec:      () => {
            this.editor.chain().focus().unsetLink().run()
          }
        },
        {
          name:      'insertImage',
          icon:      mdiImage,
        },
        {
          name:      'horizontalRule',
          icon:      mdiMinus,
          exec:      () => {
            this.editor.chain().focus().setHorizontalRule().run()
          }
        },
        {
          name:      'insertSymbol',
          icon:      mdiCopyright,
          isActive:  () => {
            return false
          }
        },
        {
          name:      'divider'
        },
        {
          name:      'insertTable',
          icon:      mdiTablePlus,
          isDisabled: () => {
            return !this.editor.can().insertTable()
          }
        },
        {
          name:      'deleteTable',
          icon:      mdiTableMinus,
          isDisabled: () => {
            return !this.editor.can().deleteTable()
          },
          exec:      () => {
            this.editor.chain().focus().deleteTable().run()
          }
        },
        {
          name:      'addColBefore',
          icon:      mdiTableColumnPlusBefore,
          isDisabled: () => {
            return !this.editor.can().addColumnBefore()
          },
          exec:      () => {
            this.editor.chain().focus().addColumnBefore().run()
          }
        },
        {
          name:      'addColAfter',
          icon:      mdiTableColumnPlusAfter,
          isDisabled: () => {
            return !this.editor.can().addColumnAfter()
          },
          exec:      () => {
            this.editor.chain().focus().addColumnAfter().run()
          }
        },
        {
          name:      'deleteColumn',
          icon:      mdiTableColumnRemove,
          isDisabled: () => {
            return !this.editor.can().deleteColumn()
          },
          exec:      () => {
            this.editor.chain().focus().deleteColumn().run()
          }
        },
        {
          name:      'addRowBefore',
          icon:      mdiTableRowPlusBefore,
          isDisabled: () => {
            return !this.editor.can().addRowBefore()
          },
          exec:      () => {
            this.editor.chain().focus().addRowBefore().run()
          }
        },
        {
          name:      'addRowAfter',
          icon:      mdiTableRowPlusAfter,
          isDisabled: () => {
            return !this.editor.can().addRowAfter()
          },
          exec:      () => {
            this.editor.chain().focus().addRowAfter().run()
          }
        },
        {
          name:      'deleteRow',
          icon:      mdiTableRowRemove,
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
              ? mdiTableSplitCell
              : mdiTableMergeCells
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
    async addImage(file) {
      const res = await this.$state.pageAction.addAttachmentToArticle(this.article.spaceId, this.article.nodeId, this.article.uniqId, file)
      const url = ATTACHMENT_SHOW_URL + res.data.data.id
      this.editor.chain().focus().setImage({src: url}).run()
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
    uploadLocalImage() {
      const input = this.$refs.file
      this.addImage(input.files[0])
    },

    //------------------------paste an image------------------------
    handlePasteEvent (view, event, slice) {
      if(event.clipboardData && event.clipboardData.items) {
        for (const item of event.clipboardData.items) {
          if (item.type.indexOf("image") >= 0) {
            const file = item.getAsFile();
            this.addImage(file)
            return true
          }
        }
      }
    },

    //----------------------------table-----------------------------
    insertTable(row, col) {
      this.editor.chain().focus().insertTable({
        rows: row,
        cols: col,
        withHeaderRow: true,
      }).run()
    },

    //----------------------------table-----------------------------
    insertSymbol(symbol) {
      this.editor.chain().focus().setImage({
        src: `/symbol/${symbol}.png`,
        isSymbol: true,
      }).run()
    },
  },
  created () {
    this.editor = new Editor({
      extensions: this.extensions,
      content: this.article.editingBody,
      editable: this.article.isEditing,
      editorProps: {
        handlePaste: this.handlePasteEvent 
      },
    })
  },
  watch: {
    isEditing (newVal) {
      if (this.editor === null) {
        return
      }

      if (newVal) {
        this.editor.setOptions({editable: true, autoFocus: true})
      } else {
        this.editor.setOptions({editable: false, autoFocus: false})
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
    padding: 8px;
    font-size: 16px;
    letter-spacing: 0.2px;
  }
  .content >>> .ProseMirror img {
    max-width: 100%;
  }
  .content >>> .ProseMirror img[data-is-symbol] {
    width: 1em;
    height: 1em;
    padding: 0;
    margin: 0;
    border: 0;
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
  .content >>> .ProseMirror a {
    color: teal;
    font-weight: 600;
    text-decoration: none;
  }
  .content >>> .ProseMirror a:hover {
    text-decoration: underline;
  }
  .content >>> .ProseMirror ul {
    margin: 0.5em 0;
  }
  .content >>> .ProseMirror li p {
    margin: 0;
  }
  .content >>> .ProseMirror ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
  }
  .content >>> .ProseMirror ul[data-type="tasklist"] li {
    display: flex;
  }
  .content >>> .ProseMirror ul[data-type="tasklist"] li > label {
    flex: 0 0 auto;
    margin-right: 0.5rem;
    user-select: none;
  }
  .content >>> .ProseMirror ul[data-type="tasklist"] li > div {
    flex: 1 1 auto;
  }
  .content >>> .ProseMirror h1 {
    margin: 0 0 3rem;
    font-size: 2.4em;
    line-height: 1.4em;
    font-weight: 600;
    padding-bottom: 0.7em;
    border-bottom: 2px solid #ddd;
  }
  .content >>> .ProseMirror h2 {
    font-size: 1.5em;
    font-weight: 600;
    margin: 2.8em 0 0.8em;
    padding-bottom: 0.7em;
    border-bottom: 1px solid #ddd;
  }
  .content >>> .ProseMirror h3 {
    font-size: 1.2em;
    font-weight: 600;
    margin: 3rem 0 1.25rem 0;
  }
  .content >>> .ProseMirror h4 {
    font-size: 1em;
    margin: 1em 0;
  }
  .content >>> .ProseMirror h5 {
    font-size: 0.85em;
    margin: 1em 0;
  }
  .content >>> .ProseMirror h6 {
    font-size: 0.7em;
    margin: 1em 0;
  }
  .content >>> .ProseMirror hr {
    border-left: 0;
    border-right: 0;
  }
  .content >>> .ProseMirror table {
    border-spacing: 0;
    width: auto;
    overflow: auto;
    word-break: normal;
    word-break: keep-all;
    margin: 1.75em 0;
    border: 1px solid teal;
    border-radius: 0.45em;
    border-collapse: separate;
    font-size: 0.85em;
    overflow: hidden;
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
  .content >>> .ProseMirror table th {
    background-color: #eaf3f3;
    padding: 0.5em 1em;
    color: teal;
    font-weight: bold;
    text-align: left;
    vertical-align: middle;
    box-sizing: border-box;
    position: relative;
    border: 0;
    height: 2em;
    min-width: 4em;
  }

  .content >>> .ProseMirror table td {
    padding: 0.5em 1em;
    border: 0;
    height: 2em;
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
  .content >>> .ProseMirror table tr:nth-child(2n-1) {
    background-color: #0000000d;
  }

  .content >>> .ProseMirror table tr td:not(:last-child) {
    border-right: 1px solid lightgray;
  }

  .content >>> .ProseMirror table tr th:not(:last-child) {
    border-right: 1px solid lightgray;
  }

  .content >>> .ProseMirror table tr:hover td {
    background-color: #eaf3f3;
  }
  content >>> .ProseMirror .resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
  
  .content >>> .ProseMirror blockquote {
    margin: 2em 0;
    padding-left: 20px;
    border-left: 4px solid teal;
  }
  .content >>> .ProseMirror blockquote p {
    margin: 0;
  }
  .content >>> .ProseMirror pre {
    padding: 1em 1.5em;
    overflow: auto;
    background-color: #1e1e1e;
    border-radius: 0.45em;
    margin: 1.75em 0;
  }
  .content >>> .ProseMirror pre code {
    font-family: 'Droid Sans Mono', 'monospace', monospace;
    font-size: 0.85em;
    line-height: 1.45em;
    margin: 0;
    padding: 0;
    border-radius: 0;
    color: #e9e9e9;
  }
  .content >>> .ProseMirror :not(pre) > code {
    font-family: 'Droid Sans Mono', 'monospace', monospace;
    font-size: 0.85em;
    background-color: #f1f1f1;
    color: #476582;
    padding: .15em .5em;
    border-radius: 0.25em;
  }
  .content >>> .ProseMirror .ProseMirror-selectednode {
    outline: 1px dashed teal;
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