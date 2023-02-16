<template>
  <div v-if="loading" id="loading-comp" class="position-absolute align-center justify-center comp-loading text-secondary-sub1">
    {{text}}
  </div>
</template>
<script>
export default {

  name: 'Loading2',

  data() {
    return {


    }
  },
  props: {
    loading: { type: Boolean, default: true },
    text: String,
  }
}

</script>
<style lang="scss" scoped>
@keyframes gradAnimate { 
    0%{background-position:10% 0%}
    50%{background-position:90% 100%}
    100%{background-position:10% 0%}
}
.comp-loading {
  inset: 2px;
  background-color: rgba(250, 250, 250, 0.85);
  background: linear-gradient(90deg, $gray2, $white, $light, $white, $gray2);
  background-size: 200% 200%;
  z-index: 29;
    animation: gradAnimate 5s ease infinite;

}

</style>
