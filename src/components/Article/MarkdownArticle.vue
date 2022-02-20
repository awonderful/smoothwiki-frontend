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

       <!-- the link dialog -->
        <v-dialog
          v-model="linkDialog.show"
          persistent
          max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ $t('article.markdown.insertLinkDialog.title') }}</span>
              <v-spacer></v-spacer>
              <v-btn icon dense elevation="0" @click="hideLinkDialog()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="linkDialog.title" :placeholder="$t('article.markdown.insertLinkDialog.titlePlaceHolder')" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="linkDialog.url" placeholder="https://" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="hideLinkDialog">{{ $t('article.markdown.insertLinkDialog.cancel') }}</v-btn>
              <v-btn color="blue darken-1" text @click="insertLink()">{{ $t('article.markdown.insertLinkDialog.ok') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- the network image dialog -->
        <v-dialog
          v-model="networkImageDialog.show"
          persistent
          max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline"> {{ $t('article.markdown.insertNetworkImageDialog.title') }} </span>
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
              <v-btn color="blue darken-1" text @click="hideNetworkImageDialog()"> {{ $t('article.markdown.insertNetworkImageDialog.cancel') }} </v-btn>
              <v-btn color="blue darken-1" text @click="insertNetworkImage()"> {{ $t('article.markdown.insertNetworkImageDialog.ok') }} </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- the upload image dialog -->
        <input
          type="file"
          ref="file"
          @change=uploadLocalImage()
          accept="image/*"
          :style="{display: 'none'}" />

        <mavon-editor 
          :boxShadow        = "false"
          :toolbars         = "originalToolbars"
          :toolbarsFlag     = "true"
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
          ref               = "editor">
          <v-toolbar dense class="toolbar elevation-0" slot="left-toolbar-before">
            <template v-for="(item, idx) of menuBarButtons">
              <v-divider
                :key="item.name + idx"
                vertical
                class="divider mx-2"
                v-if="item.name === 'divider'">
              </v-divider>
              <v-spacer :key="item.name + idx" v-else-if="item.name === 'spacer'"/>
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
                        <v-list-item-title>{{ $t('article.markdown.toolbar.insertNetworkImage') }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="showUploadDialog()">
                      <v-list-item-content>
                        <v-list-item-title>{{ $t('article.markdown.toolbar.uploadLocalImage') }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
              <v-tooltip
                bottom
                :key="item.name"
                v-else>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dense
                    small
                    color="white"
                    :key="item.name"
                    :class="[item.name, 'editor-button', 'elevation-0']"
                    @click="clickButton(item)"
                    v-bind="attrs"
                    v-on="on">
                    <v-icon small color="grey darken-1">{{item.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('article.markdown.toolbar.buttonTips.' + item.name)}}</span>
              </v-tooltip>
            </template>
          </v-toolbar>
        </mavon-editor>
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
      originalToolbars: {
        bold:          false,
        italic:        false,
        header:        false,
        underline:     false,
        strikethrough: false,
        mark:          false,
        superscript:   false,
        subscript:     false,
        quote:         false,
        ol:            false,
        ul:            false,
        link:          false,
        imagelink:     false,
        code:          false,
        table:         false,
        undo:          false,
        redo:          false,
        subfield:      false,
        preview:       false
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
      linkDialog: {
        show: false,
        title: '',
        url: ''
      },
      networkImageDialog: {
        show: false,
        url: ''
      },
      menuBarButtons: [
        {
          name:  'undo',
          icon:  'mdi-undo',
          event: 'undo',
          left:  true,
        },
        {
          name:  'redo',
          icon:  'mdi-redo',
          event: 'redo',
          left:  true,
        },
        {
          name:  'divider'
        },
        {
          name:  'bold',
          icon:  'mdi-format-bold',
          event: 'bold',
          left:  true,
        },
        {
          name:  'italic',
          icon:  'mdi-format-italic',
          event: 'italic',
          left:  true,
        },
        {
          name:  'strike',
          icon:  'mdi-format-strikethrough',
          event: 'strikethrough',
          left:  true,
        },
        {
          name:  'underline',
          icon:  'mdi-format-underline',
          event: 'underline',
          left:  true,
        },
        {
          name:  'subscript',
          icon:  'mdi-format-subscript',
          event: 'subscript',
          left:  true,
        },
        {
          name:  'superscript',
          icon:  'mdi-format-superscript',
          event: 'superscript',
          left:  true,
        },
        {
          name:  'mark',
          icon:  'mdi-format-color-highlight',
          event: 'mark',
          left:  true,
        },
        {
          name:  'heading1',
          icon:  'mdi-format-header-1',
          event: 'header1',
          left:  true,
        },
        {
          name:  'heading2',
          icon:  'mdi-format-header-2',
          event: 'header2',
          left:  true,
        },
        {
          name:  'heading3',
          icon:  'mdi-format-header-3',
          event: 'header3',
          left:  true,
        },
        {
          name:  'divider'
        },
        {
          name:  'bulletedList',
          icon:  'mdi-format-list-bulleted',
          event: 'ol',
          left:  true,
        },
        {
          name:  'numberedList',
          icon:  'mdi-format-list-numbered',
          event: 'ul',
          left:  true,
        },
        {
          name:  'quote',
          icon:  'mdi-format-quote-close',
          event: 'quote',
          left:  true,
        },
        {
          name:  'codeBlock',
          icon:  'mdi-code-tags',
          event: 'code',
          left:  true,
        },
        {
          name:  'link',
          icon:  'mdi-link-variant',
          exec:  () => {
            this.showLinkDialog()
          }
        },
        {
          name:  'insertImage'
        },
        {
          name:  'insertTable',
          icon:  'mdi-table-plus',
          event: 'table',
          left:  true,
        },
        {
          name:  'spacer'
        },
        {
          name:  'preview',
          icon:  'mdi-book-open-outline',
          event: 'subfield',
          right: true,
        }
      ]
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
    clickButton (item) {
      if (item.left && item.event) {
        this.$refs.editor.$refs.toolbar_left.$emit('toolbar_left_click', item.event)
      }
      if (item.right && item.event) {
        this.$refs.editor.$refs.toolbar_right.$emit('toolbar_right_click', item.event)
      }
      if (item.exec) {
        item.exec()
      }
    },
    insertText (text) {
      const editor = this.$refs.editor
      editor.insertText(editor.getTextareaDom(), {
        prefix: text,
        subfix: '',
        str: '',
      })
    },
    //--------------------------link-------------------------
    showLinkDialog() {
      this.linkDialog.title = ''
      this.linkDialog.url   = ''
      this.linkDialog.show = true
    },
    hideLinkDialog() {
      this.linkDialog.show = false
    },
    insertLink() {
      this.hideLinkDialog()
      const editor = this.$refs.editor
      this.insertText(`[${this.linkDialog.title}](${this.linkDialog.url})`)
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
      this.insertText(`![](${this.networkImageDialog.url})`)
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
      this.insertText(`![](${url})`)
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
.markdown-editor >>> .v-note-op {
  border-bottom-color: rgba(0, 0, 0, 0.12);
}
.markdown-editor >>> .v-right-item {
  display: none;
}
.editor-button {
  min-width: 2em !important;
}
.divider {
  min-height: 50%;
  position: relative;
  top: 25%;
  align-self: stretch;
  border: solid;
  display: inline-flex;
  height: inherit;
  max-height: 50%;
  max-width: 0;
  width: 0;
  margin: 0 -1px;
  display: block;
  flex: 1 1 0px;
  border-width: 0 thin 0 0;
  transition: inherit;
  border-color: rgba(0, 0, 0, 0.12)
}
</style>