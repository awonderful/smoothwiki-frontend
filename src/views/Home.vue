<template>
  <v-app id="inspire">

    <v-app-bar 
      app 
      dense 
      :dark="$state.theme.top.dark"
      :color="$state.theme.top.bgColor"
    >
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" class="text-right">
          <viewer></viewer>
          </v-col>
        </v-row>
      </v-container>
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
              xl="1"
            >
              <v-sheet elevation="0" class="card space-card">
                <div class="space-img-wrapper pt-3 pb-3" @click="gotoSpace(space.id)">
                  <v-menu
                    bottom
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        icon
                        small
                        class="menu-btn"
                      >
                        <v-icon small>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>

                    <v-list dense>
                      <v-list-item-group>
                        <v-list-item @click="remove(space)">
                          <v-list-item-icon><v-icon small>mdi-trash-can-outline</v-icon></v-list-item-icon>
                          <v-list-item-title>{{$t('home.spaceMenu.remove')}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="setting(space)">
                          <v-list-item-icon><v-icon small>mdi-cog-outline</v-icon></v-list-item-icon>
                          <v-list-item-title>{{$t('home.spaceMenu.settings')}}</v-list-item-title>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>

                  <img src="/img/space-icon.svg"/>
                </div>
                <div class="space-title mt-2">
                  {{space.title}}
                </div>
              </v-sheet>

            </v-col>
            <v-col 
              v-if="(parseInt(type) !== spaceTypeDict.PERSON) || spaces.length === 0"
              cols="4"
              xs="12"
              xl="1"
            >
              <v-card elevation="0" class="card create-card" @click="create(parseInt(type))">
                <v-btn icon x-large>
                <v-icon color="secondary lighten-2" size="3em">mdi-plus</v-icon>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row :key="'divider_' + type" class="mt-10">
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-main>

    <create-space-dialog v-model="showCreateSpaceDialog" :type="createSpaceType"/>
    <remove-space-dialog v-model="showRemoveSpaceDialog" :space="currentSpace" v-if="currentSpace !== null"/>
    <setting-space-dialog v-model="showSettingSpaceDialog" :space="currentSpace" v-if="currentSpace !== null" />

    <global-dialogs></global-dialogs>

  </v-app>
</template>

<script>
import SpaceCard from '@/components/Space/SpaceCard.vue'
import CreateSpaceDialog from '@/components/Space/CreateSpaceDialog.vue'
import RemoveSpaceDialog from '@/components/Space/RemoveSpaceDialog.vue'
import SettingSpaceDialog from '@/components/Space/SettingSpaceDialog.vue'
import GlobalDialogs from '@/components/GlobalDialogs/Index.vue'
import Viewer from '@/components/Top/Viewer.vue'
import { SPACE_TYPE } from '@/common/constants.js'
import GeneralErrorHandling from '@/common/generalErrorHandling.js'

export default {
  components: {
    CreateSpaceDialog,
    RemoveSpaceDialog,
    SettingSpaceDialog,
    GlobalDialogs,
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
    },
    gotoSpace (spaceId) {
      const routeData = this.$router.resolve({name: 'space-node', params: {spaceId: spaceId, category: 'doc', nodeId: 0}})
      window.open(routeData.href, '_blank')
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
.space-card {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
}
.space-card .space-img-wrapper {
  position: relative;
  width: 100%;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.space-card .space-img-wrapper:hover {
  background-color: lightgrey;
}
.create-card {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.space-card .space-img-wrapper .menu-btn {
  position: absolute;
  right: 0.3em;
  top: 0.3em;
  display: none;
}
.space-card .space-img-wrapper:hover .menu-btn {
  display: block;
}

</style>