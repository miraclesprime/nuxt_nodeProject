<template>
  <div class="picker-wrapper-two shape-rounded " id="ps-wrapper" v-click-outside="onClickOutside">
    <div id="ps-button" class="user-data cursor-pointer height-2 align-center justify-between gap-05 px-05" @click.stop="triggerOpen">
      <div id="ps-inner-wrap" class="align-center gap-05">
        <bib-icon icon="security-verified" :variant="localValue.color"></bib-icon>
        <span class="text-capitalize text-truncate" style="max-width: 7rem;" id="ps-localValue-label" >
          {{ localValue.label }}
        </span>
      </div>
      <bib-icon icon="arrowhead-down" variant="gray5" :scale="0.8"></bib-icon>
    </div>
    <div v-show="show" class="picker-content p-025" id="ps-content" > 
      <p id="ps-heading" class="font-sm text-left p-025 border-bottom-light">Priority</p>
      <div class="picker-list-wrap " id="ps-list-wrap">
        <ul class="m-0 p-0 text-left" id="ps-list">
          <li v-for="pt in priorityList" :key="pt.value+'stitem'" :id="'ps-'+pt.value" class="p-025 pr-05 gap-05 align-center font-md cursor-pointer bg-hover-gray2" @click.stop="onStatusChange(pt)">
            <bib-icon icon="security-verified" :variant="pt.color"></bib-icon>
            <span :id="'ps-'+pt.label" class=" text-truncate" :class="'text-'+pt.color">{{pt.label}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { PRIORITY } from '~/config/constants.js'
export default {

  name: 'PrioritySelectTwo',

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
        if (pt.value == 0) prio.push({ value: null, label: "Choose priority", color: "secondary" })
        if (pt.value == 1) prio.push({ value: pt.value, label: pt.label, color: pt.color })
        if (pt.value == 2) prio.push({ value: pt.value, label: pt.label, color: pt.color })
        if (pt.value == 3) prio.push({ value: pt.value, label: pt.label, color: pt.color })
      })

      return prio
    },
  },
  watch: {
    priority (val, oldVal) {
      if (val != oldVal) {
        if (this.priorityItems) {
          this.setLocal()
        } else {
          console.warn("priorityItems no found");
        }
      }
    }
  },
  mounted() {
    this.setLocal()
  },
  methods: {
    setLocal(){
      if (this.priority?.id) {
        this.localValue = this.priorityItems.find( pt => pt.value == this.priority.id )
      } else {
        this.localValue = { label: 'Choose priority', value: 0, color: "dark" }
      }
    },
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



</style>
