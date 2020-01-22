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
    }
  }
})

export const mutations = {
  updateHourlyStatsAvg(state, payload) {
    state.stats.hourly.weekly_stats_avg = payload.value
  },
  updateHourlyAutodraw(state, payload) {
    state.stats.hourly.autodraw = payload.value
  },
  updateHourlyStatsData(state, payload) {
    state.stats.hourly.data = payload.value
  },
  updateHourlyStatsLabels(state, payload) {
    state.stats.hourly.labels = payload.value
  },
  updateLastVisitTime(state, payload) {
    state.stats.hourly.last_visitor_time = payload.value
  },
  updateHourlyStatsHighest(state, payload) {
    state.stats.hourly.highest = payload.value
  },
  updateWeeklyStatsAvg(state, payload) {
    state.stats.weekly.weekly_stats_avg = payload.value
  },
  updateWeeklyAutodraw(state, payload) {
    state.stats.weekly.autodraw = payload.value
  },
  updateWeeklyStatsData(state, payload) {
    state.stats.weekly.data = payload.value
  },
  updateWeeklyStatsLabels(state, payload) {
    state.stats.weekly.labels = payload.value
  },
  updateWeeklyStatsHighest(state, payload) {
    state.stats.weekly.highest = payload.value
  },
  updateMonthlyStatsAvg(state, payload) {
    state.stats.monthly.weekly_stats_avg = payload.value
  },
  updateMonthlyAutodraw(state, payload) {
    state.stats.monthly.autodraw = payload.value
  },
  updateMonthlyStatsData(state, payload) {
    state.stats.monthly.data = payload.value
  },
  updateMonthlyStatsLabels(state, payload) {
    state.stats.monthly.labels = payload.value
  },
  updateMonthlyStatsHighest(state, payload) {
    state.stats.monthly.highest = payload.value
  }
}

export const actions = {
  updateHourlyStats({ commit }) {
    this.$axios.$get('/stats/fetch_hourly').then((response) => {
      commit('updateHourlyStatsData', { value: response.values })
      commit('updateHourlyStatsLabels', { value: response.labels })
      commit('updateHourlyStatsAvg', { value: response.avg })
      commit('updateHourlyStatsHighest', { value: response.highest })
      commit('updateHourlyAutodraw', { value: true })
    })
  },
  updateWeeklyStats({ commit }) {
    this.$axios.$get('/stats/fetch_weekly').then((response) => {
      commit('updateWeeklyStatsData', { value: response.values })
      commit('updateWeeklyStatsLabels', { value: response.labels })
      commit('updateLastVisitTime', { value: response.last_visitor_time })
      commit('updateWeeklyStatsAvg', { value: response.avg })
      commit('updateWeeklyStatsHighest', { value: response.highest })
      commit('updateWeeklyAutodraw', { value: true })
    })
  },
  updateMonthlyStats({ commit }) {
    this.$axios.$get('/stats/fetch_monthly').then((response) => {
      commit('updateMonthlyStatsData', { value: response.values })
      commit('updateMonthlyStatsLabels', { value: response.labels })
      commit('updateMonthlyStatsAvg', { value: response.avg })
      commit('updateMonthlyStatsHighest', { value: response.highest })
      commit('updateMonthlyAutodraw', { value: true })
    })
  }
}
