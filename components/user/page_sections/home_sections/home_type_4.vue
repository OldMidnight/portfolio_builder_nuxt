<script>
export default {
  props: {
    header: {
      type: String,
      default: 'Text Header Goes Here'
    },
    content: {
      type: String,
      default:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class ante enim fringilla congue, mollis montes nam hendrerit sollicitudin iaculis.'
    },
    options: {
      type: Object,
      default: () => ({
        input_dict_name: null,
        show_theme: null,
        live: null,
        preview: null,
        height: null,
        width: null
      })
    }
  },
  computed: {
    site_props() {
      return this.$store.state.creator.site_props
    }
  },
  methods: {
    updateInput(ev, type, maxLength) {
      if (ev.target.textContent.length <= maxLength) {
        this.$emit('update', {
          type,
          value: ev.target.textContent
        })
      } else {
        // eslint-disable-next-line prettier/prettier
        ev.target.textContent = this.site_props[this.options.input_dict_name][type]
      }
    }
  }
}
</script>

<template>
  <v-layout column class="d-flex flex-column justify-center align-center">
    <div class="header-container px-8">
      <p
        contenteditable="true"
        :class="{ 'display-1': !options.preview, title: options.preview }"
        class="header"
        @input="updateInput($event, 'header', 30)"
      >
        {{ header }}
      </p>
    </div>
    <div
      :class="{ 'px-8 mx-8': !options.preview, 'px-2 mx-2': options.preview }"
      class="content-container"
    >
      <p
        v-if="!options.preview"
        contenteditable="true"
        class="content subtitle-1"
        @input="updateInput($event, 'content', 300)"
      >
        {{ content }}
      </p>
      <p v-else class="content caption">
        Lorem ipsum dolor sit amet consectetur adipiscing elit, varius eu class
        ante enim fringilla congue...
      </p>
    </div>
  </v-layout>
</template>

<style lang="scss" scoped>
.header-container {
  width: 100%;
}

.header {
  text-align: center;
  max-width: 100%;
  overflow: auto;
}

.small-text {
  font-size: 10px;
}

.content-container {
  width: 100%;
}

.content {
  max-width: 100%;
  overflow: auto;
  text-align: center;
}
</style>
