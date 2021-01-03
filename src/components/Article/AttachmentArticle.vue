<template>
  <div>
    <file-upload
       v-model      = "uploadingFiles"
      class         = "uploader"
      @input-filter = "inputFilter"
      @input-file   = "inputFile"
      :post-action  = "uploadUrl"
      :data         = "postData"
      :input-id     = "inputId"
      :thread       = "5"
      :multiple     = "true"
      ref           = "uploader">
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
        <ul class="attachments">
          <li class="item" :key="attachment.id" v-for="attachment of attachments">
            <span class="thumb">{{attachment.icon}}</span>
            <span class="atitle">{{attachment.title}}</span>
            <span class="time">2020-12-08 01:01:01</span>
            <span class="size">{{humanFileSize(attachment.size)}}</span>
            <span class="operate"><v-btn icon dense small><v-icon small>mdi-download</v-icon></v-btn></span>
          </li>
          <li class="item" :key="file.id" v-for="file of uploadingFiles">
            <div class="progress" :style="{width: file.progress + '%'}">
            </div>
            <span class="thumb"> <img v-if="file.thumb" :src="file.thumb" /></span>
            <span class="atitle">{{file.name}}</span>
            <span class="status"></span>
            <span class="size">{{humanFileSize(file.size)}}</span>
            <span class="operate"><v-btn icon dense small><v-icon small>mdi-pause</v-icon></v-btn></span>
          </li>
        </ul>
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
import { API_BASE_URL } from '@/common/constants.js'

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
      uploadUrl: `${API_BASE_URL}/api/attachment/upload`,
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
      postData: {
        spaceId: this.article.spaceId,
        nodeId:  this.article.nodeId
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
    },
    inputFilter(newFile, oldFile, prevent) {
      console.log(this.uploadingFiles)
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },
    inputFile(newFile, oldFile) {
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        this.$refs.uploader.active = true
      }
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
    position: relative;
  }
  .attachments .item {
    position: relative;
    border-bottom: 1px solid lightgray;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-height: 2em;
  }
  .attachments .item:nth-child(odd) {
    background-color: #fafafa;
  }
  .attachments .item:hover {
    background-color: #e7f4f9;
  }
  .attachments .progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 0;
    background-color: #bae7ff;
  }
  .attachments span {
    padding: 0.2em;
    text-align: left;
    flex-grow: 0;
    z-index: 1;
  }
  .attachments .thumb {
    width: 7em;
  }
  .attachments .thumb img {
    width: auto;
    max-width: 5em;
    max-height: 3em;
    vertical-align: middle;
  }
  .attachments .atitle {
    padding-left: 1em;
    flex-grow: 1;
  }
  .attachments .time {
    width: 20em;
    color: gray;
  }
  .attachments .size {
    width: 10em;
  }
  .attachments .operate {
    width: 10em;
  }
</style>