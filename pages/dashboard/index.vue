<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      enableSite: false,
      site_available: false,
      sidenav: true,
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' }
      ],
      delete_error: false,
      delete_success: false,
      delete_msg: {},
      temp_messages: [],
      links: ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us'],
      site_screenshot: null
    }
  },
  computed: {
    ...mapState('dashboard', ['price_plans']),
    user() {
      return this.$store.state.auth.user
    }
  },
  beforeCreate() {
    this.$axios.$get('/helper/get_site_active').then((response) => {
      this.enableSite = response.site_active
      this.site_available = response.site_available
    })
  },
  created() {
    this.site_screenshot =
      'http://127.0.0.1:5000/uploads/screenshot/' +
      this.user.domain +
      '.kreoh.com.png'
  },
  head() {
    return {
      title: 'Dashboard - Kreoh.com'
    }
  },
  methods: {
    ...mapActions({
      logout: 'user_auth/logout'
    }),
    activateSite() {
      this.$axios.$post('/helper/site_config/site_activation')
    },
    deleteSite() {
      this.$axios.$post('/helper/delete_site').then((response) => {
        this.delete_msg = response
        if (response.error) {
          this.delete_error = true
        } else if (response.success) {
          this.delete_success = true
        }
      })
      this.$axios.$get('/helper/get_site_active').then((response) => {
        this.enableSite = response.site_active
        this.site_available = response.site_available
      })
    }
  }
}
</script>

<template>
  <v-container class="dashboard-wrapper" fluid fill-height>
    <v-layout class="dashboard-container d-flex flex-column">
      <v-layout class="dashboard-topnav elevation-3 px-5 d-flex">
        <div class="logo-container d-flex align-center">
          <span class="logo font-weight-bold">Kreoh.com</span>
        </div>
        <div class="links-container d-flex align-center justify-end">
          <v-btn text nuxt>FAQ</v-btn>
          <v-btn text nuxt>Support</v-btn>
          <v-btn
            color="error"
            icon
            small
            nuxt
            replace
            to="/auth/logout"
            outlined
            class="mx-2"
          >
            <v-icon>mdi-power</v-icon>
          </v-btn>
        </div>
      </v-layout>
      <v-layout
        class="dashboard-content-wrapper d-flex align-center justify-center ma-3"
      >
        <v-layout class="dashboard px-4 py-2 d-flex elevation-4">
          <div class="general-settings-container">
            <div
              class="general-setting-wrapper d-flex flex-column align-center justify-center pa-2"
            >
              <div
                class="gen-setting-item ma-2 pa-4 d-flex flex-column align-center justify-center elevation-2"
              >
                <v-icon size="50" color="success">mdi-settings</v-icon>
                <div
                  class="d-flex flex-column justify-center align-center my-2"
                >
                  <v-btn class="ma-1" color="info" x-small outlined>
                    Site Setings
                  </v-btn>
                  <v-btn class="ma-1" color="info" x-small outlined>
                    User Setings
                  </v-btn>
                </div>
                <v-text-field
                  class="mx-5"
                  dense
                  outlined
                  label="Search..."
                  prepend-inner-icon="mdi-magnify"
                ></v-text-field>
              </div>
              <div
                class="gen-setting-item messages ma-2 pa-4 d-flex flex-column align-center elevation-2"
              >
                <v-icon size="50" color="info">mdi-message</v-icon>
                <div
                  v-if="temp_messages.length > 0"
                  class="messages-preview my-3"
                >
                  <div v-for="message in temp_messages" :key="message.id"></div>
                </div>
                <div
                  v-else
                  class=" d-flex flex-column align-center justify-center my-3"
                >
                  <span class="text-center">No Unread Messages</span>
                </div>
                <v-btn class="align-self-center" color="info" outlined>
                  Messages
                </v-btn>
              </div>
              <div
                class="gen-setting-item ma-2 pa-4 d-flex flex-column align-center justify-space-around elevation-2"
              >
                <v-icon size="50" color="#FDD835">mdi-star</v-icon>
                <span class="font-weight-light my-3">
                  Account Type: {{ user.account_type }}
                </span>
                <span class="font-weight-light mb-3">
                  Monthly Cost: &euro; {{ price_plans[user.account_type] }}
                </span>
                <v-btn color="info" small outlined>
                  {{
                    user.account_type === 'Free' ? 'Upgrade' : 'Subscription'
                  }}
                </v-btn>
              </div>
            </div>
          </div>
          <div
            class="site-settings-container d-flex flex-column justify-center align-center pa-2"
          >
            <div
              class="site-setting-website-container d-flex flex-column justify-center align-center"
            >
              <span class="site-name font-weight-bold my-2">
                {{ user.domain }}.kreoh.com
              </span>
              <div
                class="website-container d-flex flex-column justify-center align-center elevation-2 mb-2 pa-2"
              >
                <div
                  class="website-preview-container d-flex flex-column align-center justify-center pa-3"
                >
                  <v-img class="website-img" :src="site_screenshot"></v-img>
                </div>
                <div
                  class="website-actions-container d-flex justify-space-around align-center"
                >
                  <v-btn
                    v-if="site_available"
                    outlined
                    color="info"
                    href="/editor"
                  >
                    <v-icon>mdi-pencil</v-icon> Edit
                  </v-btn>
                  <v-btn
                    :disabled="!enableSite"
                    color="info"
                    outlined
                    :href="`http://${user.domain}.localhost:3000/`"
                    target="_blank"
                  >
                    <v-icon>mdi-open-in-new</v-icon> Visit
                  </v-btn>
                  <v-btn v-if="!site_available" color="info" href="/creator">
                    <v-icon>mdi-plus</v-icon> Create
                  </v-btn>
                  <v-btn
                    v-if="site_available"
                    color="error"
                    outlined
                    @click="deleteSite()"
                  >
                    <v-icon>mdi-delete-forever</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
            <div
              class="site-setting-stats-container d-flex justify-center align-center"
            >
              <div class="site-stat ma-2 elevation-2"></div>
              <div class="site-stat ma-2 elevation-2"></div>
            </div>
          </div>
        </v-layout>
      </v-layout>
      <v-footer height="50" padless>
        <v-col class="text-center" cols="12">
          &#169; {{ new Date().getFullYear() }} — <strong>Kreoh</strong>
        </v-col>
      </v-footer>
    </v-layout>
  </v-container>
  <!-- <v-container
    text-xs-center
    fluid
    justify-center
    fill-height
    class="dashboard-container pa-0 ma-0"
  >
    <v-layout column>
      <v-toolbar color="info" class="dash-toolbar">
        <v-toolbar-title>Kreoh</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn class="dash-links" text>Support</v-btn>
          <v-btn class="dash-links" text>FAQ</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-layout class="main-container">
        <v-layout class="sidenav-container"></v-layout>

        <v-layout class="content-container d-flex flex-column align-center">
          <v-switch
            v-model="enableSite"
            :label="`Enable Site - ` + user.domain + `.kreoh.com`"
            inset
            :disabled="!site_available"
            @change="activateSite()"
          ></v-switch>

          <v-spacer></v-spacer>

          <v-btn v-if="site_available" color="info" href="/editor">
            Edit {{ user.domain }}.kreoh.com
          </v-btn>
          <v-btn
            :disabled="!enableSite"
            color="info"
            :href="`http://${user.domain}.localhost:3000/`"
            target="_blank"
          >
            Visit {{ user.domain }}.kreoh.com
          </v-btn>
          <v-btn v-if="!site_available" color="info" href="/creator">
            Create {{ user.domain }}.kreoh.com
          </v-btn>
          <v-btn v-if="site_available" color="error" @click="deleteSite()">
            Delete {{ user.domain }}.kreoh.com
          </v-btn>
          <v-btn color="error" href="/auth/logout">Logout</v-btn>
        </v-layout>
      </v-layout>
    </v-layout>
    <v-snackbar v-model="delete_error" color="error">
      {{ delete_msg.error }}
      <v-btn icon @click="delete_error = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="delete_success" color="success">
      {{ delete_msg.success }}
      <v-btn icon @click="delete_success = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container> -->
