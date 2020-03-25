const strategy = 'local'
const FALLBACK_INTERVAL = 900 * 1000 * 0.75

async function refreshTokenF($auth, $axios, token, refreshToken, redirect) {
  if (refreshToken) {
    try {
      const { data } = await $axios.post('/logout').catch((e) => {
        const error = JSON.parse(JSON.stringify(e))
        return error.response
      })
      if (!data.error) {
        $axios.setToken('Bearer ' + refreshToken)
        const {
          access_token: accessToken
        } = await $axios.$post('/auth/refresh_token', { token: refreshToken })
        token = 'Bearer ' + accessToken
        // refreshToken = response.refresh_token
        $auth.setToken(strategy, token)
        $auth.setRefreshToken(strategy, refreshToken)
        $axios.setToken(token)
        if (process.client) {
          $auth.fetchUserOnce()
        }
        return decodeToken.call(this, token).exp
      }
      throw new Error('Error refreshing token')
    } catch (error) {
      await $axios.$post('/logout').then(async (_) => {
        $axios.setToken('Bearer ' + refreshToken)
        await $axios.$post('/logout_refresh')
      })
      $auth.logout()
      redirect('/auth/login')
      throw new Error('Error refreshing token')
    }
  }
}

export default async function({ app, store, redirect }) {
  const { $axios, $auth } = app
  let token
  let refreshToken
  $axios.onError(async (err) => {
    if (
      !err.config.retry &&
      err.response.status === 401 &&
      !err.config.url.endsWith('/auth/login') &&
      !err.config.url.endsWith('/auth/refresh_token')
    ) {
      err.config.retry = true
      token = $auth.getToken(strategy)
      refreshToken = $auth.getRefreshToken(strategy)
      if (refreshToken) {
        await refreshTokenF($auth, $axios, token, refreshToken, store, redirect)
        return $axios(err.config)
      } else {
        await $axios.$post('/logout')
        $auth.logout()
        redirect('/auth/login')
      }
    }
    return Promise.reject(err)
  })
  token = $auth.getToken(strategy)
  refreshToken = $auth.getRefreshToken(strategy)
  let refreshInterval = FALLBACK_INTERVAL
  if (token && refreshToken) {
    const tokenParsed = decodeToken.call(this, token)
    refreshInterval = (tokenParsed.exp * 1000 - Date.now()) * 0.75
    if (refreshInterval < 10000 && refreshInterval > 0) {
      refreshInterval = 10000
    }
    if (refreshInterval < 0) {
      refreshInterval =
        ((await refreshTokenF(
          $auth,
          $axios,
          token,
          refreshToken,
          store,
          redirect
        )) *
          1000 -
          Date.now()) *
        0.75
      $auth.fetchUserOnce()
    }
  }
  setInterval(async function() {
    token = $auth.getToken(strategy)
    refreshToken = $auth.getRefreshToken(strategy)
    await refreshTokenF($auth, $axios, token, refreshToken, store, redirect)
  }, refreshInterval)
}

function decodeToken(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}
