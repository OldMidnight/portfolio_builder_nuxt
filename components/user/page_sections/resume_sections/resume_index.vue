<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      info_components: [],
      description_components: [],
      education_components: [],
      experience_components: [],
      grades_components: [],
      interests_components: [],
      resume_wizard_dialog: false,
      resume_wizard_step: 0,
      wizard_layout_list: [
        { id: 0, name: 'Info', text: 'This section contains information such as your name, address and how others can get in touch with you.' },
        { id: 1, name: 'Description', text: 'This section will contain a short paragraph about yourself, and how much of an amazing person you are!' },
        { id: 2, name: 'Education', text: 'This section will display any places of education you have attended.' },
        { id: 3, name: 'Experience', text: 'This section will show your past and current work experiences.' },
        { id: 4, name: 'Grades', text: 'This section will show your grades/score for any certificaton you have acheived.' },
        { id: 5, name: 'Interest', text: 'Here you can run wild with all your interests and hobbies that keep you occupied in your free time.' }
      ],
      available_sections: []
    }
  },
  created() {
    // highest = The value of the list of components which has the highest number of components
    const highest = 1

    const infoComponentsNum = 1
    const descriptionComponentsNum = 1
    const educationComponentsNum = 1
    const experienceComponentsNum = 1
    const gradesComponentsNum = 1
    const interestsComponentsNum = 1

    for (let i = 1; i <= highest; i++) {
      if (i <= infoComponentsNum) {
        this.info_components.push({
          id: i,
          component: 'resume_sections/components/info/info_type_' + i
        })
      }
      if (i <= descriptionComponentsNum) {
        this.description_components.push({
          id: i,
          component:
            'resume_sections/components/description/description_type_' + i
        })
      }
      if (i <= educationComponentsNum) {
        this.education_components.push({
          id: i,
          component: 'resume_sections/components/education/education_type_' + i
        })
      }
      if (i <= experienceComponentsNum) {
        this.experience_components.push({
          id: i,
          component:
            'resume_sections/components/experience/experience_type_' + i
        })
      }
      if (i <= gradesComponentsNum) {
        this.grades_components.push({
          id: i,
          component: 'resume_sections/components/grades/grades_type_' + i
        })
      }
      if (i <= interestsComponentsNum) {
        this.interests_components.push({
          id: i,
          component:
            'resume_sections/components/interests_hobbies/interests_type_' + i
        })
      }
    }
    if (!this.options.live) {
      this.resume_wizard_dialog = true
    }
  },
  methods: {
    moveUp(id) {
      let layout = this.wizard_layout_list.splice(id, 1)[0]
      let vm = this
      setTimeout(function() {
        vm.wizard_layout_list.splice(id - 1, 0, layout)
        for (let i = 0; i < vm.wizard_layout_list.length; i++) {
          vm.wizard_layout_list[i].id = i
        }
      }, 500)
    },
    moveDown(id) {
      let layout = this.wizard_layout_list.splice(id, 1)[0]
      let vm = this
      setTimeout(function() {
        vm.wizard_layout_list.splice(id + 1, 0, layout)
        for (let i = 0; i < vm.wizard_layout_list.length; i++) {
          vm.wizard_layout_list[i].id = i
        }
      }, 500)
    },
    deleteLayout(id) {
      this.available_sections.push(this.wizard_layout_list[id])
      this.wizard_layout_list.splice(id, 1)
    }
  }
}
</script>

