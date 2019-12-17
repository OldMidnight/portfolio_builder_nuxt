export const state = () => ({
  redirect_path: null
})

export const mutations = {
  redirectTo(state, payload) {
    state.redirect_path = payload.path
  }
}
