import { Mark } from 'tiptap'
// // import { lift } from 'prosemirror-commands'
// import { wrappingInputRule } from 'tiptap-commands'
// import toggleWrap from './toggleWrap'

// export default class UnifiedAlign extends Mark {
//   get name() {
//     return 'align'
//   }

//   get schema() {
//     return {
//       attrs: {
//         class: {
//           default: 'd-flex justify-start'
//         }
//       },
//       content: 'block*',
//       group: 'block',
//       defining: true,
//       inclusive: false,
//       parseDOM: [
//         {
//           tag: 'span[class]',
//           getAttrs: (dom) => ({ class: dom.getAttribute('class') })
//         }
//       ],
//       toDOM: (node) => ['span', { ...node.attrs }, 0]
//     }
//   }

//   commands({ type }) {
//     return (attrs) => toggleWrap(type, attrs)
//   }

//   inputRules({ type }) {
//     return [wrappingInputRule(/^\s*>\s$/, type)]
//   }
// }

import { updateMark, markInputRule } from 'tiptap-commands'

export default class UnifiedAlign extends Mark {
  // eslint-disable-next-line class-methods-use-this
  get name() {
    return 'align'
  }

  // eslint-disable-next-line class-methods-use-this
  get schema() {
    return {
      attrs: {
        textAlign: {
          default: 'left'
        }
      },
      parseDOM: [
        {
          style: 'text-align',
          getAttrs: (value) => ({ textAlign: value })
        }
      ],
      toDOM: (mark) => [
        'span',
        { style: `text-align: ${mark.attrs.textAlign}; display: block` },
        0
      ]
    }
  }

  // eslint-disable-next-line class-methods-use-this
  commands({ type }) {
    return (attrs) => updateMark(type, attrs)
  }

  // eslint-disable-next-line class-methods-use-this
  inputRules({ type }) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)]
  }
}
