export const state = () => ({
  status: {
    loggedIn: false,
    error: { msg: null },
    error_state: false
  },
  refresh_token: null,
  user: null
})

export const actions = {
  // login({ commit }, { email, password }) {
  //   commit('loginRequest', { email })

  //   return this.$auth
  //     .loginWith('local', {
  //       data: {
  //         email,
  //         password
  //       }
  //     })
  //     .then(() => {
  //       this.$router.push({ path: '/dashboard' })
  //     })
  //     .catch((error) => {
  //       commit('loginFailure', error)
  //     })
  // },
  async login(_, { email, password, firstTime }) {
    await this.$axios
      .$post('/auth/login', { email, password })
      .then((response) => {
        this.$auth.setToken('local', 'Bearer ' + response.access_token)
        this.$auth.setRefreshToken('local', response.refresh_token)
        this.$axios.setHeader(
          'Authorization',
          'Bearer ' + response.access_token
        )
        this.$auth.ctx.app.$axios.setHeader(
          'Authorization',
          'Bearer ' + response.access_token
        )
        this.$axios.$get('/auth/user').then((response) => {
          this.$auth.setUser(response)
          if (firstTime) {
            this.$router.push('/creator')
          } else {
            this.$router.push('/dashboard')
          }
        })
      })
  },
  logout({ commit }) {
    commit('logout')
    this.$router.push({ name: 'home' })
  },
  async register({ commit, dispatch }, user) {
    commit('registerRequest', user)
    await this.$axios
      .$post('/auth/register', user)
      .then((response) => {
        commit('registerSuccess', response.user)
        dispatch('login', { ...user, firstTime: true })
      })
      .catch((error) => {
        commit('registerFailure', error.response.data)
      })
  }
}

export const mutations = {
  setRefreshToken(state, payload) {
    state.refresh_token = payload.refresh_token
  },
  loginRequest(state, user) {
    state.status = {
      loggedIn: false,
      user,
      error: { msg: null },
      error_state: false
    }
    state.user = user
  },
  loginSuccess(state, user) {
    state.status = {
      loggedIn: true,
      user,
      error: { msg: null },
      error_state: false
    }
    state.user = user
  },
  loginFailure(state) {
    state.status = {
      loggedIn: false,
      error: { msg: 'There was an error logging in.' },
      error_state: true
    }
    state.user = null
  },
  logout(state) {
    state.status = {
      loggedIn: false,
      error: { msg: null },
      error_state: false
    }
    state.user = null
  },
  registerRequest(state, user) {
    state.status = {
      loggedIn: false,
      user,
      error: { msg: null },
      error_state: false
    }
  },
  registerSuccess(state, user) {
    state.status = {
      loggedIn: false,
      user,
      error: { msg: null },
      error_state: false
    }
  },
  registerFailure(state, error) {
    state.status = {
      loggedIn: false,
      error,
      error_state: true
    }
  },
  resetErrorStatus(state, payload) {
    state.status.error_state = payload.value
  }
}
