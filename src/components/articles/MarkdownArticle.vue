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
      ref           = "window"
      :class        = "['markdown-article', {'full-screen': isFullScreen}]">
      <template v-slot:editor>

        <!-- the link dialog -->
        <insert-link-dialog
          v-model="linkDialog.show"
          :title.sync="linkDialog.title"
          :url.sync="linkDialog.url"
          @ok="insertLink()"
        />

        <!-- the network image dialog -->
        <insert-network-image-dialog
          v-model="networkImageDialog.show"
          :url.sync="networkImageDialog.url"
          @ok="insertNetworkImage()"
        />

        <!-- the upload image dialog -->
        <input
          type="file"
          ref="file"
          @change=uploadLocalImage()
          accept="image/*"
          :style="{display: 'none'}" />


        <classic-editor-layout
          :isFullScreen="isFullScreen"
          :enableAffixToolbar="article.isEditing && !isFullScreen"
          :containerId="containerId"
          :forceHeight="true">

          <!-- -------------------editor toolbar begins------------------------ -->
          <template v-slot:classic-editor-toolbar>
            <v-toolbar dense class="editor-toolbar elevation-0">
              <template v-for="(item, idx) of toolbarButtons">
                <!-- divider -->
                <v-divider
                  :key="item.name + idx"
                  class="vertical-divider mx-2"
                  vertical
                  v-if="item.name === 'divider'"/>

                <!-- spacer -->
                <v-spacer :key="item.name + idx" v-else-if="item.name === 'spacer'"/>

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
                      class="editor-button elevation-0">
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
                      color="white"
                      :key="item.name"
                      :class="[item.name, 'editor-button', 'elevation-0']"
                      @click="clickToolbarButton(item)"
                      v-bind="attrs"
                      v-on="on">
                      <v-icon small color="grey darken-1">{{typeof item.icon === 'function' ? item.icon() : item.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('article.markdown.toolbar.buttonTips.' + item.name)}}</span>
                </v-tooltip>
              </template>
            </v-toolbar>

            <v-divider/>

          </template>
          <!-- -------------------editor toolbar ends------------------------ -->


          <template v-slot:classic-editor-body>
            <div :class="['editor-body', 'white', {'preview': preview}]">
              <div
                :id="textareaId"
                class="left"
                ref="left">
              </div>
              <div
                class="right show-content pa-2"
                ref="right"
                v-html="html"
                v-show="preview">
              </div> 
            </div>
          </template>

        </classic-editor-layout>
      </template>

      <template v-slot:view>
        <div
          :id="viewerId"
          class="viewer show-content pa-2"
          v-html="html">
        </div>
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
import InsertSymbolBoard, { isValidSymbol } from './widgets/InsertSymbolBoard.vue'
import ClassicEditorLayout from './widgets/ClassicEditorLayout.vue'
import { ATTACHMENT_SHOW_URL } from '@/common/constants.js'
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/addon/runmode/runmode.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import '@/assets/vscode-dark.css'
import MarkdownIt from 'markdown-it'
import sup from 'markdown-it-sup'
import sub from 'markdown-it-sub'
import ins from 'markdown-it-ins'
import br  from 'markdown-it-br'
import mark from 'markdown-it-mark'
import katex from 'markdown-it-katex-external'
import deflist from 'markdown-it-deflist'
import image from 'markdown-it-images-preview'
import emoji from 'markdown-it-emoji'
import linkAttr from 'markdown-it-link-attributes'

