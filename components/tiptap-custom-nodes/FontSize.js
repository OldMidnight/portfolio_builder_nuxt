import { Mark } from 'tiptap'
import {
  updateMark,
  markInputRule,
  markPasteRule,
  removeMark
  // toggleMark
} from 'tiptap-commands'

export default class FontSize extends Mark {
  get name() {
    return 'font_size'
  }

  get schema() {
    return {
      attrs: {
        class: {
          default: null
        }
      },
      parseDOM: [
        {
          tag: 'span',
          getAttrs: (dom) => ({ class: dom.getAttribute('class') })
        }
      ],
      toDOM: (node) => ['span', { ...node.attrs }, 0]
    }
  }

  commands({ type }) {
    return (attrs) => {
      if (attrs.class) {
        return updateMark(type, attrs)
      }
      return removeMark(type)
    }
    // return (attrs) => toggleMark(type, attrs)
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)]
  }

  pasteRules({ type }) {
    return [markPasteRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)/g, type)]
  }
}
