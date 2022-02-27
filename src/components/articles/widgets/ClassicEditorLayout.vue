<template>
  <div :class="['classic-editor', {'full-screen': isFullScreen}, {'scrollbar': enableScrollbar}, {'force-height': !isFullScreen && forceHeight}]">
    <div class="classic-editor-toolbar">
      <slot name="classic-editor-toolbar"></slot>
    </div>
    <div class="classic-editor-body">
      <slot name="classic-editor-body"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isFullScreen: {
      type: Boolean,
      required: true,
    },
    enableScrollbar: {
      type: Boolean,
      default: true,
    },
    forceHeight: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style scoped>
  .classic-editor {
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border: 0;
  }
  .classic-editor .classic-editor-toolbar {
    flex-grow: 0;
    flex-shrink: 0;
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    border: 0;
  }
  .classic-editor .classic-editor-body {
    flex-grow: 0;
    flex-shrink: 0;
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    border: 0;
  }
  .classic-editor.force-height .classic-editor-body {
    height: calc(100vh - 200px);
    overflow: hidden;
  }
  .classic-editor.full-screen .classic-editor-body {
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
  }
  .classic-editor.full-screen .classic-editor-body.scrollbar {
    overflow: scroll;
  }
  .classic-editor.full-screen {
    height: 100% !important;
  }
</style>