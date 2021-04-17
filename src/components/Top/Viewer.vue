<template>
  <v-menu
    open-on-hover
    bottom
    :offset-y="true"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-avatar color="secondary lighten-5" :size="size" v-bind="attrs" v-on="on">
        <v-icon>mdi-account</v-icon>
      </v-avatar>
    </template>

    <v-list>
      <v-list-item-group
        v-model="selectMenu"
        color="primary"
      >
        <v-list-item>
          <v-list-item-title>{{ $t('appBar.viewer.menu.logOut') }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>

export default {
  props: {
    size: {
      type: Number,
      default: 40
    }
  },
  data: function () {
    return {
      selectMenu: 0
    }
  }
}
</script>

<style scoped>

</style>