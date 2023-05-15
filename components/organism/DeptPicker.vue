<template>
  <div v-show="show" id="dept-picker-wrapper" ref="deptPicker" class="picker-wrapper" v-click-outside="onClickOutside" :style="position">
    <div class="picker-content" id="dept-picker-content">
      <div class="" id="dept-picker-inner-content-wrap" style="max-height: 15rem; overflow-y: auto">
        <ul class="m-0 p-0 text-left" id="confirm-dialogue-list">
          <li v-for="(dept, index) in departments" :key="dept.value" :id="'confirm-dialogue-list-item-'+index" class="p-025 font-md cursor-pointer" @click.stop="selected(dept)">
            {{dept.label}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {

  name: 'DeptPicker',

  props: {
    show: {type: Boolean, default: false},
    coordinates: Object,
  },

  data() {
    return {
      filterKey: "",      
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
      let target = this.$refs.deptPicker
      observer.observe(target);
    },
  },
  computed: {
    ...mapGetters({
      departments: "department/getAllDepartments",
    }),
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
    selected(dept){
      this.$emit("selected", dept)
      this.$emit("close")
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
  width: 15rem;
  box-shadow: 0 2px 10px rgba(100, 100, 100, 0.25);
  transition: left 300ms ease-out, top 200ms ease-out;
  will-change: top, left;

  .picker-content {
    padding: 0.5rem;
  }
  .picker-input { font-size: $font-size-sm; border-radius: 0.2rem; border: 1px solid $gray2; width: 100%; margin: 0.3rem 0; padding: 0.3rem 0.4rem; 
    &:focus{ outline: none; border-color: $gray6; box-shadow: 0 0 5px $gray5; }
  }
}

</style>
