export const state = () => ({
  redirect_path: null
})

export const actions = {
  async deleteFile({ commit }, { url, root }) {
    const { data } = await this.$axios
      .delete(`/uploads/user-content/${url}`)
      .catch((e) => {
        const error = JSON.parse(JSON.stringify(e))
        return error.response
      })
    root.$emit(
      data.error ? 'showError' : !data.error ? 'showSuccess' : 'showError',
      { message: data.message }
    )
    commit('creator/fetchUserUploads', { root })
  }
}

export const mutations = {
  redirectTo(state, payload) {
    state.redirect_path = payload.path
  }
}
