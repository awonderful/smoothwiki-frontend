<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event.target.value)"
    persistent
    max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ $t('article.widget.insertLinkDialog.title') }}</span>
        <v-spacer></v-spacer>
        <v-btn icon dense elevation="0" @click="hide()">
          <v-icon>{{mdiClose}}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                :value="title"
                @input="$emit('update:title', $event)"
                :placeholder="$t('article.widget.insertLinkDialog.titleFieldPlaceHolder')"
                required>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :value="url"
                @input="$emit('update:url', $event)"
                placeholder="https://"
                required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancel()">{{ $t('article.widget.insertLinkDialog.cancel') }}</v-btn>
        <v-btn color="blue darken-1" text @click="ok()">{{ $t('article.widget.insertLinkDialog.ok') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    url: {
      type: String,
      required: false,
      default: '',
    }
  },
  data: function () {
    return {
      mdiClose,
    }
  },
  methods: {
    hide () {
      this.$emit('input', false)
    },
    cancel () {
      this.hide()
    },
    ok () {
      this.$emit('ok')
    },
  }
}
</script>
