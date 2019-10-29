<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      date_start: new Date().toISOString().substr(0, 10),
      date_start_open: false,
      date_end_open: false,
      date_end: new Date().toISOString().substr(0, 10),
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
      return this.site_props.resume_page_inputs.education_section.schools
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
        return this.editing ? this.site_props.resume_page_inputs.education_section.schools[this.editing_school_id].name : this.temp_school.val
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
        return this.editing ? this.site_props.resume_page_inputs.education_section.schools[this.editing_school_id].address.line_1 : this.temp_school.val
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
        return this.editing ? this.site_props.resume_page_inputs.education_section.schools[this.editing_school_id].address.line_2 : this.temp_school.val
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
        return this.editing ? this.site_props.resume_page_inputs.education_section.schools[this.editing_school_id].address.line_3 : this.temp_school.val
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
        return this.editing ? this.site_props.resume_page_inputs.education_section.schools[this.editing_school_id].address.line_4 : this.temp_school.val
      }
    }
  },
  watch: {
    currently_attending(value) {
      if (!value) {
        console.log('setting to now')
        this.setResumeSection({
          section_type: 'education',
          prop: 'years_attended',
          type: 'till',
          id: this.editing_school_id,
          value: null
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
      setResumeSection: 'creator/setResumeSection'
    }),
    selectSchool(id) {
      if (document.querySelector('.school-selected')) {
        if (this.$refs['school_' + id][0] === document.querySelector('.school-selected')) {
          this.$refs['school_' + id][0].classList.remove('school-selected')
          this.editing = false
          this.editing_school_id = null
        } else {
          document.querySelector('.school-selected').classList.remove('school-selected')
          this.$refs['school_' + id][0].classList.add('school-selected')
          this.editing = true
          this.editing_school_id = id
        }
      } else {
        this.$refs['school_' + id][0].classList.add('school-selected')
        this.editing = true
        this.editing_school_id = id
      }
    },
    update_school(id) {}
  }
}
</script>

<template>
  <v-layout class="d-flex flex-column align-center edu-container">
    <div class="edu-viewer d-flex flex-column align-center mb-3 pa-6 elevation-2">
      <div class="schools-container d-flex">
        <div
          v-for="school in schools"
          :key="school.id"
          :ref="'school_' + school.id"
          class="school pa-2 ma-2 elevation-1 d-flex flex-column align-center"
          @click="selectSchool(school.id)"
        >
          <div class="school-name">
            <span class="body-1">{{ school.name }}</span>
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
                ?
                school.years_attended.till : 'Now'
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="section-editor d-flex flex-column align-center elevation-2 pa-2"
    >
      <span class="title">Edit Your Eductaion Details</span>
      <span class="caption my-3">Select a school above to begin editing it</span>
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
          <v-checkbox v-model="currently_attending" :disabled="!editing" label="Currently attending"></v-checkbox>
        </div>
      </div>
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
        <v-btn text color="primary" @click="date_start_open = false">Cancel</v-btn>
        <v-btn text color="primary" @click="$refs.date_start_dialog.save(date_start)">OK</v-btn>
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
        <v-btn text color="primary" @click="date_end_open = false">Cancel</v-btn>
        <v-btn text color="primary" @click="$refs.date_end_dialog.save(date_end)">OK</v-btn>
      </v-date-picker>
    </v-dialog>
  </v-layout>
</template>

<style lang="scss" scoped>
.edu-container {
  width: 100%;
  height: 100%;
}

.edu-viewer {
  height: 50%;
  width: 100%;
  overflow: auto;
  position: relative;
}

.school {
  // border: 1px solid #777;
  width: 50%;
  border-radius: 10px;
}

.school-selected {
  border: 1px solid #0066ff;
}

.school:hover {
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
</style>
