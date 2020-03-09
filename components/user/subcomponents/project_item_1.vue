<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    img: {
      type: Object,
      required: true
    },
    link: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  computed: {
    site_props() {
      return this.$store.state.creator.site_props
    },
    check_custom_style() {
      const style = {}

      if (this.site_props.custom_foreground) {
        style.backgroundColor = this.site_props.foreground.color
      }
      if (this.site_props.text_border_color) {
        style.color = this.site_props.text_border_color_value
        style.border = '1px solid'
      }

      return !this.options.preview ? style : {}
    }
  },
  methods: {
    editProject() {
      this.$emit(
        'edit',
        JSON.stringify({
          index: this.index,
          project: {
            id: this.id,
            title: this.title,
            description: this.description,
            img: this.img,
            link: this.link
          }
        })
      )
    }
  }
}
</script>

<template>
  <v-layout
    :style="[check_custom_style]"
    :class="{
      'matrix-border': site_props.selected_theme === 2,
      'd-flex flex-column justify-center align-center':
        $vuetify.breakpoint.smAndDown
    }"
    class="pos-rel w-100 mb-2 mx-auto"
  >
    <v-flex
      v-if="img.use"
      :class="
        `pa-2 ${
          $vuetify.breakpoint.smAndDown ? 'w-50' : 'd-flex align-center w-25'
        }`
      "
    >
      <v-img
        class="project-img"
        :style="{ opacity: $vuetify.breakpoint.smAndDown ? '0.5' : '1' }"
        :src="img.url"
        :contain="img.contain"
        lazy-src="/img_lazy.jpeg"
      ></v-img>
    </v-flex>
    <v-flex
      class="d-flex flex-column project-content-container my-3 pa-2"
      :class="{
        'm-project-content-container text-center': $vuetify.breakpoint.smAndDown
      }"
    >
      <v-flex
        class="d-flex flex-column project-content ml-0 ml-md-3 align-center align-md-start"
      >
        <p class="project-title headline">
          {{ title }}
        </p>
        <p class="body-1 project-desc pt-3 mb-2">
          {{ description }}
        </p>
        <v-divider v-if="link.use"></v-divider>
        <v-btn
          v-if="link.use && $vuetify.breakpoint.smAndDown"
          color="info"
          class="caption mt-1 project-link-btn"
          :href="link.url"
        >
          {{ link.link_text }}
        </v-btn>
        <a
          v-else-if="link.use"
          class="caption mt-1 primary--text"
          :href="link.url"
        >
          {{ link.link_text }}
        </a>
      </v-flex>
    </v-flex>
    <v-btn
      :class="`px-3 ${$vuetify.breakpoint.smAndDown ? 'pos-abs top-0' : ''}`"
      color="info"
      @click.stop="editProject()"
    >
      <v-icon class="pr-3">
        mdi-pencil
      </v-icon>
      Edit
    </v-btn>
  </v-layout>
</template>

<style lang="scss" scoped>
.project-img {
  border-radius: 20px;
  background-color: black;
}

.project-content-container {
  width: 75%;
  border-left: 1px solid #b6b6b6;
}

.m-project-content-container {
  width: 100%;
  border-left: none;
}

.project-desc {
  // height: 80%;
  overflow: auto;
  margin: 0 !important;
  white-space: pre-wrap;
  word-wrap: break-word;
  // text-align: justify;
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

.project-link-btn {
  width: 40%;
}
</style>
