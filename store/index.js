export const actions = {
  async nuxtServerInit({ commit }, { req, $axios }) {
    // console.log('asfdsafsdaasdf', req.hostname.split('.').length)
    if (req.hostname.split('.').length === 2) {
      commit('creator/setIsSubdomain')
      await $axios
        .$post('/helper/check_domain', {
          domain: req.hostname.split('.')[0]
        })
        .then((response) => {
          const available = response.available
          const active = response.active
          if (available && active) {
            commit('creator/setDomain', {
              domain: { name: req.hostname.split('.')[0], available: true }
            })
          } else if (available && !active) {
            commit('creator/setDomain', {
              domain: { name: req.hostname.split('.')[0], available: false }
            })
          } else {
            commit('creator/setDomain', {
              domain: { name: null, available: false }
            })
          }
        })
    }
    // console.log(route)
  }
}
