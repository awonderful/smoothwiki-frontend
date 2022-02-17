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
import MarkdownArticle from '@/components/Article/MarkdownArticle.vue'
import RichTextArticle from '@/components/Article/RichTextArticle.vue'
import AttachmentArticle from '@/components/Article/AttachmentArticle/Index.vue'
import MindArticle from '@/components/Article/MindArticle.vue'
import SpreadsheetArticle from '@/components/Article/SpreadsheetArticle.vue'
import PdfArticle from '@/components/Article/PdfArticle.vue'


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
