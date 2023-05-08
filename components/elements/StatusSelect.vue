<template>
  <div class="picker-wrapper" v-click-outside="onClickOutside">
    <button type="button" class="user-data cursor-pointer height-2 w-100 align-center justify-between" @click.stop="triggerOpen">
      <span class="align-center flex-grow-1 gap-025">
        <div class="align-center justify-center shape-circle circle" :style="{ 'background-color': $hex2rgba(localStatus.color, colors) }" >
          <span class="dot shape-circle" :class="[ 'bg-'+localStatus.color ]" ></span>
        </div>
        {{localStatus.label}}
      </span>
      <bib-icon icon="arrow-down" variant="gray4" :scale="0.5"></bib-icon>
    </button>
    <div v-show="show" class="picker-content">
      <div class="picker-list-wrap">
        <ul class="m-0 p-0 text-left">
          <li v-for="st in statusList" :key="st.value+'stitem'" class="py-025 gap-05 align-center font-md cursor-pointer" @click.stop="onStatusChange(st)">
            <div class="align-center justify-center shape-circle circle" :style="{'background-color': st.bgcolor}">
              <span class="dot shape-circle" :class="[ 'bg-'+st.color ]" ></span>
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

  name: 'StatusSelect',
  props: {
    status: { type: Object },
    /*show: { type: Boolean, default: false },
    coordinates: Object,*/
  },
  data() {
    return {
      statusItems: STATUS,
      show: false,
      localStatus: {},
      // filterKey: "",
    }
  },
  watch: {
    /*coordinates(val, oldVal) {
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
    }*/
  },

  computed: {

    statusList() {
      let status = []
      this.statusItems.forEach(st => {
        if (st.value == 0) status.push({ value: 0, label: "--", color: "", bgcolor: "" })
        if (st.value == 1) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Secondary) })
        if (st.value == 2) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Primary) })
        if (st.value == 3) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Orange) })
        if (st.value == 4) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Danger) })
        if (st.value == 5) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Success) })
      })

      return status
    },

  },

  mounted(){
    this.localStatus = this.statusItems.find( st => st.value == this.status.id )
  },

  methods: {
    /*hex2rgba(hex = this.colors.ColorVariants.Light, alpha = .16) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    },*/
    triggerOpen() {
      this.show = !this.show
      this.$emit('close-other')
    },
    onClickOutside() {
      this.show = false
      // this.$emit('close')
    },

    onStatusChange(status) {
      this.$emit("change", status)
      this.show = false
      this.localStatus = status
      // this.$emit("close")
    },

  }
}

</script>
<style lang="scss" scoped>

.picker-wrapper {
  background-color: $white;
  position: relative;

  .picker-content {
    position: absolute;
    z-index: 55;
    left: 0;
    top: 0;
    min-height: fit-content;
    max-height: 30rem;
    min-width: 100%;
    background-color: $white;
    border: 1px solid $gray4;
    padding: 0.5rem;
    border-radius: 0.25rem;
    box-shadow: 0 2px 10px rgba(100, 100, 100, 0.25);
  }

  .user-data {
    border: 0 none;
    background-color: $white;
    padding: 0;
  }

  .picker-list-wrap {}

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
