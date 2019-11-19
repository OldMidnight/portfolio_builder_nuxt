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
      site_screenshot: null,
      stats_data: {
        '0': [],
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': []
      },
      stat_labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      autodraw: false
    }
  },
  computed: {
    ...mapState('dashboard', ['price_plans']),
    ...mapState('creator', ['site_props']),
    user() {
      return this.$store.state.auth.user
    },
    stats_value() {
      const value = []
      for (const visit in this.stats_data) {
        value.push(this.stats_data[visit].length)
      }
      return value
    },
    recent_visitor() {
      const dateTime = new Date()
      let day
      switch (dateTime.getDay()) {
        case 0:
          day = 6
          break

        default:
          day = dateTime.getDay() - 1
          break
      }
      while (day !== 0) {
        if (this.stats_data[day.toString()].length === 0) {
          day--
        } else {
          break
        }
      }
      const dayData = this.stats_data[day.toString()]
      const lastVisitorStat = new Date(dayData[dayData.length - 1])

      const dateDiffTime = Math.abs(dateTime - lastVisitorStat)
      let dateDiff

      if (dateDiffTime / 1000 < 60) {
        dateDiff =
          'about ' + Math.ceil(dateDiffTime / 1000).toString() + ' seconds'
      } else if (dateDiffTime / 1000 / 60 < 60) {
        dateDiff =
          'about ' +
          Math.floor(dateDiffTime / 1000 / 60).toString() +
          ' minutes'
      } else if (dateDiffTime / 1000 / 60 / 60 < 24) {
        dateDiff =
          'about ' +
          Math.floor(dateDiffTime / 1000 / 60 / 60).toString() +
          ' hours'
      } else {
        dateDiff =
          'about ' +
          Math.floor(dateDiffTime / (1000 * 60 * 60 * 24)).toString() +
          ' days'
      }

      return dateDiff
    }
  },
  asyncData({ $axios }) {
    return $axios.$get('/helper/get_site_active').then((response) => {
      return {
        enableSite: response.site_active,
        site_available: response.site_available
      }
    })
  },
  // beforeCreate() {
  //   if (this.site_available) {
  //     this.$axios.$get('/stats/fetch_weekly').then((response) => {
  //       this.stats_data = response
  //     })
  //   }
  //   this.$auth.fetchUser()
  // },
  created() {
    this.$auth.fetchUser()
    this.site_screenshot = this.site_available
      ? 'http://127.0.0.1:5000/uploads/screenshot/' +
        this.user.domain +
        '.kreoh.com.png'
      : '/layout_images/Layout_1_img.png'
  },
  mounted() {
    if (this.site_available) {
      this.$axios.$get('/stats/fetch_weekly').then((response) => {
        this.stats_data = response
      })
    }
    this.autodraw = true
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
    },
    logout() {
      this.$auth.logout()
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
          <v-btn color="error" small outlined class="mx-2" @click="logout()">
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
            class="site-settings-container d-flex flex-column justify-center align-center px-2 pb-2"
          >
            <div
              class="site-setting-website-container d-flex flex-column justify-center align-center"
            >
              <span class="site-name font-weight-bold mb-2">
                {{ user.domain }}.kreoh.com
              </span>
              <div
                class="website-container d-flex flex-column justify-space-between align-center elevation-2 mb-2 pa-2 pb-4"
              >
                <div
                  class="website-preview-container d-flex flex-column align-center justify-center pt-2"
                >
                  <v-img
                    class="website-img"
                    contain
                    :src="site_screenshot"
                  ></v-img>
                </div>
                <div
                  class="website-actions-container d-flex justify-space-around align-center mt-2"
                >
                  <v-switch
                    v-model="enableSite"
                    :label="enableSite ? 'Enabled' : 'Disabled'"
                    inset
                    :disabled="!site_available"
                    @change="activateSite()"
                  ></v-switch>
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
              <!-- <div
                v-if="user.site_created"
                class="site-stat ma-2 d-flex flex-column align-center justify-space-between py-5 px-8 elevation-2"
              >
                <span class="font-weight-bold">Weekly Visitors</span>
                <v-sparkline
                  :value="stats_value"
                  :labels="stat_labels"
                  label-size="9"
                  auto-draw
                  padding="10"
                  smooth="15"
                  gradient-direction="top"
                  :gradient="['#f72047', '#ffd200', '#1feaea']"
                  stroke-linecap="round"
                ></v-sparkline>
              </div>
              <div
                v-else
                class="site-stat ma-2 elevation-2 d-flex flex-column align-center justify-center px-12"
              >
                <span class="text-center">
                  Create A Site First To See Some Colorful Stats!
                </span>
              </div> -->
              <v-card class="mt-3 mx-auto" width="45%">
                <v-sheet
                  class="v-sheet--offset mx-auto"
                  elevation="12"
                  max-width="calc(100% - 32px)"
                >
                  <v-sparkline
                    :labels="autodraw ? stat_labels : ['a']"
                    :value="autodraw ? stats_value : ['a']"
                    :auto-draw="autodraw"
                    gradient-direction="top"
                    :gradient="['#f72047', '#ffd200', '#1feaea']"
                    line-width="2"
                    padding="16"
                  ></v-sparkline>
                </v-sheet>
                <v-card-text class="pt-0">
                  <div class="title font-weight-light mb-2">
                    Site Visitors
                  </div>
                  <div class="subheading font-weight-light grey--text">
                    Weekly Traction
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <v-icon class="mr-2" small>
                    mdi-clock
                  </v-icon>
                  <span class="caption grey--text font-weight-light">
                    last visitor {{ recent_visitor }} ago
                  </span>
                </v-card-text>
              </v-card>
              <v-card class="mt-3 mx-auto" width="45%">
                <v-sheet
                  class="v-sheet--offset mx-auto"
                  elevation="12"
                  max-width="calc(100% - 32px)"
                >
                  <v-sparkline
                    :labels="autodraw ? stat_labels : []"
                    :value="autodraw ? stats_value : []"
                    :auto-draw="autodraw"
                    gradient-direction="top"
                    :gradient="['#f72047', '#ffd200', '#1feaea']"
                    line-width="2"
                    padding="16"
                  ></v-sparkline>
                </v-sheet>
                <v-card-text class="pt-0">
                  <div class="title font-weight-light mb-2">
                    User Registrations
                  </div>
                  <div class="subheading font-weight-light grey--text">
                    Last Campaign Performance
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <v-icon class="mr-2" small>
                    mdi-clock
                  </v-icon>
                  <span class="caption grey--text font-weight-light">
                    last registration 26 minutes ago
                  </span>
                </v-card-text>
              </v-card>
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
  height: 65%;
}

.site-setting-stats-container {
  width: 100%;
  height: 35%;
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
  height: 10%;
}

.website-container {
  width: 90%;
  height: 80%;
  background-color: #fafafa;
  border-radius: 5px;
}

.website-preview-container {
  width: 75%;
  height: 90%;
}

.website-img {
  width: 100%;
  height: 80%;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
}

.website-actions-container {
  height: 10%;
  width: 70%;
  button {
    background-color: #fafafa;
  }
  // border: 1px solid #e6e6e6;
}

.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
