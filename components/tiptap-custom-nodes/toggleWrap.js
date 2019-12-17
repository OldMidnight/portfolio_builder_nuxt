import { wrapIn } from 'prosemirror-commands'
import { liftTarget, findWrapping } from 'prosemirror-transform'
import { nodeIsActive } from 'tiptap-utils'

export default function(type, attrs) {
  return (state, dispatch, view) => {
    const isActive = nodeIsActive(state, type)

    if (isActive) {
      let from = state.selection.$from
      let to = state.selection.$to
      let range = from.blockRange(to)
      const target = range && liftTarget(range)
      state = state.apply(state.tr.lift(range, target))
      view.updateState(state)
      from = state.selection.$from
      to = state.selection.$to
      range = from.blockRange(to)
      const wrapping = range && findWrapping(range, type, attrs)
      state = state.apply(state.tr.wrap(range, wrapping).scrollIntoView())
      view.updateState(state)
      return true
    }
    return wrapIn(type, attrs)(state, dispatch, view)
  }
}
