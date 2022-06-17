<template>
  <div :id="'priority-wrap-'+compId" class="d-flex gap-05 align-center">
    <bib-icon v-if="priorityOutput.icon" icon="urgent-solid" :scale="1" :variant="priorityOutput.color"></bib-icon>
    <span v-if="priorityOutput.text" :id="'priority-text'+compId" class="text-capitalize" :class="'text-' + priorityOutput.color">
      {{ priorityOutput.text }}
    </span>
  </div>
</template>
<script>
export default {

  name: 'PriorityComp',

  data() {
    return {

    }
  },
  props: {
    priority: { type: Object },
    // statusId: { type: Number},
  },
  computed: {
    priorityOutput() {
      if (this.priority == null) {
        return { text: "", color: "", icon: false }
      }
      switch (this.priority.id) {
        case 1:
          return { text: this.priority.text, color: "danger", icon: true }
        case 2:
          return { text: this.priority.text, color: "orange", icon: true }
        case 3:
          return { text: this.priority.text, color: "success", icon: true }
        default:
          return { text: "", color: "", icon: false }
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
