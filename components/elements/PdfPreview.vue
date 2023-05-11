<template>
  <div>
    <iframe title="pdfPreview" width="100%" height="460px" name="plugin" :src="pdfsrc" ></iframe>
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

<style lang="scss" scoped>
</style>