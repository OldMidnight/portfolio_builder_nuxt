<script>
import HomeSection from '@/components/home_section'
export default {
  name: 'Home',
  components: { HomeSection },
  auth: false,
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
  head() {
    return {
      title: 'Home - Kreoh.com',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto&display=swap'
        }
      ]
    }
  }
}
</script>

<template>
  <v-layout class="app-container d-flex flex-column align-center">
    <client-only placeholder="Loading Home Page">
      <HomeSection />
    </client-only>
  </v-layout>
</template>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  padding: 0 !important;
  width: 100%;
  overflow-x: hidden;
}

.user-footer {
  width: 100%;
}
</style>
