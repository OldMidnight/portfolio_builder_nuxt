<script>
import axios from 'axios'
import { mapMutations, mapActions, mapGetters } from 'vuex'

const mimeTypes = [
  'image/ico',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/vnd.microsoft.icon',
  'image/x-icon'
]

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
      favicon_dialog: false,
      faviconProps: {
        custom: false,
        link: true,
        upload: false,
        url: '/favicon.ico'
      },
      favicon_url: '/favicon.ico',
      favicon_url_error: false,
      favicon_file: null,
      upload_rules: [
        (value) =>
          !value ||
          value.size < 500000 ||
          'File size should be less than 500KB!'
      ],
      invalid_img_dimensions: false,
      invalid_img_link: false,
      favicon_loading: false
    }
  },
  computed: {
    ...mapGetters({
      hourlyStats: 'dashboard/hourlyStats',
      weeklyStats: 'dashboard/weeklyStats',
      monthlyStats: 'dashboard/monthlyStats',
      site_props: 'creator/site_props'
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
    userFavicon() {
      return this.site_props.favicon.url
    }
  },
  watch: {
    'faviconProps.link'(value) {
      if (value && this.faviconProps.upload) {
        this.faviconProps.upload = false
        this.favicon_url = this.faviconProps.url
        this.invalid_img_dimensions = false
        this.invalid_img_link = false
      } else if (!value && !this.faviconProps.upload) {
        this.faviconProps.upload = true
      }
    },
    'faviconProps.upload'(value) {
      if (value && this.faviconProps.link) {
        this.faviconProps.link = false
        this.favicon_url = this.faviconProps.url
        this.invalid_img_dimensions = false
        this.invalid_img_link = false
      } else if (!value && !this.faviconProps.link) {
        this.faviconProps.link = true
      }
    }
  },
  created() {
    this.updateStats()
    this.faviconProps = JSON.parse(JSON.stringify(this.site_props.favicon))
  },
  methods: {
    ...mapMutations({
      setFavicon: 'creator/setFavicon'
    }),
    ...mapActions({
      updateStats: 'dashboard/updateStats',
      handleWebsite: 'creator/handleWebsite'
    }),
    async validateURL() {
      const response = await axios.get(this.favicon_url).catch((e) => {
        const error = JSON.parse(JSON.stringify(e))
        return error
      })
      if (response.message === 'Network Error') {
        this.invalid_img_link = true
      } else {
        this.invalid_img_link = !mimeTypes.includes(
          response.headers['content-type']
        )
      }
    },
    async resetFavicon() {
      this.$axios.$delete(
        '/uploads/user-content/' + this.$auth.user.domain + '/favicon.ico'
      )
      this.setFavicon({
        use: false,
        link: null
      })
      await this.handleWebsite({ type: 'update' })
    },
    async activateSite() {
      const { data } = await this.$axios
        .post('/helpers/site_config/site_activation')
        .catch((e) => {
          const error = JSON.parse(JSON.stringify(e))
          return error.response
        })
      this.$root.$emit(
        data.error ? 'showError' : !data.error ? 'showSuccess' : 'showError',
        { message: data.message }
      )
      this.$auth.fetchUser()
    },
    scrollTo(id) {
      const el = document.getElementById(id)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    async updateFavicon() {
      this.favicon_loading = true
      if (this.faviconProps.upload) {
        if (
          typeof this.favicon_file !== 'undefined' &&
          this.favicon_file !== null &&
          this.favicon_file !== '' &&
          this.$refs.favicon_upload_form.validate(true)
        ) {
          const formData = new FormData()
          const ext = this.upload_file.name.split('.')[
            this.upload_file.name.split('.').length - 1
          ]
          formData.append('upload', this.upload_file)
          const url =
            '/uploads/user-content/' +
            this.$auth.user.domain +
            '/favicon' +
            '.' +
            ext
          const config = {
            headers: {
              'content-type': 'multipart/form-data'
            }
          }
          const { data } = await this.$axios
            .post(url, formData, config)
            .catch((e) => {
              const error = JSON.parse(JSON.stringify(e))
              return error.response
            })
          this.$root.$emit(
            data.error
              ? 'showError'
              : !data.error
              ? 'showSuccess'
              : 'showError',
            { message: data.message }
          )
          this.setFavicon({
            link: this.faviconProps.link,
            upload: this.faviconProps.upload,
            url: `${this.$axios.defaults.baseURL}/uploads/user-content/${this.$auth.user.domain}/favicon.ico`
          })
          await this.handleWebsite({ type: 'update' })
          this.favicon_dialog = false
          this.favicon_file = null
        }
      } else {
        await this.validateURL()
        const img = new Image()
        img.onload = async () => {
          this.invalid_img_dimensions =
            img.height !== img.width || img.height > 512
          if (
            this.$refs.favicon_link_form.validate(true) &&
            !this.invalid_img_dimensions &&
            !this.invalid_img_link
          ) {
            this.setFavicon({
              favicon: {
                link: this.faviconProps.link,
                upload: this.faviconProps.upload,
                url: this.favicon_url
              }
            })
            await this.handleWebsite({ type: 'update' })
            this.favicon_dialog = false
            this.favicon_file = null
          }
        }
        img.src = this.favicon_url
      }
      this.favicon_loading = false
    },
    previewUpload(e) {
      if (typeof e !== 'undefined' && mimeTypes.includes(e.type)) {
        const reader = new FileReader()
        reader.onload = () => {
          this.favicon_url = reader.result
          const img = new Image()
          img.onload = () => {
            this.invalid_img_dimensions =
              img.height !== img.width || img.height > 512
          }
          img.src = reader.result
        }
        reader.readAsDataURL(e)
      } else {
        this.favicon_url = ''
      }
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
          :color="`${$auth.user.dark_mode ? '' : '#ECEFF1'}`"
          tile
          width="100%"
          class="site-setting-nav-btn pa-9 elevation-0"
          @click="scrollTo('metrics_section')"
        >
          Metrics
        </v-btn>
        <v-btn
          :color="`${$auth.user.dark_mode ? '' : '#ECEFF1'}`"
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
              <div class="icon-btns mr-5 d-flex flex-column">
                <v-btn
                  color="info"
                  rounded
                  :disabled="!$auth.user.site_created"
                  @click="favicon_dialog = true"
                >
                  <v-icon class="mr-2">mdi-cloud-upload</v-icon> Edit Icon
                </v-btn>
                <nuxt-link
                  v-if="!$auth.user.site_created"
                  to="/creator"
                  class="caption"
                >
                  Create your site to edit your favicon
                </nuxt-link>
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
              Have no need for your website at the moment? Or want to simply let
              people know its undergoing an awesome redesign?
            </p>
            <p class="subtitle text-center my-2">
              Set your website to 'Parked' below, and we'll display a screen for
              you, letting visitors know that your website is not available yet.
            </p>
            <div class="function-parking-actions">
              <v-switch
                :label="$auth.user.site_active ? 'Active' : 'Parked'"
                :input-value="$auth.user.site_active"
                inset
                :disabled="
                  !$auth.user.site_created || !$auth.user.email_confirmed
                "
                @change="activateSite()"
              ></v-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="favicon_dialog"
      transition="slide-y-transition"
      width="500"
      persistent
    >
      <v-card>
        <v-card-title>Edit Image</v-card-title>
        <v-card-subtitle>
          Your image may not appear in all browsers! Look
          <a
            href="https://realfavicongenerator.net/blog/favicon-why-youre-doing-it-wrong/"
            >here</a
          >
          practices.
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-switch
              v-model="faviconProps.link"
              inset
              label="Link Image"
            ></v-switch>
            <v-form v-if="faviconProps.link" ref="favicon_link_form">
              <span class="caption">Insert the url to your image</span>
              <v-text-field
                v-model="favicon_url"
                label="Image URL..."
                :error-messages="
                  invalid_img_link
                    ? 'Invalid Favicon Link!'
                    : invalid_img_dimensions
                    ? 'Invalid Favicon Dimensions!'
                    : null
                "
                outlined
              >
              </v-text-field>
            </v-form>
            <v-switch
              v-model="faviconProps.upload"
              inset
              label="Upload Image"
            ></v-switch>
            <div v-if="faviconProps.upload">
              <v-form ref="favicon_upload_form">
                <v-file-input
                  v-model="favicon_file"
                  :rules="upload_rules"
                  :show-size="1000"
                  color="info"
                  :clearable="false"
                  :error-messages="
                    invalid_img_dimensions
                      ? 'Invalid Favicon Dimensions!'
                      : null
                  "
                  counter
                  chips
                  accept="image/ico, image/png, image/jpeg, image/gif, image/jpg"
                  label="Click to upload an image"
                  prepend-icon="mdi-image"
                  outlined
                  @change="previewUpload($event)"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                      v-if="index < 2"
                      color="deep-purple accent-4"
                      dark
                      label
                    >
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-form>
            </div>
            <v-layout column justify-center align-center>
              <span>Preview</span>
              <v-flex class="img-preview-container">
                <v-img
                  id="img-preview"
                  :src="favicon_url"
                  class="img-preview elevation-2"
                  contain
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-1"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-flex>
            <v-btn
              color="error"
              :disabled="favicon_loading"
              @click="favicon_dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="success"
              :loading="favicon_loading"
              :disabled="favicon_loading"
              @click="updateFavicon()"
            >
              Save
            </v-btn>
          </v-flex>
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

.function-icon-actions {
  width: 100%;
}

.icon-preview-container {
  border: 1px solid #e6e6e6;
  width: 100px;
  height: 100px;
}
</style>
