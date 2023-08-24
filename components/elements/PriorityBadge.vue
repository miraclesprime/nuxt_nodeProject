<template>
  <div :id="'priority-badge-'+compId" class="priority-badge gap-025 align-center px-05 shape-rounded" :style="{ 'background-color': $hex2rgba(priorityOutput.color, colors)}">
    <!-- <strong :id="'priority-icon-'+compId" class="icon text-center " :style="{'color': priorityOutput.color}">!</strong> -->
    <bib-icon icon="security-verified" :scale="0.8" :variant="priorityOutput.color"></bib-icon>
    <span v-if="priorityOutput.text != '' && !iconOnly" :id="'priority-text'+compId" class="text-capitalize font-xs" :class="['text-'+priorityOutput.color]" >
      {{ priorityOutput.text }}
    </span>
  </div>
</template>

<script>
import { PRIORITY } from '~/config/constants'
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
        return { text: "None", color: "secondary" }
      }
      switch (this.priority.id) {
        case 1:
          return { text: this.priority.text, color: "danger" }
        case 2:
          return { text: this.priority.text, color: "orange" }
        case 3:
          return { text: this.priority.text, color: "success" }
        default:
          return { text: "None", color: "secondary" }
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
.priority-badge {
  min-height: 24px;
  strong { width:8px; line-height: 16px;}
}
</style>
