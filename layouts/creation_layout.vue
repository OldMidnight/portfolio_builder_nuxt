<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      creationProgress: 0,
      show_final_step: false
    }
  },
  computed: {
    ...mapState('creator', ['creation_step', 'show_next_step'])
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
    }
  }
}
</script>

<template>
  <v-app>
    <v-container grid-list-md text-xs-center fluid justify-center fill-height>
      <v-layout column align-center class="creation-page-layout">
        <v-flex class="top-nav">
          <div class="mini-logo font-weight-light">Kreoh.com</div>
        </v-flex>
        <nuxt />
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
  </v-app>
</template>

<style lang="scss" scoped>
.top-nav {
  min-height: 5%;
  max-height: 5%;
  align-self: baseline;
  // background-color: #e6e6e6;
}

.mini-logo {
  // height: 40px;
  // width: 40px;
  font-size: 32px;
  color: #0066ff;
  // display: flex;
  // border: 1px solid #b6b6b6;
  // border-radius: 50%;
  // padding: 5px;
  // img {
  //     height: 100%;
  //     width: 100%;
  // }
}

.mini-logo:hover {
  cursor: pointer;
}

.creation-step {
  min-height: 77%;
  max-height: 77%;
  // background-color: #cccccc;
}

.creation-progress {
  min-height: 2%;
  max-height: 2%;
  padding-right: 25% !important;
  padding-left: 25% !important;
  width: 90%;
  // background-color: #b3b3b3;
}
.next-creation-step {
  margin-bottom: 2%;
  margin-top: 2%;
  min-height: 5%;
  max-height: 5%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  min-height: 100%;
  max-height: 100%;
}
</style>
