<script>
import Error from '@/components/helpers/error_component'
import Success from '@/components/helpers/success_component'
export default {
  components: { Error, Success }
}
</script>

<template>
  <v-app>
    <client-only placeholder="Loading...">
      <v-row
        justify="center"
        align="center"
        class="form-layout ma-0 h-100 w-100"
      >
        <v-col
          cols="12"
          :class="
            `h-${
              $breakpoint.is.smAndDown ? '10' : '10'
            } mb-md-2 pa-0 pos-rel d-flex justify-center align-end`
          "
        >
          <v-img
            :class="
              `logo mx-auto w-${$breakpoint.is.smAndDown ? '30' : '10'} pos-abs`
            "
            src="/Logo_beta_text.png"
            contain
          ></v-img>
        </v-col>
        <v-col
          cols="12"
          :class="
            `form ${
              $breakpoint.is.smAndDown ? 'h-80' : 'h-85'
            } d-flex align-center justify-center pa-0`
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
              $breakpoint.is.smAndDown ? '10' : '5'
            } d-flex justify-center align-center pa-0`
          "
        >
          <p
            :class="
              `text-center mt-2 terms w-${
                $breakpoint.is.smAndDown ? '100' : '30'
              }`
            "
          >
            By creating an account or signing in you agree to our
            <a>Terms and Conditions</a> and <a>use of cookies.</a>
          </p>
        </v-col>
      </v-row>
    </client-only>
    <span class="caption footer">
      &#169; {{ new Date().getFullYear() }} — Kreoh.com
    </span>
    <Error />
    <Success />
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
