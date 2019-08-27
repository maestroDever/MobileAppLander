import axios from 'axios'

export const state = () => ({
  brandName: '',
  brandLogo: '',
  myApps: [],
  myLocation: {
    latitude: '',
    longitude: ''
  },
  deviceType: null,
  isSort: false,
  total: 1
})

export const mutations = {
  setAppList (state, data) {
    state.brandName = data.brand_name
    state.brandLogo = data.brand_logo
    state.myApps = [...data.departments]
    state.total = data.total
  },
  setLocation (state, data) {
    state.myLocation = data
  },
  setDevice (state, type) {
    state.deviceType = type
  },
  sortApp (state, data) {
    state.isSort = data
  }
}

export const actions = {
  getAppList ({ state, commit }, payLoad) {
    const lat = state.myLocation.latitude
    const lon = state.myLocation.longitude
    const url = `https://app.autoapps.dk/backend/api/landing/${payLoad.name}/apps`
    return axios.get(url, {
      params: payLoad.zip ? {
        lat,
        lon,
        per_page: 5,
        offset: (payLoad.pageNum - 1) * 5,
        zip: payLoad.zip
      } : {
        lat,
        lon,
        per_page: 5,
        offset: (payLoad.pageNum - 1) * 5
      }
    })
      .then((res) => {
        commit('setAppList', res.data)
      })
  }
}

export const getters = {
  appList: (state) => {
    if (state.isSort) {
      return [...state.myApps].sort((a, b) => {
        return b.distance - a.distnace
      })
    } else {
      return [...state.myApps].sort((a, b) => {
        return (a.app_name > b.app_name) ? 1 : -1
      })
    }
  }
}
