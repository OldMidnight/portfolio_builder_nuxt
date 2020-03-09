<script>
import { mapMutations, mapGetters } from 'vuex'
import LoadableComponent from '@/components/helpers/loadable_component'
export default {
  components: { LoadableComponent },
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      transitioning: false,
      info_components: [],
      description_components: [],
      education_components: [],
      experience_components: [],
      certifications_components: [],
      interests_components: [],
      resume_wizard_dialog: false,
      resume_wizard_step: 0,
      progress: 0,
      wizard_layout_list: [
        {
          id: 0,
          name: 'Info',
          text:
            'This section contains information such as your name, address and how others can get in touch with you.'
        },
        {
          id: 1,
          name: 'Description',
          text:
            'This section will contain a short paragraph about yourself, and how much of an amazing person you are!'
        },
        {
          id: 2,
          name: 'Education',
          text:
            'This section will display any places of education you have attended.'
        },
        {
          id: 3,
          name: 'Experience',
          text: 'This section will show your past and current work experiences.'
        },
        {
          id: 4,
          name: 'Certifications',
          text:
            'This section will show your grades/score for any certificaton you have acheived.'
        },
        {
          id: 5,
          name: 'Interests',
          text:
            'Here you can run wild with all your interests and hobbies that keep you occupied in your free time.'
        }
      ],
      available_sections: [],
      section_component: {
        info_component: null,
        description_component: null,
        education_component: null,
        experience_component: null,
        certifications_component: null,
        interests_component: null
      },
      resume_layout: [],
      upload_resume_dialog: false,
      upload_rules: [
        (value) =>
          !value ||
          value.size < 10000000 ||
          'File size should be less than 10 MB!'
      ],
      upload_file: null,
      temp_upload_url: null,
      use_regular_creator_when_upload: false
    }
  },
  computed: {
    ...mapGetters({
      site_props: 'creator/site_props',
      filesToUpload: 'creator/filesToUpload'
    }),
    user() {
      return this.$auth.user
    },
    upload_props() {
      return this.site_props.resume_page_inputs.resume_upload
    },
    resume_created() {
      return this.site_props.resume_page_inputs.resume_created
    },
    resume_sections() {
      return this.site_props.resume_page_inputs.resume_sections
    },
    component_list() {
      const vm = this
      return function(name) {
        return vm[name.toLowerCase() + '_components']
      }
    },
    wizard_layout_list_customise() {
      // Add +3 to the id's of wizard_layout_list items so they coincide with the wizard step
      let sectionList = []
      for (const section of this.wizard_layout_list) {
        if (section.id + 3 === this.resume_wizard_step) {
          sectionList = [section]
        }
      }
      return sectionList
    },
    is_last_section() {
      const vm = this
      return function(id) {
        return id === vm.wizard_layout_list[vm.wizard_layout_list.length - 1].id
      }
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    }
  },
  created() {
    // highest = The value of the list of components which has the highest number of components
    if (this.resume_created && !this.upload_props.use) {
      this.section_component = this.resume_sections
      this.resume_layout = this.site_props.resume_page_inputs.resume_layout
    } else {
      const highest = 3

      const infoComponentsNum = 3
      const descriptionComponentsNum = 3
      const educationComponentsNum = 3
      const experienceComponentsNum = 3
      const certificationsComponentsNum = 3
      const interestsComponentsNum = 3

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
            component:
              'resume_sections/components/education/education_type_' + i
          })
        }
        if (i <= experienceComponentsNum) {
          this.experience_components.push({
            id: i,
            component:
              'resume_sections/components/experience/experience_type_' + i
          })
        }
        if (i <= certificationsComponentsNum) {
          this.certifications_components.push({
            id: i,
            component:
              'resume_sections/components/certifications/certifications_type_' +
              i
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
    }
  },
  methods: {
    ...mapMutations({
      setResumeCreated: 'creator/setResumeCreated',
      addFileToUpload: 'creator/addFileToUpload',
      updateResumeUpload: 'creator/updateResumeUpload',
      removeFilesToUpload: 'creator/removeFilesToUpload'
    }),
    moveUp(id) {
      const layout = this.wizard_layout_list.splice(id, 1)[0]
      const vm = this
      setTimeout(function() {
        vm.wizard_layout_list.splice(id - 1, 0, layout)
        for (let i = 0; i < vm.wizard_layout_list.length; i++) {
          vm.wizard_layout_list[i].id = i
        }
      }, 500)
    },
    moveDown(id) {
      const layout = this.wizard_layout_list.splice(id, 1)[0]
      const vm = this
      setTimeout(function() {
        vm.wizard_layout_list.splice(id + 1, 0, layout)
        for (let i = 0; i < vm.wizard_layout_list.length; i++) {
          vm.wizard_layout_list[i].id = i
        }
      }, 500)
    },
    deleteSection(id) {
      this.available_sections.push(this.wizard_layout_list[id])
      // eslint-disable-next-line prettier/prettier
      this.section_component[this.wizard_layout_list[id].name.toLowerCase() + '_component'] = null
      for (let i = 0; i < this.available_sections.length; i++) {
        this.available_sections[i].id = i
      }
      this.wizard_layout_list.splice(id, 1)
    },
    addSection(id) {
      this.wizard_layout_list.push(this.available_sections[id])
      this.available_sections.splice(id, 1)
      for (let i = 0; i < this.wizard_layout_list.length; i++) {
        this.wizard_layout_list[i].id = i
      }
    },
    createResume() {
      this.resume_layout = this.wizard_layout_list.map((val) => {
        return val.name.toLowerCase()
      })
      this.updateResumeUpload({
        resume_upload: { use: false, url: this.temp_upload_url }
      })
      this.setResumeCreated({
        sections: this.section_component,
        layout: this.resume_layout
      })
      this.resume_wizard_step = 0
      this.progress = 0
      this.use_regular_creator_when_upload = false
    },
    saveUpload() {
      if (this.upload_file) {
        if (this.$refs.resume_upload_form.validate(true)) {
          const formData = new FormData()
          formData.append('upload', this.upload_file)
          const ext = this.upload_file.name.split('.')[
            this.upload_file.name.split('.').length - 1
          ]
          const url =
            'uploads/user-content/' +
            this.user.domain +
            '/' +
            this.user.domain +
            '_resume' +
            '.' +
            ext

          this.updateResumeUpload({
            resume_upload: { use: true, url: this.temp_upload_url }
          })

          this.addFileToUpload({
            file: {
              type: 'resume_pdf',
              url: this.$axios.defaults.baseURL + url,
              upload_data: formData
            }
          })
          this.upload_resume_dialog = false
          this.resume_wizard_dialog = false
          this.resume_wizard_step = 0
          this.progress = 0
          this.use_regular_creator_when_upload = false
        }
      } else {
        const currentResumeToUpload = this.filesToUpload.filter((file) => {
          return file.type === 'resume_pdf'
        })
        if (currentResumeToUpload.length > 0) {
          this.removeFilesToUpload({
            files_to_remove: currentResumeToUpload
          })
        }
      }
    },
    previewUpload(e) {
      if (e !== null) {
        const reader = new FileReader()
        reader.onload = () => {
          this.temp_upload_url = reader.result
        }
        reader.readAsDataURL(e)
      }
    }
  }
}
</script>

