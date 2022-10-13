<template>
  <div :id="'status-badge-'+compId" class="status-badge d-flex gap-05 align-center shape-rounded px-05" :class="statusOutput.bg">
    <div class="dot shape-circle" :class="'bg-'+statusOutput.color"></div>
    <!-- <div v-if="statusOutput.text" :id="'status-dot-'+compId " class="shape-circle " :class="'bg-' + statusOutput.color" >
    </div> -->
    <span v-if="statusOutput.text && !iconOnly" :id="'status-text-'+compId " class="font-xs text-truncate" :class="'text-'+statusOutput.color">{{ statusOutput.text }}</span>
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
        return { text: "", color: "" }
      }
      switch (this.status.id) {
        case 1:
          return { text: this.status.text, color: "secondary", bg: 'bg-secondary-sub4' }
        case 2:
          return { text: this.status.text, color: "primary", bg: 'bg-primary-sub3' }
        case 3:
          return { text: this.status.text, color: "warning", bg: 'bg-warning-sub3' }
        case 4:
          return { text: this.status.text, color: "danger", bg: 'bg-danger-sub3' }
        case 5:
          return { text: this.status.text, color: "success", bg: 'bg-success-sub4' }
        default:
          return { text: "", color: "" }
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
