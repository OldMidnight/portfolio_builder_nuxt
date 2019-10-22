<script>
export default {
  props: {
    pModel: {
      type: Boolean,
      required: true
    },
    errorTimeout: {
      type: Number,
      default: 6000
    },
    errorText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      model: this.p_model,
      timeout: this.error_timeout,
      message: this.error_text
    }
  }
}
</script>

<template>
  <v-snackbar v-model="model" bottom color="error" :timeout="timeout">
    {{ message }}
    <v-btn dark text @click="model = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<style lang="scss" scoped></style>
