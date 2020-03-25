<script>
export default {
  name: 'MessageCenter',
  layout: 'dashboard_layout',
  data() {
    return {
      messages: [],
      selected_message: null,
      send_support_msg: false,
      support_message: {
        subject: null,
        body: null
      },
      support_message_sent_snack: false,
      support_message_error_snack: false,
      rules: {
        required: (value) => !!value || 'Required.'
      }
    }
  },
  async mounted() {
    await this.$axios.$get('/u/status').then(async (response) => {
      if (!response.email_confirmed) {
        this.emailNotConfirmed = true
      }
      this.messages = response.messages
      if (this.$route.query.id) {
        this.selected_message = this.messages.filter((msg) => {
          return msg.id === Number(this.$route.query.id)
        })[0]
        if (!this.selected_message.read) {
          await this.$axios.$put('/u/msg/read', {
            id: this.selected_message.id
          })
        }
      } else if (this.$route.query.support) {
        this.send_support_msg = true
      }
    })
  },
  methods: {
    async selectMessage(message, index) {
      this.selected_message = message
      if (!this.selected_message.read) {
        await this.$axios.$put('/u/msg/read', { id: this.selected_message.id })
        this.messages[index].read = true
      }
    },
    showSupportForm() {
      this.selected_message = null
      this.send_support_msg = true
    },
    validateForm() {
      if (this.$refs.support_form.validate(true)) {
        this.$axios
          .post('support/send_message', { message: this.support_message })
          .then(() => {
            this.support_message_sent_snack = true
            this.support_message = { subject: null, body: null }
          })
          .catch(() => {
            this.support_message_error_snack = true
          })
      }
    }
  }
}
</script>

<template>
  <v-row class="ma-0 px-2">
    <v-col cols="12" class="messages--top-nav h-10 border-bottom">
      <v-row class="ma-0 h-100">
        <v-col cols="4" class="pa-0 d-flex align-center">
          <v-btn color="info" rounded class="mr-3" nuxt to="/dashboard">
            Back
          </v-btn>
          <p class="headline font-weight-light">Message Center</p>
        </v-col>
        <v-col cols="8" class="pa-0 d-flex justify-end pr-3 align-center">
          <v-btn color="info" large tile @click="showSupportForm()">
            Contact Us
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="pos-rel pa-0 h-90">
      <v-row class="ma-0 h-100 pos-abs w-100" align="center">
        <v-col cols="3" class="h-95 ovfl-y my-2">
          <p class="title mb-4">Your Messages</p>
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="messages-container my-1"
            style="cursor: pointer"
          >
            <v-hover v-slot:default="{ hover }">
              <div
                class="message pa-3 d-flex justify-space-between"
                :class="{ 'elevation-1': !hover, 'elevation-3': hover }"
                @click="selectMessage(message, index)"
              >
                <div class="message-details d-flex flex-column justify-center">
                  <span :style="{ fontSize: '16px' }">
                    {{ message.subject }}
                  </span>
                  <span :style="{ fontSize: '12px' }">
                    {{ message.sender }}
                  </span>
                  <span :style="{ fontSize: '12px' }">
                    {{ message.time_sent }}
                  </span>
                </div>
                <div
                  class="message-icon d-flex flex-column justify-center align-center"
                >
                  <v-icon large color="info">
                    mdi-{{ message.read ? 'email-open' : 'email' }}
                  </v-icon>
                </div>
              </div>
            </v-hover>
          </div>
        </v-col>
        <v-col cols="9" class="border-rounded elevation-1 h-95">
          <transition
            enter-active-class="animated fadeIn faster"
            leave-active-class="animated fadeOut faster"
            mode="out-in"
          >
            <div
              v-if="selected_message === null && !send_support_msg"
              class="d-flex w-100 h-100 justify-center align-center"
            >
              <v-icon x-large class="mx-2">mdi-message</v-icon>
              <h1>Select A Message To Begin!</h1>
            </div>
            <div
              v-else-if="selected_message !== null && !send_support_msg"
              class="w-100 h-100"
            >
              <p class="font-weight-bold border-bottom" style="font-size: 30px">
                {{ selected_message.subject }}
              </p>
              <p class="font-weight-bold my-2" style="font-size: 12px">
                Sender: {{ selected_message.sender }} -
                {{ selected_message.address }}
              </p>
              <p
                class="font-weight-bold border-bottom my-2"
                style="font-size: 12px"
              >
                {{ selected_message.time_sent }}
              </p>
              <p style="white-space: pre-wrap">{{ selected_message.body }}</p>
            </div>
            <v-row v-else class="ma-0">
              <v-col cols="12" class="text-center">
                <p class="font-weight-bold" style="font-size: 30px">
                  Send us a message!
                </p>
                <p class="px-6">
                  Found a bug that needs squashing? Maybe some help on a
                  particular feature? Or maybe you just want to ask the weather.
                  Whatever the issue, use the below form to send your message
                  and we'll get back to you as soon and we possibly can!
                </p>
              </v-col>
              <v-col cols="12">
                <v-form ref="support_form">
                  <v-text-field
                    v-model="support_message.subject"
                    :rules="[rules.required]"
                    outlined
                    counter
                    maxlength="120"
                    label="Message Subject"
                  ></v-text-field>
                  <v-textarea
                    v-model="support_message.body"
                    :rules="[rules.required]"
                    outlined
                    counter
                    maxlength="300"
                    label="Message Body"
                  ></v-textarea>
                  <v-btn color="success" @click="validateForm()">
                    <v-icon class="mx-1">mdi-send</v-icon>Send Message
                  </v-btn>
                </v-form>
              </v-col>
            </v-row>
          </transition>
        </v-col>
      </v-row>
    </v-col>
    <v-snackbar v-model="support_message_sent_snack" color="success">
      Support message recieved! Check your email for confirmation.
      <v-btn icon @click="support_message_sent_snack = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="support_message_error_snack" color="error">
      Whoops! There was an error sending that. Please try again later.
      <v-btn icon @click="support_message_error_snack = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-row>
</template>
