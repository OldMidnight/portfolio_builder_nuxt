<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'UserSettings',
  layout: 'dashboard_layout',
  data() {
    return {
      rules: {
        required: (value) => !!value || 'Required',
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
        min: (v) => (v || '').length >= 8 || 'Min 8 characters',
        max: (v) => (v || '').length <= 128 || 'Max 128 characters'
      },
      current_password: '',
      new_password_1: '',
      new_password_2: '',
      passwordValidating: false,
      account_delete_dialog: false,
      deletion_confirmation_text: '',
      deletion_btn: false,
      upload_image_types: [
        'image/png',
        'image/bmp',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/svg+xml',
        'image/vnd.microsoft.icon',
        'image/x-icon'
      ],
      upload_delete_dialog: false,
      file_to_del: null,
      show: false,
      show2: false,
      show3: false,
      deleteUploadLoading: false,
      deletionLoading: false
    }
  },
  computed: {
    ...mapGetters({
      userUploads: 'creator/userUploads',
      userStorage: 'creator/userStorage'
    }),
    password_snack_msg() {
      return this.password_message
    },
    storage_percent() {
      return Math.ceil(
        (this.userStorage.current_storage_space /
          this.userStorage.max_storage_space) *
          100
      )
    }
  },
  watch: {
    deletion_confirmation_text(value) {
      if (value === this.$auth.user.domain) {
        this.deletion_btn = true
      } else {
        this.deletion_btn = false
      }
    }
  },
  created() {
    this.fetchUserUploads({ root: this.$root })
  },
  methods: {
    ...mapActions({
      fetchUserUploads: 'creator/fetchUserUploads',
      deleteFile: 'functions/deleteFile'
    }),
    async deleteUserUpload() {
      this.deleteUploadLoading = true
      await this.deleteFile({ url: this.file_to_del, root: this.$root })
      this.deleteUploadLoading = false
      this.upload_delete_dialog = false
    },
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes'
      const k = 1000
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / k ** i).toFixed(dm)) + ' ' + sizes[i]
    },
    scrollTo(id) {
      const el = document.getElementById(id)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    async validatePassword() {
      this.passwordValidating = true
      if (
        this.$refs.passwordChangeForm.validate() &&
        this.new_password_1 === this.new_password_2 &&
        this.current_password !== this.new_password_1
      ) {
        const { data } = await this.$axios
          .post('/u/password_change', {
            current_password: this.current_password,
            new_password: this.new_password_1
          })
          .catch((e) => {
            const error = JSON.parse(JSON.stringify(e))
            return error.response
          })
        this.$root.$emit(
          data.error ? 'showError' : !data.error ? 'showSuccess' : 'showError',
          { message: data.message }
        )
        if (!data.error) {
          this.$refs.passwordChangeForm.reset()
        }
      } else {
        this.$root.$emit('showError', { message: 'Inavlid details.' })
      }
      this.passwordValidating = false
    },
    async deleteAccount() {
      this.deletionLoading = true
      if (this.deletion_confirmation_text === this.$auth.user.domain) {
        const { data } = await this.$axios
          .post('/u/delete_account')
          .catch((e) => {
            const error = JSON.parse(JSON.stringify(e))
            return error.response
          })
        if (data.error) {
          this.$root.$emit('showError', { message: data.message })
        } else {
          const refreshToken = this.$auth.getRefreshToken('local')
          await this.$axios.$post('/logout').then(async (_) => {
            this.$axios.setToken('Bearer ' + refreshToken)
            await this.$axios.$post('/logout_refresh')
          })
          this.$auth.logout()
        }
      }
      this.deletionLoading = false
      this.account_delete_dialog = false
      this.deletion_confirmation_text = null
    }
  },
  head() {
    return {
      title: 'User Settings - Kreoh'
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
        <v-btn
          tile
          :color="`${$auth.user.dark_mode ? '' : '#ECEFF1'}`"
          width="100%"
          class="site-setting-nav-btn pa-9 elevation-0"
          @click="scrollTo('change_password_section')"
        >
          Change Password
        </v-btn>
        <v-btn
          :color="`${$auth.user.dark_mode ? '' : '#ECEFF1'}`"
          tile
          width="100%"
          class="site-setting-nav-btn pa-9 elevation-0"
          @click="scrollTo('uploads_section')"
        >
          Manage Uploads
        </v-btn>
        <v-btn
          tile
          :color="`${$auth.user.dark_mode ? '' : '#ECEFF1'}`"
          width="100%"
          class="site-setting-nav-btn pa-9 elevation-0"
          @click="scrollTo('del_acc_section')"
        >
          Delete Account
        </v-btn>
      </div>
      <div class="flipped-section-content-wrapper px-6">
        <div class="flipped-section-content mb-3 mt-10">
          <span
            id="change_password_section"
            class="headline ml-4 my-3 font-weight-light"
          >
            Change Password
          </span>
          <p class="caption font-weight-bold">
            Note: Your password must be at least 8 character long and contain
            the following:
          </p>
          <ul>
            <li class="caption font-weight-bold">At least 1 digit.</li>
            <li class="caption font-weight-bold">
              At least 1 uppercase letter.
            </li>
          </ul>
          <v-form
            ref="passwordChangeForm"
            class="d-flex flex-column justify-center align-center mt-4"
          >
            <v-text-field
              v-model="current_password"
              outlined
              autocomplete="current-password"
              label="Current Password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              :rules="[rules.required, rules.min, rules.max]"
              @click:append="show = !show"
            ></v-text-field>
            <v-text-field
              v-model="new_password_1"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              autocomplete="new-password"
              :rules="[
                rules.required,
                rules.min,
                rules.max,
                rules.hasDigit,
                rules.hasUppercase,
                rules.noWhitespace
              ]"
              outlined
              label="New Password"
              @click:append="show2 = !show2"
            ></v-text-field>
            <v-text-field
              v-model="new_password_2"
              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show3 ? 'text' : 'password'"
              autocomplete="new-password"
              :rules="[
                rules.required,
                rules.min,
                rules.max,
                rules.hasDigit,
                rules.hasUppercase,
                rules.noWhitespace
              ]"
              outlined
              label="Confirm New Password"
              @click:append="show3 = !show3"
            ></v-text-field>
            <v-btn
              :disabled="passwordValidating"
              color="success"
              rounded
              :loading="passwordValidating"
              @click="validatePassword()"
              @keypress.enter="validatePassword()"
            >
              Change Password
            </v-btn>
          </v-form>
        </div>
        <div class="flipped-section-content mb-3 mt-10">
          <span
            id="uploads_section"
            class="headline ml-4 my-3 font-weight-light"
          >
            Manage Uploads
          </span>
          <v-row class="ma-0 mt-3 w-100 rounded elevation-2">
            <v-col cols="12" class="pa-0">
              <p class="title ma-0">Available space:</p>
            </v-col>
            <v-col cols="12" class="">
              <v-progress-linear
                background-color="error"
                color="success"
                :value="storage_percent"
                rounded
                height="20"
              >
                <template>
                  <p class="font-weight-bold caption">
                    {{ formatBytes(userStorage.current_storage_space) }}
                    /
                    {{ formatBytes(userStorage.max_storage_space) }}
                  </p>
                </template>
              </v-progress-linear>
            </v-col>
            <v-col cols="12" class="">
              <v-row justify="center" align="center" class="ma-0">
                <v-col
                  v-for="(upload, index) in userUploads"
                  :key="index"
                  cols="6"
                  class="border-rounded elevation-1"
                >
                  <v-row class="ma-0">
                    <v-col cols="2" class="d-flex justify-center align-center">
                      <v-icon
                        v-if="upload_image_types.includes(upload.type)"
                        color="info"
                        x-large
                      >
                        mdi-image
                      </v-icon>
                      <v-icon v-else color="info" x-large>
                        mdi-file-document-outline
                      </v-icon>
                    </v-col>
                    <v-col cols="8">
                      <v-row class="text-center ma-0">
                        <v-col cols="12" class="px-0 py-1">
                          <p><strong>File name:</strong> {{ upload.name }}</p>
                        </v-col>
                        <v-col cols="12" class="px-0 py-1">
                          <p><strong>File size:</strong> {{ upload.size }}</p>
                        </v-col>
                        <v-col cols="12" class="px-0 py-1">
                          <p>
                            <strong>Uploaded:</strong> {{ upload.upload_date }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="2"
                      class="d-flex flex-column justify-center align-center"
                    >
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="info"
                            icon
                            x-large
                            class="my-1"
                            :href="
                              $axios.defaults.baseURL +
                                '/uploads/user-content/' +
                                upload.url
                            "
                            target="_blank"
                            v-on="on"
                          >
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>View</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="error"
                            icon
                            x-large
                            class="my-1"
                            v-on="on"
                            @click="
                              file_to_del = upload.url
                              upload_delete_dialog = true
                            "
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="userUploads.length === 0" cols="12">
                  <p class="title">No files uploaded.</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="flipped-section-content mb-3 mt-10">
          <div
            id="del_acc_section"
            class="d-flex flex-column justify-center align-center mt-4"
          >
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
              <span class="font-weight-bold title">
                {{ $auth.user.domain }}
              </span>
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
                :disabled="!deletion_btn || deletionLoading"
                :loading="deletionLoading"
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
    <v-dialog
      v-model="upload_delete_dialog"
      width="500"
      transition="slide-y-transition"
    >
      <v-card>
        <v-card-title>Delete Upload</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-layout class="d-flex flex-column align-center justify-center">
              <span class="font-weight-bold text-center">
                You MAY have this file in use on your website. Deleting it will
                prevent it from loading. Do you want to continue?
              </span>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="info"
            @click.stop="
              file_to_del = null
              upload_delete_dialog = false
            "
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="deleteUploadLoading"
            :loading="deleteUploadLoading"
            color="error"
            @click.stop="deleteUserUpload()"
          >
            Yes, Delete This file
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
