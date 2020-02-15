<script>
import { mapMutations } from 'vuex'
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
      img_contain: false,
      edit_img_tooltip: false,
      validated_img_url: '',
      link_image: false,
      upload_image: false,
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
    site_props() {
      return this.$store.state.creator.site_props
    },
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
      if (this.$vuetify.breakpoint.xs) {
        return '60'
      } else if (this.$vuetify.breakpoint.sm) {
        return '90'
      } else if (this.$vuetify.breakpoint.md) {
        return '130'
      } else if (this.$vuetify.breakpoint.lg) {
        return '160'
      } else if (this.$vuetify.breakpoint.xl) {
        return '220'
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
  },
  methods: {
    ...mapMutations({
      updatePageImg: 'creator/updatePageImg',
      addImageToUpload: 'creator/addImageToUpload'
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
      // if (
      //   !this.img_props.link &&
      //   this.img_props.url !== this.validated_img_url
      // ) {
      //   this.$axios.$delete('/uploads/images/' + this.options.input_dict_name)
      // }
      if (this.upload_image) {
        const formData = new FormData()
        formData.append('image', this.upload_file)
        const url =
          'uploads/images/' +
          this.user.domain +
          '/' +
          this.options.input_dict_name
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
                url:
                  this.$axios.defaults.baseURL +
                  'uploads/images/' +
                  this.user.domain +
                  '/' +
                  this.options.input_dict_name,
                contain: this.img_contain,
                link: this.link_image,
                upload: this.upload_image
              }
            },
            upload_form_data: formData,
            url
          }
        })
        this.upload_file = null
        this.img_dialog = false
      } else {
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
      }
      reader.readAsDataURL(e)
    }
  }
}
</script>

<template>
  <v-layout
    column
    :style="check_color_style"
    :class="{ slate: site_props.selected_theme === 1 && options.show_theme }"
    class="template-container d-flex flex-column align-center justify-start"
  >
    <div
      class="home--img-container d-flex flex-column align-center justify-end"
    >
      <v-tooltip v-model="edit_img_tooltip" right>
        <template v-slot:activator="{ on }">
          <v-avatar :size="avatar_size">
            <v-img
              alt="User Profile Picture"
              :src="img_props.url"
              :class="{
                'user-hero-image-border':
                  site_props.selected_theme === 3 && !options.preview,
                'has-border':
                  site_props.text_border_color &&
                  site_props.selected_theme === null
              }"
              class="user-hero-image elevation-2 editable"
              :contain="img_props.contain"
              lazy-src="/img_lazy.jpeg"
              v-on="on"
              @click.stop="img_dialog = true"
              @mouseover="edit_img_tooltip = true"
              @mouseout="edit_img_tooltip = false"
            >
            </v-img>
          </v-avatar>
        </template>
        <span>Insert Image</span>
      </v-tooltip>
      <!-- </v-flex> -->
    </div>
    <div class="home--content-container d-flex flex-column align-center pt-4">
      <div
        :style="check_color_style"
        class="user-landing-text d-flex flex-column pa-0 px-4 align-center"
      >
        <editor-content :editor="editor" />
      </div>
      <SocialBar1 />
    </div>
    <v-dialog v-model="img_dialog" width="500">
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
  </v-layout>
</template>

<style lang="scss" scoped>
.template-container {
  height: 100%;
  width: 100%;
  // background-color: white !important;
  position: relative;
  z-index: 5;
  overflow: auto;
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
  opacity: 0.2;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
}

.home--img-container {
  height: 40%;
  width: 100%;
}

.home--content-container {
  height: 60%;
  width: 100%;
}
</style>
