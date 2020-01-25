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
    <HomeSection />
    <!-- <v-footer
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
    </v-footer> -->
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
