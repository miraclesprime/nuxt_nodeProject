<template>
  <div class="picker-wrapper-two shape-rounded " id="select-two-wrapper" v-click-outside="onClickOutside" >
    <div id="select-two-trigger" class="user-data cursor-pointer height-2 align-center justify-between gap-05 px-05" @click.stop="triggerOpen">
      <div class="align-center gap-05" id="select-two-span-wrap">
        <bib-icon v-if="icon" :icon="icon" :variant="visibleText.color || 'gray4'"></bib-icon>
        {{visibleText.label}}
      </div>
      <bib-icon icon="arrowhead-down" variant="gray5" :scale="0.8"></bib-icon>
    </div>
    <div v-show="show" class="picker-content p-025" id="select-two-content">
      <p id="select-two-heading" class="font-sm text-left p-025 border-bottom-light">{{title}}</p>
      <div class="picker-list-wrap " style="max-height: 16rem; overflow-y: auto; overflow-x: clip; " id="select-two-list-wrap">
        <input v-show="search" type="text" v-model="filterKey" ref="selectFilterInput" class="picker-input ">
        <ul class="m-0 p-0 text-left" id="select-two-list">
          <li v-for="(opt, index) in filtered" :id="'dept-select-list-'+index" :key="opt.index" class="p-025 pr-05 align-center gap-05 font-md cursor-pointer bg-hover-light text-hover-dark" :class="{'bg-light': opt.value == localData}" @click.stop="selected(opt)">
            <bib-icon v-if="icon" :icon="icon" :variant="opt.color || 'gray4'"></bib-icon>
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

  name: 'SelectTwo',

  props: {
    value: { type: [Number, String, Boolean] },
    options: { type: Array, required: true }, //array of objects { value: 1, label: 'Option 1'}
    icon: { type: String, default: null },
    title: { type: String, default: "Select" },
    search: Boolean,
    disabled: Boolean,
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
      // console.log(newValue == null)
      if (newValue || newValue != null) {
        this.localData = newValue
      } else {
        this.localData = 0
      }
    },
  },
  computed: {
    visibleText(){
      // console.info(this.localData)
      if (this.localData && this.options) {
        let out = this.options.find(op => op.value == this.localData)
        if (out) {
          return out
        } else {
          return { label: "None", value: null }
        }
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
      if (this.disabled) {
        return
      }
      this.show = !this.show
      this.$nextTick(() => {
        this.$refs.selectFilterInput.focus()
        this.$emit("close-other")
      });
    },
    selected(opt){
      this.localData = opt.value
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
