<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
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
        this.$emit('save', this.article.uniqId)
      } else {
        this.exitEditing()
      }
    },
    remove() {
      this.$emit('remove', this.article.uniqId)
    },
    exitEditing () {
      this.setArticleProps({isEditing: false})
    },
    edit () {
      this.setArticleProps({isEditing: true})
    },
    fullscreen () {
      this.setArticleProps({isFullScreen: true})
    },
    exitFullscreen () {
      this.setArticleProps({isFullScreen: false})
    },
    exit () {
      if (this.article.isEditing) {
        this.exitEditing()
      }
    },
    clickButton (button) {
      if (typeof this[button] === 'function') {
        this[button]()
      }
    }
  }
}
</script>