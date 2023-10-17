<template>
  <div id="status-select-wrapper" class="picker-wrapper w-100" v-click-outside="onClickOutside">
    <div id="status-select-button" class="user-data cursor-pointer height-2 align-center justify-between" @click.stop="triggerOpen">
      <div id="status-select-span-wrap" class=" align-center gap-025" style="max-width: 80%;">
        <bib-icon icon="check-circle-solid" :variant="localStatus.color"></bib-icon>
        <span id="status-select-localValue-label" class="text-capitalize text-truncate"  >
          {{localStatus.label}}
        </span>
      </div>
      <bib-icon icon="arrow-down" variant="gray4" :scale="0.5"></bib-icon>
    </div>
    <div v-if="show" id="status-select-content" class="picker-content" >
      <div id="status-select-list-wrap" class="picker-list-wrap" >
        <ul id="status-select-list" class="m-0 p-0 text-left" >
          <li v-for="st in statusList" :key="st.value+'stitem'" :id="'status-select-list-item-'+st.value" class="py-025 gap-05 align-center font-md cursor-pointer" @click.stop="onStatusChange(st)">
            <div v-if="localStatus.value != st.value" :id="'ss-circle-'+st.color" class="shape-circle circle" :class="'border-'+st.color">
            </div>
            <bib-icon v-else icon="check-circle-solid" :variant="st.color"></bib-icon>
            <span :id="'status-select-list-item-'+st.label" class="text-dark text-truncate" >{{st.label}}</span>
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
  watch: {
    status(newVal) {
      if(newVal && newVal.id) {
        this.localStatus = this.statusItems.find( st => st.value == newVal.id )
      }else {
        this.localStatus = { label: '--', value: 0, color: "gray4" }
      }
    }
  },
  computed: {

    statusList() {
      let status = []
      this.statusItems.forEach(st => {
        if (st.value == 0) status.push({ value: null, label: "--", color: "gray4" })
        if (st.value == 1) status.push({ value: st.value, label: st.label, color: st.color })
        if (st.value == 2) status.push({ value: st.value, label: st.label, color: st.color })
        if (st.value == 3) status.push({ value: st.value, label: st.label, color: st.color })
        if (st.value == 4) status.push({ value: st.value, label: st.label, color: st.color })
        if (st.value == 5) status.push({ value: st.value, label: st.label, color: st.color })
      })

      return status
    },

  },

  mounted(){
    if(this.status && this.status.id) {
      this.localStatus = this.statusItems.find( st => st.value == this.status.id )
    }else {
      this.localStatus = { label: '--', value: 0, color: "gray4" }
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
  width: 16px;
  height: 16px;

  /*.dot {
    width: 8px;
    height: 8px;
  }*/
}

</style>
