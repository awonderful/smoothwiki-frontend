<template>
  <v-dialog v-model="show" width="auto" min-width="40em">
    <v-card>

      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>
          {{ $t('page.articlePage.trashDialog.title') }}
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon @click="close()">
          <v-icon>{{mdiClose}}</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="page">
       <v-container>
					<v-row class="mx-2 flex-column flex-nowrap">
						<v-col class="pa-2 mt-5" cols="12" :key="article.uniqId" v-for="article of articles">
							<Article
								:ref="'article-' + article.uniqId"
								:article="article"
								:useDefaultMenuItems="false"
								:extraMenuItems="menuItems"
							/>
						</v-col>
						<v-col v-if="articles.length === 0" class="text-center ma-6">
							<h1>{{ $t('page.articlePage.trashDialog.empty') }}</h1>
						</v-col>
					</v-row>
       </v-container>
      </v-card-text>
    </v-card>

  </v-dialog>
</template>

<script>
import Article from '@/components/articles/Index.vue'
import { generateUniqId } from '@/common/util'
import { mdiClose, mdiContentCopy } from '@mdi/js'

export default {
	name: 'article-dialog',
	components: {
		Article
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
		articles() {
			const page = this.$state.page.getPage(this.nodeId)

			if (!page || !page.trash || page.trash.pulled === false) {
				return []
			}

			const articles = []
			for (const article of page.trash.articles) {
				articles.push(Object.assign({}, article, {
					uniqId: generateUniqId(),
					editingTitle:    article.title,
					editingBody:     article.body,
					editingSearch:   article.search,
					isEditing:       false,
					isRequesting:    false,
					isReadOnly:      true,
					isUploading:     false,
				}))
			}

			return articles
		},
		menuItems() {
			return [
				{
          name:  'copy',
          title: this.$t('article.menus.copy'),
          icon:  mdiContentCopy,
					action: function (article) {
						this.$state.clipboard.copyTrashArticle(this.nodeId, article.id)
					}.bind(this)
				}
			]
		}
	},
	watch: {
		show (val) {
			if (val === true) {
				const page = this.$state.page.getPage(this.nodeId)

				if (!page.trash || page.trash.pulled === false) {
					this.$state.pageAction.pullPageTrashArticles(this.spaceId, this.nodeId)
				}
			}
		}
	},
	data: function () {
		return {
			mdiClose,

			isRequesting: false
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
.page {
  background-color: #eff3f8;
}
</style>