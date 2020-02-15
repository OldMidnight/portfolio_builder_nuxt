<script>
import { mapState, mapMutations } from 'vuex'
import { EditorContent } from 'tiptap'
import ProjectItem from '@/components/user/subcomponents/project_item_1'
export default {
  components: { ProjectItem, EditorContent },
  props: {
    height: {
      type: String,
      default: '150'
    },
    width: {
      type: String,
      default: '150'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    editor: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      project_valid: true,
      add_hover: false,
      delete_project_dialog: false,
      add_project_dialog: false,
      editing_index: null,
      add_project_img: false,
      add_project_link: false,
      temp_project: {
        id: null,
        title: null,
        description: null,
        img: {
          use: false,
          url: '',
          contain: false,
          link: false,
          upload: false
        },
        link: {
          use: false,
          url: null,
          link_text: null
        }
      },
      validated_img_url: '',
      rules: {
        required: (value) => !!value || 'Required.'
      },
      dialog_has_errors: false,
      editing_project: false,
      invalid_url: false,
      upload_rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!'
      ],
      upload_file: null
    }
  },
  computed: {
    ...mapState('creator', ['site_props']),
    projects() {
      // eslint-disable-next-line prettier/prettier
      return this.$store.state.creator.site_props[this.options.input_dict_name].projects
    },
    html() {
      // eslint-disable-next-line prettier/prettier
      return this.$store.state.creator.site_props[this.options.input_dict_name].html
    },
    user() {
      return this.$store.state.auth.user
    }
  },
  watch: {
    add_project_dialog(value) {
      if (!value) {
        this.temp_project = {
          id: null,
          title: null,
          description: null,
          img: {
            use: false,
            url: '',
            contain: false,
            link: false,
            upload: false
          },
          link: {
            use: false,
            url: null,
            link_text: null
          }
        }
        this.validated_img_url = ''
        this.add_project_link = false
        this.editing_project = false
      }
    },
    'temp_project.img.link'(value) {
      if (value && this.temp_project.img.upload) {
        this.temp_project.img.upload = false
        this.validated_img_url = this.temp_project.img.url
      } else if (!value && !this.temp_project.img.upload) {
        this.temp_project.img.upload = true
      }
    },
    'temp_project.img.upload'(value) {
      if (value && this.temp_project.img.link) {
        this.temp_project.img.link = false
        this.validated_img_url = ''
      } else if (!value && !this.temp_project.img.link) {
        this.temp_project.img.link = true
        this.validated_img_url = this.temp_project.img.url
      }
    }
  },
  mounted() {
    if (this.editor) {
      this.editor.setContent(this.html)
    }
  },
  methods: {
    ...mapMutations({
      addProject: 'creator/addProject',
      updateProject: 'creator/updateProject',
      storeDeleteProject: 'creator/deleteProject',
      addProjectImageToUpload: 'creator/addProjectImageToUpload'
    }),
    validateURL() {
      if (this.temp_project.img.url !== '') {
        this.getValidatedURL().then((result) => {
          if (result === 'error') {
            this.invalid_url = true
          } else {
            this.validated_img_url = result
            this.invalid_url = false
          }
        })
      }
    },
    async getValidatedURL() {
      const validation = await this.$axios
        .get(this.temp_project.img.url)
        .then((response) => {
          if (response.headers['content-type'].split('/')[0] === 'image') {
            return this.temp_project.img.url
          } else {
            return 'error'
          }
        })
        .catch((error) => {
          return error ? 'error' : 'error'
        })
      return validation
    },
    validateProject() {
      if (this.$refs.project_form.validate()) {
        if (!this.invalid_url) {
          this.add_project_dialog = false
          this.saveProject()
        }
      }
    },
    saveProject() {
      if (this.temp_project.img.upload) {
        const formData = new FormData()
        formData.append('image', this.upload_file)
        const url =
          'uploads/images/' +
          this.user.domain +
          '/' +
          this.options.input_dict_name +
          '_' +
          this.temp_project.id
        this.addProjectImageToUpload({
          img_data: {
            page_img_props: {
              page_label: this.options.input_dict_name,
              index: this.editing_index,
              project: this.temp_project
            },
            upload_form_data: formData,
            url
          }
        })
      }
      this.updateProject({
        page_label: this.options.input_dict_name,
        index: this.editing_index,
        project: this.temp_project
      })
    },
    editProject(e) {
      e = JSON.parse(e)
      this.temp_project = e.project
      this.editing_index = e.index
      this.add_project_dialog = true
      if (e.project.img.use) {
        this.validated_img_url = this.temp_project.img.url
      }
    },
    resetTempProject() {
      this.temp_project = {
        id: null,
        title: null,
        description: null,
        img: {
          use: false,
          url: '',
          contain: false,
          link: false,
          upload: false
        },
        link: {
          use: false,
          url: null,
          link_text: null
        }
      }
      this.validated_img_url = ''
    },
    deleteProject() {
      this.storeDeleteProject({
        page_label: this.options.input_dict_name,
        index: this.temp_project.id
      })
      this.delete_project_dialog = false
      this.add_project_dialog = false
    },
    addPageProject() {
      this.addProject({
        page_label: this.options.input_dict_name,
        project: {
          id: this.projects.length.toString(),
          title: 'Project Title Here',
          description:
            'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
          img: {
            use: true,
            url:
              'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1682&q=80',
            contain: false
          },
          link: {
            use: true,
            url: 'https://www.kreoh.com/',
            link_text: 'Learn More...'
          }
        }
      })
    },
    previewUpload(e) {
      const reader = new FileReader()
      reader.onload = () => {
        this.validated_img_url = reader.result
        this.temp_project.img.url = reader.result
      }
      reader.readAsDataURL(e)
    }
  }
}
</script>

