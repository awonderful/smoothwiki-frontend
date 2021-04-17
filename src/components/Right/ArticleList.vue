<template>
  <div>
    <v-toolbar dense>
      <template v-if="isReadOnly === false">
        <v-btn 
          :key="button.name" 
          v-for="button of buttons"
          small
          icon
          @click="clickButton(button)"
        >
          <v-icon small>{{button.icon}}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
      </template>
    </v-toolbar>
    <v-list class="articles" dense>
      <v-list-item-group
        :ripple = "false"
        ref     = "articleList"
        class   = "article-list-wrapper"
        v-model = "selectedItem"
        color   = "primary">
        <v-list-item
          :class     = "{
            'article':        true,
            'drag-over':      dragAndDrop.status === DND_STATUS.INTERNAL && dragAndDrop.overArticle === article,
            'drag-over-prev': dragAndDrop.status === DND_STATUS.INTERNAL && dragAndDrop.overArticle === article && dragAndDrop.overArea === 'prev',
            'drag-over-next': dragAndDrop.status === DND_STATUS.INTERNAL && dragAndDrop.overArticle === article && dragAndDrop.overArea === 'next'
          }"
          :style     = "{order: article.order}"
          :draggable = "!isReadOnly"
          :ripple    = "false"
          :ref       = "'article_' + article.uniqId" 
          :key       = "article.uniqId"
          @dragstart = "handleDragStart(article, $event)"
          @dragover  = "handleDragOver(article, $event)"
          @dragenter = "handleDragEnter"
          @drop      = "handleDrop"
          @dragend   = "handleDragEnd"
          @click     = "selectArticle(article)"
          v-for      = "article of articleMap">
          <v-list-item-content>
            <v-list-item-title :style="{'text-indent': (article.level * 2) + 'em'}">
              <v-icon>mdi-circle-medium</v-icon> &nbsp;&nbsp; {{article.editingTitle}}
            </v-list-item-title>
          </v-list-item-content>
            <v-list-item-action v-if="article.isEditing === true">
              <v-icon small color="grey lighten-1">mdi-pencil</v-icon>
            </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import SpaceRouteParamsHandling from '@/common/spaceRouteParamsHandling.js'

