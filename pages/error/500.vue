<template>
  <div id="500-error-wrapper">
    <h1 id="500-error-heading1" v-if="error && error.statusCode === 500">Something is going wrong</h1>
    <h1 id="500-error-heading2" v-else>An error occurred</h1>
    <NuxtLink to="/">Redirect to Home</NuxtLink>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "error"
};
</script>
