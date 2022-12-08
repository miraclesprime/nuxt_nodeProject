<template>
  <div>
    <iframe width="100%" height="400px" name="plugin" :src="pdfsrc" ></iframe>
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