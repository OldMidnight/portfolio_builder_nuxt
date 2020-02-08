export const state = () => ({
  price_plans: {
    Free: '0.00',
    Premium: '4.99'
  },
  stats: {
    hourly: {
      avg: 0,
      highest: 0,
      data: [1],
      autodraw: false,
      labels: ['a']
    },
    weekly: {
      avg: 0,
      highest: 0,
      data: [1],
      autodraw: false,
      labels: ['a'],
      last_visitor_time: `'tis a lonely road you walk...`
    },
    monthly: {
      avg: 0,
      highest: 0,
      data: [1],
      autodraw: false,
      labels: ['a']
    },
    cta_inter: {
      avg: 0,
      highest: 0,
      data: [1],
      autodraw: false,
      labels: ['a'],
      last_visitor_time: `'tis a lonely road you walk...`
    }
  }
})

export const mutations = {
  updateStatsData(state, payload) {
    state.stats[payload.type].weekly_stats_avg = payload.avg
    state.stats[payload.type].autodraw = payload.autodraw
    state.stats[payload.type].data = payload.data
    state.stats[payload.type].labels = payload.labels
    if (payload.last_visitor_time) {
      state.stats[payload.type].last_visitor_time = payload.last_visitor_time
    }
    state.stats[payload.type].highest = payload.highest
  }
}

export const actions = {
  async updateStats({ commit }) {
    await this.$axios.$get('/stats/fetch_hourly').then((response) => {
      commit('updateStatsData', {
        type: 'hourly',
        avg: response.avg,
        autodraw: true,
        data: response.values,
        labels: response.labels,
        highest: response.highest
      })
    })
    await this.$axios.$get('/stats/fetch_weekly').then((response) => {
      commit('updateStatsData', {
        type: 'weekly',
        avg: response.avg,
        autodraw: true,
        data: response.values,
        labels: response.labels,
        highest: response.highest,
        last_visitor_time: response.last_visitor_time
      })
    })
    await this.$axios.$get('/stats/fetch_monthly').then((response) => {
      commit('updateStatsData', {
        type: 'monthly',
        avg: response.avg,
        autodraw: true,
        data: response.values,
        labels: response.labels,
        highest: response.highest
      })
    })
    await this.$axios.$get('/stats/fetch_cta_inter').then((response) => {
      commit('updateStatsData', {
        type: 'cta_inter',
        avg: response.avg,
        autodraw: true,
        data: response.values,
        labels: response.labels,
        highest: response.highest,
        last_visitor_time: response.last_visitor_time
      })
    })
  }
}