<template>
  <v-container>
    <v-dialog
      v-if="!options.preview && !options.live"
      v-model="resume_wizard_dialog"
      scrollable
      transition="slide-x-transition"
      persistent
      width="800"
    >
      <v-card height="600">
        <v-card-title class="d-flex flex-column">
          <span class="display-1 align-self-center">
            Resume Creation Wizard
          </span>
        </v-card-title>
        <v-card-text>
          <v-container class="wizard-container">
            <transition
              enter-active-class="animated fadeInLeft fast"
              leave-active-class="animated fadeOutRight fast"
              mode="out-in"
            >
              <v-layout
                v-if="resume_wizard_step === 0"
                key="0"
                column
                align-center
                class="wizard-step intro-step"
              >
                <div class="logo">
                  <p>Kreoh.com</p>
                </div>
                <div class="wizard-desc">
                  <span class="title">Easy and customisable resume editor</span>
                  <span>
                    With Kreoh's in-built and customisable editor, put together
                    a resume purpose built for you.
                  </span>
                </div>
                <div class="wizard-get-started-btn">
                  <v-btn color="success" @click="resume_wizard_step += 1">
                    Get Started!
                  </v-btn>
                </div>
              </v-layout>
              <v-layout v-if="resume_wizard_step === 1" key="1" class="wizard-step layout-step d-flex flex-column">
                <div class="layout-editor-desc d-flex flex-column align-center">
                  <span class="headline">Layout editor</span>
                  <span>below you can edit the layout of how your resume will be displayed on your website.</span>
                </div>
                <v-divider></v-divider>
                <div class="layout-editor-container d-flex test">
                  <div class="layout-editor d-flex flex-column elevation-2">
                    <transition-group
                      enter-active-class="animated fadeInLeft faster"
                      leave-active-class="animated fadeOutRight faster"
                      mode="out-in"
                    >
                      <v-flex v-for="section in wizard_layout_list" :key="section.name" class="layout-section pa-2 d-flex flex-column">
                        <span class="title">{{ section.name }}</span>
                        <span>{{ section.text }}</span>
                        <div class="layout-section-actions d-flex justify-center">
                          <v-btn @click="moveUp(section.id)" :disabled="section.id === wizard_layout_list[0].id" icon color="info">
                            <v-icon>mdi-chevron-up</v-icon>
                          </v-btn>
                          <v-btn @click="moveDown(section.id)" :disabled="section.id === wizard_layout_list[wizard_layout_list.length - 1].id" icon color="info">
                            <v-icon>mdi-chevron-down</v-icon>
                          </v-btn>
                          <v-btn @click="deleteLayout(section.id)" icon color="errorlayouts">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </v-flex>
                    </transition-group>
                  </div>
                  <div class="available-sections-container ml-2 test">
                    <v-flex v-for="section in available_sections" :key="section.name" class="available-section test">
                      <span>{{ section.name }}</span>
                      <v-btn color="success">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-flex>
                  </div>
                </div>
              </v-layout>
            </transition>
          </v-container>
        </v-card-text>
        <v-divider></v-divider> 
        <v-card-actions>
          <transition
            enter-active-class="animated fadeInUp fast"
            leave-active-class="animated fadeOutRight fast"
            mode="out-in"
          >
            <div class="px-7" v-if="resume_wizard_step !== 0">
              <v-btn color="info">Next</v-btn>
            </div>
          </transition>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style lang="scss" scoped>
.test {
  border: 1px solid red;
}

.resume-wizard-wrapper {
  border: 1px solid;
  background-color: white;
}

.wizard-container {
  height: 100%;
}

.wizard-step {
  height: 100%;
}

.intro-step {
  padding: 10% 25% 0 25%;
}

.wizard-desc {
  margin-bottom: 10%;
  span {
    text-align: center;
  }
}

.logo {
  margin-bottom: 15%;
  p {
    font-size: 60px;
    color: #0066ff;
  }
}

.layout-editor-desc {
  height: 15%;
}

.layout-editor-container {
  height: 85%;
  width: 100%;
  padding: 5% 5% 0 5%;
}

.layout-editor {
  overflow: auto;
  height: 100%;
  border-radius: 5px;
  width: 70%;
}

.available-sections-container {
  width: 30%;
}

.layout-section {
  span {
    text-align: center;
  }
  border-top: 1px solid #b6b6b6;
  // margin: 2px;
}
</style>
