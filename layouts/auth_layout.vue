<script>
export default {}
</script>

<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout column justify-center align-center class="form-layout">
        <v-flex pa-5 xs1 class="form">
          <nuxt />
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<style lang="scss" scoped>
.form {
  border: 1px solid;
}

.form-layout {
  border: 1px solid;
}

.form-container {
  width: 30%;
  border: 1px solid;
  // margin: 9% 0 7% 0;
}
</style>
