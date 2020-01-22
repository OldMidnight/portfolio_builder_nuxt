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
      name_model: this.name,
      tagline_model: this.tagline
    }
  },
  computed: {
    site_props() {
      return this.$store.state.creator.site_props
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
    }
  },
  mounted() {
    if (this.editor) {
      this.editor.setContent(this.html)
    }
    this.img_url = this.img_props.url
    this.validated_img_url = this.img_props.url
    this.img_contain = this.img_props.contain
  },
  methods: {
    ...mapMutations({
      updatePageImg: 'creator/updatePageImg'
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
      this.updatePageImg({
        page_label: this.options.input_dict_name,
        img_props: 'img_props',
        data: {
          url: this.validated_img_url,
          contain: this.img_contain
        }
      })
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
    <div class="home--img-container mt-2 d-flex flex-column align-center">
      <v-tooltip v-model="edit_img_tooltip" right>
        <template v-slot:activator="{ on }">
          <v-avatar :size="avatar_size">
            <v-img
              alt="User Profile Picture"
              :src="
                !options.preview
                  ? img_props.url
                  : 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80   '
              "
              :class="{
                'user-hero-image-border':
                  site_props.selected_theme === 3 && !options.preview,
                'has-border':
                  site_props.text_border_color &&
                  site_props.selected_theme === null,
                editable: !options.preview && !options.live
              }"
              class="user-hero-image elevation-2"
              :contain="img_props.contain"
              @click.stop="
                !options.preview && !options.live
                  ? (img_dialog = true)
                  : (img_dialog = false)
              "
              v-on="on"
              @mouseover="edit_img_tooltip = !options.preview && !options.live"
              @mouseout="edit_img_tooltip = false"
            >
            </v-img>
          </v-avatar>
        </template>
        <span v-if="!options.preview && !options.live">Insert Image</span>
      </v-tooltip>
      <!-- </v-flex> -->
    </div>
    <div class="home--content-container d-flex flex-column align-center">
      <div
        :style="check_color_style"
        class="user-landing-text d-flex flex-column pa-0 px-4 align-center"
      >
        <editor-content :editor="editor" />
      </div>
      <SocialBar1 :live="options.live" />
    </div>
    <v-dialog v-model="img_dialog" width="500">
      <v-card>
        <v-card-title>Edit Image</v-card-title>
        <v-card-text>
          <v-container>
            <span class="caption">Insert the url to your image</span>
            <v-text-field
              v-model="img_url"
              label="Image URL..."
              outlined
              @input="validateURL()"
            >
            </v-text-field>
            <v-layout column justify-center align-center>
              <span>Preview</span>
              <v-flex class="img-preview-container">
                <v-img
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
        <v-card-actions>
          <v-flex>
            <v-btn color="blue darken-1" text @click="img_dialog = false"
              >Close</v-btn
            >
            <v-btn
              color="blue darken-1"
              text
              @click="
                img_dialog = false
                updateImgURL()
              "
              >Save</v-btn
            >
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
