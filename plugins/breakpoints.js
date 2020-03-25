import Vue from 'vue'

Vue.prototype.$breakpoint = new Vue({
  data() {
    return {
      mountedBreakpoints: {},
      default: {
        xs: false,
        xsOnly: false,
        xsAndUp: false,
        sm: false,
        smOnly: false,
        smAndDown: false,
        smAndUp: false,
        md: true,
        mdOnly: false,
        mdAndDown: false,
        mdAndUp: false,
        lg: false,
        lgOnly: false,
        lgAndDown: false,
        lgAndUp: false,
        xl: false,
        xlOnly: false,
        xlAndDown: false
      }
    }
  },
  computed: {
    is() {
      return Object.keys(this.$vuetify.default).reduce((breakpoints, dim) => {
        breakpoints[dim] = this.breakpointWithDefault(dim)
        return breakpoints
      }, {})
    }
  },
  methods: {
    breakpointWithDefault(breakpoint) {
      return Object.keys(this.$data.mountedBreakpoints).length > 0
        ? this.$data.mountedBreakpoints[breakpoint]
        : this.$data.default[breakpoint]
    }
  }
})

// eslint-disable-next-line require-await
export default async function({ app }) {
  if (!app.mixins) {
    app.mixins = []
  }

  app.mixins.push({
    mounted() {
      this.$breakpoint.$data.mountedBreakpoints = this.$vuetify.breakpoint
    }
  })
}
