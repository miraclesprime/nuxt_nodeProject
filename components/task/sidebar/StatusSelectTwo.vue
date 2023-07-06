<template>
  <div class="picker-wrapper-two shape-rounded " id="ss-wrapper" v-click-outside="onClickOutside">
    <div id="ss-button" class="user-data cursor-pointer height-2 align-center justify-between gap-05 px-05" @click.stop="triggerOpen">
      <div class="align-center gap-05" id="ss-span-wrap">
        <bib-icon icon="check-circle-solid" :variant="localStatus.color"></bib-icon>
        {{localStatus.label}}
      </div>
      <bib-icon icon="arrowhead-down" variant="gray5" :scale="0.8"></bib-icon>
    </div>
    <div v-show="show" class="picker-content p-025" id="ss-content" >
      <p id="ss-heading" class="font-sm text-left p-025 border-bottom-light">Status</p>
      <div class="picker-list-wrap " id="ss-list-wrap">
        <ul class="m-0 p-0 text-left" id="ss-list">
          <li v-for="st in statusList" :key="st.value+'stitem'" :id="'ss-list-item-'+st.value" class="p-025 pr-05 gap-05 align-center font-md text-dark cursor-pointer bg-hover-gray2" @click.stop="onStatusChange(st)">
            <div v-if="localStatus.value != st.value" class=" shape-circle circle" :id="'ss-circle-'+st.color" :class="'border-'+st.color">
            </div>
            <bib-icon v-else icon="check-circle-solid" :variant="st.color"></bib-icon>
            <span class=" text-truncate" :class="'text-'+st.color" :id="'ss-list-text-'+st.label">{{st.label}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { STATUS } from '~/config/constants.js'
export default {

  name: 'StatusSelectTwo',
  props: {
    status: {
      type: Object,
    },
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
        if (st.value == 0) status.push({ value: null, label: "None", color: "secondary" })
        if (st.value == 1) status.push({ value: st.value, label: st.label, color: st.color })
        if (st.value == 2) status.push({ value: st.value, label: st.label, color: st.color })
        if (st.value == 3) status.push({ value: st.value, label: st.label, color: st.color })
        if (st.value == 4) status.push({ value: st.value, label: st.label, color: st.color })
        if (st.value == 5) status.push({ value: st.value, label: st.label, color: st.color })
      })

      return status
    },

  },

  watch: {
    status (val, oldVal) {
      if(val != oldVal) {
        // console.log(val)
        if (this.statusItems) {
          this.setLocal()
        } else {
          console.warn('statusItems not found')
        }
      }
    }
  },

  mounted(){
    this.setLocal()
  },

  methods: {
    setLocal(){
      // console.log(this.statusItems)
      if(this.status?.id) {
        this.localStatus = this.statusItems.find( st => st.value == this.status.id )
      }else {
        this.localStatus = { label: 'None', value: 0, color: "secondary" }
      }
    },
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

.circle {
  width: 16px;
  height: 16px;
  /*border-width: 1px;
  border-style: solid;
  border-color: var(--bib-secondary);*/
}

</style>
