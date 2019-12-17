<script>
import { mapState } from 'vuex'
import SiteSettings from '@/components/dashboard/site_settings'
import UserSettings from '@/components/dashboard/user_settings'
export default {
  name: 'site_settings',
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
  components: { SiteSettings, UserSettings },
  data() {
    return {
      site_parked: false,
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
      site_screenshot: '',
      dashboard_flipped: false,
      current_displayed_section: 'main',
      weekly_stats_avg: 0,
      weekly_autodraw: false,
      weekly_stats_data: [1],
      weekly_stats_labels: ['a'],
      last_visitor_time: `'tis a lonely road you walk...`,
      preview_images: [
        { id: 0, src: '/layout_images/kreoh_layout_1_fresh.png' },
        { id: 1, src: '/layout_images/kreoh_layout_1_slate.png' },
        { id: 2, src: '/layout_images/kreoh_layout_1_matrix.png' }
      ],
      current_preview_img: 0,
      preview_images_interval: '',
      website_delete_dialog: false
    }
  },
  computed: {
    ...mapState('dashboard', ['price_plans']),
    ...mapState('creator', ['site_props']),
    user() {
      return this.$store.state.auth.user
    },
    user_domain() {
      if (this.$axios.defaults.baseURL !== 'http://127.0.0.1:5000/') {
        return 'http://' + this.user.domain + '.kreoh-client.herokuapp.com/'
      } else {
        return 'http://' + this.user.domain + '.localhost:3000/'
      }
    }
  },
  watch: {
    dashboard_flipped(value) {
      if (value) {
        document.querySelector('#dashboard').style.transform = 'rotateY(180deg)'
      } else {
        document.querySelector('#dashboard').style.transform = 'none'
      }
    }
  },
  asyncData({ $axios }) {
    return $axios.$get('/helper/get_site_active').then((response) => {
      return {
        site_parked: response.site_parked,
        site_available: response.site_available
      }
    })
  },
  fetch({ store, $axios }) {
    return $axios.$get('/helper/auth_site_config').then((response) => {
      if (!response.site_not_created) {
        store.commit('creator/setSiteProps', response.site_config)
      }
    })
  },
  created() {
    this.$auth.fetchUser()
  },
  beforeUpdate() {
    this.site_screenshot =
      this.$axios.defaults.baseURL +
      'uploads/screenshot/' +
      this.user.domain +
      '.kreoh.com.png'
    if (this.site_available) {
      clearInterval(this.preview_images_interval)
    }
  },
  mounted() {
    this.$axios.$get('/stats/fetch_weekly').then((response) => {
      this.weekly_stats_data = response.values
      this.weekly_stats_labels = response.labels
      this.last_visitor_time = response.last_visitor_time
      this.weekly_stats_avg = response.avg
      this.weekly_stats_highest = response.highest
      this.weekly_autodraw = true
    })
    if (this.site_available) {
      this.site_screenshot =
        this.$axios.defaults.baseURL +
        'uploads/screenshot/' +
        this.user.domain +
        '.kreoh.com.png'
    }
    this.preview_images_interval = setInterval(() => {
      if (this.current_preview_img === 2) {
        this.current_preview_img = 0
      } else {
        this.current_preview_img += 1
      }
    }, 3500)
  },
  head() {
    return {
      title: 'Dashboard - Kreoh.com'
    }
  },
  methods: {
    deleteSite() {
      this.$axios
        .$post('/helper/delete_site', { domain: this.user.domain })
        .then((response) => {
          this.delete_msg = response.message
          this.delete_success = true
          this.$axios.$get('/helper/get_site_active').then((response) => {
            this.site_parked = response.site_parked
            this.site_available = response.site_available
          })
        })
        .catch(() => {
          this.delete_msg = 'Website could not be deleted.'
          this.delete_error = true
        })
        .then(() => {
          this.website_delete_dialog = false
          this.$axios.$get('/helper/get_site_active').then((response) => {
            this.site_parked = response.site_parked
            this.site_available = response.site_available
          })
          this.preview_images_interval = setInterval(() => {
            if (this.current_preview_img === 2) {
              this.current_preview_img = 0
            } else {
              this.current_preview_img += 1
            }
          }, 3500)
          this.site_screenshot = ''
        })
    },
    logout() {
      this.$auth.logout()
    },
    flipTo(section) {
      if (section !== 'main') {
        this.dashboard_flipped = true
      } else {
        this.dashboard_flipped = false
      }
      this.current_displayed_section = section
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
          <v-text-field
            class="dash-search mx-5 mt-1"
            dense
            outlined
            label="Search..."
            rounded
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-btn text nuxt>FAQ</v-btn>
          <v-btn text nuxt>Support</v-btn>
          <v-btn
            color="error"
            small
            outlined
            class="mx-2"
            @click.stop="logout()"
          >
            <v-icon>mdi-power</v-icon>
          </v-btn>
        </div>
      </v-layout>
      <v-layout
        class="dashboard-content-wrapper d-flex align-center justify-center ma-3"
      >
        <v-layout id="dashboard" class="elevation-15">
          <div class="dashboard-front px-4 py-2 d-flex">
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
                    <v-btn
                      class="ma-1"
                      color="info"
                      outlined
                      @click="flipTo('site_settings')"
                    >
                      Site Setings
                    </v-btn>
                    <v-btn
                      class="ma-1"
                      color="info"
                      outlined
                      @click="flipTo('user_settings')"
                    >
                      User Setings
                    </v-btn>
                  </div>
                </div>
                <div
                  class="gen-setting-item messages ma-2 pa-4 d-flex flex-column align-center elevation-2"
                >
                  <v-icon size="50" color="info">mdi-message</v-icon>
                  <div
                    v-if="temp_messages.length > 0"
                    class="messages-preview my-3"
                  >
                    <div
                      v-for="message in temp_messages"
                      :key="message.id"
                    ></div>
                  </div>
                  <div
                    v-else
                    class=" d-flex flex-column align-center justify-center my-3"
                  >
                    <span class="text-center">No Unread Messages</span>
                  </div>
                  <v-btn
                    class="align-self-center"
                    color="info"
                    outlined
                    @click="flipTo('messages')"
                  >
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
                  <v-btn
                    color="info"
                    small
                    outlined
                    @click="flipTo('subscriptions')"
                  >
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
                  {{ (user.domain + '.kreoh.com').toUpperCase() }}
                </span>
                <div
                  class="website-container d-flex flex-column justify-space-between align-center elevation-2 mb-2 pa-2 pb-4"
                >
                  <div
                    v-if="site_available"
                    class="website-preview-container d-flex align-center justify-center pt-2"
                  >
                    <v-img
                      class="website-img"
                      contain
                      :src="site_screenshot"
                    ></v-img>
                  </div>
                  <div
                    v-else
                    class="website-preview-container d-flex align-center justify-center pt-2"
                  >
                    <transition
                      enter-active-class="animated fadeIn"
                      leave-active-class="animated fadeOut"
                      mode="out-in"
                    >
                      <v-img
                        v-if="current_preview_img === 0"
                        key="0"
                        class="website-img"
                        contain
                        :src="preview_images[current_preview_img].src"
                      ></v-img>
                      <v-img
                        v-if="current_preview_img === 1"
                        key="1"
                        class="website-img"
                        contain
                        :src="preview_images[current_preview_img].src"
                      ></v-img>
                      <v-img
                        v-if="current_preview_img === 2"
                        key="2"
                        class="website-img"
                        contain
                        :src="preview_images[current_preview_img].src"
                      ></v-img>
                    </transition>
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
                      :disabled="site_parked"
                      color="info"
                      outlined
                      :href="user_domain"
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
                      @click.stop="website_delete_dialog = true"
                    >
                      <v-icon>mdi-delete-forever</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
              <div
                class="site-setting-stats-container d-flex justify-center align-center"
              >
                <v-card class="mt-3 mx-auto" width="45%">
                  <v-sheet
                    class="v-sheet--offset mx-auto"
                    elevation="12"
                    max-width="calc(100% - 32px)"
                  >
                    <v-sparkline
                      v-if="weekly_autodraw"
                      :labels="weekly_stats_labels"
                      :value="weekly_stats_data"
                      :auto-draw="weekly_autodraw"
                      gradient-direction="top"
                      :gradient="['#f72047', '#ffd200', '#1feaea']"
                      line-width="2"
                      padding="16"
                      stroke-linecap="round"
                      smooth="4"
                    ></v-sparkline>
                  </v-sheet>
                  <v-card-text class="pt-0">
                    <div class="title font-weight-light mb-2">
                      Site Visitors
                    </div>
                    <div class="subheading font-weight-light grey--text">
                      Weekly Average - {{ weekly_stats_avg }}
                      / visitors per week
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <v-icon class="mr-2" small>
                      mdi-clock
                    </v-icon>
                    <span class="caption grey--text font-weight-light">
                      last visitor {{ last_visitor_time }}
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
                      v-if="weekly_autodraw"
                      :labels="weekly_stats_labels"
                      :value="weekly_stats_data"
                      :auto-draw="weekly_autodraw"
                      gradient-direction="top"
                      :gradient="['#f72047', '#ffd200', '#1feaea']"
                      line-width="2"
                      padding="16"
                      stroke-linecap="round"
                      smooth="4"
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
          </div>
          <div class="dashboard-back d-flex">
            <keep-alive>
              <SiteSettings
                v-if="current_displayed_section === 'site_settings'"
                :site_available="site_available"
                :site_parked="site_parked"
                @flip="flipTo($event)"
              ></SiteSettings>
            </keep-alive>
            <keep-alive>
              <UserSettings
                v-if="current_displayed_section === 'user_settings'"
                @flip="flipTo($event)"
              ></UserSettings>
            </keep-alive>
            <v-layout v-if="current_displayed_section === 'messages'">
              <p>Messages</p>
            </v-layout>
            <v-layout v-if="current_displayed_section === 'subscriptions'">
              <p>Subscriptions</p>
            </v-layout>
          </div>
        </v-layout>
      </v-layout>
      <v-footer height="30" padless>
        <v-col class="text-center caption pa-0" cols="12">
          &#169; {{ new Date().getFullYear() }} — <strong>Kreoh</strong>
        </v-col>
      </v-footer>
    </v-layout>
    <v-dialog
      v-model="website_delete_dialog"
      width="500"
      transition="slide-y-transition"
    >
      <v-card>
        <v-card-title>Delete Your Account</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-layout class="d-flex flex-column align-center justify-center">
              <span>Are you sure you want to delete your website?</span>
              <span class="font-weight-bold subtitle-2">
                This action is irreversable
              </span>
              <span class="text-center">
                This will not delete any metrics associated with your domain.
              </span>
              <v-btn class="mt-3" color="error" @click.stop="deleteSite()">
                <v-icon>mdi-delete</v-icon> Delete My Account
              </v-btn>
              <v-btn
                class="mt-3"
                color="info"
                @click="website_delete_dialog = false"
              >
                Go Back
              </v-btn>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="delete_error" color="error">
      Error: Site Could Not Be Deleted!
      <v-btn icon @click="delete_error = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="delete_success" color="success">
      Website Deleted
      <v-btn icon @click="delete_success = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<style lang="scss" scoped>
.test {
  border: 1px solid red;
}

.dashboard-wrapper {
  padding: 0 !important;
  background: rgba(204, 231, 255, 1);
  background: -moz-linear-gradient(
    -45deg,
    rgba(204, 231, 255, 1) 0%,
    rgba(255, 255, 255, 0.59) 41%,
    rgba(255, 255, 255, 0) 100%
  );
  background: -webkit-gradient(
    left top,
    right bottom,
    color-stop(0%, rgba(204, 231, 255, 1)),
    color-stop(41%, rgba(255, 255, 255, 0.59)),
    color-stop(100%, rgba(255, 255, 255, 0))
  );
  background: -webkit-linear-gradient(
    -45deg,
    rgba(204, 231, 255, 1) 0%,
    rgba(255, 255, 255, 0.59) 41%,
    rgba(255, 255, 255, 0) 100%
  );
  background: -o-linear-gradient(
    -45deg,
    rgba(204, 231, 255, 1) 0%,
    rgba(255, 255, 255, 0.59) 41%,
    rgba(255, 255, 255, 0) 100%
  );
  background: -ms-linear-gradient(
    -45deg,
    rgba(204, 231, 255, 1) 0%,
    rgba(255, 255, 255, 0.59) 41%,
    rgba(255, 255, 255, 0) 100%
  );
  background: linear-gradient(
    135deg,
    rgba(204, 231, 255, 1) 0%,
    rgba(255, 255, 255, 0.59) 41%,
    rgba(255, 255, 255, 0) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(
    startColorstr='#cce7ff',
    endColorstr='#ffffff',
    GradientType=1
  );
}

.dashboard-topnav {
  height: 5%;
  background-color: #fafafa;
}

.logo-container {
  width: 60%;
  height: 100%;
  span {
    color: #0066ff;
    text-align: center;
    font-size: 20px;
  }
}

.links-container {
  width: 40%;
}

.dash-search {
  height: 100%;
}

.dashboard-content-wrapper {
  height: 95%;
}

.dashboard-container {
  padding: 0 !important;
  width: 100%;
  height: 100%;
  position: relative;
  perspective: 90%;
}

#dashboard {
  width: 85%;
  height: 85%;
  // margin: 60px 130px;
  background-color: #fafafa;
  // border-radius: 10px;
  position: absolute;
  transition: transform 1.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-style: preserve-3d;
}

.dashboard-back,
.dashboard-front {
  position: absolute;
  backface-visibility: hidden;
  background-color: #fafafa;
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.dashboard-back {
  transform: rotateY(180deg);
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
  height: 90%;
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
