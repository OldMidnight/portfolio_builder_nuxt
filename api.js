import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/',
  withCredentials: true
})

const authApi = axios.create({
  baseURL: 'http://127.0.0.1:5000/'
})

const refreshAuthApi = axios.create({
  baseURL: 'http://127.0.0.1:5000/',
  withCredentials: true
})

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(window.$nuxt.$storage.getUniversal('user'))
      .access_token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  function(error) {
    const originalRequest = error.config

    if (
      error.response.status === 401 &&
      originalRequest.url === 'http://127.0.0.1:5000/helper/refresh_token'
    ) {
      window.$nuxt.$router.push('/auth/login')
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = JSON.parse(
        window.$nuxt.$storage.getUniversal('user')
      ).refresh_token
      refreshAuthApi.defaults.headers.common.Authorization =
        'Bearer ' + refreshToken
      return refreshAuthApi.post('/helper/refresh_token').then((response) => {
        if (response.status === 201) {
          const user = JSON.parse(window.$nuxt.$storage.getUniversal('user'))
          user.access_token = response.data.access_token
          window.$nuxt.$storage.setUniversal('user', JSON.stringify(user), true)
          api.defaults.headers.common.Authorization =
            'Bearer ' +
            JSON.parse(window.$nuxt.$storage.getUniversal('user')).access_token
          return api(originalRequest)
        }
      })
    }
    return Promise.reject(error)
  }
)

export { api, authApi }
