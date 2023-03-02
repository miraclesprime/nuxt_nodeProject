<template>
  <client-only>
    <div v-show="show" ref="inlineDatepicker" class="picker-wrapper" v-click-outside="onClickOutside" :style="position">
      <!-- <div v-if="localDate" class="align-center gap-05 cursor-pointer" @click.stop="triggerDatePicker">
        <bib-icon icon="calendar" :variant="newOverdue ? 'gray5' : 'danger'" class="events-none"></bib-icon>
        <format-date :datetime="localDate" :variant="newOverdue ? 'gray5' : 'danger'" class="events-none"></format-date>
      </div>
      <div v-else class="date-info-blank date-info shape-circle align-center justify-center cursor-pointer" @click.stop="triggerDatePicker">
        <bib-icon icon="calendar" variant="gray4" class="events-none"></bib-icon> <span v-format-date="localDate"></span>
      </div> -->
      <!-- date picker -->
      <datepicker :value="datetime" v-model="localDate" :inline="true" @input="datePicked" @click.native.stop placeholder="Due date"></datepicker>
    </div>
  </client-only>
</template>
<script>
import dayjs from 'dayjs'
import _ from 'lodash'
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
        // root: document.querySelector('#main-content'),
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
    /*newOverdue() {
      return (new Date(this.localDate) < new Date()) ? false : true
    },*/
    position() {
      /*let left1 = this.coordinates.left || window.innerWidth/2
      let top1 = this.coordinates.top || window.innerHeight/2

      if (picker) {
        let diff = window.innerHeight - (picker.offsetTop + picker.offsetHeight + 10)
        if (window.innerHeight < (picker.offsetTop + picker.offsetHeight)) {
          top += diff
        } else {
          top += 0
        }
      }
      return { left: left1 + 'px', top: top1 + 'px' }*/
      
      return this.coordinates
    },
  },
  /*mounted() {
    this.localDate = _.clone(this.datetime)
  },*/
  methods: {
    callback(entries, observer) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          // console.log(entry.target, 'no')
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
      // console.log('date input-> ', this.localDate)
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
