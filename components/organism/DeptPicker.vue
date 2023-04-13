<template>
  <div v-show="show" id="deptPicker" ref="deptPicker" class="picker-wrapper" v-click-outside="onClickOutside" :style="position">
    <div class="picker-content">
      <!-- <input type="text" class="picker-input" ref="deptFilterInput" v-model="filterKey" @keyup.esc="$emit('close')" autofocus > -->
      <div class="" style="max-height: 15rem; overflow-y: auto">
        <ul class="m-0 p-0 text-left">
          <li v-for="dept in departments" :key="dept.value" class="p-025 font-md cursor-pointer" @click.stop="selected(dept)">
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
        // root: document.querySelector('#main-content'),
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      }

      let observer = new IntersectionObserver(this.callback, options);
      // let target = document.querySelector('#deptPicker');
      let target = this.$refs.deptPicker
      observer.observe(target);
    },
    /*show(newValue){
      this.$nextTick(() => {
        // console.log(this.$refs.deptFilterInput)
        this.$refs.deptFilterInput.focus()
      });
    }*/
  },
  computed: {
    ...mapGetters({
      departments: "department/getAllDepartments",
    }),
    /*filterDept() {
      let regex = new RegExp(this.filterKey, 'g\i')
      return this.departments.filter((u) => {
        if (regex.test(u.label)) {
          return u
        }
      })
    },*/
    position() {
      return this.coordinates
    },
  },
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
