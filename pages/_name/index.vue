<template>
  <section id="page-index">
    <div class="logo is-relative fix-400">
      <img
        class="image is-inline-block logo--image"
        :class="brandName"
        :src="brandName === 'suzuki' ? '/graphics_suzuki_logo.png' : brandLogo"
        alt="logo"
      >
    </div>
    <section class="hero is-primary" :class="brandName">
      <div class="hero-head bg-darkblue" />
      <div class="hero-body has-text-centered bg-skyblue">
        <div class="container">
          <h1 v-if="brandName === 'suzuki'" class="title is-2">
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
          <span class="is-pulled-right toggle-distance-sort" style="padding-top: 1rem;">
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
          <div v-if="!$store.state.myLocation.latitude" class="blocked-notification">
            Geolocation er blokeret. For at kunne sortere efter nærmeste skal du først aktivere Geolocation i browseren.
          </div>
        </div>
      </div>
      <div class="field">
        <div class="control has-icons-left has-icons-right small-margin">
          <input
            v-model="zipCode"
            class="input is-large is-4"
            type="number"
            maxlength="4"
            placeholder="Indtast postnummer"
            @keypress="preventKeypress"
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
        <li class="list-item is-relative has-text-centered is-size-4">
          <div v-if="appList.length === 0" class="notification is-large">
            Din søgning gav intet resultat
          </div>
        </li>
      </ul>
    </section>
    <v-pagination
      v-if="appList.length"
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
  asyncData ({ params, error }) {
    return axios.get(`https://app.autoapps.dk/backend/api/landing/${params.name}/apps`)
      .then((res) => {
        if (!res.data.total) {
          error({ statusCode: 404, message: 'Page not found' })
        }
        return {
          brandLogo: res.data.brand_logo.replace('http:', '')
        }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Page not found' })
      })
  },
  head () {
    return {
      title: this.brandName,
      meta: [
        { name: 'image', content: this.brandLogo.replace('http:', '') },
        { itemprop: 'name', content: this.brandName },
        { itemprop: 'description', content: process.env.npm_package_description },
        { itemprop: 'image', content: this.brandLogo.replace('http:', '') },
        { property: 'og:title', content: this.brandName },
        { property: 'og:description', content: process.env.npm_package_description },
        { property: 'og:image', content: this.brandLogo.replace('http:', '') },
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
          this.$router.push(`/app/${appItem.app_slug}/${appItem.department_id}`)
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
    },
    preventKeypress (evt) {
      if (!isNumberKey(evt) || this.zipCode.valueAsNumber > 9999) {
        console.log('prevented')
        evt.preventDefault() // Then don't write it!
      }
      function isNumberKey (evt) {
        const charCode = (evt.which) ? evt.which : evt.keyCode
        return !(charCode > 31 && (charCode < 48 || charCode > 57))
      }
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
        height: 6.2rem;

        &:not(.suzuki) {
          width: 6.2rem;
          height: 6.2rem;
          left: 50%;
          top: 7rem;
          transform: translate(-50%, -50%);
          box-shadow: 1px 1px 3px 0px rgba(0,0,0,0.75);
        }
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
          font-weight: 700;
        }
      }
    }
    .suzuki {
      font-family: "SuzukiPROHeadline";
    }

    .hero:not(.suzuki) {
      .hero-head,
      .hero-body {
        background-color: #fff;
      }

      .hero-body {
        height: 8.7rem;
      }

      .hero-foot {
        background-color: #000;
        color: #fff;
      }
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
