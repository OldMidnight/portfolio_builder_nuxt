<script>
export default {
  data() {
    return {
      model: false,
      message: null
    }
  },
  created() {
    this.$root.$on('showError', (ev) => {
      this.message = ev.message
      this.model = true
    })
  }
}
</script>

<template>
  <v-snackbar v-model="model" bottom color="error">
    {{ message }}
    <v-btn dark text @click="model = false">
      Close
    </v-btn>
  </v-snackbar>
</template>
