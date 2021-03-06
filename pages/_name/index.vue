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
          <span class="is-pulled-right toggle-distance-sort" style="padding-top: 1rem;" @click="onToggle">
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
    <div class="poweredby">
      <span class="ualogo" /><p>Powered by <a href="https://universalapps.dk" target="_blank">Universal Apps ApS</a></p>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="showModal" class="overlay" @click="showModal = false">
        <div class="info">
          <span class="info--close" @click="showModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#7F7F7F" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </span>
          <!-- <h3 class="info--title">
            Advarsel
          </h3> -->
          <p class="info--text">
            Geolocation er blokeret. For at kunne sortere efter nærmeste skal du først aktivere Geolocation i browseren.
          </p>
        </div>
      </div>
    </transition>
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
      curPage: 1,
      showModal: false
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
        this.$store.commit('sortApp')
        this.$store.dispatch('getAppList', {
          name: this.brandName,
          pageNum: this.curPage,
          isSort: val,
          zip: this.zipCode
        })
      }
    },
    pageCount () {
      return Math.ceil(this.$store.state.total / this.$store.state.perPage)
    }
  },
  watch: {
    zipCode (value) {
      this.curPage = 1
      this.$store.dispatch('getAppList', {
        name: this.brandName,
        zip: value,
        pageNum: 1,
        isSort: this.isSortbyDistance
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
      this.isSortbyDistance = false
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
      this.$store.dispatch('getAppList', {
        name: this.brandName,
        pageNum,
        zip: this.zipCode,
        isSort: this.isSortbyDistance
      })
    },
    preventKeypress (evt) {
      if (!isNumberKey(evt) || this.zipCode.valueAsNumber > 9999) {
        evt.preventDefault() // Then don't write it!
      }
      function isNumberKey (evt) {
        const charCode = (evt.which) ? evt.which : evt.keyCode
        return !(charCode > 31 && (charCode < 48 || charCode > 57))
      }
    },
    onToggle () {
      if (!this.$store.state.myLocation.latitude) { this.showModal = true }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../node_modules/bulma-extensions/dist/css/bulma-extensions.min.css';
  #page-index {
    margin-bottom: 25rem;
    position: relative;

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
    .poweredby {
      text-align: center;
      margin: 5rem 0;
      * {
        display: inline-block;
        vertical-align: middle;
      }
      .ualogo {
        background: url("https://www.universalapps.dk/assets/img/universalapps_logo.png");
        background-size: contain;
        background-repeat: no-repeat;
        height: 20px;
        width: 105px;
        border-right: 1px solid #ccc;
        margin-right: 5px;
      }
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

  .overlay {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    position: absolute;
    top: 0;

    .info {
      text-align: center;
      font-family: Arial;
      padding: 2em;
      top: 50vh !important;
      height: auto !important;
      padding: 20px;
      left: 50% !important;
      transform: translate(-50%, -50%);
      position: relative;
      max-width: 45em;
      background-color: #fff;
      box-sizing: border-box;

      @media screen and (max-width: 600px) {
        width: calc(100% - 30px) !important;
      }

      &--title {
        font-size: 24px;
      }

      &--text {
        text-align: left;
        white-space: pre-line;
        font-size: 16px;
      }

      &--close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        cursor: pointer;
      }
    }
  }
</style>
