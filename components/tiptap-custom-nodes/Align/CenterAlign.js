import { Mark } from 'tiptap'

import { toggleMark, markInputRule } from 'tiptap-commands'

export default class CenterAlign extends Mark {
  // eslint-disable-next-line class-methods-use-this
  get name() {
    return 'center_align'
  }

  // eslint-disable-next-line class-methods-use-this
  get schema() {
    return {
      parseDOM: [
        {
          style: 'text-align'
        }
      ],
      inclusive: false,
      toDOM: () => ['span', { style: `text-align: center; display: block` }, 0]
    }
  }

  // eslint-disable-next-line class-methods-use-this
  commands({ type }) {
    return () => toggleMark(type)
  }

  // eslint-disable-next-line class-methods-use-this
  inputRules({ type }) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)]
  }
}
