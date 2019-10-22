<script>
export default {
  auth: false,
  // middleware: 'get_site_config',
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
      if (this.$store.state.creator.is_subdomain) {
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
  }
}
</script>

<template>
  <!-- <v-container grid-list-md text-xs-center fluid justify-center fill-height>
    <v-layout column>
      <v-btn v-if="status.loggedIn" color="info" @click="logout()">
        Logout
      </v-btn>
    </v-layout>
  </v-container> -->
  <client-only placeholder="loading...">
    <component :is="getLayout"></component>
  </client-only>
</template>

<style lang="scss" scoped>
.arrow,
.settings-cog {
  color: #b6b6b6;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
}

.arrow:hover {
  color: black;
}

.settings-cog:hover {
  color: black;
}

.cog-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
</style>
