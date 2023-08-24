<template>
  <div :id="'status-badge-'+compId" class="status-badge gap-025 align-center shape-rounded px-05" :style="{'background-color': $hex2rgba(statusOutput.color, colors)}">
    <!-- <div :id="'status-dot-'+compId" class="dot shape-circle" :style="{'background-color': statusOutput.color}"></div> -->
    <bib-icon icon="check-circle-solid" :scale="0.8" :variant="statusOutput.color"></bib-icon>
    <span v-if="statusOutput.text && !iconOnly" :id="'status-text-'+compId " class="font-xs text-truncate" :class="['text-'+statusOutput.color]" >{{ statusOutput.text }}</span>
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
        return { text: "None", color: "secondary" }
      }
      switch (this.status.id) {
        case 1:
          return { text: this.status.text, color: "secondary" }
        case 2:
          return { text: this.status.text, color: "primary" }
        case 3:
          return { text: this.status.text, color: "orange" }
        case 4:
          return { text: this.status.text, color: "danger" }
        case 5:
          return { text: this.status.text, color: "success" }
        default:
          return { text: "None", color: "secondary" }
      }
    },
    compId(){
      return Math.floor((Math.random()*1000)+1);
    },
  },
  
}

</script>
<style lang="scss" scoped>
.status-badge {
  min-height: 24px;
}
.dot { width: 8px; height: 8px; }
</style>
