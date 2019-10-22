<script>
import { mapState, mapActions } from 'vuex'
export default {
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
  <div>
    <div>Login</div>
    <v-text-field
      ref="email"
      v-model="email"
      label="Email"
      type="email"
      :rules="[rules.required, rules.email]"
      outlined
    >
    </v-text-field>
    <v-text-field
      ref="password"
      v-model="password"
      label="Password"
      :type="show_password ? 'text' : 'password'"
      :append-icon="show_password ? 'visibility' : 'visibility_off'"
      :rules="[
        rules.required,
        () => (!!password && password.length >= 8) || 'Min 8 characters',
        () => (!!password && password.length <= 25) || 'Max 25 characters'
      ]"
      outlined
      @click:append="show_password = !show_password"
    >
    </v-text-field>
    <v-btn color="success" @click="validateInfo()">Submit</v-btn>
    <v-flex>
      <nuxt-link to="/auth/registration">Create an account</nuxt-link>
    </v-flex>
  </div>
</template>

<style lang="scss" scoped></style>