<template>
  <v-container class="resume-container" fill-height>
    <v-row
      :class="
        `resume-wrapper d-flex flex-column ${
          upload_props.use ? ' pa-0' : ''
        } h-100 ma-0`
      "
    >
      <v-btn
        v-if="!resume_created"
        class="align-self-center my-auto"
        color="info"
        @click="resume_wizard_dialog = true"
      >
        Create Your Resume!
      </v-btn>
      <v-col
        v-else-if="upload_props.use"
        cols="12"
        class="d-flex flex-column align-center justify-center pa-0 pos-rel"
      >
        <v-btn
          v-if="!options.live"
          color="info"
          class="pos-abs top-0 right-0 mt-2 mr-2"
          @click="resume_wizard_dialog = true"
        >
          Edit Resume
        </v-btn>
        <object
          :data="upload_props.url"
          type="application/pdf"
          class="h-100 w-100"
        ></object>
      </v-col>
      <div v-else class="sections-display pa-2 d-flex flex-column pos-rel">
        <div class="edit-btn d-flex flex-column align-center my-3">
          <v-btn
            v-if="!options.live"
            color="info"
            @click="resume_wizard_dialog = true"
          >
            Edit Resume
          </v-btn>
        </div>
        <LoadableComponent
          v-for="section in resume_layout"
          :key="section"
          :component-name="section_component[section + '_component'].component"
          :options="{
            input_dict_name: 'test',
            preview: false,
            editing: false,
            height: '150',
            width: '150'
          }"
        ></LoadableComponent>
        <div class="edit-btn d-flex flex-column align-center my-3">
          <v-btn
            v-if="!options.live"
            color="info"
            @click="resume_wizard_dialog = true"
          >
            Edit Resume
          </v-btn>
        </div>
      </div>
    </v-row>
    <v-dialog
      v-if="!options.preview && !options.live"
      v-model="resume_wizard_dialog"
      scrollable
      transition="slide-x-transition"
      width="800"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <v-card height="600" class="wizard-dialog">
        <v-card-title class="d-flex flex-column">
          <p
            class="display-1 align-self-center text-center font-weight-thin ma-0"
            style="
              word-wrap: break-word;
              word-break: break-word;
            "
          >
            Resume Creation Wizard
          </p>
        </v-card-title>
        <v-card-text class="dialog-card-text pa-2 pa-md-auto">
          <v-container class="wizard-container">
            <transition
              enter-active-class="animated fadeInUp faster"
              leave-active-class="animated fadeOutUp faster"
              mode="out-in"
              @before-leave="transitioning = true"
              @after-leave="transitioning = false"
            >
              <v-layout
                v-if="resume_wizard_step === 0"
                key="0"
                column
                align-center
                class="wizard-step"
                :class="{ 'intro-step': !resume_created }"
              >
                <div class="logo w-30">
                  <!-- <p class="font-weight-light">Kreoh.com</p> -->
                  <v-img class="logo-img" src="/Logo_beta_text.png"></v-img>
                </div>
                <div class="wizard-desc d-flex flex-column align-center">
                  <span class="title">Easy and customisable resume editor</span>
                  <span>
                    With Kreoh's in-built and customisable editor, put together
                    a resume purpose built for you.
                  </span>
                  <div
                    v-if="resume_created && !upload_props.use"
                    :class="
                      `w-100 d-flex ${
                        isMobile ? 'flex-column' : ''
                      } justify-center align-center mt-5`
                    "
                  >
                    <p class="mr-4">Or upload a pdf:</p>
                    <v-btn
                      color="info"
                      :disabled="use_regular_creator_when_upload"
                      @click="upload_resume_dialog = true"
                    >
                      <v-icon>mdi-upload</v-icon> Upload Resume
                    </v-btn>
                  </div>
                </div>
                <div
                  v-if="!resume_created"
                  class="wizard-get-started-btn d-flex flex-column align-center justify-center"
                >
                  <v-btn
                    color="info"
                    :disabled="use_regular_creator_when_upload"
                    class="my-1"
                    @click="upload_resume_dialog = true"
                  >
                    <v-icon>mdi-upload</v-icon> Upload Resume
                  </v-btn>
                  <v-btn
                    color="success"
                    class="my-1"
                    @click="
                      resume_wizard_step += 1
                      progress += 100 / (wizard_layout_list.length + 3)
                    "
                  >
                    Use Kreoh Editor!
                  </v-btn>
                </div>
                <div
                  v-else-if="upload_props.use"
                  class="d-flex flex-column align-center justify-center"
                >
                  <v-btn
                    color="info"
                    class="my-1"
                    @click="upload_resume_dialog = true"
                  >
                    <v-icon>mdi-upload</v-icon> Upload Resume
                  </v-btn>
                  <v-btn
                    color="success"
                    class="my-1"
                    @click="
                      use_regular_creator_when_upload = true
                      resume_wizard_step += 1
                      progress += 100 / (wizard_layout_list.length + 3)
                    "
                  >
                    Switch to Kreoh Resume Creator
                  </v-btn>
                </div>
                <div
                  v-else
                  class="wizard-timeline-container d-flex flex-column align-center w-100"
                >
                  <span class="title font-weight-bold text-center">
                    Select a section to begin editing at that point.
                  </span>
                  <v-timeline dense class="w-100">
                    <v-timeline-item color="purple lighten-2" fill-dot left>
                      <v-card>
                        <v-card-title
                          class="purple lighten-2 section-header"
                          @click="
                            resume_wizard_step = 1
                            progress += 100 / (wizard_layout_list.length + 3)
                          "
                        >
                          <h3 class="display-1 white--text font-weight-light">
                            Resume Layout
                          </h3>
                        </v-card-title>
                        <v-container>
                          <v-layout>
                            <div>Re-design the layout of your resume here.</div>
                          </v-layout>
                        </v-container>
                      </v-card>
                    </v-timeline-item>
                    <v-timeline-item color="green lighten-2" fill-dot left>
                      <v-card>
                        <v-card-title
                          class="green lighten-2 section-header"
                          @click="
                            resume_wizard_step = 2
                            progress +=
                              (100 / (wizard_layout_list.length + 3)) * 2
                          "
                        >
                          <h3 class="display-1 white--text font-weight-light">
                            Resume Sections
                          </h3>
                        </v-card-title>
                        <v-container>
                          <v-layout>
                            <div>
                              Customise your choices for the different resume
                              sections.
                            </div>
                          </v-layout>
                        </v-container>
                      </v-card>
                    </v-timeline-item>
                    <v-timeline-item
                      v-for="(section, index) in resume_layout"
                      :key="section"
                      color="info"
                      fill-dot
                      left
                    >
                      <v-card>
                        <v-card-title
                          class="info section-header"
                          @click="
                            resume_wizard_step = index + 3
                            progress +=
                              (100 / (wizard_layout_list.length + 3)) *
                              (index + 3)
                          "
                        >
                          <h3 class="display-1 white--text font-weight-light">
                            {{
                              section.charAt(0).toUpperCase() + section.slice(1)
                            }}
                          </h3>
                        </v-card-title>
                        <v-container>
                          <v-layout>
                            <LoadableComponent
                              :component-name="
                                section_component[section + '_component']
                                  .component
                              "
                              :options="{
                                input_dict_name: 'test',
                                preview: false,
                                editing: false,
                                height: '150',
                                width: '150'
                              }"
                            ></LoadableComponent>
                          </v-layout>
                        </v-container>
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>
                </div>
              </v-layout>
              <v-layout
                v-if="resume_wizard_step === 1"
                key="1"
                class="wizard-step layout-step d-flex flex-column"
              >
                <div class="layout-editor-desc d-flex flex-column align-center">
                  <span class="headline">Layout editor</span>
                  <span>
                    Below you can edit the layout of how your resume will be
                    displayed on your website.
                  </span>
                  <!-- <span>Use the arrows to adjust the positions of the sections.</span>  -->
                </div>
                <v-divider></v-divider>
                <div class="layout-editor-container d-flex">
                  <div class="layout-editor d-flex flex-column elevation-2">
                    <transition-group
                      enter-active-class="animated fadeInLeft faster"
                      leave-active-class="animated fadeOutRight faster"
                      mode="out-in"
                    >
                      <v-flex
                        v-for="section in wizard_layout_list"
                        :key="section.name"
                        class="layout-section pa-2 d-flex flex-column"
                      >
                        <span class="title">{{ section.name }}</span>
                        <span>{{ section.text }}</span>
                        <div
                          class="layout-section-actions d-flex justify-center"
                        >
                          <v-btn
                            :disabled="section.id === wizard_layout_list[0].id"
                            icon
                            color="info"
                            @click="moveUp(section.id)"
                          >
                            <v-icon>mdi-chevron-up</v-icon>
                          </v-btn>
                          <v-btn
                            :disabled="is_last_section(section.id)"
                            icon
                            color="info"
                            @click="moveDown(section.id)"
                          >
                            <v-icon>mdi-chevron-down</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            color="error"
                            @click="deleteSection(section.id)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </v-flex>
                    </transition-group>
                  </div>
                  <div class="available-sections-container ml-2 elevation-1">
                    <div class="d-flex align-center justify-center pt-2">
                      <span>Available Sections</span>
                    </div>
                    <v-flex
                      v-for="section in available_sections"
                      :key="section.name"
                      class="available-section d-flex flex-column justify-center align-center pa-4 my-2"
                    >
                      <span>{{ section.name }}</span>
                      <v-btn
                        icon
                        color="success"
                        class="available-section-btn"
                        @click="addSection(section.id)"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-flex>
                  </div>
                </div>
              </v-layout>
              <v-layout
                v-if="resume_wizard_step === 2"
                key="2"
                class="wizard-step choose-section-step d-flex flex-column"
              >
                <div
                  class="d-flex flex-column align-center choose-section-desc mb-3"
                >
                  <span class="headline">Section Selection</span>
                  <span>
                    Below you can select a layout for each section of your
                    Resume.
                  </span>
                </div>
                <v-divider class="mb-3"></v-divider>
                <div
                  v-for="section in wizard_layout_list"
                  :key="section.name"
                  class="elevation-2 my-3 d-flex flex-column align-center"
                >
                  <span class="title">{{ section.name }} Section</span>
                  <v-item-group
                    v-model="
                      section_component[
                        section.name.toLowerCase() + '_component'
                      ]
                    "
                    mandatory
                  >
                    <v-container>
                      <v-row>
                        <v-col
                          v-for="component in component_list(section.name)"
                          :key="component.id"
                        >
                          <v-item
                            v-slot:default="{ active, toggle }"
                            :value="component"
                          >
                            <v-card
                              :color="active ? 'primary' : ''"
                              class="d-flex align-center section-component"
                              dark
                              height="150"
                              @click="toggle"
                            >
                              <div>
                                <v-img src="#"></v-img>
                              </div>
                            </v-card>
                          </v-item>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-item-group>
                </div>
              </v-layout>
              <v-layout
                v-for="section in wizard_layout_list_customise"
                :key="section.id"
                class="wizard-step customise-section-step d-flex flex-column"
              >
                <div
                  class="customise-section-desc d-flex flex-column align-center"
                >
                  <span class="title mb-0">
                    Customise your: {{ section.name }} section!
                  </span>
                  <span>
                    Populate this section below with details from your CV or
                    create it now.
                  </span>
                </div>
                <v-divider></v-divider>
                <div
                  class="customise-section d-flex flex-column align-center justify-center"
                >
                  <LoadableComponent
                    :component-name="
                      section_component[
                        section.name.toLowerCase() + '_component'
                      ].component
                    "
                    :options="{
                      input_dict_name: 'test',
                      preview: false,
                      editing: true,
                      height: '150',
                      width: '150'
                    }"
                  ></LoadableComponent>
                </div>
              </v-layout>
              <v-layout
                v-if="resume_wizard_step === wizard_layout_list.length + 3"
                key="end-page"
                class="end-page"
              >
                <div
                  class="end-page-section d-flex flex-column align-center justify-center"
                >
                  <span class="end-page-line end-page-line-1 display-2 mb-5">
                    That's It!
                  </span>
                  <span class="end-page-line end-page-line-2 headline mt-6">
                    You're all set now, hit the Save button below to view your
                    masterpiece!
                  </span>
                </div>
              </v-layout>
            </transition>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <transition
            enter-active-class="animated fadeInUp faster"
            leave-active-class="animated fadeOutDown faster"
            mode="out-in"
          >
            <div
              v-if="resume_wizard_step !== 0 || use_regular_creator_when_upload"
              key="next"
              class="d-flex wizard-btns px-7"
            >
              <v-btn
                v-if="resume_wizard_step <= wizard_layout_list.length + 2"
                :disabled="transitioning"
                color="info"
                class="mx-1"
                @click="
                  resume_wizard_step += 1
                  progress += 100 / (wizard_layout_list.length + 3)
                "
              >
                Next
              </v-btn>
              <v-btn
                :disabled="transitioning"
                color="error"
                class="mx-1"
                @click="
                  resume_wizard_step -= 1
                  progress -= 100 / (wizard_layout_list.length + 3)
                "
              >
                Back
              </v-btn>
              <transition
                enter-active-class="animated fadeInUp faster"
                leave-active-class="animated fadeOutDown faster"
                mode="out-in"
              >
                <v-btn
                  v-if="
                    resume_wizard_step > wizard_layout_list.length + 2 ||
                      (resume_created && !upload_props.use)
                  "
                  key="save"
                  :disabled="transitioning"
                  color="success"
                  @click="
                    resume_wizard_dialog = false
                    createResume()
                  "
                >
                  Save
                </v-btn>
              </transition>
              <div class="wizard-progress d-flex flex-column align-center mx-9">
                <span class="caption">Progress</span>
                <v-progress-linear
                  rounded
                  striped
                  :value="progress"
                  class="align-self-center"
                ></v-progress-linear>
              </div>
              <div v-if="resume_created && !upload_props.use">
                <transition
                  enter-active-class="animated fadeInUp faster"
                  leave-active-class="animated fadeOutDown faster"
                  mode="out-in"
                >
                  <v-btn
                    :disabled="transitioning"
                    color="info"
                    @click="
                      resume_wizard_step = 0
                      progress = 0
                    "
                  >
                    Back to start
                  </v-btn>
                </transition>
              </div>
            </div>
          </transition>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="upload_resume_dialog" width="500" persistent>
      <v-card>
        <v-card-title>Upload your resume</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <p class="text-center">
                Use the below box to upload your PDF.
                <strong>
                  This file will count towards your storage quota </strong
                >.
              </p>
            </v-col>
            <v-col cols="12">
              <v-form ref="resume_upload_form">
                <v-file-input
                  v-model="upload_file"
                  :rules="upload_rules"
                  :show-size="1000"
                  color="info"
                  counter
                  chips
                  accept="application/pdf"
                  label="Click to upload a document"
                  prepend-icon="mdi-image"
                  outlined
                  @change="previewUpload($event)"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                      v-if="index < 2"
                      color="deep-purple accent-4"
                      dark
                      label
                    >
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="saveUpload()">
            Save
          </v-btn>
          <v-btn color="error" @click="upload_resume_dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style lang="scss" scoped>
