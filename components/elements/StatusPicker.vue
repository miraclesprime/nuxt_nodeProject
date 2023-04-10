<template>
  <div v-show="show" ref="statusPicker" class="picker-wrapper" :style="position" v-click-outside="onClickOutside">
    <div class="picker-content">
      <!-- <input type="text" class="picker-input" ref="userFilterInput" v-model="filterKey" @keyup.esc="$emit('close')" autofocus> -->
      <div class="picker-list-wrap">
        <ul class="m-0 p-0 text-left">
          <li v-for="st in statusList" :key="st.value+'stitem'" class="p-025 gap-05 align-center font-md cursor-pointer" @click.stop="onStatusChange(st)">
            <div class="align-center justify-center shape-circle circle" :style="{'background-color': st.bgcolor}">
              <span class="dot shape-circle" :style="{'background-color' : st.color}"></span>
            </div>
            <span class="text-dark text-truncate">{{st.label}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { STATUS } from '~/config/constants.js'
export default {

  name: 'StatusPicker',
  props: {
    show: { type: Boolean, default: false },
    coordinates: Object,
  },
  data() {
    return {
      status: STATUS,
      // filterKey: "",
    }
  },
  watch: {
    coordinates(val, oldVal) {
      // console.log(val)
      let options = {
        root: document.querySelector('#main-content'),
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      }

      let observer = new IntersectionObserver(this.callback, options);
      let target = this.$refs.statusPicker
      observer.observe(target);
    }
  },

  computed: {

    statusList() {
      let status = []
      this.status.forEach(st => {
        if (st.value == "") status.push({ value: "", label: "", color: "", bgcolor: "" })
        if (st.value == 1) status.push({ value: st.value, label: st.label, color: this.colors.ColorVariants.Secondary, bgcolor: this.hex2rgba(this.colors.ColorVariants.Secondary) })
        if (st.value == 2) status.push({ value: st.value, label: st.label, color: this.colors.ColorVariants.Primary, bgcolor: this.hex2rgba(this.colors.ColorVariants.Primary) })
        if (st.value == 3) status.push({ value: st.value, label: st.label, color: this.colors.ColorVariants.Orange, bgcolor: this.hex2rgba(this.colors.ColorVariants.Orange) })
        if (st.value == 4) status.push({ value: st.value, label: st.label, color: this.colors.ColorVariants.Danger, bgcolor: this.hex2rgba(this.colors.ColorVariants.Danger) })
        if (st.value == 5) status.push({ value: st.value, label: st.label, color: this.colors.ColorVariants.Success, bgcolor: this.hex2rgba(this.colors.ColorVariants.Success) })
      })

      return status
    },

    position () {
      return this.coordinates
    },

  },

  methods: {
    hex2rgba(hex = this.colors.ColorVariants.Light, alpha = .16) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    },
    onClickOutside() {
      this.$emit('close')
    },

    onStatusChange(status) {
      this.$emit("selected", status)
      this.$emit("close")
    },

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
  }
}

</script>
<style lang="scss" scoped>
.status-comp-wrap {
  position: relative;
  height: 100%;

  &::before {
    content: "";
    opacity: 0;
    width: 6px;
    height: 6px;
    border-left: 1px solid $gray5;
    border-bottom: 1px solid $gray5;
    transform: rotate(-45deg);
    position: absolute;
    right: 10px;
    top: calc(50% - 2px);
  }

  &:hover {
    &::before {
      opacity: 1;
    }
  }

}

.picker-wrapper {
  background-color: $white;
  border: 1px solid $gray4;
  border-radius: 0.25rem;

  position: fixed;
  left: 0;
  top: 0;
  z-index: 333;
  min-width: 10rem;
  max-width: 12rem;

  box-shadow: 0 2px 10px rgba(100, 100, 100, 0.25);
  transition: left 300ms ease-out, top 200ms ease-out;
  will-change: top, left;

  .picker-content {
    padding: 0.5rem;
  }

  .picker-list-wrap {}

  .picker-input {
    font-size: $font-size-sm;
    border-radius: 0.2rem;
    border: 1px solid $gray2;
    width: 100%;
    margin: 0.3rem 0;
    padding: 0.3rem 0.4rem;

    &:focus {
      outline: none;
      border-color: $gray6;
      box-shadow: 0 0 5px $gray5;
    }
  }
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
