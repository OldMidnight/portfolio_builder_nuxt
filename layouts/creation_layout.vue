<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      creationProgress: 0,
      show_final_step: false,
      resume_not_created: false
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
  },
  mounted() {
    this.$auth.fetchUser()
  },
  methods: {
    ...mapMutations('creator', [
      'setCreationStep',
      'showNextStep',
      'hideNextStep'
    ]),
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
    <v-container fill-height class="creator-container pa-0">
      <v-layout column align-center class="creation-page-layout">
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
              <v-btn color="success" @click="saveChanges()">Save Changes</v-btn>
            </div>
          </transition>
        </v-flex>
        <nuxt class="creation-wrapper" />
        <v-flex class="next-creation-step">
          <v-btn
            color="error"
            class="btn-left-margin"
            :class="{ 'hide-previous': creation_step === 0 }"
            large
            @click="prevStep()"
          >
            Back
          </v-btn>
          <v-btn
            color="info"
            :class="{
              'hide-next': show_next_step === false,
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
        </v-flex>
        <v-flex class="creation-progress">
          <v-progress-linear
            rounded
            :value="creationProgress"
            :buffer-value="creationProgress + 100 / 3"
            height="8"
          ></v-progress-linear>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="resume_not_created" color="warning">
      Make sure to create your resume on the resume tab before saving!
      <v-btn icon @click="resume_not_created = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
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
  // background-color: #black;
}

.mini-logo {
  // height: 40px;
  width: 8%;
  height: 100%;
  font-size: 24px;
  color: #0066ff;
  position: relative;
  // display: flex;
  // border: 1px solid #b6b6b6;
  // border-radius: 50%;
  // padding: 5px;
  // img {
  //     height: 100%;
  //     width: 100%;
  // }
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
  // border-top: 1px solid #777;
  // background-color: #cccccc;
}

.creation-progress {
  max-height: 3%;
  padding-right: 25% !important;
  padding-left: 25% !important;
  width: 90%;
  position: absolute;
  top: 97%;
  // background-color: #b3b3b3;
}
.next-creation-step {
  // margin-bottom: 2%;
  // margin-top: 2%;
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
