<script>
export default {
  props: {
    type: {
      required: true
    }
  }
}
</script>

<template>
  <v-flex xs9 hidden-sm-and-down class="section-base">
    <slot />
  </v-flex>
</template>

<style lang="scss" scoped>
.section-base {
  height: 85%;
}
</style>
