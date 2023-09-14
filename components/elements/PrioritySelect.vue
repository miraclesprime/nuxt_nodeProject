<template>
  <div class="picker-wrapper w-100" id="priority-select-wrapper" v-click-outside="onClickOutside">
    <div id="priority-select-button" class="user-data cursor-pointer height-2 align-center justify-between" @click.stop="triggerOpen">
      <div id="priority-select-inner-wrap" class="align-center flex-grow-1 gap-025">
        <bib-icon icon="security-verified" :variant="localValue.color"></bib-icon>
        <span class="text-capitalize text-truncate" style="max-width: 80%;" id="priority-select-localValue-label" >
          {{ localValue.label }}
        </span>
      </div>
      <bib-icon icon="arrow-down" variant="gray4" :scale="0.5"></bib-icon>
    </div>
    <div v-show="show" class="picker-content" id="priority-select-content"> 
      <div class="picker-list-wrap" id="priority-select-list-wrap">
        <ul class="m-0 p-0 text-left" id="priority-select-list">
          <li v-for="pt in priorityList" :key="pt.value+'stitem'" :id="'ps-'+pt.value" class="p-025 gap-05 align-center font-md cursor-pointer" @click.stop="onStatusChange(pt)">
            <bib-icon icon="security-verified" :variant="pt.color"></bib-icon>
            <span :id="'ps-'+pt.label" class="text-dark text-truncate">{{pt.label}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { PRIORITY } from '~/config/constants.js'
export default {

  name: 'PrioritySelect',

  props: {
    priority: { type: Object },
  },
  data() {
    return {
      priorityItems: PRIORITY,
      show: false,
      localValue: {},
    }
  },
  computed: {
    priorityList() {
      let prio = []
      this.priorityItems.forEach(pt => {
        if (pt.value == 0) prio.push({ value: null, label: "--", color: "gray4", bgcolor: this.$hex2rgba(this.colors.ColorVariants.Gray4) })
        if (pt.value == 1) prio.push({ value: pt.value, label: pt.label, color: pt.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Danger) })
        if (pt.value == 2) prio.push({ value: pt.value, label: pt.label, color: pt.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Orange) })
        if (pt.value == 3) prio.push({ value: pt.value, label: pt.label, color: pt.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Success) })
      })

      return prio
    },
  },
  mounted() {
    if (this.priority && this.priority.id) {
      this.localValue = this.priorityItems.find( pt => pt.value == this.priority.id )
    } else {
      this.localValue = { label: '--', value: 0, color: "gray4", bgcolor: "gray4" }
    }
  },
  methods: {
    triggerOpen() {
      this.show = !this.show
      this.$emit('close-other')
    },

    onClickOutside() {
      this.show = false
    },

    onStatusChange(status) {
      this.localValue = status
      this.$emit("change", status)
      this.show = false
    },
  }
}

</script>
<style lang="scss" scoped>
.picker-wrapper {
  /*background-color: $white;*/
  position: relative;

  .picker-content {
    position: absolute;
    z-index: 55;
    left: -5px;
    top: -5px;
    min-height: fit-content;
    max-height: 30rem;
    min-width: calc(100% + 10px);
    background-color: $white;
    border: 1px solid $gray4;
    padding: 0.5rem;
    border-radius: 0.25rem;
    box-shadow: 0 2px 10px rgba(100, 100, 100, 0.25);
  }

  .user-data {
    border: 0 none;
    background-color: transparent;
    padding: 0;
    font-size: $base-size;
  }

  .picker-list-wrap {}

}

.circle {
  width: 24px;
  height: 24px;

  .dot {
    width: 8px;
    height: 8px;
  }
}

</style>
