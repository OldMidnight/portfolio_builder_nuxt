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
      'matrix-border': site_props.selected_theme === 2
    }"
    class="item-container mb-2 mx-auto"
  >
    <v-flex v-if="img.use" class="project-img-container pa-2">
      <v-img
        class="project-img"
        :src="img.url"
        :contain="img.contain"
        lazy-src="/img_lazy.jpeg"
      ></v-img>
    </v-flex>
    <v-flex class="d-flex flex-column project-content-container my-3 pa-2">
      <v-flex class="d-flex flex-column project-content">
        <p class="project-title title">
          {{ title }}
        </p>
        <p class="body-1 project-desc pt-3 mb-2 text-center">
          {{ description }}
        </p>
        <v-divider v-if="link.use"></v-divider>
        <a
          v-if="link.use"
          :class="
            `caption mt-1 primary--text ${
              site_props.selected_theme === 1 ? 'white--text' : ''
            }`
          "
        >
          {{ link.link_text }}
        </a>
      </v-flex>
    </v-flex>
    <v-btn class="px-3" color="info" @click.stop="editProject()">
      <v-icon class="pr-3">
        mdi-pencil
      </v-icon>
      Edit
    </v-btn>
  </v-layout>
</template>

<style lang="scss" scoped>
.edit-icon {
  position: absolute;
  right: 2%;
  border: 1px solid;
  // opacity: 0.4;
  border-radius: 50%;
  cursor: pointer;
}

.edit-icon:hover {
  opacity: 1;
}

.item-container {
  // border-bottom: 1px solid #777;
  position: relative;
  width: 100%;
  // border-radius: 20px;
}

.project-img-container {
  width: 25%;
  // border: 1px solid;
}

.project-img {
  min-height: 200px;
  max-height: 250px;
  width: 250px;
  border-radius: 20px;
  background-color: black;
}

.project-content-container {
  width: 75%;
  border-left: 1px solid #b6b6b6;
}

// .project-content {
//   height: 80%;
// }

// .preview-title {
//   font-size: 10px;
// }

// .project-title {
//   // height: 20%;
//   padding: 0 !important;
//   margin: 0 !important;
// }

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
</style>
