export default function(context) {
  context.$axios.onResponseError(async (error) => {
    const response = error.response
    if (context.$auth.loggedIn && response.status === 401) {
      const originalRequest = response.config
      originalRequest._retry = true
      context.$axios.setHeader(
        'Authorization',
        context.$auth.getRefreshToken('jwtAuth')
      )
      const newToken = await context.$axios
        .$post('/helper/refresh_token')
        .then((response) => {
          return response.access_token
        })
      if (newToken) {
        context.$auth.setUserToken(newToken)
        originalRequest.headers.Authorization = 'Bearer ' + newToken
        context.$axios.setHeader('Authorization', 'Bearer ' + newToken)
        console.log(originalRequest)
        return context.$axios(originalRequest)
      } else {
        context.redirect(301, '/auth/login')
      }
    }
  })
}
