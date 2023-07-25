<template>
  <div id="sc-wrapper" class="d-flex align-center">
    <div id="sc-dd-wrap" class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex justify-center align-center">
      <bib-button :dropdown="icon" icon-variant="gray6" :tooltip-title="tooltip" size="sm">
        <template v-slot:menu>
          <div class="list border-light box-shadow" id="sc-dd-menu">
            <span :id="'sc-dd-item-' + item.key" v-for="(item, index) in items" :key="'sc-dd-item-' + item.label + index" class="list__item d-flex justify-between" :class="{'dark': selectedView == item.label}" @click="changeViewName(item)" >{{item.label}} <bib-icon v-if="selectedView == item.label && activeIcon" :icon="activeIcon" :scale="1" variant="gray6"></bib-icon></span>
          </div>
        </template>
      </bib-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {

  name: 'SortingComp',
  computed: {
    ...mapGetters({
      filterViews :'task/getFilterView'
    }),
    selectedView() {
      if(this.filterViews=="incomplete"){
        return 'Incompleted'
      }
      if(this.filterViews=="complete"){
        return 'Completed'
      }
      if(this.filterViews=="all"){
        return 'All'
      }
  },
  },
  watch: {
    selectedView(newValue){
      if(newValue=="incomplete"){
        return 'Incompleted'
      }
      if(newValue=="complete"){
        return 'Completed'
      }
      if(newValue=="all"){
        return 'All'
      }
    }
  },
  data() {
    return {
      // selectedView:  ''
    }
  },

  props: {
    label: { type: String, },
    items: { type: Array, required: true },
    icon: { type: String, },
    tooltip: String,
    activeIcon: {
      type: [String, Boolean],
      default: "long-arrow-down"
    },
  },

  methods: {
    changeViewName(item) {
      // console.log(item)
      // this.selectedView = item.label
      this.$emit("change-sort", item.key)
    }
  }
}

</script>
<style lang="css" scoped>
.box-shadow{
  box-shadow: 0 6px 30px -2px rgba(0,0,0,.38);
}
</style>
