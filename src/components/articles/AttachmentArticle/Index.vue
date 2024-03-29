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
      :chunk-enabled= "true"
      :chunk        = "{
        action: uploadChunkUrl,
        minSize: 1 * 1048576,
        maxActive: 1,
        maxRetries: 3,
        startBody:  postData,
        uploadBody: postData,
        finishBody: postData,
        xsrfTokenFunc: getXsrfToken,
        handler: ChunkUploadHandler,
      }"
      ref           = "uploader">
    </file-upload>
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
      ref           = "window">
      <template v-slot:editor>
        <ul class="attachments">
          <li class="item" :key="attachment.id" v-for="attachment of editingBody.items">
            <span class="thumb"><img v-if="attachment.icon !== null" :src="attachment.icon" ></span>
            <span class="filename"><input type="text" v-model="attachment.filename"/></span>
            <span class="time">{{ new Date(attachment.ctime).toLocaleDateString(locale) }}</span>
            <span class="size">{{ attachmentMap.hasOwnProperty(attachment.id) ? humanFileSize(attachmentMap[attachment.id].size) : ''}}</span>
            <span class="operate">
              <v-btn icon dense small @click="removeAttachment(attachment.id)"><v-icon small>{{mdiDeleteOutline}}</v-icon></v-btn>
            </span>
          </li>
        </ul>
      </template>
      <template v-slot:view>
        <ul class="attachments">
          <li class="item" :key="attachment.id" v-for="attachment of items">
            <span class="thumb">
              <img v-if="attachment.icon !== null" :src="attachment.icon" >
            </span>
            <span class="filename">{{attachment.filename}}</span>
            <span class="time">{{ new Date(attachment.ctime).toLocaleDateString(locale) }}</span>
            <span class="size">{{ humanFileSize(attachment.size) }}</span>
            <span class="operate">
              <a :href="ATTACHMENT_DOWNLOAD_URL + attachment.id">
                <v-btn icon dense small><v-icon>{{mdiDownload}}</v-icon></v-btn>
              </a>
            </span>
          </li>
          <li class="item" :key="file.id" v-for="file of uploadingFiles">
            <div class="progress" :style="{width: file.progress + '%'}">
            </div>
            <span class="thumb"> <img v-if="file.thumb" :src="file.thumb" /></span>
            <span class="filename">{{file.name}}</span>
            <span class="status"></span>
            <span class="size">{{humanFileSize(file.size)}}</span>
            <span class="operate"><v-btn icon dense small><v-icon small>{{mdiPause}}</v-icon></v-btn></span>
          </li>
        </ul>
      </template>
    </article-window>
  </div>
</template>

<script>
import BaseArticle from '@/components/articles/BaseArticle.vue'
import ArticleWindow from '@/components/articles/ArticleWindow.vue'
import ChunkUploadHandler from './ChunkUploadHandler.js'
import FileUpload from 'vue-upload-component'
import { humanFileSize, isImageExtension } from '@/common/util.js'
import { API_BASE_URL, ATTACHMENT_DOWNLOAD_URL, ATTACHMENT_SHOW_URL, ATTACHMENT_THUMB_100_URL } from '@/common/constants.js'
import * as API from '@/common/API.js'
import {
  mdiDeleteOutline,
  mdiDownload,
  mdiPause,
  mdiUpload,
} from '@mdi/js'

