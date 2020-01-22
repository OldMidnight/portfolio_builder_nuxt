<script>
import { mapState, mapActions } from 'vuex'
// import SiteSettings from '@/components/dashboard/site_settings'
// import UserSettings from '@/components/dashboard/user_settings'
export default {
  name: 'dashboard',
  layout: 'dashboard_layout',
  // components: { SiteSettings, UserSettings },
  data() {
    return {
      delete_error: false,
      delete_success: false,
      delete_msg: {},
      temp_messages: [],
      preview_images: [
        { src: '/layout_images/kreoh_layout_1_fresh.png' },
        { src: '/layout_images/kreoh_layout_1_slate.png' },
        { src: '/layout_images/kreoh_layout_1_matrix.png' }
      ],
      website_delete_dialog: false
    }
  },
  computed: {
    ...mapState({
      weekly_stats: (state) => state.dashboard.stats.weekly
    }),
    user() {
      return this.$store.state.auth.user
    },
    user_domain() {
      if (this.$axios.defaults.baseURL !== 'http://127.0.0.1:5000/') {
        return 'http://' + this.user.domain + '.kreoh-client.herokuapp.com/'
      } else {
        return 'http://' + this.user.domain + '.localhost:3001/'
      }
    }
    // weekly_stats() {
    //   return this.$store.state.dashboard.stats.weekly
    // }
  },
  fetch({ store, $axios }) {
    return $axios.$get('/helper/auth_site_config').then((response) => {
      if (!response.site_not_created) {
        store.commit('creator/setSiteProps', response.site_config)
      }
    })
  },
  mounted() {
    this.updateWeeklyStats()
  },
  head() {
    return {
      title: 'Dashboard - Kreoh'
    }
  },
  methods: {
    ...mapActions({
      updateWeeklyStats: 'dashboard/updateWeeklyStats'
    }),
    deleteSite() {
      this.$axios
        .$post('/helper/delete_site', { domain: this.user.domain })
        .then((response) => {
          this.delete_msg = response.message
          this.delete_success = true
          this.$auth.fetchUser()
        })
        .catch(() => {
          this.delete_msg = 'Website could not be deleted.'
          this.delete_error = true
        })
        .then(() => {
          this.website_delete_dialog = false
          this.$auth.fetchUser()
        })
    }
  }
}
</script>

<template>
  <v-layout>
    <div class="general-settings-container">
      <div
        class="general-setting-wrapper d-flex flex-column align-center justify-center pl-3 pr-2 pt-3"
      >
        <div
          class="gen-setting-item ma-2 pa-4 d-flex flex-column align-center justify-center elevation-2 gen-setting--border"
        >
          <v-icon size="50" class="gen-setting--icon" color="success">
            mdi-settings
          </v-icon>
          <div class="d-flex flex-column justify-center align-center my-2">
            <v-btn
              class="ma-1 gen-setting-btn--border"
              color="info"
              nuxt
              to="/dashboard/site-settings"
              outlined
            >
              Site Setings
            </v-btn>
            <v-btn
              class="ma-1 gen-setting-btn--border"
              color="info"
              outlined
              nuxt
              to="/dashboard/user-settings"
            >
              User Setings
            </v-btn>
          </div>
        </div>
        <div
          class="gen-setting-item messages ma-2 pa-4 d-flex flex-column align-center elevation-2 gen-setting--border"
        >
          <v-icon size="50" class="gen-setting--icon" color="info">
            mdi-message
          </v-icon>
          <div v-if="temp_messages" class="messages-preview my-3"></div>
          <div
            v-else
            class=" d-flex flex-column align-center justify-center my-3"
          >
            <span class="text-center">No Unread Messages</span>
          </div>
          <v-btn
            class="align-self-center gen-setting-btn--border"
            color="info"
            outlined
            @click="flipTo('messages')"
          >
            Messages
          </v-btn>
        </div>
        <div
          class="gen-setting-item ma-2 pa-4 d-flex flex-column align-center justify-space-around elevation-2 gen-setting--border"
        >
          <v-icon size="50" class="gen-setting--icon" color="#FDD835">
            mdi-star
          </v-icon>
          <span class="font-weight-light my-3">
            Account Type: {{ user.account_type }}
          </span>
          <span class="font-weight-light mb-3">
            Monthly Cost: &euro; 4.99
          </span>
          <v-btn
            color="info"
            small
            outlined
            class="gen-setting-btn--border"
            @click="flipTo('subscriptions')"
          >
            {{ user.account_type === 'Free' ? 'Upgrade' : 'Subscription' }}
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
          class="website-container d-flex flex-column justify-space-between align-center elevation-2 website-container--border pb-4"
        >
          <div
            v-if="user.site_created"
            class="website-preview-container d-flex align-center justify-center pt-2"
          >
            <v-img
              v-for="(img, index) in preview_images"
              :key="index"
              class="website-img website-img--border mx-1"
              contain
              :src="img.src"
            ></v-img>
          </div>
          <div
            v-else
            class="website-preview-container d-flex align-center justify-center pt-2"
          >
            <!-- <transition
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
              mode="out-in"
            > -->
            <!-- <v-img
              key="0"
              class="website-img website-img--border mx-1"
              contain
              :src="preview_images[current_preview_img].src"
            ></v-img>
            <v-img
              key="1"
              class="website-img website-img--border mx-1"
              contain
              :src="preview_images[current_preview_img].src"
            ></v-img>
            <v-img
              key="2"
              class="website-img website-img--border mx-1"
              contain
              :src="preview_images[current_preview_img].src"
            ></v-img> -->
            <v-img
              v-for="(img, index) in preview_images"
              :key="index"
              class="website-img website-img--border mx-1"
              contain
              :src="img.src"
            ></v-img>
            <!-- </transition> -->
          </div>
          <div
            class="website-actions-container d-flex justify-space-around align-center"
          >
            <v-btn
              v-if="user.site_created"
              outlined
              color="info"
              href="/editor"
            >
              <v-icon>mdi-pencil</v-icon> Edit
            </v-btn>
            <v-btn
              :disabled="!user.site_active"
              color="info"
              outlined
              :href="user_domain"
              target="_blank"
            >
              <v-icon>mdi-open-in-new</v-icon> Visit
            </v-btn>
            <v-btn v-if="!user.site_created" color="info" href="/creator">
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
              Weekly Average - {{ weekly_stats.avg }}
              / visitors per week
            </div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small>
              mdi-clock
            </v-icon>
            <span class="caption grey--text font-weight-light">
              last visitor {{ weekly_stats.last_visitor_time }}
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
  </v-layout>
