<script>
import _ from 'lodash'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { Editor, EditorMenuBar } from 'tiptap'
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
// import Align from '@/components/tiptap-custom-nodes/UnifiedAlign'
import CenterAlign from '@/components/tiptap-custom-nodes/Align/CenterAlign'
import LeftAlign from '@/components/tiptap-custom-nodes/Align/LeftAlign'
import RightAlign from '@/components/tiptap-custom-nodes/Align/RightAlign'
import FontSize from '@/components/tiptap-custom-nodes/FontSize'
import Span from '@/components/tiptap-custom-nodes/Span'
import LoadableComponent from '@/components/helpers/loadable_component'
export default {
  layout: 'creation_layout',
  components: { LoadableComponent, EditorMenuBar },
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
  fetch({ store, $axios }) {
    if (store.state.auth.user.site_created) {
      return $axios.get('/helpers/auth_site_config').then((response) => {
        store.commit('creator/setSiteProps', response.data.site_config)
      })
    }
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
  created() {
    if (!this.user.site_created) {
      this.show_help_dialog = true
    }
  },
  mounted() {
    // if (!this.user.skip_tutorial) {
    //   this.show_tutorial = true
    // }
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
    this.fetchUserUploads()
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
      fetchUserUploads: 'creator/fetchUserUploads',
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
    }
  },
  head() {
    return {
      title: this.user.site_created ? 'Editor - Kreoh' : 'Creator - Kreoh'
    }
  }
}
</script>

