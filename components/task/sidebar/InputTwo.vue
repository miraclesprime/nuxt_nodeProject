<template>
  <div class="input-wrapper-two shape-rounded " id="input-two-wrapper" >
    <div class="align-center gap-01 px-05" id="input-two-span-wrap">
      <bib-icon v-if="icon && iconPosition == 'left'" :icon="icon" :variant="iconVariant"></bib-icon>
      <input type="text" v-model="localData" ref="input2field" class=" height-2 " :style="{width: inputwidth}" @input="onInput" >
      <bib-icon v-if="icon && iconPosition == 'right'" :icon="icon" :variant="iconVariant"></bib-icon>
      <!-- {{visibleText.label}} -->
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {

  name: 'InputTwo',

  props: {
    value: { type: [Number, String] },
    icon: { type: String, default: null },
    iconPosition: { type: String, default: 'left' },
    iconVariant: { type: String, default: 'gray4' },
    disabled: Boolean,
  },

  data() {
    return {
      localData: 0,
    }
  },
  watch: {
    value(newValue, oldValue){
      if (newValue) {
        this.localData = newValue
        // this.$refs.input2field.style.width = ((this.localData.length + 2) * 8) + 'px';
      } else {
        this.localData = ""
        // this.$refs.input2field.style.width = '6rem'
      }
    },
  },
  computed: {
    inputwidth(){
      return (this.localData.length + 2) * 8 + "px"
    },
    
  },
  mounted() {
    if (this.value) {
      this.localData = this.value
    } else {
      this.localData = ""
    }
  },
  methods: {
    
    onInput: _.debounce(function() {
      // console.log(this.localData)
      this.$emit("input", this.localData)
    }, 600)
  }
}

</script>
<style lang="scss" scoped>


</style>
