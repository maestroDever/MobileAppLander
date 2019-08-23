<template>
  <div class="container">
    <div class="notification">
      <h1 v-if="error.statusCode === 404" class="is-size-1">
        {{ error.message }}
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 40rem;
  }
</style>
