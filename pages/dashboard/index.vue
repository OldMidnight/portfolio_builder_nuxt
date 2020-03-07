<script>
import { mapState, mapActions } from 'vuex'
import Feedback from '@/components/dashboard/common/feedback'
export default {
  name: 'Dashboard',
  layout: 'dashboard_layout',
  components: { Feedback },
  async fetch({ store, $axios }) {
    const {
      site_not_created: siteNotCreated,
      site_config: siteConfig
    } = await $axios.$get('/helpers/auth_site_config')
    if (!siteNotCreated) {
      store.commit('creator/setSiteProps', siteConfig)
    }
  },
  data() {
    return {
      delete_error: false,
      delete_success: false,
      delete_msg: {},
      temp_messages: [],
      default_images: ['Home', 'Projects', 'Resume'],
      account_types: {
        0: { title: 'Free', price: '0.00' },
        1: { title: 'Premium', price: '5.00' },
        4: { title: 'Beta Tester', price: '0.00' }
      },
      website_delete_dialog: false,
      emailNotConfirmed: false,
      messages: [],
      prev_messages: [],
      activation_resent: false,
      website_images: [],
      slideshow_interval: null,
      slideshow_index: 0
    }
  },
  computed: {
    ...mapState({
      weekly_stats: (state) => state.dashboard.stats.weekly,
      cta_inter_stats: (state) => state.dashboard.stats.cta_inter
    }),
    user() {
      return this.$store.state.auth.user
    },
    user_domain() {
      const url =
        this.$axios.defaults.baseURL === 'http://192.168.8.105:5000'
          ? '.localhost:3001/'
          : '.kreoh.com/'
      return `http://${this.user.domain}${url}`
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    m_website_images() {
      if (this.website_images.length === 3) {
        return [this.website_images[this.slideshow_index]]
      } else {
        return []
      }
    }
  },
  created() {
    this.slideshow_interval = setInterval(() => {
      if (this.slideshow_index === 2) {
        this.slideshow_index = 0
      } else {
        this.slideshow_index += 1
      }
    }, 4500)
    this.emailNotConfirmed = !this.user.email_confirmed
    this.$axios.$get('/u/status').then((response) => {
      if (!response.email_confirmed) {
        this.emailNotConfirmed = true
      }
      this.messages = response.messages
    })
    if (this.messages.length <= 2) {
      this.prev_messages = this.messages
    } else {
      this.prev_messages = this.messages.slice(
        this.messages.length - 2,
        this.messages.length
      )
    }
  },
  mounted() {
    this.updateStats()
    const url = `${this.$axios.defaults.baseURL}/uploads/user-content/`

    for (const page of ['home', 'projects', 'resume']) {
      this.website_images.push(
        url + this.user.domain + '/' + page + '.kreoh.com.png'
      )
    }
  },
  methods: {
    ...mapActions({
      updateStats: 'dashboard/updateStats'
    }),
    async deleteSite() {
      await this.$axios
        .$post('/helpers/delete_site', { domain: this.user.domain })
        .then((response) => {
          this.delete_msg = response.message
          this.delete_success = true
        })
        .catch(() => {
          this.delete_msg = 'Website could not be deleted.'
          this.delete_error = true
        })
      this.website_delete_dialog = false
      this.$auth.fetchUser()
    },
    async resendVerification() {
      await this.$axios.$post('/u/email_verify')
      this.activation_resent = true
    },
    openMessage(id) {
      this.$router.push({ path: `/dashboard/message-center?id=${id}` })
    }
  },
  head() {
    return {
      title: 'Dashboard - Kreoh'
    }
  }
}
</script>

<template>
  <v-row :class="`${isMobile ? 'h-100' : ''}`">
    <v-col v-if="!isMobile" cols="12" class="pa-0 h-100 w-100 d-flex">
      <div class="general-settings-container">
        <div
          :class="
            `general-settings-wrapper ${
              $vuetify.theme.dark ? 'darkmode' : ''
            } d-flex flex-column align-center justify-center pl-3 pr-2 pt-3`
          "
        >
          <div
            :class="
              `gen-setting-item ${
                $vuetify.theme.dark ? 'darkmode' : ''
              } gen-setting-settings ma-2 pa-4 d-flex flex-column align-center justify-center elevation-2 gen-setting--border`
            "
          >
            <div>
              <v-icon class="gen-setting--icon" color="success">
                mdi-settings
              </v-icon>
              <span class="font-weight-bold">Settings</span>
            </div>
            <div class="d-flex flex-column justify-center align-center my-1">
              <v-btn
                class="my-1 gen-setting-btn--border"
                color="info"
                small
                nuxt
                to="/dashboard/site-settings"
                outlined
              >
                Site Setings
              </v-btn>
              <v-btn
                class="my-1 gen-setting-btn--border"
                color="info"
                outlined
                small
                nuxt
                to="/dashboard/user-settings"
              >
                User Setings
              </v-btn>
            </div>
          </div>
          <div
            :class="
              `gen-setting-item ${
                $vuetify.theme.dark ? 'darkmode' : ''
              } gen-setting-messages messages ma-2 py-4 px-2 d-flex flex-column align-center elevation-2 gen-setting--border`
            "
          >
            <div>
              <v-icon class="gen-setting--icon" color="info">
                mdi-message
              </v-icon>
              <span class="font-weight-bold">Messages</span>
            </div>
            <div
              v-if="messages"
              class="messages-preview py-2 d-flex flex-column align-center"
            >
              <nuxt-link
                v-for="(message, index) in messages"
                :key="index"
                :class="
                  `messages-container my-1 ${
                    user.dark_mode ? 'white' : 'black'
                  }--text`
                "
                :to="`/dashboard/message-center?id=${message.id}`"
              >
                <v-hover v-slot:default="{ hover }">
                  <div
                    class="message pa-2 d-flex"
                    :class="{ 'elevation-1': !hover, 'elevation-3': hover }"
                  >
                    <div
                      class="message-details d-flex flex-column justify-center"
                    >
                      <span :style="{ fontSize: '16px' }" class="text-truncate">
                        {{ message.subject }}
                      </span>
                      <span :style="{ fontSize: '12px' }">
                        {{ message.sender }}
                      </span>
                    </div>
                    <div
                      class="message-icon d-flex flex-column justify-center align-center"
                    >
                      <v-icon large color="info">
                        mdi-{{ message.read ? 'email-open' : 'email' }}
                      </v-icon>
                    </div>
                  </div>
                </v-hover>
              </nuxt-link>
              <v-btn
                class="messages-container my-1"
                color="info"
                outlined
                nuxt
                to="/dashboard/message-center?support=true"
              >
                <span>
                  Send us a message!
                </span>
                <v-icon large class="ml-1">
                  mdi-face-agent
                </v-icon>
              </v-btn>
            </div>
            <div
              v-else
              class=" d-flex flex-column align-center justify-center my-3"
            >
              <span class="text-center">No Unread Messages</span>
            </div>
            <v-btn
              class="align-self-center gen-setting-btn--border mb-2"
              color="info"
              small
              outlined
              nuxt
              to="/dashboard/message-center"
            >
              Messages
            </v-btn>
          </div>
          <div
            :class="
              `gen-setting-item ${
                $vuetify.theme.dark ? 'darkmode' : ''
              } gen-setting-plan ma-2 pa-4 d-flex flex-column align-center justify-space-around elevation-2 gen-setting--border`
            "
          >
            <div>
              <v-icon class="gen-setting--icon" color="#FDD835">
                mdi-star
              </v-icon>
              <span class="font-weight-bold">Your Plan</span>
            </div>
            <span class="font-weight-light text-center">
              Account Type:
            </span>
            <span class="font-weight-bold mb-3">
              {{ user ? account_types[user.account_type].title : '' }}
            </span>
            <span class="font-weight-light">
              Monthly Cost:
            </span>
            <span class="mb-3 font-weight-bold">
              &euro; {{ user ? account_types[user.account_type].price : '' }}
            </span>
            <v-btn
              disabled
              color="info"
              small
              outlined
              class="gen-setting-btn--border"
            >
              {{ user.account_type === 0 ? 'Upgrade' : 'Manage' }}
            </v-btn>
          </div>
        </div>
      </div>
      <div
        class="site-settings-container d-flex flex-column justify-center align-center pb-2"
      >
        <div
          class="site-setting-website-container d-flex flex-column pt-3 align-center"
        >
          <span class="site-name font-weight-bold pb-1 info--text">
            {{ (user.domain + '.kreoh.com').toUpperCase() }}
          </span>
          <div
            :class="
              `website-container ${
                $vuetify.theme.dark ? 'darkmode' : ''
              } d-flex flex-column justify-space-between align-center elevation-2 website-container--border pb-4`
            "
          >
            <div
              v-if="user.site_created"
              class="website-preview-container d-flex align-center justify-center pt-2"
            >
              <v-img
                v-for="(img, index) in website_images"
                :key="index"
                :class="
                  `website-img ${
                    $vuetify.theme.dark ? 'darkmode--border' : ''
                  } mx-1`
                "
                contain
                :src="img"
              ></v-img>
            </div>
            <div
              v-else
              class="website-preview-container d-flex align-center justify-center pt-2"
            >
              <div
                :class="
                  `${
                    $vuetify.theme.dark ? 'darkmode' : ''
                  } img-preview-text d-flex justify-center align-center mx-1`
                "
              >
                <v-icon>mdi-image</v-icon>
                <p class="font-weight-bold ml-3">Home</p>
              </div>
              <div
                :class="
                  `${
                    $vuetify.theme.dark ? 'darkmode' : ''
                  } img-preview-text d-flex justify-center align-center mx-1`
                "
              >
                <v-icon>mdi-image</v-icon>
                <p class="font-weight-bold ml-3">Projects</p>
              </div>
              <div
                :class="
                  `${
                    $vuetify.theme.dark ? 'darkmode' : ''
                  } img-preview-text d-flex justify-center align-center mx-1`
                "
              >
                <v-icon>mdi-image</v-icon>
                <p class="font-weight-bold ml-3">Resume</p>
              </div>
            </div>
            <div
              class="website-actions-container d-flex justify-space-around align-center"
            >
              <v-btn
                v-if="user.site_created"
                outlined
                :class="`${$vuetify.theme.dark ? 'darkmode' : ''}`"
                color="info"
                to="/creator"
                nuxt
              >
                <v-icon>mdi-pencil</v-icon> Edit
              </v-btn>
              <v-btn
                :disabled="!user.site_active || !user.email_confirmed"
                color="info"
                outlined
                :href="user_domain"
                target="_blank"
              >
                <v-icon>mdi-open-in-new</v-icon> Visit
              </v-btn>
              <v-btn v-if="!user.site_created" color="info" nuxt to="/creator">
                <v-icon>mdi-plus</v-icon> Create
              </v-btn>
              <v-btn
                v-if="user.site_created"
                color="error"
                outlined
                @click.stop="website_delete_dialog = true"
              >
                <v-icon>mdi-delete-forever</v-icon>
              </v-btn>
            </div>
            <p
              v-if="!user.site_active || !user.email_confirmed"
              class="caption grey--text mt-4"
            >
              Your website is currently parked. To actiavte it, go to the site
              settings page
              <nuxt-link to="/dashboard/site-settings#functionality_section">
                here
              </nuxt-link>
            </p>
          </div>
        </div>
        <div
          class="site-setting-stats-container d-flex justify-center align-center"
        >
          <v-card class="mx-3 stat-card--border" width="50%">
            <v-sheet
              class="v-sheet--offset mx-auto stat-sheet--border"
              elevation="12"
              max-width="calc(100% - 32px)"
            >
              <v-sparkline
                v-if="weekly_stats.autodraw"
                :labels="weekly_stats.labels"
                :value="weekly_stats.data"
                :auto-draw="weekly_stats.autodraw"
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
                Weekly Total - {{ weekly_stats.total }}
                / visitors this week
              </div>
              <v-divider class="my-2"></v-divider>
              <v-icon class="mr-2" small>
                mdi-clock
              </v-icon>
              <span class="caption grey--text font-weight-light">
                last visitor: {{ weekly_stats.last_visitor_time }}
              </span>
            </v-card-text>
          </v-card>
          <v-card class="mx-3 stat-card--border" width="50%">
            <v-sheet
              class="v-sheet--offset mx-auto stat-sheet--border"
              elevation="12"
              max-width="calc(100% - 32px)"
            >
              <v-sparkline
                v-if="cta_inter_stats.autodraw"
                :labels="cta_inter_stats.labels"
                :value="cta_inter_stats.data"
                :auto-draw="cta_inter_stats.autodraw"
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
                Call-To-Action Analytics
              </div>
              <div class="subheading font-weight-light grey--text">
                Weekly Interactions - {{ cta_inter_stats.total }}
                / interactions this week
              </div>
              <v-divider class="my-2"></v-divider>
              <v-icon class="mr-2" small>
                mdi-clock
              </v-icon>
              <span class="caption grey--text font-weight-light">
                last interaction: {{ cta_inter_stats.last_visitor_time }}
              </span>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-col>
    <v-row v-else class="h-100 w-100">
      <v-col cols="12" class="pt-0">
        <v-row class="mx-9 h-100">
          <v-col cols="12" class="pa-0 text-center">
            <span class="site-name font-weight-bold pb-1 info--text">
              {{ (user.domain + '.kreoh.com').toUpperCase() }}
            </span>
          </v-col>
          <v-col v-if="user.site_created" cols="12" class="elevation-1">
            <v-slide-group class="w-100" style="height: 30vh">
              <transition
                appear
                enter-active-class="animated fadeIn fast"
                leave-active-class="animated fadeOut fast"
                mode="out-in"
              >
                <v-slide-item
                  v-for="img in m_website_images"
                  :key="img"
                  class="pos-rel"
                >
                  <v-img
                    :class="
                      `pos-abs ${$vuetify.theme.dark ? 'darkmode--border' : ''}`
                    "
                    contain
                    :src="img"
                  ></v-img>
                </v-slide-item>
              </transition>
            </v-slide-group>
          </v-col>
          <v-col v-else cols="12">
            <v-slide-group class="w-100">
              <transition
                appear
                enter-active-class="animated fadeIn fast"
                leave-active-class="animated fadeOut fast"
                mode="out-in"
              >
                <v-slide-item
                  v-if="slideshow_index === 0"
                  key="0"
                  class="border border-rounded w-100 d-flex justify-center align-center"
                  style="height: 30vh"
                >
                  <div>
                    <v-icon x-large>mdi-image</v-icon>
                    <p class="font-weight-bold ml-3" style="font-size: 30px;">
                      Home
                    </p>
                  </div>
                </v-slide-item>
                <v-slide-item
                  v-if="slideshow_index === 1"
                  key="1"
                  class="border border-rounded w-100 d-flex justify-center align-center"
                  style="height: 30vh"
                >
                  <div>
                    <v-icon x-large>mdi-image</v-icon>
                    <p class="font-weight-bold ml-3" style="font-size: 30px;">
                      Projects
                    </p>
                  </div>
                </v-slide-item>
                <v-slide-item
                  v-if="slideshow_index === 2"
                  key="2"
                  class="border border-rounded w-100 d-flex justify-center align-center"
                  style="height: 30vh"
                >
                  <div>
                    <v-icon x-large>mdi-image</v-icon>
                    <p class="font-weight-bold ml-3" style="font-size: 30px;">
                      Resume
                    </p>
                  </div>
                </v-slide-item>
              </transition>
            </v-slide-group>
          </v-col>
          <v-col cols="12" class="d-flex justify-space-around">
            <v-btn
              v-if="user.site_created"
              outlined
              :class="`${$vuetify.theme.dark ? 'darkmode' : ''}`"
              color="info"
              to="/m-creator"
              nuxt
              large
            >
              <v-icon>mdi-pencil</v-icon> Edit
            </v-btn>
            <v-btn
              :disabled="!user.site_active || !user.email_confirmed"
              color="info"
              outlined
              :href="user_domain"
              target="_blank"
              large
            >
              <v-icon>mdi-open-in-new</v-icon> Visit
            </v-btn>
            <v-btn
              v-if="!user.site_created"
              color="info"
              nuxt
              to="/m-creator"
              large
            >
              <v-icon>mdi-plus</v-icon> Create
            </v-btn>
            <v-btn
              v-if="user.site_created"
              color="error"
              outlined
              large
              @click.stop="website_delete_dialog = true"
            >
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </v-col>
          <Feedback />
          <v-col cols="12" class="mt-12 pa-0">
            <v-card width="100%">
              <v-sheet
                class="v-sheet--offset mx-auto"
                elevation="12"
                max-width="calc(100% - 32px)"
              >
                <v-sparkline
                  v-if="weekly_stats.autodraw"
                  :labels="weekly_stats.labels"
                  :value="weekly_stats.data"
                  :auto-draw="weekly_stats.autodraw"
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
                  Weekly Total - {{ weekly_stats.total }}
                  / visitors this week
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-clock
                </v-icon>
                <span class="caption grey--text font-weight-light">
                  last visitor: {{ weekly_stats.last_visitor_time }}
                </span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" class="mt-12 pa-0">
            <v-card width="100%">
              <v-sheet
                class="v-sheet--offset mx-auto"
                elevation="12"
                max-width="calc(100% - 32px)"
              >
                <v-sparkline
                  v-if="cta_inter_stats.autodraw"
                  :labels="cta_inter_stats.labels"
                  :value="cta_inter_stats.data"
                  :auto-draw="cta_inter_stats.autodraw"
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
                  Call-To-Action Analytics
                </div>
                <div class="subheading font-weight-light grey--text">
                  Weekly Interactions - {{ cta_inter_stats.total }}
                  / interactions this week
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-clock
                </v-icon>
                <span class="caption grey--text font-weight-light">
                  last interaction: {{ cta_inter_stats.last_visitor_time }}
                </span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" class="pa-0 mt-3">
            <p class="headline text-center">Messages</p>
            <v-list two-line>
              <v-list-item-group active-class="info--text">
                <template v-for="(message, index) in messages">
                  <v-list-item
                    :key="message.id"
                    class="elevation-1"
                    nuxt
                    :to="`/dashboard/message-center?id=${message.id}`"
                  >
                    <template v-slot:default>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="message.sender"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          class="text--primary"
                          v-text="message.subject"
                        ></v-list-item-subtitle>
                        <v-list-item-subtitle
                          v-text="message.body"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-list-item-action-text
                          v-text="
                            message.time_sent
                              .split(' ')
                              .splice(0, 4)
                              .join(' ')
                          "
                        ></v-list-item-action-text>
                        <v-icon color="info">
                          mdi-{{ message.read ? 'email-open' : 'email' }}
                        </v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                  <v-divider
                    v-if="index + 1 < messages.length"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col
            cols="12"
            class="d-flex flex-column align-center justify-center"
          >
            <v-text-field
              class="h-100 w-100 mt-2"
              dense
              outlined
              label="Search..."
              rounded
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-btn text nuxt to="/dashboard/message-center?support=true">
              Support
            </v-btn>
            <v-btn text nuxt to="#">FAQ</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog
      v-model="website_delete_dialog"
      width="500"
      transition="slide-y-transition"
    >
      <v-card>
        <v-card-title>Delete Your Website</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-sheet>
            <v-layout
              class="d-flex flex-column align-center justify-space-between"
            >
              <span>Are you sure you want to delete your website?</span>
              <span class="font-weight-bold subtitle-2">
                This action is irreversable
              </span>
              <span class="text-center">
                This will not delete any metrics associated with your domain.
              </span>
              <v-btn
                class="mt-3"
                color="error"
                outlined
                @click.stop="deleteSite()"
              >
                <v-icon>mdi-delete</v-icon> Delete My Website
              </v-btn>
              <v-btn
                class="mt-3"
                color="info"
                outlined
                @click="website_delete_dialog = false"
              >
                Go Back
              </v-btn>
            </v-layout>
          </v-sheet>
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
    <v-snackbar v-model="emailNotConfirmed" color="info">
      Check Your email to activate your account.
      <v-btn color="success" @click="resendVerification()">Resend Link</v-btn>
      <v-btn icon @click="emailNotConfirmed = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="activation_resent" color="success">
      Account verification link has been resent!
      <v-btn icon @click="activation_resent = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<style lang="scss" scoped>
.general-settings-container {
  width: 22%;
  height: 100%;
  // border-right: 1px solid #e6e6e6;
  overflow: auto;
}

.general-settings-wrapper {
  // position: absolute;
  background-color: #eceff1;
  height: 100%;
  // overflow: auto;
}

.gen-setting-item {
  width: 100%;
  background-color: #fafafa;
  border-radius: 0.5em;
}

.gen-setting-settings {
  height: 20%;
}

.gen-setting-messages {
  height: 50%;
}

.gen-setting-plan {
  height: 30%;
}

.messages {
  // min-height: 500px;
  max-height: 500px;
  overflow: auto;
}

.messages-preview {
  overflow: auto;
  height: 100%;
  width: 100%;
}

.site-settings-container {
  width: 78%;
}

.site-setting-website-container {
  width: 100%;
  height: 55%;
}

.site-setting-stats-container {
  width: 100%;
  height: 45%;
}

.site-stat {
  width: 100%;
  height: 100%;
  // background-color: #fafafa;
  border-radius: 20px;
}

.site-name {
  font-size: 24px;
  // height: 7%;
}

.website-container {
  width: 98%;
  height: 85%;
  background-color: #fafafa;
  border-radius: 5px;
}

.website-preview-container {
  width: 90%;
  height: 90%;
}

.website-img {
  width: 33%;
  height: 90%;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
}

.website-actions-container {
  height: 10%;
  width: 70%;
  // border: 1px solid #e6e6e6;
}

.v-sheet--offset {
  top: -24px;
  position: relative;
}

.img-preview-text {
  font-size: 30px;
  border: 1px solid #e6e6e6;
  height: 90%;
  width: 33%;
  border-radius: 10px;
}

.messages-container {
  width: 97%;
  height: 33%;
}

.message {
  // height: 100%;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.message-details {
  width: 80%;
  height: 100%;
}

.message-icon {
  width: 20%;
  height: 100%;
}
</style>
