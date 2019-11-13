<script>
export default {
  auth: false,
  beforeCreate() {
    if (
      this.$store.state.creator.is_subdomain &&
      this.$store.state.creator.domain.available
    ) {
      this.$router.push({ path: '/' })
    }
  },
  head() {
    return {
      title: 'Site Disabled'
    }
  }
}
</script>

<template>
  <p>test</p>
</template>

<style lang="scss" scoped></style>
