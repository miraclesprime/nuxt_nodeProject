<template>
  <div :id="'status-wrap-'+compId" class="d-flex gap-05 align-center">
    <div v-if="statusOutput.text" :id="'status-dot-'+compId " class="d-flex align-center justify-center shape-circle circle" :style="{'background-color': hex2rgba(statusOutput.color)}" ><span class="dot shape-circle" :style="{'background-color' : statusOutput.color}"></span>
    </div>
    <span v-if="statusOutput.text && !iconOnly" :id="'status-text-'+compId " class="text-dark text-truncate">{{ statusOutput.text }}</span>
  </div>
</template>
<script>
// import { ColorVariants } from '~/node_modules/@bizinbox/bib-ui-lib/dist/library'
// import { ColorVariants } from '~/../bib-shared/js/colors'
export default {

  name: 'StatusComp',

  data() {
    return {

    }
  },
  props: {
    status: { type: Object },
    iconOnly: { type: Boolean, default: false }
  },
  computed: {

    statusOutput() {
      if (this.status == null) {
        return { text: "", color: "" }
      }
      switch (this.status.id) {
        case 1:
          return { text: this.status.text, color: this.colors.ColorVariants.Secondary }
        case 2:
          return { text: this.status.text, color: this.colors.ColorVariants.Primary }
        case 3:
          return { text: this.status.text, color: this.colors.ColorVariants.Orange }
        case 4:
          return { text: this.status.text, color: this.colors.ColorVariants.Danger }
        case 5:
          return { text: this.status.text, color: this.colors.ColorVariants.Success }
        default:
          return { text: "", color: "" }
      }
    },
    compId() {
      return Math.floor((Math.random() * 1000) + 1);
    },
    bgOuter() {
      return { 'background-color': `rgba(${this.colors.ColorVariants.Primary} , 0.16)` }
    },
  },
  methods: {
    hex2rgba (hex = this.colors.ColorVariants.Light, alpha = .16) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    },
  }
}

</script>
<style lang="scss" scoped>
.circle {
  width: 24px;
  height: 24px;

  .dot {
    width: 8px;
    height: 8px;
  }
}

</style>
