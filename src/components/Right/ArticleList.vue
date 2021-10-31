<template>
  <div class="d-flex flex-column wrapper">
    <v-toolbar 
      dense 
      class="flex-grow-0"
      :dark="$state.theme.top.dark"
      :color="$state.theme.top.bgColor"
    >
      <v-tooltip
        bottom
        v-for = "button of buttons"
        :key  = "button.name" 
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            @click = "clickButton(button)"
            v-bind = "attrs"
            v-on   = "on"
            small
            icon
          >
            <v-icon small>{{button.icon}}</v-icon>
          </v-btn>
        </template>
        <span>{{button.tip}}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <!--menu-->
      <v-menu open-on-hover bottom offset-y close-delay="300">
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            small 
            icon 
            v-bind="attrs" 
            v-on="on" 
            class="button"
          >
            <v-icon small>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :key="item.name" v-for="item in menuItems" @click="clickMenu(item)">
            <v-list-item-icon><v-icon small>{{item.icon}}</v-icon></v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-toolbar>

    <div class="flex-grow-1 scroll-area" :style="{'background-color': $state.theme.right.bgColor}">
      <v-list class="articles" dense>
        <v-list-item-group
          :ripple   = "false"
          ref       = "articleList"
          class     = "article-list-wrapper"
          v-model   = "selectedUniqIds"
          color     = "primary"
          multiple
        >
          <v-list-item
            :class     = "{
              'article':        true,
              'drag-over':      dragAndDrop.status === DND_STATUS.INTERNAL && dragAndDrop.overArticle === article,
              'drag-over-prev': dragAndDrop.status === DND_STATUS.INTERNAL && dragAndDrop.overArticle === article && dragAndDrop.overArea === 'prev',
              'drag-over-next': dragAndDrop.status === DND_STATUS.INTERNAL && dragAndDrop.overArticle === article && dragAndDrop.overArea === 'next'
            }"
            :style      = "{order: article.order}"
            :draggable  = "!isReadOnly"
            :ripple     = "false"
            :ref        = "'article_' + article.uniqId" 
            :key        = "article.uniqId"
            :value      = "article.uniqId"
            @dragstart  = "handleDragStart(article, $event)"
            @dragover   = "handleDragOver(article, $event)"
            @dragenter  = "handleDragEnter"
            @drop       = "handleDrop"
            @dragend    = "handleDragEnd"
            @click      = "clickItem(article, $event)"
            v-for       = "article of articleMap"
          >
            <v-list-item-content>
              <v-list-item-title :style="{'text-indent': (article.level * 2) + 'em'}">
                <v-icon>mdi-circle-small</v-icon> &nbsp;&nbsp; {{article.editingTitle}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>

    <trash-dialog
      v-model="showTrashDialog"
      :spaceId="this.spaceId"
      :nodeId="this.nodeId"
    />
  </div>
</template>

<script>
import SpaceRouteParamsHandling from '@/common/spaceRouteParamsHandling.js'
import TrashDialog from '../Dialog/TrashDialog.vue'

export default {
  components: { TrashDialog },
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
    },
    buttons () {
      const buttons = []

      //a read only page
      if (this.isReadOnly === true) {
        if (this.selectedUniqIds.length > 0) {
          buttons.push(this.buttonMap.copy)
        }
        return buttons
      }

      //a writable page
      if (this.selectedUniqIds.length > 0) {
        buttons.push(this.buttonMap.decIndent)
        buttons.push(this.buttonMap.incIndent)
        buttons.push(this.buttonMap.copy)
        buttons.push(this.buttonMap.cut)
      }

      if (this.$state.clipboard.hasAnArticle === true) {
        buttons.push(this.buttonMap.paste)
      }

      return buttons
    },
    menuItems () {
      if (this.category !== 'trash') {
        return [this.menuItemMap.trash]
      }

      return []
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
      selectedUniqIds: [],
      lastSelectedArticle: null,
      showTrashDialog: false,

      buttonMap: {
        copy: {
          name: 'copy',
          tip: this.$t('articleList.buttons.copy'),
          icon: 'mdi-content-copy'
        },
        cut: {
          name: 'cut',
          tip: this.$t('articleList.buttons.cut'),
          icon: 'mdi-content-cut'
        },
        paste: {
          name: 'paste',
          tip: this.$t('articleList.buttons.paste'),
          icon: 'mdi-content-paste'
        },
        decIndent: {
          name: 'decIndent',
          tip: this.$t('articleList.buttons.decIndent'),
          icon: 'mdi-arrow-left'
        },
        incIndent: {
          name: 'incIndent',
          tip: this.$t('articleList.buttons.incIndent'),
          icon: 'mdi-arrow-right'
        }
      },

      menuItemMap: {
        trash: {
          name:  'trash',
          title: this.$t('articleList.menus.trash'),
          icon:  'mdi-trash-can-outline',
        },
        exportPdf: {
          name:  'exportPdf',
          title: this.$t('articleList.menus.exportPdf'),
          icon:  'mdi-file-pdf-box',
        }
      }
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
    clickButton(button) {
      if (typeof this[button.name] === 'function') {
        this[button.name]()
      }
    },
    clickCheckbox(article) {
      if (this.checkedUniqIds.includes(article.uniqId)) {
        this.selectedUniqIds.splice(0, this.selectedUniqIds.length, ...this.checkedUniqIds)

      } else {
        for (let i=this.selectedUniqIds.length-1; i>=0; i--) {
          if (this.selectedUniqIds[i] === article.uniqId) {
            this.selectedUniqIds.splice(i, 1)
          }
        }
      } 
    },
    clickItem(article, event) {
      // the user isn't pressing the ctrl key or the shift key
      if (event.ctrlKey === false && event.shiftKey === false) {
        for (let i=this.selectedUniqIds.length-1; i>=0; i--) {
          if (this.selectedUniqIds[i] !== article.uniqId) {
            this.selectedUniqIds.splice(i, 1)
          }
        }
      }

      // the user is pressing the ctrl key
      if (event.ctrlKey === true && event.shiftKey === false) {
      }

      // the user is pressing the shift key
      if (event.shiftKey === true && event.ctrlKey === false) {
        if (this.lastSelectedArticle === null) {
          for (const uniqId in this.articleMap) {
            if (articleMap[uniqId].order < article.order) {
              this.selectedUniqIds.push(uniqId)
            }
          }

        } else {
          const min = Math.min(article.order, this.lastSelectedArticle.order)
          const max = Math.max(article.order, this.lastSelectedArticle.order)
          for (const uniqId in this.articleMap) {
            if (this.articleMap[uniqId].order > min && this.articleMap[uniqId].order < max && !this.selectedUniqIds.includes(article.uniqId)) {
              this.selectedUniqIds.push(uniqId)
            }
          }
        }

      }

      this.lastSelectedArticle = article
      this.$state.page.setPageProps(this.nodeId, {scrollTo: article.uniqId})
    },
    async decIndent() {
      for (const uniqId of this.selectedUniqIds) {
        const article = this.articleMap[uniqId]
        if (article.level > 0) {
          await this.$state.pageAction.setArticleLevel(article.spaceId, article.nodeId, article.uniqId, article.level - 1)
        }
      }
    },
    async incIndent() {
      for (const uniqId of this.selectedUniqIds) {
        const article = this.articleMap[uniqId]
        if (article.level < 10) {
          await this.$state.pageAction.setArticleLevel(article.spaceId, article.nodeId, article.uniqId, article.level + 1)
        }
      }
    },
    copy() {
      this.$state.clipboard.copyArticles(this.nodeId, this.selectedUniqIds)
    },
    cut() {
      this.$state.clipboard.cutArticles(this.nodeId, this.selectedUniqIds)
    },
    async paste() {
      let order = 0

      if (this.selectedUniqIds.length > 0) {
        let maxOrder = 0
        for (const uniqId of this.selectedUniqIds) {
          const article = this.articleMap[uniqId]
          if (article.order > maxOrder) {
            maxOrder = article.order
          }
        }
        order = maxOrder + 1

      } else {
        let maxOrder = 0
        for (const uniqId in this.articleMap) {
          const article = this.articleMap[uniqId]
          if (article.order > maxOrder) {
            maxOrder = article.order
          }
        }
        order = maxOrder + 1
      }

      await this.$state.clipboardAction.pasteArticlesTo(this.nodeId, order)
    },
    trash() {
      this.showTrashDialog = true
    },
    clickMenu (menu) {
      if (typeof this[menu.name] === 'function') {
        this[menu.name]()
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  overflow: hidden;
}
.scroll-area {
  overflow: auto;
}
.article-list-wrapper {
  display: flex;
  flex-direction: column;
}
.article {
  border-top: 1px solid rgba(255, 255, 255, 0);
  border-bottom: 1px solid rgba(255, 255, 255, 0);
}
.drag-over-prev {
  border-top: 1px solid green;
}
.drag-over-next {
  border-bottom: 1px solid green;
}
</style>
