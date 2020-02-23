<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  name: 'SiteSettings',
  layout: 'dashboard_layout',
  components: {
    LineChart: () => import('@/components/dashboard/charts/line_chart'),
    BarChart: () => import('@/components/dashboard/charts/bar_chart')
  },
  data() {
    return {
      weekly_chart: 'line',
      hourly_chart: 'line',
      monthly_chart: 'line',
      favicon_dialog_link: false,
      favicon_url: null,
      validated_favicon_url: null,
      favicon_url_error: false,
      favicon_dialog_upload: false,
      favicon_file: null,
      show_email_dialog: false
    }
  },
  computed: {
    ...mapGetters({
      hourlyStats: 'dashboard/hourlyStats',
      weeklyStats: 'dashboard/weeklyStats',
      monthlyStats: 'dashboard/monthlyStats'
    }),
    hourly_stats() {
      return {
        labels: this.hourlyStats.labels,
        datasets: [
          {
            label: 'Visitors By Hour',
            backgroundColor: '#BBDEFB',
            data: this.hourlyStats.data
          }
        ]
      }
    },
    weekly_stats() {
      return {
        labels: this.weeklyStats.labels,
        datasets: [
          {
            label: 'Visitors By Day',
            backgroundColor: '#BBDEFB',
            data: this.weeklyStats.data
          }
        ]
      }
    },
    monthly_stats() {
      return {
        labels: this.monthlyStats.labels,
        datasets: [
          {
            label: 'Visitors By Month',
            backgroundColor: '#BBDEFB',
            data: this.monthlyStats.data
          }
        ]
      }
    },
    site_props() {
      return this.$store.state.creator.site_props
    },
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
  created() {
    this.updateStats()
  },
  methods: {
    ...mapMutations({
      setFavicon: 'creator/setFavicon'
    }),
    ...mapActions({
      updateStats: 'dashboard/updateStats'
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
    resetFavicon() {
      this.$axios.$delete(
        '/uploads/images/' + this.user.domain + '/favicon.ico'
      )
      this.setFavicon({
        use: false,
        link: null
      })
      this.updateWebsite(this.site_props)
    },
    async getValidatedFavicon() {
      const validation = await this.$axios
        .get(this.favicon_url)
        .then((response) => {
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
    async activateSite() {
      if (this.user.email_confirmed) {
        await this.$axios
          .$post('/helpers/site_config/site_activation')
          .then(() => {
            window.location.reload()
          })
      } else {
        this.show_email_dialog = true
      }
    },
    scrollTo(id) {
      const el = document.getElementById(id)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    async uploadFavicon() {
      const formData = new FormData()
      formData.append('favicon', this.favicon_file)
      const url = 'uploads/images/' + this.user.domain + '/favicon.ico'
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
            this.$axios.defaults.baseURL +
            'uploads/images/' +
            this.user.domain +
            '/favicon.ico'
        })
        this.updateWebsite(this.site_props)
        this.favicon_file = null
      })
    },
    resendVerification() {
      this.$axios.$post('/u/email_verify').then(() => {
        this.activation_resent = true
      })
    }
  },
  head() {
    return {
      title: 'Site Settings - Kreoh'
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
          Website Settings
        </span>
        <span class="font-weight-bold">
          Manage Your favicon, uploads and view your website metrics.
        </span>
      </div>
    </div>
    <div class="flipped-section-wrapper my-2 section-stats d-flex elevation-1">
      <div class="flipped-section-nav elevation-1 d-flex flex-column">
        <span class="font-weight-bold text-center my-5">
          Navigation
        </span>
        <v-btn
          :color="`${user.dark_mode ? '' : '#ECEFF1'}`"
          tile
          width="100%"
          class="site-setting-nav-btn pa-9 elevation-0"
          @click="scrollTo('metrics_section')"
        >
          Metrics
        </v-btn>
        <v-btn
          :color="`${user.dark_mode ? '' : '#ECEFF1'}`"
          tile
          width="100%"
          class="site-setting-nav-btn pa-9 elevation-0"
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
                <LineChart
                  v-if="hourly_chart === 'line'"
                  :chart-data="hourly_stats"
                  height="100"
                ></LineChart>
                <BarChart
                  v-if="hourly_chart === 'bar'"
                  :chart-data="hourly_stats"
                  height="100"
                ></BarChart>
              </v-sheet>
            </v-card-text>
            <v-card-text>
              <v-radio-group v-model="hourly_chart" row mandatory>
                <v-radio
                  label="Line Chart"
                  value="line"
                  color="success"
                ></v-radio>
                <v-radio
                  label="Bar Chart"
                  value="bar"
                  color="success"
                ></v-radio>
              </v-radio-group>
              <div class="stat-labels d-flex flex-column">
                <span class="title">Details:</span>
                <span class="font-weight-light">
                  Highest for period: {{ hourlyStats.highest }}
                </span>
                <span class="font-weight-light">
                  Total for period: {{ hourlyStats.total }}
                </span>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="mx-2 my-2" max-width="80%">
            <v-card-subtitle>Daily Vistor Count</v-card-subtitle>
            <v-card-text>
              <v-sheet>
                <LineChart
                  v-if="weekly_chart === 'line'"
                  :chart-data="weekly_stats"
                  height="100"
                ></LineChart>
                <BarChart
                  v-if="weekly_chart === 'bar'"
                  :chart-data="weekly_stats"
                  height="100"
                ></BarChart>
              </v-sheet>
            </v-card-text>
            <v-card-text>
              <v-radio-group v-model="weekly_chart" row mandatory>
                <v-radio
                  label="Line Chart"
                  value="line"
                  color="success"
                ></v-radio>
                <v-radio
                  label="Bar Chart"
                  value="bar"
                  color="success"
                ></v-radio>
              </v-radio-group>
              <div class="stat-labels d-flex flex-column">
                <span class="title">Details:</span>
                <span class="font-weight-light">
                  Highest for period: {{ weeklyStats.highest }}
                </span>
                <span class="font-weight-light">
                  Total for period: {{ weeklyStats.total }}
                </span>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="mx-2 my-2" max-width="80%">
            <v-card-subtitle>Monthly Vistor Count</v-card-subtitle>
            <v-card-text>
              <v-sheet>
                <LineChart
                  v-if="monthly_chart === 'line'"
                  :chart-data="monthly_stats"
                  height="100"
                ></LineChart>
                <BarChart
                  v-if="monthly_chart === 'bar'"
                  :chart-data="monthly_stats"
                  height="100"
                ></BarChart>
              </v-sheet>
            </v-card-text>
            <v-card-text>
              <v-radio-group v-model="monthly_chart" row mandatory>
                <v-radio
                  label="Line Chart"
                  value="line"
                  color="success"
                ></v-radio>
                <v-radio
                  label="Bar Chart"
                  value="bar"
                  color="success"
                ></v-radio>
              </v-radio-group>
              <div class="stat-labels d-flex flex-column">
                <span class="title">Details:</span>
                <span class="font-weight-light">
                  Highest for period: {{ monthlyStats.highest }}
                </span>
                <span class="font-weight-light">
                  Total for period: {{ monthlyStats.total }}
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
                  :disabled="!user.email_confirmed"
                  color="info"
                  rounded
                  @click="favicon_dialog_upload = true"
                >
                  <v-icon>mdi-cloud-upload</v-icon> Upload
                </v-btn>
                <v-btn color="info" rounded @click="favicon_dialog_link = true">
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
              Have No need for your website at the moment? Or want to simply let
              people know its undergoing an awesome redesign?
            </p>
            <p class="subtitle text-center my-2">
              Set your website to 'Parked' below, and we'll display a screen for
              you, letting visitors know that your website is not available yet.
            </p>
            <div class="function-parking-actions">
              <v-switch
                :label="user.site_active ? 'Active' : 'Parked'"
                :input-value="user.site_active"
                inset
                :disabled="!user.site_created"
                @change="activateSite()"
              ></v-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flipped-section-footer elevation-1"></div>
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
                rounded
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
    <v-snackbar v-model="show_email_dialog" color="warning" :timeout="10000">
      Verify your email to activate your website.
      <v-btn color="success" @click="resendVerification()">Resend Link</v-btn>
      <v-btn icon @click="show_email_dialog = false">
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

.function-icon-actions {
  width: 100%;
}

.icon-preview-container {
  border: 1px solid #e6e6e6;
  width: 100px;
  height: 100px;
}
</style>
