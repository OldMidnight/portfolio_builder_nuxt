<script>
export default {}
</script>

<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout column justify-center align-center class="form-layout">
        <span class="logo mb-7">Kreoh.com</span>
        <v-flex pa-7 xs1 class="form elevation-2">
          <nuxt />
        </v-flex>
      </v-layout>
    </v-container>
    <span class="caption footer mb-5">&#169; 2020 Kreoh.com</span>
  </v-app>
</template>

<style lang="scss" scoped>
.logo {
  font-size: 48px;
  color: #0066ff;
}

.form {
  border-radius: 20px;
}

.footer {
  color: #777;
  text-align: center;
}
</style>
