<template>
  <div class="input-wrapper-two shape-rounded " id="input-two-wrapper" >
    <div class="align-center gap-01 px-05" id="input-two-span-wrap">
      <bib-icon v-if="icon && iconPosition == 'left'" :icon="icon" :variant="iconVariant"></bib-icon>
      <input v-if="type == 'text'" type="text" v-model="localData" class="height-2 " :style="{width: inputwidth}" @input="onInput" >
      <input v-if="type == 'number'" type="text" v-model="localData" class="height-2 " :class="{'text-danger': !isValid}" :style="{width: inputwidth}" @blur="handleInput" >
      <bib-icon v-if="icon && iconPosition == 'right'" :icon="icon" :variant="iconVariant"></bib-icon>
      <bib-icon v-if="!isValid" icon="urgent" variant="danger"></bib-icon>
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
      isValid: true,
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
  },
  mounted() {
    if (this.value) {
      this.localData = this.value
    } else {
      this.localData = ""
    }
  },
  methods: {
    handleInput(e) {
      // Remove any non-numeric and non-decimal characters
      // check input is a number
      let cleanedValue = this.localData.replace(/[^0-9.]/g, '');

      // Split the value into integer and decimal parts
      let parts = cleanedValue.split('.');
      let integerPart = parts[0];
      let decimalPart = parts[1] || "";

      // Limit decimal part to 2 digits
      if (decimalPart.length > 2) {
        decimalPart = decimalPart.slice(0, 2);
      }

      // Combine integer and decimal parts back
      cleanedValue = parts.length == 1 ? integerPart : `${integerPart}.${decimalPart}`;

      // Update the input value
      // this.localData = cleanedValue;
      this.validNumber()
      this.onInput()
    },
    onInput: _.debounce(function() {
      // console.log(this.localData)
      this.$emit("input", this.localData.trim())
    }, 600),
    validNumber(){
      console.log(this.localData)
      if (this.type == 'number') {
        // Convert the input to a string to handle both numbers and strings as input
        const inputString = this.localData.toString();

        if (inputString.length == 0) {
          this.isValid = true
        } else {
          // Use a regular expression to check for valid number format
          // This regex matches numbers with up to 2 decimal places
          // const regex = /^[+-]?\d+(\.\d{1,2})?$/;
          const regex = /^[+-]?\d*\.?\d{1,2}$/;
          this.isValid = regex.test(inputString);
        }
        // return (typeof(this.localData) === 'number' || typeof(this.localData) === "string" && this.localData.trim() !== '') && !isNaN(this.localData);
      } else {
        this.isValid = true
      }
      // return /^-?\d+$/.test(this.localData);
    },
  },
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
