<template>
  <div id="error-403-wrapper" class="shape-rounded bg-light">
    <h1 id="error-403-heading1">Not Enough permission to see this page</h1>
    <NuxtLink class="error-link" to="/">Redirect to Home</NuxtLink>
  </div>
</template>

<style scoped lang="scss">
#error-403-wrapper {
  max-width: 30rem;
  margin: 50px auto;
  text-align: center;
  padding: 1rem;
}
.error-link {
  text-decoration: underline;
  color: $danger-sub2;
}
</style>