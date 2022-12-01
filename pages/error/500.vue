<template>
    <div id="error-500-wrapper" class="shape-rounded bg-light">
      <h1 id="error-500-heading" >Something is wrong</h1>
      <NuxtLink class="error-link" to="/">Redirect to Home</NuxtLink>
    </div>
</template>


<style lang="scss" scoped>
#error-500-wrapper {
  max-width: 30rem;
  margin: 50px auto;
  text-align: center;
  padding: 1rem;
}
.error-link {
  text-decoration: underline;
}
</style>