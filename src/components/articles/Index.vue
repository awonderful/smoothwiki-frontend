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
const MarkdownArticle = () => import('./MarkdownArticle.vue')
const RichTextArticle = () => import('./RichTextArticle/Index.vue')
const AttachmentArticle = () => import('./AttachmentArticle/Index.vue')
const MindArticle = () => import('./MindArticle.vue')
const SpreadsheetArticle = () => import('./SpreadsheetArticle.vue')
const GraphArticle = () => import('./GraphArticle.vue')

export default {
	inheritAttrs: false,
  components: {
    MarkdownArticle,
    RichTextArticle,
    AttachmentArticle,
    MindArticle,
    SpreadsheetArticle,
		GraphArticle,
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
