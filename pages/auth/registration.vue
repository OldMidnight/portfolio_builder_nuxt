<script>
import { mapActions } from 'vuex'
export default {
  name: 'registration',
  transitions: {
    enterActiveClass: 'animated fadeInLeft fast',
    leaveActiveClass: 'animated fadeOutRight fast'
  },
  auth: false,
  middleware: 'available_route_check',
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
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      domainEntry: false,
      formHasErrors: false,
      domainValid: null
    }
  },
  computed: {
    status() {
      return this.$store.state.user_auth.status
    },
    form() {
      return {
        f_name: this.f_name,
        s_name: this.s_name,
        email: this.email,
        password: this.password
      }
    },
    user() {
      return {
        f_name: this.f_name,
        s_name: this.s_name,
        email: this.email,
        password: this.password,
        domain: this.domain
      }
    }
  },
  methods: {
    ...mapActions({
      register: 'user_auth/register'
    }),
    validateInfo() {
      this.formHasErrors = false
      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) this.formHasErrors = true
        this.$refs[f].validate(true)
      })
      if (!this.formHasErrors) {
        this.domainEntry = true
        this.formHasErrors = false
      }
    },
    validateDomain() {
      this.formHasErrors = false
      if (!this.domain) this.formHasErrors = true

      this.$refs.domain.validate(true)

      if (!this.formHasErrors) {
        this.$axios
          .$post('create/validate_domain', { domain: this.user.domain })
          .then((response) => {
            if (response.validated) {
              this.register(this.user)
            } else {
              this.domainValid = false
            }
          })
      }
    }
  }
}
</script>

<template>
  <v-layout column align-center>
    <div v-if="!domainEntry" class="pa-2 d-flex flex-column align-center">
      <div class="headline mb-4">Create Your Account</div>
      <v-text-field
        ref="f_name"
        v-model="f_name"
        label="First Name"
        :rules="[rules.required]"
        class="auth-input"
        outlined
      >
      </v-text-field>
      <v-text-field
        ref="s_name"
        v-model="s_name"
        label="Last Name"
        :rules="[rules.required]"
        class="auth-input"
        outlined
      >
      </v-text-field>
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
        :append-icon="show_password ? 'mdi-eye' : 'visibilmdi-eye-offity_off'"
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
    </div>
    <div v-if="domainEntry">
      <div>Enter Your Domain</div>
      <v-text-field
        ref="domain"
        v-model="domain"
        label="Domain"
        :rules="[
          rules.required,
          () => (!!domain && domain.length >= 3) || 'Min 3 characters',
          () => (!!domain && domain.length <= 20) || 'Max 20 characters'
        ]"
        class="auth-input"
        outlined
        @click="domainValid = null"
      >
      </v-text-field>
      <v-btn color="success" @click="validateDomain()">Submit</v-btn>
    </div>
    <v-flex class="d-flex flex-column align-center auth-link">
      <span class="caption">Already have an account?</span>
      <nuxt-link to="/auth/login" class="caption auth-link">Login</nuxt-link>
    </v-flex>
  </v-layout>
</template>

<style lang="scss" scoped>
.form-wrap {
  width: 50%;
}

.auth-input {
  width: 90%;
}

.auth-link {
  color: #777;
}
</style>
