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
  total: 1,
  perPage: 10
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
  sortApp (state) {
    state.isSort = !state.isSort
  }
}
export const actions = {
  getAppList ({ state, commit }, payLoad) {
    let lat = payLoad.isSort ? state.myLocation.latitude : ''
    let lon = payLoad.isSort ? state.myLocation.longitude : ''
    const url = `https://app.autoapps.dk/backend/api/landing/${payLoad.name}/apps`
    if (payLoad.zip && payLoad.zip.length === 4) {
      axios.get(`https://dawa.aws.dk/postnumre/${payLoad.zip}`).then((res) => {
        lat = res.data.visueltcenter[1]
        lon = res.data.visueltcenter[0]
      }).then((res) => {
      }).catch(function (error) {
        console.log('Postnummer er ikke korrekt ', error)
      }).finally(function () {
        return load()
      })
    } else {
      return load()
    }
    function load () {
      return axios.get(url, {
        params: {
          lat,
          lon,
          per_page: state.perPage,
          offset: (payLoad.pageNum - 1) * state.perPage
        }
      })
        .then((res) => {
          commit('setAppList', res.data)
        })
    }
  }
}
export const getters = {
  appList: (state) => {
    return state.myApps
  }
}
