<template>
  <v-app id="inspire" :class="{'touch-device': $state.system.isTouchDevice, 'phone-device': $vuetify.breakpoint.xs, 'non-phone-device': !$vuetify.breakpoint.xs}">

    <v-app-bar 
      app 
      dense 
      :dark="$state.theme.top.dark"
      :color="$state.theme.top.bgColor"
    >
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" class="d-flex flex-row justify-end align-center">
            <search></search>
            <viewer></viewer>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <template v-for="(spaces, type) in typedSpaces">
            <v-subheader :key="'type_title_' + type" class="space-category">
              {{ $t('dict.spaceTypeName.' + type) }}
            </v-subheader>

            <v-row :key="'type_spaces_' + type" style="position: relative;">
              <v-col 
                :key="space.id" 
                v-for="space of spaces"
                cols="12"
                sm="4"
                md="3"
                lg="2"
                xl="1"
                :class="{'py-1': $vuetify.breakpoint.xs}"
              >
                <v-sheet elevation="0" class="card space-card">
                  <div class="space-img-wrapper pt-3 pb-3" @click="gotoSpace(space.id)">
                    <img src="/img/space-icon.svg"/>
                  </div>
                  <context-menu>
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
                        <v-icon small>{{$vuetify.breakpoint.xs? mdiDotsVertical : mdiDotsHorizontal}}</v-icon>
                      </v-btn>
                    </template>

                    <v-list dense>
                      <v-list-item-group>
                        <v-list-item @click="remove(space)">
                          <v-list-item-icon><v-icon small>{{mdiTrashCanOutline}}</v-icon></v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>{{$t('home.spaceMenu.remove')}}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click="setting(space)">
                          <v-list-item-icon><v-icon small>{{mdiCogOutline}}</v-icon></v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>{{$t('home.spaceMenu.settings')}}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </context-menu>
                <div class="space-title mt-2" @click="gotoSpace(space.id)">
                  {{space.title}}
                </div>
              </v-sheet>

              </v-col>
              <v-col 
                v-if="(parseInt(type) !== spaceTypeDict.PERSON) || spaces.length === 0"
                cols="12"
                sm="4"
                md="3"
                lg="2"
                xl="1"
                :class="{'py-1': $vuetify.breakpoint.xs}"
              >
                <v-card elevation="0" class="card create-card" @click="create(parseInt(type))">
                  <v-btn icon :x-large="!$vuetify.breakpoint.xs">
                    <v-icon color="secondary lighten-2" :x-large="!$vuetify.breakpoint.xs">{{mdiPlus}}</v-icon>
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

    <global-dialog></global-dialog>

  </v-app>
</template>

<script>
import CreateSpaceDialog from '@/components/dialogs/CreateSpaceDialog.vue'
import RemoveSpaceDialog from '@/components/dialogs/RemoveSpaceDialog.vue'
import SettingSpaceDialog from '@/components/dialogs/SettingSpaceDialog.vue'
import ContextMenu from '@/components/utils/ContextMenu.vue'
import GlobalDialog from '@/components/globalDialogs/Index.vue'
import Viewer from '@/components/top/Viewer.vue'
import Search from '@/components/top/Search.vue'
import { SPACE_TYPE } from '@/common/constants.js'
import GeneralErrorHandling from '@/common/generalErrorHandling.js'
import {
  mdiDotsVertical,
  mdiDotsHorizontal,
  mdiTrashCanOutline,
  mdiCogOutline,
  mdiPlus,
} from '@mdi/js'


export default {
  components: {
    CreateSpaceDialog,
    RemoveSpaceDialog,
    SettingSpaceDialog,
    ContextMenu,
    GlobalDialog,
    Viewer,
    Search
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
      mdiDotsVertical,
      mdiDotsHorizontal,
      mdiTrashCanOutline,
      mdiCogOutline,
      mdiPlus,

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
.non-phone-device .card {
  min-height: 7em;
}
.non-phone-device .space-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}
.non-phone-device .space-card .space-img-wrapper {
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
.non-phone-device .space-card:hover .space-img-wrapper {
  background-color: lightgrey;
}
.non-phone-device .create-card {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.non-phone-device .space-card .menu-btn {
  position: absolute;
  right: 0.3em;
  top: 0.3em;
  display: none;
}
.non-phone-device .space-card:hover .menu-btn {
  display: block;
}
.non-phone-device .space-card .space-title {
  text-align: center;
}
.touch-device .space-card .menu-btn {
  display: block;
}

.phone-device .card {
  min-height: 3em;
}
.phone-device .create-card {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 1.5em;
  top: -4em;
  color: rgba(0, 0, 0, 0.6);
}
.phone-device .space-card {
  height: 3em;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  padding: 0 16px;
}
.phone-device .space-card .space-img-wrapper {
  width: 3em;
  height: 3em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  order: 1;
  flex-shrink: 0;
  flex-grow: 0;
}
.phone-device .space-card .space-img-wrapper img {
  max-width: 100%;
}
.phone-device .space-card .space-title {
  display: block;
  width: 10em;
  height: 3em;
  line-height: 3em;
  text-align: left;
  order: 2;
  flex-grow: 10;
  flex-shrink: 10;
  padding-left: 0.5em;
}
.phone-device .space-card .menu-btn {
  order: 3;
  flex-shrink: 0;
  flex-grow: 0;
}
.phone-device .space-category {
  margin-bottom: 2em;
}
</style>