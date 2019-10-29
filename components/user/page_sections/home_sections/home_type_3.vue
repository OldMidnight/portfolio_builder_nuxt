<script>
export default {
  props: {
    para1: {
      type: String,
      default:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis'
    },
    para2: {
      type: String,
      default:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis'
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
      img_dialog_1: false,
      img_url_1: '',
      img_contain_1: false,
      edit_img_tooltip_1: false,
      validated_img_url_1: '',
      img_dialog_2: false,
      img_url_2: '',
      img_contain_2: false,
      edit_img_tooltip_2: false,
      validated_img_url_2: '',
      para_1_model: this.para_1,
      para_2_model: this.para_2
    }
  },
  computed: {
    site_props() {
      return this.$store.state.creator.site_props
    }
  },
  mounted() {
    this.para_1_model =
      !this.options.preview &&
      this.site_props[this.options.input_dict_name].para_1
        ? this.site_props[this.options.input_dict_name].para_1
        : this.para_1

    this.para_2_model =
      !this.options.preview &&
      this.site_props[this.options.input_dict_name].para_2
        ? this.site_props[this.options.input_dict_name].para_2
        : this.para_2

    this.img_url_1 = this.site_props[this.options.input_dict_name].img_props_1
      ? this.site_props[this.options.input_dict_name].img_props_1.url
      : ''

    this.validated_img_url_1 = this.site_props[this.options.input_dict_name]
      .img_props_1
      ? this.site_props[this.options.input_dict_name].img_props_1.url
      : ''

    this.img_contain_1 = this.site_props[this.options.input_dict_name]
      .img_props_1
      ? this.site_props[this.options.input_dict_name].img_props_1
      : this.img_contain_1

    this.img_url_2 = this.site_props[this.options.input_dict_name].img_props_2
      ? this.site_props[this.options.input_dict_name].img_props_2.url
      : ''

    this.validated_img_url_2 = this.site_props[this.options.input_dict_name]
      .img_props_2
      ? this.site_props[this.options.input_dict_name].img_props_2.url
      : ''

    this.img_contain_2 = this.site_props[this.options.input_dict_name]
      .img_props_2
      ? this.site_props[this.options.input_dict_name].img_props_2
      : this.img_contain_2
  },
  methods: {
    validateURL(num) {
      this.getValidatedURL(num).then((result) => {
        this['validated_img_url_' + num] = result
      })
    },
    async getValidatedURL(num) {
      const validation = await this.$axios
        .$get(this['img_url_' + num])
        .then((response) => {
          if (response.headers['content-type'].split('/')[0] === 'image') {
            return this['img_url_' + num]
          } else {
            return 'Inavlid Image URL.'
          }
        })
        .catch((error) => {
          return error ? 'Inavlid Image URL.' : ''
        })
      return validation
    },
    updateImgURL(num) {
      this.$emit('update', {
        type: 'img_props_' + num,
        value: {
          url: this['validated_img_url_' + num],
          contain: this['img_contain_' + num]
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
    :class="{
      'preview-template-container': options.preview,
      'template-container': !options.preview || options.live
    }"
    class="d-flex flex-column justify-center align-center"
  >
    <div
      :class="{
        'preview-content-container': options.preview,
        'content-container': !options.preview || options.live,
        'my-2': !options.preview || options.live,
        'mx-3': !options.preview || options.live,
        'my-1': options.preview,
        'mx-1': options.preview
      }"
      class="d-flex"
    >
      <div
        :class="{
          'preview-image-container': options.preview,
          'image-container': !options.preview
        }"
      >
        <v-tooltip v-model="edit_img_tooltip_1" right>
          <template v-slot:activator="{ on }">
            <v-img
              :class="{
                'slate-border':
                  site_props.selected_theme === 1 &&
                  (!options.preview || options.live),
                'matrix-border':
                  site_props.selected_theme === 3 &&
                  (!options.preview || options.live),
                'preview-main-img': options.preview,
                'main-img': !options.preview || options.live,
                'has-border': site_props.text_border_color,
                editable: !options.preview && !options.live
              }"
              class="elevation-2"
              :src="
                !options.preview &&
                site_props[options.input_dict_name].img_props_1
                  ? site_props[options.input_dict_name].img_props_1.url
                  : 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1233&q=80'
              "
              :contain="
                site_props[options.input_dict_name].img_props_1
                  ? site_props[options.input_dict_name].img_props_1.contain
                  : false
              "
              @click.stop="
                !options.preview && !options.live
                  ? (img_dialog_1 = true)
                  : (img_dialog_1 = false)
              "
              @mouseover="
                edit_img_tooltip_1 = !options.preview && !options.live
              "
              @mouseout="edit_img_tooltip_1 = false"
            >
            </v-img>
          </template>
          <span v-if="!options.preview && !options.live">Insert Image</span>
        </v-tooltip>
      </div>
      <div
        :class="{
          'preview-text-container': options.preview,
          'text-container': !options.preview || options.live
        }"
        class="px-6"
      >
        <p
          v-if="!options.preview && !options.live"
          class="pre-model"
          contenteditable="true"
          @input="updateInput($event, 'para_1', 300)"
        >
          {{ para_1_model }}
        </p>
        <p v-else class="pre-model">
          {{ para_1_model }}
        </p>
      </div>
    </div>
    <div
      :class="{
        'preview-content-container': options.preview,
        'content-container': !options.preview || options.live,
        'my-2': !options.preview || options.live,
        'mx-3': !options.preview || options.live,
        'my-1': options.preview,
        'mx-1': options.preview
      }"
      class="d-flex"
    >
      <div
        :class="{
          'preview-text-container': options.preview,
          'text-container': !options.preview || options.live
        }"
        class="px-6"
      >
        <p
          v-if="!options.preview && !options.live"
          class="pre-model"
          contenteditable="true"
          @input="updateInput($event, 'para_2', 300)"
        >
          {{ para_2_model }}
        </p>
        <p v-else class="pre-model">
          {{ para_2_model }}
        </p>
      </div>
      <div
        :class="{
          'preview-image-container': options.preview,
          'image-container': !options.preview || options.live
        }"
      >
        <v-tooltip v-model="edit_img_tooltip_2" right>
          <template v-slot:activator="{ on }">
            <v-img
              :class="{
                'slate-border':
                  site_props.selected_theme === 1 &&
                  (!options.preview || options.live),
                'matrix-border':
                  site_props.selected_theme === 3 &&
                  (!options.preview || options.live),
                'preview-main-img': options.preview,
                'main-img': !options.preview || options.live,
                'has-border': site_props.text_border_color,
                editable: !options.preview && !options.live
              }"
              class="elevation-2"
              :src="
                !options.preview &&
                site_props[options.input_dict_name].img_props_2
                  ? site_props[options.input_dict_name].img_props_2.url
                  : 'https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80'
              "
              :contain="
                site_props[options.input_dict_name].img_props_2
                  ? site_props[options.input_dict_name].img_props_2.contain
                  : false
              "
              @click.stop="
                !options.preview && !options.live
                  ? (img_dialog_2 = true)
                  : (img_dialog_2 = false)
              "
              @mouseover="
                edit_img_tooltip_2 = !options.preview && !options.live
              "
              @mouseout="edit_img_tooltip_2 = false"
            >
            </v-img>
          </template>
          <span v-if="!options.preview && !options.live">Insert Image</span>
        </v-tooltip>
      </div>
    </div>
    <v-dialog v-model="img_dialog_1" width="500">
      <v-card>
        <v-card-title>Edit Image</v-card-title>
        <v-card-text>
          <v-container>
            <span class="caption">Insert the url to your image</span>
            <v-text-field
              v-model="img_url_1"
              label="Image URL..."
              clearable
              outlined
              @input="validateURL('1')"
            >
            </v-text-field>
            <v-layout column justify-center align-center>
              <span>Preview</span>
              <v-flex class="mt-3 d-flex flex-column img-preview-container">
                <v-img
                  :src="validated_img_url_1"
                  class="align-self-center img-preview elevation-2"
                  :contain="img_contain_1"
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
              v-model="img_contain_1"
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
            <v-btn
              color="blue darken-1"
              text
              @click="
                img_dialog_1 = false
                img_url_1 = ''
              "
              >Close</v-btn
            >
            <v-btn
              color="blue darken-1"
              text
              @click="
                img_dialog_1 = false
                updateImgURL('1')
              "
              >Save</v-btn
            >
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="img_dialog_2" width="500">
      <v-card>
        <v-card-title>Edit Image</v-card-title>
        <v-card-text>
          <v-container>
            <span class="caption">Insert the url to your image</span>
            <v-text-field
              v-model="img_url_2"
              label="Image URL..."
              clearable
              outlined
              @input="validateURL('2')"
            >
            </v-text-field>
            <v-layout column justify-center align-center>
              <span>Preview</span>
              <v-flex class="mt-3 d-flex flex-column img-preview-container">
                <v-img
                  :src="validated_img_url_2"
                  class="align-self-center img-preview elevation-2"
                  :contain="img_contain_2"
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
              v-model="img_contain_2"
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
            <v-btn
              color="blue darken-1"
              text
              @click="
                img_dialog_2 = false
                img_url_2 = ''
              "
              >Close</v-btn
            >
            <v-btn
              color="blue darken-1"
              text
              @click="
                img_dialog_2 = false
                updateImgURL('2')
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
  // border: 1px solid;
  height: 100%;
}

