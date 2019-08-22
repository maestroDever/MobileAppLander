<template>
  <section id="page-index">
    <div class="logo is-relative fix-400" :class="brandName">
      <img
        class="image is-70x70 is-inline-block logo--image"
        :src="$store.state.brandLogo"
        alt="logo"
      >
      <span
        class="image is-70x70 is-size-5 logo--text"
        style="letter-spacing: -1px;"
      >
        Way of life!
      </span>
    </div>
    <section class="hero is-primary" :class="brandName">
      <div class="hero-head bg-darkblue" />
      <div class="hero-body has-text-centered bg-skyblue">
        <div class="container">
          <h1 class="title is-2">
            78 forhandlere i hele landet
          </h1>
        </div>
      </div>
      <div class="hero-foot has-text-centered bg-darkblue">
        <div class="container">
          <h2 class="subtitle is-3">
            Find din forhandler app
          </h2>
        </div>
      </div>
    </section>
    <section class="section is-paddingless fix-400" style="padding-bottom: .75rem;">
      <div class="field">
        <div class="control small-margin">
          <span class="icon is-large is-size-4">
            <font-awesome-icon icon="paper-plane" class="color-skyblue" />
          </span>
          <h3
            class="title is-4 is-inline-block is-marginless color-skyblue"
          >
            Vis nærmeste først
          </h3>
          <span class="is-pulled-right" style="padding-top: 1rem;">
            <input
              id="isDistanceSort"
              ref="sortChecker"
              v-model="isSortbyDistance"
              type="checkbox"
              class="switch is-rounded is-medium is-info"
              name="isDistanceSort"
              :disabled="!$store.state.myLocation.latitude"
            >
            <label for="isDistanceSort" />
          </span>
        </div>
      </div>
      <div class="field">
        <div class="control has-icons-left has-icons-right small-margin">
          <input
            v-model="zipCode"
            class="input is-large is-4"
            type="text"
            placeholder="Indtast postnummer"
          >
          <span class="icon is-large is-size-4 is-left">
            <font-awesome-icon icon="search" class="color-skyblue" />
          </span>
          <span class="icon is-right">
            <button class="delete is-small" @click="zipCode = ''" />
          </span>
        </div>
      </div>
    </section>
    <section class="section is-paddingless no-padding-top fix-400">
      <ul class="list">
        <li
          v-for="(item, index) in appList"
          :key="item.department_id"
          class="list-item is-relative"
          @click="redirectFromApp(index)"
        >
          <app-component
            :app-item="item"
            :show-distance="isSortbyDistance"
          />
        </li>
      </ul>
    </section>
    <v-pagination
      v-model="curPage"
      :page-count="pageCount"
      @input="gotoPage"
    />
  </section>
</template>

<script>
import axios from 'axios'
import vPagination from 'vue-plain-pagination'
import AppComponent from '../../components/AppComponent.vue'
export default {
  components: {
    AppComponent,
    vPagination
  },
  data () {
    return {
      brandName: this.$route.params.name,
      zipCode: '',
      curPage: 1
    }
  },
  computed: {
    appList () {
      return this.$store.getters.appList
    },
    isSortbyDistance: {
      get () {
        return this.$store.state.isSort
      },
      set (val) {
        this.$store.commit('sortApp', val)
      }
    },
    pageCount () {
      return Math.ceil(this.$store.state.total / 5)
    }
  },
  watch: {
    zipCode (value) {
      this.curPage = 1
      this.$store.dispatch('getAppList', {
        name: this.brandName,
        zip: value,
        pageNum: 1
      })
    }
  },
  asyncData ({ params }) {
    return axios.get(`http://139.162.255.138/backend/api/landing/${params.name}/apps`)
      .then((res) => {
        return {
          brandLogo: res.data.brand_logo
        }
      })
  },
  head () {
    return {
      title: this.brandName,
      meta: [
        { name: 'image', content: this.brandLogo },
        { itemprop: 'name', content: this.brandName },
        { itemprop: 'description', content: process.env.npm_package_description },
        { itemprop: 'image', content: this.brandLogo },
        { property: 'og:title', content: this.brandName },
        { property: 'og:description', content: process.env.npm_package_description },
        { property: 'og:image', content: this.brandLogo },
        { property: 'og:url', content: this.$route.fullPath },
        { property: 'og:site_name', content: this.brandName },
        { property: 'og:locale', content: 'da_DK' },
        { property: 'fb:admins', content: '1061564169' },
        { property: 'fb:app_id', content: '2307210935983207' },
        { property: 'og:type', content: 'website' }
      ]
    }
  },
  mounted () {
    let deviceType = 'Desktop'
    if (this.$device.isMobile || this.$device.isTablet) {
      if (this.$device.isIos) {
        deviceType = 'Apple'
      } else {
        deviceType = 'Android'
      }
    } else if (this.$device.isDesktop) { deviceType = 'Desktop' }
    this.$store.commit('setDevice', deviceType)

    if (navigator.geolocation) {
      const locationTimeout = setTimeout(() => {
        this.$store.commit('setLocation', {
          latitude: '',
          longitude: ''
        })
      }, 10000)

      navigator.geolocation.getCurrentPosition((position) => {
        clearTimeout(locationTimeout)

        this.$store.commit('setLocation', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        this.$store.dispatch('getAppList', {
          name: this.brandName,
          pageNum: 1
        })
        this.isSortbyDistance = true
      }, () => {
        clearTimeout(locationTimeout)
        this.$store.commit('setLocation', {
          latitude: '',
          longitude: ''
        })
      })
    } else {
      // Fallback for no geolocation
      this.$store.commit('setLocation', {
        latitude: '',
        longitude: ''
      })
    }
    this.$store.dispatch('getAppList', {
      name: this.brandName,
      pageNum: 1
    })
  },
  methods: {
    redirectFromApp (index) {
      const appItem = this.appList[index]
      const deviceType = this.$store.state.deviceType
      switch (deviceType) {
        case 'Desktop':
          this.$router.push(`/app/${appItem.app_slug}`)
          break
        case 'Apple':
          window.location.href = appItem.app_store_link
          break
        case 'Android':
          window.location.href = appItem.google_play_link
          break
        default:
          this.$router.push(`/app/${appItem.app_slug}`)
          break
      }
    },
    gotoPage (pageNum) {
      this.$store.dispatch('getAppList',
        this.zipCode ? {
          name: this.brandName,
          pageNum,
          zip: this.zipCode
        } : {
          name: this.brandName,
          pageNum
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../node_modules/bulma-extensions/dist/css/bulma-extensions.min.css';
  #page-index {
    margin-bottom: 25rem;
    .logo {
      &--image {
        position: absolute;
        left: .5rem;
      }
      &--text {
        position: absolute;
        left: 6.9rem;
        background-color: #0a3145;
        color: #fff;
        text-align: center;
        line-height: 6.4rem;
        font-weight: 700;
      }
    }
    .hero {
      &-head,
      &-foot {
        height: 5rem;
      }
      &-foot {
        .subtitle {
          line-height: 5rem;
        }
      }
    }
    .Suzuki {
      font-family: "SuzukiPRORegular";
    }

    .pagination {
      justify-content: center;
      font-size: 1.4rem;
      margin: 1.5rem;
    }

    .list {
      box-shadow: none;
    }
  }

  .is-2 {
    font-size: 2.4rem;
  }
  .is-3 {
    font-size: 1.8rem;
  }
  .is-4 {
    font-size: 1.4rem;
  }
  .is-70x70 {
    width: 70px;
    height: 70px;
  }
  .small-margin {
    margin: 1.5rem;
  }
</style>
