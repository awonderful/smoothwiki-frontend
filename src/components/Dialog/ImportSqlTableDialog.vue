<template>
  <v-dialog v-model="show" max-width="60em">
    <v-card>

      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>
          {{ $t('page.articlePage.importSqlTableDialog.title') }}
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-progress-linear
        indeterminate
        color="secondary"
        v-if="isRequesting"
      />

      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-textarea
                outlined
                no-resize
                autofocus
                height="20em"
                :label="$t('page.articlePage.importSqlTableDialog.sqlFieldTitle')"
                :placeholder="placeholder"
                v-model="sql"
              />
            </v-col>
          </v-row>

        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="accent darken-1" text @click="close()">{{ $t('page.articlePage.importSqlTableDialog.cancel') }}</v-btn>
        <v-btn color="accent darken-1" text @click="importTables()">{{ $t('page.articlePage.importSqlTableDialog.ok') }}</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
  import getTablesFromCreateStatements from '@/common/sql.js'
  import { ARTICLE_TYPE } from '@/common/constants.js'

  export default {
    name: 'import-sql-table-dialog',
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
      }
    },
    data: function () {
      return {
        sql: '',
        placeholder: 'CREATE TABLE `tableA` (\n'
                      + '  `id` bigint unsigned NOT NULL AUTO_INCREMENT,\n'
                      + '  `xxxxx` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n'
                      + '  ...... \n'
                      + '\n'
                      + 'CREATE TABLE `tableB` (\n'
                      + '  `id` bigint unsigned NOT NULL AUTO_INCREMENT,\n'
                      + '  `xxxxx` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n'
                      + '  ...... \n'
                      + '\n',
        isRequesting: false,
      }
    },
    methods: {
      close () {
        this.show = false
      },
      generateMarkdownTable (columns) {
        let table = `| ${this.$t('page.articlePage.importSqlTableDialog.markdown.field')}| ${this.$t('page.articlePage.importSqlTableDialog.markdown.type')}| ${this.$t('page.articlePage.importSqlTableDialog.markdown.default')}| ${this.$t('page.articlePage.importSqlTableDialog.markdown.comment')}|\n`
                       + `|-|-|-|-|\n`
        for (const column of columns) {
          table += `|${column.name}|${column.dataType}|${column.defaultValue}|${column.comment}|\n`
        }

        return table
      },
      importTables () {
        const tables = getTablesFromCreateStatements(this.sql)

        for (const table of tables) {
          let title = table.tableName
          if (table.tableComment) {
            title += ' ' + table.tableComment
          }

          const body = this.generateMarkdownTable(table.columns)
          this.$state.page.appendArticle(this.nodeId, {
            spaceId:  this.spaceId,
            nodeId:   this.nodeId,
            id:       0,
            type:     ARTICLE_TYPE.MARKDOWN,
            title:    title,
            body:     body,
            search:   '',
            isEditing: true
          })
        }
        this.close()
      }
    }
  }
</script>

<style scoped>
.field-title {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}
</style>