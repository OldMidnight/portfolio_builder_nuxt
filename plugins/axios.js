export default function(context) {
  context.$axios.onRequest((config) => {
    const token = context.$auth.getToken('local')
    context.$axios.setHeader('Authorization', token)
  })
  context.$axios.onResponseError((error) => {
    const response = error.response
    const originalRequest = response.config
    if (response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // const originalRequest = response.config
      const refresh = context.$auth.getRefreshToken('local')
      context.$axios.setHeader('Authorization', refresh)
      context.$axios.setToken(refresh)
      return context.$axios
        .$post('/helper/refresh_token')
        .then((response) => {
          context.$auth.setUserToken(response.access_token)
          context.$axios.setToken(response.access_token, 'Bearer')
          originalRequest.headers.Authorization =
            'Bearer ' + response.access_token
          context.$axios.setHeader(
            'Authorization',
            'Bearer ' + response.access_token
          )
          context.$auth.setRefreshToken('local', refresh)
          return context.$axios(originalRequest)
        })
        .catch(() => {
          context.redirect(301, '/auth/login')
        })
    } else {
      context.redirect(301, '/auth/login')
    }
  })
}
