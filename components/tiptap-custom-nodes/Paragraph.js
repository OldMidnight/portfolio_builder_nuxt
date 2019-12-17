// import { setBlockType } from 'tiptap-commands'
import { Node } from 'tiptap'

export default class ParagraphNode extends Node {
  // getAlignClass(dir) {
  //   return `d-flex justify-${dir}`
  // }

  get name() {
    return 'paragraph_test'
  }

  get schema() {
    return {
      attrs: {
        align: {
          default: 'center'
        }
      },
      content: 'inline*',
      group: 'block',
      draggable: false,
      parseDOM: [
        {
          tag: 'p',
          getAttrs: (dom) => ({
            align: dom.getAttribute('align')
          })
        }
      ],
      toDOM: (node) => ['p', { class: `d-flex justify-${node.attrs.align}` }]
    }
  }

  // commands({ type, attrs }) {
  //   return setBlockType(type, attrs)
  // }
  get view() {
    return {
      props: ['node', 'updateAttrs', 'view'],
      computed: {
        align: {
          get() {
            return this.node.attrs.align
          },
          set(align) {
            this.updateAttrs({
              align
            })
          }
        }
      },
      template: `
        <p :class="[align]"></p>
      `
    }
  }
}
