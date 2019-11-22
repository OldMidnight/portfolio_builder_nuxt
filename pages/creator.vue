<script>
import { mapMutations, mapActions } from 'vuex'
import LoadableComponent from '@/components/helpers/loadable_component'
export default {
  layout: 'creation_layout',
  components: { LoadableComponent },
  middleware: 'check_site_created',
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || 'Required.'
      },
      layouts: [
        {
          id: 1,
          component_name: 'Layout_Type_1',
          name: 'ORIGINAL',
          img_path: 'Layout_1_img.png'
        },
        {
          id: 2,
          component_name: 'Layout_Type_2',
          name: 'STARK',
          img_path: '#'
        },
        {
          id: 3,
          component_name: 'Layout_Type_3',
          name: 'CLEAR',
          img_path: '#'
        }
      ],
      site_nav: 0,
      nav_types: [
        { id: 0, name: 'Bottom Navigation' },
        { id: 1, name: 'Side Navigation' }
      ],
      validating: false,
      site_name_errors: false,
      activeNav: 'home',
      activeNav_index: 1,
      page_templates: [
        // {id: NUM, type: PAGE NUMBER, component: COMPONENT}
        { id: 1, tab: 'home', type: 1, component: 'home_sections/home_type_1' },
        { id: 2, tab: 'home', type: 1, component: 'home_sections/home_type_2' },
        { id: 3, tab: 'home', type: 2, component: 'home_sections/home_type_3' },
        { id: 4, tab: 'home', type: 2, component: 'home_sections/home_type_4' },
        {
          id: 5,
          tab: 'projects',
          type: 2,
          component: 'projects_sections/projects_type_1'
        },
        {
          id: 6,
          tab: 'projects',
          type: 2,
          component: 'projects_sections/projects_type_2'
        }
      ],
      page_customise_select: [
        { text: 'Select Theme', value: 1 },
        { text: 'Customize...', value: 2 }
      ],
      page_option: null,
      page_theme_options_main: [
        {
          id: 1,
          layout: 1,
          name: 'layout_1_slate',
          title: 'Slate',
          small_desc: 'Cool & Grey.',
          desc:
            'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.'
        },
        {
          id: 2,
          layout: 1,
          name: 'layout_1_fresh',
          title: 'Fresh',
          small_desc: 'Light. Open.',
          desc:
            'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.'
        },
        {
          id: 3,
          layout: 1,
          name: 'layout_1_matrix',
          title: 'Matrix',
          small_desc: 'Blue Pill Or Red Pill?',
          desc:
            'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.'
        }
      ],
      customise_page_option: null,
      customise_page_option_number: null,
      customise_foreground_color: '#FFFFFF',
      customise_background_color: '#FFFFFF',
      current_theme: 1,
      tab_colors: {
        home: '#FFFFFF',
        projects: '#FFFFFF',
        resume: '#FFFFFF'
      },
      show_nav_color_customiser: false,
      page_template_model: null,
      show_page_add_error: false,
      show_page_delete_error: false,
      show_page_add_success: false,
      show_page_delete_success: false,
      current_page_type: 1,
      resume_not_created: false,
      loader: null
    }
  },
  computed: {
    creation_step() {
      return this.$store.state.creator.creation_step
    },
    site_props() {
      return this.$store.state.creator.site_props
    },
    page_theme_options() {
      const options = []
      for (const theme of this.page_theme_options_main) {
        if (theme.id === this.current_theme) {
          options.push(theme)
        }
      }
      return options
    },
    home_pages() {
      const options = []
      for (const page of this.site_props.homePages) {
        if (page.id === this.activeNav_index) {
          options.push(page)
        }
      }
      return options
    },
    projects_pages() {
      const options = []
      for (const page of this.site_props.projectsPages) {
        if (page.id === this.activeNav_index) {
          options.push(page)
        }
      }
      return options
    },
    resume_pages() {
      const options = []
      for (const page of this.site_props.resumePages) {
        if (page.id === this.activeNav_index) {
          options.push(page)
        }
      }
      return options
    },
    nav_title_home: {
      set(title) {
        this.setNavTitle({ tab: 'home', value: title })
      },
      get() {
        return this.site_props.nav_titles.home
      }
    },
    nav_title_projects: {
      set(title) {
        this.setNavTitle({ tab: 'projects', value: title })
      },
      get() {
        return this.site_props.nav_titles.projects
      }
    },
    nav_title_resume: {
      set(title) {
        this.setNavTitle({ tab: 'resume', value: title })
      },
      get() {
        return this.site_props.nav_titles.resume
      }
    },
    site_name: {
      set(name) {
        this.setSiteName(name)
      },
      get() {
        return this.site_props.site_name
      }
    },
    custom_background: {
      set(value) {
        if (value === false) {
          this.setBackgroundValue({ type: 'color', value: '#FFFFFF' })
          this.customise_background_color = '#FFFFFF'
          this.setBackgroundValue({ type: 'img_src', value: null })
          this.setCustomBackground(value)
        } else {
          this.setCustomBackground(value)
        }
      },
      get() {
        return this.site_props.custom_background
      }
    },
    custom_foreground: {
      set(value) {
        if (value === false) {
          this.setForegroundValue({ type: 'color', value: '#FFFFFF' })
          this.customise_foreground_color = '#FFFFFF'
          this.setForegroundValue({ type: 'img_src', value: null })
          this.setCustomForeground(value)
          this.text_border_color = false
        } else {
          this.setCustomForeground(value)
        }
      },
      get() {
        return this.site_props.custom_foreground
      }
    },
    background_img_value: {
      set(value) {
        this.setBackgroundValue({ type: 'img_src', value })
      },
      get() {
        return this.site_props.background.img_src
      }
    },
    foreground_img_value: {
      set(value) {
        this.setForegroundValue({ type: 'img_src', value })
      },
      get() {
        return this.site_props.foreground.img_src
      }
    },
    navigation_style: {
      set(value) {
        this.setNavStyle(value)
      },
      get() {
        return this.site_props.navigation_style
      }
    },
    navigation_color: {
      set(value) {
        this.setNavColor(value)
      },
      get() {
        return this.site_props.navigation_color
      }
    },
    navigation_text_color: {
      set(value) {
        this.setNavTextColor(value)
      },
      get() {
        return this.site_props.navigation_text_color
      }
    },
    tab_text_color: {
      set(value) {
        this.setTabTextColor(value)
      },
      get() {
        return this.site_props.tab_text_color
      }
    },
    textify: {
      set(value) {
        this.setTextify(value)
      },
      get() {
        return this.site_props.textify
      }
    },
    text_border_color: {
      set(value) {
        this.setTextBorderColor(value)
      },
      get() {
        return this.site_props.text_border_color
      }
    },
    text_border_color_value: {
      set(value) {
        this.setTextBorderColorValue(value)
      },
      get() {
        return this.site_props.text_border_color_value
      }
    },
    themeSelected() {
      const vm = this
      return function(id) {
        if (vm.site_props.selected_theme === id) {
          return 'Selected'
        } else {
          return 'Select'
        }
      }
    },
    getThemeColor() {
      const vm = this
      return function(type) {
        if (vm.site_props.selected_theme === 1) {
          return 'info'
        } else if (vm.site_props.selected_theme === 3) {
          if (type === 'next') {
            return 'error'
          } else if (type === 'back') {
            return 'info'
          } else {
            return vm.site_props.navigation_color
          }
        } else {
          return vm.site_props.navigation_color
        }
      }
    },
    currentTabs() {
      return [
        { text: this.nav_title_home, value: 1 },
        { text: this.nav_title_projects, value: 2 }
      ]
    },
    currentPages() {
      const pages = []

      if (this.customise_page_option === 1) {
        for (let i = 0; i < this.site_props.homePages.length; i++) {
          pages.push({ text: 'Page ' + (i + 1), value: i + 1 })
        }
      } else if (this.customise_page_option === 2) {
        for (let i = 0; i < this.site_props.projectsPages.length; i++) {
          pages.push({ text: 'Page ' + (i + 1), value: i + 1 })
        }
      }

      return pages
    },
    pageTemplates() {
      const templates = []
      for (let i = 0; i < this.page_templates.length; i++) {
        if (
          this.activeNav === this.page_templates[i].tab &&
          this.current_page_type === this.page_templates[i].type
        ) {
          templates.push(this.page_templates[i])
        }
      }
      return templates
    },
    check_color_style() {
      if (
        this.site_props.text_border_color &&
        this.site_props.selected_theme === null
      ) {
        return {
          color: this.site_props.text_border_color_value + '!important',
          borderColor: this.site_props.text_border_color_value + '!important'
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    site_nav(type) {
      this.setSiteNav(type)
    },
    customise_background_color(value) {
      document.querySelector(
        '#creation-step-preview'
      ).style.backgroundColor = value
      this.setBackgroundValue({ type: 'color', value })
    },
    customise_foreground_color(value) {
      document.querySelector('.content-body').style.backgroundColor = value
      document.querySelector('.preview-nav-bar').style.backgroundColor = value
      this.setForegroundValue({ type: 'color', value })
    },
    'tab_colors.home'(value) {
      document.querySelector('.nav-home').style.backgroundColor = value
      this.setTabColor({ type: 'home', value })
    },
    'tab_colors.projects'(value) {
      document.querySelector('.nav-projects').style.backgroundColor = value
      this.setTabColor({ type: 'projects', value })
    },
    'tab_colors.resume'(value) {
      document.querySelector('.nav-resume').style.backgroundColor = value
      this.setTabColor({ type: 'resume', value })
    },
    customise_page_option(value) {
      switch (value) {
        case 1:
          this.activeNav = 'home'
          break

        case 2:
          this.activeNav = 'projects'
          break

        case 3:
          this.activeNav = 'resume'
          break

        default:
          break
      }
    },
    customise_page_option_number(value) {
      this.activeNav_index = value
    },
    activeNav_index(value) {
      if (value === 1 && this.activeNav === 'home') {
        this.current_page_type = 1
      } else {
        this.current_page_type = 2
      }
      if (this.customise_page_option_number !== null) {
        this.customise_page_option_number = value
      }
    },
    activeNav(value) {
      if (this.customise_page_option !== null) {
        switch (value) {
          case 'home':
            this.customise_page_option = 1
            this.current_page_type = 1
            break

          case 'projects':
            this.customise_page_option = 2
            this.current_page_type = 2
            break

          case 'resume':
            this.customise_page_option = 3
            this.current_page_type = 2
            break

          default:
            break
        }
      } else {
        switch (value) {
          case 'home':
            this.current_page_type = 1
            break

          case 'projects':
            this.current_page_type = 2
            break

          case 'resume':
            this.current_page_type = 2
            break

          default:
            break
        }
      }
    },
    page_template_model(value) {
      if (value !== undefined) {
        let selectedTemplate
        for (const template of this.page_templates) {
          if (template.id === value) {
            selectedTemplate = template.component
          }
        }
        const currentTemplatesList = this.activeNav + 'Pages'
        this.modifyComponent({
          list: currentTemplatesList,
          index: this.activeNav_index - 1,
          component: selectedTemplate
        })
      }
    },
    loader() {
      const l = this.loader
      this[l] = !this[l]

      this.site_name_errors = false
      if (!this.site_props.site_name) this.site_name_errors = true

      this.$refs.site_name.validate(true)

      if (!this.site_name_errors) {
        this.registerWebsite(this.site_props)
      }
      this.loader = null
    }
  },
  mounted() {
    this.setHomePages([
      // { id: #, component: () => import(COMPONENT_PATH) }
      { id: 1, page_num: 1, component: 'home_sections/home_type_1' },
      { id: 2, page_num: 2, component: 'home_sections/home_type_3' },
      { id: 3, page_num: 3, component: 'home_sections/home_type_4' }
    ])
    let inputDict = 'home_page_1_inputs'
    this.setInputDictValues({
      inputDict,
      input_dict_values: {
        name: 'Your Name Here',
        tagline: 'Insert Your Epic Tagline Here!',
        img_props: {
          url:
            'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60',
          contain: false
        }
      }
    })
    inputDict = 'home_page_2_inputs'
    this.setInputDictValues({
      inputDict,
      input_dict_values: {
        para_1:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis',
        para_2:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis',
        img_props_1: {
          url: '',
          contain: false
        },
        img_props_2: {
          url: '',
          contain: false
        }
      }
    })
    inputDict = 'home_page_3_inputs'
    this.setInputDictValues({
      inputDict,
      input_dict_values: {
        header: 'Text Header Goes Here',
        content:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.'
      }
    })

    this.setProjectsPages([
      // { id: #, component: () => import(COMPONENT_PATH) }
      { id: 1, page_num: 1, component: 'projects_sections/projects_type_1' },
      { id: 2, page_num: 2, component: 'projects_sections/projects_type_2' },
      { id: 3, page_num: 3, component: 'home_sections/home_type_4' }
    ])
    inputDict = 'projects_page_1_inputs'

    this.setInputDictValues({
      inputDict,
      input_dict_values: {
        projects: [
          {
            id: Date.now().toString(),
            title: 'Project Title Here',
            description:
              'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
            img: {
              url:
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1682&q=80',
              contain: false
            },
            link: null
          }
        ]
      }
    })

    inputDict = 'projects_page_2_inputs'

    this.setInputDictValues({
      inputDict,
      input_dict_values: {
        projects: [
          {
            id: Date.now().toString(),
            title: 'Project Title Here',
            description:
              'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
            img: {
              url:
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1682&q=80',
              contain: false
            },
            link: null
          },
          {
            id: Date.now().toString() + '_2',
            title: 'Project Title Here',
            description:
              'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
            img: {
              url:
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1682&q=80',
              contain: false
            },
            link: null
          }
        ]
      }
    })

    this.setResumePages([
      // { id: #, component: () => import(COMPONENT_PATH) }
      { id: 1, page_num: 1, component: 'resume_sections/resume_index' }
    ])

    // SET RESUME NAME AND EMAIL INPUTS
    this.setResumeSection({
      section_type: 'info',
      prop: 'name',
      value:
        this.$store.state.auth.user.f_name +
        ' ' +
        this.$store.state.auth.user.s_name
    })

    this.setResumeSection({
      section_type: 'info',
      prop: 'email',
      value: this.$store.state.auth.user.email
    })
  },
  head() {
    return {
      title: 'Creator - Kreoh.com'
    }
  },
  methods: {
    ...mapMutations({
      setHomePages: 'creator/setHomePages',
      setProjectsPages: 'creator/setProjectsPages',
      setResumePages: 'creator/setResumePages',
      setSiteLayout: 'creator/setSiteLayout',
      showNextStep: 'creator/showNextStep',
      hideNextStep: 'creator/hideNextStep',
      setSiteNav: 'creator/setSiteNav',
      setErrors: 'creator/setErrors',
      setNavTitle: 'creator/setNavTitle',
      setNavStyle: 'creator/setNavStyle',
      setNavColor: 'creator/setNavColor',
      setNavTextColor: 'creator/setNavTextColor',
      setTabTextColor: 'creator/setTabTextColor',
      setTheme: 'creator/setTheme',
      setSiteName: 'creator/setSiteName',
      setCustomBackground: 'creator/setCustomBackground',
      setCustomForeground: 'creator/setCustomForeground',
      setBackgroundValue: 'creator/setBackgroundValue',
      setForegroundValue: 'creator/setForegroundValue',
      setTabColor: 'creator/setTabColor',
      setInputDictValues: 'creator/setInputDictValues',
      setTextify: 'creator/setTextify',
      setTextBorderColor: 'creator/setTextBorderColor',
      setTextBorderColorValue: 'creator/setTextBorderColorValue',
      addPage: 'creator/addPage',
      deleteNavPage: 'creator/deleteNavPage',
      updateInputDictValue: 'creator/updateInputDictValue',
      addInputArrayValue: 'creator/addInputArrayValue',
      updateInputArrayValue: 'creator/updateInputArrayValue',
      clearAllChanges: 'creator/clearAllChanges',
      modifyComponent: 'creator/modifyComponent',
      setSiteProps: 'creator/setSiteProps',
      restoreSiteProps: 'creator/restoreSiteProps',
      setResumeSection: 'creator/setResumeSection'
    }),
    ...mapActions({
      registerWebsite: 'creator/registerWebsite'
    }),
    selectLayout(e, index) {
      if (index === 0) {
        const layoutItemContainer = document.querySelector('.layout-selected')

        if (layoutItemContainer !== e.target.parentElement) {
          // If Clicking a different Layout

          this.setSiteLayout(this.layouts[index].component_name)
        } else {
          this.setSiteLayout(null)
        }

        if (this.site_props.layout !== null) {
          this.showNextStep()
        } else {
          this.hideNextStep()
        }
      }
    },
    changeActiveNav(navName) {
      this.activeNav = navName
      this.activeNav_index = 1
    },
    checkStepCount(step) {
      switch (step) {
        case 0:
          return this.creation_step === step

        case 1:
          // this.setSiteLayout(this.site_props.layout)
          return this.creation_step === step

        default:
          return this.creation_step === step
      }
    },
    changePreviewPage(direction) {
      switch (direction) {
        case 'left':
          if (this.activeNav_index === 1) {
            // eslint-disable-next-line prettier/prettier
            this.activeNav_index = this.site_props[this.activeNav + 'Pages'].length
          } else {
            this.activeNav_index -= 1
          }
          break

        case 'right':
          if (
            this.activeNav_index ===
            this.site_props[this.activeNav + 'Pages'].length
          ) {
            this.activeNav_index = 1
          } else {
            this.activeNav_index += 1
          }
          break

        default:
          break
      }
    },
    nextTheme(direction) {
      switch (direction) {
        case 'right':
          if (this.current_theme === this.page_theme_options_main.length) {
            this.current_theme = 1
          } else {
            this.current_theme += 1
          }
          break

        case 'left':
          if (this.current_theme === 1) {
            this.current_theme = this.page_theme_options_main.length
          } else {
            this.current_theme -= 1
          }
          break

        default:
          break
      }
    },
    selectTheme(id) {
      if (this.site_props.selected_theme === id) {
        this.setTheme(null)
        this.setNavStyle('1')
      } else {
        this.setTheme(id)
        if (this.site_props.selected_theme === 3) {
          this.setNavStyle('2')
        } else {
          this.setNavStyle('1')
        }
      }
      this.hideNextStep()
    },
    reset_color() {
      if (!this.show_nav_color_customiser) {
        this.setNavColor('success')
      }
    },
    sortInputs(e) {
      // ActiveNav = current tab, activeNav_index = tab page
      const inputDict =
        this.activeNav + '_page_' + this.activeNav_index + '_inputs'
      this.setInputDictValues({ inputDict, input_dict_values: e })
    },
    updateInput(e) {
      const inputDict =
        this.activeNav + '_page_' + this.activeNav_index + '_inputs'
      if (e.data_struct && e.data_struct === 'Array') {
        if (e.id) {
          this.updateInputArrayValue({
            inputDict,
            input_type: e.type,
            input_value: e.value,
            update_type: e.update_type,
            id: e.id
          })
        } else {
          this.addInputArrayValue({
            inputDict,
            input_type: e.type,
            input_value: e.value
          })
        }
      } else {
        this.updateInputDictValue({
          inputDict,
          input_type: e.type,
          input_value: e.value
        })
      }
      this.hideNextStep()
    },
    gotoPage() {
      switch (this.customise_page_option) {
        case 1:
          this.activeNav = 'home'
          break

        case 2:
          this.activeNav = 'projects'
          break

        case 3:
          this.activeNav = 'resume'
          break

        default:
          break
      }
      this.activeNav_index = this.customise_page_option_number
    },
    saveChanges() {
      if (this.site_props.resume_page_inputs.resume_created) {
        this.showNextStep()
      } else {
        this.resume_not_created = true
      }
    },
    clearChanges() {
      this.clearAllChanges()
      this.page_option = null
      this.customise_page_option = null
      this.customise_page_option_number = null
      this.customise_foreground_color = '#FFFFFF'
      this.customise_background_color = '#FFFFFF'
      this.current_theme = 1
      this.show_nav_color_customiser = false
      this.page_template_model = null
      this.current_page_type = 1
      this.tab_colors.home = '#FFFFFF'
      this.tab_colors.projects = '#FFFFFF'
      this.tab_colors.resume = '#FFFFFF'
    },
    addPage() {
      switch (this.customise_page_option) {
        case 1:
          if (this.site_props.homePages.length === 3) {
            this.show_page_add_error = true
          } else {
            this.addPage('homePages', {
              id: this.site_props.homePages.length + 1,
              layout: Number(
                this.site_props.layout[this.site_props.layout.length - 1]
              ),
              component: 'home_sections/home_type_3'
            })
            this.activeNav_index = 3
            this.customise_page_option_number = 3
            this.show_page_add_success = true
          }
          break

        case 2:
          if (this.site_props.projectsPages.length === 3) {
            this.show_page_add_error = true
          } else {
            this.addPage('projectsPages', {
              id: this.site_props.projectsPages.length + 1,
              layout: Number(
                this.site_props.layout[this.site_props.layout.length - 1]
              ),
              component: 'home_sections/home_type_3'
            })
            this.activeNav_index = 3
            this.customise_page_option_number = 3
            this.show_page_add_success = true
          }
          break

        case 3:
          if (this.site_props.resumePages.length === 3) {
            this.show_page_add_error = true
          } else {
            this.addPage('resumePages', {
              id: this.site_props.resumePages.length + 1,
              layout: Number(
                this.site_props.layout[this.site_props.layout.length - 1]
              ),
              component: 'home_sections/home_type_4'
            })
            this.activeNav_index = 3
            this.customise_page_option_number = 3
            this.show_page_add_success = true
          }
          break

        default:
          break
      }
    },
    deletePage() {
      if (this.activeNav_index !== 1) {
        this.deleteNavPage({
          list: this.activeNav + 'Pages',
          index: this.activeNav_index - 1
        })
        this.customise_page_option_number = 1
        this.show_page_delete_success = true
      } else {
        this.show_page_delete_error = true
      }
    }
  }
}
</script>

<template>
  <div
    class="creation-step-layout"
    :class="{ 'extra-padding-site-name': checkStepCount(2) }"
  >
    <transition
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
      mode="out-in"
    >
      <v-flex v-if="checkStepCount(0)" key="0" class="creation-step">
        <v-flex xs12 class="creation-step-header">
          <div>Select a layout!</div>
        </v-flex>

        <v-layout row wrap class="creation-step-content">
          <v-flex
            v-for="(layout, index) in layouts"
            :id="'layout-' + index"
            :key="index"
            xs4
            :class="{
              'layout-item-container': layout.id === 1,
              'layout-selected': site_props.layout === layout.component_name,
              'layout-disabled': layout.id !== 1
            }"
            @click="selectLayout($event, index)"
          >
            <div
              class="d-flex flex-column justify-center pa-3"
              :class="{
                'layout-item': layout.id === 1,
                'layout-item-disabled': layout.id !== 1,
                'layout-selected-2': site_props.layout === layout.component_name
              }"
            >
              <img
                :alt="'Layout Image: ' + layout.name"
                :src="'/layout_images/' + layout.img_path"
              />
            </div>
            <p class="text-center font-weight-light">{{ layout.name }}</p>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-layout
        v-else-if="checkStepCount(1)"
        key="1"
        class="creation-step preview-edit"
      >
        <v-flex class="preview-edit-window creation-step-edit-options">
          <div class="title">Customize Your Website</div>

          <v-row align="center" class="edit_options_panels">
            <v-expansion-panels focusable>
              <!-- NAVIGATION TAB -->

              <v-expansion-panel>
                <v-expansion-panel-header>Navigation</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-flex>
                    <v-radio-group v-model="site_nav" @change="hideNextStep()">
                      <v-radio
                        v-for="nav in nav_types"
                        :key="nav.id"
                        :label="nav.name"
                        :value="nav.id"
                      >
                      </v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-item-group
                    v-model="navigation_style"
                    value="1"
                    mandatory
                    @change="hideNextStep()"
                  >
                    <p>Navigation Style</p>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-item v-slot:default="{ active, toggle }" value="1">
                            <v-card
                              class="d-flex align-center flex-column"
                              height="100"
                              @click="toggle"
                            >
                              <v-icon class="align-self-end">{{
                                active ? 'mdi-check' : 'mdi-plus'
                              }}</v-icon>

                              <v-btn
                                :icon="site_props.textify"
                                color="info ml-1"
                                fab
                              >
                                <v-icon class="x2">mdi-chevron-right</v-icon>
                              </v-btn>
                            </v-card>
                          </v-item>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-item v-slot:default="{ active, toggle }" value="2">
                            <v-card
                              class="d-flex align-center flex-column"
                              height="100"
                              @click="toggle"
                            >
                              <v-icon class="align-self-end">{{
                                active ? 'mdi-check' : 'mdi-plus'
                              }}</v-icon>

                              <v-btn
                                color="info ml-1"
                                class="mt-2"
                                :outlined="!site_props.textify"
                                :text="site_props.textify"
                              >
                                Next
                              </v-btn>
                            </v-card>
                          </v-item>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-item v-slot:default="{ active, toggle }" value="3">
                            <v-card
                              class="d-flex align-center flex-column"
                              height="100"
                              @click="toggle"
                            >
                              <v-icon class="align-self-end">{{
                                active ? 'mdi-check' : 'mdi-plus'
                              }}</v-icon>

                              <v-btn
                                color="info ml-1"
                                class="mt-2"
                                :rounded="!site_props.textify"
                                :text="site_props.textify"
                              >
                                Next
                              </v-btn>
                            </v-card>
                          </v-item>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-item-group>
                  <v-switch
                    v-model="textify"
                    label="Textify Navigation"
                    inset
                    @change="hideNextStep()"
                  ></v-switch>
                  <v-switch
                    v-model="show_nav_color_customiser"
                    label="Customise Colors"
                    :disabled="site_props.selected_theme !== null"
                    hint="Disable theme to change colors"
                    :persistent-hint="site_props.selected_theme !== null"
                    inset
                    @change="hideNextStep()"
                    @click.native="reset_color()"
                  >
                  </v-switch>
                  <v-card
                    v-if="show_nav_color_customiser"
                    class="d-flex flex-column pa-3"
                  >
                    <p class="align-self-center">Colors</p>
                    <v-color-picker
                      v-model="navigation_color"
                      mode="hex"
                      hide-inputs
                      class="preview-color-pick"
                      @input="hideNextStep()"
                    >
                    </v-color-picker>
                    <v-flex class="mt-3">
                      <p>Text Color</p>
                      <v-radio-group
                        v-model="navigation_text_color"
                        @change="hideNextStep()"
                      >
                        <v-radio label="White" value="white"></v-radio>
                        <v-radio label="Black" value="black"></v-radio>
                        <v-radio label="Custom" value="custom"></v-radio>
                      </v-radio-group>
                    </v-flex>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- TABS CUSTOMISATIONS -->

              <v-expansion-panel>
                <v-expansion-panel-header>Tabs</v-expansion-panel-header>
                <v-expansion-panel-content class="nav_titles_container">
                  <v-flex pt-3>
                    <p
                      v-show="site_props.selected_theme !== null"
                      style="font-size: 12px; color: #b6b6b6; width: 100%; text-align: center;"
                    >
                      Disable theme to change colors
                    </p>

                    <v-card class="d-flex flex-column pa-3 my-4" elevation="2">
                      <p class="align-self-center">Home Tab</p>
                      <v-text-field
                        v-model="nav_title_home"
                        :rules="[
                          () =>
                            (!!nav_title_home && nav_title_home.length >= 2) ||
                            'Min 2 characters',
                          () =>
                            (!!nav_title_home && nav_title_home.length <= 12) ||
                            'Max 12 characters'
                        ]"
                        label="Change Text"
                        outlined
                        @change="hideNextStep()"
                      >
                      </v-text-field>
                      <p class="align-self-center">Tab Color</p>
                      <v-color-picker
                        v-model="tab_colors.home"
                        :disabled="site_props.selected_theme !== null"
                        mode="hex"
                        hide-inputs
                        class="preview-color-pick"
                        @input="hideNextStep()"
                      >
                      </v-color-picker>
                      <v-flex class="mt-3">
                        <p>Text Color</p>
                        <v-radio-group
                          v-model="tab_text_color"
                          :disabled="site_props.text_border_color"
                          @change="hideNextStep()"
                        >
                          <v-radio label="White" value="white"></v-radio>
                          <v-radio label="Black" value="black"></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-card>

                    <v-card class="d-flex flex-column pa-3 my-4" elevation="2">
                      <p class="align-self-center">Projects Tab</p>
                      <v-text-field
                        v-model="nav_title_projects"
                        :rules="[
                          () =>
                            (!!nav_title_projects &&
                              nav_title_projects.length >= 2) ||
                            'Min 2 characters',
                          () =>
                            (!!nav_title_projects &&
                              nav_title_projects.length <= 12) ||
                            'Max 12 characters'
                        ]"
                        label="Change Text"
                        outlined
                        @change="hideNextStep()"
                      >
                      </v-text-field>
                      <p class="align-self-center">Tab Color</p>
                      <v-color-picker
                        v-model="tab_colors.projects"
                        :disabled="site_props.selected_theme !== null"
                        mode="hex"
                        hide-inputs
                        class="preview-color-pick"
                        @input="hideNextStep()"
                      >
                      </v-color-picker>
                      <v-flex class="mt-3">
                        <p>Text Color</p>
                        <v-radio-group
                          v-model="tab_text_color"
                          :disabled="site_props.text_border_color"
                          @change="hideNextStep()"
                        >
                          <v-radio label="White" value="white"></v-radio>
                          <v-radio label="Black" value="black"></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-card>

                    <v-card class="d-flex flex-column pa-3 my-4" elevation="2">
                      <p class="align-self-center">Resume Tab</p>
                      <v-text-field
                        v-model="nav_title_resume"
                        :rules="[
                          () =>
                            (!!nav_title_resume &&
                              nav_title_resume.length >= 2) ||
                            'Min 2 characters',
                          () =>
                            (!!nav_title_resume &&
                              nav_title_resume.length <= 12) ||
                            'Max 12 characters'
                        ]"
                        label="Change Text"
                        outlined
                        @change="hideNextStep()"
                      >
                      </v-text-field>
                      <p class="align-self-center">Tab Color</p>
                      <v-color-picker
                        v-model="tab_colors.resume"
                        :disabled="site_props.selected_theme !== null"
                        mode="hex"
                        hide-inputs
                        class="preview-color-pick"
                        @input="hideNextStep()"
                      >
                      </v-color-picker>
                      <v-flex class="mt-3">
                        <p>Text Color</p>
                        <v-radio-group
                          v-model="tab_text_color"
                          :disabled="site_props.text_border_color"
                          @change="hideNextStep()"
                        >
                          <v-radio label="White" value="white"></v-radio>
                          <v-radio label="Black" value="black"></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-card>
                  </v-flex>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- PAGES TAB -->

              <v-expansion-panel>
                <v-expansion-panel-header>Pages</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-flex class="pt-3">
                    <v-select
                      v-model="page_option"
                      :items="page_customise_select"
                      label="Select option..."
                      solo
                      @change="hideNextStep()"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex v-if="page_option === 1">
                    <transition
                      name="preview-page"
                      enter-active-class="animated fadeIn faster"
                      leave-active-class="animated fadeOut faster"
                      mode="out-in"
                    >
                      <v-card
                        v-for="theme in page_theme_options"
                        :key="theme.id"
                        class="mx-auto"
                        min-height="380"
                      >
                        <v-img class="black--text" height="200px" src="#">
                          <v-card-title class="align-end fill-height">{{
                            theme.title
                          }}</v-card-title>
                        </v-img>
                        <v-card-text>
                          <span>{{ theme.small_desc }}</span
                          ><br />
                          <span class="text--primary">
                            <span>{{ theme.desc }}</span
                            ><br />
                          </span>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="success" @click="selectTheme(theme.id)">
                            <v-icon
                              v-if="theme.id === site_props.selected_theme"
                              left
                              >mdi-pencil</v-icon
                            >
                            {{ themeSelected(theme.id) }}
                          </v-btn>
                          <v-btn text color="orange" @click="nextTheme('right')"
                            >Next</v-btn
                          >
                          <v-btn text color="orange" @click="nextTheme('left')"
                            >Previous</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </transition>
                  </v-flex>
                  <v-flex v-if="page_option === 2">
                    <v-switch
                      v-model="custom_background"
                      :disabled="site_props.selected_theme !== null"
                      label="Site Background"
                      inset
                      @change="hideNextStep()"
                    ></v-switch>

                    <v-flex
                      v-if="custom_background"
                      class="d-flex flex-column align-center justify-center"
                    >
                      <p>Select Color</p>
                      <v-color-picker
                        v-model="customise_background_color"
                        hide-inputs
                        mode="hex"
                        show-swatches
                        class="preview-color-pick"
                        @change="hideNextStep()"
                      ></v-color-picker>
                    </v-flex>

                    <v-switch
                      v-model="custom_foreground"
                      :disabled="site_props.selected_theme !== null"
                      label="Site Foreground"
                      inset
                      @change="hideNextStep()"
                    ></v-switch>

                    <v-flex
                      v-if="custom_foreground"
                      class="d-flex flex-column align-center justify-center"
                    >
                      <p>Select Color</p>
                      <v-color-picker
                        v-model="customise_foreground_color"
                        hide-inputs
                        mode="hex"
                        show-swatches
                        class="preview-color-pick"
                        @change="hideNextStep()"
                      ></v-color-picker>
                    </v-flex>
                    <v-flex v-if="custom_foreground">
                      <!-- <p>Text and border colors</p> -->
                      <v-switch
                        v-model="text_border_color"
                        :disabled="site_props.selected_theme !== null"
                        label="Text and border colors"
                        inset
                        @change="hideNextStep()"
                      ></v-switch>
                      <v-flex
                        v-if="text_border_color"
                        class="d-flex flex-column align-center justify-center"
                      >
                        <p>Select Color</p>
                        <v-color-picker
                          v-model="text_border_color_value"
                          hide-inputs
                          mode="hex"
                          show-swatches
                          class="preview-color-pick"
                          @change="hideNextStep()"
                        ></v-color-picker>
                      </v-flex>
                    </v-flex>
                  </v-flex>
                  <v-flex class="mt-3">
                    <p>Pages</p>
                    <v-select
                      v-model="customise_page_option"
                      :items="currentTabs"
                      label="Select Tab..."
                      solo
                    >
                    </v-select>

                    <v-select
                      v-if="customise_page_option !== null"
                      v-model="customise_page_option_number"
                      :items="currentPages"
                      label="Select Page..."
                      solo
                      @change="gotoPage()"
                    ></v-select>
                    <v-sheet
                      v-if="customise_page_option_number !== null"
                      class="mx-auto"
                      elevation="8"
                      max-width="800"
                    >
                      <v-slide-group
                        v-model="page_template_model"
                        class="pa-4"
                        show-arrows
                        @change="hideNextStep()"
                      >
                        <v-slide-item
                          v-for="template in pageTemplates"
                          :key="template.id"
                          v-slot:default="{ active, toggle }"
                          :value="template.id"
                        >
                          <v-card
                            class="ma-4 d-flex flex-column"
                            width="270"
                            height="300"
                            @click="toggle"
                          >
                            <v-btn
                              style="height: 10%;"
                              icon
                              :color="active ? 'info' : ''"
                              class="align-self-end"
                            >
                              <v-icon size="26">{{
                                active ? 'mdi-check' : 'mdi-plus'
                              }}</v-icon>
                            </v-btn>
                            <client-only placeholder="loading">
                              <LoadableComponent
                                :component-name="template.component"
                                :options="{
                                  input_dict_name:
                                    activeNav +
                                    '_page_' +
                                    activeNav_index +
                                    '_inputs',
                                  show_theme: false,
                                  preview: true,
                                  height: 100,
                                  width: 100
                                }"
                              ></LoadableComponent>
                            </client-only>
                          </v-card>
                        </v-slide-item>
                      </v-slide-group>

                      <v-flex class="d-flex justify-center align-center">
                        <v-btn
                          color="error"
                          class="mr-2"
                          :disabled="activeNav === 'resume'"
                          @click="deletePage()"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-btn
                          color="success"
                          class="ml-2"
                          :disabled="activeNav === 'resume'"
                          @click="addPage()"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-sheet>
                  </v-flex>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
          <v-flex
            class="save-btn-container d-flex justify-center align-center mt-3"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  large=""
                  rounded
                  color="success"
                  class="mr-3"
                  v-on="on"
                  @click="saveChanges()"
                >
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Save Changes</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  large
                  rounded
                  color="error"
                  class="ml-3"
                  v-on="on"
                  @click="clearChanges()"
                >
                  <v-icon>mdi-delete-forever</v-icon>
                </v-btn>
              </template>
              <span>Delete All Changes</span>
            </v-tooltip>
          </v-flex>
        </v-flex>

        <v-layout
          id="creation-step-preview"
          align-center
          class="preview-edit-window creation-step-preview"
          :class="{
            'slate-light': site_props.selected_theme === 1,
            matrix: site_props.selected_theme === 3
          }"
          column
        >
          <v-system-bar window dark class="preview-window-bar">
            <v-icon>mdi-google-chrome</v-icon>
            <div class="flex-grow-1"></div>
            <v-icon>mdi-minus</v-icon>
            <v-icon>mdi-checkbox-blank-outline</v-icon>
            <v-icon>mdi-close</v-icon>
          </v-system-bar>
          <!-- <v-flex class="preview-username-container">Your Name Here</v-flex> -->
          <v-layout align-center class="preview-page-wrapper">
            <v-btn
              v-if="site_props.navigation === 1"
              :icon="site_props.textify && site_props.navigation_style === '1'"
              :text="site_props.textify"
              :color="getThemeColor('back')"
              :outlined="site_props.navigation_style === '2'"
              :rounded="site_props.navigation_style === '3'"
              :fab="site_props.navigation_style === '1'"
              class="preview-sidenav-btn-left"
              @click="changePreviewPage('left')"
            >
              <v-icon
                v-if="site_props.navigation_style === '1'"
                :color="site_props.navigation_text_color"
                class="x2"
                >mdi-chevron-left</v-icon
              >
              <p
                v-else
                :class="{
                  'dark-nav-text': site_props.navigation_text_color === 'black',
                  'white-nav-text': site_props.navigation_text_color === 'white'
                }"
                class="ma-0"
              >
                Back
              </p>
            </v-btn>

            <!-- PREVIEW CONTAINER -->

            <v-layout
              v-if="site_props.layout === layouts[0].component_name"
              column
              class="preview-1-page-container"
              :style="check_color_style"
              :class="{
                'preview-extra-width': site_props.navigation === 2,
                'has-border':
                  site_props.text_border_color &&
                  site_props.selected_theme === null
              }"
            >
              <v-flex
                class="preview-1-top-nav preview-nav-bar"
                :class="{ 'matrix-card-opp': site_props.selected_theme === 3 }"
              >
                <!-- NAV ITEMS -->
                <v-flex
                  class="preview-1-top-nav-item nav-home d-flex justify-center"
                  :style="check_color_style"
                  :class="{
                    active:
                      (activeNav === 'home' && !site_props.text_border_color) ||
                      site_props.selected_theme !== null,
                    customActive:
                      activeNav === 'home' &&
                      site_props.text_border_color &&
                      site_props.selected_theme === null,
                    'nav-1-item-slate': site_props.selected_theme === 1,
                    'nav-1-item-matrix': site_props.selected_theme === 3,
                    'dark-nav-text': site_props.tab_text_color === 'black',
                    'white-nav-text': site_props.tab_text_color === 'white'
                  }"
                  @click="changeActiveNav('home')"
                >
                  <p class="align-self-center ma-0">
                    {{ site_props.nav_titles.home }}
                  </p>
                </v-flex>

                <v-flex
                  class="preview-1-top-nav-item nav-projects d-flex justify-center"
                  :style="check_color_style"
                  :class="{
                    active:
                      activeNav === 'projects' && !site_props.text_border_color,
                    customActive:
                      activeNav === 'projects' &&
                      site_props.text_border_color &&
                      site_props.selected_theme === null,
                    'nav-1-item-slate': site_props.selected_theme === 1,
                    'nav-1-item-matrix': site_props.selected_theme === 3,
                    'dark-nav-text': site_props.tab_text_color === 'black',
                    'white-nav-text': site_props.tab_text_color === 'white'
                  }"
                  @click="changeActiveNav('projects')"
                >
                  <p class="align-self-center ma-0">
                    {{ site_props.nav_titles.projects }}
                  </p>
                </v-flex>

                <v-flex
                  class="preview-1-top-nav-item nav-resume d-flex justify-center"
                  :style="check_color_style"
                  :class="{
                    active:
                      activeNav === 'resume' && !site_props.text_border_color,
                    customActive:
                      activeNav === 'resume' &&
                      site_props.text_border_color &&
                      site_props.selected_theme === null,
                    'nav-1-item-slate': site_props.selected_theme === 1,
                    'nav-1-item-matrix': site_props.selected_theme === 3,
                    'dark-nav-text': site_props.tab_text_color === 'black',
                    'white-nav-text': site_props.tab_text_color === 'white'
                  }"
                  @click="changeActiveNav('resume')"
                >
                  <p class="align-self-center ma-0">
                    {{ site_props.nav_titles.resume }}
                  </p>
                </v-flex>
              </v-flex>
              <v-flex
                class="preview-1-content-body content-body"
                :class="{
                  slate: site_props.selected_theme === 1,
                  'matrix-card': site_props.selected_theme === 3
                }"
              >
                <v-flex
                  v-if="activeNav === 'home'"
                  class="preview-1-content preview-1-home-content"
                  :class="{
                    slate: site_props.selected_theme === 1,
                    matrix: site_props.selected_theme === 3
                  }"
                >
                  <transition
                    name="preview-page"
                    enter-active-class="animated fadeIn faster"
                    leave-active-class="animated fadeOut faster"
                    mode="out-in"
                  >
                    <v-flex
                      v-for="preview_page in home_pages"
                      :key="preview_page.id"
                      class="preview-1-page"
                      :class="{
                        slate: site_props.selected_theme === 1,
                        matrix: site_props.selected_theme === 3
                      }"
                    >
                      <LoadableComponent
                        :component-name="preview_page.component"
                        :options="{
                          input_dict_name:
                            activeNav + '_page_' + activeNav_index + '_inputs',
                          preview: false,
                          height: '150',
                          width: '150'
                        }"
                        @update="updateInput($event)"
                      ></LoadableComponent>
                    </v-flex>
                  </transition>
                </v-flex>
                <v-flex
                  v-if="activeNav === 'projects'"
                  class="preview-1-content preview-1-projects-content"
                  :class="{
                    slate: site_props.selected_theme === 1,
                    matrix: site_props.selected_theme === 3
                  }"
                >
                  <transition
                    name="preview-page"
                    enter-active-class="animated fadeIn faster"
                    leave-active-class="animated fadeOut faster"
                    mode="out-in"
                  >
                    <v-flex
                      v-for="preview_page in projects_pages"
                      :key="preview_page.id"
                      class="preview-1-page"
                      :class="{
                        slate: site_props.selected_theme === 1,
                        matrix: site_props.selected_theme === 3
                      }"
                    >
                      <LoadableComponent
                        :component-name="preview_page.component"
                        :options="{
                          input_dict_name:
                            activeNav + '_page_' + activeNav_index + '_inputs',
                          preview: false,
                          height: '150',
                          width: '150'
                        }"
                        @update="updateInput($event)"
                      ></LoadableComponent>
                    </v-flex>
                  </transition>
                </v-flex>
                <v-flex
                  v-if="activeNav === 'resume'"
                  class="preview-1-content preview-1-resume-content"
                  :class="{
                    slate: site_props.selected_theme === 1,
                    matrix: site_props.selected_theme === 3
                  }"
                >
                  <transition
                    name="preview-page"
                    enter-active-class="animated fadeIn faster"
                    leave-active-class="animated fadeOut faster"
                    mode="out-in"
                  >
                    <v-flex
                      v-for="preview_page in resume_pages"
                      :key="preview_page.id"
                      class="preview-1-page"
                      :class="{
                        slate: site_props.selected_theme === 1,
                        matrix: site_props.selected_theme === 3
                      }"
                    >
                      <LoadableComponent
                        :component-name="preview_page.component"
                        :options="{
                          input_dict_name:
                            activeNav + '_page_' + activeNav_index + '_inputs',
                          preview: false,
                          height: '150',
                          width: '150'
                        }"
                        @update="updateInput($event)"
                      ></LoadableComponent>
                    </v-flex>
                  </transition>
                </v-flex>
              </v-flex>
            </v-layout>

            <v-layout
              v-if="site_props.layout === layouts[1].component_name"
              class="preview-2-page-container"
            >
              <v-layout column class="preview-2-sidenav">
                <v-flex
                  v-for="page in mandatory_page_options"
                  :key="page.id"
                  class="preview-2-sidenav-item sidenav-item"
                ></v-flex>
                <v-flex
                  class="preview-2-sidenav-custom-btn sidenav-item"
                ></v-flex>
              </v-layout>
              <v-flex class="preview-2-content-body"></v-flex>
            </v-layout>

            <v-layout
              v-if="site_props.layout === layouts[2].component_name"
              column
              align-center
              :class="{
                'preview-3-page-container': site_props.navigation === 0,
                'preview-3-page-container-sidenav': site_props.navigation === 1
              }"
            >
              <v-layout class="preview-3-content-body"></v-layout>
              <v-layout class="preview-3-bottom-nav">
                <v-flex
                  v-for="page in mandatory_page_options"
                  :key="page.id"
                  class="preview-3-bottom-nav-item"
                  :class="{
                    'round-corner-bottom-right':
                      page.id === mandatory_page_options.length,
                    'round-corner-bottom-left': page.id === 1
                  }"
                ></v-flex>
              </v-layout>
            </v-layout>

            <v-btn
              v-if="site_props.navigation === 1"
              :icon="site_props.textify && site_props.navigation_style === '1'"
              :text="site_props.textify"
              :color="getThemeColor('next')"
              :outlined="site_props.navigation_style === '2'"
              :rounded="site_props.navigation_style === '3'"
              :fab="site_props.navigation_style === '1'"
              class="preview-sidenav-btn-right"
              @click="changePreviewPage('right')"
            >
              <v-icon
                v-if="site_props.navigation_style === '1'"
                :color="site_props.navigation_text_color"
                class="x2"
                >mdi-chevron-right</v-icon
              >
              <p
                v-else
                :class="{
                  'dark-nav-text': site_props.navigation_text_color === 'black',
                  'white-nav-text': site_props.navigation_text_color === 'white'
                }"
                class="ma-0"
              >
                Next
              </p>
            </v-btn>
          </v-layout>

          <v-layout
            v-if="site_props.navigation === 0"
            class="preview-bottom-nav-arrows"
          >
            <v-flex>
              <v-btn
                v-if="site_props.navigation === 0"
                :icon="
                  site_props.textify && site_props.navigation_style === '1'
                "
                :text="site_props.textify"
                :color="getThemeColor('back')"
                :outlined="site_props.navigation_style === '2'"
                :rounded="site_props.navigation_style === '3'"
                :fab="site_props.navigation_style === '1'"
                class="preview-bottom-nav-btn-left"
                @click="changePreviewPage('left')"
              >
                <v-icon
                  v-if="site_props.navigation_style === '1'"
                  :color="site_props.navigation_text_color"
                  class="x2"
                  >mdi-chevron-left</v-icon
                >
                <p
                  v-else
                  :class="{
                    'dark-nav-text':
                      site_props.navigation_text_color === 'black',
                    'white-nav-text':
                      site_props.navigation_text_color === 'white'
                  }"
                  class="ma-0"
                >
                  Back
                </p>
              </v-btn>
            </v-flex>
            <v-flex class="d-flex justify-end">
              <v-btn
                v-if="site_props.navigation === 0"
                :icon="
                  site_props.textify && site_props.navigation_style === '1'
                "
                :text="site_props.textify"
                :color="getThemeColor('next')"
                :outlined="site_props.navigation_style === '2'"
                :rounded="site_props.navigation_style === '3'"
                :fab="site_props.navigation_style === '1'"
                class="preview-bottom-nav-btn-right"
                @click="changePreviewPage('right')"
              >
                <v-icon
                  v-if="site_props.navigation_style === '1'"
                  :color="site_props.navigation_text_color"
                  class="x2"
                  >mdi-chevron-right</v-icon
                >
                <p
                  v-else
                  :class="{
                    'dark-nav-text':
                      site_props.navigation_text_color === 'black' &&
                      site_props.selected_theme === null,
                    'white-nav-text':
                      site_props.navigation_text_color === 'white' &&
                      site_props.selected_theme === null
                  }"
                  class="ma-0"
                >
                  Next
                </p>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-layout>

      <v-layout
        v-else-if="checkStepCount(2)"
        key="2"
        class="creation-step justify-center creation-site-name-wrapper"
        align-center
      >
        <div class="creation-name pa-5 elevation-2">
          <v-flex class="">
            <div class="title-2">Your Site Name</div>
            <div class="subtitle-2">Your site in your browser tabs</div>
          </v-flex>

          <v-flex class="">
            <v-text-field
              ref="site_name"
              v-model="site_name"
              label="Name"
              outlined
              placeholder="John Doe: My Site"
              :rules="[
                rules.required,
                () =>
                  (!!site_props.site_name &&
                    site_props.site_name.length <= 20) ||
                  'Max 20 characters'
              ]"
              outline
            >
            </v-text-field>
            <v-btn
              :loading="validating"
              :disabled="validating"
              color="info"
              @click="loader = 'validating'"
            >
              Submit
            </v-btn>
          </v-flex>
        </div>
      </v-layout>
    </transition>
    <v-snackbar v-model="show_page_add_error" left color="error">
      No more pages can be added!
      <v-btn icon @click="show_page_add_error = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-snackbar v-model="show_page_delete_error" color="error" left>
      Page could not be deleted!
      <v-btn icon @click="show_page_delete_error = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-snackbar v-model="show_page_delete_success" color="success" left>
      Page deleted!
      <v-btn icon @click="show_page_delete_success = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-snackbar v-model="show_page_add_success" color="success" left>
      Added new page!
      <v-btn icon @click="show_page_add_success = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="resume_not_created" color="warning">
      Make sure to create your resume on the resume tab before saving!
      <v-btn icon @click="resume_not_created = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<style lang="scss" scoped>
