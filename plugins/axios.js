export default function(context) {
  context.$axios.onRequest((config) => {
    const token = context.$auth.getToken('local')
    context.$axios.setHeader('Authorization', token)
  })
  context.$axios.onResponseError(async (error) => {
    const response = error.response
    if (
      !context.$auth.loggedIn &&
      response.status === 401 &&
      response.request.responseURL.split('http://127.0.0.1:5000')[1] !==
        '/helper/refresh_token'
    ) {
      const originalRequest = response.config
      context.$axios.setHeader(
        'Authorization',
        context.$auth.getRefreshToken('local')
      )
      console.log('fasfasdfdsfs', context.$auth.getRefreshToken('local'))
      const newToken = await context.$axios
        .$post('/helper/refresh_token')
        .then((response) => {
          return response.access_token
        })
      console.log('newtoken: ', newToken)
      if (newToken) {
        context.$auth.setUserToken(newToken)
        originalRequest.headers.Authorization = 'Bearer ' + newToken
        context.$axios.setHeader('Authorization', 'Bearer ' + newToken)
        return context.$axios(originalRequest)
      } else {
        context.redirect(301, '/auth/login')
      }
    }
  })
}
