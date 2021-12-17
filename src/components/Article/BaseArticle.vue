<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    },
    useDefaultButtons: {
      type: Boolean,
      default: true
    },
    useDefaultMenuItems: {
      type: Boolean,
      default: true
    },
    extraButtons: {
      type: Array,
      default: function () {
        return []
      }
    },
    extraMenuItems: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: function () {
    return {
      isFullScreen: false,
      fullscreenVars: {
        htmlOverflow: null,
        htmlScrollTop: null,
        bodyWidth: null,
        bodyHeight: null
      },

      menuItemMap: {
        history: {
          name:  'history',
          title: this.$t('article.menus.history'),
          icon:  'mdi-history',
        },
        copy: {
          name:  'copy',
          title: this.$t('article.menus.copy'),
          icon:  'mdi-content-copy',
        },
        cut: {
          name:  'cut',
          title: this.$t('article.menus.cut'),
          icon:  'mdi-content-cut',
        }
      },

      buttonMap: {
        edit: {
          name: 'edit',
          icon: 'mdi-pencil',
          tip:  this.$t('article.buttonTips.edit')
        },
        save: {
          name: 'save',
          icon: 'mdi-content-save-outline',
          tip:  this.$t('article.buttonTips.save')
        },
        fullscreen: {
          name: 'fullscreen',
          icon: 'mdi-fullscreen',
          tip:  this.$t('article.buttonTips.fullscreen')
        },
        exitFullscreen: {
          name: 'exitFullscreen',
          icon: 'mdi-fullscreen-exit',
          tip:  this.$t('article.buttonTips.exitFullscreen')
        },
        exit: {
          name: 'exit',
          icon: 'mdi-location-exit',
          tip:  this.$t('article.buttonTips.exit')
        },
        remove: {
          name: 'remove',
          icon: 'mdi-trash-can-outline',
          tip:  this.$t('article.buttonTips.remove')
        }
      }
    }
  },
  computed: {
    defaultButtons () {
      const fullscreenSwitcher = this.isFullScreen
        ? 'exitFullscreen'
        : 'fullscreen'

      if (this.article.isEditing && this.article.isFreshNew) {
        return [fullscreenSwitcher, 'save', 'remove']
      }

      if (this.article.isEditing && !this.article.isFreshNew) {
        return [fullscreenSwitcher, 'save', 'exit']
      }

      if (!this.article.isEditing && !this.article.isReadOnly) {
        return [fullscreenSwitcher, 'edit', 'remove']
      }

      if (!this.article.isEditing && this.article.isReadOnly) {
        return [fullscreenSwitcher]
      }

      return []
    },
    defaultMenuItems () {
      return ['history', 'copy', 'cut']
    },
    buttons () {
      const buttons = []

      for (const button of this.extraButtons) {
        if (typeof button === 'string') {
          if (this.buttonMap[button]) {
            buttons.push(this.buttonMap[button])
          }
        } else {
          buttons.push(button)
        }
      }

      if (this.useDefaultButtons) {
        for (const button of this.defaultButtons) {
          if (typeof button === 'string') {
            if (this.buttonMap[button]) {
              buttons.push(this.buttonMap[button])
            }
          } else {
            buttons.push(button)
          }
        }
      }

      return buttons
    },
    menuItems () {
      const items = []

      if (this.useDefaultMenuItems) {
        for (const item of this.defaultMenuItems) {
          items.push(this.menuItemMap[item])
        }
      }

      for (const item of this.extraMenuItems) {
        if (typeof item === 'string') {
          if (this.menuItemMap[item]) {
            items.push(this.menuItemMap[item])
          }
        } else {
          items.push(item)
        }
      }

      return items
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
      //this.setArticleProps({isFullScreen: true})
      this.isFullScreen = true
    },
    exitFullscreen () {
      //this.setArticleProps({isFullScreen: false})
      this.isFullScreen = false
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
      if (typeof button.action === 'function') {
        button.action(this.article)
      } else if (typeof this[button.name] === 'function') {
        this[button.name](this.article)
      }
    },
    clickMenu (menu) {
      if (typeof menu.action === 'function') {
        menu.action(this.article)
      } else if (typeof this[menu.name] === 'function') {
        this[menu.name](this.article)
      }
    }
  }
}
</script>