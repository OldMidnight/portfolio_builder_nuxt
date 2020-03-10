<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Login',
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
  layout: 'auth_layout',
  auth: false,
  asyncData({ $auth }) {
    return { from_path: $auth.$storage.getUniversal('redirect-path') }
  },
  data() {
    return {
      email: null,
      password: null,
      show_password: false,
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      formHasErrors: false,
      from_path: '/',
      login_fail: false,
      loginFormValid: true,
      loading: false
    }
  },
  computed: {
    user() {
      return {
        email: this.email,
        password: this.password
      }
    },
    ...mapState('user_auth', ['status'])
  },
  methods: {
    ...mapActions('user_auth', ['login']),
    validateInfo() {
      if (this.$refs.loginForm.validate()) {
        this.loading = true
        this.login(this.user)
      }
    }
  },
  head() {
    return {
      title: 'Login - Kreoh.com'
    }
  }
}
</script>

<template>
  <v-form
    ref="loginForm"
    v-model="loginFormValid"
    class="pa-2 d-flex flex-column align-center"
  >
    <span class="headline mb-4">Login</span>
    <v-text-field
      ref="email"
      v-model="email"
      label="Email"
      type="email"
      :rules="[rules.required, rules.email]"
      class="auth-input"
      outlined
    >
    </v-text-field>
    <v-text-field
      ref="password"
      v-model="password"
      label="Password"
      :type="show_password ? 'text' : 'password'"
      :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[
        rules.required,
        () => (!!password && password.length >= 8) || 'Min 8 characters',
        () => (!!password && password.length <= 25) || 'Max 25 characters'
      ]"
      class="auth-input"
      outlined
      @click:append="show_password = !show_password"
    >
    </v-text-field>
    <v-btn
      color="success"
      :loading="loading"
      :disabled="loading"
      @keydown.enter="validateInfo()"
      @click.stop="validateInfo()"
    >
      Submit
    </v-btn>
    <v-flex class="mt-2 auth-link d-flex flex-column align-center">
      <span class="caption">New to Kreoh?</span>
      <nuxt-link to="/auth/registration" class="auth-link caption">
        Create an account
      </nuxt-link>
    </v-flex>
    <v-snackbar v-model="login_fail" color="error">
      Incorrect email or password.
      <v-btn icon @click="login_fail = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-form>
</template>

<style lang="scss" scoped>
.auth-input {
  width: 90%;
}

.auth-link {
  color: #777;
}
</style>
