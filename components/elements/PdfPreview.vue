<template>
  <div>
    <iframe width="100%" height="100%" name="plugin" :src="pdfsrc" ></iframe>
  </div>
</template>

<script>

export default {
  props: {
    pdfsrc: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>

</style>