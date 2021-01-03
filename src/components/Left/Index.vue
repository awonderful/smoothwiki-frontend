<template>
  <div>
    <DocTree 
      @node-removed = "refreshTrashTree()"
      ref="docTree"
    />
    <TrashTree
      ref="trashTree"
    />
  </div>
</template>

<script>
import DocTree from './DocTree'
import TrashTree from './TrashTree'

export default {
  name: 'left',
  components: { DocTree, TrashTree },
  methods: {
    refreshTrashTree() {
      this.$refs.trashTree.refresh()
    }
  }
}
</script>

<style scoped>

</style>