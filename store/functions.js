export const state = () => ({
  redirect_path: null
})

export const actions = {
  async deleteFile(context, payload) {
    await this.$axios.$delete('/uploads/images/' + payload.url).then(() => {
      context.commit('creator/fetchUserUploads')
    })
  }
}

export const mutations = {
  redirectTo(state, payload) {
    state.redirect_path = payload.path
  }
}
