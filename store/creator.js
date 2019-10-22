export const state = () => ({
  creation_step: 0,
  site_props: {
    layout: null,
    navigation: 0,
    navigation_style: '1',
    navigation_color: 'success',
    navigation_text_color: null,
    textify: false,
    site_name: null,
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
    tab_text_color: null,
    text_border_color: false,
    text_border_color_value: '#000000',
    home_page_1_inputs: {},
    home_page_2_inputs: {},
    home_page_3_inputs: {},
    projects_page_1_inputs: {},
    projects_page_2_inputs: {},
    projects_page_3_inputs: {},
    resume_page_1_inputs: {},
    resume_page_2_inputs: {},
    resume_page_3_inputs: {},
    homePages: [],
    projectsPages: [],
    resumePages: []
  },
  is_subdomain: false,
  domain: {
    name: null,
    available: false
  },
  show_next_step: false
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
  setTabTextColor(state, value) {
    state.site_props.tab_text_color = value
  },
  setInputDictValues(state, payload) {
    state.site_props[payload.inputDict] = payload.input_dict_values
  },
  updateInputDictValue(state, payload) {
    state.site_props[payload.inputDict][payload.input_type] =
      payload.input_value
  },
  updateInputArrayValue(state, payload) {
    // eslint-disable-next-line prettier/prettier
    for (const item in state.site_props[payload.inputDict][payload.input_type]) {
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
  addPage(state, tab, page) {
    state.site_props[tab].push(page)
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
    state.site_props = payload.site_props
  },
  setIsSubdomain(state) {
    state.is_subdomain = true
  },
  setDomain(state, payload) {
    state.domain = payload.domain
  }
}

export const actions = {
  registerWebsite(props) {
    // console.log('no json props:', props.state.site_props)
    // console.log('props:', JSON.stringify(props.state.site_props))
    this.$axios
      .$post('/create/register_site', {
        site_props: JSON.stringify(props.state.site_props)
      })
      .then(() => {
        this.$router.push({ path: '/dashboard' })
      })
  },
  updateWebsite(props) {
    this.$axios
      .$post('/create/update_site', {
        site_props: JSON.stringify(props.state.site_props)
      })
      .then(() => {
        this.$router.push({ path: '/dashboard' })
      })
  }
}

export const getters = {
  getCreationStep: (state) => {
    return state.creation_step
  },
  getNextStepState: (state) => {
    return state.show_next_step
  },
  getSiteProp: (state) => {
    return state.site_props.home_page_1_inputs
  },
  getProps: (state) => {
    return state.site_props
  }
}
