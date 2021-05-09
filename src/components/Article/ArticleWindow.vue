<template>
  <v-sheet elevation="0" :class="['pa-2', 'article-container', {'full-screen': isFullScreen}, {'editing': isEditing}]" rounded="lg">

    <!--header begin-->
    <v-toolbar dense flat class="header">

      <!--title-->
      <input 
        type="text" 
        class="title-input text-h5 flex-grow-1 font-weight-medium" 
        v-model="colonedTitle" 
        @input="updateTitle" 
        :readonly="!isEditing"
      />

      <!--buttons-->
      <div>
        <v-tooltip
          :key="button.name"
          v-for="button of buttons"
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              icon
              class="mr-2 button"
              v-bind="attrs"
              v-on="on"
              @click="clickButton(button)"
            >
              <v-icon small>{{button.icon}}</v-icon>
            </v-btn>
          </template>
          <span>{{button.tip}}</span>
        </v-tooltip>
      </div>

      <!--menu-->
      <v-menu open-on-hover bottom offset-y v-if="!this.isFreshNew">
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            small 
            icon 
            v-bind="attrs" 
            v-on="on" 
            class="button"
          >
            <v-icon small>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :key="item.name" v-for="item in menuItems" @click="clickMenu(item)">
            <v-list-item-icon><v-icon small>{{item.icon}}</v-icon></v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-toolbar>
    <!--header end-->

    <v-divider class="divider" />

    <div class="body">
      <slot name="editor" v-if="isEditing"></slot>
      <slot name="view" v-else></slot>
    </div>

  </v-sheet>
</template>

<script>
export default {
  props: {
    useDefaultButtons: {
      type: Boolean,
      default: true
    },
    useDefaultMenuItems: {
      type: Boolean,
      default: true
    },
    extraButtons: {
      type: Array,
      default: function () {
        return []
      }
    },
    extraMenuItems: {
      type: Array,
      default: function () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    isFreshNew: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    isFullScreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    defaultButtons () {
      const fullscreenSwitcher = this.isFullScreen
        ? 'exitFullscreen'
        : 'fullscreen'

      if (this.isEditing && this.isFreshNew) {
        return [fullscreenSwitcher, 'save', 'remove']
      }

      if (this.isEditing && !this.isFreshNew) {
        return [fullscreenSwitcher, 'save', 'exit']
      }

      if (!this.isEditing && !this.isReadOnly) {
        return [fullscreenSwitcher, 'edit', 'remove']
      }

      if (!this.isEditing && this.isReadOnly) {
        return [fullscreenSwitcher]
      }

      return []
    },
    defaultMenuItems () {
      return ['history', 'copy', 'cut']
    },
    buttons () {
      const buttons = []

      for (const button of this.extraButtons) {
        if (typeof button === 'string') {
          if (this.buttonMap[button]) {
            buttons.push(this.buttonMap[button])
          }
        } else {
          buttons.push(button)
        }
      }

      for (const button of this.defaultButtons) {
        buttons.push(this.buttonMap[button])
      }

      return buttons
    },
    menuItems () {
      const items = []

      for (const item of this.defaultMenuItems) {
        items.push(this.menuItemMap[item])
      }

      for (const item of this.extraMenuItems) {
        if (typeof item === 'string') {
          if (this.menuItemMap[item]) {
            items.push(this.menuItemMap[item])
          }
        } else {
          items.push(item)
        }
      }

      return items
    }
  },
  data: function () {
    return {
      colonedTitle: this.title,

      menuItemMap: {
        history: {
          name:  'history',
          title: this.$t('article.menus.history'),
          icon:  'mdi-history',
        },
        copy: {
          name:  'copy',
          title: this.$t('article.menus.copy'),
          icon:  'mdi-content-copy',
        },
        cut: {
          name:  'cut',
          title: this.$t('article.menus.cut'),
          icon:  'mdi-content-cut',
        }
      },

      buttonMap: {
        edit: {
          name: 'edit',
          icon: 'mdi-pencil',
          tip:  this.$t('article.buttonTips.edit')
        },
        save: {
          name: 'save',
          icon: 'mdi-content-save-outline',
          tip:  this.$t('article.buttonTips.save')
        },
        fullscreen: {
          name: 'fullscreen',
          icon: 'mdi-fullscreen',
          tip:  this.$t('article.buttonTips.fullscreen')
        },
        exitFullscreen: {
          name: 'exitFullscreen',
          icon: 'mdi-fullscreen-exit',
          tip:  this.$t('article.buttonTips.exitFullscreen')
        },
        exit: {
          name: 'exit',
          icon: 'mdi-location-exit',
          tip:  this.$t('article.buttonTips.exit')
        },
        remove: {
          name: 'remove',
          icon: 'mdi-trash-can-outline',
          tip:  this.$t('article.buttonTips.remove')
        }
      }
    }
  },
  methods: {
    updateTitle () {
      this.$emit('update:title', this.colonedTitle)
    },
    clickButton (button) {
      this.$emit('clickButton', button.name)
    },
    clickMenu (item) {
      this.$emit('clickMenu', item.name)
    }
  }
}
</script>

<style scoped>
  .article-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
  }
  .header {
    flex-shrink: 0;
    flex-grow: 0;
    width: 100%;
  }
  .divider {
    flex-shrink: 0;
    flex-grow: 0;
    width: 100%;
  }
  .body {
    width: 100%;
    flex-grow: 0;
    height: auto;
  }
  .title-input {
    outline: 0;
    border: 0;
  }
  .button {
    visibility: hidden;
  }
  .article-container.full-screen {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 999;
    padding: 0 !important;
  }
  .article-container.full-screen .body {
    flex-grow: 1;
    overflow: auto;
  }
  .article-container.editing .button {
    visibility: visible;
  }
  .article-container:hover .button {
    visibility: visible;
  }
  .article-container .body >>> .v-note-wrapper {
    z-index: auto;
  }
  .article-container .body >>> .v-note-wrapper .v-note-op {
    z-index: auto;
  }
</style>

<style>
  .article-container.full-screen .body > div {
    height: auto;
  }
</style>
