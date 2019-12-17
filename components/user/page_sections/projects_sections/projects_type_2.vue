<script>
import { mapState } from 'vuex'
import ProjectItem from '@/components/user/subcomponents/project_item_2'
export default {
  components: { ProjectItem },
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
      default: () => ({})
    }
  },
  data() {
    return {
      project_valid: true,
      add_hover: false,
      add_project_dialog: false,
      delete_project_dialog: false,
      add_project_img: false,
      add_project_link: false,
      temp_project: {
        id: null,
        title: null,
        description: null,
        img: {
          url: '',
          contain: false
        },
        link: null
      },
      validated_img_url: '',
      rules: {
        required: (value) => !!value || 'Required.'
      },
      dialog_has_errors: false,
      editing_project: false,
      invalid_url: false,
      preview_projects: [
        {
          id: '1',
          title: 'Project Title Here',
          description:
            'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
          img: {
            url:
              'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1682&q=80',
            contain: false
          },
          link: null
        },
        {
          id: '2',
          title: 'Project Title Here',
          description:
            'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
          img: {
            url:
              'https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
            contain: false
          },
          link: null
        }
      ]
    }
  },
  computed: {
    ...mapState('creator', ['site_props'])
  },
  watch: {
    add_project_dialog(value) {
      if (!value) {
        this.temp_project = {
          id: null,
          title: null,
          description: null,
          img: {
            url: '',
            contain: false
          },
          link: null
        }
        this.validated_img_url = ''
        this.add_project_img = false
        this.add_project_link = false
        this.editing_project = false
      }
    },
    'temp_project.img.url'(value) {
      // this.validateURL()
    }
  },
  methods: {
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
      this.validated_img_url = this.temp_project.img.url

      this.temp_project.id = this.editing_project
        ? this.temp_project.id
        : Date.now().toString()

      if (this.editing_project) {
        this.$emit('update', {
          data_struct: 'Array',
          type: 'projects',
          value: this.temp_project,
          id: this.temp_project.id,
          update_type: 'update'
        })
        this.editing_project = false
      } else {
        this.$emit('update', {
          data_struct: 'Array',
          type: 'projects',
          value: this.temp_project,
          update_type: 'update'
        })
      }

      this.temp_project = {
        id: null,
        title: null,
        description: null,
        img: {
          url: '',
          contain: false
        },
        link: null
      }
    },
    editProject(e) {
      this.temp_project = e
      this.add_project_dialog = true
      if (e.img.url !== '') {
        this.add_project_img = true
        this.validated_img_url = this.temp_project.img.url
      }
      if (e.link !== null) {
        this.add_project_link = true
      }
      this.editing_project = true
    },
    deleteProject() {
      this.$emit('update', {
        data_struct: 'Array',
        type: 'projects',
        value: this.temp_project,
        update_type: 'delete',
        id: this.temp_project.id
      })
      this.delete_project_dialog = false
      this.add_project_dialog = false
    }
  }
}
</script>

