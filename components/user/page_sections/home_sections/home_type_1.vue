<script>
export default {
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
    imgStyle() {
      return {
        height: this.options.height + 'px',
        width: this.options.width + 'px'
      }
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
    }
  },
  watch: {
    img_dialog(value) {
      if (value === false) {
        if (!this.site_props[this.options.input_dict_name].img_props.url) {
          this.img_url = ''
        } else {
          // eslint-disable-next-line prettier/prettier
          this.img_url = this.site_props[this.options.input_dict_name].img_props.url
        }
        // eslint-disable-next-line prettier/prettier
        this.img_contain = this.site_props[this.options.input_dict_name].img_props.contain
      }
    }
  },
  mounted() {
    this.name_model =
      !this.options.preview &&
      this.site_props[this.options.input_dict_name].name
        ? this.site_props[this.options.input_dict_name].name
        : this.name
    this.tagline_model =
      !this.options.preview &&
      this.site_props[this.options.input_dict_name].tagline
        ? this.site_props[this.options.input_dict_name].tagline
        : this.tagline
    this.img_url = this.site_props[this.options.input_dict_name].img_props.url
    // eslint-disable-next-line prettier/prettier
    this.validated_img_url = this.site_props[this.options.input_dict_name].img_props.url
    // eslint-disable-next-line prettier/prettier
    this.img_contain = this.site_props[this.options.input_dict_name].img_props.contain
  },
  methods: {
    validateURL() {
      this.getValidatedURL().then((result) => {
        this.validated_img_url = result
      })
    },
    async getValidatedURL() {
      const validation = await this.$axios
        .$get(this.img_url)
        .then((response) => {
          if (response.headers['content-type'].split('/')[0] === 'image') {
            return this.img_url
          } else {
            return 'Inavlid Image URL.'
          }
        })
        .catch((error) => {
          return error ? 'Inavlid Image URL.' : ''
        })
      return validation
    },
    updateImgURL() {
      this.$emit('update', {
        type: 'img_props',
        value: {
          url: this.validated_img_url,
          contain: this.img_contain
        }
      })
    },
    updateInput(ev, type, maxLength) {
      if (ev.target.textContent.length <= maxLength) {
        this.$emit('update', {
          type,
          value: ev.target.textContent
        })
      } else {
        // eslint-disable-next-line prettier/prettier
        ev.target.textContent = this.site_props[this.options.input_dict_name][type]
      }
    }
  }
}
</script>

<template>
  <v-layout
    column
    :style="check_color_style"
    :class="{ slate: site_props.selected_theme === 1 && options.show_theme }"
    class="template-container"
  >
    <div class="user-img-container">
      <div :style="[imgStyle, check_color_style]">
        <v-tooltip v-model="edit_img_tooltip" right>
          <template v-slot:activator="{ on }">
            <v-img
              :style="imgStyle"
              alt="User Profile Picture"
              :src="
                !options.preview
                  ? site_props[options.input_dict_name].img_props.url
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
              :contain="
                site_props[options.input_dict_name]
                  ? site_props[options.input_dict_name].img_props.contain
                  : false
              "
              @click.stop="
                !options.preview && !options.live
                  ? (img_dialog = true)
                  : (img_dialog = false)
              "
              @mouseover="edit_img_tooltip = !options.preview && !options.live"
              @mouseout="edit_img_tooltip = false"
            >
            </v-img>
          </template>
          <span v-if="!options.preview && !options.live">Insert Image</span>
        </v-tooltip>
      </div>
    </div>
    <v-flex
      :style="check_color_style"
      class="user-landing-text d-flex flex-column pa-0 align-center"
    >
      <span
        v-if="!options.preview && !options.live"
        class="display-1"
        contenteditable="true"
        @input="updateInput($event, 'name', 30)"
      >
        {{ name_model }}
      </span>
      <span v-else :class="{ 'display-2': options.live, title: !options.live }">
        {{ name_model }}
      </span>
      <span
        v-if="!options.preview && !options.live"
        class="caption"
        contenteditable="true"
        @input="updateInput($event, 'tagline', 100)"
      >
        {{ tagline_model }}
      </span>
      <span
        v-else
        :class="{ caption: options.live, 'smaller-caption': !options.live }"
      >
        {{ tagline_model }}
      </span>
    </v-flex>
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
}

.user-img-container {
  margin-left: auto;
  margin-right: auto;
  height: 50%;
  display: flex;
  align-items: flex-end;
  margin-top: 5%;
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
}

.user-hero-image-border {
  border: 1px solid;
}

.user-landing-text {
  width: 100%;
  height: 10%;
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
</style>
