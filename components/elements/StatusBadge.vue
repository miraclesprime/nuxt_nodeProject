<template>
  <div :id="'status-badge-'+compId" class="status-badge d-flex gap-05 align-center shape-rounded px-05" :style="{'background-color': hex2rgba(statusOutput.color)}">
    <div :id="'status-dot-'+compId" class="dot shape-circle" :style="{'background-color': statusOutput.color}"></div>
    <span v-if="statusOutput.text && !iconOnly" :id="'status-text-'+compId " class="font-xs text-truncate" :style="{'color': statusOutput.color}">{{ statusOutput.text }}</span>
  </div>
</template>

<script>
export default {

  name: 'StatusBadge',

  data() {
    return {

    }
  },
  props: {
    status: { type: Object },
    iconOnly: false,
  },
  computed: {
    
    statusOutput() {
      if (this.status == null) {
        return { text: "", color: this.colors.ColorVariants.Secondary }
      }
      switch (this.status.id) {
        case 1:
          return { text: this.status.text, color: this.colors.ColorVariants.Primary }
        case 2:
          return { text: this.status.text, color: this.colors.ColorVariants.Orange }
        case 3:
          return { text: this.status.text, color: this.colors.ColorVariants.Secondary }
        case 4:
          return { text: this.status.text, color: this.colors.ColorVariants.Danger }
        case 5:
          return { text: this.status.text, color: this.colors.ColorVariants.Success }
        default:
          return { text: "", color: this.colors.ColorVariants.Secondary }
      }
    },
    compId(){
      return Math.floor((Math.random()*1000)+1);
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
.status-badge {
  min-height: 24px;
}
.dot { width: 8px; height: 8px; }
</style>
