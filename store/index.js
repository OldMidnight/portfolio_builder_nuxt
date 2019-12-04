export const actions = {
  async nuxtServerInit({ commit }, { req, $axios }) {
    if (req.headers !== undefined) {
      const hosts = req.hostname.split('.')
      let hostNum = 2
      if (hosts.includes('herokuapp')) {
        hostNum = 4
      }
      if (req.hostname.split('.').length === hostNum) {
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
    }
  }
}
