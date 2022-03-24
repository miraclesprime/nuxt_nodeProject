<template>
  <div id="pb-wrap">
    <div id="pb-info" class="position-relative d-flex justify-end min-height-1 m-auto font-w-400 font-sm  text-gray5">
      <span id="pb-label" v-if="label" class="label mr-auto">{{label}}</span>
      <span id="pb-text" :class="'text-'+background"> {{prefix}}{{value}}{{suffix}} </span>
    </div>
    <div id="pb-progress" class="progress">
      <div id="pb-progress-bar" class="progress__mask" :class="'bg-'+background" :style="{ width: value + '%' }">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ProgressBar",
  props: {
    label: "",
    value: {
      // type: Number,
      required: true,
      default: 0,
    },
    total: { required: true, default: 100},
    suffix: "",
    prefix: "",
    background: {
      type: String,
      default () {
        return 'gray5';
      },
    },
  },
};

</script>
<style lang="scss" scoped>
.progress {
  height: 6px;
  margin-top: 3px;
  overflow: hidden;

  &__mask {
    min-width: 6px;
    height: 100%;
    border-radius: 1em;
    transition: width 0.5s ease-out;
  }
}

</style>
