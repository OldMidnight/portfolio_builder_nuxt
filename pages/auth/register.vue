<script>
export default {
  name: 'Register',
  transitions: {
    enterActiveClass: 'animated fadeInLeft fast',
    leaveActiveClass: 'animated fadeOutRight fast'
  },
  layout: 'auth_layout',
  data() {
    return {
      f_name: null,
      s_name: null,
      email: null,
      password: null,
      domain: null,
      show_password: false,
      rules: {
        required: (value) => !!value || 'Required',
        email: (value) => {
          const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
          return pattern.test(value) || 'Invalid e-mail'
        },
        alphanum: (value) => {
          const pattern = /^[a-z0-9]+$/i
          return (
            pattern.test(value) || 'Only Digits and Letters can be accepted'
          )
        },
        hasDigit: (value) => {
          const pattern = /\d+/
          return pattern.test(value) || 'Digit Required'
        },
        hasUppercase: (value) => {
          const pattern = /[A-Z]+/
          return pattern.test(value) || 'Uppercase Letter Required'
        },
        noWhitespace: (value) =>
          !(value || '').includes(' ') || 'No spaces are allowed',
        isLower: (value) =>
          (value ?? '').toLowerCase() === value ||
          'Domain can only be lowercase'
      },
      loading: false
    }
  },
  computed: {
    user() {
      return {
        f_name: this.f_name.charAt(0).toUpperCase() + this.f_name.slice(1),
        s_name: this.s_name.charAt(0).toUpperCase() + this.s_name.slice(1),
        email: this.email,
        password: this.password,
        domain: this.domain.toLowerCase()
      }
    }
  },
  methods: {
    async validateForm() {
      if (this.$refs.reg_form.validate(true)) {
        this.loading = true
        const { data } = await this.$axios
          .post('/create/validate_domain', { domain: this.user.domain })
          .catch((e) => {
            const error = JSON.parse(JSON.stringify(e))
            return error.response
          })
        if (data.error) {
          this.loading = false
          this.$root.$emit('showError', { message: data.message })
        } else {
          const { data } = await this.$axios
            .post('/auth/register', this.user)
            .catch((e) => {
              const error = JSON.parse(JSON.stringify(e))
              return error.response
            })
          if (data.error) {
            this.loading = false
            this.$root.$emit('showError', { message: data.message })
          } else {
            this.$auth.setToken('local', 'Bearer ' + data.access_token)
            this.$auth.setRefreshToken('local', data.refresh_token)
            this.$axios.setHeader(
              'Authorization',
              'Bearer ' + data.access_token
            )
            this.$auth.ctx.app.$axios.setHeader(
              'Authorization',
              'Bearer ' + data.access_token
            )
            const user = await this.$axios.$get('/auth/user')
            this.$auth.setUser(user)
            this.loading = false
            this.$router.push('/creator')
          }
        }
      }
    }
  },
  head() {
    return {
      title: 'Create an Account - Kreoh.com'
    }
  }
}
</script>

<template>
  <v-form
    ref="reg_form"
    :class="
      `pa-5 ${
        $breakpoint.is.smAndDown ? '' : 'w-20 elevation-1'
      } d-flex flex-column align-center text-center rounded`
    "
  >
    <span class="headline mb-4">Create Your Account</span>
    <p class="caption font-weight-bold">
      Note: Your password must be at least 8 character long and contain both of
      the following:
    </p>
    <ul class="my-3">
      <li class="caption font-weight-bold">At least 1 digit.</li>
      <li class="caption font-weight-bold">At least 1 uppercase letter.</li>
    </ul>
    <v-text-field
      ref="f_name"
      v-model="f_name"
      label="First Name"
      :rules="[rules.required, rules.alphanum]"
      class="w-90"
      outlined
    >
    </v-text-field>
    <v-text-field
      ref="s_name"
      v-model="s_name"
      label="Last Name"
      :rules="[rules.required, rules.alphanum]"
      class="w-90"
      outlined
    >
    </v-text-field>
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
      :append-icon="show_password ? 'mdi-eye' : 'visibilmdi-eye-offity_off'"
      :rules="[
        rules.required,
        rules.hasDigit,
        rules.hasUppercase,
        rules.noWhitespace,
        () => (!!password && password.length >= 8) || 'Min 8 characters',
        () => (!!password && password.length <= 128) || 'Max 128 characters'
      ]"
      class="w-90"
      outlined
      autocomplete="new-password"
      @click:append="show_password = !show_password"
    >
    </v-text-field>
    <v-text-field
      ref="domain"
      v-model="domain"
      label="Domain"
      persistent-hint
      hint="<domain>.kreoh.com"
      :rules="[
        rules.required,
        () => (!!domain && domain.length >= 3) || 'Min 3 characters',
        () => (!!domain && domain.length <= 20) || 'Max 20 characters',
        rules.alphanum,
        rules.isLower,
        rules.noWhitespace
      ]"
      class="w-90"
      outlined
      @keyup.enter="validateForm()"
    >
    </v-text-field>
    <!-- <v-btn color="success" @click.stop="validateInfo()">Submit</v-btn> -->
    <v-btn
      color="success"
      :loading="loading"
      :disabled="loading"
      @click="validateForm()"
    >
      Register<v-icon>mdi-chevron-right</v-icon>
    </v-btn>
    <v-col
      cols="12"
      class="mt-2 pa-0 auth-link d-flex flex-column align-center"
    >
      <span class="caption">Already have an account?</span>
      <nuxt-link to="/auth/login" class="caption">Login</nuxt-link>
    </v-col>
  </v-form>
</template>
