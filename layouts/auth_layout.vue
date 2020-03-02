<script>
export default {}
</script>

<template>
  <v-app>
    <v-container fluid fill-height>
      <v-row
        justify="center"
        align="center"
        class="form-layout ma-0 h-100 w-100"
      >
        <v-col
          cols="12"
          :class="
            `h-${this.$vuetify.breakpoint.smAndDown ? '10' : '15 mb-2'} pt-0`
          "
        >
          <!-- <span class="logo mb-7 font-weight-bold">
            Kreoh.com
          </span> -->
          <v-img
            :class="
              `logo mx-auto w-${
                this.$vuetify.breakpoint.smAndDown ? '50' : '20'
              }`
            "
            src="/Logo_beta_text.png"
          ></v-img>
        </v-col>
        <v-col
          :cols="this.$vuetify.breakpoint.smAndDown ? '12' : '3'"
          :class="
            `form ${
              this.$vuetify.breakpoint.smAndDown ? 'h-80' : 'elevation-1'
            } d-flex align-center justify-center`
          "
        >
          <transition
            name="auth-transition"
            enter-active-class="animated fadeIn fast"
            leave-active-class="animated fadeOut fast"
            mode="out-in"
          >
            <nuxt />
          </transition>
        </v-col>
        <v-col
          cols="12"
          :class="
            `h-${
              this.$vuetify.breakpoint.smAndDown ? '10' : '5'
            } d-flex justify-center`
          "
        >
          <p
            :class="
              `text-center mt-2 terms w-${
                this.$vuetify.breakpoint.smAndDown ? '100' : '30'
              }`
            "
          >
            By creating an account or signing in you agree to our
            <a>Terms and Conditions</a> and <a>use of cookies.</a>
          </p>
        </v-col>
      </v-row>
    </v-container>
    <span class="caption footer mb-5">
      &#169; {{ new Date().getFullYear() }} — Kreoh.com
    </span>
    <script type="text/javascript">
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
    </script>
    <!-- End Matomo Code -->
  </v-app>
</template>

<style lang="scss" scoped>
.form {
  border-radius: 10px;
}

.footer {
  color: #777;
  text-align: center;
}

.terms {
  color: #777;
  font-size: 10px;
}
</style>
