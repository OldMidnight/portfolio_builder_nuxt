<script>
import { mapState, mapMutations } from 'vuex'
import { mask } from 'vue-the-mask'
export default {
  directives: {
    mask
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      phone_mask: '###-###-####'
    }
  },
  computed: {
    ...mapState('creator', ['site_props']),
    name: {
      set(value) {
        this.setResumeSection({
          section_type: 'info',
          prop: 'name',
          value
        })
      },
      get() {
        return this.site_props.resume_page_inputs.info_section.name
      }
    },
    email: {
      set(value) {
        this.setResumeSection({
          section_type: 'info',
          prop: 'email',
          value
        })
      },
      get() {
        return this.site_props.resume_page_inputs.info_section.email
      }
    },
    phone: {
      set(value) {
        this.setResumeSection({
          section_type: 'info',
          prop: 'phone',
          value
        })
      },
      get() {
        return this.site_props.resume_page_inputs.info_section.phone
      }
    },
    address_line_1: {
      set(value) {
        this.setResumeSection({
          section_type: 'info',
          prop: 'address',
          address_line: '1',
          value
        })
      },
      get() {
        return this.site_props.resume_page_inputs.info_section.address.line_1
      }
    },
    address_line_2: {
      set(value) {
        this.setResumeSection({
          section_type: 'info',
          prop: 'address',
          address_line: '2',
          value
        })
      },
      get() {
        return this.site_props.resume_page_inputs.info_section.address.line_2
      }
    },
    address_line_3: {
      set(value) {
        this.setResumeSection({
          section_type: 'info',
          prop: 'address',
          address_line: '3',
          value
        })
      },
      get() {
        return this.site_props.resume_page_inputs.info_section.address.line_3
      }
    },
    address_line_4: {
      set(value) {
        this.setResumeSection({
          section_type: 'info',
          prop: 'address',
          address_line: '4',
          value
        })
      },
      get() {
        return this.site_props.resume_page_inputs.info_section.address.line_4
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
      'info-main-container': !options.editing,
      'info-container': options.editing
    }"
  >
    <div
      class="mb-3 elevation-2"
      :class="{
        'info-viewer': options.editing,
        'info-main-viewer': !options.editing
      }"
    >
      <div class="name d-flex flex-column align-center my-2">
        <span class="headline">{{ name }}</span>
      </div>
      <div class="contact my-2 d-flex flex-column align-center">
        <span class="subtitle-2">{{ phone }}</span>
        <span class="subtitle-2">{{ email }}</span>
      </div>
      <div class="address my-2 d-flex flex-column align-center my-2">
        <span
          v-if="address_line_1 !== '' && address_line_1 !== null"
          class="body-2 address-line-1"
        >
          {{ address_line_1 }}
        </span>
        <span
          v-if="address_line_2 !== '' && address_line_2 !== null"
          class="body-2 address-line-2"
        >
          {{ address_line_2 }}
        </span>
        <span
          v-if="address_line_3 !== '' && address_line_3 !== null"
          class="body-2 address-line-3"
        >
          {{ address_line_3 }}
        </span>
        <span
          v-if="address_line_4 !== '' && address_line_4 !== null"
          class="body-2 address-line-4"
        >
          {{ address_line_4 }}
        </span>
      </div>
    </div>
    <div
      v-if="options.editing"
      class="section-editor d-flex flex-column align-center elevation-2 pa-2"
    >
      <span class="title my-3">Edit your details</span>
      <div class="d-flex flex-column align-center">
        <v-text-field
          v-model="name"
          outlined
          dense
          counter="28"
          label="Name"
        ></v-text-field>
        <v-text-field
          v-model="phone"
          v-mask="phone_mask"
          outlined
          dense
          counter="12"
          label="Phone Number"
        ></v-text-field>
        <v-text-field
          v-model="email"
          outlined
          dense
          label="Email"
        ></v-text-field>
        <v-text-field
          v-model="address_line_1"
          outlined
          dense
          label="Address Line 1"
        ></v-text-field>
        <v-text-field
          v-model="address_line_2"
          outlined
          dense
          label="Address Line 2"
        ></v-text-field>
        <v-text-field
          v-model="address_line_3"
          outlined
          dense
          label="Address Line 3"
        ></v-text-field>
        <v-text-field
          v-model="address_line_4"
          outlined
          dense
          label="Address Line 4"
        ></v-text-field>
      </div>
    </div>
  </v-layout>
</template>

<style lang="scss" scoped>
.info-container {
  width: 100%;
  height: 100%;
}

.info-main-container {
  width: 100%;
}

.info-viewer {
  height: 50%;
  width: 100%;
}

.info-main-viewer {
  height: 100%;
  width: 100%;
}

.section-editor {
  position: relative;
  height: 50%;
  width: 100%;
  // border: 1px solid;
  overflow: auto;
}
</style>
