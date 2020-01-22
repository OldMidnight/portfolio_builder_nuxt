<script>
export default {
  name: 'user_settings',
  layout: 'dashboard_layout',
  data() {
    return {
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        min: (v) => v.length >= 8 || 'Min 8 characters',
        max: (v) => v.length <= 25 || 'Max 25 characters'
      },
      email_form_valid: true,
      email_valid_snackbar: false,
      email_error_snackbar: false,
      new_email: null,
      email_message: '',
      email_validating: false,
      password_form_valid: true,
      password_valid_snackbar: false,
      password_error_snackbar: false,
      current_password: '',
      new_password_1: '',
      new_password_2: '',
      password_message: '',
      password_validating: false,
      account_delete_dialog: false,
      deletion_confirmation_text: '',
      deletion_btn: false
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    email_snack_msg() {
      return this.email_message
    },
    password_snack_msg() {
      return this.password_message
    }
  },
  watch: {
    deletion_confirmation_text(value) {
      if (value === this.user.domain) {
        this.deletion_btn = true
      } else {
        this.deletion_btn = false
      }
    }
  },
  methods: {
    scrollTo(id) {
      const el = document.getElementById(id)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    validateEmail() {
      if (this.$refs.emailForm.validate()) {
        this.email_validating = true
        this.$axios
          .post('/u/email_change', {
            new_email: this.new_email
          })
          .then((response) => {
            this.email_message = response.data.message
            if (response.status === 200) {
              this.email_error_snackbar = true
            } else {
              this.email_valid_snackbar = true
            }
          })
          .catch(() => {
            this.email_message = 'An error occured.'
            this.email_error_snackbar = true
          })
          .then(() => {
            this.email_validating = false
            this.new_email = null
            this.email_form_valid = true
          })
      }
    },
    validatePassword() {
      if (
        this.$refs.passwordForm.validate() &&
        this.new_password_1 === this.new_password_2
      ) {
        this.password_validating = true
        this.$axios
          .post('/u/password_change', {
            new_password: this.new_password_1
          })
          .then((response) => {
            this.password_message = response.data.message
            if (response.status === 200) {
              this.password_error_snackbar = true
            } else {
              this.password_valid_snackbar = true
            }
          })
          .catch(() => {
            this.password_message = 'An error occured.'
            this.password_error_snackbar = true
          })
          .then(() => {
            this.password_validating = false
            this.current_password = ''
            this.new_password_1 = ''
            this.new_password_2 = ''
            this.password_form_valid = true
          })
      }
    },
    deleteAccount() {
      if (this.deletion_confirmation_text === this.user.domain) {
        this.$axios.post('/u/delete_account').then((response) => {
          this.$auth.logout()
        })
      }
    }
  }
}
</script>

<template>
  <v-layout class="flipped-section d-flex flex-column px-4 py-9">
    <div
      class="flipped-section-header d-flex justify-start align-center elevation-1 pl-6 py-3"
    >
      <div class="flipped-header-back-btn">
        <v-btn elevation="2" rounded color="info" nuxt to="/dashboard">
          Back
        </v-btn>
      </div>
      <div class="flipped-header-title d-flex justify-space-between pr-10">
        <span class="headline font-weight-light">
          User Settings
        </span>
        <span class="font-weight-bold site-name-header info--text">
          Kreoh
        </span>
      </div>
    </div>
    <div class="flipped-section-wrapper my-2 section-stats d-flex elevation-1">
      <div class="flipped-section-nav elevation-1 d-flex flex-column">
        <span class="font-weight-bold text-center my-5">
          Navigation
        </span>
      </div>
      <div class="flipped-section-content-wrapper px-6">
        <div class="flipped-section-content mb-3 mt-10">
          <span
            id="change_email_section"
            class="headline ml-4 my-3 font-weight-light"
          >
            Change Email
          </span>
          <v-form
            ref="emailForm"
            v-model="email_form_valid"
            class="d-flex flex-column justify-center align-center mt-4"
          >
            <v-text-field
              disabled
              outlined
              label="Current Email"
              :value="user.email"
            ></v-text-field>
            <v-text-field
              v-model="new_email"
              :rules="[rules.required, rules.email]"
              outlined
              label="New Email"
            ></v-text-field>
            <v-btn
              :disabled="!email_form_valid || email_validating"
              color="success"
              rounded
              :loading="email_validating"
              @click="validateEmail()"
              @keypress.enter="validateEmail()"
            >
              Update Email
            </v-btn>
          </v-form>
        </div>
        <div class="flipped-section-content mb-3 mt-10">
          <span
            id="change_password_section"
            class="headline ml-4 my-3 font-weight-light"
          >
            Change Password
          </span>
          <v-form
            ref="passwordForm"
            v-model="password_form_valid"
            autocomplete="off"
            class="d-flex flex-column justify-center align-center mt-4"
          >
            <v-text-field
              v-model="current_password"
              outlined
              autocomplete="off"
              label="Current Password"
              type="password"
              :rules="[rules.required, rules.min, rules.max]"
            ></v-text-field>
            <v-text-field
              v-model="new_password_1"
              type="password"
              autocomplete="off"
              :rules="[rules.required, rules.min, rules.max]"
              outlined
              label="New Password"
            ></v-text-field>
            <v-text-field
              v-model="new_password_2"
              type="password"
              autocomplete="off"
              :rules="[rules.required, rules.min, rules.max]"
              outlined
              label="Confirm New Password"
            ></v-text-field>
            <v-btn
              :disabled="!password_form_valid || password_validating"
              color="success"
              rounded
              :loading="password_validating"
              @click="validatePassword()"
              @keypress.enter="validatePassword()"
            >
              Update Password
            </v-btn>
          </v-form>
        </div>
        <div class="flipped-section-content mb-3 mt-10">
          <span
            id="delete_account_section"
            class="headline ml-4 my-3 font-weight-light"
          >
            Delete Account
          </span>
          <div class="d-flex flex-column justify-center align-center mt-4">
            <v-btn color="error" @click="account_delete_dialog = true">
              <v-icon>mdi-delete</v-icon> Delete Your Account
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="account_delete_dialog"
      width="500"
      transition="slide-y-transition"
    >
      <v-card>
        <v-card-title>Delete Your Account</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-layout class="d-flex flex-column align-center justify-center">
              <span>Type in the following word to delete your account:</span>
              <span class="font-weight-bold title">{{ user.domain }}</span>
              <span class="font-weight-bold subtitle-2">
                This action is irreversable
              </span>
              <v-text-field
                v-model="deletion_confirmation_text"
                outlined
                class="mt-3"
                rounded
                label="Enter text..."
              ></v-text-field>
              <v-btn
                :disabled="!deletion_btn"
                color="error"
                @click.stop="deleteAccount()"
              >
                <v-icon>mdi-delete</v-icon> Delete My Account
              </v-btn>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="email_valid_snackbar" color="success">
      {{ email_snack_msg }}
      <v-btn icon @click="email_valid_snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="email_error_snackbar" color="error">
      {{ email_snack_msg }}
      <v-btn icon @click="email_error_snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="password_valid_snackbar" color="success">
      {{ password_snack_msg }}
      <v-btn icon @click="password_valid_snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="password_error_snackbar" color="error">
      {{ password_snack_msg }}
      <v-btn icon @click="password_error_snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<style lang="scss" scoped>
.flipped-section {
  height: 100%;
  width: 100%;
}

.flipped-header-back-btn {
  width: 10%;
}

.flipped-header-title {
  width: 90%;
}

.flipped-section-wrapper {
  width: 100%;
  overflow: hidden;
}

.flipped-section-nav {
  width: 20%;
  height: 100%;
}

.flipped-section-content-wrapper {
  width: 80%;
  overflow: auto;
}

.flipped-section-content {
  width: 100%;
}

.site-name-header {
  font-size: 22px;
}
</style>
