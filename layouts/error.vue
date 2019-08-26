<template>
  <div class="container has-text-centered">
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
    height: 100vh;
    background-color: whitesmoke;
  }
</style>
