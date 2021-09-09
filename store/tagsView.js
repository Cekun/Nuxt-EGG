
const state = ()=> ({
  visitedViews: [],
  cachedViews: []
})

const mutations = {
  ADD_VISITED_VIEW(state, view) {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, {
        title: view.meta.title|| view.name || 'no-name',
        name: view.name,
        fullPath: view.fullPath,
        // matched: view.matched,
        meta: view.meta,
        params: view.params,
        query: view.query,
        path: view.path
      })
    ) 
  },
  ADD_CACHED_VIEW: (state, view) => {

  },
  DEL_VISITED_VIEW: (state, view) => {

  },
  DEL_CACHED_VIEW: (state, view) => {

  },
}

const actions = {
  addView({ dispatch }, view) {
    console.log('view: ', view);
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    console.log('addVisitedView');
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions
}