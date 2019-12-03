<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      date_start: new Date().toISOString().substr(0, 7),
      date_start_open: false,
      date_end_open: false,
      date_end: new Date().toISOString().substr(0, 7),
      editing: false,
      editing_school_id: null,
      temp_school: {
        val: null
      },
      currently_attending: false
    }
  },
  computed: {
    ...mapState('creator', ['site_props']),
    schools() {
      return this.site_props.resume_page_inputs.education_section
    },
    school_name: {
      set(value) {
        this.setResumeSection({
          section_type: 'education',
          prop: 'name',
          id: this.editing_school_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.editing ? this.site_props.resume_page_inputs.education_section[this.editing_school_id].name : this.temp_school.val
      }
    },
    line_1: {
      set(value) {
        this.setResumeSection({
          section_type: 'education',
          prop: 'address',
          address_line: '1',
          id: this.editing_school_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.editing ? this.site_props.resume_page_inputs.education_section[this.editing_school_id].address.line_1 : this.temp_school.val
      }
    },
    line_2: {
      set(value) {
        this.setResumeSection({
          section_type: 'education',
          prop: 'address',
          address_line: '2',
          id: this.editing_school_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.editing ? this.site_props.resume_page_inputs.education_section[this.editing_school_id].address.line_2 : this.temp_school.val
      }
    },
    line_3: {
      set(value) {
        this.setResumeSection({
          section_type: 'education',
          prop: 'address',
          address_line: '3',
          id: this.editing_school_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.editing ? this.site_props.resume_page_inputs.education_section[this.editing_school_id].address.line_3 : this.temp_school.val
      }
    },
    line_4: {
      set(value) {
        this.setResumeSection({
          section_type: 'education',
          prop: 'address',
          address_line: '4',
          id: this.editing_school_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.editing ? this.site_props.resume_page_inputs.education_section[this.editing_school_id].address.line_4 : this.temp_school.val
      }
    }
  },
  watch: {
    currently_attending(value) {
      if (value) {
        this.setResumeSection({
          section_type: 'education',
          prop: 'years_attended',
          type: 'till',
          id: this.editing_school_id,
          value: null
        })
      } else {
        this.setResumeSection({
          section_type: 'education',
          prop: 'years_attended',
          type: 'till',
          id: this.editing_school_id,
          value: this.date_end
        })
      }
    },
    date_start(value) {
      this.setResumeSection({
        section_type: 'education',
        prop: 'years_attended',
        type: 'from',
        id: this.editing_school_id,
        value
      })
    },
    date_end(value) {
      this.setResumeSection({
        section_type: 'education',
        prop: 'years_attended',
        type: 'till',
        id: this.editing_school_id,
        value
      })
    }
  },
  methods: {
    ...mapMutations({
      setResumeSection: 'creator/setResumeSection',
      addEducation: 'creator/addEducation',
      deleteEducation: 'creator/deleteEducation'
    }),
    selectSchool(id) {
      if (this.options.editing) {
        if (document.querySelector('.school-selected')) {
          if (
            this.$refs['school_' + id][0] ===
            document.querySelector('.school-selected')
          ) {
            this.$refs['school_' + id][0].classList.remove('school-selected')
            this.editing = false
            this.editing_school_id = null
          } else {
            document
              .querySelector('.school-selected')
              .classList.remove('school-selected')
            this.$refs['school_' + id][0].classList.add('school-selected')
            this.editing = true
            this.editing_school_id = id
          }
        } else {
          this.$refs['school_' + id][0].classList.add('school-selected')
          this.editing = true
          this.editing_school_id = id
        }
      }
    },
    deleteEdu() {
      const editingSchoolId = this.editing_school_id
      this.editing_school_id = null
      this.deleteEducation({
        id: editingSchoolId
      })
      this.editing = false
    }
  }
}
</script>

<template>
  <v-layout
    class="d-flex flex-column align-center"
    :class="{
      'edu-main-container': !options.editing,
      'edu-container': options.editing
    }"
  >
    <div
      class="d-flex flex-column align-center mb-3 pa-6 elevation-2"
      :class="{
        'edu-viewer': options.editing,
        'edu-main-viewer': !options.editing
      }"
    >
      <div class="schools-container d-flex flex-wrap justify-center">
        <span v-if="!options.editing" class="title font-weight-bold">
          Education:
        </span>
        <div
          v-for="school in schools"
          :key="school.id"
          :ref="'school_' + school.id"
          class="pa-2 ma-2 elevation-1 d-flex flex-column align-center"
          :class="{
            'selectable school': options.editing,
            'main-school': !options.editing
          }"
          @click.stop="selectSchool(school.id)"
        >
          <div class="school-name">
            <span
              :class="{
                'body-1': options.editing,
                'body-2': !options.editing
              }"
            >
              {{ school.name }}
            </span>
          </div>
          <div class="school-address d-flex flex-column align-center">
            <span
              v-for="(line, index) in school.address"
              :key="index"
              class="address_line caption"
            >
              {{ line }}
            </span>
          </div>
          <div class="time-attended">
            <span class="caption">
              {{ school.years_attended.from }} :
              {{
                school.years_attended.till !== null
                  ? school.years_attended.till
                  : 'Now'
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="options.editing"
      class="section-editor d-flex flex-column align-center elevation-2 pa-2"
    >
      <transition
        enter-active-class="animated fadeIn faster"
        leave-active-class="animated fadeOut faster"
        mode="out-in"
      >
        <div
          v-if="!editing"
          key="placeholder"
          class="editor-placeholder d-flex flex-column align-center justify-center"
        >
          <span class="headline">Select an item above to begin editing!</span>
          <v-btn
            color="info"
            class="mt-4"
            rounded
            large
            @click.stop="addEducation()"
          >
            <span>Add a New Place of Education</span>
          </v-btn>
        </div>
        <div v-else key="editor" class="editor d-flex flex-column align-center">
          <div class="d-flex flex-column">
            <v-text-field
              v-model="school_name"
              :disabled="!editing"
              outlined
              dense
              label="Name of School"
            ></v-text-field>
            <div class="d-flex my-2 flex-column align-center">
              <span class="body-2">Address</span>
              <v-text-field
                v-model="line_1"
                :disabled="!editing"
                outlined
                dense
                label="Line 1"
              ></v-text-field>
              <v-text-field
                v-model="line_2"
                :disabled="!editing"
                outlined
                dense
                label="Line 2"
              ></v-text-field>
              <v-text-field
                v-model="line_3"
                :disabled="!editing"
                outlined
                dense
                label="Line 3"
              ></v-text-field>
              <v-text-field
                v-model="line_4"
                :disabled="!editing"
                outlined
                dense
                label="Line 4"
              ></v-text-field>
            </div>
            <div class="d-flex my-2 flex-column align-center">
              <span class="body-2">Time Attending</span>
              <v-text-field
                v-model="date_start"
                :disabled="!editing"
                outlined
                dense
                label="From"
                readonly
                prepend-icon="mdi-calendar"
                @focus="date_start_open = true"
              ></v-text-field>
              <v-text-field
                v-model="date_end"
                :disabled="!editing || currently_attending"
                outlined
                dense
                label="Till"
                readonly
                prepend-icon="mdi-calendar"
                @focus="date_end_open = true"
              ></v-text-field>
              <v-checkbox
                v-model="currently_attending"
                :disabled="!editing"
                label="Currently attending"
              ></v-checkbox>
            </div>
            <v-btn
              color="error"
              class="align-self-center mb-3"
              width="10"
              @click.stop="deleteEdu()"
            >
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </div>
        </div>
      </transition>
    </div>
    <v-dialog
      ref="date_start_dialog"
      v-model="date_start_open"
      :return-value.sync="date_start"
      persistent
      width="290px"
    >
      <v-date-picker v-model="date_start" scrollable type="month">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="date_start_open = false">
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click.stop="$refs.date_start_dialog.save(date_start)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
    <v-dialog
      ref="date_end_dialog"
      v-model="date_end_open"
      :return-value.sync="date_end"
      persistent
      width="290px"
    >
      <v-date-picker v-model="date_end" scrollable type="month">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="date_end_open = false">
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click.stop="$refs.date_end_dialog.save(date_end)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
  </v-layout>
</template>

<style lang="scss" scoped>
.edu-container {
  width: 100%;
  height: 100%;
}

.edu-main-container {
  width: 100%;
}

.edu-viewer {
  height: 50%;
  width: 100%;
  overflow: auto;
  position: relative;
}

.edu-main-viewer {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
}

.school {
  // border: 1px solid #777;
  width: 45%;
  border-radius: 10px;
}

.main-school {
  width: 90%;
  border-radius: 10px;
}

.school-selected {
  border: 1px solid #0066ff;
}

.selectable:hover {
  border: 1px solid #0066ff;
  cursor: pointer;
}

.school-name {
  text-align: center;
}

.section-editor {
  position: relative;
  height: 50%;
  width: 100%;
  // border: 1px solid;
  overflow: auto;
}

.editor-placeholder {
  height: 100%;
  width: 100%;
  border: 1px dashed #777;
  border-radius: 10px;
}
</style>
