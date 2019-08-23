<template>
  <div>
    <h1 v-if="error.statusCode === 404">
      {{ error.message }}
    </h1>
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

</style>
