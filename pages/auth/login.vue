<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Login',
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
  middleware: 'available_route_check',
  layout: 'auth_layout',
  props: {
    nextPath: {
      type: String,
      default: 'home'
    }
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
      formHasErrors: false
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
  head() {
    return {
      title: 'Login - Kreoh.com'
    }
  },
  methods: {
    ...mapActions('user_auth', ['login']),
    validateInfo() {
      this.formHasErrors = false
      Object.keys(this.user).forEach((f) => {
        if (!this.user[f]) this.formHasErrors = true
        this.$refs[f].validate(true)
      })
      if (!this.formHasErrors) {
        this.user.nextPath = this.nextPath
        this.login(this.user)
      }
    }
  }
}
</script>

<template>
  <div class="pa-2 d-flex flex-column align-center">
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
    <v-btn color="success" @click="validateInfo()">Submit</v-btn>
    <v-flex class="mt-2 auth-link d-flex flex-column align-center">
      <span class="caption">New to Kreoh?</span>
      <nuxt-link to="/auth/registration" class="auth-link caption">
        Create an account
      </nuxt-link>
    </v-flex>
  </div>
</template>

<style lang="scss" scoped>
.auth-input {
  width: 90%;
}

.auth-link {
  color: #777;
}
</style>
