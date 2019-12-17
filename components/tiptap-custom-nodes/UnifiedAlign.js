import { Node } from 'tiptap'
// import { lift } from 'prosemirror-commands'
import { wrappingInputRule } from 'tiptap-commands'
import toggleWrap from './toggleWrap'

export default class UnifiedAlign extends Node {
  get name() {
    return 'align'
  }

  get schema() {
    return {
      attrs: {
        class: {
          default: 'd-flex justify-start'
        }
      },
      content: 'block*',
      group: 'block',
      defining: true,
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
    return (attrs) => toggleWrap(type, attrs)
  }

  inputRules({ type }) {
    return [wrappingInputRule(/^\s*>\s$/, type)]
  }
}
