<template>
    <div id="error-500-wrapper" class="shape-rounded bg-light">
      <h1 id="error-500-heading" >There was some error, something went wrong. we are redirecting you.</h1>
      <NuxtLink class="error-link" to="/">Redirect to Home</NuxtLink>
    </div>
</template>

<script>

export default {
  mounted() {

    this.$router.push("/projects")
  }
}

</script>


<style lang="scss" scoped>
#error-500-wrapper {
  max-width: 40rem;
  margin: 50px auto;
  text-align: center;
  padding: 1rem;
}
.error-link {
  text-decoration: underline;
}
</style>