.preview-template-container {
  height: 90%;
  width: 100%;
  // border: 1px solid;
}

.content-container {
  // border: 1px solid;
  max-height: 50%;
  min-height: 50%;
  width: 100%;
}

.img-preview-container {
  // border: 1px solid #b6b6b6;
  min-height: 200px;
  width: 100%;
}

.img-preview {
  // border: 1px solid #b6b6b6;
  border-radius: 20px;
  height: 200px;
  width: 75%;
}

.preview-content-container {
  max-height: 50%;
  min-height: 50%;
  width: 100%;
  // border: 1px solid;
}

.image-container {
  // border: 1px solid;
  max-width: 42%;
  min-width: 42%;
  margin: 4%;
  width: 42%;
}

.preview-image-container {
  max-width: 45%;
  width: 50%;
  margin: 4%;
  // border: 1px solid;
}

.text-container {
  // border: 1px solid;
  max-width: 50%;
  min-width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    text-align: center;
    overflow: auto;
    max-height: 100%;
  }
}

.preview-text-container {
  // border: 1px solid;
  max-width: 50%;
  min-width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 8px;
    text-align: justify;
    max-height: 100%;
  }
}

.main-img {
  // border: 1px solid #b6b6b6;
  border-radius: 10px;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  height: 100%;
}

.preview-main-img {
  // border: 1px solid #b6b6b6;
  border-radius: 10px;
  width: 100%;
  max-width: 100%;
  min-width: 50%;
  height: 100%;
}

.editable:hover {
  background-color: #bdbdbd;
  opacity: 0.2;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
}

.pre-model {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
