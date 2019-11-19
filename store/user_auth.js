// import { userService } from '@/_services'

// const user = JSON.parse(window.$nuxt.$storage.getUniversal('user'))
// export const state = user
//   ? { status: { loggedIn: true }, user }
//   : { status: {}, user: null }

export const state = () => ({
  status: {
    loggedIn: false
  },
  user: null
})

export const actions = {
  login({ commit }, { email, password }) {
    commit('loginRequest', { email })

    this.$auth
      .loginWith('jwtAuth', {
        data: {
          email,
          password
        }
      })
      .then(() => {
        this.$router.push({ path: '/dashboard' })
      })
    // .$post('/auth/login', { email, password })
    // .then((response) => {
    //   commit('loginSuccess', response.user)
    //   this.$axios.setToken(response.access_token, 'Bearer', ['post'])
    //   this.$auth.$storage.setUniversal('user', JSON.stringify(response))
    //   this.$router.push({ path: '/dashboard' })
    // })
    // .catch((error) => {
    //   commit('loginFailure', error)
    // })
    // userService.login(email, password).then(
    //   (user) => {
    //     commit('loginSuccess', user)
    //     if (nextPath === 'home') {
    //       this.$router.push({ name: 'home' })
    //     } else {
    //       this.$router.push({ name: nextPath })
    //     }
    //   },
    //   (error) => {
    //     commit('loginFailure', error)
    //   }
    // )
  },
  logout({ commit }) {
    // userService.logout()
    commit('logout')
    this.$router.push({ name: 'home' })
  },
  register({ commit }, user) {
    commit('registerRequest', user)
    this.$axios
      .$post('/auth/register', user)
      .then((response) => {
        commit('registerSuccess', response.user)
        // this.$axios.setToken(response.access_token, 'Bearer', ['post'])
        // this.$auth.$storage.setUniversal('user', JSON.stringify(response))
        this.$router.push({ path: '/auth/login' })
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
    state.status = {}
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
