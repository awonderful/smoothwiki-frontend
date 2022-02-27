<template>
  <v-bottom-sheet v-if="$vuetify.breakpoint.xs">
    <template v-slot:activator="scope">
      <slot name="activator" v-bind="scope">
      </slot>
    </template>

    <v-sheet class="rounded-t-lg pt-5">
      <slot></slot>
    </v-sheet>
  </v-bottom-sheet>
  <v-menu 
    bottom
    offset-y
    :open-on-hover="openOnHover"
    :close-delay="closeDelay"
    v-else>
    <template v-slot:activator="scope">
      <slot name="activator" v-bind="scope">
      </slot>
    </template>

    <slot slot="default"></slot> 
  </v-menu>
</template>

<script>
export default {
  props: {
    'open-on-hover': {
      type: Boolean,
      default: false,
    },
    'close-delay': {
      type: Number,
      default: 0,
    }
  },
  data: function() {
    return {
    }
  },
}
</script>