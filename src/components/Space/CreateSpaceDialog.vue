<template>
  <v-dialog v-model="show" width="auto" max-width="40em">
    <v-card>

      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>
          {{ $t('home.createSpaceDialog.title', {spaceTypeName: $t('dict.spaceTypeName.' + type)}) }}
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
            <v-col cols="12">
              <v-text-field :label="$t('home.createSpaceDialog.fields.title')" v-model="title"/>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <div class="field-title">{{ $t('home.createSpaceDialog.fields.nonMember') }}</div>
            </v-col>
            <v-col cols="4">
                <v-checkbox
                  v-model="othersRead"
                  :label="$t('home.createSpaceDialog.fields.readable')"
                  color="primary"/>
            </v-col>
            <v-col cols="4">
                <v-checkbox
                  v-model="othersWrite"
                  :label="$t('home.createSpaceDialog.fields.writable')"
                  color="primary"/>
            </v-col>
          </v-row>

        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="accent darken-1" text @click="close()">{{ $t('home.createSpaceDialog.actions.cancel') }}</v-btn>
        <v-btn color="accent darken-1" text @click="create()">{{ $t('home.createSpaceDialog.actions.create') }}</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
  import { SPACE_TYPE } from '@/common/constants.js'

  export default {
    name: 'create-space-dialog',
    props: {
      value: {
        type: Boolean,
        required: true
      },
      type: {
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
        title: '',
        desc: '',
        othersRead: true,
        othersWrite: false,

        isRequesting: false,
      }
    },
    methods: {
      close () {
        this.show = false
      },
      showAlert (message) {
        this.alertMessage = message
        this.alert = true
      },
      hideAlert () {
        this.alert = false
      },
      async create () {
        try {
          this.isRequesting = true
          await this.$state.spaceAction.createSpace({
            type:        this.type,
            title:       this.title,
            desc:        this.desc,
            othersRead:  this.othersRead === true
                         ? 1
                         : 0,
            othersWrite: this.othersWrite === true
                         ? 1
                         : 0
          })
          this.close()
          this.title = ''
          this.desc  = ''
          //this.othersRead = true
          //this.othersWrite = false
        } finally {
          this.isRequesting = false
        }
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