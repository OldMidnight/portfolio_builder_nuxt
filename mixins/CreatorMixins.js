import _ from 'lodash'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { Editor } from 'tiptap'
import {
  Bold,
  BulletList,
  CodeBlock,
  Code,
  Blockquote,
  ListItem,
  Italic,
  Link,
  History,
  OrderedList,
  Strike,
  Underline,
  Heading,
  TrailingNode
} from 'tiptap-extensions'
import CenterAlign from '@/components/tiptap-custom-nodes/Align/CenterAlign'
import LeftAlign from '@/components/tiptap-custom-nodes/Align/LeftAlign'
import RightAlign from '@/components/tiptap-custom-nodes/Align/RightAlign'
import FontSize from '@/components/tiptap-custom-nodes/FontSize'
import Span from '@/components/tiptap-custom-nodes/Span'
export default {
  async fetch({ store, $axios }) {
    const {
      site_not_created: siteNotCreated,
      site_config: siteConfig
    } = await $axios.$get('/helpers/auth_site_config')
    if (!siteNotCreated) {
      store.commit('creator/setSiteProps', siteConfig)
    }
  },
  data() {
    return {
      selectedLayout: null,
      currentLayout: 0,
      show_tools_drawer: false,
      rules: {
        required: (value) => !!value || 'Required.'
      },
      layouts: [
        {
          id: 1,
          component_name: 'Layout_Type_1',
          name: 'ORIGINAL',
          img_path: 'Layout_1_img.png',
          preview_image: '/layout_images/kreoh_layout_1_fresh.png'
        },
        {
          id: 2,
          component_name: 'Layout_Type_2',
          name: 'STARK',
          img_path: '#',
          preview_image: '/layout_images/coming_soon.gif'
        },
        {
          id: 3,
          component_name: 'Layout_Type_3',
          name: 'CLEAR',
          img_path: '#',
          preview_image: '/layout_images/coming_soon.gif'
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
        // {id: NUM, type: PAGE NUMBER, component: COMPONENT, preview_img: path}
        {
          id: 1,
          tab: 'home',
          type: 1,
          component: 'home_sections/home_type_1',
          preview_img: '/preview_images/home_pg_1.png'
        },
        {
          id: 2,
          tab: 'home',
          type: 1,
          component: 'home_sections/home_type_2',
          preview_img: '/preview_images/home_pg_2.png'
        },
        {
          id: 3,
          tab: 'projects',
          type: 2,
          component: 'projects_sections/projects_type_1',
          preview_img: '/preview_images/home_pg_1.png'
        },
        {
          id: 4,
          tab: 'projects',
          type: 2,
          component: 'projects_sections/projects_type_2',
          preview_img: '/preview_images/home_pg_1.png'
        }
      ],
      page_customise_select: [
        { text: 'Select Theme', value: 1 },
        { text: 'Custom Colors', value: 2 }
      ],
      page_option: null,
      page_theme_options_main: [
        {
          id: 1,
          layout: 1,
          name: 'layout_1_slate',
          title: 'Space Grey',
          title_color: 'black',
          img: '/creator_misc/space_gray_img.png',
          small_desc: 'Cool & Grey.',
          desc:
            'Give a website a slick and stealthy lick of paint. With consistent coloring for all components, ensure a clean and minimal look.'
        },
        // {
        //   id: 2,
        //   layout: 1,
        //   name: 'layout_1_fresh',
        //   title: 'Fresh',
        //   small_desc: 'Light. Open.',
        //   desc:
        //     'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.'
        // },
        {
          id: 2,
          layout: 1,
          name: 'layout_1_matrix',
          title: 'Matrix',
          title_color: 'white',
          img: '/creator_misc/matrix_img.jpeg',
          small_desc: 'Blue Pill Or Red Pill?',
          desc:
            'Taking inspiration from the Matrix Trilogy, enjoy and sleek matrix-style asthetic throughout your website.'
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
      tab_text_colors: {
        home: 'black',
        projects: 'black',
        resume: 'black'
      },
      show_nav_color_customiser: false,
      page_template_model: 1,
      show_page_add_error: false,
      show_page_delete_error: false,
      show_page_add_success: false,
      show_page_delete_success: false,
      current_page_type: 1,
      loader: null,
      preview_images_interval: '',
      current_preview_img: 0,
      editor: null,
      is_editing: false,
      editor_timeout: null,
      linkUrl: null,
      linkMenuIsActive: false,
      font_size_classes: [
        { text: 'Overline', value: 'overline' },
        { text: 'Caption', value: 'caption' },
        { text: 'Body-2', value: 'body-2' },
        { text: 'Body-1', value: 'body-1' },
        { text: 'Title', value: 'title' },
        { text: 'Headline', value: 'headline' },
        { text: 'Display-1', value: 'display-1' },
        { text: 'Display-2', value: 'display-2' }
      ],
      editing_font_size: false,
      editor_font_size: 'overline',
      editor_align_btn: 0,
      new_page_name: 'Call-To-Action',
      api_waiting_lines: [
        'Summoning Cthulu...',
        'Enriching Uranium...',
        'Playing Windows Boot Up Noises...',
        'Taking My Time...',
        `Deleting '/'...`,
        `Switching The Internet Off And On...`
      ],
      current_waiting_line: null,
      api_waiting_lines_interval: null,
      show_help_dialog: false,
      current_editors: [],
      active_editor_index: null,
      // show_tutorial: false,
      // tutorial_step: 1
      upload_image_types: [
        'image/png',
        'image/bmp',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/svg+xml',
        'image/vnd.microsoft.icon',
        'image/x-icon'
      ],
      page_transitions: [
        {
          name: 'Fade',
          enterActiveClass: 'fadeIn',
          leaveActiveClass: 'fadeOut'
        },
        {
          name: 'FadeLeft',
          enterActiveClass: 'fadeInLeft',
          leaveActiveClass: 'fadeOutRight'
        },
        {
          name: 'FadeRight',
          enterActiveClass: 'fadeInRight',
          leaveActiveClass: 'fadeOutLeft'
        },
        {
          name: 'FadeUp',
          enterActiveClass: 'fadeInUp',
          leaveActiveClass: 'fadeOutUp'
        },
        {
          name: 'FadeDown',
          enterActiveClass: 'fadeInDown',
          leaveActiveClass: 'fadeOutDown'
        },
        {
          name: 'Bounce',
          enterActiveClass: 'bounceIn',
          leaveActiveClass: 'bounceOut'
        },
        {
          name: 'FlipX',
          enterActiveClass: 'flipInX',
          leaveActiveClass: 'flipOutX'
        },
        {
          name: 'FlipY',
          enterActiveClass: 'flipInY',
          leaveActiveClass: 'flipOutY'
        },
        {
          name: 'SlideUp',
          enterActiveClass: 'slideInUp',
          leaveActiveClass: 'slideOutUp'
        },
        {
          name: 'SlideDown',
          enterActiveClass: 'slideInDown',
          leaveActiveClass: 'slideOutDown'
        },
        {
          name: 'SlideLeft',
          enterActiveClass: 'slideInLeft',
          leaveActiveClass: 'slideOutRight'
        },
        {
          name: 'SlideRight',
          enterActiveClass: 'slideInRight',
          leaveActiveClass: 'slideOutLeft'
        },
        {
          name: 'Zoom',
          enterActiveClass: 'zoomIn',
          leaveActiveClass: 'zoomOut'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      userUploads: 'creator/userUploads',
      userStorage: 'creator/userStorage',
      site_props: 'creator/site_props'
    }),
    activeEditor() {
      if (this.activeNav !== 'home') {
        return this.editor
      } else {
        return this.current_editors[this.active_editor_index]
      }
    },
    storage_percent() {
      return Math.ceil(
        (this.userStorage.current_storage_space /
          this.userStorage.max_storage_space) *
          100
      )
    },
    saving() {
      return this.$store.state.creator.saving
    },
    creation_step() {
      return this.$store.state.creator.creation_step
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
      this.createEditors(this.site_props.homePages.length)
      return this.site_props.homePages
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
    user() {
      return this.$store.state.auth.user
    },
    page_transition: {
      set(value) {
        this.setPageTransition({
          transition: value
        })
      },
      get() {
        return this.site_props.transition
      }
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
    // tab_text_color: {
    //   set(value) {
    //     this.setTabTextColor(value)
    //   },
    //   get() {
    //     return this.site_props.tab_text_color
    //   }
    // },
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
        } else if (vm.site_props.selected_theme === 2) {
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
        pages.push({ text: 'Home Landing Page', value: 1 })
        if (this.site_props.homePages.length === 2) {
          pages.push({ text: 'Call-To-Action Page', value: 2 })
        }
      } else if (this.customise_page_option === 2) {
        pages.push({ text: 'Projects Landing Page', value: 1 })
        if (this.site_props.projectsPages.length > 1) {
          for (let i = 1; i < this.site_props.projectsPages.length; i++) {
            pages.push({ text: 'Projects Page ' + i, value: i + 1 })
          }
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
    },
    nextStepState() {
      if (this.$store.state.creator.show_next_step) {
        this.editor.blur()
      }
      return this.$store.state.creator.show_next_step
    },
    show_next_step() {
      return this.$store.state.creator.show_next_step
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
      document.querySelector('.nav-resume').style.color = value
      this.setTabColor({ type: 'resume', value })
    },
    'tab_text_colors.home'(value) {
      document.querySelector('.nav-home').style.color = value
      this.setTabTextColor({ type: 'home', value })
    },
    'tab_text_colors.projects'(value) {
      document.querySelector('.nav-projects').style.color = value
      this.setTabTextColor({ type: 'projects', value })
    },
    'tab_text_colors.resume'(value) {
      document.querySelector('.nav-resume').style.color = value
      this.setTabTextColor({ type: 'resume', value })
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
            this.new_page_name = 'Call-To-Action'
            break

          case 'projects':
            this.customise_page_option = 2
            this.current_page_type = 2
            this.new_page_name = 'Projects'
            break

          case 'resume':
            this.customise_page_option = 3
            this.current_page_type = 2
            this.new_page_name = null
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
    linkMenuIsActive(value) {
      if (value) {
        clearTimeout(this.editor_timeout)
      }
    },
    editing_font_size(value) {
      if (value) {
        clearTimeout(this.editor_timeout)
      }
    }
  },
  mounted() {
    this.api_waiting_lines_interval = setInterval(() => {
      const newLineIndex = Math.floor(
        Math.random() * this.api_waiting_lines.length
      )
      this.current_waiting_line = this.api_waiting_lines[newLineIndex]
    }, 3500)
    this.editor = new Editor({
      editable: this.preview || this.live,
      extensions: [
        // new Align(),
        new CenterAlign(),
        new LeftAlign(),
        new RightAlign(),
        new FontSize(),
        new Heading(),
        new Bold(),
        new BulletList(),
        new Blockquote(),
        new ListItem(),
        new Italic(),
        new Link(),
        new OrderedList(),
        new Strike(),
        new Underline(),
        new History(),
        new CodeBlock(),
        new Code(),
        new Span(),
        new TrailingNode({
          node: 'paragraph',
          notAfter: ['paragraph', 'align']
        })
      ],
      onFocus: () => {
        this.is_editing = true
        this.hideNextStep()
      },
      onUpdate: (e) => {
        // console.log(e)
        this.startSaving()
        const func = _.debounce(() => {
          this.updatePageHTML({
            page_label:
              this.activeNav + '_page_' + this.activeNav_index + '_data',
            html: e.getHTML()
          })
          // this.test()
          // console.log(e)
          // console.log(this)
        }, 4000)
        func()
      }
    })
    if (this.user.site_created) {
      this.customise_background_color = this.site_props.background.color
      this.customise_foreground_color = this.site_props.foreground.color
      this.site_nav = this.site_props.navigation
      this.tab_colors.home = this.site_props.tab_colors.home
      this.tab_colors.projects = this.site_props.tab_colors.projects
      this.tab_colors.resume = this.site_props.tab_colors.resume
      this.tab_text_colors.home = this.site_props.tab_text_colors.home
      this.tab_text_colors.projects = this.site_props.tab_text_colors.projects
      this.tab_text_colors.resume = this.site_props.tab_text_colors.resume
      this.showNextStep()
      this.temp_site_props = JSON.stringify(this.site_props)
    } else {
      this.setHomePages([
        // { id: #, component: () => import(COMPONENT_PATH) }
        { id: 1, page_num: 1, component: 'home_sections/home_type_1' },
        { id: 2, page_num: 2, component: 'home_sections/home_type_4' }
      ])
      let inputDict = 'home_page_1_data'
      this.updatePageData({
        page_label: inputDict,
        data: {
          html: `
            <p>
              <span style="text-align: center; display: block">
                <span class="display-1">${this.user.f_name +
                  ' ' +
                  this.user.s_name}</span>
              </span>
            </p>
            <p>
              <span style="text-align: center; display: block">
                <span class="body-2">
                  ${this.user.email} - 08xxxxxxxx
                </span>
              </span>
            </p>
            <p>
              <span style="text-align: center; display: block">
                <span class="body-1">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit.
                </span>
              </span>
            </p>
            <p>
              <span style="text-align: center; display: block">
                <span class="body-1">
                  Mollis montes nam hendrerit sollicitudin iaculis.
                </span>
              </span>
            </p>
          `,
          img_props: {
            url:
              'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60',
            contain: false,
            link: true,
            upload: false
          }
        }
      })
      inputDict = 'home_page_2_data'
      this.updatePageData({
        page_label: inputDict,
        data: {
          html: `
            <p>
              <span style="text-align: center; display: block">
                <span class="display-1">Your Call-To-Action</span>
              </span>
            </p>
            <p></p>
            <p>
              <span style="text-align: center; display: block">
                <span class="body-1">Got an idea you believe in? Or maybe a cause you vouch for? Use this space to bring attention to it! Maybe its a website that lets users create their own websites... ;-)</span>
              </span>
            </p>
          `,
          img_props: {
            url:
              'https://images.unsplash.com/photo-1421790500381-fc9b5996f343?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
            contain: false,
            link: true,
            upload: false
          },
          button_props: {
            text: 'Learn More',
            color: '#2196F3',
            text_color: 'white',
            url: 'https://www.kreoh.com'
          }
        }
      })

      this.setProjectsPages([
        // { id: #, component: () => import(COMPONENT_PATH) }
        { id: 1, page_num: 1, component: 'projects_sections/projects_type_1' },
        { id: 2, page_num: 2, component: 'projects_sections/projects_type_2' }
      ])
      inputDict = 'projects_page_1_data'

      this.updatePageData({
        page_label: inputDict,
        data: {
          html: `
            <p>
              <span style="text-align: center; display: block">
                <span class="body-2">
                  Below you will find a few of my featured projects I've worked on during my free time.
                </span>
              </span>
            </p>
          `,
          projects: [
            {
              id: '0',
              title: 'Project Title Here',
              description:
                'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
              img: {
                use: true,
                url:
                  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1682&q=80',
                contain: false,
                link: true,
                upload: false
              },
              link: {
                use: true,
                url: 'https://www.kreoh.com/',
                link_text: 'Learn More...'
              }
            },
            {
              id: '1',
              title: 'Project Title Here',
              description:
                'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
              img: {
                use: true,
                url:
                  'https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
                contain: false,
                link: true,
                upload: false
              },
              link: {
                use: false,
                url: null,
                link_text: null
              }
            }
          ]
        }
      })

      inputDict = 'projects_page_2_data'

      this.setInputDictValues({
        inputDict,
        input_dict_values: {
          projects: [
            {
              id: '0',
              title: 'Project Title Here',
              description:
                'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
              img: {
                use: true,
                url:
                  'https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
                contain: false,
                link: true,
                upload: false
              },
              link: {
                use: false,
                url: null,
                link_text: null
              }
            },
            {
              id: '1',
              title: 'Project Title Here',
              description:
                'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.',
              img: {
                use: true,
                url:
                  'https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
                contain: false,
                link: true,
                upload: false
              },
              link: {
                use: false,
                url: null,
                link_text: null
              }
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
    }
  },
  beforeDestroy() {
    this.editor.destroy()
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
      setResumeSection: 'creator/setResumeSection',
      updatePageData: 'creator/updatePageData',
      updatePageDataObject: 'creator/updatePageDataObject',
      updatePageHTML: 'creator/updatePageHTML',
      startSaving: 'creator/startSaving',
      setPageTransition: 'creator/setPageTransition'
    }),
    ...mapActions({
      registerWebsite: 'creator/registerWebsite',
      updateWebsite: 'creator/updateWebsite',
      uploadFiles: 'creator/uploadFiles',
      deleteFile: 'functions/deleteFile'
    }),
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes'
      const k = 1000
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / k ** i).toFixed(dm)) + ' ' + sizes[i]
    },
    createEditors(num) {
      for (let i = 0; i < num; i++) {
        const editor = new Editor({
          editable: this.preview || this.live,
          extensions: [
            // new Align(),
            new CenterAlign(),
            new LeftAlign(),
            new RightAlign(),
            new FontSize(),
            new Heading(),
            new Bold(),
            new BulletList(),
            new Blockquote(),
            new ListItem(),
            new Italic(),
            new Link(),
            new OrderedList(),
            new Strike(),
            new Underline(),
            new History(),
            new CodeBlock(),
            new Code(),
            new Span(),
            new TrailingNode({
              node: 'paragraph',
              notAfter: ['paragraph', 'align']
            })
          ],
          onFocus: () => {
            this.is_editing = true
            this.active_editor_index = i
          },
          onUpdate: (e) => {
            // console.log(e)
            this.startSaving()
            const func = _.debounce(() => {
              this.updatePageHTML({
                page_label:
                  this.activeNav + '_page_' + this.activeNav_index + '_data',
                html: e.getHTML()
              })
              // this.test()
              // console.log(e)
              // console.log(this)
            }, 4000)
            func()
          }
        })
        this.current_editors.push(editor)
      }
    },
    selectLayout(index) {
      if (index === 0) {
        if (this.layouts[index].component_name !== this.site_props.layout) {
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
      return this.creation_step === step
    },
    changePreviewPage(direction) {
      switch (direction) {
        case 'left':
          if (this.activeNav_index === 1) {
            // eslint-disable-next-line prettier/prettier
            this.activeNav_index = this.site_props[
              this.activeNav + 'Pages'
            ].length
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
        if (this.site_props.selected_theme === 2) {
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
      this.tab_text_colors.home = 'black'
      this.tab_text_colors.projects = 'black'
      this.tab_text_colors.resume = 'black'
    },
    addNewPage() {
      switch (this.customise_page_option) {
        case 1:
          if (this.site_props.homePages.length === 2) {
            this.show_page_add_error = true
          } else {
            this.addPage({
              tab: 'homePages',
              page: {
                id: 2,
                layout: Number(
                  this.site_props.layout[this.site_props.layout.length - 1]
                ),
                component: 'home_sections/home_type_4'
              }
            })
            this.activeNav_index = 2
            this.show_page_add_success = true
          }
          break

        case 2:
          if (this.site_props.projectsPages.length === 3) {
            this.show_page_add_error = true
          } else {
            this.addPage({
              tab: 'projectsPages',
              page: {
                id: this.site_props.projectsPages.length + 1,
                layout: Number(
                  this.site_props.layout[this.site_props.layout.length - 1]
                ),
                component: 'home_sections/projects_type_2'
              }
            })
            this.activeNav_index = this.site_props.projectsPages.length + 1
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
    },
    registerSite() {
      if (this.$refs.editor_site_name_form.validate()) {
        this.validating = true
        this.uploadFiles().then(() => {
          if (!this.user.site_created) {
            this.registerWebsite(this.site_props)
          } else {
            this.updateWebsite(this.site_props)
          }
        })
      }
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
    },
    toggleAlign(isActive, commands, align) {
      switch (align) {
        case 'left':
          if (isActive.right_align()) {
            commands.right_align()
          } else if (isActive.center_align()) {
            commands.center_align()
          }
          commands.left_align()
          break

        case 'right':
          if (isActive.left_align()) {
            commands.left_align()
          } else if (isActive.center_align()) {
            commands.center_align()
          }
          commands.right_align()
          break

        case 'center':
          if (isActive.right_align()) {
            commands.right_align()
          } else if (isActive.left_align()) {
            commands.left_align()
          }
          commands.center_align()
          break

        default:
          break
      }
    },
    emitEvent(ev) {
      this.$root.$emit(ev)
    }
  },
  head() {
    return {
      title: this.user.site_created ? 'Editor - Kreoh' : 'Creator - Kreoh'
    }
  }
}
