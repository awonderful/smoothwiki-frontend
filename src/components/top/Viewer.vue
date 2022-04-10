<template>
  <v-menu
    open-on-hover
    bottom
    :offset-y="true"
    v-if="userInfo !== null"
  >
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" class="flex-shrink-0 flex-grow-0">
        {{ userInfo.name }} <v-icon>{{mdiMenuDown}}</v-icon>
      </span>
    </template>

    <v-list dense>
      <v-list-item-group
        v-model="selectMenu"
        color="primary"
      >
        <v-list-item @click="logout()">
          <v-list-item-title>{{ $t('appBar.viewer.menu.logOut') }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mdiMenuDown } from '@mdi/js'

export default {
  props: {
    size: {
      type: Number,
      default: 40
    }
  },
  computed: {
    userInfo () {
      return this.$state.user.getUserInfo()
    }
  },
  data: function () {
    return {
      mdiMenuDown,

      selectMenu: 0
    }
  },
  methods: {
    async logout () {
      await this.$state.userAction.logout()
      this.$state.clear()
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style scoped>

</style>