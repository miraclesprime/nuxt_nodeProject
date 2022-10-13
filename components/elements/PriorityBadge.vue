<template>
  <div :id="'priority-badge-'+compId" class="priority-badge d-flex gap-05 align-center px-05 shape-rounded" :class="priorityOutput.bg">
    <!-- <bib-icon v-if="priorityOutput.icon" icon="urgent-solid" :scale="1" :variant="priorityOutput.color"></bib-icon> -->
    <span class="icon width-1 height-1 text-center font-xs" :class="'text-' + priorityOutput.color">!</span>
    <span v-if="priorityOutput.text && !iconOnly" :id="'priority-text'+compId" class="text-capitalize font-xs" :class="'text-' + priorityOutput.color">
      {{ priorityOutput.text }}
    </span>
  </div>
</template>
<script>
export default {

  name: 'PriorityBadge',

  data() {
    return {

    }
  },
  props: {
    priority: { type: Object },
    iconOnly: false,
  },
  computed: {
    priorityOutput() {
      if (this.priority == null) {
        return { text: "", color: "", bg: "bg-secondary-sub4" }
      }
      switch (this.priority.id) {
        case 1:
          return { text: this.priority.text, color: "danger", bg: "bg-danger-sub3" }
        case 2:
          return { text: this.priority.text, color: "orange", bg: "bg-orange-sub3" }
        case 3:
          return { text: this.priority.text, color: "success", bg: "bg-success-sub4" }
        default:
          return { text: "", color: "", bg: "bg-secondary-sub4" }
      }
    },
  	compId(){
      return Math.floor((Math.random()*1000)+1);
    },
  },
}

</script>
<style lang="scss" scoped>
.priority-badge {
  min-height: 24px;
}
/*.bg-orange-sub3 { background-color: rgba($orange, 0.2);}*/
</style>
