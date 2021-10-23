<template>
  <v-dialog v-model="show" width="auto" min-width="40em">
    <v-card>

      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>
          {{ $t('article.historyDialog.title') }}
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
       <v-container>
          <component
            :is="articleComponentMap[article.type]"
            :article="article"
						v-if="article !== null && article !== undefined"
            />
       </v-container>
      </v-card-text>
    </v-card>

  </v-dialog>
</template>

<script>
import { ARTICLE_COMPONENT_MAP } from '@/common/constants.js'
import MarkdownArticle from '@/components/Article/MarkdownArticle.vue'
import RichTextArticle from '@/components/Article/RichTextArticle.vue'
import AttachmentArticle from '@/components/Article/AttachmentArticle/Index.vue'
import MindArticle from '@/components/Article/MindArticle.vue'
import PdfArticle from '@/components/Article/PdfArticle.vue'

export default {
	name: 'article-dialog',
	components: {
		MarkdownArticle,
		RichTextArticle,
		AttachmentArticle,
		MindArticle,
		PdfArticle,
	},
	props: {
    value: {
      type: Boolean,
      required: true
    },
    spaceId: {
      type: Number,
      required: true
    },
    nodeId: {
      type: Number,
      required: true
    },
    uniqId: {
      type: String,
      required: true
    },
		version: {
			type: String,
			required: false
		}
	},
	computed: {
		show: {
			get () {
				return this.value
			},
			set (val) {
				this.$emit('input', val)
			}
		},
		article() {
			const article = this.$state.page.getArticle(this.nodeId, this.uniqId)
			if (!article) {
				return null
			}


			if (this.version) {
				const historyVersions = article.historyVersions
				for (const historyArticle of historyVersions) {
					if (historyArticle.version === this.version) {
						if (historyArticle.pulled === false) {
							this.$state.pageAction.pullHistoryArticle(this.spaceId, this.nodeId, this.uniqId, this.version)
							return null
						} else {
							const t = Object.assign({}, article, historyArticle, {
								editingTitle:    historyArticle.title,
								editingBody:     historyArticle.body,
								editingSearch:   historyArticle.search,
								isEditing:       false,
								isRequesting:    false,
								isFullScreen:    false,
								isReadOnly:      false,
								isUploading:     false,						
							})
							return t
						}
					}
				}
			}

			return Object.assign({}, article, {
				isEditing:       false,
				isRequesting:    false,
				isFullScreen:    false,
				isReadOnly:      false,
				isUploading:     false,
			})
		}
	},
	data: function () {
		return {
			isRequesting: false,
			articleComponentMap: ARTICLE_COMPONENT_MAP,
		}
	},
	methods: {
		close () {
			this.show = false
		},
	},
}
</script>

<style scoped>
</style>