<template>
  <div>
    <v-toolbar dense>
      <v-text-field
        dense
        flat
        hide-details
        append-icon="mdi-magnify"
        v-model="keyword"
        @input="search()"
      ></v-text-field>
    </v-toolbar>

    <doc-tree
      @node-removed = "refreshTrashTree()"
      :keyword="keyword"
      ref="docTree"
    ></doc-tree>
    
    <trash-tree
      ref="trashTree"
      :keyword="keyword"
    ></trash-tree>
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
    refreshTrashTree() {
      this.$refs.trashTree.refresh()
    }
  }
}
</script>