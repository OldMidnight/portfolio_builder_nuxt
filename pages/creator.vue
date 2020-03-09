<script>
import { EditorMenuBar } from 'tiptap'
import LoadableComponent from '@/components/helpers/loadable_component'
import CreatorMixins from '@/mixins/CreatorMixins'
export default {
  layout: 'creation_layout',
  components: { LoadableComponent, EditorMenuBar },
  transitions: {
    enterActiveClass: 'animated fadeInLeft',
    leaveActiveClass: 'animated fadeOutRight'
  },
  mixins: [CreatorMixins]
}
</script>

<template>
  <v-row
    justify="center"
    align="center"
    :class="`${isMobile ? 'h-90 pos-rel' : 'h-100'} w-100 px-md-9 py-md-5 ma-0`"
  >
    <transition
      appear
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
      mode="out-in"
    >
      <v-col v-if="checkStepCount(0)" key="0" cols="12" class="py-0 h-100 px-9">
        <div :class="`${isMobile ? 'w-100 h-5' : 'creation-step-header'}`">
          <p
            class="text-center ma-0"
            :style="{ fontSize: isMobile ? '' : '36px' }"
          >
            {{ isMobile ? 'Swipe and' : '' }} Select a layout!
          </p>
        </div>

        <v-row v-if="!isMobile" align="center" class="h-90 w-100">
          <v-col
            v-for="(layout, index) in layouts"
            :id="'layout-' + index"
            :key="index"
            cols="4"
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
          </v-col>
        </v-row>
        <v-carousel
          v-else
          v-model="currentLayout"
          height="95%"
          hide-delimiters
          :class="
            `elevation-1 ${
              layouts[currentLayout].component_name === site_props.layout
                ? 'border-primary border-lg'
                : ''
            } rounded`
          "
        >
          <v-carousel-item
            v-for="(layout, index) in layouts"
            :id="`layout-${index}`"
            :key="index"
            :src="layout.preview_image"
            contain
            class="rounded h-85"
          ></v-carousel-item>
          <div class="w-100 d-flex flex-column align-center h-15">
            <p>{{ layouts[currentLayout].name }}</p>
            <v-btn
              :color="
                layouts[currentLayout].component_name === site_props.layout
                  ? 'success'
                  : 'info'
              "
              :disabled="currentLayout !== 0"
              @click="selectLayout(currentLayout)"
            >
              {{
                layouts[currentLayout].component_name === site_props.layout
                  ? 'Selected'
                  : 'Select'
              }}
            </v-btn>
          </div>
        </v-carousel>
      </v-col>

      <v-col
        v-else-if="checkStepCount(1) && isMobile"
        key="1"
        cols="12"
        class="pa-0 h-100 main-light-theme"
      >
        <v-row align="center" class="ma-0 h-100">
          <v-col
            v-if="site_props.layout === layouts[0].component_name"
            cols="12"
            class="pa-0 h-100"
            :style="check_color_style"
            :class="{
              'has-border':
                site_props.text_border_color &&
                site_props.selected_theme === null
            }"
          >
            <div
              class="d-flex m-c--top-nav"
              :class="{ 'matrix-card-opp': site_props.selected_theme === 2 }"
            >
              <v-flex
                class="preview-1-top-nav-item nav-home d-flex justify-center"
                :style="check_color_style"
                :class="{
                  active: activeNav === 'home' && !site_props.text_border_color,
                  customActive:
                    activeNav === 'home' &&
                    site_props.text_border_color &&
                    site_props.selected_theme === null,
                  'nav-1-item-slate': site_props.selected_theme === 1,
                  'nav-1-item-matrix': site_props.selected_theme === 2,
                  'dark-nav-text': site_props.tab_text_colors.home === 'black',
                  'white-nav-text': site_props.tab_text_colors.home === 'white'
                }"
                @click.stop="changeActiveNav('home')"
              >
                <p class="align-self-center ma-0 font-weight-light">
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
                <p class="align-self-center ma-0 font-weight-light">
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
                <p class="align-self-center ma-0 font-weight-light">
                  {{ site_props.nav_titles.resume }}
                </p>
              </v-flex>
            </div>
            <div
              class="m-c--main-body h-100 w-100 pos-rel"
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
                  class="d-flex justify-center h-100 w-100 pos-abs ma-0 ovfl-y"
                  :class="{
                    slate: site_props.selected_theme === 1,
                    matrix: site_props.selected_theme === 2
                  }"
                >
                  <v-col
                    v-for="preview_page in home_pages"
                    :key="preview_page.id"
                    cols="12"
                    class="w-100 h-100 pos-rel d-flex justify-center align-center"
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
                <v-row
                  v-if="activeNav === 'projects'"
                  key="projects"
                  justify="center"
                  class="h-100 w-100 ma-0 ovfl-y"
                  :class="{
                    slate: site_props.selected_theme === 1,
                    matrix: site_props.selected_theme === 2
                  }"
                >
                  <v-col
                    v-for="preview_page in projects_pages"
                    :key="preview_page.id"
                    class="w-100 h-100 d-flex justify-center align-center"
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
                  </v-col>
                </v-row>
                <v-row
                  v-if="activeNav === 'resume'"
                  key="resume"
                  justify="center"
                  class="h-100 w-100 ma-0"
                  :class="{
                    slate: site_props.selected_theme === 1,
                    matrix: site_props.selected_theme === 2
                  }"
                >
                  <v-col
                    v-for="preview_page in resume_pages"
                    :key="preview_page.id"
                    class="w-100 h-100 d-flex justify-center align-center pa-0"
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
                  </v-col>
                </v-row>
              </transition-group>
            </div>
          </v-col>

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
        </v-row>
      </v-col>

      <v-row
        v-else-if="checkStepCount(1) && !isMobile"
        key="2"
        justify="center"
        class="h-100 w-100 ma-0"
      >
        <v-col cols="4" class="pa-0 px-3 pos-rel ovfl-y">
          <div class="title">Customize Your Website</div>

          <v-row align="center" class="ma-0 pos-abs w-100 px-2">
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
        </v-col>

        <v-col
          id="creation-step-preview"
          cols="8"
          class="d-flex flex-column align-center h-100 border rounded pa-0 main-light-theme"
          :class="{
            'slate-light': site_props.selected_theme === 1,
            matrix: site_props.selected_theme === 2
          }"
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
                      class="preview-1-page pa-0 pos-rel"
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
        </v-col>
      </v-row>

      <v-col v-else-if="checkStepCount(2)" key="3" cols="12" class="h-100 pa-0">
        <v-row class="ma-0 h-100 w-100">
          <v-col cols="12" class="h-50 d-flex justify-center align-center">
            <transition
              enter-active-class="animated fadeIn faster"
              leave-active-class="animated fadeOut faster"
              mode="out-in"
            >
              <v-form
                v-if="!validating"
                ref="editor_site_name_form"
                class="elevation-2 pa-5 px-9 d-flex flex-column align-center justify-center"
              >
                <span class="headline mb-2">Enter Your site name</span>
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
              <v-flex
                v-else
                class="w-40 d-flex flex-column align-center justify-center"
              >
                <v-flex>
                  <p class="title font-weight-light">
                    Your Kreoh Site is being generated!
                  </p>
                </v-flex>
                <div class="lds-ellipsis">
                  <div v-for="(circle, index) in 4" :key="index"></div>
                  <!-- <div></div>
                  <div></div>
                  <div></div> -->
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
          </v-col>
          <v-col
            cols="12"
            class="h-50 d-flex flex-column justify-center align-center"
          >
            <div
              :class="
                `${
                  isMobile ? 'w-90' : 'w-40'
                } d-flex flex-column align-center justify-center text-center`
              "
            >
              <p class="subtitle-1 font-weight-bold">Info</p>
              <p :class="`${isMobile ? 'caption' : ''}`">
                Your site name is what appears in a tab when it is opened.
              </p>
              <p :class="`${isMobile ? 'caption' : ''}`">
                The structure of your kreoh site name will be the text you
                entered above followed by the name of the current tab. These are
                separated by a hyphen.
              </p>
              <p :class="`${isMobile ? 'caption' : ''} font-weight-bold`">
                See below for a preview
              </p>
            </div>
            <v-row
              :class="
                `creation-name--preview ${
                  isMobile ? 'w-90' : 'w-60'
                } ma-0 elevation-1 mt-md-4`
              "
            >
              <v-col
                cols="12"
                class="creation-name--preview-tabs d-flex align-end pa-0 px-1 h-50 pt-md-6"
              >
                <div
                  class="creation-name--preview-tab-item d-flex align-center justify-center px-4"
                >
                  <v-icon class="pr-1">mdi-account</v-icon>
                  <span>{{ site_name }} - Home</span>
                </div>
              </v-col>
              <v-col
                cols="12"
                class="creation-name--preview-search pa-0 px-3 d-flex align-center justify-center h-50"
              >
                <v-icon class="creation-name--preview-search-icon pa-1 mx-1">
                  mdi-chevron-left
                </v-icon>
                <v-icon class="creation-name--preview-search-icon pa-1 mx-1">
                  mdi-chevron-right
                </v-icon>
                <v-flex class="ml-2 creation-name--preview-search-bar"></v-flex>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
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
    <transition
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
      mode="out-in"
    >
      <v-toolbar v-show="is_editing && !nextStepState" class="editor-toolbar">
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
    <v-btn
      v-if="checkStepCount(1) && isMobile"
      color="success"
      class="pos-abs bottom-0 w-100"
      @click="show_tools_drawer = true"
    >
      <v-icon class="mr-2">mdi-cogs</v-icon>Tools
    </v-btn>
    <v-navigation-drawer
      v-if="isMobile"
      v-model="show_tools_drawer"
      app
      bottom
      temporary
      class="creator-tools-drawer d-flex flex-column align-center justify-center"
    >
      <v-expansion-panels class="mt-3" popout>
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
                <v-row class="ma-0">
                  <v-col cols="12">
                    <p class="text-center">Tab Color</p>
                    <v-color-picker
                      v-model="tab_colors.home"
                      :disabled="site_props.selected_theme !== null"
                      hide-inputs
                      hide-canvas
                      show-swatches
                      class="preview-color-pick align-self-center"
                      @input="hideNextStep()"
                    >
                    </v-color-picker>
                  </v-col>
                  <v-col
                    cols="12"
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
                <v-row class="ma-0">
                  <v-col cols="12">
                    <p class="text-center">Tab Color</p>
                    <v-color-picker
                      v-model="tab_colors.projects"
                      :disabled="site_props.selected_theme !== null"
                      hide-inputs
                      hide-canvas
                      show-swatches
                      class="preview-color-pick align-self-center"
                      @input="hideNextStep()"
                    >
                    </v-color-picker>
                  </v-col>
                  <v-col
                    cols="12"
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
                      (!!nav_title_resume && nav_title_resume.length >= 2) ||
                      'Min 2 characters',
                    () =>
                      (!!nav_title_resume && nav_title_resume.length <= 12) ||
                      'Max 12 characters'
                  ]"
                  label="Tab Title"
                  outlined
                  @change="hideNextStep()"
                >
                </v-text-field>
                <v-row class="ma-0">
                  <v-col cols="12">
                    <p class="text-center">Tab Color</p>
                    <v-color-picker
                      v-model="tab_colors.resume"
                      :disabled="site_props.selected_theme !== null"
                      hide-inputs
                      hide-canvas
                      show-swatches
                      class="preview-color-pick align-self-center"
                      @input="hideNextStep()"
                    >
                    </v-color-picker>
                  </v-col>
                  <v-col
                    cols="12"
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
                  <v-img class="black--text" height="200px" :src="theme.img">
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
                    <v-btn color="success" @click.stop="selectTheme(theme.id)">
                      <v-icon v-if="theme.id === site_props.selected_theme" left
                        >mdi-pencil</v-icon
                      >
                      {{ themeSelected(theme.id) }}
                    </v-btn>
                    <v-btn text color="orange" @click.stop="nextTheme('right')">
                      Next
                    </v-btn>
                    <v-btn text color="orange" @click.stop="nextTheme('left')">
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
                class="w-100 d-flex flex-column align-center justify-center"
              >
                <p>Select Color</p>
                <v-color-picker
                  v-model="customise_background_color"
                  hide-inputs
                  hide-canvas
                  show-swatches
                  class="preview-color-pick align-self-center"
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
                class="w-100 d-flex flex-column align-center justify-center"
              >
                <p>Select Color</p>
                <v-color-picker
                  v-model="customise_foreground_color"
                  hide-inputs
                  hide-canvas
                  show-swatches
                  class="preview-color-pick align-self-center"
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
                  class="w-100 d-flex flex-column align-center justify-center"
                >
                  <p>Select Color</p>
                  <v-color-picker
                    v-model="text_border_color_value"
                    hide-inputs
                    hide-canvas
                    show-swatches
                    class="preview-color-pick align-self-center"
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
                    <p class="font-weight-bold">Size: {{ upload.size }}</p>
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
            <v-sheet class="mx-auto" elevation="8" max-width="320">
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
                  <v-row class="fill-height" align="center" justify="center">
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
      <div class="d-flex flex-column align-center mt-3">
        <v-btn
          color="error"
          class="my-1"
          @click="
            emitEvent('onPrevStep')
            show_tools_drawer = false
          "
        >
          Back
        </v-btn>
        <v-btn color="success" class="my-1" @click="emitEvent('onSaveChanges')">
          Save Changes
        </v-btn>
        <v-btn
          color="info"
          class="my-1"
          :disabled="show_next_step === false"
          @click="
            show_tools_drawer = false
            emitEvent('onNextStep')
          "
        >
          Next
        </v-btn>
        <v-progress-linear
          rounded
          value="33"
          :buffer-value="33 + 100 / 3"
          height="8"
          class="w-90 mt-4"
        ></v-progress-linear>
      </div>
    </v-navigation-drawer>
  </v-row>
</template>
