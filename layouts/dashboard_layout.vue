<script>
export default {
  name: 'DashboardLayout',
  fetch({ store, $axios }) {
    return $axios.$get('/helper/auth_site_config').then((response) => {
      if (!response.site_not_created) {
        store.commit('creator/setSiteProps', response.site_config)
      }
    })
  },
  data() {
    return {
      links: ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us'],
      site_screenshot: ''
    }
  },
  created() {
    this.$auth.fetchUser()
  },
  methods: {
    logout() {
      this.$auth.logout()
    }
  }
}
</script>

<template>
  <v-app>
    <v-container
      class="dashboard-wrapper dashboard--gradient"
      fluid
      fill-height
    >
      <v-layout class="dashboard-container d-flex flex-column">
        <v-layout
          class="dashboard-topnav elevation-3 px-5 d-flex topnav--neumorph"
        >
          <div class="logo-container d-flex align-center">
            <v-img class="logo" src="/Logo_beta_text.png"></v-img>
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
          class="dashboard-content-wrapper d-flex flex-column align-center justify-center"
        >
          <nuxt
            id="dashboard"
            class="elevation-15 dashboard--border mt-0 mb-9"
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
        </v-layout>
      </v-layout>
    </v-container>
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
  height: 6%;
  max-height: 6%;
  min-height: 6%;
  background-color: #f5f5f5;
  margin: 15px 2% 0 2% !important;
  border-radius: 0.5em !important;
}

.logo-container {
  position: relative;
  width: 60%;
  height: 100%;
  padding-left: 2%;
  // span {
  //   color: #0066ff;
  //   text-align: center;
  //   font-size: 32px;
  // }
}

.logo {
  position: absolute;
  width: 13%;
}

.links-container {
  width: 40%;
}

.dash-search {
  height: 100%;
}

.dashboard-content-wrapper {
  height: 94%;
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
  height: 83%;
  // margin: 60px 130px;
  background-color: #f5f5f5;
  // border-radius: 10px;
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
