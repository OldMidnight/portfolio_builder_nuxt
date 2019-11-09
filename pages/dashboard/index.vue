<script>
import { mapActions } from 'vuex'
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
      delete_msg: {}
    }
  },
  computed: {
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
  <v-container
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
  </v-container>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0 !important;
}

.dash-toolbar {
  color: white;
  // width: 100%;
}

.dash-links {
  color: white;
  box-shadow: none !important;
}

.main-container {
  width: 100%;
  height: 100%;
}

.sidenav-container {
  border-right: 1px solid #d9d9d9;
  width: 20%;
  background-color: white;
}

.content-container {
  width: 80%;
  padding: 2% 3% 0 3%;
  background-color: #fafafa;
}
</style>
