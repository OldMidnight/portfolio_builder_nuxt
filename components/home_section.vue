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
      current_slogan: 0,
      beta_dialog: false,
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      email: null,
      mailing_add_pass: false,
      mailing_add_msg: null,
      mailing_add_fail: false,
      loading: false,
      email_loading: false
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    }
  },
  created() {
    this.loading = true
    this.slogan_interval = setInterval(() => {
      const newLineIndex = Math.floor(Math.random() * this.kreoh_slogans.length)
      this.current_slogan = newLineIndex
    }, 3000)
  },
  mounted() {
    if (window.scrollY > 5) {
      this.nav_state = true
    } else {
      this.nav_state = false
    }
    this.loading = false
  },
  beforeDestroy() {
    clearInterval(this.slogan_interval)
  },
  methods: {
    changeNav() {
      if (window.scrollY > 5) {
        this.nav_state = true
      } else {
        this.nav_state = false
      }
    },
    notifyEmail() {
      if (this.$refs.mail_list_form.validate(true)) {
        this.email_loading = true
        this.$axios
          .post('/mail/mailing_list/add', { email: this.email })
          .then((response) => {
            this.mailing_add_msg = response.data.msg
            this.mailing_add_pass = true
            this.email_loading = false
          })
          .catch((e) => {
            if (e.response) {
              this.mailing_add_msg = e.response.data.msg
            } else {
              this.mailing_add_msg = 'There was an error processing the request'
            }
            this.mailing_add_fail = true
            this.email_loading = false
          })
      }
    }
  }
}
</script>

