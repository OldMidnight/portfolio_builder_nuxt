export const state = () => ({
  creation_step: 0,
  site_props: {
    transition: {
      name: 'Fade',
      enterActiveClass: 'fadeIn',
      leaveActiveClass: 'fadeOut'
    },
    favicon: {
      link: true,
      upload: false,
      url: '/favicon.ico'
    },
    layout: null,
    navigation: 0,
    navigation_style: '1',
    navigation_color: 'success',
    navigation_text_color: 'white',
    textify: false,
    site_name: 'My Website',
    nav_titles: {
      home: 'Home',
      projects: 'Projects',
      resume: 'Resume'
    },
    selected_theme: null,
    custom_background: false,
    custom_foreground: false,
    background: {
      color: '#FFFFFF',
      img_src: null
    },
    foreground: {
      color: '#FFFFFF',
      img_src: null
    },
    tab_colors: {
      home: '#FFFFFF',
      projects: '#FFFFFF',
      resume: '#FFFFFF'
    },
    tab_text_colors: {
      home: 'black',
      projects: 'black',
      resume: 'black'
    },
    text_border_color: false,
    text_border_color_value: '#000000',
    home_page_img_1: null,
    home_page_1_data: null,
    home_page_2_data: null,
    // home_page_3_data: null,
    projects_page_1_data: null,
    projects_page_2_data: {},
    // projects_page_3_inputs: {},
    resume_page_inputs: {
      resume_created: false,
      resume_sections: {},
      resume_layout: [],
      resume_upload: {
        use: false,
        url: null
      },
      info_section: {
        name: null,
        phone: '0811111111',
        email: null,
        address: {
          line_1: 'Bag End',
          line_2: '1 Bagshot Row',
          line_3: 'Hobbiton',
          line_4: 'The Shire'
        }
      },
      description_section: {
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      },
      education_section: [
        {
          id: 0,
          name: 'Hogwarts School of Witchcraft and Wizadry',
          address: {
            line_1: 'Hogwarts Castle',
            line_2: 'Highlands',
            line_3: 'Scotland',
            line_4: 'Great Britain'
          },
          years_attended: {
            from: '2001-01',
            till: null
          }
        },
        {
          id: 1,
          name: 'Hogwarts School of Witchcraft and Wizadry',
          address: {
            line_1: 'Hogwarts Castle',
            line_2: 'Highlands',
            line_3: 'Scotland',
            line_4: 'Great Britain'
          },
          years_attended: {
            from: '2001-01',
            till: null
          }
        }
      ],
      experience_section: [
        {
          id: 0,
          org_name: 'The Jedi',
          duration: {
            from: '2001-01',
            till: null
          },
          role_name: 'Padawan',
          role_description:
            'A Jedi pupil or student, or broadly used as anyone that is learning'
        },
        {
          id: 1,
          org_name: 'The Jedi',
          duration: {
            from: '2001-01',
            till: null
          },
          role_name: 'Padawan',
          role_description:
            'A Jedi pupil or student, or broadly used as anyone that is learning'
        }
      ],
      certifications_section: [
        {
          id: 0,
          name: 'AWS Certificate',
          overall_grade: {
            in_use: true,
            value: '1.2'
          },
          certificate_sections: {
            in_use: false,
            values: []
          },
          date_recieved: '2001-01'
        },
        {
          id: 1,
          name: 'Leaving Certificate',
          overall_grade: {
            in_use: false,
            value: false
          },
          certificate_sections: {
            in_use: true,
            values: [
              {
                id: 0,
                name: 'English',
                grade: 'A'
              },
              {
                id: 1,
                name: 'Maths',
                grade: 'B'
              },
              {
                id: 2,
                name: 'Spanish',
                grade: 'C'
              }
            ]
          },
          date_recieved: '2001-01'
        }
      ],
      interests_section: [
        {
          id: 0,
          title: 'Quidditch',
          details: {
            available: true,
            value:
              'Is this a real sport? Debatable. Am I still claiming to have played it? Yes.'
          }
        },
        {
          id: 1,
          title: 'Rugby',
          details: {
            available: false,
            value: null
          }
        }
      ]
    },
    homePages: [],
    projectsPages: [],
    resumePages: [],
    social_media_bar: [0, 1, 2, 3],
    social_media_bar_urls: {
      0: null,
      1: null,
      2: null,
      3: null
    },
    callToActionURL: 'call-to-action'
  },
  is_subdomain: false,
  domain: {
    name: null,
    available: false
  },
  show_next_step: false,
  images_to_upload: [],
  favicon_to_upload: null,
  project_images_to_upload: [],
  files_to_upload: [],
  user_uploads: [],
  user_storage: {}
})

