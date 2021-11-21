<template>
  <div class="d-flex flex-column wrapper">
    <v-toolbar 
      dense 
      :dark="$state.theme.top.dark"
      :color="$state.theme.top.bgColor"
      class="flex-grow-0"
    >
      <v-text-field
        dense
        flat
        hide-details
        append-icon="mdi-magnify"
        v-model="keyword"
        :label="$t('left.search')"
        @input="search()"
      >
      </v-text-field>
    </v-toolbar>

    <div class="flex-grow-1 scroll-area" :style="{'background-color': $state.theme.left.bgColor}">
      <doc-tree
        :keyword="keyword"
        ref="docTree"
      >
      </doc-tree>
      
      <trash-tree
        ref="trashTree"
        :keyword="keyword"
      >
      </trash-tree>
    </div>
  </div>
</template>

<script>
import DocTree from './DocTree'
import TrashTree from './TrashTree'

export default {
  name: 'left',
  components: { DocTree, TrashTree },
  data: function () {
    return {
      keyword: ''
    }
  },
  methods: {
    search() {
      const keyword = this.keyword.trim()
      if (keyword.length > 0) {
        this.$refs.docTree.search(keyword)
        this.$refs.trashTree.search(keyword)
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  overflow: hidden;
}
.scroll-area {
  overflow: auto;
}
</style>