<template>
  <v-container v-scroll="changeNav" class="view-wrapper pa-0 ma-0">
    <v-row
      class="top-nav d-flex ma-0"
      :class="{
        'top-nav-scrolled': nav_state,
        'm-top-nav': isMobile
      }"
      no-gutters
    >
      <v-col
        cols="2"
        class="d-flex align-center nav--item"
        :class="{
          'nav--item': !isMobile
        }"
      >
        <v-row class="item--container ma-0">
          <v-col
            cols="12"
            class="item--logo-container pa-0 d-flex align-center ml-4 ml-md-auto pl-1 pl-md-9"
          >
            <v-img
              class="item--logo"
              :class="{ 'm-item--logo': isMobile }"
              :src="nav_state ? '/Logo_beta_white.png' : '/Logo_beta_black.png'"
              contain
            ></v-img>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="6"
        class="nav--item d-none d-md-flex d-lg-flex d-xl-flex align-center justify-center nav-links"
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
        col="10"
        md="4"
        class="d-flex align-center nav--item nav-btns justify-end pr-3"
      >
        <v-btn
          :color="isMobile || nav_state ? 'white' : ''"
          text
          class="mx-2"
          @click="beta_dialog = true"
        >
          Login
        </v-btn>
        <v-btn
          color="white"
          depressed
          class="mx-2 h-auto pa-5 elevation-0 d-none d-md-flex d-lg-flex d-xl-flex"
          @click="beta_dialog = true"
        >
          Get Started
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="home--content ma-0" no-gutters>
      <v-row
        class="content--landing ma-0"
        :class="{ 'm-content--landing': isMobile }"
      >
        <transition appear appear-active-class="animated fadeIn" mode="out-in">
          <v-col
            col="12"
            md="5"
            class="home--landing-container home--landing-main d-flex flex-column align-end justify-center"
            :class="{ 'm-home--landing-main': isMobile }"
          >
            <div
              class="home--landing-text d-flex flex-column justify-end px-5 px-md-auto"
              :class="{
                'align-center text-center': isMobile
              }"
            >
              <transition
                enter-active-class="animated fadeInUp fast"
                leave-active-class="animated fadeOutUp fast"
                mode="out-in"
              >
                <p
                  class="home--landing-subheading"
                  :class="{
                    'm-home--landing-subheading': isMobile
                  }"
                >
                  {{ kreoh_slogans[current_slogan] }}
                </p>
              </transition>
              <p
                class="home--landing-heading font-weight-bold"
                :class="{
                  'm-home--landing-heading': isMobile
                }"
              >
                DESIGN YOUR ONLINE PORTFOLIO
              </p>
            </div>
            <div
              class="home--landing-actions d-flex flex-column pt-3 pt-md-8"
              :class="{
                'align-center justify-start': isMobile
              }"
            >
              <div class="d-flex">
                <v-btn
                  style="font-size: 16px"
                  color="white"
                  class="font-weight-bold mr-2 h-auto pa-5 pa-md-6"
                  @click="beta_dialog = true"
                >
                  Get Started
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
        </transition>
        <transition appear appear-active-class="animated fadeIn" mode="out-in">
          <v-col
            cols="12"
            md="7"
            class="home--landing-container d-flex"
            :class="{
              'm-home--landing-img-wrapper': isMobile,
              'align-center justify-center': !isMobile
            }"
          >
            <v-col class="home--landing-img-container d-flex align-center">
              <v-skeleton-loader
                v-if="loading"
                class="mx-auto"
                type="image"
              ></v-skeleton-loader>
              <v-img
                v-else
                class="home--landing-img"
                src="/landing_img.jpg"
              ></v-img>
            </v-col>
          </v-col>
        </transition>
      </v-row>
      <v-row
        class="content--value ma-0 py-5"
        :class="{ 'm-content--value': isMobile }"
      >
        <v-col cols="12" class="d-flex justify-center align-center pa-0 h-10">
          <p :style="{ fontSize: '40px' }" class="font-weight-bold">Features</p>
        </v-col>
        <v-col cols="12" class="pa-0 h-90">
          <v-row class="h-100 ma-0">
            <v-col
              cols="12"
              md="4"
              :class="{
                'm-value--item-container': isMobile
              }"
            >
              <v-row class="value--item" :class="{ 'm-value--item': isMobile }">
                <v-col
                  cols="12"
                  class="value--item-img-container pa-0 d-flex justify-center align-center"
                >
                  <v-img
                    class="value--item-img"
                    src="/kreoh_home/value_advantage.jpg"
                    contain
                  ></v-img>
                </v-col>
                <v-col
                  cols="12"
                  class="value--item-text text-center d-flex flex-column justify-center align-center"
                >
                  <p class="headline font-weight-bold text-center">
                    Claim Your Competitive Advantage
                  </p>
                  <p>
                    Use your unique link to promote yourself, online and offline
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="4"
              :class="{
                'm-value--item-container': isMobile
              }"
            >
              <v-row class="value--item ma-0">
                <v-col
                  cols="12"
                  class="value--item-img-container pa-0 d-flex justify-center align-center"
                >
                  <v-img
                    class="value--item-img"
                    src="/kreoh_home/value_show.jpg"
                    contain
                  ></v-img>
                </v-col>
                <v-col
                  cols="12"
                  class="value--item-text d-flex flex-column text-center justify-center align-center"
                >
                  <p class="headline font-weight-bold">
                    Call-To-Action Button
                  </p>
                  <p>
                    Have a cause you want to stand for? Show your support on
                    your website with a direct link and built-in interaction
                    analytics
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="4"
              :class="{
                'm-value--item-container': isMobile
              }"
            >
              <v-row class="value--item ma-0">
                <v-col
                  cols="12"
                  class="value--item-img-container pa-0 d-flex justify-center align-center"
                >
                  <v-img
                    class="value--item-img"
                    src="/kreoh_home/kreoh_pages.png"
                    contain
                  ></v-img>
                </v-col>
                <v-col
                  cols="12"
                  class="value--item-text d-flex flex-column text-center justify-center align-center"
                >
                  <p class="headline font-weight-bold">
                    3-Page System
                  </p>
                  <p>
                    Fill your website with things that best show off who you
                    are. Divide your website between 3 customisale pages: Home,
                    Projects and Resume
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        class="content--preview pt-7 ma-0"
        :class="{ 'm-content--preview': isMobile }"
      >
        <v-col
          cols="12"
          class="home--preview-intro d-flex flex-column align-center px-3 px-md-auto"
          :class="{
            'm-home--preview-intro': isMobile
          }"
        >
          <p
            :style="{ fontSize: isMobile ? '30px' : '40px' }"
            class="py-1 font-weight-bold"
            :class="{ 'text-center': isMobile }"
          >
            Clean and Minimalist designs
          </p>
          <p
            :style="{
              fontSize: isMobile ? '18px' : '20px',
              padding: isMobile ? '0 5%' : '0 20%'
            }"
            class="text-center"
          >
            Kreoh websites are built with functionality and ease of use front
            and center. If you've got a project you want to display, we can get
            you up and running in a matter of minutes. No long wait or
            complicated process.
          </p>
        </v-col>
        <v-col
          cols="12"
          class="home--preview-content pa-0"
          :class="{ 'm-home--preview-content': isMobile }"
        >
          <v-row align="center" class="preview--content ma-0">
            <v-col
              cols="12"
              class="home--preview-item d-flex justify-space-around px-0 px-md-auto flex-column flex-md-row"
              :class="{
                'm-home--preview-item': isMobile
              }"
            >
              <v-row class="ma-0 h-100 w-100">
                <v-col
                  cols="12"
                  md="6"
                  class="pos-rel elevation-1 d-flex flex-column align-center px-4 justify-center"
                  :class="{
                    'm-home--preview-img-container': isMobile
                  }"
                >
                  <v-img
                    class="h-100 pos-abs"
                    :class="{
                      'm-home--preview-img': isMobile
                    }"
                    contain
                    src="/layout_images/kreoh_layouts.png"
                  ></v-img>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="home--preview-text text-center d-flex flex-column justify-center align-center px-9"
                  :class="{
                    'm-home--preview-text': isMobile
                  }"
                >
                  <p style="font-size: 26px" class="font-weight-bold">
                    Pre-made Themes
                  </p>
                  <p class="font-weight-light mt-4">
                    Choose from a selection of pre-configured templates and
                    layouts. Let us worry about the colors.
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              class="home--preview-item-s d-flex justify-space-around px-0 px-md-auto flex-column flex-md-row"
              :class="{
                'm-home--preview-item': isMobile
              }"
            >
              <v-row class="ma-0 h-100 w-100">
                <v-col
                  v-if="isMobile"
                  cols="12"
                  class="pos-rel elevation-1 d-flex flex-column align-center justify-center"
                  :class="{
                    'm-home--preview-img-container': isMobile
                  }"
                >
                  <v-img
                    class="h-100 pos-abs"
                    :class="{
                      'm-home--preview-img': isMobile
                    }"
                    contain
                    src="/kreoh_home/kreoh_form.png"
                  ></v-img>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="home--preview-text text-center d-flex flex-column justify-center align-center px-9"
                  :class="{
                    'm-home--preview-text': isMobile
                  }"
                >
                  <p style="font-size: 26px" class="font-weight-bold">
                    Functional & Accessible
                  </p>
                  <p class="font-weight-light mt-4">
                    Kreoh websites are optimized for all form factors including
                    mobile devices. Create, edit and deploy your website from
                    your phone.
                  </p>
                </v-col>
                <v-col
                  v-if="!isMobile"
                  cols="12"
                  md="6"
                  class="pos-rel elevation-1 d-flex align-center justify-center"
                >
                  <v-img
                    class="h-100 w-100 pos-abs"
                    contain
                    src="/kreoh_home/kreoh_form.png"
                  ></v-img>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              class="home--preview-item d-flex justify-space-around flex-column flex-md-row px-0 px-md-auto"
              :class="{
                'm-home--preview-item': isMobile
              }"
            >
              <v-row class="ma-0 h-100 w-100">
                <v-col
                  cols="12"
                  md="6"
                  class="pos-rel elevation-1 d-flex align-center justify-center"
                  :class="{
                    'm-home--preview-img-container': isMobile
                  }"
                >
                  <v-img
                    class="h-100 w-100 rounded pos-abs"
                    :class="{
                      'm-home--preview-img': isMobile
                    }"
                    contain
                    src="/layout_images/kreoh_layout_1_slate.png"
                  ></v-img>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="home--preview-text text-center d-flex flex-column justify-center align-center px-9"
                  :class="{
                    'm-home--preview-text': isMobile
                  }"
                >
                  <p style="font-size: 26px" class="font-weight-bold">Simple</p>
                  <p class="font-weight-light mt-4">
                    Register, deploy your pre-made website and you're ready to
                    go. Kreoh websites have you up and running in under 5
                    minutes! No hassle, no crazy editor. Just you and your work.
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        class="content--pricing ma-0"
        :class="{ 'm-content--pricing': isMobile }"
      >
        <v-col
          cols="12"
          class="pricing--intro d-flex flex-column align-center justify-center text-center mb-3"
          :class="{ 'm-pricing--intro': isMobile }"
        >
          <p
            :style="{ fontSize: isMobile ? '30px' : '40px' }"
            class="font-weight-bold"
          >
            Price Plans
          </p>
          <p :style="{ fontSize: isMobile ? '18px' : '20px' }">
            Get started with kreoh today for free! Our subscription plan offers
            a wide myriad of extra functionality so if it suits your fancy,
            check it out!
          </p>
        </v-col>
        <Prices />
        <v-col
          cols="12"
          class="pricing--action d-flex align-center flex-column justify-start justify-md-center pa-0"
          :class="{
            'm-pricing--action': isMobile
          }"
        >
          <v-btn
            color="info"
            class="pa-6 h-auto font-weight-bold"
            tile
            @click="beta_dialog = true"
          >
            Get Started
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        class="content--about ma-0"
        :class="{ 'm-content--about': isMobile }"
      >
        <v-col
          cols="12"
          md="6"
          class="px-5 about--img-container d-flex justify-center align-center"
          :class="{ 'm-about--img-container': isMobile }"
        >
          <v-img
            class="about--img elevation-2"
            contain
            src="/kreoh_home/about_img.svg"
          ></v-img>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="about--text pt-5 white--text d-flex flex-column justify-space-around"
          :class="{ 'm-about--text': isMobile }"
        >
          <div
            class="about--text-wrapper d-flex pb-7"
            :class="{
              'm-about--text-wrapper d-flex flex-column align-center justify-center': isMobile
            }"
          >
            <p
              :style="{
                fontSize: isMobile ? '18px' : '22px'
              }"
              class="mx-md-3"
            >
              Kreoh was built with the idea of providing every person the
              opportunity to promote themselves.
            </p>
            <p
              :style="{
                fontSize: isMobile ? '18px' : '22px'
              }"
              class="mx-md-3"
            >
              Not everyone needs an online store or business. A simple website,
              where your work and interests are at the forefront offer the
              simplicity for both you and visitors of your website to understand
              you as a person.
            </p>
          </div>
          <p
            :style="{
              fontSize: isMobile ? '28px' : '42px'
            }"
            class="font-weight-bold text-center"
          >
            Show off who you are without compromising your skills.
          </p>
          <v-btn
            depressed
            color="info"
            class="h-auto w-40 pa-5 pa-md-6 align-self-center elevation-0"
            @click="beta_dialog = true"
          >
            Get Started
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        class="content--footer ma-0"
        :class="{ 'm-content--footer': isMobile }"
      >
        <v-col
          cols="12"
          md="7"
          :style="{ height: isMobile ? '40%' : 'initial' }"
        >
          <v-row
            class="footer--text-container white--text ma-0"
            :class="{
              'm-footer--text-container': !isMobile
            }"
          >
            <v-col cols="4" class="d-flex flex-column align-center">
              <p style="font-size: 22px" class="font-weight-bold mb-9">
                Support
              </p>
              <a class="footer--text">Reddit</a>
              <a class="footer--text">FAQ</a>
              <a class="footer--text">Email</a>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center">
              <p style="font-size: 22px" class="font-weight-bold mb-9">
                Company
              </p>
              <a class="footer--text text-center">About Kreoh</a>
              <a class="footer--text text-center">Blog</a>
              <a class="footer--text text-center">Privacy Policy</a>
              <a class="footer--text text-center">Terms Of Use</a>
              <a class="footer--text text-center">Updates & Releases</a>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center">
              <p style="font-size: 22px" class="font-weight-bold mb-9">
                Follow
              </p>
              <a class="footer--text text-center">Kreoh Blog</a>
              <a class="footer--text text-center">Instagram</a>
              <a class="footer--text text-center">Youtube</a>
              <a
                class="footer--text text-center"
                href="https://twitter.com/OfficialKreoh"
              >
                Twitter
              </a>
              <a class="footer--text text-center">LinkedIn</a>
              <a class="footer--text text-center" href="fb.me/OfficialKreoh">
                Facebook
              </a>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          :style="{ height: isMobile ? '60%' : 'initial' }"
          cols="12"
          md="5"
          class="pr-md-9"
        >
          <v-row class="footer--logo-wrapper ma-0">
            <v-col
              cols="12"
              class="footer--logo-container pa-0"
              :class="{
                'm-footer--logo-container': isMobile
              }"
            >
              <v-row class="footer--logo-wrapper ma-0">
                <v-col
                  cols="12"
                  class="pa-0 footer--logo-img d-flex justify-center align-center"
                >
                  <v-img
                    src="/Logo_beta_white.png"
                    class="footer--logo"
                  ></v-img>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              class="footer--logo-text grey--text d-flex flex-column justify-space-around"
              :class="{ 'm-footer--logo-text': isMobile }"
            >
              <p
                :style="{
                  fontSize: isMobile ? '12px' : 'initial'
                }"
                class="text-center"
              >
                Kreoh.com is an online website and resume hosting platform,
                allowing users to customise and deploy a website from a
                selection of kreoh templates.
              </p>
              <p
                :style="{
                  fontSize: isMobile ? '12px' : 'initial'
                }"
                class="text-center"
              >
                Display your work, host your resume and give yourself an
                advantage in a competitive job market. Kreoh websites give you
                everything you will need for a simple, easy and ready-to-go
                website in minutes.
              </p>
              <a
                style="font-size: 12px; color: white;"
                href="https://www.vecteezy.com/"
                class="text-center"
              >
                Vectors by Vecteezy
              </a>
              <p
                :style="{
                  fontSize: isMobile ? '12px' : 'initial'
                }"
                class="text-center"
              >
                &#169; {{ new Date().getFullYear() }} —
                <strong>
                  <nuxt-link to="/" class="link--white">Kreoh.com</nuxt-link>
                </strong>
              </p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
    <v-dialog
      v-model="beta_dialog"
      :fullscreen="isMobile"
      width="500"
      scrollable
    >
      <v-card>
        <v-card-title class="d-flex justify-center">
          <p style="font-size: 28px" class="font-weight-bold">
            Kreoh is Coming Soon!
          </p>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row class="ma-0">
              <v-col
                cols="12"
                class="d-flex flex-column align-center justify-center text-center"
              >
                <p class="my-3 font-weight-bold">
                  Kreoh is on it's way. Be the first to be notified when we
                  launch!
                </p>
                <p class="my-3 font-weight-bold">
                  Of course, we will not send you any unrelated emails until
                  then. Spam is annoying for everyone!
                </p>
              </v-col>
              <v-col cols="12" class="d-flex flex-column align-center">
                <span
                  style="font-size: 22px"
                  class="font-weight-bold mb-4 text-center"
                >
                  Get Notified When We Lauch!
                </span>
                <v-form ref="mail_list_form">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    outlined
                  ></v-text-field>
                </v-form>
                <div>
                  <v-btn
                    color="success"
                    :disabled="email_loading"
                    :loading="email_loading"
                    @click="notifyEmail()"
                  >
                    Join
                  </v-btn>
                  <v-btn color="error" @click="beta_dialog = false">
                    Close
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12">
                <v-expansion-panels focusable>
                  <v-expansion-panel>
                    <v-expansion-panel-header expand-icon="mdi-menu-down">
                      Beta Program
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row class="dialog--beta-container ma-0">
                        <v-col
                          cols="12"
                          class="d-flex flex-column align-center"
                        >
                          <p
                            :style="{ fontSize: '18px' }"
                            class="font-weight-bold text-center"
                          >
                            Interested in becoming a Kreoh tester and help shape
                            kreoh's future?
                          </p>
                          <p class="font-weight-bold mt-4">
                            As a beta tester you can:
                          </p>
                          <ul>
                            <li>Get early access to Kreoh</li>
                            <li>Ability to reserve a Kreoh subdomain</li>
                            <li>Test all features of Kreoh</li>
                            <li>Provide feedback on current features</li>
                            <li>
                              Recommend and design features to be implemented
                            </li>
                          </ul>
                          <p class="font-weight-bold mt-4">
                            Get ready to help create something different!
                          </p>
                          <v-btn
                            color="info"
                            class="mt-3"
                            nuxt
                            to="/auth/register"
                          >
                            Become a tester
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="mailing_add_pass" color="success">
      {{ mailing_add_msg }}
      <v-btn icon @click="mailing_add_pass = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="mailing_add_fail" color="error">
      {{ mailing_add_msg }}
      <v-btn icon @click="mailing_add_fail = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<style lang="scss" scoped>
