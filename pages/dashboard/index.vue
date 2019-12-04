<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
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
      site_screenshot: '/layout_images/Layout_1_img.png',
      weekly_stats_data: [1],
      weekly_stats_labels: ['a'],
      weekly_stats_avg: 0,
      weekly_stats_highest: 'calculating...',
      last_visitor_time: 'calculating...',
      hourly_stats_data: [1],
      hourly_stats_labels: ['a'],
      hourly_stats_avg: 0,
      hourly_stats_highest: 'calculating...',
      monthly_stats_data: [1],
      monthly_stats_labels: ['a'],
      monthly_stats_avg: 0,
      monthly_stats_highest: 'calculating...',
      weekly_autodraw: false,
      hourly_autodraw: false,
      monthly_autodraw: false,
      dashboard_flipped: false,
      current_displayed_section: 'main',
      favicon_dialog_link: false,
      favicon_url: null,
      validated_favicon_url: null,
      favicon_url_error: false,
      favicon_dialog_upload: false,
      favicon_file: null
    }
  },
  computed: {
    ...mapState('dashboard', ['price_plans']),
    ...mapState('creator', ['site_props']),
    user() {
      return this.$store.state.auth.user
    },
    userFavicon() {
      if (this.site_props.favicon.use) {
        return this.site_props.favicon.link
      } else {
        return this.validated_favicon_url !== null
          ? this.validated_favicon_url
          : '/favicon.ico'
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
  mounted() {
    if (this.site_available) {
      this.$axios.$get('/stats/fetch_weekly').then((response) => {
        this.weekly_stats_data = response.values
        this.weekly_stats_labels = response.labels
        this.last_visitor_time = response.last_visitor_time
        this.weekly_stats_avg = response.avg
        this.weekly_stats_highest = response.highest
        this.weekly_autodraw = true
      })
      this.site_screenshot =
        'http://http://kreoh-api.herokuapp.com//uploads/screenshot/' +
        this.user.domain +
        '.kreoh.com.png'
    }
  },
  head() {
    return {
      title: 'Dashboard - Kreoh.com'
    }
  },
  methods: {
    ...mapActions({
      logout: 'user_auth/logout',
      updateWebsite: 'creator/updateWebsite'
    }),
    ...mapMutations({
      setFavicon: 'creator/setFavicon'
    }),
    validateFavicon() {
      this.getValidatedFavicon().then((result) => {
        this.validated_favicon_url = result.value
        if (!result.error) {
          this.setFavicon({
            use: true,
            link: this.validated_favicon_url
          })
          this.updateWebsite(this.site_props)
        }
      })
    },
    async getValidatedFavicon() {
      const validation = await this.$axios
        .get(this.favicon_url)
        .then((response) => {
          console.log(response.config)
          if (
            response.headers['content-type'] === 'image/vnd.microsoft.icon' ||
            response.headers['content-type'] === 'image/x-icon'
          ) {
            this.favicon_dialog_link = false
            return { error: false, value: this.favicon_url }
          } else {
            this.favicon_url_error = true
            return { error: true, value: 'Invalid Image URL.' }
          }
        })
        .catch((error) => {
          this.favicon_url_error = true
          return { error: true, value: error }
        })
      return validation
    },
    activateSite() {
      this.$axios.$post('/helper/site_config/site_activation')
    },
    deleteSite() {
      this.$axios
        .$post('/helper/delete_site', { domain: this.user.domain })
        .then((response) => {
          this.delete_msg = response
          if (response.error) {
            this.delete_error = true
          } else if (response.success) {
            this.delete_success = true
          }
        })
      this.$axios.$get('/helper/get_site_active').then((response) => {
        this.site_parked = response.site_parked
        this.site_available = response.site_available
      })
      this.site_screenshot = '/layout_images/Layout_1_img.png'
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
      if (section === 'site_settings') {
        this.$axios.$get('/stats/fetch_hourly').then((response) => {
          this.hourly_stats_data = response.values
          this.hourly_stats_labels = response.labels
          this.hourly_stats_avg = response.avg
          this.hourly_stats_highest = response.highest
          this.hourly_autodraw = true
        })
        this.$axios.$get('/stats/fetch_monthly').then((response) => {
          this.monthly_stats_data = response.values
          this.monthly_stats_labels = response.labels
          this.monthly_stats_avg = response.avg
          this.monthly_stats_highest = response.highest
          this.monthly_autodraw = true
        })
      }
    },
    scrollTo(id) {
      const el = document.getElementById(id)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    async uploadFavicon() {
      const formData = new FormData()
      formData.append('favicon', this.favicon_file)
      const url = 'http://http://kreoh-api.herokuapp.com//uploads/favicon/set'
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      await this.$axios({
        method: 'post',
        url,
        data: formData,
        config
      }).then(() => {
        this.favicon_dialog_upload = false
        this.setFavicon({
          use: true,
          link:
            'http://http://kreoh-api.herokuapp.com//uploads/favicon/' +
            this.user.id +
            '_' +
            this.user.domain +
            '_' +
            this.favicon_file.name
        })
        this.updateWebsite(this.site_props)
        this.favicon_file = null
      })
    },
    resetFavicon() {
      this.$axios.$post('/uploads/favicon/delete', {
        filename: this.site_props.favicon.link.split('/')[5]
      })
      this.setFavicon({
        use: false,
        link: null
      })
      this.updateWebsite(this.site_props)
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
        <v-layout id="dashboard" class="elevation-4">
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
                      x-small
                      outlined
                      @click="flipTo('site_settings')"
                    >
                      Site Setings
                    </v-btn>
                    <v-btn
                      class="ma-1"
                      color="info"
                      x-small
                      outlined
                      @click="flipTo('user_settings')"
                    >
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
                      @click.stop="deleteSite()"
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
            <v-layout
              v-if="current_displayed_section === 'site_settings'"
              class="flipped-section d-flex flex-column px-4 py-9"
            >
              <div
                class="flipped-section-header d-flex justify-start align-center elevation-1 pl-6 py-3"
              >
                <div class="flipped-header-back-btn">
                  <v-btn
                    elevation="2"
                    rounded
                    color="info"
                    @click="flipTo('main')"
                  >
                    Back
                  </v-btn>
                </div>
                <div
                  class="flipped-header-title d-flex justify-space-between pr-10"
                >
                  <span class="headline font-weight-light">
                    Website Settings
                  </span>
                  <span class="font-weight-bold site-name-header">
                    Kreoh
                  </span>
                </div>
              </div>
              <div
                class="flipped-section-wrapper my-2 section-stats d-flex elevation-1"
              >
                <div class="flipped-section-nav elevation-1 d-flex flex-column">
                  <span class="font-weight-bold text-center my-5">
                    Navigation
                  </span>
                  <v-btn
                    color="#ECEFF1"
                    depressed
                    width="100%"
                    class="site-setting-nav-btn pa-9"
                    @click="scrollTo('metrics_section')"
                  >
                    Metrics
                  </v-btn>
                  <v-btn
                    depressed
                    color="#ECEFF1  "
                    width="100%"
                    class="site-setting-nav-btn pa-9"
                    @click="scrollTo('functionality_section')"
                  >
                    Functionality
                  </v-btn>
                </div>
                <div class="flipped-section-content-wrapper px-6">
                  <div class="flipped-section-content mt-4">
                    <span
                      id="metrics_section"
                      class="display-1 ml-4 mt-3 font-weight-light"
                    >
                      Metrics
                    </span>
                    <v-card class="mx-2 my-2" max-width="80%">
                      <v-card-subtitle>Hourly Vistor Count</v-card-subtitle>
                      <v-card-text>
                        <v-sheet>
                          <v-sparkline
                            v-if="hourly_autodraw"
                            :labels="hourly_stats_labels"
                            :value="hourly_stats_data"
                            :auto-draw="hourly_autodraw"
                            gradient-direction="top"
                            :gradient="['#f72047', '#ffd200', '#1feaea']"
                            line-width="2"
                            padding="16"
                            stroke-linecap="round"
                            smooth="4"
                            width="500"
                          ></v-sparkline>
                        </v-sheet>
                      </v-card-text>
                      <v-card-text>
                        <div class="stat-labels d-flex flex-column">
                          <span class="title">Details:</span>
                          <span class="font-weight-light">
                            Highest for period: {{ hourly_stats_highest }}
                          </span>
                          <span class="font-weight-light">
                            Average for period: {{ hourly_stats_avg }}
                          </span>
                        </div>
                      </v-card-text>
                    </v-card>

                    <v-card class="mx-2 my-2" max-width="80%">
                      <v-card-subtitle>Daily Vistor Count</v-card-subtitle>
                      <v-card-text>
                        <v-sheet>
                          <v-sparkline
                            v-if="weekly_autodraw"
                            :labels="weekly_stats_labels"
                            :value="weekly_stats_data"
                            :auto-draw="weekly_autodraw"
                            gradient-direction="top"
                            :gradient="['#f72047', '#ffd200', '#1feaea']"
                            line-width="2"
                            padding="16"
                            smooth="4"
                            width="500"
                          ></v-sparkline>
                        </v-sheet>
                      </v-card-text>
                      <v-card-text>
                        <div class="stat-labels d-flex flex-column">
                          <span class="title">Details:</span>
                          <span class="font-weight-light">
                            Highest for period: {{ weekly_stats_highest }}
                          </span>
                          <span class="font-weight-light">
                            Average for period: {{ weekly_stats_avg }}
                          </span>
                        </div>
                      </v-card-text>
                    </v-card>

                    <v-card class="mx-2 my-2" max-width="80%">
                      <v-card-subtitle>Monthly Vistor Count</v-card-subtitle>
                      <v-card-text>
                        <v-sheet>
                          <v-sparkline
                            v-if="monthly_autodraw"
                            :labels="monthly_stats_labels"
                            :value="monthly_stats_data"
                            :auto-draw="monthly_autodraw"
                            gradient-direction="top"
                            :gradient="['#f72047', '#ffd200', '#1feaea']"
                            line-width="2"
                            padding="16"
                            stroke-linecap="round"
                            smooth="4"
                            width="500"
                          ></v-sparkline>
                        </v-sheet>
                      </v-card-text>
                      <v-card-text>
                        <div class="stat-labels d-flex flex-column">
                          <span class="title">Details:</span>
                          <span class="font-weight-light">
                            Highest for period: {{ monthly_stats_highest }}
                          </span>
                          <span class="font-weight-light">
                            Average for period: {{ monthly_stats_avg }}
                          </span>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                  <div class="flipped-section-content mb-3 mt-10">
                    <span
                      id="functionality_section"
                      class="display-1 ml-4 my-3 font-weight-light"
                    >
                      Functionality
                    </span>
                    <div
                      class="function-icon-container elevation-1 pa-3 my-3 d-flex flex-column justify-center align-center"
                    >
                      <span class="title">Website Icon</span>
                      <div
                        class="function-icon-actions d-flex justify-center align-center px-9"
                      >
                        <div class="icon-btns mr-5">
                          <v-btn
                            :disabled="user.account_type === 'test'"
                            color="info"
                            rounded
                            @click="favicon_dialog_upload = true"
                          >
                            <v-icon>mdi-cloud-upload</v-icon> Upload
                          </v-btn>
                          <v-btn
                            color="info"
                            rounded
                            @click="favicon_dialog_link = true"
                          >
                            <v-icon>mdi-link</v-icon> Link
                          </v-btn>
                        </div>
                        <div
                          class="ml-5 icon-preview d-flex flex-column align-center justify-center"
                        >
                          <div
                            class="icon-preview-container d-flex align-center justify-center"
                          >
                            <v-img
                              class="icon-img"
                              :src="userFavicon"
                              max-height="80"
                              max-width="80"
                            ></v-img>
                          </div>
                          <v-btn
                            v-if="site_props.favicon.use"
                            color="error"
                            rounded
                            class="mt-3"
                            @click="resetFavicon()"
                          >
                            Set To Default
                          </v-btn>
                        </div>
                      </div>
                    </div>
                    <div
                      class="function-parking-container d-flex flex-column justify-center align-center elevation-1 pa-5 my-3"
                    >
                      <span class="title text-center">Park Website</span>
                      <p class="subtitle text-center my-2">
                        Have No need for your website at the moment? Or want to
                        simply let people know its undergoing an awesome
                        redesign?
                      </p>
                      <p class="subtitle text-center my-2">
                        Set your website to 'Parked' below, and we'll display a
                        screen for you, letting visitors know that your website
                        is not available yet.
                      </p>
                      <div class="function-parking-actions">
                        <v-switch
                          v-model="site_parked"
                          :label="site_parked ? 'Parked' : 'Not Parked'"
                          inset
                          :disabled="!site_available"
                          @change="activateSite()"
                        ></v-switch>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flipped-section-footer elevation-1"></div>
            </v-layout>
            <v-layout v-if="current_displayed_section === 'user_settings'">
              <p>User Settings</p>
            </v-layout>
            <v-layout v-if="current_displayed_section === 'messages'">
              <p>Messages</p>
            </v-layout>
            <v-layout v-if="current_displayed_section === 'subscriptions'">
              <p>Subscriptions</p>
            </v-layout>
          </div>
        </v-layout>
      </v-layout>
      <v-footer height="50" padless>
        <v-col class="text-center" cols="12">
          &#169; {{ new Date().getFullYear() }} — <strong>Kreoh</strong>
        </v-col>
      </v-footer>
    </v-layout>
    <v-dialog
      v-model="favicon_dialog_link"
      transition="slide-y-transition"
      width="500"
      persistent
    >
      <v-card>
        <v-card-title>Change Your Favicon</v-card-title>
        <v-card-subtitle>Links should lead to a .ico file</v-card-subtitle>
        <v-card-text>
          <v-container>
            <v-layout>
              <v-text-field
                v-model="favicon_url"
                prepend-inner-icon="mdi-link"
                placeholder="Favicon URL..."
                outlined
              ></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="success" @click.stop="validateFavicon()">
            Save
          </v-btn>
          <v-btn color="error" @click="favicon_dialog_link = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="favicon_dialog_upload"
      transition="slide-y-transition"
      width="500"
      persistent
    >
      <v-card>
        <v-card-title>Upload Your Favicon</v-card-title>
        <v-card-subtitle>Only accepts .ico files!</v-card-subtitle>
        <v-card-text>
          <v-container>
            <v-layout>
              <v-file-input
                v-model="favicon_file"
                label="Favicon file..."
                color="deep-purple accent-4"
                chips
                prepend-icon="mdi-paperclip"
                placeholder="Select file"
                outlined
                accept="image/vnd.microsoft.icon, image/x-icon"
                :show-size="1000"
                :rules="[
                  (value) =>
                    !value ||
                    value.size < 50000 ||
                    'File should be less than 50 KB!'
                ]"
              >
                <template v-slot:selection="{ index, text }">
                  <v-chip
                    v-if="index < 2"
                    color="deep-purple accent-4"
                    dark
                    label
                    small
                  >
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="success" @click.stop="uploadFavicon()">
            Save
          </v-btn>
          <v-btn color="error" @click="favicon_dialog_upload = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="favicon_url_error" color="error">
      Error: Inavlid URL!
      <v-btn icon @click="favicon_url_error = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
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
  perspective: 80%;
}

#dashboard {
  width: 80%;
  height: 80%;
  // margin: 60px 130px;
  background-color: #fafafa;
  border-radius: 20px;
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

.site-name-header {
  color: #0066ff;
  font-size: 22px;
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

.function-icon-actions {
  width: 100%;
}

// .icon-btns {
//   width: 50%;
// }

// .icon-preview {
//   width: 50%;
// }

.icon-preview-container {
  border: 1px solid #e6e6e6;
  width: 100px;
  height: 100px;
}
</style>
