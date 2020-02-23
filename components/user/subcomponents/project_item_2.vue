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
    class="elevation-2 project-wrapper my-3 d-flex flex-column align-center justify-center"
  >
    <v-card
      :style="[check_custom_style]"
      :class="{
        slate: site_props.selected_theme === 1,
        'matrix matrix-border': site_props.selected_theme === 2
      }"
    >
      <v-card-title class="d-flex justify-center">
        <span class="headline">
          {{ title }}
        </span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="d-flex flex-column align-center">
        <v-flex v-if="img.use" class="project-img-container">
          <v-img
            class="project-img"
            :src="img.url"
            :contain="img.contain"
            lazy-src="/img_lazy.jpeg"
          ></v-img>
        </v-flex>
        <v-flex
          class="d-flex justify-center align-center flex-column project-desc-container"
        >
          <span class="desc text-center body-2">
            {{ description }}
          </span>
          <v-divider v-if="link.use"></v-divider>
          <a v-if="link.use" class="caption mt-1 primary--text">
            {{ link.link_text }}
          </a>
        </v-flex>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="edit-icon pa-2"
              :color="site_props.selected_theme === 2 ? '#00E676' : 'warning'"
              outlined
              @click.stop="editProject()"
              v-on="on"
            >
              <v-icon>mdi-pencil</v-icon>Edit
            </v-btn>
          </template>
          <span>Edit</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
    <!-- <v-btn
      :color="site_props.selected_theme === 2 ? '#00E676' : 'info'"
      class="edit-icon mt-4 ml-3 pa-1 px-2"
      @click.stop="editProject()"
    >
      <v-icon>mdi-pencil</v-icon>
      Edit
    </v-btn> -->
  </v-layout>
</template>

<style lang="scss" scoped>
.edit-icon {
  z-index: 10;
  // position: absolute;
  border: 1px solid;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.5;
}

.edit-icon:hover {
  opacity: 1;
}

.project-wrapper {
  width: 100%;
  // border-radius: 10px;
  // border: 1px solid blue;
}

.project-desc-container {
  width: 70%;
}

.project-img-container {
  width: 90%;
  height: 150px;
}

.project-item-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none !important;
}

.project-img {
  height: 100%;
  width: 100%;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.465);
}

.desc {
  white-space: pre-wrap;
  text-align: center;
  word-wrap: break-word;
}
</style>
