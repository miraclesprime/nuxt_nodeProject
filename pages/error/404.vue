<template>
  <div id="error-404-wrapper" class="shape-rounded bg-light">
    <h1 id="error-404-heading1">Page not found</h1>
    <h1 id="error-404-heading2">An error occurred</h1>
    <NuxtLink class="error-link" to="/">Redirect to Home</NuxtLink>
  </div>
</template>

<style scoped lang="scss">
#error-404-wrapper {
  max-width: 30rem;
  margin: 50px auto;
  text-align: center;
  padding: 1rem;
}
.error-link {
  text-decoration: underline;
}
</style>