<script>
export default {
  props: {
    componentName: {
      type: String,
      default: () => null
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    componentLoader() {
      const name = this.componentName
      return () => import(`@/components/user/page_sections/${name}`)
    }
  },
  mounted() {
    if (this.$props.componentName) {
      this.loadComponent()
    }
  },
  methods: {
    loadComponent() {
      this.componentLoader()
    },
    emitLoad(e) {
      this.$emit('load', e)
    },
    emitUpdate(e) {
      this.$emit('update', e)
    }
  }
}
</script>

<template>
  <component
    :is="componentLoader"
    :options="options"
    @load="emitLoad($event)"
    @update="emitUpdate($event)"
  >
  </component>
</template>

<style lang="scss" scoped></style>