<template>
  <div
    :class="{
      'projects-container': !options.preview,
      'preview-projects-container': options.preview
    }"
  >
    <div v-if="!options.preview" class="projects-item-container">
      <ProjectItem
        v-for="project in site_props[options.input_dict_name].projects"
        :id="project.id"
        :key="project.id"
        :title="project.title"
        :description="project.description"
        :img="project.img"
        :link="project.link"
        :options="options"
        @edit_project="editProject($event)"
      ></ProjectItem>
      <v-tooltip v-model="add_hover" bottom>
        <template>
          <v-layout
            v-if="!options.live && !options.preview"
            class="mx-auto project-item-add d-flex flex-column justify-center"
            :class="{ 'grey lighten-2': add_hover }"
            @mouseenter="add_hover = true"
            @mouseleave="add_hover = false"
            @click="add_project_dialog = true"
          >
            <v-icon :size="add_hover ? '100' : '80'" color="#9e9e9e"
              >mdi-plus</v-icon
            >
          </v-layout>
        </template>
        <span>Add a project card</span>
      </v-tooltip>
    </div>
    <div v-if="options.preview" class="preview-projects-item-container">
      <ProjectItem
        v-for="preview_project in preview_projects"
        :id="preview_project.id"
        :key="preview_project.id"
        :title="preview_project.title"
        :description="preview_project.description"
        :img="preview_project.img"
        :link="preview_project.link"
        :options="options"
      ></ProjectItem>
    </div>
    <v-dialog v-model="add_project_dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ editing_project ? 'Edit' : 'Add' }} Project
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="project_form"
              v-model="project_valid"
              :lazy-validation="true"
            >
              <v-flex>
                <v-text-field
                  ref="title"
                  v-model="temp_project.title"
                  outlined
                  label="Project title..."
                  :rules="[rules.required]"
                ></v-text-field>
              </v-flex>

              <v-flex>
                <v-textarea
                  ref="description"
                  v-model="temp_project.description"
                  outlined
                  label="Project Description..."
                  :rules="[rules.required]"
                ></v-textarea>
              </v-flex>

              <v-switch
                v-model="add_project_img"
                :label="(editing_project ? 'Edit' : 'Add') + ' Project Image'"
                inset
              ></v-switch>
              <v-flex v-if="add_project_img">
                <v-text-field
                  ref="img_url"
                  v-model="temp_project.img.url"
                  :error="invalid_url"
                  :error-messages="invalid_url ? 'Inavlid Image URL.' : ''"
                  outlined
                  label="Image URL..."
                  :rules="[rules.required]"
                ></v-text-field>
                <span class="caption">Image Preview</span>
                <div class="project-img-container">
                  <v-img
                    :src="temp_project.img.url"
                    class="project-img elevation-2"
                    :contain="temp_project.img.contain"
                  ></v-img>
                </div>
                <v-switch
                  v-model="temp_project.img.contain"
                  label="Show Entire Image"
                  hint="If parts of the image are cropped, this will contain the image."
                  :persistent-hint="true"
                  inset
                ></v-switch>
              </v-flex>

              <v-flex>
                <v-switch
                  v-model="add_project_link"
                  :label="(editing_project ? 'Edit' : 'Add') + ' Project Link'"
                  inset
                ></v-switch>
                <v-text-field
                  v-if="add_project_link"
                  ref="link"
                  v-model="temp_project.link"
                  outlined
                  label="URL..."
                  :rules="[rules.required]"
                ></v-text-field>
              </v-flex>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-flex>
            <v-btn
              color="blue darken-1"
              text
              @click="add_project_dialog = false"
              >Close</v-btn
            >
            <v-btn
              :disabled="!project_valid"
              color="blue darken-1"
              text
              @click.stop="validateProject()"
            >
              {{ editing_project ? 'Save' : 'Create' }}
            </v-btn>
            <v-btn
              v-if="temp_project.id"
              class="align-self-right"
              color="red"
              text
              @click="delete_project_dialog = true"
              >Delete</v-btn
            >
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
            <v-btn color="red" text @click.stop="deleteProject()"
              >Yes, Delete Now!</v-btn
            >
            <v-btn
              color="blue darken-1"
              text
              @click="delete_project_dialog = false"
              >No, Go Back</v-btn
            >
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
// .page-container {
//   height: 100%;
//   width: 100%;
//   overflow: auto;
//   // border: 1px solid;
// }

.projects-container {
  position: relative;
  min-height: 90%;
  max-height: 90%;
  width: 100%;
  // border: 1px solid red;
}

.preview-projects-container {
  // width: 100%;
  min-height: 85%;
  max-height: 85%;
  position: relative;
  width: 100%;
  // border: 1px solid black !important;
}

.preview-projects-item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  overflow: auto;
}

.projects-item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  overflow: auto;
}

.project-item-add {
  border: 1px dashed;
  width: 50%;
  max-height: 130px;
  min-height: 130px;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.project-img-container {
  min-height: 200px;
}

.projects-item-wrapper {
  height: 100%;
}

.project-img {
  margin: auto;
  border-radius: 20px;
  height: 200px;
  width: 250px;
}
</style>
