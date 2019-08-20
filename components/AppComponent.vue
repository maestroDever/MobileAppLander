<template>
  <div class="columns is-mobile is-tablet" style="cursor: pointer;">
    <div class="column is-one-quarter is-hidden-tablet">
      <figure class="image">
        <img
          class="image"
          :src="appItem.app_icon"
          alt="logo"
        >
      </figure>
    </div>
    <div class="column is-hidden-mobile is-2">
      <figure class="image">
        <img
          class="image"
          :src="appItem.app_icon"
          alt="logo"
        >
      </figure>
    </div>
    <div class="column">
      <h3 class="title">
        {{ appItem.app_name }}
        <span class="icon is-pulled-right">
          <font-awesome-icon icon="angle-right" class="is-size-2" />
        </span>
      </h3>
      <p class="subtitle">
        {{ appItem.company_name }}
        <br>
        {{ appItem.department_info.zip }}
        {{ appItem.department_info.address }}
        {{ appItem.department_info.city }}
        <span v-if="showDistance" class="is-pulled-right">
          {{ appItem.distance | toFixed }}km
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppComponent',
  filters: {
    toFixed (value) {
      if (value !== null) { return value.toFixed(2) }
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
</style>
