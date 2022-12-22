<template>
  <div class="d-flex align-center justify-center h-100">
    <div class="notfound">
      <h2 class="text-danger">Not Found!</h2>
      <h4>The project you're looking for, does not exist or is deleted.</h4>
      <p>Go to <nuxt-link to="/projects" class="">Projects page</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {

  name: 'NotFound',
}

</script>
<style lang="scss" scoped>
  .notfound {
    padding: 2.5rem; border-radius: 1rem; background-color: var(--bib-light)
  }
</style>
