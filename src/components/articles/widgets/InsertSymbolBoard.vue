<template>
  <div class="board pa-2 white d-flex flex-row justify-start flex-wrap">
    <div
      v-for="symbol in symbols"
      :key="symbol"
      class="symbol-wrapper"
      @click="$emit('ok', symbol)"
    >
      <img :src="`/symbol/${symbol}.png`"/>
    </div>
  </div>
</template>

<script>

export const SYMBOLS = [
  'heavy_check_mark', 'x', 'question', 'exclamation', 'no_entry_sign', 'no_entry', 'warning', 'information_source', 

  'moneybag', 'heavy_dollar_sign', 'e-mail', 'envelope', 'link', 'paperclip', 'registered', 'tm', 'copyright', 

  'telephone_receiver', 'mobile_phone', 'male_sign', 'female_sign', 'ok', 'vs', 'key', 'lock',

  'heavy_plus_sign', 'heavy_minus_sign', 'heavy_multiplication_x', 'heavy_division_sign',

  'white_circle', 'yellow_circle', 'orange_circle', 'purple_circle', 'red_circle', 'green_circle', 'blue_circle', 'brown_circle', 'black_circle',

  'white_heart', 'yellow_heart', 'orange_heart', 'purple_heart', 'heart', 'green_heart', 'blue_heart', 'brown_heart', 'black_heart',

  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
] 

export const isValidSymbol = (symbol) => {
  return SYMBOLS.includes(symbol)
}

export default {
  data: function () {
    return {
      symbols: SYMBOLS, 
    }
  },
}
</script>

<style scoped>
  .board {
    width: 16em;
  }
  .symbol-wrapper {
    width: 1.6em;
    height: 1.6em;
    border-radius: 2px;
    border: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center;
  }
  .symbol-wrapper:hover {
    background-color: lightblue;
  }
  img {
    width: 1em;
    height: 1em;
  }
</style>