</template>

<style lang="scss" scoped>
.test {
  border: 1px solid red;
}

.dashboard-wrapper {
  padding: 0 !important;
  // background-color: #eeeeee;
  // background: rgba(177, 209, 246, 1);
  // background: -moz-linear-gradient(
  //   -45deg,
  //   rgba(177, 209, 246, 1) 0%,
  //   rgba(246, 250, 254, 1) 47%,
  //   rgba(246, 250, 254, 1) 63%
  // );
  background: rgba(204, 231, 255, 1);
  background: -moz-linear-gradient(
    -45deg,
    rgba(204, 231, 255, 1) 0%,
    rgba(255, 255, 255, 0.59) 41%,
    rgba(255, 255, 255, 0) 100%
  );
}

.dashboard-topnav {
  height: 5%;
  background-color: #fafafa;
}

.logo-container {
  width: 80%;
  height: 100%;
  span {
    color: #0066ff;
    text-align: center;
    font-size: 20px;
  }
}

.links-container {
  width: 20%;
}

.dashboard-content-wrapper {
  height: 95%;
}

.dashboard-container {
  padding: 0 !important;
  width: 100%;
  height: 100%;
  position: relative;
}

.dashboard {
  width: 80%;
  height: 80%;
  // margin: 60px 130px;
  background-color: #fafafa;
  border-radius: 20px;
  // background: rgba(177, 209, 246, 1);
  // background: -moz-linear-gradient(
  //   -45deg,
  //   rgba(177, 209, 246, 1) 0%,
  //   rgba(246, 250, 254, 1) 47%,
  //   rgba(246, 250, 254, 1) 63%
  // );
  position: absolute;
}

.general-settings-container {
  width: 20%;
  height: 100%;
  border-right: 1px solid #e6e6e6;
  overflow: auto;
}

.general-settings-wrapper {
  position: absolute;
}

.gen-setting-item {
  width: 100%;
  background-color: #fafafa;
  border-radius: 10px;
}

.messages {
  // min-height: 500px;
  max-height: 500px;
  overflow: auto;
}

.messages-preview {
  overflow: auto;
}

.site-settings-container {
  width: 80%;
}

.site-setting-website-container {
  width: 100%;
  height: 70%;
}

.site-setting-stats-container {
  width: 100%;
  height: 30%;
}

.site-stat {
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  border-radius: 20px;
}

.site-name {
  font-size: 30px;
  color: #0066ff;
  height: 20%;
}

.website-container {
  width: 90%;
  height: 80%;
  background-color: #fafafa;
  border-radius: 20px;
}

.website-preview-container {
  width: 100%;
  height: 90%;
}

.website-img {
  width: 80%;
  height: 80%;
  border-radius: 10px;
}

.website-actions-container {
  height: 10%;
  width: 40%;
  button {
    background-color: #fafafa;
  }
  // border: 1px solid #e6e6e6;
}
</style>
