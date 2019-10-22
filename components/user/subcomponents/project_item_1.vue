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
  <v-layout
    :style="[check_custom_style]"
    :class="{
      'item-container mb-2 mx-auto': !options.live && !options.preview,
      'live-item-container mb-2 mx-auto': options.live,
      'preview-item-container ml-3': options.preview,
      'matrix-border': site_props.selected_theme === 3
    }"
    class="elevation-1"
  >
    <v-flex class="project-img-container pa-2">
      <v-img class="project-img" :src="img.url" :contain="img.contain"></v-img>
    </v-flex>
    <v-flex class="d-flex flex-column project-content-container my-3 pa-2">
      <v-flex class="d-flex flex-column project-content">
        <p
          class="project-title"
          :class="{
            headline: !options.preview,
            'preview-title': options.preview
          }"
        >
          {{ title }}
        </p>
        <p v-if="options.preview" class="preview-desc project-desc">
          {{ truncate(description, 30, '...') }}
        </p>
        <p v-else class="body-2 project-desc pt-3">{{ description }}</p>
      </v-flex>
      <a
        v-if="link || options.preview"
        :href="link"
        class="mt-2 project-link"
        :class="{ caption: !options.preview, 'preview-link': options.preview }"
        >Learn More</a
      >
    </v-flex>
    <v-tooltip v-model="edit_project_tooltip" bottom>
      <template v-slot:activator="{ on }">
        <v-icon
          v-if="!options.live && !options.preview"
          class="edit-icon mt-4 ml-3 pa-1"
          :color="site_props.selected_theme === 3 ? '#00E676' : 'warning'"
          @click.stop="editProject()"
          @mouseover="edit_project_tooltip = true"
          @mouseout="edit_project_tooltip = false"
          >mdi-pencil</v-icon
        >
      </template>
      <span>Edit</span>
    </v-tooltip>
  </v-layout>
</template>

<style lang="scss" scoped>
.edit-icon {
  position: absolute;
  right: 2%;
  border: 1px solid;
  border-radius: 50%;
  cursor: pointer;
}

.edit-icon:hover {
  font-size: 30px;
}

.item-container {
  // border: 1px solid;
  position: relative;
  width: 90%;
  max-height: 50%;
  min-height: 50%;
  border-radius: 20px;
}

.live-item-container {
  position: relative;
  width: 90%;
  max-height: 35%;
  min-height: 35%;
  border-radius: 20px;
}

.preview-item-container {
  position: relative;
  width: 100%;
  max-height: 35%;
  min-height: 35%;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 20px;
}

.project-img-container {
  width: 25%;
  // border: 1px solid;
}

.project-img {
  height: 100%;
  width: 250px;
  border-radius: 20px;
  background-color: black;
}

.project-content-container {
  width: 75%;
  border-left: 1px solid #b6b6b6;
}

.project-content {
  height: 80%;
}

.preview-title {
  font-size: 10px;
}

.project-title {
  // height: 20%;
  padding: 0 !important;
  margin: 0 !important;
}

.preview-desc {
  font-size: 8px;
}

.project-desc {
  // height: 80%;
  overflow: auto;
  margin: 0 !important;
}

.project-link {
  // height: 20%;
  margin: 0 !important;
}

.preview-link {
  font-size: 8px;
}
</style>