export default {
  mixins: [ SpaceRouteParamsHandling ],
  computed: {
    isReadOnly () {
      const page = this.$state.page.getPage(this.nodeId)
      
      return page !== undefined
             ? page.isReadOnly
             : true
    },
    articleMap () {
      const page = this.$state.page.getPage(this.nodeId)
      if (page === undefined) {
        return {}
      }

      const articleMap = this.$state.page.getArticleMap(this.nodeId)
      if (articleMap === undefined) {
        return {}
      }

      return articleMap
    }
  },
  data: function() {
    return {
      dragAndDrop: {
        status:      0,
        dragArticle: null,
        overArticle: null,
        overArea:    null,
        isDroppable: false
      },
      DND_STATUS: {    // enum values of dragAndDrop.status
        NONE:     0,   // there is no drag and drop interaction currently
        OUT_OF:   1,   // an article is being dragged outside the list
        INTERNAL: 2,   // an article is being dragged over the list
        INTO:     3    // an external element is being dragged over the list
      },
      selectedItem: null,
      selectedArticle: null,

      buttons: [
        {
          name: 'decIndent',
          tip: this.$t('articleList.buttons.decIndent'),
          icon: 'mdi-arrow-left'
        },
         {
          name: 'incIndent',
          tip: this.$t('articleList.buttons.incIndent'),
          icon: 'mdi-arrow-right'
        },
      ]
    }
  },
  methods: {
    handleDragStart(article, event) {
      this.dragAndDrop.dragArticle = article
      event.dataTransfer.setData('article', JSON.stringify({uniqId: article.uniqId}))
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'all'

      document.body.addEventListener('dragover', this.handleGlobalDragOver)
    },
    handleDragEnd() {
      this.dragAndDrop.status = this.DND_STATUS.NONE
      document.body.removeEventListener('dragover', this.handleGlobalDragOver)
    },
    handleDragOver(article, event) {
      this.dragAndDrop.overArticle = article

      let articleElement = this.getElement(article)
      let articleOffset  = this.getOffset(article)
      let height = articleElement.clientHeight
      let x = event.pageX - articleOffset.left
      let y = event.pageY - articleOffset.top
      this.dragAndDrop.overArea = y < height * 0.5
        ? 'prev'
        : 'next'

      if ( (article === this.dragAndDrop.dragArticle)
        || (article.order === this.dragAndDrop.dragArticle.order - 1 && this.dragAndDrop.overArea === 'next')
        || (article.order === this.dragAndDrop.dragArticle.order + 1 && this.dragAndDrop.overArea === 'prev')) {
        this.dragAndDrop.isDroppable = false
      } else {
        this.dragAndDrop.isDroppable = true
      }
      
      event.preventDefault()
    },
    handleDragEnter(event) {
      event.preventDefault()
    },
    handleGlobalDragOver(event) {
      event.preventDefault()

      if (this.$refs.articleList === undefined) {
        return
      }
      let articleListRect = this.$refs.articleList.$el.getBoundingClientRect()
      if (event.clientX <= articleListRect.left || event.clientX >= articleListRect.right || event.clientY <= articleListRect.top || event.clientY >= articleListRect.bottom) {
        this.dragAndDrop.status = this.dragAndDrop.dragArticle !== null
          ? this.DND_STATUS.OUT_OF
          : this.DND_STATUS.NONE
      } else {
        this.dragAndDrop.status = this.dragAndDrop.dragArticle !== null
          ? this.DND_STATUS.INTERNAL
          : this.DND_STATUS.INTO
      }
    },
    handleDrop() {
      if (this.dragAndDrop.status !== this.DND_STATUS.INTERNAL) {
        return
      }

      const oldOrder = this.dragAndDrop.dragArticle.order
      let newOrder = 0
      if (this.dragAndDrop.overArticle.order < oldOrder && this.dragAndDrop.overArea === 'next') {
        newOrder = this.dragAndDrop.overArticle.order + 1
      } else if (this.dragAndDrop.overArticle.order > oldOrder && this.dragAndDrop.overArea === 'prev') {
        newOrder = this.dragAndDrop.overArticle.order - 1
      } else {
        newOrder = this.dragAndDrop.overArticle.order
      }

      this.$state.pageAction.moveArticle(this.spaceId, this.nodeId, this.dragAndDrop.dragArticle.uniqId, newOrder)
    },
    getElement(article) {
      const ref = 'article_' + article.uniqId

      return this.$refs[ref][0].$el
    },
    getOffset(article) {
      let element = this.getElement(article)
      let clientPos  = element.getBoundingClientRect();

      return {
        left: clientPos.left + window.scrollX,
        top: clientPos.top + window.scrollY
      }
    },
    selectArticle(article) {
      this.selectedArticle = article
      this.$state.page.setPageProps(this.nodeId, {scrollTo: article.uniqId})
    },
    clickButton(button) {
      if (typeof this[button.name] === 'function') {
        this[button.name]()
      }
    },
    decIndent() {
      if (this.selectedArticle !== null && this.selectedArticle.level > 0) {
        this.$state.pageAction.setArticleLevel(this.selectedArticle.spaceId, this.selectedArticle.nodeId, this.selectedArticle.uniqId, this.selectedArticle.level - 1)
      }
    },
    incIndent() {
      if (this.selectedArticle !== null && this.selectedArticle.level < 10) {
        this.$state.pageAction.setArticleLevel(this.selectedArticle.spaceId, this.selectedArticle.nodeId, this.selectedArticle.uniqId, this.selectedArticle.level + 1)
      }
    }
  }
}
</script>

<style scoped>
.article-list-wrapper {
  display: flex;
  flex-direction: column;
}
.article {
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}
.drag-over-prev {
  border-top: 1px solid green;
}
.drag-over-next {
  border-bottom: 1px solid green;
}
</style>
