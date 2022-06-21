<template>
  <div :id="'status-wrap-'+compId" class="d-flex gap-05 align-center">
    <div v-if="statusOutput.text" :id="'status-dot-'+compId " class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-' + statusOutput.color" >
    </div>
    <span v-if="statusOutput.text" :id="'status-text-'+compId " class="text-dark text-truncate">{{ statusOutput.text }}</span>
  </div>
</template>
<script>
export default {

  name: 'StatusComp',

  data() {
    return {

    }
  },
  props: {
    status: { type: Object },
  },
  computed: {
    
    statusOutput() {
      if (this.status == null) {
        return { text: "", color: "" }
      }
      switch (this.status.id) {
        case 1:
          return { text: this.status.text, color: "secondary" }
        case 2:
          return { text: this.status.text, color: "primary" }
        case 3:
          return { text: this.status.text, color: "warning" }
        case 4:
          return { text: this.status.text, color: "danger" }
        case 5:
          return { text: this.status.text, color: "success" }
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
<style lang="css" scoped>
</style>