export default {
  mixins: [BaseArticle],
  components: {
    ArticleWindow,
    FileUpload
  },
  computed: {
    defaultButtons () {
      const fullscreenSwitcher = this.isFullScreen
        ? 'exitFullscreen'
        : 'fullscreen'

      const upload = {
          name:  'upload',
          title: 'upload',
          icon:  mdiUpload,
          tip:   this.$t('article.attachment.uploadButtonTip')
      }

      if (this.article.isEditing && this.isFreshNew) {
        return [fullscreenSwitcher, 'save', 'remove']
      }

      if (this.article.isEditing && !this.isFreshNew) {
        return [fullscreenSwitcher, 'save', 'exit']
      }

      if (!this.article.isEditing && !this.article.isReadOnly) {
        return [upload, fullscreenSwitcher, 'edit', 'remove']
      }

      if (!this.article.isEditing && this.article.isReadOnly) {
        return [fullscreenSwitcher]
      }

      return []
    },
    postData() {
      return {
        spaceId:   this.article.spaceId,
        nodeId:    this.article.nodeId,
        articleId: this.article.id
      }
    },
    items() {
      const items = this.editingBody.items

      for (const item of items) {
        if (this.attachmentMap[item.id] !== undefined) {
          item.extension = this.attachmentMap[item.id].extension
          item.size = this.attachmentMap[item.id].size
          item.ctime = this.attachmentMap[item.id].ctime
        }

        item.icon = this.getAttachmentIcon(item)
      }

      return items
    },
    locale () {
      return this.$i18n.locale.replace('_', '-')
    }
  },
  watch: {
    article: {
      handler: function(newVal) {
        this.editingBody = JSON.parse(newVal.editingBody)
      },
      immediate: true
    }
  },
  data: function () {
    return {
      mdiDeleteOutline,
      mdiDownload,
      mdiPause,

      uploadUrl: `${API_BASE_URL}/api/attachment/upload`,
      uploadChunkUrl: `${API_BASE_URL}/api/attachment/upload/chunk`,
      editingBody: {items:[]},
      uploadedAttachmentMap: {},
      otherAttachmentMap: {},
      attachmentMap: {},
      inputId: 'input_' + this.article.uniqId,
      uploadingFiles: [],

      ChunkUploadHandler: ChunkUploadHandler,
      ATTACHMENT_DOWNLOAD_URL: ATTACHMENT_DOWNLOAD_URL,
      ATTACHMENT_SHOW_URL: ATTACHMENT_SHOW_URL,
      ATTACHMENT_THUMB_100_URL: ATTACHMENT_THUMB_100_URL,
    }
  },
  methods: {
    getEditingBody() {
      let items = []

      for (const attachment of this.editingBody.items) {
        items.push({
          id: attachment.id,
          filename: attachment.filename
        })
      }

      for (const attachment of this.uploadingFiles) {
        if (attachment.success === true) {
          const attachmentId = attachment.chunk !== undefined && attachment.chunk.sessionId !== undefined
                            ? attachment.chunk.sessionId
                            : attachment.response.data.id
          items.push({
            id: attachmentId,
            filename: attachment.name
          })
        }
      }

      return JSON.stringify({
        items: items
      })
    },
    getEditingSearch() {
      let items = []

      for (const attachment of this.editingBody.items) {
        items.push(attachment.filename)
      }

      for (const attachment of this.uploadingFiles) {
        if (attachment.success === true) {
          items.push(attachment.name)
        }
      }

      return items.join(' ')     
    },
    humanFileSize (bytes) {
      return humanFileSize(bytes, true, 1)
    },
    upload() {
      this.$refs.uploader.headers = Object.assign(
        this.$refs.uploader.headers,
        {
          'X-XSRF-TOKEN': this.getXsrfToken()
        }
      )
      const input = document.getElementById(this.inputId)
      input.focus()
      input.click()
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && newFile.xhr && !newFile.xhr.withCredentials) {
          newFile.xhr.withCredentials = true
      }

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

      //有附件上传成功
      if (newFile !== undefined && newFile.success) {
        //所有文件上传完毕
        if (this.$refs.uploader.uploaded) {
          (async function() {
            await this.refresh()
            await this.save()
            this.$refs.uploader.clear()
            await this.getAttachmentMap()
            await this.refresh()
          }.bind(this))()
        }
      }
    },
    async getUploadedAttachmentMap() {
      const res = await API.getArticleAttachments({
        spaceId:   this.article.spaceId,
        nodeId:    this.article.nodeId,
        articleId: this.article.id
      })
      const attachments = res.data.data.attachments
      const map = {}

      for (const attachment of attachments) {
        map[attachment.id] = attachment
      }
      this.uploadedAttachmentMap = map
    },
    async getOtherAttachmentMap() {
      const attachmentIds = []
      for (const item of this.items) {
        if (!this.uploadedAttachmentMap.hasOwnProperty(item.id)) {
          attachmentIds.push(item.id);
        }
      }

      if (attachmentIds.length > 0) {
        const res = await API.getAttachmentsByIds({
          spaceId:   this.article.spaceId,
          attachmentIds: attachmentIds.join(',')
        })
        const attachments = res.data.data.attachments
        const map = {}
        for (const attachment of attachments) {
          map[attachment.id] = attachment
        }
        this.otherAttachmentMap = map
      }
    },
    async getAttachmentMap() {
      await this.getUploadedAttachmentMap()
      await this.getOtherAttachmentMap()

      const map = {}
      for (const id in this.uploadedAttachmentMap) {
        map[id] = this.uploadedAttachmentMap[id]
      }
      for (const id in this.otherAttachmentMap) {
        map[id] = this.otherAttachmentMap[id]
      }
      this.attachmentMap = map
    },
    removeAttachment(attachmentId) {
      for (let i=0; i<this.editingBody.items.length; i++) {
        const attachment = this.editingBody.items[i]
        if (attachment.id === attachmentId) {
          this.editingBody.items.splice(i, 1)
          break
        }
      }
    },
    getAttachmentIcon(attachment) {
      if (isImageExtension(attachment.extension)) {
        return attachment.size < 1 * 1024 * 1024
          ? this.ATTACHMENT_SHOW_URL + attachment.id
          : this.ATTACHMENT_THUMB_100_URL + attachment.id
      }

      return null
    },
    getXsrfToken() {
      return this.$cookies.get('XSRF-TOKEN');
    }
  },
  mounted() {
    if (this.article.id === 0 && this.items.length === 0) {
      this.save()
    } else {
      this.getAttachmentMap()
    }
  }
}
</script>

