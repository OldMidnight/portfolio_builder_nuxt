<script>
import Prices from '@/components/home/prices_component'
export default {
  components: { Prices },
  data() {
    return {
      nav_state: false,
      kreoh_slogans: [
        'Built By Students, For Students',
        'Easy. Quick. Clean.',
        'Your Work, Your Website',
        'Your Brand, Your Portfolio',
        'Your First Step',
        'Your Next Step'
      ],
      slogan_interval: null,
      current_slogan: 0
    }
  },
  mounted() {
    this.slogan_interval = setInterval(() => {
      const newLineIndex = Math.floor(Math.random() * this.kreoh_slogans.length)
      this.current_slogan = newLineIndex
    }, 3000)
    if (window.scrollY > 10) {
      this.nav_state = true
    } else {
      this.nav_state = false
    }
  },
  methods: {
    changeNav() {
      if (window.scrollY > 10) {
        this.nav_state = true
      } else {
        this.nav_state = false
      }
    }
  }
}
</script>

<template>
  <v-container v-scroll="changeNav" class="view-wrapper pa-0 ma-0">
    <v-row
      class="top-nav d-flex"
      align="center"
      justify="center"
      :class="{ 'top-nav-scrolled': nav_state }"
      no-gutters
    >
      <v-col cols="3" class="d-flex align-center nav--item pl-9">
        <span
          class="logo font-weight-bold"
          :class="{
            '#383838--text': !nav_state,
            'grey--text text--lighten-4': nav_state
          }"
        >
          Kreoh
        </span>
      </v-col>
      <v-col
        cols="6"
        class="nav--item d-flex align-center justify-center nav-links"
      >
        <v-btn
          class="font-weight-light ml-6"
          :class="{
            '#383838--text': !nav_state,
            'grey--text text--lighten-4': nav_state
          }"
          text
        >
          Samples
        </v-btn>
        <v-btn
          class="font-weight-light ml-6"
          :class="{
            '#383838--text': !nav_state,
            'grey--text text--lighten-4': nav_state
          }"
          text
        >
          About
        </v-btn>
        <v-btn
          class="font-weight-light ml-6"
          :class="{
            '#383838--text': !nav_state,
            'grey--text text--lighten-4': nav_state
          }"
          text
        >
          Support
        </v-btn>
      </v-col>
      <v-col
        cols="3"
        class="d-flex align-center justify-center nav--item nav-btns"
      >
        <v-btn
          :color="nav_state ? 'grey lighten-4' : ''"
          nuxt
          to="/auth/login"
          text
          class=" mx-2"
        >
          Login
        </v-btn>
        <v-btn
          color="white"
          depressed
          nuxt
          to="/auth/register"
          class="mx-2 pa-7 elevation-0"
        >
          Get Started
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="home--content" no-gutters>
      <v-row class="content--landing">
        <v-col
          cols="5"
          class="home--landing-container home--landing-main d-flex flex-column align-end justify-center"
        >
          <div class="home--landing-text d-flex flex-column justify-end">
            <transition
              enter-active-class="animated fadeInUp fast"
              leave-active-class="animated fadeOutUp fast"
              mode="out-in"
            >
              <p class="text-left home--landing-subheading">
                {{ kreoh_slogans[current_slogan] }}
              </p>
            </transition>
            <p class="text-left home--landing-heading">
              DESIGN YOUR ONLINE PORTFOLIO
            </p>
          </div>
          <div class="home--landing-actions pt-8 d-flex flex-column">
            <div class="d-flex">
              <v-btn color="white" class="font-weight-bold mr-2 pa-9">
                Get Started
              </v-btn>
              <v-btn color="white" class="ml-2 font-weight-light pa-9" outlined>
                Start your free trial
              </v-btn>
            </div>
            <p style="font-size: 12px;" class="mt-4 font-weight-bold">
              No Credit Card Required.
            </p>
            <p style="font-size: 12px;" class="font-weight-bold">
              Get Up And Running in a matter of minutes!
            </p>
          </div>
        </v-col>
        <v-col
          cols="7"
          class="home--landing-container home--landing-img-wrapper d-flex align-center justify-center"
        >
          <v-col class="home--landing-img-container d-flex align-center">
            <v-img class="home--landing-img" src="/landing_img.jpg"></v-img>
          </v-col>
        </v-col>
      </v-row>
      <v-row class="content--preview pt-7">
        <v-col
          cols="12"
          class="home--preview-intro d-flex flex-column align-center"
        >
          <p style="font-size: 40px" class="py-1 font-weight-bold">
            Clean and Minimalist designs
          </p>
          <p style="font-size: 20px" class="py-1">
            Kreoh websites are built with functionality and ease of use front
            and center.
          </p>
        </v-col>
        <v-col cols="12" class="home--preview-content">
          <v-row align="center" class="preview--content">
            <v-col
              cols="12"
              class="home--preview-item d-flex justify-space-around"
            >
              <div
                class="home--preview-img-container elevation-1 d-flex flex-column align-center justify-center"
              >
                <v-img
                  class="home--preview-img"
                  src="/layout_images/kreoh_layout_1_fresh.png"
                ></v-img>
              </div>
              <div
                class="home--preview-text text-center d-flex flex-column justify-center align-center"
              >
                <p style="font-size: 26px" class="font-weight-bold">
                  Pre-made Themes
                </p>
                <p class="font-weight-light mt-4">
                  Choose from a selection of pre-configured templates and
                  layouts. Let us worry about the colors.
                </p>
              </div>
            </v-col>
            <v-col
              cols="12"
              class="home--preview-item-s d-flex justify-space-around"
            >
              <div
                class="home--preview-text text-center d-flex flex-column justify-center align-center"
              >
                <p style="font-size: 26px" class="font-weight-bold">
                  Functional
                </p>
                <p class="font-weight-light mt-4">
                  We're all busy individuals, so let us make some part of your
                  life a little easier! Your website will be easy to access and
                  easy to use.
                </p>
              </div>
              <div
                class="home--preview-img-container elevation-1 d-flex flex-column align-center justify-center"
              >
                <v-img
                  class="home--preview-img border-white"
                  src="/layout_images/kreoh_layout_1_matrix.png"
                ></v-img>
              </div>
              <!-- <div
                class="home--preview-text text-center d-flex flex-column justify-center align-center"
              >
                <p style="font-size: 26px" class="font-weight-bold">
                  Functional
                </p>
                <p class="font-weight-light mt-4">
                  We're all busy individuals, so let us make some part of your
                  life a little easier! Your website will be easy to access,
                  easy to use. Really there's very little to lose :)
                </p>
              </div> -->
            </v-col>
            <v-col
              cols="12"
              class="home--preview-item d-flex justify-space-around"
            >
              <div
                class="home--preview-img-container elevation-1 d-flex flex-column align-center justify-center"
              >
                <v-img
                  class="home--preview-img"
                  src="/layout_images/kreoh_layout_1_slate.png"
                ></v-img>
              </div>
              <div
                class="home--preview-text text-center d-flex flex-column justify-center align-center"
              >
                <p style="font-size: 26px" class="font-weight-bold">Simple</p>
                <p class="font-weight-light mt-4">
                  Register, deploy your pre-made website and you're ready to go.
                  Kreoh websites have you up and running in under 5 minutes! No
                  hassle, no crazy editor. Just you and your work.
                </p>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="content--pricing">
        <v-col
          cols="12"
          class="pricing--intro d-flex flex-column align-center justify-center text-center mb-3"
        >
          <p style="font-size: 40px" class="font-weight-bold">
            Pricing Plans
          </p>
          <p style="font-size: 20px">
            Kreoh offers different plans depending on your needs. Buy
            subscribing your supporting us in our mission to get all students of
            all disciplines their foot in the professional door.
          </p>
        </v-col>
        <Prices />
        <v-col cols="12" class="d-flex justify-center flex-column align-center">
          <p style="font-size: 10px" class="font-weight-light my-2">
            * Pro accounts can request additional storage up to 1GB
          </p>
          <v-btn color="info" class="pa-7 font-weight-bold" tile>
            Get Started
          </v-btn>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.test {
  border: 1px solid red;
}

