<template>
  <section class="section is-paddingless has-text-centered app-wrapper">
    <div class="body">
      <div class="app-image-wrapper">
        <div class="iphone-background" />
        <figure class="image">
          <!-- <img v-if="window.width >= 640" src="/graphics_iphone_2x.png" alt="iPhone-Frame"> -->
          <img src="/graphics_iphone.png" alt="iPhone-Frame">
          <transition name="fade" :appear="true" mode="out-in">
            <img :key="dashboardImage" class="dashboard-image" :src="dashboardImage" alt="">
          </transition>
          <div class="app-icon-wrapper">
            <figure class="image is-80x80">
              <img
                class="is-paddingless"
                :src="appItem.app_icon.replace('http:', '')"
                alt="App Icon"
              >
            </figure>
            <div class="app-name">
              {{ appItem.app_name }}
            </div>
            <div class="company-name">
              {{ departmentName }}
            </div>
          </div>
          <div class="gradient" />
        </figure>
      </div>
    </div>
    <div class="footer">
      <div class="text footer--title">
        Få personlig service med vores app. Hent appen for at komme i gang.
      </div>
      <div class="buttons">
        <a v-if="appStoreId" :href="appItem.app_store_link">
          <img class="store-link" src="/app-store-1.png" alt="App Store Button">
        </a>
        <a v-if="googlePlayId" :href="appItem.google_play_link">
          <img class="store-link" src="/google-play-store-1.png" alt="Google Play Button">
        </a>
      </div>
      <div class="text description">
        {{ appItem.description }}
      </div>
    </div>

    <div v-if="(appStoreId || googlePlayId ) && (deviceType === 'Desktop' || !deviceType)" class="post-footer">
      <div class="text has-text-weight-bold">
        Hent appen ved at scanne QR koden med din smartphone
      </div>
      <div class="column is-full-desktop">
        <button
          v-if="appStoreId"
          class="button"
          :class="{'active': qrFor === 'ios'}"
          @click="setQR('ios')"
        >
          iOS
        </button>
        <button
          v-if="googlePlayId"
          class="button"
          :class="{'active': qrFor === 'android'}"
          @click="setQR('android')"
        >
          Android
        </button>
      </div>
      <div class="column is-full-desktop is-flex" style="justify-content: center;">
        <figure class="image is-128x128">
          <vue-qrcode :value="qrFor === 'ios' ? appItem.app_store_link : appItem.google_play_link" :options="{ width: 128 }" />
        </figure>
      </div>
    </div>
    <div class="poweredby">
      <span class="ualogo" /><p>Powered by <a href="https://universalapps.dk" target="_blank">Universal Apps ApS</a></p>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import SpecificAppMixins from '~/mixins/SpecificAppMixins'

export default {
  mixins: [SpecificAppMixins],
  asyncData ({ params, error }) {
    return axios.get('https://app.autoapps.dk/backend/api/landing/apps/' + params.slug)
      .then((res) => {
        return { appItem: res.data }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'App not found' })
      })
  }
}
</script>

<style lang="scss" scoped>
  @import '~static/app-style.scss';
</style>