</template>

<style lang="scss" scoped>
.general-settings-container {
  width: 20%;
  height: 100%;
  // border-right: 1px solid #e6e6e6;
  overflow: auto;
}

.general-settings-wrapper {
  position: absolute;
  background-color: #eceff1;
}

.gen-setting-item {
  width: 100%;
  background-color: #fafafa;
  border-radius: 0.5em;
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
  button {
    background-color: #fafafa;
  }
  // border: 1px solid #e6e6e6;
}

.v-sheet--offset {
  top: -24px;
  position: relative;
}

// .dashboard--border {
//   border-radius: 0.5em !important;
//   border: 1px solid rgba(255, 255, 255, 0.2) !important;
//   background-color: #eceff1 !important;
//   box-shadow: -6px -6px 24px 0 rgba(255, 255, 255, 0.83),
//     6px 6px 16px 0 rgba(217, 210, 200, 0.61) !important;
// }

// .gen-setting--border {
//   border-radius: 0.5em !important;
//   border: 1px solid rgba(255, 255, 255, 0.2) !important;
//   background-color: #eceff1 !important;
//   box-shadow: -6px -6px 26px 0 rgba(255, 255, 255, 0.83),
//     6px 6px 16px 0 rgba(217, 210, 200, 0.51) !important;
//   margin: 5% 0 !important;
//   transition: 0.3s;
// }

// .gen-setting-btn--border {
//   border-radius: 0.5em !important;
//   border: 1px solid rgba(255, 255, 255, 0.2) !important;
//   background-color: #eceff1 !important;
//   box-shadow: -4px -4px 16px 0 rgba(255, 255, 255, 0.83),
//     -6px -6px 20px 0 rgba(255, 255, 255, 0.93),
//     4px 4px 16px 0 rgba(217, 210, 200, 0.51),
//     6px 6px 20px 0 rgba(217, 210, 200, 0.59) !important;
//   margin: 8% 0 !important;
// }

// .website-container--border {
//   border-radius: 0.5em !important;
//   border: 1px solid rgba(255, 255, 255, 0.2) !important;
//   background-color: #eceff1 !important;
//   box-shadow: -6px -6px 26px 0 rgba(255, 255, 255, 0.83),
//     6px 6px 16px 0 rgba(217, 210, 200, 0.51) !important;
// }

// .stat-card--border,
// .stat-sheet--border {
//   border-radius: 0.5em !important;
//   border: 1px solid rgba(255, 255, 255, 0.2) !important;
//   background-color: #eceff1 !important;
//   box-shadow: -6px -6px 26px 0 rgba(255, 255, 255, 0.83),
//     6px 6px 16px 0 rgba(217, 210, 200, 0.51) !important;
// }

// .stat-sheet--border {
//   background-color: #eceff1 !important;
// }

// .website-img--border {
//   border-radius: 0.5em !important;
//   border: 1px solid rgba(255, 255, 255, 0.2) !important;
//   background-color: #eceff1 !important;
//   box-shadow: -6px -6px 26px 0 rgba(255, 255, 255, 0.83),
//     6px 6px 16px 0 rgba(217, 210, 200, 0.51) !important;
// }

// .topnav--neumorph {
//   border: 1px solid rgba(255, 255, 255, 0.2) !important;
//   background-color: #eceff1 !important;
//   box-shadow: -6px -6px 20px 0 rgba(255, 255, 255, 1),
//     6px 6px 16px 0 rgba(217, 210, 200, 0.51) !important;
// }
</style>
