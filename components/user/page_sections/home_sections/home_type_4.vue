<script>
import { EditorContent } from 'tiptap'
export default {
  components: { EditorContent },
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
    },
    editor: {
      default: null,
      type: Object
    }
  },
  data() {
    return {
      // editor: new Editor({
      //   editable: this.preview || this.live,
      //   extensions: [
      //     // new AlignCenter(),
      //     // new AlignRight(),
      //     // new AlignLeft(),
      //     new Align(),
      //     new Heading(),
      //     new Bold(),
      //     new BulletList(),
      //     new Blockquote(),
      //     new ListItem(),
      //     new Italic(),
      //     new Link(),
      //     new OrderedList(),
      //     new Strike(),
      //     new Underline(),
      //     new History(),
      //     new CodeBlock(),
      //     new Code(),
      //     new TrailingNode({
      //       node: 'paragraph',
      //       notAfter: ['paragraph']
      //     })
      //   ],
      //   content: `
      //   <h3>An Awesome Title</h3>
      //   <p>C'mon! Get Writing!</p>
      //   `,
      //   onFocus: () => {
      //     if (this.editor_timeout !== null) {
      //       clearTimeout(this.editor_timeout)
      //     }
      //     this.is_editing = true
      //   },
      //   onBlur: () => {
      //     this.editor_timeout = setTimeout(() => {
      //       this.is_editing = false
      //     }, 1200)
      //   }
      // }),
      // is_editing: false,
      // editor_timeout: null,
    }
  },
  computed: {
    html() {
      return this.$store.state.creator.site_props[this.options.input_dict_name]
    }
  },
  mounted() {
    if (this.editor) {
      this.editor.setContent(this.html)
    }
  }
}
</script>

<template>
  <v-layout column class="d-flex flex-column component-layout">
    <client-only>
      <editor-content :editor="editor" />
    </client-only>
  </v-layout>
</template>

<style lang="scss">
.component-layout {
  height: 100%;
  overflow: auto;
}

.editor-btn {
  height: 100%;
}
</style>
