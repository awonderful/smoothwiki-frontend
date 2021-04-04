<template>
  <v-card elevation="0" outlined class="card" @click="viewSpace()">
    <v-toolbar flat dense>
      <v-toolbar-title>
        {{space.title}}
      </v-toolbar-title>
      <v-spacer/>
      <v-btn 
        icon 
        small 
        class="operate-button"
        @click.stop="$emit('remove')"
      >
        <v-icon small>mdi-trash-can-outline</v-icon>
      </v-btn>
      <v-btn 
        icon 
        small 
        class="operate-button"
        @click.stop="$emit('setting')"
      >
        <v-icon small>mdi-cog-outline</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      {{space.desc}}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
    }
  },
  methods: {
    viewSpace() {
      const routeData = this.$router.resolve({name: 'space', params: {spaceId: this.space.id}})
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style scoped>
.card {
  cursor: pointer;
}
.operate-button {
  display: none;
}
.card:hover .operate-button {
  display: block;
}
</style>