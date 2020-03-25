<script>
export default {
  name: 'Logout',
  async created() {
    if (!this.$auth.loggedIn) {
      this.$router.push('/suth/login')
    } else {
      const refreshToken = this.$auth.getRefreshToken('local')
      await this.$axios.$post('/logout').then(async (_) => {
        this.$axios.setToken('Bearer ' + refreshToken)
        await this.$axios.$post('/logout_refresh')
      })
      this.$auth.logout()
    }
  }
}
</script>

<template>
  <v-row></v-row>
</template>
