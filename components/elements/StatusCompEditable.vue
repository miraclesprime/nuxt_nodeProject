<template>
  <div :id="'status-wrap-'+compId" class="d-flex gap-05 align-center status-comp-wrap" @click.stop="showPicker = true" v-click-outside="onClickOutside">
    <template v-if="localValue.value">
      <div :id="'status-dot-local-'+compId " class="d-flex align-center justify-center shape-circle circle" :style="{'background-color': localValue.bgcolor}"><span class="dot shape-circle" :style="{'background-color' : localValue.color}"></span>
      </div>
      <span :id="'status-text-local-'+compId " class="text-dark text-truncate">{{ localValue.label }}</span>
    </template>
    <template v-else>
      <div v-if="statusOutput.text" :id="'status-dot-'+compId " class="d-flex align-center justify-center shape-circle circle" :style="{'background-color': statusOutput.bgcolor}"><span class="dot shape-circle" :style="{'background-color' : statusOutput.color}"></span>
      </div>
      <span v-if="statusOutput.text && !iconOnly" :id="'status-text-'+compId " class="text-dark text-truncate">{{ statusOutput.text }}</span>
    </template>
    <div v-if="showPicker" ref="userPicker" class="picker-wrapper">
      <div class="picker-content">
        <!-- <input type="text" class="picker-input" ref="userFilterInput" v-model="filterKey" @keyup.esc="$emit('close')" autofocus> -->
        <div class="picker-list-wrap" >
          <ul class="m-0 p-0 text-left">
            <li v-for="st in statusList" :key="st.value+'sti'+compId" class="p-025 gap-05 align-center font-md cursor-pointer" @click.stop="onStatusChange(st)">
              <div class="align-center justify-center shape-circle circle" :style="{'background-color': st.bgcolor}">
                <span class="dot shape-circle" :style="{'background-color' : st.color}"></span>
              </div>
              <span class="text-dark text-truncate">{{st.label}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
export default {

  name: 'StatusComp',
  props: {
    value: { type: Object },
    // status: { type: Object },
    iconOnly: { type: Boolean, default: false }
  },
  data() {
    return {
      status: STATUS,
      showPicker: false,
      filterKey: "",
      localValue: {},
    }
  },
  computed: {

    statusOutput() {
      if (this.value == null) {
        return { text: "", color: "" }
      }
      switch (this.value.id) {
        case 1:
          return { text: this.value.text, color: this.colors.ColorVariants.Secondary, bgcolor: this.hex2rgba(this.colors.ColorVariants.Secondary) }
        case 2:
          return { text: this.value.text, color: this.colors.ColorVariants.Primary, bgcolor: this.hex2rgba(this.colors.ColorVariants.Primary) }
        case 3:
          return { text: this.value.text, color: this.colors.ColorVariants.Orange, bgcolor: this.hex2rgba(this.colors.ColorVariants.Orange) }
        case 4:
          return { text: this.value.text, color: this.colors.ColorVariants.Danger, bgcolor: this.hex2rgba(this.colors.ColorVariants.Danger) }
        case 5:
          return { text: this.value.text, color: this.colors.ColorVariants.Success, bgcolor: this.hex2rgba(this.colors.ColorVariants.Success) }
        default:
          return { text: "", color: "" }
      }
    },
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
    compId() {
      return Math.floor((Math.random() * 1000) + 1);
    },
    
  },
  mounted(){
    this.localValue = {}
  },
  methods: {
    hex2rgba(hex = this.colors.ColorVariants.Light, alpha = .16) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    },
    onClickOutside() {
      this.showPicker = false
    },

    onStatusChange(status) {
      this.localValue = status
      this.$emit("change-status", status)
      this.showPicker = false
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
    width: 6px; height: 6px; border-left: 1px solid $gray5; border-bottom: 1px solid $gray5; transform: rotate(-45deg);
    position: absolute; right: 10px; top: calc(50% - 2px);
  }
  &:hover {
    &::before { opacity: 1;}
  }

  .picker-wrapper {
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 3;
    min-width: 100%;
  }
}

.picker-wrapper {
  background-color: $white;
  border: 1px solid $gray4;
  border-radius: 0.25rem;

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
