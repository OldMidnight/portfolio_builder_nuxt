<script>
export default {
  data() {
    return {
      requestSent: false,
      loading: false,
      success: false,
      message: ''
    }
  },
  methods: {
    async confirmRequest() {
      this.loading = true
      const path = this.$route.path.split('/')
      const token = path[path.length - 1]
      const { data } = await this.$axios
        .post('/u/confirm_email/' + token)
        .catch((e) => {
          const error = JSON.parse(JSON.stringify(e))
          return error.response
        })
      this.loading = false
      this.requestSent = true
      this.success = !data.error
      this.message = data.message
      this.$root.$emit(
        data.error ? 'showError' : !data.error ? 'showSuccess' : 'showError',
        { message: data.message }
      )
      if (!data.error) {
        await this.$axios
          .post('/auth/logout')
          .then(async (_) => {
            const refreshToken = this.$auth.getRefreshToken('local')
            if (refreshToken) {
              this.$axios.setToken('Bearer ' + refreshToken)
              await this.$axios.post('/auth/logout_refresh').catch((e) => {
                const error = JSON.parse(JSON.stringify(e))
                return error.response
              })
            }
          })
          .catch((e) => {
            const error = JSON.parse(JSON.stringify(e))
            return error.response
          })
      }
      setTimeout(() => {
        this.$auth.logout()
      }, 5000)
    }
  }
}
</script>

<template>
  <v-container fluid>
    <v-row
      class="d-flex flex-column w-100 h-100"
      align="center"
      justify="center"
    >
      <v-col
        v-if="!requestSent"
        cols="12"
        class="d-flex flex-column align-center"
      >
        <p class="font-weight-bold mb-7">
          Click the button below to confirm your email
        </p>
        <v-btn
          color="info"
          :disabled="loading"
          :loading="loading"
          @click.once="confirmRequest()"
        >
          Confirm Email
        </v-btn>
      </v-col>
      <v-col v-else cols="12">
        <div class="d-flex flex-column align-center">
          <v-icon
            :color="success ? 'success' : 'error'"
            class="pa-6"
            style="font-size: 60px"
          >
            mdi-{{ success ? 'check-circle' : 'close-circle' }}
          </v-icon>
          <p class="title">{{ message }}</p>
          <p class="text-center">You will be redirected in 5 seconds...</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
