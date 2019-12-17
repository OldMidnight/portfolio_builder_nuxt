export const state = () => ({
  status: {
    loggedIn: false
  },
  user: null
})

export const actions = {
  login({ commit }, { email, password }) {
    commit('loginRequest', { email })

    return this.$auth
      .loginWith('local', {
        data: {
          email,
          password
        }
      })
      .catch((error) => {
        commit('loginFailure', error)
      })
  },
  logout({ commit }) {
    commit('logout')
    this.$router.push({ name: 'home' })
  },
  register({ commit }, user) {
    commit('registerRequest', user)
    this.$axios
      .$post('/auth/register', user)
      .then((response) => {
        commit('registerSuccess', response.user)
        this.$auth
          .loginWith('local', {
            data: {
              email: user.email,
              password: user.password
            }
          })
          .then(() => {
            this.$router.push({ path: '/dashboard' })
          })
          .catch((error) => {
            commit('loginFailure', error)
          })
      })
      .catch((error) => {
        commit('registerFailure', error)
      })
  }
}

export const mutations = {
  loginRequest(state, user) {
    state.status = { loggingIn: true }
    state.user = user
  },
  loginSuccess(state, user) {
    state.status = { loggedIn: true }
    state.user = user
  },
  loginFailure(state) {
    state.status = { loggingIn: false }
    state.user = null
  },
  logout(state) {
    state.status = {}
    state.user = null
  },
  registerRequest(state, user) {
    state.status = { registering: true }
  },
  registerSuccess(state, user) {
    state.status = {}
  },
  registerFailure(state, error) {
    state.status = {}
  }
}