<style scoped>
  .uploader {
    display: none;
  }
  .upload-area-outer {
    width: 100%;
    height: 10em;
    margin: 0;
    padding: 1em;
    box-sizing: border-box;
  }
  .upload-area-inner {
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
    text-align: center;
  }
  .attachments {
    width: calc(100% - 2em);
    margin: 1em;
    border-collapse: collapse;
    font-family: "Microsoft YaHei", sans-serif;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 0;
  }
  .attachments .item {
    position: relative;
    min-height: 2em;
    list-style: none;
    height: 3em;
    width: 100%;
    border-bottom: 1px solid lightgray;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
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
    z-index: 1;
  }
  .attachments .thumb {
    width: 5em;
  }
  .attachments .thumb img {
    width: auto;
    max-width: 4em;
    max-height: 3em;
    vertical-align: middle;
  }
  .attachments .filename {
    flex-grow: 100;
    flex-shrink: 100;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .attachments .filename input {
    border: 2px solid #c4c7ce;
    border-radius: 3px;
    outline: 0;
    width: 100%;
  }
  .attachments .filename input:focus {
    border-color: #009688;
  }
  .attachments .filename input:hover {
    border-color: #009688;
  }
  .attachments .time {
    width: 8em;
    color: gray;
  }
  .attachments .size {
    width: 7em;
  }
  .attachments .operate {
    width: 5em;
    text-align: center;
  }
  .attachments .operate a {
    text-decoration: none;
  }

  @media only screen and (min-width: 650px) and (max-width: 800px) {
    .attachments .operate {
      width: 3em;
    }

    .attachments .size {
      width: 5em;
    }

    .attachments .time {
      width: 6em;
    }
  }

  @media only screen and (min-width: 320px) and (max-width: 650px) {
    .attachments .item {
      display: block;
      width: 100%;
      height: 4em;
      position: relative;
    }

    .attachments .thumb {
      height: 4em;
      width: 4em;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .attachments .thumb img {
      width: 4em;
      height: 4em;
      object-fit: cover;
    }

    .attachments .filename {
      width: calc(100% - 5em);
      height: 2em;
      position: absolute;
      left: 5em;
      top: 0;
      white-space: nowrap;
    }

    .attachments .time {
      position: absolute;
      left: 5em;
      top: 2em;
    }

    .attachments .size {
      position: absolute;
      right: 2em;
      top: 2em;
      width: auto;
    }

    .attachments .operate {
      position: absolute;
      right: 0;
      top: 2em;
      width: auto;
    }
  }
</style>