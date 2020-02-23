export const state = () => ({
  price_plans: {
    Free: '0.00',
    Premium: '4.99'
  },
  stats: {
    hourly: {
      total: 0,
      highest: 0,
      data: [1],
      autodraw: false,
      labels: ['a']
    },
    weekly: {
      total: 0,
      highest: 0,
      data: [1],
      autodraw: false,
      labels: ['a'],
      last_visitor_time: `'tis a lonely road you walk...`
    },
    monthly: {
      total: 0,
      highest: 0,
      data: [1],
      autodraw: false,
      labels: ['a']
    },
    cta_inter: {
      total: 0,
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
    state.stats[payload.type].total = payload.total
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
        total: response.total,
        autodraw: true,
        data: response.values,
        labels: response.labels,
        highest: response.highest
      })
    })
    await this.$axios.$get('/stats/fetch_weekly').then((response) => {
      commit('updateStatsData', {
        type: 'weekly',
        total: response.total,
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
        total: response.total,
        autodraw: true,
        data: response.values,
        labels: response.labels,
        highest: response.highest
      })
    })
    await this.$axios.$get('/stats/fetch_cta_inter').then((response) => {
      commit('updateStatsData', {
        type: 'cta_inter',
        total: response.total,
        autodraw: true,
        data: response.values,
        labels: response.labels,
        highest: response.highest,
        last_visitor_time: response.last_visitor_time
      })
    })
  }
}

export const getters = {
  hourlyStats: (state) => state.stats.hourly,
  weeklyStats: (state) => state.stats.weekly,
  monthlyStats: (state) => state.stats.monthly
}
