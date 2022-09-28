<template>
  <div class="d-flex align-center justify-center h-100">
    <div class="card">
      <h3>The project you're looking for does not exist or is deleted.</h3>
      <p>Go to <nuxt-link to="/projects">Projects page</nuxt-link>
      </p>
    </div>
  </div>
</template>
<script>
export default {

  name: 'NotFound',

  data() {
    return {

    }
  }
}

</script>
<style lang="css" scoped>
</style>
