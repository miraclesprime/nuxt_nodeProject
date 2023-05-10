<template>
  <div class="picker-wrapper" v-click-outside="onClickOutside" >
    <button type="button" class="user-data cursor-pointer height-2 w-100 align-center justify-between" @click.stop="triggerOpen">
      <span v-if="localDept">
         {{localDept.label}}
      </span>
      <bib-icon icon="arrow-down" variant="gray4" :scale="0.5"></bib-icon>
    </button>
    <div v-show="show" class="picker-content">
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

  name: 'DeptSelect',

  props: {
    dept: { type: Object },
    // show: {type: Boolean, default: false},
    // coordinates: Object,
  },

  data() {
    return {
      show: false,
      localDept: { value: null, label: "No department" },
      filterKey: "",      
    }
  },
  watch: {
    dept(newValue){
      // if (this.dept) {
        this.localDept = this.departments.find( d => d.value == this.dept.id)
      // }
    },
    /*coordinates (newValue) {
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
    },*/
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
    /*localDept(){
      if (this.dept) {
        return this.departments.find( d => d.value == this.dept.id)
      }
      else {
        return { value: null, label: "No department"}
      }
    },*/
    /*filterDept() {
      let regex = new RegExp(this.filterKey, 'g\i')
      return this.departments.filter((u) => {
        if (regex.test(u.label)) {
          return u
        }
      })
    },*/
    /*position() {
      return this.coordinates
    },*/
  },
  mounted(){
    // this.localDept = this.departments.find( d => d.id == this.dept.id)
  },
  methods: {
    /*callback(entries, observer) {
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
    },*/
    triggerOpen() {
      this.show = !this.show
      this.$emit("close-other")
    },
    selected(dept){
      this.$emit("change", dept)
      this.show = false
      // this.$emit("close")
    },
    onClickOutside() {
      this.show = false
    },
  }
}

</script>
<style lang="scss" scoped>
.picker-wrapper {
  background-color: $white;
  position: relative;

  .user-data {
    border: 0 none;
    background-color: $white;
  }

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

</style>
