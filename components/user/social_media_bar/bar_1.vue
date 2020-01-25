<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    live: {
      required: true,
      default: false
    }
  },
  data() {
    return {
      edit_social_bar_dialog: false,
      social_media_btns: [
        {
          icon: 'mdi-facebook',
          color: '#3b5998',
          name: 'Facebook',
          url: 'facebook.com/'
        },
        {
          icon: 'mdi-twitter',
          color: '#00aced',
          name: 'Twitter',
          url: 'twitter.com/'
        },
        {
          icon: 'mdi-linkedin',
          color: '#007bb6',
          name: 'LinkedIn',
          url: 'linkedin.com/in/'
        },
        {
          icon: 'mdi-instagram',
          color: '#517fa4',
          name: 'Instagram',
          url: 'instagram.com/'
        },
        {
          icon: 'mdi-snapchat',
          color: '#fffc00',
          name: 'Snapchat',
          url: 'snapchat.com/add/'
        },
        {
          icon: 'mdi-telegram',
          color: '#0072b1',
          name: 'Telegram',
          url: 't.me/'
        },
        {
          icon: 'mdi-github-circle',
          color: '#333333',
          name: 'Github',
          url: 'github.com/'
        },
        {
          icon: 'mdi-youtube',
          color: '#bb0000',
          name: 'Youtube',
          url: 'youtube.com/channel/'
        }
      ],
      selected_social_btns: [],
      selected_social_btns_urls: {}
    }
  },
  computed: {
    site_props() {
      return this.$store.state.creator.site_props
    }
  },
  watch: {
    edit_social_bar_dialog(value) {
      if (!value) {
        this.selected_social_btns = this.site_props.social_media_bar
        this.selected_social_btns_urls = this.site_props.social_media_bar_urls
      }
    }
  },
  mounted() {
    this.selected_social_btns = this.site_props.social_media_bar
    this.selected_social_btns_urls = JSON.parse(
      JSON.stringify(this.site_props.social_media_bar_urls)
    )
  },
  methods: {
    ...mapMutations({
      updatePageImg: 'creator/updatePageImg',
      saveSocialBar: 'creator/saveSocialBar'
    }),
    saveSocial() {
      if (this.$refs.social_btns_form.validate(true)) {
        this.saveSocialBar({
          btns: this.selected_social_btns,
          urls: this.selected_social_btns_urls
        })
        this.edit_social_bar_dialog = false
      }
    }
  }
}
</script>

<template>
  <div class="home--social-bar mt-3 d-flex align-center">
    <v-flex
      v-for="btn_index in site_props.social_media_bar"
      :key="btn_index"
      class="social-bar--btn"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn :color="social_media_btns[btn_index].color" v-on="on">
            <v-icon color="white">
              {{ social_media_btns[btn_index].icon }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ social_media_btns[btn_index].name }}</span>
      </v-tooltip>
    </v-flex>
    <v-flex v-if="!live" class="social-bar--btn">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            class="social-bar--edit-btn"
            tile
            v-on="on"
            @click="edit_social_bar_dialog = true"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Edit Social Buttons</span>
      </v-tooltip>
    </v-flex>
    <v-dialog
      v-model="edit_social_bar_dialog"
      width="700"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title>Edit Social Media Bar</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <span>Edit the buttons available</span>
            <v-item-group multiple mandatory v-model="selected_social_btns">
              <v-form
                ref="social_btns_form"
                class="social-bar-dialog--btn-options d-flex flex-wrap"
              >
                <v-flex
                  v-for="(btn, index) in social_media_btns"
                  :key="index"
                  class="social-bar-dialog--btn mx-2"
                >
                  <v-item v-slot:default="{ toggle, active }">
                    <v-card
                      :color="active ? 'info lighten-2' : 'primary'"
                      class="pa-3 text-center"
                      @click="toggle"
                    >
                      {{ btn.name }}
                      <v-icon :color="active ? 'success' : 'error'">
                        mdi-{{ active ? 'check' : 'close' }}-circle-outline
                      </v-icon>
                    </v-card>
                  </v-item>
                  <v-flex class="social-bar-dialog--input d-flex my-2">
                    <transition
                      enter-active-class="animated fadeIn fast"
                      leave-active-class="animated fadeOut fast"
                      mode="out-in"
                    >
                      <span
                        v-if="selected_social_btns.includes(index)"
                        class="social-bar-dialog--input-start mr-2"
                      >
                        {{ btn.url }}
                      </span>
                    </transition>
                    <transition
                      enter-active-class="animated fadeIn fast"
                      leave-active-class="animated fadeOut fast"
                      mode="out-in"
                    >
                      <v-text-field
                        v-if="selected_social_btns.includes(index)"
                        v-model="selected_social_btns_urls[index]"
                        :rules="[(value) => !!value || 'Required.']"
                        dense
                        label="Url..."
                        outlined
                        class="mt-2 social-bar-dialog--input-field"
                      ></v-text-field>
                    </transition>
                  </v-flex>
                </v-flex>
              </v-form>
            </v-item-group>
          </v-container>
          <v-container class="d-flex flex-column align-center">
            <span>Preview</span>
            <v-layout class="social-bar-dialog--preview d-flex flex-wrap">
              <v-flex
                v-for="btn_index in selected_social_btns"
                :key="btn_index"
                class="social-bar--btn align-center d-flex justify-center my-2"
              >
                <v-btn :color="social_media_btns[btn_index].color">
                  <v-icon color="white">
                    {{ social_media_btns[btn_index].icon }}
                  </v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <!-- <v-container>
            <span>Manage Links</span>
          </v-container> -->
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="success" @click="saveSocial()">
            Save
          </v-btn>
          <v-btn color="error" @click="edit_social_bar_dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.home--social-bar {
  width: 50%;
}

.social-bar--btn {
  // border: 1px solid;
  height: 100%;
}

.social-bar--edit-btn {
  border: 1px dashed;
}
.social-bar-dialog--btn {
  width: 40%;
}

.social-bar-dialog--preview {
  width: 60%;
}

.social-bar-dialog--input-start {
  line-height: 60px;
  font-size: 12px;
}

.social-bar-dialog--input {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
