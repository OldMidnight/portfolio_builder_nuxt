export default function(context) {
  context.$axios.onRequest((_) => {
    const token = context.$auth.getToken('local')
    context.$axios.setHeader('Authorization', token)
  })
  context.$axios.onResponseError(({ response }) => {
    const originalRequest = response.config
    if (
      response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/helpers/refresh_token' &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/register'
    ) {
      originalRequest._retry = true
      // const originalRequest = response.config
      const refresh = context.$auth.getRefreshToken('local')
      context.$axios.setHeader('Authorization', refresh)
      context.$axios.setToken(refresh)
      return context.$axios
        .$post('/helpers/refresh_token')
        .then((response) => {
          // Sets Auth fetchUser function auth header
          context.$auth.setUserToken(response.access_token)
          // Sets axios Auth header
          context.$axios.setToken(response.access_token, 'Bearer')
          // Sets original requests auth header
          originalRequest.headers.Authorization =
            'Bearer ' + response.access_token
          context.$axios.setHeader(
            'Authorization',
            'Bearer ' + response.access_token
          )
          // Resets refresh token
          context.$auth.setRefreshToken('local', refresh)
          return context.$axios(originalRequest)
        })
        .catch(() => {
          context.redirect(301, '/auth/login')
        })
    } else if (response.status === 401) {
      context.redirect(301, '/auth/login')
    }
  })
}
