<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      creationProgress: 0,
      show_final_step: false,
      resume_not_created: false,
      isMobile: false
    }
  },
  computed: {
    ...mapState('creator', ['creation_step', 'show_next_step', 'site_props']),
    creation_step() {
      return this.$store.state.creator.creation_step
    }
  },
  created() {
    this.$vuetify.theme.dark = this.$auth.user.dark_mode
    this.fetchUserUploads()
  },
  beforeMount() {
    if (this.$route.name === 'creator' && this.$vuetify.breakpoint.smAndDown) {
      this.$router.replace({ path: '/m-creator' })
    } else if (
      this.$route.name === 'm-creator' &&
      !this.$vuetify.breakpoint.smAndDown
    ) {
      this.$router.replace({ path: '/creator' })
    }
  },
  mounted() {
    this.isMobile = this.$vuetify.breakpoint.smAndDown
    this.$root.$on('onPrevStep', () => {
      this.prevStep()
    })
    this.$root.$on('onSaveChanges', () => {
      this.saveChanges()
    })
    this.$root.$on('onNextStep', () => {
      this.nextStep()
    })
  },
  methods: {
    ...mapMutations({
      setCreationStep: 'creator/setCreationStep',
      showNextStep: 'creator/showNextStep',
      hideNextStep: 'creator/hideNextStep'
    }),
    ...mapActions({
      fetchUserUploads: 'creator/fetchUserUploads'
    }),
    nextStep() {
      if (this.show_next_step) {
        this.setCreationStep('+')
        this.creationProgress += 100 / 3
        this.hideNextStep()
      }
    },
    prevStep() {
      this.setCreationStep('-')
      this.creationProgress -= 100 / 3
      this.showNextStep()
    },
    saveChanges() {
      if (this.site_props.resume_page_inputs.resume_created) {
        this.showNextStep()
      } else {
        this.resume_not_created = true
      }
    }
  }
}
</script>

<template>
  <v-app>
    <v-container fluid class="w-100 h-100 pa-0">
      <client-only placeholder="Loading Kreoh Editor...">
        <v-row
          v-if="!isMobile"
          column
          align="center"
          justify="center"
          class="creation-page-layout ma-0 w-100 h-100"
        >
          <v-flex class="top-nav">
            <div class="mini-logo font-weight-bold">
              <v-img
                class="logo"
                :src="
                  `${
                    $vuetify.theme.dark
                      ? '/Logo_beta_white.png'
                      : '/Logo_beta_text.png'
                  }`
                "
              ></v-img>
            </div>
            <transition
              enter-active-class="animated fadeInRight faster"
              leave-active-class="animated fadeOutRight faster"
              mode="out-in"
            >
              <div v-if="creation_step === 1" class="save-btn pt-2">
                <v-btn color="success" @click="saveChanges()">
                  Save Changes
                </v-btn>
              </div>
            </transition>
          </v-flex>
          <nuxt class="creation-wrapper" />
          <v-flex class="next-creation-step">
            <transition
              enter-active-class="animated fadeIn faster"
              leave-active-class="animated fadeOut faster"
              mode="out-in"
            >
              <v-btn
                v-show="creation_step !== 0"
                color="error"
                class="btn-left-margin"
                large
                @click="prevStep()"
              >
                Back
              </v-btn>
            </transition>
            <transition
              enter-active-class="animated fadeIn faster"
              leave-active-class="animated fadeOut faster"
              mode="out-in"
            >
              <v-btn
                v-show="show_next_step"
                color="info"
                :class="{
                  'btn-left-margin': creationProgress > 0
                }"
                large
                @click="nextStep()"
              >
                Next
              </v-btn>
            </transition>
            <transition
              enter-active-class="animated fadeIn faster"
              leave-active-class="animated fadeOut faster"
              mode="out-in"
            >
              <v-btn
                v-if="show_final_step"
                color="info"
                large
                @click="
                  setCreationStep('+')
                  creationProgress += 100 / 3
                  hideNextStep()
                "
              >
                Next
              </v-btn>
            </transition>
          </v-flex>
          <v-flex class="creation-progress">
            <v-progress-linear
              rounded
              :value="creationProgress"
              :buffer-value="creationProgress + 100 / 3"
              height="8"
            ></v-progress-linear>
          </v-flex>
        </v-row>
        <v-row v-else class="h-100">
          <v-col
            cols="12"
            :class="
              `${
                creation_step !== 1 ? 'h-85' : 'h-100'
              } pa-0 d-flex flex-column align-center`
            "
          >
            <div
              v-if="creation_step !== 1"
              class="h-10 w-100 d-flex justify-center"
            >
              <v-img
                contain
                :src="
                  `${
                    $vuetify.theme.dark
                      ? '/Logo_beta_white.png'
                      : '/Logo_beta_text.png'
                  }`
                "
              ></v-img>
            </div>
            <nuxt />
          </v-col>
          <v-col
            v-if="creation_step !== 1"
            cols="12"
            class="h-10 pa-0 d-flex align-center justify-space-around"
          >
            <v-btn
              v-show="creation_step !== 0"
              color="error"
              large
              @click="prevStep()"
            >
              Back
            </v-btn>
            <v-btn
              v-show="show_next_step"
              color="info"
              :class="{
                'btn-left-margin': creationProgress > 0
              }"
              large
              @click="nextStep()"
            >
              Next
            </v-btn>
            <v-btn
              v-if="show_final_step"
              color="info"
              large
              @click="
                setCreationStep('+')
                creationProgress += 100 / 3
                hideNextStep()
              "
            >
              Next
            </v-btn>
          </v-col>
          <v-col
            v-if="creation_step !== 1"
            cols="12"
            class="h-5 d-flex justify-center pa-0 align-center"
          >
            <v-progress-linear
              rounded
              :value="creationProgress"
              :buffer-value="creationProgress + 100 / 3"
              height="8"
              class="w-90"
            ></v-progress-linear>
          </v-col>
        </v-row>
      </client-only>
    </v-container>
    <v-snackbar v-model="resume_not_created" color="warning">
      Make sure to create your resume on the resume tab before saving!
      <v-btn icon @click="resume_not_created = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <!-- <script type="text/javascript">
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
    </script> -->
    <!-- End Matomo Code -->
  </v-app>
</template>

<style lang="scss" scoped>
.creator-container {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
}

.top-nav {
  max-height: 5%;
  align-self: baseline;
  position: absolute;
  top: 0;
  width: 100%;
}

.mini-logo {
  width: 8%;
  height: 100%;
  font-size: 24px;
  color: #0066ff;
  position: relative;
}

.logo {
  position: absolute;
  left: 10%;
}

.mini-logo:hover {
  cursor: pointer;
}

.creation-wrapper {
  max-height: 82%;
  overflow: auto;
  position: absolute;
  top: 6%;
  width: 97%;
}

.creation-progress {
  max-height: 3%;
  padding-right: 25% !important;
  padding-left: 25% !important;
  width: 90%;
  position: absolute;
  top: 97%;
}
.next-creation-step {
  max-height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 89%;
  button {
    margin-right: 5%;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}

.btn-left-margin {
  margin-left: 5%;
}

.hide-next {
  height: 0px;
  width: 0px !important;
  opacity: 0;
  margin: 0;
  padding: 0;
}

.hide-previous {
  height: 0px;
  width: 0px;
  opacity: 0;
  margin: 0;
  padding: 0;
  min-width: 0px;
}

.creation-page-layout {
  position: relative;
  height: 100%;
}

.save-btn {
  position: absolute;
  right: 2%;
}
</style>