const modeImportMap = {
  puppet:       () => import('codemirror/mode/puppet/puppet.js'),
  tcl:          () => import('codemirror/mode/tcl/tcl.js'),
  eiffel:       () => import('codemirror/mode/eiffel/eiffel.js'),
  dylan:        () => import('codemirror/mode/dylan/dylan.js'),
  htmlembedded: () => import('codemirror/mode/htmlembedded/htmlembedded.js'),
  octave:       () => import('codemirror/mode/octave/octave.js'),
  velocity:     () => import('codemirror/mode/velocity/velocity.js'),
  mathematica:  () => import('codemirror/mode/mathematica/mathematica.js'),
  erlang:       () => import('codemirror/mode/erlang/erlang.js'),
  twig:         () => import('codemirror/mode/twig/twig.js'),
  sql:          () => import('codemirror/mode/sql/sql.js'),
  livescript:   () => import('codemirror/mode/livescript/livescript.js'),
  handlebars:   () => import('codemirror/mode/handlebars/handlebars.js'),
  forth:        () => import('codemirror/mode/forth/forth.js'),
  ecl:          () => import('codemirror/mode/ecl/ecl.js'),
  mumps:        () => import('codemirror/mode/mumps/mumps.js'),
  dtd:          () => import('codemirror/mode/dtd/dtd.js'),
  dart:         () => import('codemirror/mode/dart/dart.js'),
  tornado:      () => import('codemirror/mode/tornado/tornado.js'),
  toml:         () => import('codemirror/mode/toml/toml.js'),
  julia:        () => import('codemirror/mode/julia/julia.js'),
  slim:         () => import('codemirror/mode/slim/slim.js'),
  fcl:          () => import('codemirror/mode/fcl/fcl.js'),
  javascript:   () => import('codemirror/mode/javascript/javascript.js'),
  q:            () => import('codemirror/mode/q/q.js'),
  diff:         () => import('codemirror/mode/diff/diff.js'),
  haml:         () => import('codemirror/mode/haml/haml.js'),
  textile:      () => import('codemirror/mode/textile/textile.js'),
  'asn.1':      () => import('codemirror/mode/asn.1/asn.1.js'),
  vhdl:         () => import('codemirror/mode/vhdl/vhdl.js'),
  xml:          () => import('codemirror/mode/xml/xml.js'),
  commonlisp:   () => import('codemirror/mode/commonlisp/commonlisp.js'),
  django:       () => import('codemirror/mode/django/django.js'),
  clike:        () => import('codemirror/mode/clike/clike.js'),
  haxe:         () => import('codemirror/mode/haxe/haxe.js'),
  swift:        () => import('codemirror/mode/swift/swift.js'),
  gfm:          () => import('codemirror/mode/gfm/gfm.js'),
  dockerfile:   () => import('codemirror/mode/dockerfile/dockerfile.js'),
  ttcn:         () => import('codemirror/mode/ttcn/ttcn.js'),
  crystal:      () => import('codemirror/mode/crystal/crystal.js'),
  smarty:       () => import('codemirror/mode/smarty/smarty.js'),
  solr:         () => import('codemirror/mode/solr/solr.js'),
  factor:       () => import('codemirror/mode/factor/factor.js'),
  vue:          () => import('codemirror/mode/vue/vue.js'),
  gherkin:      () => import('codemirror/mode/gherkin/gherkin.js'),
  python:       () => import('codemirror/mode/python/python.js'),
  vbscript:     () => import('codemirror/mode/vbscript/vbscript.js'),
  pascal:       () => import('codemirror/mode/pascal/pascal.js'),
  sass:         () => import('codemirror/mode/sass/sass.js'),
  clojure:      () => import('codemirror/mode/clojure/clojure.js'),
  'yaml-frontmatter': () => import('codemirror/mode/yaml-frontmatter/yaml-frontmatter.js'),
  smalltalk:    () => import('codemirror/mode/smalltalk/smalltalk.js'),
  elm:          () => import('codemirror/mode/elm/elm.js'),
  pug:          () => import('codemirror/mode/pug/pug.js'),
  coffeescript: () => import('codemirror/mode/coffeescript/coffeescript.js'),
  rpm:          () => import('codemirror/mode/rpm/rpm.js'),
  asterisk:     () => import('codemirror/mode/asterisk/asterisk.js'),
  'haskell-literate': () => import('codemirror/mode/haskell-literate/haskell-literate.js'),
  properties:   () => import('codemirror/mode/properties/properties.js'),
  css:          () => import('codemirror/mode/css/css.js'),
  powershell:   () => import('codemirror/mode/powershell/powershell.js'),
  stylus:       () => import('codemirror/mode/stylus/stylus.js'),
  protobuf:     () => import('codemirror/mode/protobuf/protobuf.js'),
  jinja2:       () => import('codemirror/mode/jinja2/jinja2.js'),
  ebnf:         () => import('codemirror/mode/ebnf/ebnf.js'),
  php:          () => import('codemirror/mode/php/php.js'),
  nsis:         () => import('codemirror/mode/nsis/nsis.js'),
  mscgen:       () => import('codemirror/mode/mscgen/mscgen.js'),
  nginx:        () => import('codemirror/mode/nginx/nginx.js'),
  rst:          () => import('codemirror/mode/rst/rst.js'),
  wast:         () => import('codemirror/mode/wast/wast.js'),
  'ttcn-cfg':   () => import('codemirror/mode/ttcn-cfg/ttcn-cfg.js'),
  scheme:       () => import('codemirror/mode/scheme/scheme.js'),
  ruby:         () => import('codemirror/mode/ruby/ruby.js'),
  tiki:         () => import('codemirror/mode/tiki/tiki.js'),
  brainfuck:    () => import('codemirror/mode/brainfuck/brainfuck.js'),
  xquery:       () => import('codemirror/mode/xquery/xquery.js'),
  cobol:        () => import('codemirror/mode/cobol/cobol.js'),
  z80:          () => import('codemirror/mode/z80/z80.js'),
  modelica:     () => import('codemirror/mode/modelica/modelica.js'),
  haskell:      () => import('codemirror/mode/haskell/haskell.js'),
  idl:          () => import('codemirror/mode/idl/idl.js'),
  pegjs:        () => import('codemirror/mode/pegjs/pegjs.js'),
  pegjs:        () => import('codemirror/mode/pegjs/pegjs.js'),
  vb:           () => import('codemirror/mode/vb/vb.js'),
  go:           () => import('codemirror/mode/go/go.js'),
  soy:          () => import('codemirror/mode/soy/soy.js'),
  htmlmixed:    () => import('codemirror/mode/htmlmixed/htmlmixed.js'),
  verilog:      () => import('codemirror/mode/verilog/verilog.js'),
  mirc:         () => import('codemirror/mode/mirc/mirc.js'),
  oz:           () => import('codemirror/mode/oz/oz.js'),
  gas:          () => import('codemirror/mode/gas/gas.js'),
  spreadsheet:  () => import('codemirror/mode/spreadsheet/spreadsheet.js'),
  sparql:       () => import('codemirror/mode/sparql/sparql.js'),
  apl:          () => import('codemirror/mode/apl/apl.js'),
  webidl:       () => import('codemirror/mode/webidl/webidl.js'),
  sas:          () => import('codemirror/mode/sas/sas.js'),
  cypher:       () => import('codemirror/mode/cypher/cypher.js'),
  jsx:          () => import('codemirror/mode/jsx/jsx.js'),
  fortran:      () => import('codemirror/mode/fortran/fortran.js'),
  groovy:       () => import('codemirror/mode/groovy/groovy.js'),
  rust:         () => import('codemirror/mode/rust/rust.js'),
  lua:          () => import('codemirror/mode/lua/lua.js'),
  r:            () => import('codemirror/mode/r/r.js'),
  perl:         () => import('codemirror/mode/perl/perl.js'),
  stex:         () => import('codemirror/mode/stex/stex.js'),
  troff:        () => import('codemirror/mode/troff/troff.js'),
  mbox:         () => import('codemirror/mode/mbox/mbox.js'),
  sieve:        () => import('codemirror/mode/sieve/sieve.js'),
  turtle:       () => import('codemirror/mode/turtle/turtle.js'),
  shell:        () => import('codemirror/mode/shell/shell.js'),
  d:            () => import('codemirror/mode/d/d.js'),
  mllike:       () => import('codemirror/mode/mllike/mllike.js'),
  ntriples:     () => import('codemirror/mode/ntriples/ntriples.js'),
  yacas:        () => import('codemirror/mode/yacas/yacas.js'),
  asciiarmor:   () => import('codemirror/mode/asciiarmor/asciiarmor.js'),
  http:         () => import('codemirror/mode/http/http.js'),
  tiddlywiki:   () => import('codemirror/mode/tiddlywiki/tiddlywiki.js'),
  pig:          () => import('codemirror/mode/pig/pig.js'),
  cmake:        () => import('codemirror/mode/cmake/cmake.js'),
  yaml:         () => import('codemirror/mode/yaml/yaml.js'),
}


