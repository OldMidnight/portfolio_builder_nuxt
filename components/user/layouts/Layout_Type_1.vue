<script>
import Navbar from '@/components/user/navbars/navbar_type_1'
import LoadableComponent from '@/components/helpers/loadable_component'
export default {
  components: {
    Navbar,
    LoadableComponent
  },
  props: {},
  data() {
    return {
      activeNav: 'home',
      activeNav_index: 1
    }
  },
  computed: {
    site_props() {
      return this.$store.state.creator.site_props
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
        return {
          color: 'none',
          borderColor: 'none'
        }
      }
    }
  },
  mounted() {
    if (this.site_props.custom_background) {
      document.getElementById(
        'site-wrapper'
      ).style.backgroundColor = this.site_props.background.color
    }
    if (this.site_props.custom_foreground) {
      document.querySelector(
        '.content-body'
      ).style.backgroundColor = this.site_props.foreground.color
      document.querySelector(
        '.nav-bar'
      ).style.backgroundColor = this.site_props.foreground.color
    }
  },
  methods: {
    changeNav(e) {
      this.activeNav = e.value
    },
    changeNavIndex(e) {
      this.activeNav_index = e.value
    },
    changePage(direction) {
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
    }
  }
}
</script>

<template>
  <v-container id="site-wrapper" class="main" fill-height>
    <v-layout
      align-center
      class="site-container d-flex flex-column justify-center align-center"
      :class="{
        'slate-light': site_props.selected_theme === 1,
        matrix: site_props.selected_theme === 3
      }"
      column
    >
      <v-layout align-center class="page-wrapper">
        <v-btn
          v-if="site_props.navigation === 1"
          :icon="site_props.textify && site_props.navigation_style === '1'"
          :text="site_props.textify"
          :color="getThemeColor('back')"
          :outlined="site_props.navigation_style === '2'"
          :rounded="site_props.navigation_style === '3'"
          :fab="site_props.navigation_style === '1'"
          class="sidenav-btn-left"
          @click="changePage('left')"
        >
          <v-icon
            v-if="site_props.navigation_style === '1'"
            :color="site_props.navigation_text_color"
            class="x2"
          >
            mdi-chevron-left
          </v-icon>
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
        <v-layout
          column
          class="page-container"
          :style="check_color_style"
          :class="{
            'extra-width': site_props.navigation === 2,
            'has-border':
              site_props.text_border_color && site_props.selected_theme === null
          }"
        >
          <Navbar
            class="nav-bar"
            @changeNav="changeNav($event)"
            @changeNavIndex="changeNavIndex($event)"
          ></Navbar>
          <v-flex
            class="content-body"
            :class="{
              slate: site_props.selected_theme === 1,
              'matrix-card': site_props.selected_theme === 3
            }"
          >
            <v-flex
              v-if="activeNav === 'home'"
              class="content home-content"
              :class="{
                slate: site_props.selected_theme === 1,
                matrix: site_props.selected_theme === 3
              }"
            >
              <transition
                enter-active-class="animated fadeIn faster"
                leave-active-class="animated fadeOut faster"
                mode="out-in"
              >
                <v-flex v-for="page in home_pages" :key="page.id" class="page">
                  <LoadableComponent
                    :component-name="page.component"
                    :options="{
                      input_dict_name:
                        activeNav + '_page_' + activeNav_index + '_inputs',
                      live: true,
                      height: '250',
                      width: '250'
                    }"
                  >
                  </LoadableComponent>
                </v-flex>
              </transition>
            </v-flex>
            <v-flex
              v-if="activeNav === 'projects'"
              class="content projects-content"
              :class="{
                slate: site_props.selected_theme === 1,
                matrix: site_props.selected_theme === 3
              }"
            >
              <transition
                name="page"
                enter-active-class="animated fadeIn faster"
                leave-active-class="animated fadeOut faster"
                mode="out-in"
              >
                <v-flex
                  v-for="page in projects_pages"
                  :key="page.id"
                  class="page"
                  :class="{
                    slate: site_props.selected_theme === 1,
                    matrix: site_props.selected_theme === 3
                  }"
                >
                  <LoadableComponent
                    :component-name="page.component"
                    :options="{
                      input_dict_name:
                        activeNav + '_page_' + activeNav_index + '_inputs',
                      live: true,
                      height: '250',
                      width: '250'
                    }"
                  >
                  </LoadableComponent>
                </v-flex>
              </transition>
            </v-flex>
            <v-flex
              v-if="activeNav === 'resume'"
              class="content resume-content"
              :class="{
                slate: site_props.selected_theme === 1,
                matrix: site_props.selected_theme === 3
              }"
            >
              <transition
                name="page"
                enter-active-class="animated fadeIn faster"
                leave-active-class="animated fadeOut faster"
                mode="out-in"
              >
                <v-flex
                  v-for="page in resume_pages"
                  :key="page.id"
                  class="page"
                  :class="{
                    slate: site_props.selected_theme === 1,
                    matrix: site_props.selected_theme === 3
                  }"
                >
                  <LoadableComponent
                    :component-name="page.component"
                    :options="{
                      input_dict_name:
                        activeNav + '_page_' + activeNav_index + '_inputs',
                      live: true,
                      height: '250',
                      width: '250'
                    }"
                  >
                  </LoadableComponent>
                </v-flex>
              </transition>
            </v-flex>
          </v-flex>
          <slot />
        </v-layout>
        <v-btn
          v-if="site_props.navigation === 1"
          :icon="site_props.textify && site_props.navigation_style === '1'"
          :text="site_props.textify"
          :color="getThemeColor('next')"
          :outlined="site_props.navigation_style === '2'"
          :rounded="site_props.navigation_style === '3'"
          :fab="site_props.navigation_style === '1'"
          class="sidenav-btn-right"
          @click="changePage('right')"
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
      <v-layout v-if="site_props.navigation === 0" class="bottom-nav-arrows">
        <v-flex>
          <v-btn
            v-if="site_props.navigation === 0"
            :icon="site_props.textify && site_props.navigation_style === '1'"
            :text="site_props.textify"
            :color="getThemeColor('back')"
            :outlined="site_props.navigation_style === '2'"
            :rounded="site_props.navigation_style === '3'"
            :fab="site_props.navigation_style === '1'"
            class="bottom-nav-btn-left"
            large
            @click="changePage('left')"
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
        </v-flex>
        <v-flex class="d-flex justify-end">
          <v-btn
            v-if="site_props.navigation === 0"
            :icon="site_props.textify && site_props.navigation_style === '1'"
            :text="site_props.textify"
            :color="getThemeColor('next')"
            :outlined="site_props.navigation_style === '2'"
            :rounded="site_props.navigation_style === '3'"
            :fab="site_props.navigation_style === '1'"
            class="bottom-nav-btn-right"
            large
            @click="changePage('right')"
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
  </v-container>