.logo {
  font-size: 30px;
}

.view-wrapper {
  height: 100%;
  // overflow: auto;
  width: 100%;
  max-width: 100%;
  background-color: #6da4ff;
}

.home--content {
  // height: 100vh;
  // background-color: #6da4ff;
  width: 100%;
}

.content--landing {
  height: 100vh;
}

.content--preview {
  height: 150vh;
  background-color: white;
}

.content--pricing {
  height: 110vh;
  background-color: white;
}

.home--preview {
  // height: 100%;
  width: 100%;
  // position: relative;
  padding-top: 2%;
}

.home--landing-container {
  height: 100%;
  width: 50%;
}

.home--landing-main {
  padding-left: 10%;
  width: 30%;
  padding-top: 10%;
}

.home--landing-text {
  height: 50%;
  width: 100%;
}

.home--landing-subheading {
  font-size: 1.8rem;
  // transition: 0.3s;
}

.home--landing-heading {
  font-size: 45px;
}

.home--landing-actions {
  height: 50%;
  width: 100%;
}

.home--landing-img-container {
  height: 90%;
  width: 80%;
  position: relative;
  // border: 3px solid white;
  // border-bottom-left-radius: 20px;
}

.home--landing-img {
  height: 100%;
  border: 5px solid white;
  border-radius: 30px;
  position: absolute;
  left: 10%;
  // width: 100%;
}

.top-nav {
  position: fixed;
  height: 10% !important;
  top: 0;
  width: 100%;
  background-color: #6da4ff;
  z-index: 5;
  transition: 0.2s;
  // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.top-nav-scrolled {
  background-color: black !important;
}

.nav--item {
  height: 100%;
}

.home--preview-intro {
  height: 15%;
}

.home--preview-content {
  height: 85%;
}

.preview--content {
  height: 100%;
  background-color: black;
}

.home--preview-main-heading {
  font-size: 40px;
}

.home--preview-main-subheading {
  font-size: 20px;
}

.home--preview-item {
  height: 33%;
  width: 100%;
  padding-right: 10%;
}

.home--preview-item-s {
  height: 33%;
  width: 100%;
  padding-left: 10%;
}

.home--preview-img-container {
  width: 40%;
  height: 100%;

  position: relative;
}

.home--preview-text {
  width: 20%;
  height: 100%;
  p {
    font-weight: 20px;
    color: white;
  }
}

.home--preview-img {
  // height: 100px;
  // width: 100%;
  position: absolute;
  border-radius: 15px;
}

.pricing--intro {
  height: 20%;
  padding: 0 20%;
}

.border-white {
  border: 1px solid white;
}
</style>
