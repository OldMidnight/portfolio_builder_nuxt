<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>

<template>
  <v-app>
    <v-content>
      <nuxt />
    </v-content>
    <!-- Matomo -->
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
