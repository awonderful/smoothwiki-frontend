<template>
  <div>
    <file-upload
      class="uploader"
      :headers="headers"
      :data="data"
      :input-id="inputId"
      v-model="uploadingFiles"
      ref="uploader">
    </file-upload>
    <article-window
      :isReadOnly   = "article.isReadOnly"
      :isEditing    = "article.isEditing"
      :isFreshNew   = "article.id === 0"
      :isFullScreen = "article.isFullScreen"
      :title.sync   = "editingTitle"
      :extraButtons = "extraButtons"
      @clickButton  = "clickButton"
      ref           = "window">
      <template v-slot:editor>
      </template>
      <template v-slot:view>
        <table class="attachments">
          <tr :key="attachment.id" v-for="attachment of attachments">
            <td class="atitle">{{attachment.title}}</td>
            <td class="size">{{humanFileSize(attachment.size)}}</td>
            <td class="operate"><v-btn icon dense small><v-icon small>mdi-download</v-icon></v-btn></td>
          </tr>
        </table>
        <div class="uploader-outer" v-if="body.items.length === 0">
          <label :for="inputId">
            <div class="uploader-inner">
              <v-icon x-large>mdi-upload</v-icon>
              <br>
              点击上传或者将文件拖放到这儿
            </div>
          </label>
        </div>
      </template>
    </article-window>
  </div>
</template>

<script>
import BaseArticle from './BaseArticle'
import ArticleWindow from './ArticleWindow'
import FileUpload from 'vue-upload-component'
import { humanFileSize } from '@/common/util.js'

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
    FileUpload
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
    },
    extraButtons () {
      if (this.article.isReadOnly || this.article.isEditing) {
        return []
      }

      return [
        {
          name:  'upload',
          title: 'upload',
          icon:  'mdi-upload'
        }
      ]
    }
  },
  data: function () {
    return {
      body: JSON.parse(this.article.body),
      attachments: [
        {
          id: 335,
          filename: '你好.doc',
          ext: 'doc',
          size: 1022333,
          title: 'a.doc'
        },
        {
          id: 336,
          filename: '你好.doc',
          ext: 'doc',
          size: 1022333,
          title: 'a.doc'
        },
        {
          id: 337,
          filename: '你好.doc',
          ext: 'doc',
          size: 1022333,
          title: 'a.doc'
        }
      ],
      inputId: 'input_' + this.article.uniqId,
      headers: {
        'X-Csrf-Token': 'xxxx',
      },
      data: {
        '_csrf_token': 'xxxxxx',
      },
      uploadingFiles: []
    }
  },
  methods: {
    humanFileSize (bytes) {
      return humanFileSize(bytes, true, 1)
    },
    upload() {
      const input = document.getElementById(this.inputId)
      input.focus()
      input.click()
    }
  }
}
</script>

<style scoped>
  .uploader {
    display: none;
  }
  .uploader-outer {
    width: 100%;
    height: 10em;
    margin: 0;
    padding: 1em;
    box-sizing: border-box;
  }
  .uploader-inner {
    width: 100%;
    height: 100%;
    border: 2px dashed gray;
    border-radius: 5px;
    color: gray;
    font-size: 1.5em;
    line-height: 100%;
    background-color: whitesmoke;
    box-sizing: border-box;
    padding-top: 1em;
  }
  .attachments {
    width: calc(100% - 2em);
    margin: 1em;
    border-collapse: collapse;
    font-family: "Microsoft YaHei", sans-serif;
  }
  .attachments tr:nth-child(odd) {
    background-color: #fafafa;
  }
  .attachments tr:hover {
    background-color: #e7f4f9;
  }
  .attachments td {
    padding: 0.2em;
    height: 2em;
    text-align: left;
    border-bottom: 1px solid #e7e7e7;
  }
  .attachments .atitle {
    padding-left: 1em;
    width: 75%;
  }
  .attachments .size {
    width: 10%;
  }
  .attachments .operate {
    width: 15%;
  }
</style>