export const mutations = {
  clearAllChanges(state) {
    state.site_props.navigation = 0
    state.site_props.navigation_style = '1'
    state.site_props.navigation_color = 'success'
    state.site_props.navigation_text_color = null
    state.site_props.textify = false
    state.site_props.nav_titles.home = 'Home'
    state.site_props.nav_titles.projects = 'Projects'
    state.site_props.nav_titles.resume = 'Resume'
    state.site_props.selected_theme = null
    state.site_props.custom_background = false
    state.site_props.custom_foreground = false
    state.site_props.background.color = '#FFFFFF'
    state.site_props.background.img_src = null
    state.site_props.foreground.color = '#FFFFFF'
    state.site_props.foreground.img_src = null
    state.site_props.tab_colors.home = '#FFFFFF'
    state.site_props.tab_colors.projects = '#FFFFFF'
    state.site_props.tab_colors.resume = '#FFFFFF'
    state.site_props.text_border_color = false
    state.site_props.text_border_color_value = '#000000'
    state.show_next_step = false
  },
  resetCreationStep(state) {
    state.creation_step = 0
  },
  setCreationStep(state, sym) {
    if (sym === '+') {
      state.creation_step = state.creation_step + 1
    } else {
      state.creation_step = state.creation_step - 1
    }
  },
  setSiteLayout(state, value) {
    state.site_props.layout = value
  },
  showNextStep(state) {
    state.show_next_step = true
  },
  hideNextStep(state) {
    state.show_next_step = false
  },
  setSiteNav(state, value) {
    state.site_props.navigation = value
  },
  setSiteName(state, siteName) {
    state.site_props.site_name = siteName
  },
  setNavTitle(state, payload) {
    state.site_props.nav_titles[payload.tab] = payload.value
  },
  setTheme(state, value) {
    state.site_props.selected_theme = value
  },
  setCustomBackground(state, value) {
    state.site_props.custom_background = value
  },
  setCustomForeground(state, value) {
    state.site_props.custom_foreground = value
  },
  setBackgroundValue(state, payload) {
    state.site_props.background[payload.type] = payload.value
  },
  setForegroundValue(state, payload) {
    state.site_props.foreground[payload.type] = payload.value
  },
  setTabColor(state, payload) {
    state.site_props.tab_colors[payload.type] = payload.value
  },
  setTabTextColor(state, payload) {
    state.site_props.tab_text_colors[payload.type] = payload.value
  },
  setInputDictValues(state, payload) {
    state.site_props[payload.inputDict] = payload.input_dict_values
  },
  addProject(state, payload) {
    /*
    Payload contains:
      page_label: String - dictionary for page data
      project: Object - a dictionary containing the new project data
    */
    state.site_props[payload.page_label].projects.push(payload.project)
  },
  deleteProject(state, payload) {
    /* Method to remove a project from website props
    Payload contains 2 varaibles:
      page_label: String - dictionary for page data
      index: Number - the index in the projects list the editing project appears
    */
    state.site_props[payload.page_label].projects.splice(payload.index, 1)
  },
  updateProject(state, payload) {
    /*
    Payload contains 3 varaibles:
      page_label: String - dictionary for page data
      index: Number - the index in the projects list the editing project appears
      project: Object - a dictionary containing the new project data
    */
    state.site_props[payload.page_label].projects[payload.index] =
      payload.project
  },
  updatePageHTML(state, payload) {
    /*
    Payload contains:
      page_label: String - dictionary for page data
      html: Html content from tiptap editor for the page

    Also changes saving state from true to false
    */
    state.site_props[payload.page_label].html = payload.html
    state.saving = false
  },
  updatePageImg(state, payload) {
    state.site_props[payload.page_label][payload.img_props] = payload.data
  },
  updatePageData(state, payload) {
    state.site_props[payload.page_label] = payload.data
  },
  updatePageDataObject(state, payload) {
    state.site_props[payload.page_label][payload.type] = payload.data
  },
  updateInputDictValue(state, payload) {
    state.site_props[payload.inputDict][payload.input_type] =
      payload.input_value
  },
  updateInputArrayValue(state, payload) {
    // eslint-disable-next-line prettier/prettier
    for (const item in state.site_props[payload.inputDict][
      payload.input_type
    ]) {
      if (
        state.site_props[payload.inputDict][payload.input_type][item].id ===
        payload.id
      ) {
        if (payload.update_type === 'update') {
          state.site_props[payload.inputDict][payload.input_type][item] =
            payload.input_value
        } else if (payload.update_type === 'delete') {
          state.site_props[payload.inputDict][payload.input_type].splice(
            item,
            1
          )
        }
      }
    }
  },
  addInputArrayValue(state, payload) {
    state.site_props[payload.inputDict][payload.input_type].push(
      payload.input_value
    )
  },
  setNavStyle(state, value) {
    state.site_props.navigation_style = value
  },
  setNavColor(state, value) {
    state.site_props.navigation_color = value
  },
  setNavTextColor(state, value) {
    state.site_props.navigation_text_color = value
  },
  setTextify(state, value) {
    state.site_props.textify = value
  },
  setTextBorderColor(state, value) {
    state.site_props.text_border_color = value
  },
  setTextBorderColorValue(state, value) {
    state.site_props.text_border_color_value = value
  },
  setHomePages(state, value) {
    state.site_props.homePages = value
  },
  setProjectsPages(state, value) {
    state.site_props.projectsPages = value
  },
  setResumePages(state, value) {
    state.site_props.resumePages = value
  },
  addPage(state, payload) {
    state.site_props[payload.tab].push(payload.page)
  },
  deleteNavPage(state, payload) {
    state.site_props[payload.list].splice(payload.index, 1)
    for (let i = 0; i < state.site_props[payload.list].length; i++) {
      state.site_props[payload.list][i].id = i + 1
      state.site_props[payload.list][i].page_num = i + 1
    }
  },
  modifyComponent(state, payload) {
    state.site_props[payload.list][payload.index].component = payload.component
  },
  setSiteProps(state, siteProps) {
    state.site_props = siteProps
  },
  restoreSiteProps(state, payload) {
    state.site_props = JSON.parse(payload.site_props)
  },
  setIsSubdomain(state) {
    state.is_subdomain = true
  },
  setDomain(state, payload) {
    state.domain = payload.domain
  },
  setResumeSection(state, payload) {
    if (
      payload.section_type !== 'info' &&
      payload.section_type !== 'description'
    ) {
      if (payload.prop === 'address') {
        // eslint-disable-next-line prettier/prettier
        state.site_props.resume_page_inputs.education_section[
          payload.id
        ].address['line_' + payload.address_line] = payload.value
      } else if (payload.append) {
        // IF APPENDING TO LIST
        // eslint-disable-next-line prettier/prettier
        state.site_props.resume_page_inputs[payload.section_type + '_section'][
          payload.id
        ][payload.prop][payload.type].push(payload.value)
      } else if (payload.type) {
        // IF MUTATING NESTED VALUE
        if (payload.nested) {
          // IF MUTATING NESTED VALUE IN A NESTED VALUE
          // eslint-disable-next-line prettier/prettier
          state.site_props.resume_page_inputs[
            payload.section_type + '_section'
          ][payload.id][payload.prop][payload.type][payload.type_id][
            payload.type_value
          ] = payload.value
        } else {
          // eslint-disable-next-line prettier/prettier
          state.site_props.resume_page_inputs[
            payload.section_type + '_section'
          ][payload.id][payload.prop][payload.type] = payload.value
        }
      } else {
        // eslint-disable-next-line prettier/prettier
        state.site_props.resume_page_inputs[payload.section_type + '_section'][
          payload.id
        ][payload.prop] = payload.value
      }
    } else if (payload.prop === 'address') {
      // eslint-disable-next-line prettier/prettier
      state.site_props.resume_page_inputs[
        payload.section_type + '_section'
      ].address['line_' + payload.address_line] = payload.value
    } else {
      // eslint-disable-next-line prettier/prettier
      state.site_props.resume_page_inputs[payload.section_type + '_section'][
        payload.prop
      ] = payload.value
    }
  },
  deleteCertificationsCertSection(state, payload) {
    // eslint-disable-next-line prettier/prettier
    state.site_props.resume_page_inputs.certifications_section[
      payload.grade_id
    ].certificate_sections.values.splice(payload.section_id, 1)
  },
  addCertification(state) {
    state.site_props.resume_page_inputs.certifications_section.push({
      id: state.site_props.resume_page_inputs.certifications_section.length,
      name: null,
      overall_grade: {
        in_use: false,
        value: null
      },
      certificate_sections: {
        in_use: false,
        values: []
      },
      date_recieved: '2001-01'
    })
  },
  deleteCertification(state, payload) {
    state.site_props.resume_page_inputs.certifications_section.splice(
      payload.id,
      1
    )
    state.site_props.resume_page_inputs.certifications_section = state.site_props.resume_page_inputs.certifications_section.map(
      function(val, index) {
        val.id = index
        return val
      }
    )
  },
  addInterest(state) {
    state.site_props.resume_page_inputs.interests_section.push({
      id: state.site_props.resume_page_inputs.interests_section.length,
      title: null,
      details: {
        available: false,
        value: null
      }
    })
  },
  deleteInterest(state, payload) {
    state.site_props.resume_page_inputs.interests_section.splice(payload.id, 1)
  },
  addEducation(state) {
    state.site_props.resume_page_inputs.education_section.push({
      id: state.site_props.resume_page_inputs.education_section.length,
      name: null,
      address: {
        line_1: null,
        line_2: null,
        line_3: null,
        line_4: null
      },
      years_attended: {
        from: '2001-01',
        till: null
      }
    })
  },
  deleteEducation(state, payload) {
    state.site_props.resume_page_inputs.education_section.splice(payload.id, 1)
  },
  addExperience(state) {
    state.site_props.resume_page_inputs.experience_section.push({
      id: state.site_props.resume_page_inputs.experience_section.length,
      org_name: null,
      duration: {
        from: '2001-01',
        till: null
      },
      role_name: null,
      role_description: null
    })
  },
  deleteExperience(state, payload) {
    state.site_props.resume_page_inputs.experience_section.splice(payload.id, 1)
  },
  setResumeCreated(state, payload) {
    state.site_props.resume_page_inputs.resume_sections = payload.sections
    state.site_props.resume_page_inputs.resume_created = true
    state.site_props.resume_page_inputs.resume_layout = payload.layout
  },
  setFavicon(state, { favicon }) {
    state.site_props.favicon = favicon
  },
  saveSocialBar(state, payload) {
    state.site_props.social_media_bar = payload.btns
    state.site_props.social_media_bar_urls = payload.urls
  },
  setCallToActionURL(state, payload) {
    /*
    Saves the user input as the call to action page url
    @params:
      value - String - New URL
    */
    state.callToActionURL = payload.value
  },
  addImageToUpload(state, payload) {
    const images = state.images_to_upload.filter((img) => {
      return img.url === payload.img_data.url
    })
    if (images.length === 0) {
      state.images_to_upload.push(payload.img_data)
    }
  },
  addProjectImageToUpload(state, payload) {
    const images = state.project_images_to_upload.filter((img) => {
      return img.url === payload.img_data.url
    })
    if (images.length === 0) {
      state.project_images_to_upload.push(payload.img_data)
    }
  },
  addFileToUpload(state, payload) {
    const files = state.files_to_upload.filter((file) => {
      return file.type === payload.file.type
    })
    if (files.length === 0) {
      state.files_to_upload.push(payload.file)
    }
  },
  removeFilesToUpload(state, payload) {
    const newFilesToUpload = state.files_to_upload.filter((file) => {
      return payload.files_to_remove.includes(file)
    })

    state.files_to_upload = newFilesToUpload
  },
  removeImagesToUpload(state, payload) {
    const newImagesToUpload = state.images_to_upload.filter((img) => {
      return payload.images_to_remove.includes(img)
    })

    state.images_to_upload = newImagesToUpload
  },
  removeProjectImagesToUpload(state, payload) {
    const newImagesToUpload = state.project_images_to_upload.filter((img) => {
      return payload.images_to_remove.includes(img)
    })

    state.project_images_to_upload = newImagesToUpload
  },
  setUserUploads(state, payload) {
    state.user_uploads = payload.uploads
    state.user_storage = payload.storage
  },
  setPageTransition(state, payload) {
    state.site_props.transition = payload.transition
  },
  updateResumeUpload(state, payload) {
    state.site_props.resume_page_inputs.resume_upload = payload.resume_upload
    state.site_props.resume_page_inputs.resume_created = true
  }
}