.resume-container {
  // overflow: auto;
  position: relative;
}

.resume-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  padding: 0 10%;
  overflow: auto;
}

.sections-display {
  // border: 1px solid #e6e6e6;
  border-radius: 10px;
  font-size: initial;
}

.wizard-dialog {
  overflow-y: scroll;
  overflow-x: hidden;
}

.resume-wizard-wrapper {
  border: 1px solid;
  background-color: white;
}

.wizard-container {
  height: 100%;
  // overflow: hidden;
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
  // p {
  //   font-size: 60px;
  //   color: #0066ff;
  // }
  height: auto;
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
  // border-radius: 5px;
  width: 70%;
}

.available-sections-container {
  width: 30%;
}

.available-section {
  border: 1px dashed #b6b6b6;
  border-radius: 10px;
}

.layout-section {
  span {
    text-align: center;
  }
  border: 1px dashed #b6b6b6;
  // margin: 2px;
}

.section-component {
  width: 200px;
}

.customise-section-desc {
  height: 15%;
}

.customise-section {
  height: 85%;
}

.end-page-section {
  width: 100%;
  height: 100%;
  padding-right: 15%;
  padding-left: 15%;
}

.end-page {
  height: 100%;
}

.end-page-line {
  color: #0066ff;
  text-align: center;
}

.wizard-btns {
  width: 100%;
}

.wizard-progress {
  width: 100%;
}

.section-header {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.section-header:hover {
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
