<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 7),
      date_open: false,
      editing: false,
      editing_certification_id: null,
      multiple_grades: false,
      overall_grade: false
    }
  },
  computed: {
    ...mapState('creator', ['site_props']),
    certifications() {
      return this.site_props.resume_page_inputs.certifications_section
    },
    cert_sections() {
      // eslint-disable-next-line prettier/prettier
      return this.certifications[this.editing_certification_id].certificate_sections.values
    },
    name: {
      set(value) {
        this.setResumeSection({
          section_type: 'certifications',
          prop: 'name',
          id: this.editing_certification_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.site_props.resume_page_inputs.certifications_section[this.editing_certification_id].name
      }
    },
    overall_grade_value: {
      set(value) {
        this.setResumeSection({
          section_type: 'certifications',
          prop: 'overall_grade',
          type: 'value',
          id: this.editing_certification_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.site_props.resume_page_inputs.certifications_section[this.editing_certification_id].overall_grade.value
      }
    }
  },
  watch: {
    overall_grade(value) {
      this.setResumeSection({
        section_type: 'certifications',
        prop: 'overall_grade',
        type: 'in_use',
        id: this.editing_certification_id,
        value
      })
    },
    multiple_grades(value) {
      this.setResumeSection({
        section_type: 'certifications',
        prop: 'certificate_sections',
        type: 'in_use',
        id: this.editing_certification_id,
        value
      })
    },
    date(value) {
      this.setResumeSection({
        section_type: 'certifications',
        prop: 'date_recieved',
        id: this.editing_certification_id,
        value
      })
    }
  },
  methods: {
    ...mapMutations({
      setResumeSection: 'creator/setResumeSection',
      deleteCertificationsCertSection:
        'creator/deleteCertificationsCertSection',
      addCertification: 'creator/addCertification',
      deleteCertification: 'creator/deleteCertification'
    }),
    selectGrade(id) {
      if (document.querySelector('.grade-selected')) {
        if (
          this.$refs['grade_' + id][0] ===
          document.querySelector('.grade-selected')
        ) {
          this.$refs['grade_' + id][0].classList.remove('grade-selected')
          this.editing = false
          this.editing_certification_id = null
        } else {
          document
            .querySelector('.grade-selected')
            .classList.remove('grade-selected')
          this.$refs['grade_' + id][0].classList.add('grade-selected')
          this.editing = true
          this.editing_certification_id = id
          // eslint-disable-next-line prettier/prettier
          // eslint-disable-next-line prettier/prettier
          this.multiple_grades = this.certifications[this.editing_certification_id].certificate_sections.in_use
          // eslint-disable-next-line prettier/prettier
          this.overall_grade = this.certifications[this.editing_certification_id].overall_grade.in_use
        }
      } else {
        this.$refs['grade_' + id][0].classList.add('grade-selected')
        this.editing = true
        this.editing_certification_id = id
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line prettier/prettier
        this.multiple_grades = this.certifications[this.editing_certification_id].certificate_sections.in_use
        // eslint-disable-next-line prettier/prettier
        this.overall_grade = this.certifications[this.editing_certification_id].overall_grade.in_use
      }
    },
    addGradeSection() {
      this.setResumeSection({
        section_type: 'certifications',
        prop: 'certificate_sections',
        type: 'values',
        append: true,
        id: this.editing_certification_id,
        value: {
          id: this.cert_sections.length,
          name: null,
          value: null
        }
      })
    },
    updateCertSection(ev, id, type) {
      this.setResumeSection({
        section_type: 'certifications',
        prop: 'certificate_sections',
        type: 'values',
        nested: true,
        type_id: id,
        type_value: type,
        id: this.editing_certification_id,
        value: ev
      })
    },
    deleteCertSection(id, certId) {
      this.deleteCertificationsCertSection({
        grade_id: this.editing_certification_id,
        section_id: id
      })
    },
    deleteCert() {
      const editingCertificationId = this.editing_certification_id
      this.editing_certification_id = null
      this.deleteCertification({
        id: editingCertificationId
      })
      this.editing = false
    }
  }
}
</script>

<template>
  <v-layout class="d-flex flex-column align-center grades-container">
    <div
      class="grades-viewer d-flex flex-column align-center mb-3 pa-6 elevation-2"
    >
      <div class="grades-wrapper d-flex flex-column align-center">
        <div
          v-for="grade in certifications"
          :key="grade.id"
          :ref="'grade_' + grade.id"
          class="grade d-flex flex-column align-center my-3 pa-3 elevation-1"
          @click="selectGrade(grade.id)"
        >
          <div class="cert-name">
            <span class="title">{{ grade.name }}</span>
          </div>
          <div v-if="grade.overall_grade.in_use" class="overall-grade">
            <span class="subtitle-1">
              Overall Grade: {{ grade.overall_grade.value }}
            </span>
          </div>
          <div
            v-if="grade.certificate_sections.in_use"
            class="cert-sections d-flex flex-column align-center"
          >
            <span class="subtitle-1">Certifications</span>
            <span
              v-for="value in grade.certificate_sections.values"
              :key="value.id"
              class="caption"
            >
              {{ value.name }}: {{ value.grade }}
            </span>
          </div>
          <div class="cert-date">
            <span class="caption">Awarded: {{ grade.date_recieved }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
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
            @click="addCertification()"
          >
            <span>Add a New Certification</span>
          </v-btn>
        </div>
        <div v-else key="editor" class="editor d-flex flex-column align-center">
          <span class="title">Edit your Certification Details</span>
          <div class="d-flex flex-column mt-3">
            <v-text-field
              v-model="name"
              outlined
              dense
              label="Certification Name"
            ></v-text-field>
            <div class="d-flex flex-column align-center my-1">
              <v-switch
                v-model="overall_grade"
                inset
                label="Use Overall Grade"
              ></v-switch>
              <v-text-field
                v-if="overall_grade"
                v-model="overall_grade_value"
                outlined
                dense
                label="Overall Grade"
              ></v-text-field>
              <v-switch
                v-model="multiple_grades"
                inset
                label="Use Multiple Grades"
              ></v-switch>
              <div
                v-for="section in cert_sections"
                :key="section.id"
                class="d-flex align-center"
              >
                <v-text-field
                  :value="section.name"
                  outlined
                  dense
                  label="Grade Title"
                  @input="updateCertSection($event, section.id, 'name')"
                ></v-text-field>
                <span class="headline mb-6">-</span>
                <v-text-field
                  :value="section.grade"
                  outlined
                  dense
                  label="Grade Value"
                  @input="updateCertSection($event, section.id, 'grade')"
                ></v-text-field>
                <v-btn
                  color="error"
                  class="mb-6 ml-2"
                  icon
                  @click.once="deleteCertSection(section.id)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <div v-if="multiple_grades" class="mb-3">
                <v-btn color="info" @click="addGradeSection()">
                  Add Grade Section
                </v-btn>
              </div>
            </div>
            <v-text-field
              v-model="date"
              outlined
              dense
              label="Date of Reciept"
              readonly
              prepend-icon="mdi-calendar"
              @focus="date_open = true"
            ></v-text-field>
            <v-btn
              color="error"
              class="align-self-center mb-3"
              width="10"
              @click="deleteCert()"
            >
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </div>
        </div>
      </transition>
    </div>
    <v-dialog
      ref="date_dialog"
      v-model="date_open"
      :return-value.sync="date"
      persistent
      width="290px"
    >
      <v-date-picker v-model="date" scrollable type="month">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="date_open = false">
          Cancel
        </v-btn>
        <v-btn text color="primary" @click="$refs.date_dialog.save(date)">
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
  </v-layout>
</template>

<style lang="scss" scoped>
.grades-container {
  width: 100%;
  height: 100%;
}

.grades-viewer {
  height: 50%;
  width: 100%;
  overflow: auto;
  position: relative;
}

.grades-wrapper {
  width: 100%;
}

.grade {
  width: 60%;
  border-radius: 10px;
}

.grade:hover {
  border: 1px solid #0066ff;
  cursor: pointer;
}

.grade-selected {
  border: 1px solid #0066ff;
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