.logo {
  font-size: 30px;
}

.m-logo {
  font-size: 22px !important;
}

.view-wrapper {
  height: 100%;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  background-color: #6da4ff;
  // overflow-x: hidden;
}

.home--content {
  // height: 100vh;
  // background-color: #6da4ff;
  width: 100%;
}

.content--landing {
  height: 100vh;
  // width: 100%;
  position: relative;
  z-index: 2;
  padding-top: 8%;
}

.m-content--landing {
  height: 100vh;
  // width: 100%;
  position: relative;
  z-index: 2;
  padding-top: 10%;
}

.content--preview {
  height: 150vh;
  background-color: white;
  position: relative;
  z-index: 2;
}

.m-content--preview {
  height: auto;
}

.content--pricing {
  height: 115vh;
  background-color: white;
  position: relative;
  z-index: 2;
}

.m-content--pricing {
  height: auto;
  padding: 2% 0;
}

.content--about {
  // height: 90vh;
  position: relative;
  z-index: 2;
}

.m-content--about {
  height: 120vh;
}

.content--footer {
  height: 50vh;
  background-color: black;
  position: relative;
  z-index: 2;
}

.m-content--footer {
  height: 90vh;
}

.content--value {
  height: 50vh;
  background-color: #eeeeee;
  position: relative;
  z-index: 2;
}

