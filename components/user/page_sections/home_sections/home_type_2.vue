<script>
import { mapMutations, mapGetters } from 'vuex'
import { EditorContent } from 'tiptap'
import SocialBar1 from '@/components/user/social_media_bar/bar_1'
export default {
  components: { EditorContent, SocialBar1 },
  props: {
    name: {
      type: String,
      default: 'Your Name Here'
    },
    tagline: {
      type: String,
      default: 'Insert Your Epic Tagline Here!'
    },
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
      type: Object,
      default: null
    }
  },
  data() {
    return {
      img_dialog: false,
      img_url: '',
      upload_img_url: '',
      img_contain: false,
      edit_img_tooltip: false,
      validated_img_url: '',
      link_image: false,
      upload_image: false,
      upload_rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          'File size should be less than 2 MB!'
      ],
      upload_file: null
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
    check_color_style() {
      if (
        this.site_props.text_border_color &&
        !this.options.preview &&
        this.site_props.selected_theme === null
      ) {
        return {
          color: this.site_props.text_border_color_value
        }
      } else {
        return {}
      }
    },
    html() {
      return this.site_props[this.options.input_dict_name].html
    },
    img_props() {
      return this.site_props[this.options.input_dict_name].img_props
    },
    avatar_size() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return '190'
      } else if (this.$vuetify.breakpoint.md) {
        return '160'
      } else if (this.$vuetify.breakpoint.lg) {
        return '160'
      } else if (this.$vuetify.breakpoint.xl) {
        return '200'
      } else {
        return '0'
      }
    }
  },
  watch: {
    img_dialog(value) {
      if (!value) {
        if (!this.img_props.url) {
          this.img_url = ''
        } else {
          // eslint-disable-next-line prettier/prettier
          this.img_url = this.img_props.url
        }
        // eslint-disable-next-line prettier/prettier
        this.img_contain = this.img_props.contain
      }
    },
    link_image(value) {
      if (value && this.upload_image) {
        this.upload_image = false
        this.validated_img_url = this.img_props.url
      } else if (!value && !this.upload_image) {
        this.upload_image = true
      }
    },
    upload_image(value) {
      if (value && this.link_image) {
        this.link_image = false
        this.validated_img_url = this.upload_img_url
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
  },
  methods: {
    ...mapMutations({
      updatePageImg: 'creator/updatePageImg',
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
    updateImgURL() {
      if (this.upload_image) {
        if (this.$refs.home_2_upload_form.validate(true)) {
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
          this.updatePageImg({
            page_label: this.options.input_dict_name,
            img_props: 'img_props',
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
          this.img_dialog = false
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

        this.updatePageImg({
          page_label: this.options.input_dict_name,
          img_props: 'img_props',
          data: {
            url: this.validated_img_url,
            contain: this.img_contain,
            link: this.link_image,
            upload: this.upload_image
          }
        })
        this.upload_file = null
        this.img_dialog = false
      }
    },
    previewUpload(e) {
      const reader = new FileReader()
      reader.onload = () => {
        this.validated_img_url = reader.result
        this.upload_img_url = reader.result
      }
      reader.readAsDataURL(e)
    },
    scrollDown() {
      const el = document.getElementById('call-to-action')
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
</script>

<template>
  <v-row
    :style="check_color_style"
    :class="{ slate: site_props.selected_theme === 1 && options.show_theme }"
    class="ma-0 template-container align-center justify-start"
  >
    <v-col
      cols="12"
      class="home--content-container d-flex flex-column align-center pt-4"
    >
      <div
        :style="check_color_style"
        class="user-landing-text d-flex flex-column pa-0 px-4 align-center"
      >
        <editor-content :editor="editor" />
      </div>
      <SocialBar1 />
    </v-col>
    <v-col
      cols="12"
      class="home--img-container d-flex flex-column align-center justify-end"
    >
      <v-avatar :size="avatar_size">
        <v-img
          alt="User Profile Picture"
          :src="img_props.url"
          :class="{
            'user-hero-image-border':
              site_props.selected_theme === 2 && !options.preview,
            'has-border':
              site_props.text_border_color &&
              site_props.selected_theme === null,
            'img-blur': $vuetify.breakpoint.smAndDown
          }"
          class="user-hero-image elevation-2 editable"
          :contain="img_props.contain"
          lazy-src="/img_lazy.jpeg"
          @click.stop="img_dialog = true"
          @mouseover="edit_img_tooltip = true"
          @mouseout="edit_img_tooltip = false"
        >
        </v-img>
        <div v-if="$vuetify.breakpoint.smAndDown" class="pos-abs w-100">
          <v-btn color="info" @click="img_dialog = true">
            <v-icon class="mr-1">mdi-pencil</v-icon>Edit
          </v-btn>
        </div>
      </v-avatar>
      <v-tooltip v-model="edit_img_tooltip" attach=".home--img-container">
        <span>Insert Image</span>
      </v-tooltip>
    </v-col>
    <v-col cols="12" class="home--content-scroll d-flex justify-center">
      <v-btn
        :color="
          `${
            site_props.selected_theme === 2
              ? 'white'
              : user.dark_mode
              ? 'black'
              : ''
          }`
        "
        icon
        x-large
        @click="scrollDown()"
      >
        <v-icon>
          mdi-chevron-down
        </v-icon>
      </v-btn>
    </v-col>
    <v-dialog
      v-model="img_dialog"
      width="500"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <v-card>
        <v-card-title>Edit Image</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-switch v-model="link_image" inset label="Link Image"></v-switch>
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
              <v-form ref="home_2_upload_form">
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
              <v-flex class="img-preview-container">
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
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-flex>
            <v-btn color="error" @click="img_dialog = false">
              Close
            </v-btn>
            <v-btn color="success" @click="updateImgURL()">
              Save
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style lang="scss" scoped>
.template-container {
  height: 100%;
  width: 100%;
  // background-color: white !important;
  position: relative;
  z-index: 5;
  // overflow: auto;
}

.img-preview-container {
  // border: 1px solid #b6b6b6;
  min-height: 150px;
  // width: 50%;
}

.img-preview {
  // border: 1px solid #b6b6b6;
  border-radius: 50%;
  height: 250px;
  width: 250px;
}

.user-hero-image {
  // border: 1px solid #b6b6b6;
  border-radius: 50%;
  height: 100%;
  width: 100%;
}

.img-blur {
  filter: blur(2px);
}

.user-hero-image-border {
  border: 1px solid;
}

.user-landing-text {
  width: 100%;
  height: auto;
  span {
    width: 80%;
    max-width: 80%;
    text-align: center;
    // overflow: auto;
  }
}

.editable:hover {
  background-color: #bdbdbd;
  filter: blur(2px);
  transition: 0.3s;
  cursor: pointer;
}

.home--img-container {
  // height: 40%;
  width: 100%;
}

.home--content-container {
  // height: 50%;
  width: 100%;
}
</style>
