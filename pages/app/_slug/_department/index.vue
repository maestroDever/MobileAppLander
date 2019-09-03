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
import SpecificAppMixinx from '~/mixins/SpecificAppMixins'

export default {
  mixins: [SpecificAppMixinx],
  asyncData ({ params, error }) {
    return axios.get('https://app.autoapps.dk/backend/api/landing/apps/' + params.slug + '?department_id=' + params.department)
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
  .app-image-wrapper {
    position: relative;
    background-image: url('/tires.png');
    background-position: top center;
    .iphone-background{
      position: absolute;
      display: block;
      top: 92px;
      width: 255px;
      right: 0;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      background: black;
    }
    .image {
      position: relative;
      overflow: hidden;
      img {
        width: auto;
        margin: auto;
      }
      .dashboard-image {
        position: absolute;
        top: 92px;
        width: 255px;
        left: 50%;
        transform: translateX(-50%);
      }
      .gradient {
        position: absolute;
        bottom: 0;
        width: 255px;
        height: 270px;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
        left: 50%;
        transform: translateX(-50%);
      }
      .app-icon-wrapper {
        position: absolute;
        top: 65%;
        left: 50%;
        transform: translate(-50%, 0);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 2;

        .is-80x80 {
          width: 80px;
          height: 80px;
          border-radius: 5px;
          background: white;
          box-shadow: 1px 4px 12px 1px rgba(0, 0, 0, 0.7);
        }
        .app-name {
          font-size: 1.6rem;
          padding-top: 1.6rem;
          color: #fff;
          text-shadow: 0 2px 4px 0 rgba(0,0,0,0.3);
          font-weight: bold;
          line-height: 18px;
        }

        .company-name {
          font-size: 1.2rem;
          padding-top: 1rem;
          color: #fff;
          text-shadow: 0 2px 4px 0 rgba(0,0,0,0.3);
          line-height: 14px;
        }
      }
    }
  }

  .footer {
    padding-bottom: 4.5rem;

    & > * {
      margin: auto;
    }

    &--title {
      width: 32rem;
      font-size: 2.3em !important;
      font-weight: bold;
      line-height: 1.2em !important;
    }

    .description {
      max-width: 40rem;
      white-space: pre-line;
      text-align: left;
      tab-size: 4;
    }

    .buttons {
      justify-content: center;
      margin: auto;
      padding: 2rem 0;

      img {
        margin: 1rem;
        cursor: pointer;
        max-width: 20rem;
      }
    }
  }

  .text {
    font-size: 1.8rem;
  }

  .post-footer {
    background-color: #111;
    color: #fff;
    text-align: center;
    padding: 3.6rem 1.5rem 4rem;

    .text {
      @media screen and (min-width: 360px) {
        width: 36rem;
        margin: auto;
      }
    }

    .button {
      width: 12rem;
      height: 3.6rem;
      font-size: 1.4rem;
      margin: .4rem;
      font-weight: bold;
      border-radius: 8px;

      &:not(.active) {
        background-color: rgba(255,255,255,0.2);
        color: #fff;
        border: none;
      }
    }
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
</style>