.m-content--value {
  height: 125vh;
}

.home--preview {
  // height: 100%;
  width: 100%;
  // position: relative;
  padding-top: 2%;
}

.home--landing-container {
  height: 90%;
  width: 50%;
}

.home--landing-main {
  padding-left: 10%;
  width: 30%;
  padding-top: 10%;
}

.m-home--landing-main {
  height: 50% !important;
  padding-left: 0%;
  width: 100%;
  padding-top: 5%;
}

.m-home--landing-img-wrapper {
  height: 50% !important;
  width: 100%;
  position: relative;
  z-index: 1;
}

.home--landing-text {
  // height: 50%;
  width: 100%;
}

.home--landing-subheading {
  font-size: 1.8rem;
  // transition: 0.3s;
  // height: 10%;
}

.home--landing-heading {
  font-size: 45px;
  // height: 90%;
}

.m-home--landing-subheading {
  font-size: 1.3rem;
  // transition: 0.3s;
  // height: 10%;
}

.m-home--landing-heading {
  font-size: 37px;
  // height: 90%;
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
  height: 8% !important;
  top: 0;
  width: 100%;
  background-color: #6da4ff;
  z-index: 5;
  transition: 0.2s;
  // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.m-top-nav {
  height: 8% !important;
  width: 100%;
  // position: sticky !important;
}