</template>

<style lang="scss" scoped>
// @import '~animate.css/animate.min.css';

.main {
  max-width: none !important;
  padding: 0px !important;
}

.site-container {
  height: 100% !important;
}

.page-wrapper {
  width: 60%;
  min-height: 85%;
  max-height: 85%;
  // margin-top: 2% !important;
  // margin-bottom: 2% !important;
  // background-color: #fafafa;
}

.bottom-nav-arrows {
  min-height: 5%;
  max-height: 5%;
  width: 20%;
  margin: 0 !important;
  // border: 1px solid;
}

.sidenav-btn-left {
  margin-right: 5%;
}

.sidenav-btn-right {
  margin-left: 5%;
}

.dark-nav-text {
  color: black;
}

.white-nav-text {
  color: white;
}

.page-container {
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

.extra-width {
  width: 100%;
}

.content-body {
  width: 100%;
  max-height: 87%;
  height: 87%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: white;
}

.matrix-card {
  background-color: black !important;
  color: #00e676;
  border-bottom: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 20px;
}

.page {
  width: 100%;
  height: 100%;
  // background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  // color: white;
  // border: 1px solid;
}

.sidenav-btn-left {
  margin-right: 5%;
}

.sidenav-btn-right {
  margin-left: 5%;
}

.x2 {
  font-size: 48px !important;
}
</style>
