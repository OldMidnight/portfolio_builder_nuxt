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
      editing_exp_id: null,
      temp_exp: {
        val: null
      },
      currently_attending: false
    }
  },
  computed: {
    ...mapState('creator', ['site_props']),
    experiences() {
      return this.site_props.resume_page_inputs.experience_section
    },
    org_name: {
      set(value) {
        this.setResumeSection({
          section_type: 'experience',
          prop: 'org_name',
          id: this.editing_exp_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.editing ? this.site_props.resume_page_inputs.experience_section[this.editing_exp_id].org_name : this.temp_exp.val
      }
    },
    role_name: {
      set(value) {
        this.setResumeSection({
          section_type: 'experience',
          prop: 'role_name',
          id: this.editing_exp_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.editing ? this.site_props.resume_page_inputs.experience_section[this.editing_exp_id].role_name : this.temp_exp.val
      }
    },
    description: {
      set(value) {
        this.setResumeSection({
          section_type: 'experience',
          prop: 'role_description',
          id: this.editing_exp_id,
          value
        })
      },
      get() {
        // eslint-disable-next-line prettier/prettier
        return this.editing ? this.site_props.resume_page_inputs.experience_section[this.editing_exp_id].role_description : this.temp_exp.val
      }
    }
  },
  watch: {
    currently_attending(value) {
      if (value) {
        this.setResumeSection({
          section_type: 'experience',
          prop: 'duration',
          type: 'till',
          id: this.editing_exp_id,
          value: null
        })
      } else {
        this.setResumeSection({
          section_type: 'experience',
          prop: 'duration',
          type: 'till',
          id: this.editing_exp_id,
          value: this.date_end
        })
      }
    },
    date_start(value) {
      this.setResumeSection({
        section_type: 'experience',
        prop: 'duration',
        type: 'from',
        id: this.editing_exp_id,
        value
      })
    },
    date_end(value) {
      this.setResumeSection({
        section_type: 'experience',
        prop: 'duration',
        type: 'till',
        id: this.editing_exp_id,
        value
      })
    }
  },
  methods: {
    ...mapMutations({
      setResumeSection: 'creator/setResumeSection',
      addExperience: 'creator/addExperience',
      deleteExperience: 'creator/deleteExperience'
    }),
    selectExp(id) {
      if (this.options.editing) {
        if (document.querySelector('.exp-selected')) {
          if (
            this.$refs['exp_' + id][0] ===
            document.querySelector('.exp-selected')
          ) {
            this.$refs['exp_' + id][0].classList.remove('exp-selected')
            this.editing = false
            this.editing_exp_id = null
          } else {
            document
              .querySelector('.exp-selected')
              .classList.remove('exp-selected')
            this.$refs['exp_' + id][0].classList.add('exp-selected')
            this.editing = true
            this.editing_exp_id = id
          }
        } else {
          this.$refs['exp_' + id][0].classList.add('exp-selected')
          this.editing = true
          this.editing_exp_id = id
        }
      }
    }
  }
}
</script>

<template>
  <v-layout class="d-flex flex-column align-center exp-container">
    <div class="exp-viewer mb-3 elevation-2">
      <div class="exp-container d-flex flex-column align-center">
        <div
          v-for="exp in experiences"
          :key="exp.id"
          :ref="'exp_' + exp.id"
          class="exp d-flex flex-column align-center pa-4 my-2"
          :class="{ selectable: options.editing }"
          @click="selectExp(exp.id)"
        >
          <div class="org-name">
            <span class="body-1">{{ exp.org_name }}</span>
          </div>
          <div class="duration">
            <span class="caption">
              {{ exp.duration.from }} :
              {{ exp.duration.till !== null ? exp.duration.till : 'Now' }}
            </span>
          </div>
          <div class="role-name">
            <span class="caption">Role: {{ exp.role_name }}</span>
          </div>
          <div
            class="role-description caption d-flex flex-column align-center mt-3"
          >
            <span>Description</span>
            <span class="desc">{{ exp.role_description }}</span>
          </div>
          <v-divider></v-divider>
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
            @click="addExperience()"
          >
            <span>Add a New Experience</span>
          </v-btn>
        </div>
        <div v-else key="editor" class="editor d-flex flex-column align-center">
          <div class="d-flex flex-column">
            <v-text-field
              v-model="org_name"
              :disabled="!editing"
              outlined
              dense
              label="Organisation Name"
            ></v-text-field>
            <div class="d-flex flex-column">
              <span class="body-2">Time Working Here</span>
              <v-text-field
                v-model="date_start"
                :disabled="!editing"
                outlined
                dense
                readonly
                prepend-icon="mdi-calendar"
                label="From"
                @focus="date_start_open = true"
              ></v-text-field>
              <v-text-field
                v-model="date_end"
                :disabled="!editing"
                outlined
                dense
                readonly
                prepend-icon="mdi-calendar"
                label="Till"
                @focus="date_end_open = true"
              ></v-text-field>
              <v-checkbox
                v-model="currently_attending"
                :disabled="!editing"
                label="Currently attending"
              ></v-checkbox>
            </div>
            <v-text-field
              v-model="role_name"
              :disabled="!editing"
              outlined
              dense
              label="Role Name"
            ></v-text-field>
            <v-textarea
              v-model="description"
              :disabled="!editing"
              outlined
              label="Describe Your Position..."
              class="exp-desc-box"
            ></v-textarea>
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
          @click="$refs.date_start_dialog.save(date_start)"
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
          @click="$refs.date_end_dialog.save(date_end)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
  </v-layout>
</template>

<style lang="scss" scoped>
.exp-container {
  width: 100%;
  height: 100%;
}

.exp-viewer {
  height: 50%;
  width: 100%;
  overflow: auto;
}

.exp {
  border-top: 1px solid;
  width: 90%;
}

.desc {
  white-space: pre-wrap;
  text-align: center;
  word-wrap: break-word;
}

.selectable:hover {
  cursor: pointer;
  border: 1px solid #0066ff;
  border-radius: 10px;
}

.exp-selected {
  border: 1px solid #0066ff;
  border-radius: 10px;
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