.top-nav-scrolled {
  background-color: #212121 !important;
}

.nav--item {
  height: 100%;
}

.item--container {
  height: 100%;
  width: 100%;
}

.item--logo-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.item--logo {
  position: absolute;
  // height: 70%;
  width: 50%;
  // border-radius: 10px;
}

.m-item--logo {
  position: relative !important;
  // width: 75%;
  height: 100%;
}

.home--preview-intro {
  height: auto;
}

.home--preview-content {
  height: 85%;
}

.m-home--preview-intro {
  height: auto;
}

.m-home--preview-content {
  height: 200vh;
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

.m-home--preview-item {
  // height: 100%;
  width: 100%;
}

.home--preview-item-s {
  height: 33%;
  width: 100%;
  padding-left: 10%;
}

.home--preview-img-container {
  // width: 40%;
  // height: 100%;
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

.m-home--preview-img-container {
  width: 100%;
  height: 50%;
  position: relative;
}

.m-home--preview-text {
  width: 100%;
  height: 50%;
}

.m-home--preview-img {
  // height: 100px;
  // width: 100%;
  border-radius: 0px;
}

.pricing--intro {
  height: 20%;
  padding: 0 20%;
}

.m-pricing--intro {
  height: auto;
  padding: 0 10%;
}

.pricing--action {
  height: 15%;
}

.m-pricing--action {
  height: auto;
}

.border-white {
  border: 1px solid white;
}

.about--text {
  background-color: #0c6645;
  padding: 0 6%;
  height: 100%;
  padding-bottom: 2%;
}

.m-about--text {
  height: auto;
}

.about--text-wrapper {
  border-bottom: 1px solid;
  p {
    width: 50%;
  }
}

.m-about--text-wrapper {
  border-bottom: 1px solid;
  p {
    width: 100%;
  }
}

.about--img-container {
  background-color: #eeeeee;
  position: relative;
  height: 100%;
}

.m-about--img-container {
  height: auto;
}

.about--img {
  position: absolute;
  width: 70%;
  height: 70%;
  // border-radius: 20px;
}

.footer--text-container {
  height: 100%;
  padding-left: 20%;
}

.footer--text-container {
  height: auto;
  padding-left: 0%;
}

.footer--text {
  color: white;
  opacity: 0.6;
  transition: 0.2s;
}

.footer--text:hover {
  opacity: 1;
}

.footer--logo-wrapper {
  height: 100%;
}

.footer--logo-name {
  font-size: 48px;
}

.m-footer--logo-name {
  font-size: 28px;
}

.footer--logo-img {
  position: relative;
}

.footer--logo {
  position: absolute;
  // height: 70%;
  width: 40%;
  // border-radius: 10px;
}

.footer--logo-container {
  height: 20%;
}

.m-footer--logo-container {
  height: 40%;
}

.footer--logo-text {
  // padding-right: 30%;
  padding: 0 10%;
  height: 80%;
}

.m-footer--logo-text {
  padding: 0 6%;
  height: 60%;
}

.value--item {
  height: 100%;
  padding: 0 7%;
}

.m-value--item-container {
  height: 33%;
}

.value--item-img-container {
  position: relative;
  height: 50%;
}

.value--item-img {
  position: absolute;
  height: 90%;
  width: 90%;
  border-radius: 20px;
}

.dialog--beta-container {
  height: 100%;
}
</style>
