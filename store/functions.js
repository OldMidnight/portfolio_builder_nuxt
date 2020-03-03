export const state = () => ({
  redirect_path: null,
  isMobile: false
})

export const getters = {
  is_mobile: (state) => {
    return state.isMobile
  }
}

export const actions = {
  async deleteFile(context, payload) {
    await this.$axios
      .$delete('/uploads/user-content/' + payload.url)
      .then(() => {
        context.commit('creator/fetchUserUploads')
      })
  }
}

export const mutations = {
  redirectTo(state, payload) {
    state.redirect_path = payload.path
  },
  setMobile(state, payload) {
    state.isMobile = payload.value
  }
}
