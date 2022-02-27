<template>
  <div class="pa-2 white">
    {{curRow > 0 ? $t('article.widget.insertTableBoard.info', {row: curRow, col: curCol}) : $t('article.widget.insertTableBoard.title')}}
    <table
      class="table"
      ref="table"
    >
      <tr v-for="row in maxRow" :key="row">
        <td
          v-for="col in maxCol"
          :key="col"
          :class="[
            'cell',
            {'highlight': row <= curRow && col <= curCol}
          ]"
          @mouseover="setCurrentRowAndCol(row, col)"
          @click="ok()"
        ></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      maxRow: 10,
      maxCol: 10,
      curRow: 0,
      curCol: 0,
      timer: null,
    }
  },
  methods: {
    setCurrentRowAndCol(row, col) {
      this.curRow = row
      this.curCol = col
    },
    hide () {
      this.$emit('input', false)
    },
    cancel () {
      this.hide()
    },
    ok () {
      this.$emit('ok', {
        row: this.curRow,
        col: this.curCol,
      })
    },
    doNothing() {
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      if (!this.$refs.table.matches(':hover') && this.curRow > 0) {
        this.setCurrentRowAndCol(0, 0)
      }
    }, 200)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.table {
  border-spacing: 2px;
}
.cell {
  width: 20px;
  height: 20px;
  border: 1px solid black !important;
}
.highlight {
  background-color: lightblue;
}
</style>