<script>
import { mapMutations, mapGetters } from 'vuex'
import { EditorContent } from 'tiptap'
export default {
  components: { EditorContent },
  props: {
    options: {
      type: Object,
      default: () => ({
        input_dict_name: null,
        show_theme: null,
        live: null,
        preview: null,
        height: null,
        width: null
      })
    },
    editor: {
      default: null,
      type: Object
    }
  },
  data() {
    return {
      edit_dialog: false,
      img_url: '',
      img_contain: false,
      validated_img_url: '',
      link_image: false,
      upload_image: false,
      upload_rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          'File size should be less than 2 MB!'
      ],
      upload_file: null,
      button_text: '',
      button_color: '',
      button_text_color: '',
      button_url: ''
    }
  },
  computed: {
    ...mapGetters({
      site_props: 'creator/site_props',
      imagesToUpload: 'creator/imagesToUpload'
    }),
    user() {
      return this.$store.state.auth.user
    },
    html() {
      return this.site_props[this.options.input_dict_name].html
    },
    img_props() {
      return this.site_props[this.options.input_dict_name].img_props
    },
    button_props() {
      return this.site_props[this.options.input_dict_name].button_props
    },
    page_url: {
      get() {
        return this.site_props.callToActionURL
      },
      set(value) {
        this.setCallToActionURL({
          value
        })
      }
    }
  },
  watch: {
    link_image(value) {
      if (value && this.upload_image) {
        this.upload_image = false
        this.validated_img_url = this.img_props.url
      } else if (!value && !this.upload_image) {
        this.upload_image = true
        // this.validated_img_url = this.img_props.url
      }
    },
    upload_image(value) {
      if (value && this.link_image) {
        this.link_image = false
        this.validated_img_url = ''
      } else if (!value && !this.link_image) {
        this.link_image = true
        this.validated_img_url = this.img_props.url
      }
    }
  },
  mounted() {
    if (this.editor) {
      this.editor.setContent(this.html)
    }
    this.img_url = this.img_props.url
    this.validated_img_url = this.img_props.url
    this.img_contain = this.img_props.contain
    this.link_image = this.img_props.link
    this.upload_image = this.img_props.upload
    this.button_text = this.button_props.text
    this.button_color = this.button_props.color
    this.button_text_color = this.button_props.text_color
    this.button_url = this.button_props.url
  },
  methods: {
    ...mapMutations({
      updatePageDataObject: 'creator/updatePageDataObject',
      setCallToActionURL: 'creator/setCallToActionURL',
      addImageToUpload: 'creator/addImageToUpload',
      removeImagesToUpload: 'creator/removeImagesToUpload'
    }),
    validateURL() {
      this.getValidatedURL().then((result) => {
        this.validated_img_url = result
      })
    },
    async getValidatedURL() {
      const validation = await this.$axios
        .get(this.img_url)
        .then((response) => {
          if (response.headers['content-type'].split('/')[0] === 'image') {
            return this.img_url
          } else {
            return 'Invalid Image URL.'
          }
        })
        .catch((error) => {
          return error ? 'Invalid Image URL.' : ''
        })
      return validation
    },
    updateCallToAction() {
      if (
        !this.img_props.link &&
        this.img_props.url !== this.validated_img_url
      ) {
        this.$axios.$delete(
          '/uploads/user-content/' + this.options.input_dict_name
        )
      }
      if (this.upload_image && this.upload_file !== null) {
        if (this.$refs.cta_upload_form.validate(true)) {
          const formData = new FormData()
          const ext = this.upload_file.name.split('.')[
            this.upload_file.name.split('.').length - 1
          ]
          formData.append('upload', this.upload_file)
          const url =
            '/uploads/user-content/' +
            this.user.domain +
            '/' +
            this.options.input_dict_name +
            '.' +
            ext
          this.updatePageDataObject({
            page_label: this.options.input_dict_name,
            type: 'img_props',
            data: {
              url: this.validated_img_url,
              contain: this.img_contain,
              link: this.link_image,
              upload: this.upload_image
            }
          })
          this.addImageToUpload({
            img_data: {
              page_img_props: {
                page_label: this.options.input_dict_name,
                img_props: 'img_props',
                data: {
                  url: this.$axios.defaults.baseURL + url,
                  contain: this.img_contain,
                  link: this.link_image,
                  upload: this.upload_image
                }
              },
              upload_form_data: formData,
              url
            }
          })
          // this.upload_file = null
          this.edit_dialog = false
        }
      } else {
        const currentImagesToUpload = this.imagesToUpload.filter((img) => {
          return img.page_img_props.page_label === this.options.input_dict_name
        })

        if (currentImagesToUpload.length > 0) {
          this.removeImagesToUpload({
            images_to_remove: currentImagesToUpload
          })
        }
        this.updatePageDataObject({
          page_label: this.options.input_dict_name,
          type: 'img_props',
          data: {
            url: this.validated_img_url,
            contain: this.img_contain,
            link: this.link_image,
            upload: this.upload_image
          }
        })
        this.edit_dialog = false
        this.upload_file = null
      }
      this.updatePageDataObject({
        page_label: this.options.input_dict_name,
        type: 'button_props',
        data: {
          text: this.button_text,
          color: this.button_color,
          text_color: this.button_text_color,
          url: this.button_url
        }
      })
    },
    previewUpload(e) {
      console.log(e)
      console.log(this.upload_file)
      if (e !== null && e !== undefined) {
        const reader = new FileReader()
        reader.onload = () => {
          this.validated_img_url = reader.result
        }
        reader.readAsDataURL(e)
      }
    }
  }
}
</script>

