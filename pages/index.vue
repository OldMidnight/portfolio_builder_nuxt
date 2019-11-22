<script>
export default {
  auth: false,
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
  data() {
    return {}
  },
  computed: {
    site_props() {
      return this.$store.state.creator.site_props
    },
    is_subdomain() {
      return this.$store.state.creator.is_subdomain
    },
    getLayout() {
      if (this.is_subdomain) {
        return () =>
          import(
            `@/components/user/layouts/${this.$store.state.creator.site_props.layout}`
          )
      } else {
        return () => import('@/components/home_section')
      }
    }
  },
  fetch({ store, $axios, redirect }) {
    if (
      store.state.creator.is_subdomain &&
      !store.state.creator.domain.available
    ) {
      redirect('/site_disabled')
    } else if (
      store.state.creator.is_subdomain &&
      store.state.creator.domain.available
    ) {
      return $axios
        .$post('/helper/site_config', {
          domain: store.state.creator.domain.name
        })
        .then((response) => {
          if (response.error) {
            redirect('/site_disabled')
          } else {
            store.commit(
              'creator/setSiteProps',
              JSON.parse(response.site_config)
            )
          }
        })
    }
  },
  beforeCreate() {
    if (
      this.$store.state.creator.is_subdomain &&
      !this.$store.state.creator.domain.available
    ) {
      this.$router.push({ path: '/site_disabled' })
    }
  },
  head() {
    return {
      title:
        this.$store.state.creator.is_subdomain &&
        this.$store.state.creator.domain.available
          ? this.$store.state.creator.site_props.site_name
          : 'Home - Kreoh.com'
    }
  }
}
</script>

<template>
  <v-layout class="app-container d-flex flex-column align-center">
    <client-only placeholder="Built Using Kreoh.com">
      <component :is="getLayout"></component>
      <v-footer
        padless
        height="30"
        class="user-footer caption font-weight-light d-flex flex-column align-center justify-center"
      >
        <span>
          &#169; {{ new Date().getFullYear() }} —
          <strong>
            <a href="www.kreoh.com">Kreoh.com</a>
          </strong>
        </span>
      </v-footer>
    </client-only>
  </v-layout>
</template>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  padding: 0 !important;
  width: 100%;
}

.user-footer {
  width: 100%;
}
</style>
