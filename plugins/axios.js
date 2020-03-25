export default function({ $axios, redirect, $auth }) {
  $axios.onError((error) => {
    const code = (error.response && error.response.status) || error.code
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      'Oops, something went wrong on our end, try again later!'
    switch (code) {
      case '500':
        if (!process.client) {
          redirect('/')
        }
        break
      case '401':
        if (!process.client) {
          $auth.logout()
          redirect('/auth/login')
        }
        break
      case 'ECONNREFUSED':
        if (!process.client) {
          $auth.logout()
          redirect('/auth/login')
        }
        break
      default:
        break
    }
    const res = { data: { error: true, message } }
    return res
  })
}
