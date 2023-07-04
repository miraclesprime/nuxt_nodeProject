<template>
  <div class="picker-wrapper-two shape-rounded " id="select-two-wrapper" v-click-outside="onClickOutside" >
    <div id="select-two-trigger" class="user-data cursor-pointer height-2 align-center justify-between px-05" @click.stop="triggerOpen">
      <div class="align-center gap-05" id="select-two-span-wrap">
        <bib-icon :icon="icon" variant="gray4"></bib-icon>
        {{localData.label || localData.title}}
      </div>
      <bib-icon icon="arrowhead-down" variant="gray5" :scale="0.8"></bib-icon>
    </div>
    <div v-show="show" class="picker-content p-025" id="select-two-content" @mouseleave="closeDD">
      <p id="select-two-heading" class="font-sm text-left p-025 border-bottom-light">{{title}}</p>
      <div class="picker-list-wrap " style="max-height: 15rem; overflow-y: auto; overflow-x: clip; " id="select-two-list-wrap">
        <ul class="m-0 p-0 text-left" id="select-two-list">
          <li v-for="(opt, index) in options" :id="'dept-select-list-'+index" :key="opt.index" class="p-025 align-center gap-05 font-md cursor-pointer bg-hover-light" @click.stop="selected(opt)">
            <bib-icon v-if="icon" :icon="icon" variant="gray4"></bib-icon>
            {{opt.label}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {

  name: 'SelectTwo',

  props: {
    value: { type: Object },
    options: { type: Array, required: true },
    icon: { type: String, default: null },
    title: { type: String, default: "Select" },
  },

  data() {
    return {
      show: false,
      localData: { value: null, label: "No department" },
      // localData: {},
      // filterKey: "",      
    }
  },
  watch: {
    value(newValue, oldValue){
      if (newValue) {
        this.localData = newValue
      } else {
        this.localData = { label: 'No department', value: null }
      }
    },
  },
  computed: {
    ...mapGetters({
      // departments: "department/getAllDepartments",
    }),
  },
  mounted() {
    if (this.value) {
      this.localData = this.value
    } else {
      this.localData = { label: 'No department', value: null }
    }
  },
  methods: {
    triggerOpen() {
      this.show = !this.show
      this.$emit("close-other")
    },
    selected(dept){
      this.localData = dept
      this.$emit("change", dept)
      this.show = false
    },
    onClickOutside() {
      this.show = false
    },
    closeDD: _.debounce(function() {
      this.show = false
    }, 3000),
  }
}

</script>
<style lang="scss" scoped>


</style>
