import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  components: {
    VueQrcode
  },
  data () {
    return {
      slug: this.$route.params.slug,
      dashboardImage: '',
      qrFor: 'ios',
      window: {
        width: 0,
        height: 0
      },
      deviceType: ''
    }
  },
  computed: {
    departmentName () {
      return this.appItem.departments && this.appItem.departments.length >= 1 ? this.appItem.departments[0].name : ''
    },
    departmentImage () {
      return this.appItem.departments && this.appItem.departments.length >= 1 ? this.appItem.departments[0].info.dashboard_background_image.replace('http:', '') : ''
    },
    appStoreId () {
      const appStoreLink = this.appItem.app_store_link
      const match = appStoreLink && appStoreLink.match(/id(\d+)/)
      if (match && match.length) { return match[1] } else {
        this.setQR('android')
        return null
      }
    },
    googlePlayId () {
      const googlePlayLink = this.appItem.google_play_link
      const regx = /id=([^&]+)/g
      const match = regx.exec(googlePlayLink)
      if (match && match.length) { return match[1] } else { return null }
    }
  },
  head () {
    const appItem = this.appItem
    return {
      title: appItem.app_name,
      meta: [
        { name: 'description', content: appItem.description },
        { name: 'image', content: this.departmentImage },
        { itemprop: 'name', content: appItem.app_name },
        { itemprop: 'description', content: appItem.description },
        { itemprop: 'image', content: this.departmentImage },
        { name: 'apple-itunes-app', content: `app-id=${this.appStoreId}` },
        { name: 'google-play-app', content: this.googlePlayId },
        { property: 'og:title', content: appItem.app_name },
        { property: 'og:description', content: appItem.description },
        { property: 'og:image', content: this.departmentImage },
        { property: 'og:url', content: '//find.autoapps.dk' + this.$route.fullPath },
        { property: 'og:site_name', content: appItem.app_name },
        { property: 'og:locale', content: 'da_DK' },
        { property: 'fb:admins', content: '1061564169' },
        { property: 'fb:app_id', content: '2307210935983207' },
        { property: 'og:type', content: 'website' },
        { property: 'al:ios:app_store_id', content: `${this.appStoreId}` },
        { property: 'al:ios:app_name', content: appItem.app_name },
        { property: 'al:ios:url', content: `${this.slug}://` },
        { property: 'al:android:package', content: this.googlePlayId },
        { property: 'al:android:app_name', content: appItem.app_name },
        { property: 'al:android:url', content: `${this.slug}://` }
      ]
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.dashboardImage = this.appItem.departments && this.appItem.departments[0].info.dashboard_background_image.replace('http:', '')
    if (this.appItem.departments && this.appItem.departments.length > 1) {
      let i = 1
      setInterval(() => {
        this.dashboardImage = this.appItem.departments && this.appItem.departments[i].info.dashboard_background_image.replace('http:', '')
        i = (i + 1) % (this.appItem.departments && this.appItem.departments.length)
      }, 5000)
    }

    let deviceType = 'Desktop'
    if (this.$device.isMobile || this.$device.isTablet) {
      if (this.$device.isIos) {
        deviceType = 'Apple'
      } else {
        deviceType = 'Android'
      }
    } else if (this.$device.isDesktop) { deviceType = 'Desktop' }

    this.deviceType = deviceType

    if (!this.$route.query.hasOwnProperty('show')) {
      this.$nextTick(function () {
        if (this.deviceType === 'Apple') {
          window.location.href = this.appItem.app_store_link && this.appItem.app_store_link
        } else if (this.deviceType === 'Android') {
          window.location.href = this.appItem.google_play_link && this.appItem.google_play_link
        }
      })
    }
  },
  methods: {
    setQR (val) {
      this.qrFor = val
    },
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    }
  }
}
