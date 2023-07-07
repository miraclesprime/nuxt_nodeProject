<template>
  <div class="picker-wrapper-two shape-rounded " id="select-two-wrapper" v-click-outside="onClickOutside" >
    <div id="select-two-trigger" class="user-data cursor-pointer height-2 align-center justify-between gap-05 px-05" @click.stop="triggerOpen">
      <div class="align-center gap-05" id="select-two-span-wrap">
        <bib-icon :icon="icon" variant="gray4"></bib-icon>
        {{visibleText.label}}
      </div>
      <bib-icon icon="arrowhead-down" variant="gray5" :scale="0.8"></bib-icon>
    </div>
    <div v-show="show" class="picker-content p-025" id="select-two-content" >
      <p id="select-two-heading" class="font-sm text-left p-025 border-bottom-light">{{title}}</p>
      <div class="picker-list-wrap " style="max-height: 16rem; overflow-y: auto; overflow-x: clip; " id="select-two-list-wrap">
        <input v-show="search" type="text" v-model="filterKey" ref="selectFilterInput" class="picker-input ">
        <ul class="m-0 p-0 text-left" id="select-two-list">
          <li v-for="(opt, index) in sectionOpts" :id="'dept-select-list-'+index" :key="opt.index" class="p-025 pr-05 align-center gap-05 font-md cursor-pointer bg-hover-light text-hover-dark" :class="{'bg-light': opt.value == value}" @click.stop="selected(opt)">
            <bib-icon v-if="icon" :icon="icon" variant="gray4"></bib-icon>
            {{opt.label}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {

  name: 'SectionSelectTwo',

  props: {
    value: { type: [Number, String, Boolean] },
    options: { type: Array, required: true }, //array of objects { value: 1, label: 'Option 1'}
    icon: { type: String, default: null },
    title: { type: String, default: "Select" },
    search: Boolean,
  },

  data() {
    return {
      show: false,
      localData: 0,
      filterKey: "",      
    }
  },
  watch: {
    value(newValue, oldValue){
      if (newValue) {
        this.localData = newValue
      } else {
        this.localData = 0
      }
    },
  },
  computed: {
    sectionOpts(){
      let regex = new RegExp(this.filterKey, 'g\i')
      let sections = this.options.map(op => {
        if (op.label.includes("_section")) {
          return {label: "Untitled", value: op.value}
        } else {
          return op
        }
      })
      return sections.filter((u) => {
        if (regex.test(u.label)) {
          return u
        }
      })
    },
    visibleText(){
      let v = {}
      if (this.value && this.options) {
        this.options.find(op => {
          // console.log(op.label, op.value == this.value, op.label.includes("_section") )
          if(op.value == this.value && op.label.includes("_section")){
            v = { label: "Untitled", value: op.value}
            return
          }
          if (op.value == this.value) {
            v = op
            return
          } 
        })
        return v
      } else {
        return { label: "None", value: null }
      }
    },
    filtered() {
      let regex = new RegExp(this.filterKey, 'g\i')
      return this.options.filter((u) => {
        if (regex.test(u.label)) {
          return u
        }
      })
    },
  },
  mounted() {
    if (this.value) {
      this.localData = this.value
    } else {
      this.localData = 0
    }
  },
  methods: {
    triggerOpen() {
      this.show = !this.show
      this.$nextTick(() => {
        this.$refs.selectFilterInput.focus()
        this.$emit("close-other")
      });
    },
    selected(opt){
      this.localData = opt
      this.$emit("change", opt)
      this.show = false
    },
    onClickOutside() {
      this.show = false
    },

  }
}

</script>
<style lang="scss" scoped>


</style>
