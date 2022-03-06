<template>
	<component
		ref="self"
		:is="articleComponentMap[$attrs.article.type]"
		v-bind="$attrs"
		v-on="$listeners"
	/>
</template>

<script>
import { ARTICLE_COMPONENT_MAP } from '@/common/constants.js'
import MarkdownArticle from './MarkdownArticle.vue'
import RichTextArticle from './RichTextArticle/Index.vue'
import AttachmentArticle from './AttachmentArticle/Index.vue'
import MindArticle from './MindArticle.vue'
import SpreadsheetArticle from './SpreadsheetArticle.vue'
import PdfArticle from './PdfArticle.vue'


export default {
	inheritAttrs: false,
  components: {
    MarkdownArticle,
    RichTextArticle,
    AttachmentArticle,
    MindArticle,
    PdfArticle,
    SpreadsheetArticle,
  },
  data: function () {
    return {
      articleComponentMap: ARTICLE_COMPONENT_MAP
		}
	},
	methods: {
		realRef() {
			return this.$refs.self
		}
	}
}
</script>
