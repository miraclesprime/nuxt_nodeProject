<template>
  <div class="input-wrapper-two shape-rounded " id="input-two-wrapper" >
    <div class="align-center gap-01 px-05" id="input-two-span-wrap">
      <bib-icon v-if="icon && iconPosition == 'left'" :icon="icon" :variant="iconVariant"></bib-icon>
      <input :type="type" v-model="localData" class=" height-2 " :class="{'text-danger': !validNumber}" :style="{width: inputwidth}" @keyup="handleInput" @input="onInput" >
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
    type: {type: String, default: "text"},
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
      } else {
        this.localData = ""
      }
    },
  },
  computed: {
    inputwidth(){
      // console.log(this.localData.length)
      return this.localData.length >= 6 ? (this.localData.length + 1) * 8 + "px" : "60px"
    },
    validNumber(){
      if (this.type == 'number') {
        return (typeof(this.localData) === 'number' || typeof(this.localData) === "string" && this.localData.trim() !== '') && !isNaN(this.localData);
      } else {
        return true
      }
      // return /^-?\d+$/.test(this.localData);
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
    handleInput() {
      // Remove any non-numeric and non-decimal characters
      let cleanedValue = this.localData.replace(/[^0-9.]/g, '');

      // Split the value into integer and decimal parts
      let parts = cleanedValue.split('.');
      let integerPart = parts[0];
      let decimalPart = parts[1] || '';

      // Limit decimal part to 2 digits
      if (decimalPart.length > 2) {
        decimalPart = decimalPart.slice(0, 2);
      }

      // Combine integer and decimal parts back
      cleanedValue = decimalPart === '' ? integerPart : `${integerPart}.${decimalPart}`;

      // Update the input value
      this.localData = cleanedValue;
    },
    onInput: _.debounce(function() {
      if (this.validNumber) {
        // this.$emit("input", this.localData)
        console.log(this.localData)
      }
    }, 600)
  }
}

</script>
<style lang="scss" scoped>

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


input[type=number] {
  -moz-appearance: textfield;
}

</style>
