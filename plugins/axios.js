export default function(context) {
  context.$axios.onRequest((config) => {
    const token = context.$auth.getToken('local')
    context.$axios.setHeader('Authorization', token)
  })
  context.$axios.onResponseError((error) => {
    const response = error.response
    const originalRequest = response.config
    // console.log('CHECK RETRY 1:', originalRequest._retry)
    // console.log(originalRequest)
    if (
      response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/helpers/refresh_token' &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/register'
    ) {
      // console.log('CHECK RETRY 2:', originalRequest._retry)
      originalRequest._retry = true
      // const originalRequest = response.config
      const refresh = context.$auth.getRefreshToken('local')
      context.$axios.setHeader('Authorization', refresh)
      context.$axios.setToken(refresh)
      return context.$axios
        .$post('/helpers/refresh_token')
        .then((response) => {
          // console.log('NO ERROR GETTING REFRESH')
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
          // console.log('ERROR GETTING REFRESH')
          context.redirect(301, '/auth/login')
        })
    } else if (response.status === 401) {
      // console.log('401 AND RETRIED')
      context.redirect(301, '/auth/login')
    }
  })
}
