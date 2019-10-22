<script>
import { mapState } from 'vuex'
export default {
  props: {
    id: {
      type: String,
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
      default: () => ({})
    },
    link: {
      type: String,
      default: () => ({})
    },
    options: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {
      edit_project_tooltip: false
    }
  },
  computed: {
    ...mapState('creator', ['site_props']),
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
      this.$emit('edit_project', {
        id: this.id,
        title: this.title,
        description: this.description,
        img: this.img,
        link: this.link
      })
    },
    truncate(text, length, clamp) {
      clamp = clamp || '...'
      const node = document.createElement('div')
      node.innerHTML = text
      const content = node.textContent
      return content.length > length
        ? content.slice(0, length) + clamp
        : content
    }
  }
}
</script>

<template>
  <div
    class="elevation-2"
    :class="{
      'project-wrapper my-3': !options.preview,
      'preview-project-wrapper my-2': options.preview
    }"
  >
    <div
      class="pa-3"
      :style="[check_custom_style]"
      :class="{
        slate: site_props.selected_theme === 1,
        matrix: site_props.selected_theme === 3,
        'matrix-border': site_props.selected_theme === 3,
        'project-item': !options.preview,
        'preview-project-item': options.preview
      }"
    >
      <v-flex
        v-if="img.url !== ''"
        :class="{
          'project-img-container': !options.preview,
          'preview-project-img-container': options.preview
        }"
      >
        <v-img
          :class="{
            'project-img': !options.preview,
            'preview-project-img': options.preview
          }"
          :src="img.url"
          :contain="img.contain"
        ></v-img>
      </v-flex>
      <v-flex
        class="d-flex justify-center align-center flex-column project-desc-container"
      >
        <span :class="{ headline: options.live, 'subtitle-1': !options.live }">
          {{ title }}
        </span>
        <span
          :class="{ 'body-2': options.live, caption: !options.live }"
          class="text-center"
        >
          {{ options.preview ? truncate(description, 30, '...') : description }}
        </span>
      </v-flex>
      <v-flex v-if="link" class="project-actions-container"></v-flex>
    </div>
    <!-- <v-card
      width="300"
      :style="[check_custom_style]"
      class="project-item mx-auto"
      :class="{
        slate: site_props.selected_theme === 1,
        matrix: site_props.selected_theme === 3,
        'matrix-border': site_props.selected_theme === 3
      }"
    >
      <v-card-text>
        <v-container>
          <v-tooltip v-model="edit_project_tooltip" bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-if="!options.live && !options.preview"
                class="edit-icon mt-1 ml-3 pa-1"
                :color="site_props.selected_theme === 3 ? '#00E676' : 'warning'"
                @click.stop="editProject()"
                @mouseover="edit_project_tooltip = true"
                @mouseout="edit_project_tooltip = false"
                >mdi-pencil</v-icon
              >
            </template>
            <span>Edit</span>
          </v-tooltip>
          <div
            class="project-item-wrapper"
            :style="[check_custom_style]"
            :class="{
              slate: site_props.selected_theme === 1,
              matrix: site_props.selected_theme === 3
            }"
          >
            <v-flex v-if="img.url !== ''" class="project-img-container">
              <v-img
                class="project-img"
                :src="img.url"
                :contain="img.contain"
              ></v-img>
            </v-flex>
            <v-flex
              class="d-flex justify-center align-center flex-column project-desc-container"
            >
              <span class="headline">{{ title }}</span>
              <span class="subtitle text-center">{{ description }}</span>
            </v-flex>
            <v-flex v-if="link" class="project-actions-container"></v-flex>
          </div>
        </v-container>
      </v-card-text>
    </v-card> -->
  </div>
</template>

<style lang="scss" scoped>
.edit-icon {
  z-index: 10;
  position: absolute;
  right: 1%;
  top: 0;
  border: 1px solid;
  border-radius: 50%;
  cursor: pointer;
}

.edit-icon:hover {
  font-size: 30px;
}

.preview-project-wrapper {
  width: 60%;
}

.project-wrapper {
  width: 50%;
  border-radius: 10px;
  // border: 1px solid blue;
}

.preview-project-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.project-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.project-desc-container {
  width: 70%;
}

.preview-project-img-container {
  width: 90%;
  height: 50px;
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

.preview-project-img {
  height: 100%;
  width: 100%;
  border-radius: 10px;
}

.project-img {
  height: 100%;
  width: 100%;
  border-radius: 20px;
}
</style>