export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
    InsertLinkDialog,
    InsertNetworkImageDialog,
    InsertTableBoard,
    InsertSymbolBoard,
    ClassicEditorLayout,
  },
  computed: {
    language () {
      return this.$i18n.locale.replace('_', '-')
    },
    html () {
      this.reRender
      return this.markdown !== null
             ? this.markdown.render(this.article.editingBody)
             : ''
    },
    isEditing () {
      return this.article.isEditing
    }
  },
  data: function () {
    return {
      viewerId: `${this.article.uniqId}_viewer`,
      textareaId: `${this.article.uniqId}_textarea`,
      markdown: null,
      loadingModes: 0,
      reRender: 0,
      preview: true,
      leftScrollTop: 0,
      linkDialog: {
        show: false,
        title: '',
        url: ''
      },
      networkImageDialog: {
        show: false,
        url: ''
      },
      toolbarButtons: [
        {
          name: 'undo',
          icon: 'mdi-undo',
          exec: () => {
            this.codeMirrorEditor.undo()
          },
        },
        {
          name: 'redo',
          icon: 'mdi-redo',
          exec: () => {
            this.codeMirrorEditor.redo()
          },
        },
        {
          name: 'divider'
        },
        {
          name: 'bold',
          icon: 'mdi-format-bold',
          text: '**<-->**',
        },
        {
          name: 'italic',
          icon: 'mdi-format-italic',
          text: '*<-->*'
        },
        {
          name: 'strike',
          icon: 'mdi-format-strikethrough',
          text: '~~<-->~~',
        },
        {
          name: 'underline',
          icon: 'mdi-format-underline',
          text: '++<-->++',
        },
        {
          name: 'subscript',
          icon: 'mdi-format-subscript',
          text: '~<-->~',
        },
        {
          name: 'superscript',
          icon: 'mdi-format-superscript',
          text: '^<-->^',
        },
        {
          name: 'mark',
          icon: 'mdi-format-color-highlight',
          text: '==<-->==',
        },
        {
          name: 'heading1',
          icon: 'mdi-format-header-1',
          text: '# <-->',
        },
        {
          name: 'heading2',
          icon: 'mdi-format-header-2',
          text: '## <-->',
        },
        {
          name: 'heading3',
          icon: 'mdi-format-header-3',
          text: '### <-->',
        },
        {
          name:  'divider'
        },
        {
          name: 'bulletedList',
          icon: 'mdi-format-list-bulleted',
          text: '- <-->',
        },
        {
          name: 'numberedList',
          icon: 'mdi-format-list-numbered',
          text: '1. <-->',
        },
        {
          name: 'quote',
          icon: 'mdi-format-quote-close',
          text: '> <-->',
        },
        {
          name: 'codeBlock',
          icon: 'mdi-code-tags',
          text: '```language\n<-->\n```',
        },
        {
          name: 'link',
          icon: 'mdi-link-variant',
          exec: () => {
            this.showLinkDialog()
          }
        },
        {
          name: 'insertImage',
          icon: 'mdi-image',
        },
        {
          name: 'insertSymbol',
          icon: 'mdi-copyright',
        },
        {
          name: 'horizontalRule',
          icon: 'mdi-minus',
          text: '---\n',
        },
        {
          name: 'insertTable',
          icon: 'mdi-table-plus',
        },
        {
          name:  'spacer'
        },
        {
          name: 'preview',
          icon: () => {
            return this.preview
                   ? 'mdi-eye-off-outline'
                   : 'mdi-eye-outline'
          },
          exec: () => {
            this.preview = !this.preview
          }
        }
      ]
    }
  },
  created () {
    this.markdown = new MarkdownIt({
      breaks: true,
      highlight: function (str, lang) {
        const mode = CodeMirror.findModeByName(lang) || CodeMirror.findModeByExtension(lang)
        const mime = mode && mode.mime
                  ? mode.mime
                  : 'text/plain'

        if (lang && mode && !CodeMirror.modes[mode.mode] && modeImportMap[mode.mode]) {
          this.loadingModes += 1
          modeImportMap[mode.mode]().then(() => {
            this.loadingModes -= 1
          })
        }

        const el = document.createElement('div')
        CodeMirror.runMode(str, mime, el)
        return `<pre class="cm-s-vscode-dark">${el.outerHTML}</pre>`;
      }.bind(this)
    })
    .use(linkAttr, {
      attrs: {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      }
    })
    .use(sup)
    .use(sub)
    .use(ins)
    .use(br)
    .use(mark)
    .use(katex)
    .use(deflist)
    .use(image)
    .use(emoji)

    this.markdown.renderer.rules.emoji = function(token, idx) {
      const symbol = token[idx].markup
      return isValidSymbol(symbol)
            ? `<img class="emoji" src="/symbol/${token[idx].markup}.png">`
            : `:${symbol}:`
    }

  },
  watch: {
    isEditing: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.$nextTick(function(){
            this.codeMirrorEditor = CodeMirror(document.getElementById(this.textareaId), {
              mode: 'markdown',
              lineNumbers: true,
              lineWrapping: true,
              scrollbarStyle: 'overlay',
              value: this.article.editingBody,
            })
            this.codeMirrorEditor.setSize('100%', '100%')
            this.codeMirrorEditor.on('change', function () {
              this.article.editingBody = this.codeMirrorEditor.getValue()
            }.bind(this))
            this.codeMirrorEditor.on('scroll', function () {
              const leftScrollInfo = this.codeMirrorEditor.getScrollInfo()
              const leftScrollOffset = leftScrollInfo.top - this.leftScrollTop
              const rightScrollHeight = this.$refs.right.scrollHeight
              const rightScrollTop = this.$refs.right.scrollTop
              this.$refs.right.scrollTop = rightScrollTop + (rightScrollHeight * leftScrollOffset / leftScrollInfo.height)
              this.leftScrollTop = leftScrollInfo.top
            }.bind(this))
            this.codeMirrorEditor.on('paste', function (instance, event) {
              if(event.clipboardData && event.clipboardData.items) {
                for (const item of event.clipboardData.items) {
                  if (item.type.indexOf("image") >= 0) {
                    const file = item.getAsFile();
                    this.addImage(file)
                  }
                }
              }
            }.bind(this))
          }.bind(this))
        }
      }
    },
    loadingModes (val) {
      if (val === 0) {
        setTimeout(function() {
          this.reRender += 1
          if (this.article.isEditing) {
            this.codeMirrorEditor.setOption('mode', 'markdown')
          }
        }.bind(this), 100)
      }
    },
    isFullScreen (val) {
      if (val && this.article.isEditing) {
        this.$nextTick(() => {
          this.codeMirrorEditor.setSize('100%', '100%')
        })
      } else if (!val && this.article.isEditing) {
        this.$nextTick(() => {
          this.codeMirrorEditor.setSize('100%', 'auto')
        })
      }
    }
  },
  methods: {
    async addImage(file) {
      const res = await this.$state.pageAction.addAttachmentToArticle(this.article.spaceId, this.article.nodeId, this.article.uniqId, file)
      const url = ATTACHMENT_SHOW_URL + res.data.data.id
      this.insertText(`![](${url})`)
    },
    getEditingSearch() {
      return this.$refs.right.innerText
    },
    clickToolbarButton (item) {
      const selection = this.codeMirrorEditor.getSelection()
      if (item.text) {
        const text = item.text.replace('<-->', selection)
        this.codeMirrorEditor.replaceSelection(text)
        this.codeMirrorEditor.focus()
        if (!selection && item.text.includes('<-->')) {
          const backCh = item.text.length - item.text.indexOf('<-->') - 4
          const cursor = this.codeMirrorEditor.getCursor()
          if (cursor.ch >= backCh) {
            this.codeMirrorEditor.setCursor(cursor.line, cursor.ch - backCh)
          } else if (cursor.line > 0) {
            this.codeMirrorEditor.setCursor(cursor.line - 1, 0)
          }
        }
        return
      }

      if (item.exec && typeof item.exec === 'function') {
        item.exec()
      }
    },
    insertText (text) {
      const selection = this.codeMirrorEditor.getSelection()
      this.codeMirrorEditor.replaceSelection(selection + text)
      this.codeMirrorEditor.focus()
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
      this.codeMirrorEditor.focus()
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
      this.codeMirrorEditor.focus()
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
      this.codeMirrorEditor.focus()
    },

    //-------------------------------table------------------------------
    insertTable(row, col) {
      const rows = []
      rows.push('|' + ' |'.repeat(col))
      rows.push('|' + '-|'.repeat(col))
      for (let i=0; i<row; i++) {
        rows.push('|' + ' |'.repeat(col))
      }
      const text = rows.join('\n') + '\n'
      this.insertText(text)
      this.codeMirrorEditor.focus()
    },

    //-------------------------------symbol------------------------------
    insertSymbol(symbol) {
      this.insertText(`:${symbol}:`)
    }
  }
}
</script>

