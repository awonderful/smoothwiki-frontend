<template>
  <v-dialog v-model="show" width="auto" max-width="40em">
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
          <v-row>
            <v-col cols="12">
              <article-dialog
                v-model="view.isDialogVisible"
                :spaceId="spaceId"
                :nodeId="nodeId"
                :uniqId="uniqId" 
                :version="view.version"
              />
							<v-simple-table>
								<template v-slot:default>
									<thead>
										<tr>
											<th class="text-left">
												{{ $t('article.historyDialog.table.version') }}
											</th>
											<th class="text-left">
												{{ $t('article.historyDialog.table.author') }}
											</th>
											<th class="text-center">
												{{ $t('article.historyDialog.table.stime') }}
											</th>
											<th class="text-center">
												{{ $t('article.historyDialog.table.view') }}
											</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="item in versions"
											:key="item.version"
										>
											<td class="text-left">{{ item.version}}</td>
											<td class="text-left">{{ item.authorName}}</td>
											<td class="text-center">{{ item.stime}}</td>
											<td class="text-center">
                        <v-btn
                          text
                          color="primary"
                          @click="viewHistoryArticle(item.version)"
                        >
                          {{ $t('article.historyDialog.table.view') }}
                        </v-btn>
                      </td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
            </v-col>
          </v-row>

       </v-container>
      </v-card-text>
    </v-card>

  </v-dialog>
</template>

<script>
import ArticleDialog from './ArticleDialog.vue'
export default {
  components: { ArticleDialog },
  name: 'article-history-dialog',
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
    versions () {
      if (!this.uniqId) {
        return []
      }

      const article = this.$state.page.getArticle(this.nodeId, this.uniqId)

      if (article && Array.isArray(article.historyVersions)) {
        return article.historyVersions
      }

      return []
    }
  },
  data: function () {
    return {
      isRequesting: false,
      view: {
        isDialogVisible: false,
        version: '',
      }
    }
  },
  watch: {
    show(val) {
      if (val === true) {
        this.pullArticleHistoryVersions();
      }
    }
  },
  methods: {
    close () {
      this.show = false
    },
    async pullArticleHistoryVersions () {
      try {
        this.isRequesting = true
        await this.$state.pageAction.pullArticleHistoryVersions(this.spaceId,	this.nodeId, this.uniqId)
      } finally {
        this.isRequesting = false
      }
    },
    async viewHistoryArticle (version) {
      this.view.version = version
      this.view.isDialogVisible = true
    }
  },
}
</script>

<style scoped>
</style>