export const actions = {
  async handleWebsite({ state, commit }, { type }) {
    const { data } = await this.$axios
      .post(`/create/${type}_site`, {
        site_props: JSON.stringify(state.site_props)
      })
      .catch((e) => {
        const error = JSON.parse(JSON.stringify(e))
        return error.response
      })
    this._vm.$emit(
      data.error ? 'showError' : !data.error ? 'showSuccess' : 'showError',
      { message: data.message }
    )
    if (!data.error) {
      const { data } = await this.$axios
        .$get('/uploads/screenshot/grab')
        .catch((e) => {
          const error = JSON.parse(JSON.stringify(e))
          return error.response
        })
      this._vm.$emit(
        data.error ? 'showError' : !data.error ? 'showSuccess' : 'showError',
        { message: data.message }
      )
      commit('resetCreationStep')
      this.$router.push({ path: '/dashboard' })
    }
    return true
  },
  async uploadFiles(context) {
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    for (const image of context.state.images_to_upload) {
      await this.$axios({
        method: 'post',
        url: image.url,
        data: image.upload_form_data,
        config
      }).then(() => {
        context.commit('updatePageImg', image.page_img_props)
      })
    }
    for (const image of context.state.project_images_to_upload) {
      await this.$axios({
        method: 'post',
        url: image.url,
        data: image.upload_form_data,
        config
      }).then(() => {
        context.commit('updateProject', image.page_img_props)
      })
    }
    for (const userFile of context.state.files_to_upload) {
      await this.$axios({
        method: 'post',
        url: userFile.url,
        data: userFile.upload_data,
        config
      }).then(() => {
        if (userFile.type === 'resume_pdf') {
          context.commit('updateResumeUpload', {
            resume_upload: { use: true, url: userFile.url }
          })
        }
      })
    }
  },
  async fetchUserUploads(context, { root }) {
    const { data } = await this.$axios.get('/uploads/').catch((e) => {
      const error = JSON.parse(JSON.stringify(e))
      return error.response
    })
    if (data.error) {
      root.$emit('showError', { message: data.message })
    }
    if (!data.error) {
      context.commit('setUserUploads', {
        uploads: data.uploads,
        storage: data.storage
      })
    }
  }
}

export const getters = {
  getCreationStep: (state) => {
    return state.creation_step
  },
  getNextStepState: (state) => {
    return state.show_next_step
  },
  site_props: (state) => {
    return state.site_props
  },
  getProps: (state) => {
    return state.site_props
  },
  userUploads: (state) => {
    return state.user_uploads
  },
  userStorage: (state) => {
    return state.user_storage
  },
  filesToUpload: (state) => {
    return state.files_to_upload
  },
  imagesToUpload: (state) => {
    return state.images_to_upload
  },
  projectImagesToUpload: (state) => {
    return state.project_images_to_upload
  }
}