// @import '~animate.css/animate.min.css';

.creation-name {
  border-radius: 20px;
  text-align: center;
}

.creation-step-header {
  height: 20%;
  border-bottom: 3px solid #b3b3b3;
  margin-left: 20% !important;
  margin-right: 20% !important;
  div {
    font-size: 40px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.creation-step-content {
  height: 70%;
  flex-direction: row;
  align-items: center;
}

.creation-step-layout {
  min-height: 80%;
  max-height: 80%;
  width: 80%;
}

.creation-step {
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.layout-item-container {
  height: 80%;
  padding: 30px 20px 30px 20px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  p {
    height: 10%;
    margin: 0;
    margin-top: 5px;
  }
}

.layout-item-container:hover {
  padding: initial !important;
}

.layout-item {
  height: 100%;
  border: 1px solid #e3f2fd;
  background-color: #e3f2fd;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  img {
    width: 100%;
  }
}

.layout-item-disabled {
  height: 100%;
  border: 1px solid #777;
  background-color: #777;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.layout-disabled {
  height: 80%;
  padding: 30px 20px 30px 20px !important;
  cursor: not-allowed;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  p {
    height: 10%;
    margin: 0;
    margin-top: 5px;
  }
}

.layout-selected {
  padding: initial !important;
}

.layout-selected-2 {
  border: 2px solid #0066ff;
  box-shadow: 0 3px 6px rgba(0, 0, 255, 0.16), 0 3px 6px rgba(0, 0, 255, 0.23);
}

.preview-edit {
  flex-direction: row;
  width: 100%;
  position: relative;
}

.preview-edit-window {
  width: 50%;
  height: 100%;
  position: absolute;
  // padding-left: 10px !important;
}

.creation-step-edit-options {
  width: 40%;
  // margin-right: 4px;
  overflow-y: scroll;
}

.creation-step-preview {
  width: 60%;
  left: 45%;
  border-left: 1px solid #b6b6b6;
  border-right: 1px solid #b6b6b6;
  border-bottom: 1px solid #b6b6b6;
  border-radius: 5px;
}

.preview-page-wrapper {
  height: 80%;
  width: 90%;
  margin-bottom: 5%;
  margin-top: 0px !important;
  // background-color: #fafafa;
}

.preview-1-page-container {
  margin: 0px !important;
  margin-top: 5% !important;
  width: 90%;
  height: 90%;
  margin-bottom: 5% !important;
  // border: 1px solid;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.preview-username-container {
  height: 10%;
  width: 80%;
  // margin-top: 5%;
  font-size: 20px;
  border-bottom: 1px solid #e6e6e6;
}

.preview-bottom-nav-arrows {
  height: 10%;
  margin: 0 !important;
  // border: 1px solid;
}

.preview-1-top-nav {
  display: flex;
  padding: 0 !important;
  width: 100%;
  height: 15%;
  background-color: white;
  // border-bottom: 1px solid #b6b6b6;
}

.preview-1-content-body {
  width: 100%;
  height: 85%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: white;
}

.preview-1-top-nav-item {
  border-bottom-color: green;
  height: 100%;
  margin: 0;
  // border-left: 1px solid;
}

.preview-1-top-nav-item.active {
  border-bottom-width: 3px;
  border-bottom-style: solid;
}

.preview-1-top-nav-item.customActive {
  border-bottom-width: 3px;
  border-bottom-style: solid;
}

.preview-1-top-nav-item:hover {
  transition: 0.2s;
  // box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-bottom-width: 3px;
  border-bottom-style: solid;
}

.preview-2-page-container {
  margin-top: 5% !important;
  width: 70%;
  height: 90%;
  margin-bottom: 5% !important;
  // border: 1px solid;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.preview-2-sidenav {
  width: 15%;
  height: 100%;
  margin: 0 !important;
  border-right: 1px solid;
}

.preview-2-content-body {
  width: 85%;
  height: 100%;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.preview-3-page-container {
  width: 75%;
  height: 100%;
  margin: 0 !important;
  margin-top: 3% !important;
  margin-bottom: 5% !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.preview-3-page-container-sidenav {
  width: 75%;
  height: 90%;
  margin: 0 !important;
  margin-top: 5% !important;
  // margin-bottom: 15% !important;
}

.preview-3-content-body {
  width: 100%;
  height: 90%;
  border: 1px solid;
  border-radius: 20px;
  margin: 0 !important;
}

.preview-3-bottom-nav {
  width: 60%;
  height: 10%;
  border: 1px solid;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  margin: 0 !important;
}

.round-corner-left {
  border-top-left-radius: 20px;
}

.round-corner-right {
  border-top-right-radius: 20px;
}

.round-corner-bottom-left {
  border-bottom-left-radius: 15px;
}

.round-corner-bottom-right {
  border-bottom-right-radius: 15px;
}

.preview-sidenav-btn-left {
  margin-right: 5%;
}

.preview-sidenav-btn-right {
  margin-left: 5%;
}

.title {
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3%;
}

.subtitle {
  font-size: 20px;
}

.preview-customize-option-group {
  border-top-left-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 80%;
  margin-top: 5%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.title-2 {
  font-size: 30px;
  margin: 10px;
  margin-bottom: 0;
}

.subtitle-2 {
  font-size: 12px;
  margin-bottom: 10px;
}

.extra-info {
  color: #b3d9ff;
}

.extra-info:hover {
  cursor: pointer;
  color: #0066ff;
}

.preview-1-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 10px;
}

.preview-1-page {
  width: 100%;
  height: 100%;
  // background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  // color: white;
  // border: 1px solid;
}

.preview-extra-width {
  width: 100%;
}

.edit_options_panels {
  margin: 0px !important;
  padding-bottom: 5px;
}

.nav-1-item-slate {
  color: white !important;
  background-color: #8c8c8c !important;
  // border-bottom: 3px solid blue !important;
}

.nav-1-item-matrix {
  color: #00e676 !important;
  background-color: black !important;
}

.nav-1-item-slate.active {
  border-bottom: 3px solid #66a3ff !important;
}

.nav-1-item-slate:hover {
  border-bottom: 3px solid #66a3ff !important;
}

.nav-1-item-matrix.active {
  border-bottom: 3px solid green !important;
}

.nav-1-item-matrix:hover {
  border-bottom: 3px solid green !important;
}

.matrix-card {
  background-color: black !important;
  color: #00e676;
  border-bottom: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
}

.matrix-card-opp {
  background-color: black !important;
  color: #00e676;
  border-top: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
}

.x2 {
  font-size: 48px !important;
}

.preview-window-bar {
  width: 100%;
}

.preview-color-pick {
  align-self: center;
}

.dark-nav-text {
  color: black;
}

.white-nav-text {
  color: white;
}

.save-btn-container {
  width: 100%;
}
</style>
