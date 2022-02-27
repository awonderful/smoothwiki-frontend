<template>
  <v-sheet elevation="0" :class="['pa-2', 'article-container', {'full-screen': isFullScreen}, {'editing': isEditing}, {'touch-device': $state.system.isTouchDevice}]" rounded="lg">

    <!--header begin-->
    <v-toolbar dense flat class="header">

      <!--title-->
      <input 
        type="text" 
        class="title-input text-h5 flex-grow-1 flex-shrink-1 font-weight-medium" 
        v-model="clonedTitle" 
        @input="updateTitle" 
        :readonly="!isEditing"
      />

      <!--buttons-->
      <div class="flex-grow-0 flex-shrink-0">
        <v-tooltip
          :key="button.name + (isEditing? '-editing': '')"
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
      <context-menu open-on-hover :close-delay="300" v-if="!this.isFreshNew && this.menuItems.length > 0">
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
      </context-menu>

    </v-toolbar>
    <!--header end-->

    <v-divider class="divider" />

    <div class="body" ref="body">
      <slot name="editor" v-if="isEditing"></slot>
      <slot name="view" v-else></slot>
    </div>

  </v-sheet>
</template>

<script>
import ContextMenu from '@/components/utils/ContextMenu.vue';

export default {
  components: {
    ContextMenu
  },
  props: {
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
    },
    buttons: {
      type: Array,
      default: function () {
        return []
      }
    },
    menuItems: {
      type: Array,
      default: function () {
        return []
      }
    },
  },
  data: function () {
    return {
      clonedTitle: this.title,
    }
  },
  watch: {
    title (newVal) {
      this.clonedTitle = newVal
    }
  },
  methods: {
    updateTitle () {
      this.$emit('update:title', this.clonedTitle)
    },
    clickButton (button) {
      this.$emit('clickButton', button)
    },
    clickMenu (item) {
      this.$emit('clickMenu', item)
    },
    getBodyWidth () {
      return this.$refs.body.clientWidth
    },
    getBodyHeight () {
      return this.$refs.body.clientHeight
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
    z-index: 0;
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
    min-width: 0;
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
    z-index: 200;
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
  .article-container.touch-device .button {
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