<template>
  <v-row
    id="call-to-action"
    class="ma-0 component-layout h-100 w-100 pos-abs py-3"
  >
    <v-col
      :cols="$breakpoint.is.smAndDown ? '12' : '6'"
      :class="
        `border-right pos-rel d-flex justify-center pa-12 ${
          $breakpoint.is.smAndDown ? 'h-50' : 'h-100'
        }`
      "
    >
      <v-img
        class="elevation-5 action--img"
        :src="img_props.url"
        :contain="img_props.contain"
      ></v-img>
      <v-btn color="info" class="action--edit-btn" @click="edit_dialog = true">
        Edit Call To Action
      </v-btn>
    </v-col>
    <v-col
      :cols="$breakpoint.is.smAndDown ? '12' : '6'"
      :class="`action--section ${$breakpoint.is.smAndDown ? 'h-50' : ''}`"
    >
      <v-row class="ma-0 d-flex flex-column h-100">
        <v-col cols="9" class="content--section d-flex align-center">
          <editor-content :editor="editor" />
        </v-col>
        <v-col
          cols="3"
          class="content--section w-100 d-flex justify-center align-center"
        >
          <v-btn
            :style="{ color: button_props.text_color }"
            :color="button_props.color"
          >
            {{ button_props.text }}
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog
      v-model="edit_dialog"
      scrollable
      width="700"
      :fullscreen="$breakpoint.is.smAndDown"
    >
      <v-card>
        <v-card-title>Call-To-Action Page</v-card-title>
        <v-card-subtitle>Configure your call-to-action page</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <span class="font-weight-bold">Edit Image</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-switch
                    v-model="link_image"
                    inset
                    label="Link Image"
                  ></v-switch>
                  <div v-if="link_image">
                    <span class="caption">Insert the url to your image</span>
                    <v-text-field
                      v-model="img_url"
                      label="Image URL..."
                      outlined
                      @input="validateURL()"
                    >
                    </v-text-field>
                  </div>
                  <v-switch
                    v-model="upload_image"
                    inset
                    label="Upload Image"
                  ></v-switch>
                  <div v-if="upload_image">
                    <v-form ref="cta_upload_form">
                      <v-file-input
                        v-model="upload_file"
                        :rules="upload_rules"
                        :show-size="1000"
                        color="info"
                        counter
                        chips
                        accept="image/*"
                        :clearable="false"
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
                    </v-form>
                  </div>
                  <v-layout column justify-center align-center>
                    <span>Preview</span>
                    <v-flex
                      class="img-preview-container d-flex flex-column align-center"
                    >
                      <v-img
                        id="img-preview"
                        :src="validated_img_url"
                        class="img-preview elevation-2"
                        :contain="img_contain"
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
                    v-model="img_contain"
                    label="Contain image"
                    hint="Show entire image"
                    :persistent-hint="true"
                    inset
                  >
                  </v-switch>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <span class="font-weight-bold">Edit Action Button</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p class="pt-3">Button Text</p>
                  <v-text-field
                    v-model="button_text"
                    placeholder="Learn More..."
                    outlined
                  ></v-text-field>
                  <v-row class="ma-0 d-flex">
                    <v-col
                      cols="7"
                      class="d-flex flex-column align-center justify-center"
                    >
                      <v-color-picker
                        v-model="button_color"
                        hide-inputs
                        class="preview-color-pick align-self-center"
                      >
                      </v-color-picker>
                      <v-radio-group v-model="button_text_color">
                        <v-radio value="black" label="Black Text"></v-radio>
                        <v-radio value="white" label="White Text"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col
                      cols="5"
                      class="d-flex flex-column justify-center align-center"
                    >
                      <v-btn
                        :style="{ color: button_text_color }"
                        :color="button_color"
                        class="my-5"
                      >
                        {{ button_text }}
                      </v-btn>
                      <v-text-field
                        v-model="button_url"
                        outlined
                        label="Button Link"
                        class="my-4"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-flex>
            <v-btn color="error" @click="edit_dialog = false">
              Close
            </v-btn>
            <v-btn color="success" @click="updateCallToAction()">
              Save
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style lang="scss">
.content--section {
  max-width: 100% !important;
}

.action--img {
  filter: blur(2px);
}

.action--edit-btn {
  position: absolute;
  top: 50%;
}

.img-preview {
  width: 40%;
}
</style>
