<script>
import { mapActions } from 'vuex'
export default {
  name: 'Registration',
  transitions: {
    enterActiveClass: 'animated fadeInLeft fast',
    leaveActiveClass: 'animated fadeOutRight fast'
  },
  auth: false,
  middleware: 'isLoggedIn',
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
      domainInvalid: false,
      show_confirm: false
    }
  },
  computed: {
    status() {
      return this.$store.state.user_auth.status
    },
    user() {
      return {
        f_name: this.f_name.charAt(0).toUpperCase() + this.f_name.slice(1),
        s_name: this.s_name.charAt(0).toUpperCase() + this.s_name.slice(1),
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
    validateForm() {
      // if (this.$refs.reg_form.validate(true)) {
      //   this.$axios
      //     .post('create/validate_domain', { domain: this.user.domain })
      //     .then((response) => {
      //       if (response.data.validated) {
      //         this.register(this.user)
      //       }
      //     })
      //     .catch(() => {
      //       this.domainInvalid = true
      //     })
      // }
    }
  },
  head() {
    return {
      title: 'Registration - Kreoh.com'
    }
  }
}
</script>

<template>
  <v-row column align-center class="d-flex flex-column">
    <v-form
      v-if="!show_confirm"
      ref="reg_form"
      class="pa-2 d-flex flex-column align-center"
    >
      <span class="headline mb-4">Create Your Account</span>
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
        @keyup.enter="validateForm()"
      >
      </v-text-field>
      <!-- <v-btn color="success" @click.stop="validateInfo()">Submit</v-btn> -->
      <v-btn color="success" @click="validateForm()">
        Next<v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-form>
    <v-flex
      v-if="!show_confirm"
      class="d-flex flex-column align-center auth-link"
    >
      <span class="caption">Already have an account?</span>
      <nuxt-link to="/auth/login" class="caption auth-link">Login</nuxt-link>
    </v-flex>
    <v-snackbar v-model="domainInvalid" color="error">
      Domain is unavailable.
      <v-btn icon @click="domainInvalid = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-row>
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
