<script>
export default {
  name: 'Login',
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
  layout: 'auth_layout',
  // auth: false,
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
      from_path: '/',
      loading: false
    }
  },
  methods: {
    async validateInfo() {
      this.loading = true
      if (this.$refs.loginForm.validate()) {
        const { data } = await this.$axios
          .post('/auth/login', { email: this.email, password: this.password })
          .catch((e) => {
            const error = JSON.parse(JSON.stringify(e))
            return error.response
          })
        if (data.error) {
          this.$root.$emit('showError', { message: data.message })
        } else if (!data.error) {
          this.$auth.setToken('local', 'Bearer ' + data.access_token)
          this.$auth.setRefreshToken('local', data.refresh_token)
          this.$axios.setHeader('Authorization', 'Bearer ' + data.access_token)
          this.$auth.ctx.app.$axios.setHeader(
            'Authorization',
            'Bearer ' + data.access_token
          )
          const user = await this.$axios.$get('/auth/user')
          this.$auth.setUser(user)
          this.$router.push('/dashboard')
        } else {
          this.$root.$emit('showError', { message: data.message })
        }
      }
      this.loading = false
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
    :class="
      `pa-2 ${
        $breakpoint.is.smAndDown ? '' : 'w-20 elevation-1'
      } d-flex flex-column align-center text-center rounded`
    "
  >
    <span class="headline mb-4">Login</span>
    <v-text-field
      ref="email"
      v-model="email"
      label="Email"
      type="email"
      :rules="[rules.required, rules.email]"
      class="w-90"
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
      class="w-90"
      outlined
      @click:append="show_password = !show_password"
      @keyup.enter="validateInfo()"
    >
    </v-text-field>
    <v-btn
      color="success"
      :loading="loading"
      :disabled="loading"
      @keyup.enter="validateInfo()"
      @click.stop="validateInfo()"
    >
      Submit
    </v-btn>
    <v-col cols="12" class="auth-link d-flex flex-column align-center">
      <span class="caption">New to Kreoh?</span>
      <nuxt-link to="/auth/register" class="caption">
        Create an account
      </nuxt-link>
      <nuxt-link to="/" class="caption">Forgot password?</nuxt-link>
    </v-col>
  </v-form>
</template>
