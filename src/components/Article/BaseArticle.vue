<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      fullscreenVars: {
        htmlOverflow: null,
        htmlScrollTop: null,
        bodyWidth: null,
        bodyHeight: null
      },
    }
  },
  methods: {
    setArticleProps (props) {
      this.$state.page.setArticleProps(this.article.nodeId, this.article.uniqId, props)
    },
    getEditingTitle () {
      return this.article.editingTitle
    },
    getEditingBody () {
      return this.article.editingBody
    },
    getEditingSearch () {
      return this.article.editingSearch
    },
    hasChanged () {
      return (this.getEditingTitle() !== this.article.title || this.getEditingBody() !== this.article.body || this.getEditingSearch() !== this.article.search)
    },
    refresh () {
      this.$state.pageAction.refreshArticle(this.article.spaceId, this.article.nodeId, this.article.uniqId)
    },
    save () {
      if (this.article.id === 0 || this.hasChanged()) {
         this.setArticleProps({
          editingTitle:  this.getEditingTitle(),
          editingBody:   this.getEditingBody(),
          editingSearch: this.getEditingSearch()
        })
        this.$state.pageAction.saveArticle(this.article.spaceId, this.article.nodeId, this.article.uniqId)
      } else {
        this.exitEditing()
      }
    },
    remove() {
      this.$state.globalDialogs.showConfirmDialog({
        title: this.$t('article.removeDialog.title'),
        desc: this.$t('article.removeDialog.desc'),
        cancelText: this.$t('article.removeDialog.cancelText'),
        okText: this.$t('article.removeDialog.okText'),
        okFunc: function () {
          this.$state.pageAction.removeArticle(this.article.spaceId, this.article.nodeId, this.article.uniqId)
        }.bind(this)
      })
    },
    exitEditing () {
      this.setArticleProps({isEditing: false})
    },
    edit () {
      this.setArticleProps({isEditing: true})
    },
    hidePageScrollbar () {
      this.fullscreenVars.htmlOverflow = document.documentElement.style.overflow
      this.fullscreenVars.htmlScrollTop = document.documentElement.scrollTop
      this.fullscreenVars.bodyWidth = document.body.style.width
      this.fullscreenVars.bodyHeight = document.body.style.height
      this.fullscreenVars.bodyOverflow = document.body.style.overflow
      document.body.style.setProperty('width',    '100vw')
      document.body.style.setProperty('height',   '100vh')
      document.body.style.setProperty('overflow',  'hidden')
      document.documentElement.style.setProperty('overflow', 'hidden')
    },
    showPageScrollbar () {
      document.body.style.setProperty('width',    this.fullscreenVars.bodyWidth)
      document.body.style.setProperty('height',   this.fullscreenVars.bodyHeight)
      document.body.style.setProperty('overflow', this.fullscreenVars.bodyOverflow)
      document.documentElement.style.setProperty('overflow', this.fullscreenVars.htmlOverflow)
      document.documentElement.scrollTop = this.fullscreenVars.htmlScrollTop
    },
    fullscreen () {
      this.hidePageScrollbar()
      this.setArticleProps({isFullScreen: true})
    },
    exitFullscreen () {
      this.setArticleProps({isFullScreen: false})
      this.$nextTick(function () {
        this.showPageScrollbar()
      }.bind(this))
    },
    exit () {
      if (this.article.isEditing) {
        this.exitEditing()
      }
    },
    copy () {
      this.$state.clipboard.copyArticle(this.article.nodeId, this.article.uniqId)
    },
    cut () {
      this.$state.clipboard.cutArticle(this.article.nodeId, this.article.uniqId)
    },
    history () {
      this.$emit('history', this.article.uniqId)
    },
    clickButton (button) {
      if (typeof this[button] === 'function') {
        this[button]()
      }
    },
    clickMenu (menu) {
      if (typeof this[menu] === 'function') {
        this[menu]()
      }
    }
  }
}
</script>