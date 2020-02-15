<script>
export default {}
</script>

<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout column justify-center align-center class="form-layout">
        <div class="mb-2">
          <!-- <span class="logo mb-7 font-weight-bold">
            Kreoh.com
          </span> -->
          <v-img class="logo mx-auto" src="/Logo_beta_text.png"></v-img>
        </div>
        <v-flex pa-7 xs1 class="form elevation-1">
          <transition
            name="auth-transition"
            enter-active-class="animated fadeIn fast"
            leave-active-class="animated fadeOut fast"
            mode="out-in"
          >
            <nuxt />
          </transition>
        </v-flex>
        <p class="text-center mt-2 terms">
          By creating an account or signing in you agree to our
          <a>Terms and Conditions</a> and <a>use of cookies.</a>
        </p>
      </v-layout>
    </v-container>
    <span class="caption footer mb-5">
      &#169; {{ new Date().getFullYear() }} — Kreoh.com
    </span>
  </v-app>
</template>

<style lang="scss" scoped>
.logo {
  // font-size: 48px;
  // color: #0066ff;
  width: 20%;
}

.form {
  border-radius: 10px;
}

.footer {
  color: #777;
  text-align: center;
}

.terms {
  width: 20%;
  color: #777;
  font-size: 10px;
}
</style>
