<template>
  <div id="sc-wrapper" class="d-flex align-center">
    <!-- <small class="pr-025">{{label}}<span id="sc-text" v-show="selectedView" class="ml-025 text-dark">: {{ selectedView }} </span></small> -->
    <div id="sc-dd-wrap" class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex justify-center align-center">
      <bib-button :pop="icon" icon-variant="gray6" size="sm">
        <template v-slot:menu>
          <div class="list" id="sc-dd-menu">
            <span :id="'sc-dd-item-' + item.key" class="list__item d-flex justify-between" :class="{'dark': selectedView == item.label}" v-for="(item, index) in items" @click="changeViewName(item)" :key="'sc-dd-item-' + item.label + index">{{item.label}} <bib-icon v-if="selectedView == item.label" icon="long-arrow-down" :scale="1" variant="gray6"></bib-icon></span>
          </div>
        </template>
      </bib-button>
    </div>
  </div>
</template>

<script>
export default {

  name: 'SortingComp',

  data() {
    return {
      selectedView: ""
    }
  },
  props: {
    label: { type: String, },
    items: { type: Array, required: true },
    icon: { type: String, }
  },

  mounted() {
    let sample = this.items.find(el => el.selected)
    // console.info(sample.hasOwnProperty('selected'))
    
    // console.assert(typeof(sample) == 'object');
    /*if (sample.hasOwnProperty('selected')) {
      for (let key in sample) {
        console.log(sample['label'])
        this.selectedView = sample['label'];
      }
    }*/
  },

  methods: {
    changeViewName($event) {
      this.selectedView = $event.label;
      this.$emit("change-sort", $event.key)
    }
  }
}

</script>

<style lang="css" scoped>
</style>