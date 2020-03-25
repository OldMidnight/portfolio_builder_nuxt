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
    const {
      cta_stats: ctaStats,
      hourly_stats: hourlyStats,
      weekly_stats: weeklyStats,
      monthly_stats: monthlyStats
    } = await this.$axios.$get('/stats/fetch_stats')
    commit('updateStatsData', {
      type: 'hourly',
      total: hourlyStats.total,
      autodraw: true,
      data: hourlyStats.values,
      labels: hourlyStats.labels,
      highest: hourlyStats.highest
    })

    commit('updateStatsData', {
      type: 'weekly',
      total: weeklyStats.total,
      autodraw: true,
      data: weeklyStats.values,
      labels: weeklyStats.labels,
      highest: weeklyStats.highest,
      last_visitor_time: weeklyStats.last_visitor_time
    })

    commit('updateStatsData', {
      type: 'monthly',
      total: monthlyStats.total,
      autodraw: true,
      data: monthlyStats.values,
      labels: monthlyStats.labels,
      highest: monthlyStats.highest
    })

    commit('updateStatsData', {
      type: 'cta_inter',
      total: ctaStats.total,
      autodraw: true,
      data: ctaStats.values,
      labels: ctaStats.labels,
      highest: ctaStats.highest,
      last_visitor_time: ctaStats.last_visitor_time
    })
  }
}

export const getters = {
  hourlyStats: (state) => state.stats.hourly,
  weeklyStats: (state) => state.stats.weekly,
  monthlyStats: (state) => state.stats.monthly
}
