
import Cookies from 'js-cookie'

const state = () => ({
  sidebar: {
    opened:  Cookies.get('sidebarStatus') ? true : false,  // Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium'
})

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  }
}

const actions = {
  toggleSideBar({commit}) {
    commit('TOGGLE_SIDEBAR')
  }
}

const getters = {
  sidebar: state => state.sidebar
}

export default {
  namespace: true,
  state,
  mutations,
  actions,
  getters
}