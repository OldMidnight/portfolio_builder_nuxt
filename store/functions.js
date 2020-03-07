export const state = () => ({
  redirect_path: null
})

export const actions = {
  async deleteFile({ commit }, { url }) {
    await this.$axios.$delete(`/uploads/user-content/${url}`)
    commit('creator/fetchUserUploads')
  }
}

export const mutations = {
  redirectTo(state, payload) {
    state.redirect_path = payload.path
  }
}
