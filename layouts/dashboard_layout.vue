<script>
export default {
  name: 'DashboardLayout',
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
      links: ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us'],
      site_screenshot: '',
      menu_drawer: null,
      isMobile: false
    }
  },
  beforeMount() {
    this.$vuetify.theme.dark = this.$auth.user.dark_mode
  },
  mounted() {
    this.isMobile = this.$vuetify.breakpoint.smAndDown
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
    async toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$auth.user.dark_mode
      await this.$axios.$put('/helpers/toggle_dark_mode')
      this.$auth.fetchUser()
    }
  }
}
</script>

<template>
  <v-app>
    <v-app-bar v-if="isMobile" class="px-2" app inverted-scroll>
      <v-app-bar-nav-icon
        @click.stop="menu_drawer = !menu_drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="h-100 w-100 d-flex align-center">
        <v-img
          class="logo w-25"
          :src="
            `${
              $vuetify.theme.dark
                ? '/Logo_beta_white.png'
                : '/Logo_beta_text.png'
            }`
          "
        ></v-img>
      </v-toolbar-title>
      <v-text-field
        class="h-100 w-100 mt-2"
        dense
        outlined
        label="Search..."
        rounded
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
    </v-app-bar>
    <client-only placeholder="Loading Dashboard...">
      <v-row
        v-if="!isMobile"
        :class="
          `w-100 h-100 ma-0 dashboard-container pos-rel justify-center ${
            $vuetify.theme.dark ? '' : 'dashboard--gradient'
          }`
        "
      >
        <v-col
          cols="11"
          :class="
            `dashboard-topnav ${
              $vuetify.theme.dark ? 'darkmode' : ''
            } elevation-1 pa-0 px-5 d-flex`
          "
        >
          <div class="logo-container d-flex align-center">
            <v-img
              class="logo"
              :src="
                `${
                  $vuetify.theme.dark
                    ? '/Logo_beta_white.png'
                    : '/Logo_beta_text.png'
                }`
              "
            ></v-img>
          </div>
          <div class="links-container d-flex align-center justify-end">
            <v-text-field
              class="dash-search mx-5 mt-3"
              dense
              outlined
              label="Search..."
              rounded
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-btn text nuxt>FAQ</v-btn>
            <v-btn text nuxt to="/dashboard/message-center?support=true">
              Support
            </v-btn>
            <v-btn icon @click="toggleDarkMode()">
              <v-icon>
                mdi-brightness-{{ this.$vuetify.theme.dark ? '4' : '5' }}
              </v-icon>
            </v-btn>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="error"
                  small
                  outlined
                  class="mx-2 "
                  v-on="on"
                  @click.stop="logout()"
                >
                  <v-icon>mdi-power</v-icon>
                </v-btn>
              </template>
              <span>Logout</span>
            </v-tooltip>
          </div>
        </v-col>
        <v-col
          cols="12"
          class="dashboard-content-wrapper d-flex pa-0 flex-column align-center justify-center"
        >
          <nuxt
            id="dashboard"
            :class="
              `elevation-2 dashboard--border mt-0 mb-9 ${
                $vuetify.theme.dark ? 'darkmode' : ''
              }`
            "
          />
          <div
            class="dashboard--footer-container d-flex flex-column justify-end"
          >
            <v-footer height="30" class="dashboard--footer" padless>
              <v-col class="text-center caption pa-0" cols="12">
                &#169; {{ new Date().getFullYear() }} — <strong>Kreoh</strong>
              </v-col>
            </v-footer>
          </div>
        </v-col>
      </v-row>
      <v-row
        v-else
        :class="`ma-0 ${$vuetify.theme.dark ? '' : 'dashboard--gradient'}`"
      >
        <v-col cols="12" class="border px-0 pb-0">
          <nuxt />
        </v-col>
        <v-col cols="12" class="pa-0" style="height: 2% !important">
          <v-footer height="30" class="dashboard--footer" padless>
            <v-col class="text-center caption pa-0" cols="12">
              &#169; {{ new Date().getFullYear() }} — <strong>Kreoh</strong>
            </v-col>
          </v-footer>
        </v-col>
      </v-row>
    </client-only>
    <v-navigation-drawer
      v-if="isMobile"
      v-model="menu_drawer"
      app
      bottom
      temporary
    >
      <v-list nav dense>
        <v-list-item link nuxt to="/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-group prepend-icon="mdi-chart-timeline-variant">
          <template v-slot:activator>
            <v-list-item-title>Settings</v-list-item-title>
          </template>

          <v-list-group no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Site Settings</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              link
              nuxt
              to="/dashboard/site-settings#metrics-section"
            >
              <v-list-item-title>Metrics</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-chart-timeline-variant</v-icon>
              </v-list-item-icon>
            </v-list-item>

            <v-list-item
              link
              nuxt
              to="/dashboard/site-settings#functionality-section"
            >
              <v-list-item-title>Functionality</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-cogs</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-group no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>User Settings</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              link
              nuxt
              to="/dashboard/user-settings#change_email_section"
            >
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-email</v-icon>
              </v-list-item-icon>
            </v-list-item>

            <v-list-item
              link
              nuxt
              to="/dashboard/user-settings#change_password_section"
            >
              <v-list-item-title>Password</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-lock</v-icon>
              </v-list-item-icon>
            </v-list-item>

            <v-list-item
              link
              nuxt
              to="/dashboard/user-settings#uploads_section"
            >
              <v-list-item-title>Uploads</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-upload</v-icon>
              </v-list-item-icon>
            </v-list-item>

            <v-list-item
              link
              nuxt
              to="/dashboard/user-settings#del_acc_section"
            >
              <v-list-item-title>Manage Account</v-list-item-title>
              <v-list-item-icon>
                <v-icon color="info">mdi-account-cog</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list-group>

        <v-list-item link nuxt to="/dashboard/message-center">
          <v-list-item-icon>
            <v-icon>mdi-forum</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Message Center</v-list-item-title>
        </v-list-item>

        <v-list-item @click="toggleDarkMode()">
          <v-list-item-icon>
            <v-icon>
              mdi-brightness-{{ this.$vuetify.theme.dark ? '4' : '5' }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>Toggle Dark Mode</v-list-item-title>
        </v-list-item>

        <v-list-item disabled>
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Your Plan</v-list-item-title>
        </v-list-item>

        <v-list-item color="error" :input-value="true" @click="logout()">
          <v-list-item-icon>
            <v-icon color="error">mdi-power</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- <script type="text/javascript">
      var _paq = window._paq || []
      /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
      _paq.push(['trackPageView'])
      _paq.push(['enableLinkTracking'])
      (function() {
        var u="https://kreoh.matomo.cloud/"
        _paq.push(['setTrackerUrl', u+'matomo.php'])
        _paq.push(['setSiteId', '1'])
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]
        g.type='text/javascript'; g.async=true; g.defer=true; g.src='//cdn.matomo.cloud/kreoh.matomo.cloud/matomo.js' s.parentNode.insertBefore(g,s);
      })()
    </script> -->
    <!-- End Matomo Code -->
  </v-app>
</template>

<style lang="scss" scoped>
.test {
  border: 1px solid red;
}

.dashboard-wrapper {
  padding: 0 !important;
}

.dashboard--gradient {
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
  max-height: 6%;
  background-color: #f5f5f5;
  position: relative;
  top: 1%;
  border-radius: 0.5em !important;
}

.logo-container {
  position: relative;
  width: 50%;
  height: 100%;
  padding-left: 2%;
}

.logo {
  position: absolute;
  width: 16%;
}

.links-container {
  width: 50%;
}

.dash-search {
  height: 100%;
}

.dashboard-content-wrapper {
  height: 94%;
}

#dashboard {
  width: 85%;
  height: 83%;
  background-color: #f5f5f5;
  position: absolute;
  transition: transform 1.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-style: preserve-3d;
}

.dashboard--footer-container {
  height: 100%;
  width: 100%;
}

.dashboard--footer {
  width: 100%;
}
</style>
