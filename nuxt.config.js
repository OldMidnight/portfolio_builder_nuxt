// const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1.0'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Comfortaa:300,400,700&display=swap'
      }
    ]
    // script: [
    //   {
    //     type: 'text/javascript',
    //     innerHTML: `
    //       var _paq = window._paq || [];
    //       /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    //       _paq.push(['trackPageView']);
    //       _paq.push(['enableLinkTracking']);
    //       (function() {
    //         var u="https://kreoh.matomo.cloud/";
    //         _paq.push(['setTrackerUrl', u+'matomo.php']);
    //         _paq.push(['setSiteId', '1']);
    //         var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    //         g.type='text/javascript'; g.async=true; g.defer=true; g.src='//cdn.matomo.cloud/kreoh.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
    //       })();

    //     `
    //   }
    // ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'animate.css/animate.min.css',
    '~/assets/main.scss',
    '~/assets/variables.scss',
    '~/assets/creator.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/axios'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  // Router Config
  router: {
    middleware: ['auth']
  },
  // auth Config
  auth: {
    plugins: ['~/plugins/auth'],
    strategies: {
      local: {
        _scheme: '~/plugins/jwtAuth.js',
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: false
          },
          user: {
            url: '/auth/user',
            method: 'get',
            propertyName: false
          }
          // user: false
        },
        tokenRequired: true,
        tokenType: 'Bearer',
        tokenName: 'Authorization'
      }
    },
    redirect: {
      login: '/auth/login',
      logout: '/',
      home: '/dashboard'
    },
    rewriteRedirects: true,
    refresh_token: {
      prefix: '_refesh_token.'
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL:
      process.env.NODE_ENV === 'production'
        ? 'http://api.kreoh.com/'
        : 'http://127.0.0.1:5000/'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: false
    },
    treeshake: true,
    theme: {
      dark: false
      // themes: {
      //   dark: {
      //     primary: colors.blue.darken2,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3
      //   }
      // }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  },
  pageTransition: {
    enterActiveClass: 'animated fadeIn faster',
    leaveActiveClass: 'animated fadeOut faster'
  },
  layoutTransition: {
    enterActiveClass: 'animated fadeInUp',
    leaveActiveClass: 'animated fadeOutUp'
  }
}
