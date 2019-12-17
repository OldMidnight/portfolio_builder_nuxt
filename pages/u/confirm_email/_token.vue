<script>
export default {
  data() {
    return {
      msg: '',
      timer: 5,
      logout: false,
      redirect: false
    }
  },
  watch: {
    logout(value) {
      if (value) {
        setInterval(() => {
          if (this.timer > 0) {
            this.timer -= 1
          } else {
            this.$auth.logout()
          }
        }, 1000)
      }
    },
    redirect(value) {
      if (value) {
        setInterval(() => {
          if (this.timer > 0) {
            this.timer -= 1
          } else {
            this.$router.push({ path: '/dashboard' })
          }
        }, 1000)
      }
    }
  },
  mounted() {
    const path = this.$route.path.split('/')
    const token = path[path.length - 1]
    this.$axios
      .post('/u/confirm_email/' + token)
      .then((response) => {
        this.msg = response.data.message
        this.logout = true
      })
      .catch(() => {
        this.msg = 'Link Has Expired.'
        this.redirect = true
      })
  }
}
</script>

<template>
  <v-container fluid>
    <v-layout
      class="d-flex flex-column align-center justify-center"
      fill-height
    >
      <p>{{ msg }}</p>
      <p>Redirecting in {{ timer }} seconds...</p>
    </v-layout>
  </v-container>
</template>
