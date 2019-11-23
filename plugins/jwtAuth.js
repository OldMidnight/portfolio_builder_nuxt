export default class LocalScheme {
  constructor(auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = Object.assign({}, DEFAULTS, options)
  }

  _setToken(token) {
    if (this.options.globalToken) {
      // Set Authorization token for all axios requests
      if (token !== null && token.split(' ')[0] === 'Bearer') {
        this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
      } else {
        this.$auth.ctx.app.$axios.setHeader(
          this.options.tokenName,
          'Bearer ' + token
        )
      }
    }
  }

  _clearToken() {
    if (this.options.globalToken) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
    }
  }

  mounted() {
    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)
      this.$auth.syncRefreshToken(this.name)
      this._setToken(token)
    }

    if (process.client) {
      const token = this.$auth.getRefreshToken(this.name)
      if (token) {
        this.$auth.ctx.app.$axios.setHeader('Authorization', token)
        let newToken = null
        this.$auth.ctx.app.$axios
          .$post('/helper/refresh_token')
          .then((response) => {
            newToken = response.access_token
            this.$auth.setToken(this.name, 'Bearer ' + newToken)
            this._setToken(newToken)
            this.$auth.ctx.app.$axios.$get('/auth/user').then((response) => {
              this.$auth.setUser(response)
            })
          })
      }
    }

    return this.$auth.fetchUserOnce()
  }

  async login(endpoint) {
    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    const result = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    if (result.access_token) {
      const token = this.options.tokenType + ' ' + result.access_token
      this.$auth.setToken(this.name, token)
      this._setToken(result.access_token)
    }

    if (result.refresh_token) {
      const token = this.options.tokenType + ' ' + result.refresh_token
      this.$auth.setRefreshToken(this.name, token)
    }

    return this.fetchUser()
  }
  async setUserToken(tokenValue) {
    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    if (this.options.tokenRequired) {
      const token = this.options.tokenType
        ? this.options.tokenType + ' ' + tokenValue
        : tokenValue

      this.$auth.setToken(this.name, token)
      this._setToken(token)
    }

    return this.fetchUser()
  }

  async fetchUser(endpoint) {
    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    const user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )
    this.$auth.setUser(user)
  }

  async logout(endpoint) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => {})
    }

    // But logout locally regardless
    return this._logoutLocally()
  }

  _logoutLocally() {
    if (this.options.tokenRequired) {
      this._clearToken()
    }

    return this.$auth.reset()
  }
}

const DEFAULTS = {
  tokenRequired: true,
  tokenType: 'Bearer',
  globalToken: true,
  tokenName: 'Authorization'
}
