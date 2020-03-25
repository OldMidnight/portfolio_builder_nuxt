<script>
import Error from '@/components/helpers/error_component'
import Success from '@/components/helpers/success_component'
export default {
  components: { Error, Success },
  created() {
    this.$vuetify.theme.dark = false
  },
  methods: {
    showBetaDialog() {
      this.$root.$emit('showBetaDialog')
    }
  }
}
</script>

<template>
  <v-app>
    <v-app-bar app elevate-on-scroll>
      <v-toolbar-title
        :class="`h-100 ${$breakpoint.is.smAndDown ? 'w-30' : 'w-10'} pos-rel`"
      >
        <v-img
          class="pos-abs h-100 w-100"
          src="/Logo_beta_text.png"
          contain
        ></v-img>
      </v-toolbar-title>
      <v-spacer v-if="!$breakpoint.is.smAndDown"></v-spacer>
      <v-btn
        v-if="!$breakpoint.is.smAndDown"
        class="font-weight-light ml-6"
        text
      >
        Samples
      </v-btn>
      <v-btn
        v-if="!$breakpoint.is.smAndDown"
        class="font-weight-light ml-6"
        text
      >
        About
      </v-btn>
      <v-btn
        v-if="!$breakpoint.is.smAndDown"
        class="font-weight-light ml-6"
        text
      >
        Support
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="info"
        outlined
        class="mx-2 h-auto pa-3 pa-md-5 d-md-flex d-lg-flex d-xl-flex"
        nuxt
        to="/auth/login"
      >
        Login
      </v-btn>
      <v-btn
        color="info"
        depressed
        class="mx-2 h-auto pa-3 pa-md-5 d-md-flex d-lg-flex d-xl-flex"
        @click="showBetaDialog()"
      >
        Get Started
      </v-btn>
    </v-app-bar>
    <client-only placeholder="Loading Kreoh...">
      <v-content :class="`${$breakpoint.is.smAndDown ? 'pa-0 pt-7' : ''}`">
        <nuxt />
      </v-content>
    </client-only>
    <Error />
    <Success />
    <!-- Matomo -->
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
