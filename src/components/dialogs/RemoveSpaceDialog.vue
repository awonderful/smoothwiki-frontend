<template>
  <v-dialog v-model="show" width="30em">
    <v-card>
      <v-toolbar dark flat color="primary">
        <v-toolbar-title>
          {{ $t('home.removeSpaceDialog.title') }}
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon @click="close()">
          <v-icon>{{mdiClose}}</v-icon>
        </v-btn>
      </v-toolbar>

      <v-progress-linear
        indeterminate
        color="primary lighten-2"
        v-if="space.isRequesting"
      />

      <v-card-text class="pa-6">
        {{ $t('home.removeSpaceDialog.desc') }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="close()">{{ $t('home.removeSpaceDialog.actions.cancel') }}</v-btn>
        <v-btn color="primary" text @click="remove()">{{ $t('home.removeSpaceDialog.actions.remove') }}</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  name: 'remove-space-dialog',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    space: {
      type: Object,
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
      mdiClose,
    }
  },
  methods: {
    close () {
      this.show = false
    },
    async remove () {
      await this.$state.spaceAction.removeSpace(this.space.id)
      this.close()
    }
  }
}
</script>