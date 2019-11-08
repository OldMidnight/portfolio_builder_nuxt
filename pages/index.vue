<script>
export default {
  auth: false,
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
  fetch({ store, $axios }) {
    if (store.state.creator.is_subdomain) {
      return $axios
        .$post('/helper/site_config', {
          domain: store.state.creator.domain.name
        })
        .then((response) => {
          store.commit('creator/setSiteProps', JSON.parse(response.site_config))
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
  }
}
</script>

<template>
  <v-layout class="app-container d-flex flex-column align-center">
    <client-only placeholder="Built Using Kreoh.com">
      <component :is="getLayout"></component>
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
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
