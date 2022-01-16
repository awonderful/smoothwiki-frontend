<template>
  <v-dialog v-model="show" scrollable max-width="600px" class="dialog">
    <v-card>

      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>
          {{ $t('home.settingSpaceDialog.title') }}
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <template v-slot:extension>
          <v-tabs v-model="tab">
            <v-tabs-slider color="white" />
            <v-tab>{{ $t('home.settingSpaceDialog.tabs.info') }}</v-tab>
            <v-tab>{{ $t('home.settingSpaceDialog.tabs.members') }}</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-progress-linear
        indeterminate
        color="secondary"
        v-if="space.isRequesting"
      />

      <v-tabs-items v-model="tab">

        <!-- info begin -->
        <v-tab-item :transition="false" :reverse-transition="false">
          <v-card-text class="setting-content">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field :label="$t('home.settingSpaceDialog.info.fields.title')" v-model="info.title"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea rows="3" :label="$t('home.settingSpaceDialog.info.fields.desc')" v-model="info.desc"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <div class="field-title">{{ $t('home.settingSpaceDialog.info.fields.nonMember') }}</div>
                </v-col>
                <v-col cols="4">
                    <v-checkbox
                      v-model="info.othersRead"
                      :label="$t('home.settingSpaceDialog.info.fields.readable')"
                      color="primary"/>
                </v-col>
                <v-col cols="4">
                    <v-checkbox
                      v-model="info.othersWrite"
                      :label="$t('home.settingSpaceDialog.info.fields.writable')"
                      color="primary"/>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="close()">{{ $t('home.settingSpaceDialog.info.actions.cancel') }}</v-btn>
            <v-btn color="primary" text @click="saveSpaceInfo()">{{ $t('home.settingSpaceDialog.info.actions.save') }}</v-btn>
          </v-card-actions>
        </v-tab-item>
        <!-- info end -->

        <!-- members begin -->
        <v-tab-item :transition="false" :reverse-transition="false">
          <v-card-text class="setting-content">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th> {{ $t('home.settingSpaceDialog.members.table.header.user') }} </th>
                    <th> {{ $t('home.settingSpaceDialog.members.table.header.email') }} </th>
                    <th> {{ $t('home.settingSpaceDialog.members.table.header.role') }} </th>
                    <th> {{ $t('home.settingSpaceDialog.members.table.header.operations') }} </th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="member.uid" v-for="member of space.members">
                    <td> {{ member.name }} </td>
                    <td> {{ member.email }} </td>
                    <td> {{ $t('dict.spaceMemberRoleName.' + member.role) }} </td>
                    <td>
                      <v-btn icon small @click="removeSpaceMember(member.uid)">
                        <v-icon small>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-row justify="center" align="center" class="ma-6">
              <v-col cols="5">
                <v-text-field :label="$t('home.settingSpaceDialog.members.table.header.email')" v-model="addMember.email"></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select 
                  :label="$t('home.settingSpaceDialog.members.table.header.role')" 
                  :items="addMember.roles"
                  v-model="addMember.role"
                  item-text="text"
                  item-value="role"
                >
                </v-select> 
              </v-col>
              <v-col cols="1">
                <v-btn icon @click="addSpaceMember()">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="close()">{{ $t('home.settingSpaceDialog.members.actions.close') }}</v-btn>
          </v-card-actions>
        </v-tab-item>
        <!-- members end -->
      </v-tabs-items>

    </v-card>

  </v-dialog>
</template>

<script>
  import { SPACE_TYPE, SPACE_MEMBER_ROLE } from '@/common/constants.js'

  export default {
    name: 'setting-space-dialog',
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
    watch: {
      space: {
        deep: true,
        immediate: true,
        handler: function (newVal) {
          this.info.title       = newVal.title
          this.info.desc        = newVal.desc
          this.info.othersRead  = newVal.othersRead === 1
          this.info.othersWrite = newVal.othersWrite === 1
          if (newVal.members.length === 0) {
            this.$state.spaceAction.refreshSpaceMembers(newVal.id)
          }
        }
      }
    },
    data: function () {
      return {
        tab: null,

        info: {
          title: '',
          desc: '',
          othersRead: false,
          othersWrite: false,
        },

        addMember: {
          email: '',
          role: SPACE_MEMBER_ROLE.ORDINARY,
          roles: [
            {role: SPACE_MEMBER_ROLE.ORDINARY, text: this.$t('dict.spaceMemberRoleName.' + SPACE_MEMBER_ROLE.ORDINARY)},
            {role: SPACE_MEMBER_ROLE.ADMIN,    text: this.$t('dict.spaceMemberRoleName.' + SPACE_MEMBER_ROLE.ADMIN)}
          ]
        }
      }
    },
    methods: {
      close () {
        this.show = false
      },
      async saveSpaceInfo () {
        await this.$state.spaceAction.updateSpace(this.space.id, {
          title:       this.info.title,
          desc:        this.info.desc,
          othersRead:  this.info.othersRead === true
                        ? 1
                        : 0,
          othersWrite: this.info.othersWrite === true
                        ? 1
                        : 0
        })
        this.close()
      },
      async removeSpaceMember (uid) {
        await this.$state.spaceAction.removeSpaceMember(this.space.id, uid)
      },
      async addSpaceMember () {
        await this.$state.spaceAction.addSpaceMember(this.space.id, this.addMember.email, this.addMember.role)
        this.addMember.email = ''
        this.addMember.role = SPACE_MEMBER_ROLE.ORDINARY
      }
    }
  }
</script>

<style scoped>
.setting-content {
  min-height: 30em;
}
.field-title {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}
</style>