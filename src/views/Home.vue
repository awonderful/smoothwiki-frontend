<template>
  <v-app id="inspire">

    <v-app-bar app>
      <viewer></viewer>
    </v-app-bar>

    <v-main>
      <v-container>
        <template v-for="(spaces, type) in typedSpaces">
          <v-subheader :key="'type_title_' + type">
            {{ $t('dict.spaceTypeName.' + type) }}
          </v-subheader>

          <v-row :key="'type_spaces_' + type">
            <v-col 
              :key="space.id" 
              v-for="space of spaces"
              cols="4"
              xs="12"
              xl="3"
            >
              <space-card 
                :space="space"
                class="card"
                @remove = "remove(space)"
                @setting = "setting(space)"
              />

            </v-col>
            <v-col 
              v-if="(parseInt(type) !== spaceTypeDict.PERSON) || spaces.length === 0"
              cols="4"
              xs="12"
              xl="3"
            >
              <v-card elevation="0" outlined class="card create-card" @click="create(parseInt(type))">
                <v-icon color="secondary lighten-2" size="3em">mdi-plus</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-main>

    <create-space-dialog v-model="showCreateSpaceDialog" :type="createSpaceType"/>
    <remove-space-dialog v-model="showRemoveSpaceDialog" :space="currentSpace" v-if="currentSpace !== null"/>
    <setting-space-dialog v-model="showSettingSpaceDialog" :space="currentSpace" v-if="currentSpace !== null" />

    <v-snackbar v-model="alert.show">{{alert.message}}</v-snackbar>
  </v-app>
</template>

<script>
import SpaceCard from '@/components/Space/SpaceCard.vue'
import CreateSpaceDialog from '@/components/Space/CreateSpaceDialog.vue'
import RemoveSpaceDialog from '@/components/Space/RemoveSpaceDialog.vue'
import SettingSpaceDialog from '@/components/Space/SettingSpaceDialog.vue'
import Viewer from '@/components/Top/Viewer.vue'
import { SPACE_TYPE } from '@/common/constants.js'
import GeneralErrorHandling from '@/common/generalErrorHandling.js'

export default {
  components: {
    SpaceCard,
    CreateSpaceDialog,
    RemoveSpaceDialog,
    SettingSpaceDialog,
    Viewer
  },
  mixins: [
    GeneralErrorHandling
  ],
  computed: {
    typedSpaces () {
      const typedSpaces = {
        [SPACE_TYPE.PERSON]:  [],
        [SPACE_TYPE.GROUP]:   [],
        [SPACE_TYPE.PROJECT]: [] 
      }

      const spaceMap = this.$state.space.getSpaceMap()
      for (const spaceId in spaceMap) {
        const space = spaceMap[spaceId]
        typedSpaces[space.type].push(space)
      }

      return typedSpaces
    }
  },
  data: function() {
    return {
      currentSpace: null,
      createSpaceType: SPACE_TYPE.PROJECT,

      showCreateSpaceDialog: false,
      showRemoveSpaceDialog: false,
      showSettingSpaceDialog: false,

      spaceTypeDict: SPACE_TYPE,
    }
  },
  methods: {
    create (type) {
      this.createSpaceType = type
      this.showCreateSpaceDialog = true
    },
    remove (space) {
      this.currentSpace = space
      this.showRemoveSpaceDialog = true
    },
    setting (space) {
      this.currentSpace = space
      this.showSettingSpaceDialog = true
    }
  },
  mounted () {
    this.$state.spaceAction.getSpaces()
  }
}
</script>

<style scoped>
.card {
  min-height: 7em;
}
.create-card {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>