<template>
  <v-container fill-height class="projects-container pa-0">
    <v-row class="justify-start projects-wrapper ma-0">
      <v-col cols="12" class="align-self-center projects--html-content pt-5">
        <editor-content :editor="editor" />
      </v-col>
      <v-col cols="12" class="projects--item-container">
        <ProjectItem
          v-for="(project, index) in projects"
          :id="project.id"
          :key="project.id"
          :index="index"
          :title="project.title"
          :description="project.description"
          :img="project.img"
          :link="project.link"
          :options="options"
          @edit="editProject($event)"
        ></ProjectItem>
        <v-flex class="d-flex justify-center pb-3">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn color="info" @click="addPageProject()" v-on="on">
                <v-icon>mdi-plus</v-icon> Add project
              </v-btn>
            </template>
            <span>Add a project card</span>
          </v-tooltip>
        </v-flex>
      </v-col>
    </v-row>
    <v-dialog v-model="delete_project_dialog" width="400">
      <v-card>
        <v-card-title>Delete {{ temp_project.title }}?</v-card-title>
        <v-card-text>
          <v-container>
            <v-flex>
              <span>Are You sure you want to delete this project?</span>
            </v-flex>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-flex class="">
            <v-btn color="error" @click.stop="deleteProject()"
              >Yes, Delete Now!</v-btn
            >
            <v-btn color="info" @click="delete_project_dialog = false"
              >No, Go Back</v-btn
            >
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="add_project_dialog" persistent scrollable width="600">
      <v-card>
        <v-card-title>
          <span>Edit Project</span>
        </v-card-title>
        <v-card-subtitle>
          <span>Customize the different aspects of your project cards</span>
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <!-- <span class="body-1">Edit Image</span> -->
            <v-expansion-panels popout>
              <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-bold">
                  Edit Project Image
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-switch
                    v-model="temp_project.img.use"
                    inset
                    label="Use Project Image"
                  ></v-switch>
                  <v-layout
                    v-if="temp_project.img.use"
                    class="d-flex flex-column"
                  >
                    <v-switch
                      v-model="temp_project.img.link"
                      inset
                      label="Link Image"
                    ></v-switch>
                    <div v-if="temp_project.img.link">
                      <span class="caption">Insert the url to your image</span>
                      <v-text-field
                        v-model="temp_project.img.url"
                        label="Image URL..."
                        outlined
                        @input="validateURL()"
                      >
                      </v-text-field>
                    </div>
                    <v-switch
                      v-model="temp_project.img.upload"
                      inset
                      label="Upload Image"
                    ></v-switch>
                    <div v-if="temp_project.img.upload">
                      <!-- <span class="caption">Insert the url to your image</span> -->
                      <v-file-input
                        v-model="upload_file"
                        :rules="upload_rules"
                        :show-size="1000"
                        color="info"
                        counter
                        chips
                        accept="image/*"
                        label="Click to upload an image"
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
                    </div>
                    <v-layout column justify-center align-center>
                      <span>Preview</span>
                      <v-flex class="img-preview-container">
                        <v-img
                          id="img-preview"
                          :src="validated_img_url"
                          class="img-preview elevation-2"
                          :contain="temp_project.img.contain"
                        >
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0"
                              align="center"
                              justify="center"
                            >
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-1"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-flex>
                    </v-layout>
                    <v-switch
                      v-model="temp_project.img.contain"
                      label="Contain image"
                      hint="Show entire image"
                      :persistent-hint="true"
                      inset
                    >
                    </v-switch>
                  </v-layout>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-bold">
                  Edit Project Link
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-switch
                    v-model="temp_project.link.use"
                    inset
                    label="Use Project Link"
                  ></v-switch>
                  <v-layout
                    v-if="temp_project.link.use"
                    class="d-flex flex-column"
                  >
                    <span class="caption mb-1">
                      Insert the url to your project's page
                    </span>
                    <v-text-field
                      v-model="temp_project.link.url"
                      label="Project URL"
                      outlined
                    >
                    </v-text-field>
                    <span class="caption mb-1">
                      Specify a custom text for the link
                    </span>
                    <v-text-field
                      v-model="temp_project.link.link_text"
                      label="Link Text"
                      outlined
                    >
                    </v-text-field>
                  </v-layout>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-bold">
                  Edit Project Content
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-layout class="d-flex flex-column">
                    <span class="caption">Edit Project Title</span>
                    <v-text-field
                      v-model="temp_project.title"
                      label="Title"
                      outlined
                    >
                    </v-text-field>
                    <span class="caption">Edit Project Description</span>
                    <v-textarea
                      v-model="temp_project.description"
                      label="Description"
                      outlined
                    >
                    </v-textarea>
                  </v-layout>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="info"
            @click="
              resetTempProject()
              add_project_dialog = false
            "
          >
            Close
          </v-btn>
          <v-btn
            color="success"
            @click="
              saveProject()
              add_project_dialog = false
            "
          >
            Save
          </v-btn>
          <v-btn color="error" @click="delete_project_dialog = true">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style lang="scss" scoped>
.projects-wrapper {
  height: 100%;
}

.projects--html-content {
  width: 100%;
  // height: 10%;
  border-bottom: 1px solid #a5a5a5;
}

.project-item-add {
  border: 1px dashed;
  width: 50%;
  height: 150px;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.img-preview-container {
  // border: 1px solid #b6b6b6;
  min-height: 150px;
  // width: 50%;
}

.img-preview {
  // border: 1px solid #b6b6b6;
  border-radius: 20px;
  height: 200px;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.465);
}
</style>
