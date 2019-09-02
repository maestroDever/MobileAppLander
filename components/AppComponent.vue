<template>
  <div class="columns is-mobile" style="cursor: pointer;">
    <div class="image-wrapper">
      <figure class="image">
        <img
          class="image is-60x60"
          :src="appItem.company_logo && appItem.company_logo.replace('http:', '')"
          :alt="appItem.app_name"
        >
      </figure>
    </div>
    <div class="container">
      <h3 class="title">
        {{ appItem.app_name }}
        <span class="icon is-pulled-right" style="color: #C7C7CC;">
          <font-awesome-icon icon="angle-right" class="is-size-2" />
        </span>
      </h3>
      <p class="subtitle">
        <!-- {{ appItem.company_name }} -->
        {{ appItem.department_info.address }}
        <br>
        {{ appItem.department_info.zip }}
        {{ appItem.department_info.city }}
        <span v-if="showDistance" class="is-pulled-right">
          {{ appItem.distance | distanceFilter }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppComponent',
  filters: {
    distanceFilter (value) {
      if (value !== null) {
        if (value < 1000) { value = Math.round(value) + 'm' } else { value = Math.round(value / 1000) + 'km' }
        return value
      }
    }
  },
  props: {
    appItem: {
      type: Object,
      default: null
    },
    showDistance: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .image-wrapper {
    margin: 1.4rem;
    padding-right: 1rem;
    border-right: 1px solid #ccc;
  }

  .container {
    margin: 1.7rem;
    margin-left: 0;
  }

  .title {
    color: #003145;
    font-size: 1.6rem;
    line-height: 1.9rem;
  }

  .subtitle {
    color: #323232;
    font-size: 13px;
    line-height: 16px;
  }

  .is-60x60 {
    width: 6rem;
    height: 6rem;
  }
</style>