<style scoped>

.viewer {
  width: 100%;
  height: auto;
}

.editor-body {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  min-height: 30em;
}

.editor-body .left {
  width: 100%;
  height: 100%;
}

.editor-body.preview .left {
  width: 50%;
  height: 100%;
}

.editor-body.preview .right {
  width: 50%;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  scrollbar-width: thin;
  height: 100%;
  overflow-y: auto;
}

.editor-body >>> .CodeMirror-overlayscroll-vertical {
  background-color: #eff0f1;
  width: 12px;
}

.editor-body >>> .CodeMirror-overlayscroll-vertical > div {
  background-color: #3daee9;
  width: 6px;
  left: 4px;
}

.editor-body >>> .CodeMirror-sizer {
  padding-right: 12px !important;
}

.editor-body .right::-webkit-scrollbar-track
{
	background-color: #eff0f1;
}

.editor-body .right::-webkit-scrollbar
{
	width: 10px;
	background-color: #eff0f1;
}

.editor-body .right::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	background-color: #3daee9;
}

.full-screen .editor-body {
  height: 100%;
  overflow: hidden;
}

.full-screen .editor-body .left, .full-screen .editor-body .right {
  height: 100%;
}

.full-screen .editor-body .right {
  overflow-y: scroll;
}

.show-content {
  font-size: 16px;
  letter-spacing: 0.2px;
}

