<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState('creator', ['site_props']),
    description: {
      set(value) {
        this.setResumeSection({
          section_type: 'description',
          prop: 'value',
          value
        })
      },
      get() {
        return this.site_props.resume_page_inputs.description_section.value
      }
    }
  },
  methods: {
    ...mapMutations({
      setResumeSection: 'creator/setResumeSection'
    })
  }
}
</script>

<template>
  <v-layout
    class="d-flex flex-column align-center"
    :class="{
      'desc-main-container': !options.editing,
      'desc-container': options.editing
    }"
  >
    <div
      class="mb-3 elevation-2"
      :class="{
        'desc-viewer': options.editing,
        'desc-main-viewer': !options.editing
      }"
    >
      <div class="description pt-5 px-9 d-flex flex-column align-center">
        <span v-if="!options.editing" class="title font-weight-bold">
          About Me:
        </span>
        <span class="desc" :class="{ 'subtitle-1': !options.editing }">
          {{ description }}
        </span>
      </div>
    </div>
    <div
      v-if="options.editing"
      class="section-editor pa-2 elevation-2 d-flex flex-column align-center"
    >
      <span class="title my-3">Describe Yourself!</span>
      <div class="desc-box-container d-flex flex-column align-center">
        <v-textarea
          v-model="description"
          class="desc-box"
          outlined
          label="Write About Yourself"
        ></v-textarea>
      </div>
    </div>
  </v-layout>
</template>

<style lang="scss" scoped>
.desc-container {
  width: 100%;
  height: 100%;
}

.desc-main-container {
  width: 100%;
}

.desc-viewer {
  // border: 1px solid;
  height: 50%;
  width: 100%;
  overflow: auto;
}

.desc-main-viewer {
  height: 100%;
  width: 100%;
  overflow: auto;
}

.section-editor {
  // border: 1px solid;
  // height: 50%;
  width: 100%;
  overflow: auto;
}

.desc-box-container {
  width: 100%;
}

.desc-box {
  width: 80%;
}

.desc {
  white-space: pre-wrap;
  width: 100%;
  text-align: center;
  word-wrap: break-word;
}
</style>
