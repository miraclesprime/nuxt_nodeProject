<template>
  <client-only>
    <div v-show="show" ref="inlineDatepicker" class="picker-wrapper" id="inline-date-picker-wrapper" v-click-outside="onClickOutside" :style="position">
      <!-- <datepicker :value="datetime" v-model="localDate" :inline="true" @input="datePicked" @click.native.stop placeholder="Due date"></datepicker> -->
      <bib-datetime-picker v-model="localDate" :hasInputElement="false" @input="datePicked" @click.native.stop></bib-datetime-picker>
    </div>
  </client-only>
</template>

<script>
// import _ from 'lodash'
export default {

  name: 'InlineDatepicker',
  
  props: {
    datetime: [Date, String],
    overdue: Boolean,
    show: {type: Boolean, default: false },
    coordinates: Object,
  },

  data() {
    return {
      localDate: null,
    }
  },

  watch: {
    coordinates (newValue) {
      let options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      }

      let observer = new IntersectionObserver(this.callback, options);
      let target = this.$refs.inlineDatepicker
      observer.observe(target);
    },
    datetime(newValue, oldValue){
      this.localDate = newValue
    },
  },

  computed: {
    position() {
      return this.coordinates
    },
  },
  methods: {
    callback(entries, observer) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          if (entry.boundingClientRect.right > entry.rootBounds.width) {
            this.position.left = (entry.rootBounds.width - entry.boundingClientRect.width) - 10 + 'px'
          }
          if (entry.boundingClientRect.bottom > entry.rootBounds.height) {
            this.position.top = (entry.rootBounds.height - entry.boundingClientRect.height) - 10 + 'px'
          }
        } 
      });
    },
    datePicked() {
      this.$emit("date-updated", this.localDate)
      this.$emit('close')
    },
    onClickOutside() {
      this.$emit('close')
    },
  }
}

</script>
<style lang="scss" scoped>
.picker-wrapper {
  background-color: $white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  border: 1px solid $gray4;
  border-radius: 0.25rem;
  /*width: 15rem;*/
  box-shadow: 0 2px 10px rgba(100, 100, 100, 0.25);
  transition: left 300ms ease-out, top 200ms ease-out;
  will-change: top, left;
}

</style>