.show-content >>> table {
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

.show-content >>> table th {
  background-color: #eaf3f3;
  color: teal;
  font-weight: bold;
  text-align: left;
}

.show-content >>> td, .show-content >>> th {
  padding: 0.5em 1em;
  border: 0;
}

.show-content >>> tr:nth-child(2n) {
  background-color: #0000000d;
}

.show-content >>> tr td:not(:last-child) {
  border-right: 1px solid lightgray;
}

.show-content >>> tr th:not(:last-child) {
  border-right: 1px solid lightgray;
}

.show-content >>> tr:hover td {
  background-color: #eaf3f3;
}

.show-content >>> img {
  max-width: 100%;
}

.show-content >>> img.emoji {
  display: inline;
  border: 0;
  width: 1em;
  height: 1em;
  padding: 0;
  margin: 0;
}

.show-content >>> pre {
  font-family: 'Droid Sans Mono', 'monospace', monospace;
  padding: 1em 1.5em;
  overflow: auto;
  font-size: 0.85em;
  line-height: 1.45em;
  background-color: #1e1e1e;
  border-radius: 0.45em;
  margin: 1.75em 0;
  color: #e9e9e9;
}

.show-content >>> :not(pre) > code {
  font-family: 'Droid Sans Mono', 'monospace', monospace;
  font-size: 0.85em;
  background-color: #f1f1f1;
  color: #476582;
  padding: .15em .5em;
  border-radius: 0.25em;
}

.show-content >>> a {
  color: teal;
  font-weight: 600;
  text-decoration: none;
}

.show-content >>> a:hover {
  text-decoration: underline;
}

.show-content >>> a > code {
  color: #476582;
  text-decoration: none;
}

.show-content >>> p {
  line-height: 1.6em;
  letter-spacing: 0.2px;
}

.show-content >>> strong {
  color: saddlebrown;
  font-weight: bold;
}

.show-content >>> mark {
  padding: 0.15em 0.5em;
}

.show-content >>> blockquote {
  margin: 2em 0;
  padding-left: 20px;
  border-left: 4px solid teal;
}

.show-content >>> h1 {
  margin: 0 0 3rem;
  font-size: 2.4em;
  line-height: 1.4em;
  font-weight: 600;
}

.show-content >>> h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 2.8em 0 0.8em;
  padding-bottom: 0.7em;
  border-bottom: 1px solid #ddd;
}

.show-content >>> h3 {
  font-size: 1.2em;
  font-weight: 600;
  margin: 3rem 0 1.25rem 0;
}

.show-content >>> h4 {
  font-size: 1em;
  margin: 1em 0;
}

.show-content >>> h5 {
  font-size: 0.85em;
  margin: 1em 0;
}

.show-content >>> h6 {
  font-size: 0.7em;
  margin: 1em 0;
}

.editor-button {
  min-width: 2em !important;
}

.vertical-divider {
  min-height: 50%;
  max-height: 50%;
  position: relative;
  top: 25%;
}
</style>