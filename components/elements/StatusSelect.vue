<template>
  <div class="picker-wrapper w-100" id="status-select-wrapper" v-click-outside="onClickOutside">
    <div id="status-select-button" class="user-data cursor-pointer height-2 align-center justify-between" @click.stop="triggerOpen">
      <div class="align-center flex-grow-1 gap-025" id="status-select-span-wrap">
        <!-- <div class="align-center justify-center shape-circle circle" id="status-select-shape-circle" :style="{ 'background-color': $hex2rgba(localStatus.color, colors) }" >
          <span class="dot shape-circle" :id="'status-select-'+localStatus.color" :class="[ 'bg-'+localStatus.color ]" ></span>
        </div> -->
        <bib-icon icon="check-circle-solid" :variant="localStatus.color"></bib-icon>
        {{localStatus.label}}
      </div>
      <bib-icon icon="arrow-down" variant="gray4" :scale="0.5"></bib-icon>
    </div>
    <div v-show="show" class="picker-content" id="status-select-content">
      <div class="picker-list-wrap" id="status-select-list-wrap">
        <ul class="m-0 p-0 text-left" id="status-select-list">
          <li v-for="st in statusList" :key="st.value+'stitem'" :id="'status-select-list-item-'+st.value" class="py-025 gap-05 align-center font-md cursor-pointer" @click.stop="onStatusChange(st)">
            <!-- <div class="align-center justify-center shape-circle circle" :id="'status-select-list-item-'+st.bgcolor" :style="{'background-color': st.bgcolor}">
              <span class="dot shape-circle" :id="'status-select-list-item-'+st.color" :class="[ 'bg-'+st.color ]" ></span>
            </div> -->
            <bib-icon icon="check-circle-solid" :variant="st.color"></bib-icon>
            <span class="text-dark text-truncate" :id="'status-select-list-item-'+st.label">{{st.label}}</span>
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
  },
  data() {
    return {
      statusItems: STATUS,
      show: false,
      localStatus: {},
    }
  },

  computed: {

    statusList() {
      let status = []
      this.statusItems.forEach(st => {
        if (st.value == 0) status.push({ value: null, label: "Choose status", color: "gray4", bgcolor: this.$hex2rgba(this.colors.ColorVariants.Gray4) })
        if (st.value == 1) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Primary) })
        if (st.value == 2) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Orange) })
        if (st.value == 3) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Secondary) })
        if (st.value == 4) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Danger) })
        if (st.value == 5) status.push({ value: st.value, label: st.label, color: st.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Success) })
      })

      return status
    },

  },

  mounted(){
    if(this.status && this.status.id) {
      this.localStatus = this.statusItems.find( st => st.value == this.status.id )
    }else {
      this.localStatus = { label: 'Choose Status', value: 0, color: "gray4", bgcolor: "gray4" }
    }
  },

  methods: {
    triggerOpen() {
      this.show = !this.show
      this.$emit('close-other')
    },
    onClickOutside() {
      this.show = false
    },

    onStatusChange(status) {
      this.$emit("change", status)
      this.show = false
      this.localStatus = status
    },

  }
}

</script>
<style lang="scss" scoped>

.picker-wrapper {
  position: relative;

  .picker-content {
    position: absolute;
    z-index: 55;
    left: -5px;
    top: -5px;
    min-height: fit-content;
    max-height: 30rem;
    min-width: calc(100% + 10px);
    background-color: $white;
    border: 1px solid $gray4;
    padding: 0.5rem;
    border-radius: 0.25rem;
    box-shadow: 0 2px 10px rgba(100, 100, 100, 0.25);
  }

  .user-data {
    border: 0 none;
    background-color: transparent;
    padding: 0;
    font-size: $base-size;
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
