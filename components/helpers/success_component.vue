<script>
export default {
  data() {
    return {
      model: false,
      message: null
    }
  },
  created() {
    this.$root.$on('showSuccess', (ev) => {
      this.message = ev.message
      this.model = true
    })
  }
}
</script>

<template>
  <v-snackbar v-model="model" bottom color="success">
    {{ message }}
    <v-btn dark text @click="model = false">
      Close
    </v-btn>
  </v-snackbar>
</template>
