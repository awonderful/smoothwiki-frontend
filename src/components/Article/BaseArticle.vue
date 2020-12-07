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
      this.$store.commit('SET_ARTICLE_PROPS', {
        uniqId:  this.article.uniqId,
        props:   props
       })
    },
    getEditingTitle () {
      return this.article.editingTitle
    },
    getEditingBody () {
      return this.article.editingBody
    },
    getEditingSearch () {
      return this.article.editingBody
    },
    hasChanged () {
      return (this.getEditingTitle() !== this.article.title || this.getEditingBody() !== this.article.body)
    },
    save () {
      if (!this.hasChanged()) {
        this.exitEditing()
      } else {
        this.setArticleProps({
          editingTitle:  this.getEditingTitle(),
          editingBody:   this.getEditingBody(),
          editingSearch: this.getEditingSearch()
        })
        this.$emit('save', this.article.uniqId)
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