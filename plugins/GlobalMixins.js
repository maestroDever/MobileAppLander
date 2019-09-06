import Vue from 'vue'

Vue.mixin({
  mounted () {
    let deviceType = 'Desktop'
    if (this.$device.isMobile || this.$device.isTablet) {
      if (this.$device.isIos) {
        deviceType = 'Apple'
      } else {
        deviceType = 'Android'
      }
    } else if (this.$device.isDesktop) { deviceType = 'Desktop' }
    if (!this.$store.state.deviceType) { this.$store.commit('setDevice', deviceType) }
  }
})