<template>
  <div
    class="creation-step-layout d-flex justify-start align-center"
    :class="{ 'extra-padding-site-name': checkStepCount(2) }"
  >
    <transition
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
      mode="out-in"
    >
      <v-flex v-if="checkStepCount(0)" key="0" class="creation-step px-9">
        <v-flex class="creation-step-header">
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
          >
            <div
              class="pa-3 d-flex"
              :class="{
                'layout-item': layout.id === 1,
                'layout-item-disabled': layout.id !== 1,
                'layout-selected-2': site_props.layout === layout.component_name
              }"
              @click.stop="selectLayout(index)"
            >
              <v-img
                :key="index"
                class="website-img"
                contain
                :src="layout.preview_image"
                lazy-src="/img_lazy.jpeg"
              ></v-img>
            </div>
            <p class="text-center font-weight-light">{{ layout.name }}</p>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-layout
        v-else-if="checkStepCount(1)"
        key="1"
        class="creation-step preview-edit d-flex justify-center align-center ma-0"
      >
        <div class="preview-edit-window pa-0 px-3 creation-step-edit-options">
          <div class="title">Customize Your Website</div>

          <v-row align="center" class="edit-options-panels">
            <v-expansion-panels popout>
              <!-- TABS CUSTOMISATIONS -->

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <span class="font-weight-bold">Tabs</span>
                  <span class="caption text-right pr-2">
                    Customize tab titles and colors
                  </span>
                </v-expansion-panel-header>
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
                        label="Tab Title"
                        outlined
                        @change="hideNextStep()"
                      >
                      </v-text-field>
                      <v-row>
                        <v-col cols="7">
                          <p class="text-center">Tab Color</p>
                          <v-color-picker
                            v-model="tab_colors.home"
                            :disabled="site_props.selected_theme !== null"
                            hide-inputs
                            class="preview-color-pick align-self-center"
                            @input="hideNextStep()"
                          >
                          </v-color-picker>
                        </v-col>
                        <v-col
                          cols="4"
                          class="mt-3 d-flex flex-column align-center justify-center"
                        >
                          <p>Text Color</p>
                          <v-radio-group
                            v-model="tab_text_colors.home"
                            :disabled="site_props.text_border_color"
                            @change="hideNextStep()"
                          >
                            <v-radio label="White" value="white"></v-radio>
                            <v-radio label="Black" value="black"></v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-row>
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
                        label="Tab Title"
                        outlined
                        @change="hideNextStep()"
                      >
                      </v-text-field>
                      <v-row>
                        <v-col cols="7">
                          <p class="text-center">Tab Color</p>
                          <v-color-picker
                            v-model="tab_colors.projects"
                            :disabled="site_props.selected_theme !== null"
                            hide-inputs
                            class="preview-color-pick align-self-center"
                            @input="hideNextStep()"
                          >
                          </v-color-picker>
                        </v-col>
                        <v-col
                          cols="4"
                          class="mt-3 d-flex flex-column align-center justify-center"
                        >
                          <p>Text Color</p>
                          <v-radio-group
                            v-model="tab_text_colors.projects"
                            :disabled="site_props.text_border_color"
                            @change="hideNextStep()"
                          >
                            <v-radio label="White" value="white"></v-radio>
                            <v-radio label="Black" value="black"></v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-row>
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
                        label="Tab Title"
                        outlined
                        @change="hideNextStep()"
                      >
                      </v-text-field>
                      <v-row>
                        <v-col cols="7">
                          <p class="text-center">Tab Color</p>
                          <v-color-picker
                            v-model="tab_colors.resume"
                            :disabled="site_props.selected_theme !== null"
                            hide-inputs
                            class="preview-color-pick align-self-center"
                            @input="hideNextStep()"
                          >
                          </v-color-picker>
                        </v-col>
                        <v-col
                          cols="4"
                          class="mt-3 d-flex flex-column align-center justify-center"
                        >
                          <p>Text Color</p>
                          <v-radio-group
                            v-model="tab_text_colors.resume"
                            :disabled="site_props.text_border_color"
                            @change="hideNextStep()"
                          >
                            <v-radio label="White" value="white"></v-radio>
                            <v-radio label="Black" value="black"></v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-flex>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- PAGES TAB -->

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <span class="font-weight-bold">Pages</span>
                  <span class="caption text-right pr-2">
                    Modify your pages and page sections
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-flex class="pt-3">
                    <p>Page Theme & Colors</p>
                    <span class="caption">
                      Customize the theme and colors of your pages
                    </span>
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
                        <v-img
                          class="black--text"
                          height="200px"
                          :src="theme.img"
                        >
                          <v-card-title class="pa-0 align-end fill-height">
                            <p
                              :class="
                                `ma-0 pt-2 px-5 font-weight-bold headline white`
                              "
                            >
                              {{ theme.title }}
                            </p>
                          </v-card-title>
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
                          <v-btn
                            color="success"
                            @click.stop="selectTheme(theme.id)"
                          >
                            <v-icon
                              v-if="theme.id === site_props.selected_theme"
                              left
                              >mdi-pencil</v-icon
                            >
                            {{ themeSelected(theme.id) }}
                          </v-btn>
                          <v-btn
                            text
                            color="orange"
                            @click.stop="nextTheme('right')"
                          >
                            Next
                          </v-btn>
                          <v-btn
                            text
                            color="orange"
                            @click.stop="nextTheme('left')"
                          >
                            Previous
                          </v-btn>
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
                          show-swatches
                          class="preview-color-pick"
                          @change="hideNextStep()"
                        ></v-color-picker>
                      </v-flex>
                    </v-flex>
                  </v-flex>
                  <v-flex class="mt-3">
                    <p>Pages</p>
                    <span class="caption">
                      Customise what components are used on your website.
                    </span>
                    <v-select
                      v-model="customise_page_option"
                      :items="currentTabs"
                      label="Select Page"
                      solo
                    >
                    </v-select>

                    <v-select
                      v-if="customise_page_option !== null"
                      v-model="customise_page_option_number"
                      :items="currentPages"
                      label="Select Section"
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
                            color="#F5F5F5"
                            @click.stop="toggle"
                          >
                            <v-card-title>
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
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                              <v-img
                                contain
                                :src="template.preview_img"
                                class="preview-img"
                              ></v-img>
                            </v-card-text>
                          </v-card>
                        </v-slide-item>
                      </v-slide-group>
                    </v-sheet>
                    <v-flex class="d-flex justify-center align-center mt-3">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="error"
                            class="mr-2"
                            :disabled="activeNav === 'resume'"
                            @click.stop="deletePage()"
                            v-on="on"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Delete current page</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="success"
                            class="ml-2"
                            :disabled="
                              activeNav === 'resume' ||
                                site_props.homePages.length === 2
                            "
                            @click.stop="addNewPage()"
                            v-on="on"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </template>
                        <span>Add a new {{ new_page_name }} page</span>
                      </v-tooltip>
                    </v-flex>
                  </v-flex>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <span class="font-weight-bold">Uploads</span>
                  <span class="caption text-right pr-2">
                    Manage files you have uploaded
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col
                      v-for="(upload, index) in userUploads"
                      :key="index"
                      class="upload py-0 d-flex flex-column elevation-1 my-2"
                      cols="12"
                    >
                      <v-row class="align-center upload-content">
                        <v-col cols="2" class="upload-icon">
                          <v-icon
                            v-if="upload_image_types.includes(upload.type)"
                            color="info"
                            large
                          >
                            mdi-image
                          </v-icon>
                          <v-icon v-else large color="info">
                            mdi-file-document-outline
                          </v-icon>
                        </v-col>
                        <v-col
                          cols="5"
                          class="d-inline-block upload-name text-center text-truncate"
                        >
                          <v-tooltip bottom open-on-hover open-delay="400">
                            <template v-slot:activator="{ on }">
                              <p class="font-weight-bold" v-on="on">
                                File Name: {{ upload.name }}
                              </p>
                            </template>
                            <span>{{ upload.name }}</span>
                          </v-tooltip>
                        </v-col>
                        <v-col cols="5" class="upload-size text-center">
                          <p class="font-weight-bold">
                            Size: {{ upload.size }}
                          </p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" class="d-flex justify-center">
                          <v-btn
                            small
                            color="success"
                            class="mx-2"
                            :href="
                              $axios.defaults.baseURL +
                                '/uploads/user-content/' +
                                upload.url
                            "
                            target="_blank"
                          >
                            <v-icon>mdi-download</v-icon> Download
                          </v-btn>
                          <v-btn
                            small
                            color="error"
                            class="mx-2"
                            @click="deleteFile({ url: upload.url })"
                          >
                            <v-icon>mdi-delete</v-icon> Delete
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-progress-linear
                        background-color="error"
                        color="success"
                        :value="storage_percent"
                        rounded
                        height="20"
                      >
                        <template>
                          <p class="font-weight-bold caption">
                            {{ formatBytes(userStorage.current_storage_space) }}
                            /
                            {{ formatBytes(userStorage.max_storage_space) }}
                          </p>
                        </template>
                      </v-progress-linear>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <span class="font-weight-bold">Transitions</span>
                  <span class="caption text-right pr-2">
                    Customize your page transitions
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-sheet class="mx-auto" elevation="8" max-width="800">
                    <v-slide-group
                      v-model="page_transition"
                      class="pa-1"
                      show-arrows
                      mandatory
                      center-active
                    >
                      <v-slide-item
                        v-for="(transition, index) in page_transitions"
                        :key="index"
                        v-slot:default="{ active, toggle }"
                        :value="transition"
                      >
                        <v-card
                          :color="active ? 'primary' : 'grey lighten-1'"
                          class="ma-4"
                          height="200"
                          width="100"
                          @click="toggle"
                        >
                          <v-row
                            class="fill-height flex-column"
                            align="center"
                            justify="center"
                          >
                            <p class="title font-weight-light">
                              {{ transition.name }}
                            </p>
                            <v-scale-transition>
                              <v-icon
                                v-if="active"
                                color="white"
                                size="48"
                                v-text="'mdi-close-circle-outline'"
                              ></v-icon>
                            </v-scale-transition>
                          </v-row>
                        </v-card>
                      </v-slide-item>
                    </v-slide-group>

                    <v-expand-transition
                      v-for="(transition, index) in page_transitions"
                      :key="index"
                    >
                      <v-sheet
                        v-if="page_transition === transition"
                        color="grey lighten-4"
                        height="200"
                        tile
                      >
                        <v-row
                          class="fill-height"
                          align="center"
                          justify="center"
                        >
                          <transition
                            appear
                            :enter-active-class="
                              `animated ${transition.enterActiveClass} slower`
                            "
                            :leave-active-class="
                              `animated ${transition.leaveActiveClass} slower`
                            "
                            mode="out-in"
                          >
                            <v-col
                              cols="6"
                              class="border-rounded pa-9 elevation-6"
                            ></v-col>
                          </transition>
                        </v-row>
                      </v-sheet>
                    </v-expand-transition>
                  </v-sheet>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </div>

        <v-layout
          id="creation-step-preview"
          align-center
          class="preview-edit-window creation-step-preview ma-0 main-light-theme"
          :class="{
            'slate-light': site_props.selected_theme === 1,
            matrix: site_props.selected_theme === 2
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
                :class="{ 'matrix-card-opp': site_props.selected_theme === 2 }"
              >
                <!-- NAV ITEMS -->
                <v-flex
                  class="preview-1-top-nav-item nav-home d-flex justify-center"
                  :style="check_color_style"
                  :class="{
                    active:
                      activeNav === 'home' && !site_props.text_border_color,
                    customActive:
                      activeNav === 'home' &&
                      site_props.text_border_color &&
                      site_props.selected_theme === null,
                    'nav-1-item-slate': site_props.selected_theme === 1,
                    'nav-1-item-matrix': site_props.selected_theme === 2,
                    'dark-nav-text':
                      site_props.tab_text_colors.home === 'black',
                    'white-nav-text':
                      site_props.tab_text_colors.home === 'white'
                  }"
                  @click.stop="changeActiveNav('home')"
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
                    'nav-1-item-matrix': site_props.selected_theme === 2,
                    'dark-nav-text':
                      site_props.tab_text_colors.projects === 'black',
                    'white-nav-text':
                      site_props.tab_text_colors.projects === 'white'
                  }"
                  @click.stop="changeActiveNav('projects')"
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
                    'nav-1-item-matrix': site_props.selected_theme === 2,
                    'dark-nav-text':
                      site_props.tab_text_colors.resume === 'black',
                    'white-nav-text':
                      site_props.tab_text_colors.resume === 'white'
                  }"
                  @click.stop="changeActiveNav('resume')"
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
                  'matrix-card': site_props.selected_theme === 2
                }"
              >
                <transition-group
                  appear
                  name="page-section-transition"
                  :enter-active-class="
                    `animated ${page_transition.enterActiveClass} faster`
                  "
                  :leave-active-class="
                    `animated ${page_transition.leaveActiveClass} faster`
                  "
                  mode="out-in"
                >
                  <v-row
                    v-if="activeNav === 'home'"
                    key="home"
                    class="preview-1-content preview-1-home-content ma-0"
                    :class="{
                      slate: site_props.selected_theme === 1,
                      matrix: site_props.selected_theme === 2
                    }"
                  >
                    <v-col
                      v-for="preview_page in home_pages"
                      :key="preview_page.id"
                      cols="12"
                      class="preview-1-page pa-0"
                      :class="{
                        slate: site_props.selected_theme === 1,
                        matrix: site_props.selected_theme === 2
                      }"
                    >
                      <LoadableComponent
                        :component-name="preview_page.component"
                        :options="{
                          input_dict_name:
                            'home_page_' + preview_page.page_num + '_data',
                          preview: false,
                          height: '150',
                          width: '150'
                        }"
                        :editor="current_editors[preview_page.page_num - 1]"
                        @update="updateInput($event)"
                      ></LoadableComponent>
                    </v-col>
                  </v-row>
                  <v-flex
                    v-if="activeNav === 'projects'"
                    key="projects"
                    class="preview-1-content preview-1-projects-content"
                    :class="{
                      slate: site_props.selected_theme === 1,
                      matrix: site_props.selected_theme === 2
                    }"
                  >
                    <v-flex
                      v-for="preview_page in projects_pages"
                      :key="preview_page.id"
                      class="preview-1-page"
                      :class="{
                        slate: site_props.selected_theme === 1,
                        matrix: site_props.selected_theme === 2
                      }"
                    >
                      <LoadableComponent
                        :component-name="preview_page.component"
                        :options="{
                          input_dict_name:
                            'projects_page_' + activeNav_index + '_data',
                          preview: false,
                          height: '150',
                          width: '150'
                        }"
                        :editor="editor"
                      ></LoadableComponent>
                    </v-flex>
                  </v-flex>
                  <v-flex
                    v-if="activeNav === 'resume'"
                    key="resume"
                    class="preview-1-content preview-1-resume-content"
                    :class="{
                      slate: site_props.selected_theme === 1,
                      matrix: site_props.selected_theme === 2
                    }"
                  >
                    <v-flex
                      v-for="preview_page in resume_pages"
                      :key="preview_page.id"
                      class="preview-1-page"
                      :class="{
                        slate: site_props.selected_theme === 1,
                        matrix: site_props.selected_theme === 2
                      }"
                    >
                      <LoadableComponent
                        :component-name="preview_page.component"
                        :options="{
                          input_dict_name: 'resume_page_inputs',
                          preview: false,
                          height: '150',
                          width: '150'
                        }"
                        @update="updateInput($event)"
                      ></LoadableComponent>
                    </v-flex>
                  </v-flex>
                </transition-group>
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
          </v-layout>
        </v-layout>
      </v-layout>

      <v-layout
        v-else-if="checkStepCount(2)"
        key="2"
        class="creation-step justify-center creation-site-name-wrapper"
        align-center
      >
        <v-flex class="creation-name d-flex flex-column">
          <v-flex
            class="creation-name-form-container pa-3 elevation-1 d-flex  justify-center align-center"
          >
            <transition
              enter-active-class="animated fadeIn faster"
              leave-active-class="animated fadeOut faster"
              mode="out-in"
            >
              <v-form
                v-if="!validating"
                ref="editor_site_name_form"
                class="creation-name--form elevation-2 pa-5 px-9"
              >
                <span class="headline">Enter Your site name</span>
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
                        site_props.site_name.length <= 40) ||
                      'Max 40 characters'
                  ]"
                  outline
                >
                </v-text-field>
                <v-btn
                  :loading="validating"
                  :disabled="validating"
                  color="info"
                  @click="registerSite()"
                >
                  Submit
                </v-btn>
              </v-form>
              <v-flex v-else class="creation-name--form">
                <v-flex>
                  <p class="title font-weight-light">
                    Your Kreoh Site is being generated!
                  </p>
                </v-flex>
                <div class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <v-flex>
                  <transition
                    enter-active-class="animated fadeIn faster"
                    leave-active-class="animated fadeOut faster"
                    mode="out-in"
                  >
                    <p class="font-italic">{{ current_waiting_line }}</p>
                  </transition>
                </v-flex>
              </v-flex>
            </transition>
          </v-flex>
          <v-flex
            class="creation-name-preview-container elevation-1 pa-3 d-flex flex-column justify-center align-center"
          >
            <p class="subtitle-1">Info</p>
            <p class="">
              Your site name is what appears in a tab when it is opened.
            </p>
            <p class="">
              The structure of your kreoh site name will be the text you entered
              above followed by the name of the current tab. These are separated
              by a hyphen.
            </p>
            <p>
              See below for a preview
            </p>
            <v-flex
              class="creation-name--preview elevation-1 mt-5 d-flex flex-column"
            >
              <v-flex class="creation-name--preview-tabs d-flex align-end px-1">
                <div
                  class="creation-name--preview-tab-item d-flex align-center justify-center px-4"
                >
                  <v-icon class="pr-1">mdi-account</v-icon>
                  <span>{{ site_name }} - Home</span>
                </div>
              </v-flex>
              <v-flex
                class="creation-name--preview-search px-3 d-flex align-center justify-center"
              >
                <v-icon class="creation-name--preview-search-icon pa-1 mx-1">
                  mdi-chevron-left
                </v-icon>
                <v-icon class="creation-name--preview-search-icon pa-1 mx-1">
                  mdi-chevron-right
                </v-icon>
                <v-flex class="ml-2 creation-name--preview-search-bar"></v-flex>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-flex>
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
    <v-snackbar v-model="saving" color="info" :timeout="0" top>
      Saving text...
    </v-snackbar>
    <transition
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
      mode="out-in"
    >
      <v-toolbar v-show="is_editing" class="editor-toolbar">
        <editor-menu-bar
          v-slot="{ commands, isActive, getMarkAttrs }"
          :editor="activeEditor"
        >
          <div
            class="d-flex justify-space-between align-center edit-items-container"
          >
            <v-btn icon class="mr-1" color="error" @click="is_editing = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-divider vertical></v-divider>
            <v-overflow-btn
              v-model="editor_font_size"
              :items="font_size_classes"
              label="Select size"
              class="font-size-btn"
              hide-details
              overflow
              @change="commands.font_size({ class: $event })"
            ></v-overflow-btn>
            <v-divider vertical></v-divider>
            <v-btn-toggle dense group multiple color="primary">
              <v-btn
                :class="{
                  'not-active': !isActive.bold(),
                  'is-active v-btn--active v-item--active': isActive.bold()
                }"
                @click="commands.bold"
              >
                <v-icon>mdi-format-bold</v-icon>
              </v-btn>
              <v-btn
                :class="{
                  'not-active': !isActive.italic(),
                  'is-active v-btn--active v-item--active': isActive.italic()
                }"
                @click="commands.italic"
              >
                <v-icon>mdi-format-italic</v-icon>
              </v-btn>
              <v-btn
                :class="{
                  'not-active': !isActive.underline(),
                  'is-active v-btn--active v-item--active': isActive.underline()
                }"
                @click="commands.underline"
              >
                <v-icon>mdi-format-underline</v-icon>
              </v-btn>
              <v-btn
                :class="{
                  'not-active': !isActive.strike(),
                  'is-active v-btn--active v-item--active': isActive.strike()
                }"
                @click="commands.strike"
              >
                <v-icon>mdi-format-strikethrough</v-icon>
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn
                :class="{
                  'not-active': !isActive.blockquote(),
                  'is-active v-btn--active v-item--active': isActive.blockquote()
                }"
                @click="commands.blockquote"
              >
                <v-icon>mdi-format-quote-close</v-icon>
              </v-btn>
              <v-btn
                :class="{
                  'not-active': !isActive.link(),
                  'is-active v-btn--active v-item--active': isActive.link()
                }"
                @click="showLinkMenu(getMarkAttrs('link'))"
              >
                <v-icon>mdi-link</v-icon>
              </v-btn>
              <v-btn
                :class="{
                  'not-active': !isActive.ordered_list(),
                  'is-active v-btn--active v-item--active': isActive.ordered_list()
                }"
                @click="commands.ordered_list"
              >
                <v-icon>mdi-format-list-numbered</v-icon>
              </v-btn>
              <v-btn
                :class="{
                  'not-active': !isActive.bullet_list(),
                  'is-active v-btn--active v-item--active': isActive.bullet_list()
                }"
                @click="commands.bullet_list"
              >
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-btn>
              <v-btn
                :class="{
                  'not-active': !isActive.code_block(),
                  'is-active v-btn--active v-item--active': isActive.code_block()
                }"
                @click="commands.code_block"
              >
                <v-icon>mdi-code-tags</v-icon>
              </v-btn>
              <v-btn class="not-active" @click="commands.undo">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-btn class="not-active" @click="commands.redo">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn-toggle
                v-model="editor_align_btn"
                dense
                group
                mandatory
                color="primary"
              >
                <v-btn
                  key="0"
                  :class="{
                    'not-active': !isActive.left_align(),
                    'is-active v-btn--active v-item--active': isActive.left_align()
                  }"
                  @click="toggleAlign(isActive, commands, 'left')"
                >
                  <v-icon>mdi-format-align-left</v-icon>
                </v-btn>
                <v-btn
                  key="1"
                  :class="{
                    'not-active': !isActive.center_align(),
                    'is-active v-btn--active v-item--active': isActive.center_align()
                  }"
                  @click="toggleAlign(isActive, commands, 'center')"
                >
                  <v-icon>mdi-format-align-center</v-icon>
                </v-btn>
                <v-btn
                  key="2"
                  :class="{
                    'not-active': !isActive.right_align(),
                    'is-active v-btn--active v-item--active': isActive.right_align()
                  }"
                  @click="toggleAlign(isActive, commands, 'right')"
                >
                  <v-icon>mdi-format-align-right</v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-btn-toggle>
            <v-dialog v-model="linkMenuIsActive" width="500">
              <v-card>
                <v-card-title>Add Link</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-sheet>
                      <v-text-field
                        ref="linkInput"
                        v-model="linkUrl"
                        dense
                        placeholder="https://"
                        clearable
                        prepend-inner-icon="mdi-link"
                        @keydown.esc="hideLinkMenu"
                        @keydown.enter="setLinkUrl(commands.link, linkUrl)"
                      ></v-text-field>
                    </v-sheet>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="success"
                    @click.stop="setLinkUrl(commands.link, linkUrl)"
                  >
                    <v-icon>mdi-content-save</v-icon> Save
                  </v-btn>
                  <v-btn color="error" @click="hideLinkMenu">
                    <v-icon>mdi-close</v-icon> Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </editor-menu-bar>
      </v-toolbar>
    </transition>
    <!-- <v-overlay z-index="10" :value="show_tutorial" class="tutorial--container">
      <v-btn v-if="tutorial_step === 1" color="info" class="tutorial--btn">
        Continue
      </v-btn>
    </v-overlay> -->
  </div>
</template>

<style lang="scss" scoped>
// @import '~animate.css/animate.min.css';
</style>
