// import { authHeader } from '@/router/auth_header';
// import { authApi } from '@/api'

// function login(email, password) {
//   return authApi
//     .post('auth/login', { email, password })
//     .then((response) => {
//       const user = response.data
//       if (user.access_token) {
//         window.$nuxt.$storage.setUniversal('user', JSON.stringify(user), true)
//       }
//       return user
//     })
//     .catch((error) => {
//       if (error.status === 401) {
//         // auto logout if 401 response returned from api
//         logout()
//         location.reload(true)
//       }
//       return Promise.reject(error.statusText)
//     })
// }

// function logout() {
//   // remove user from local storage to log user out
//   window.localStorage.removeItem('user')
// }

// function register(user) {
//   return authApi
//     .post('auth/register', user)
//     .then((response) => {
//       const user = response.data
//       return user
//     })
//     .catch((error) => {
//       return Promise.reject(error.statusText)
//     })
// }

// export const userService = {
//   login,
//   logout,
//   register
// }
