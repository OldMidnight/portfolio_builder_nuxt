<script>
export default {
  middleware: 'available_route_check',
  created() {
    this.$auth.logout()
  }
}
</script>

<template>
  <div></div>
</template>
