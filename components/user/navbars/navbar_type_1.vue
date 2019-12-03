<script>
export default {
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
  methods: {
    changeActiveNav(navName) {
      this.activeNav = navName
      this.activeNav_index = 1
      this.$emit('changeNav', {
        value: navName
      })
      this.$emit('changeNavIndex', {
        value: 1
      })
    }
  }
}
</script>

<template>
  <v-flex
    class="top-nav nav-bar"
    :class="{
      'matrix-card-opp': site_props.selected_theme === 3,
      'nav-slate': site_props.selected_theme === 1
    }"
  >
    <!-- NAV ITEMS -->
    <v-flex
      class="top-nav-item nav-home d-flex justify-center"
      :style="check_color_style"
      :class="{
        active: activeNav === 'home' && !site_props.text_border_color,
        customActive:
          activeNav === 'home' &&
          site_props.text_border_color &&
          site_props.selected_theme === null,
        'nav-item-slate': site_props.selected_theme === 1,
        'nav-item-matrix': site_props.selected_theme === 3,
        'dark-nav-text': site_props.tab_text_color === 'black',
        'white-nav-text': site_props.tab_text_color === 'white'
      }"
      @click.stop="changeActiveNav('home')"
    >
      <p class="nav-text headline align-self-center font-weight-light ma-0">
        {{ site_props.nav_titles.home }}
      </p>
    </v-flex>

    <v-flex
      class="top-nav-item nav-projects d-flex justify-center"
      :style="check_color_style"
      :class="{
        active: activeNav === 'projects' && !site_props.text_border_color,
        customActive:
          activeNav === 'projects' &&
          site_props.text_border_color &&
          site_props.selected_theme === null,
        'nav-item-slate': site_props.selected_theme === 1,
        'nav-item-matrix': site_props.selected_theme === 3,
        'dark-nav-text': site_props.tab_text_color === 'black',
        'white-nav-text': site_props.tab_text_color === 'white'
      }"
      @click.stop="changeActiveNav('projects')"
    >
      <p class="nav-text headline align-self-center font-weight-light ma-0">
        {{ site_props.nav_titles.projects }}
      </p>
    </v-flex>

    <v-flex
      class="top-nav-item nav-resume d-flex justify-center"
      :style="check_color_style"
      :class="{
        active: activeNav === 'resume' && !site_props.text_border_color,
        customActive:
          activeNav === 'resume' &&
          site_props.text_border_color &&
          site_props.selected_theme === null,
        'nav-item-slate': site_props.selected_theme === 1,
        'nav-item-matrix': site_props.selected_theme === 3,
        'dark-nav-text': site_props.tab_text_color === 'black',
        'white-nav-text': site_props.tab_text_color === 'white'
      }"
      @click.stop="changeActiveNav('resume')"
    >
      <p class="nav-text headline align-self-center font-weight-light ma-0">
        {{ site_props.nav_titles.resume }}
      </p>
    </v-flex>
  </v-flex>
</template>

<style lang="scss" scoped>
.top-nav {
  display: flex;
  padding: 0 !important;
  width: 100%;
  max-height: 15%;
  height: 15%;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  // border-bottom: 1px solid #b6b6b6;
}

.top-nav-item {
  border-bottom-color: green;
  height: 100%;
  margin: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  // border-left: 1px solid;
}

.top-nav-item.active {
  border-bottom-width: 3px;
  border-bottom-style: solid;
}

.top-nav-item.customActive {
  border-bottom-width: 3px;
  border-bottom-style: solid;
}

.top-nav-item:hover {
  transition: 0.2s;
  // box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-bottom-width: 3px;
  border-bottom-style: solid;
}

.nav-item-slate {
  color: white !important;
  background-color: #8c8c8c !important;
  // border-bottom: 3px solid blue !important;
}

.nav-item-matrix {
  color: #00e676 !important;
  background-color: black !important;
}

.nav-item-slate.active {
  border-bottom: 3px solid #66a3ff !important;
}

.nav-slate {
  color: white !important;
  background-color: #8c8c8c !important;
}

.nav-item-slate:hover {
  border-bottom: 3px solid #66a3ff !important;
}

.nav-item-matrix.active {
  border-bottom: 3px solid green !important;
}

.nav-item-matrix:hover {
  border-bottom: 3px solid green !important;
}

.dark-nav-text {
  color: black;
}

.white-nav-text {
  color: white;
}

.matrix-card-opp {
  background-color: black !important;
  color: #00e676;
  border-top: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
}

@media (max-width: 600px) {
  .nav-text {
    font-size: 14px !important;
  }
}

@media (min-width: 601px) and (max-width: 850px) {
  .nav-text {
    font-size: 20px !important;
  }
}

@media (min-width: 851px) and (max-width: 1100px) {
  .user-img-container {
    height: 200px;
    width: 200px;
  }

  .header {
    font-size: 32px !important;
    // overflow: auto;
  }

  .tag {
    font-size: 12px !important;
  }
}

@media (min-width: 1101px) {
  .user-img-container {
    height: 250px;
    width: 250px;
  }
}
</style>
