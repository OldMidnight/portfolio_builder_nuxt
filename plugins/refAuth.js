const strategy = 'local'
const FALLBACK_INTERVAL = 60 * 1000 * 0.75

async function refreshTokenF($auth, $axios, token, refreshToken, redirect) {
  if (refreshToken) {
    try {
      $axios.setToken('Bearer ' + refreshToken)
      const response = await $axios.$post('/auth/refresh_token', {
        token: refreshToken
      })
      token = 'Bearer ' + response.access_token
      // refreshToken = response.refresh_token
      $auth.setToken(strategy, token)
      $auth.setRefreshToken(strategy, refreshToken)
      $axios.setToken(token)
      if (process.client) {
        $auth.fetchUserOnce()
      }
      return decodeToken.call(this, token).exp
    } catch (error) {
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

function decodeToken(str) {
  str = str.split('.')[1]

  str = str.replace('/-/g', '+')
  str = str.replace('/_/g', '/')
  switch (str.length % 4) {
    case 0:
      break
    case 2:
      str += '=='
      break
    case 3:
      str += '='
      break
    default:
      throw new Error('Invalid token')
  }

  str = (str + '===').slice(0, str.length + (str.length % 4))
  str = str.replace(/-/g, '+').replace(/_/g, '/')

  str = decodeURIComponent(
    escape(Buffer.from(str, 'base64').toString('binary'))
  )

  str = JSON.parse(str)
  return str
}
