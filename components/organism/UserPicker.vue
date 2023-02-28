<template>
  <div v-show="show" id="userPicker" ref="userPicker" class="picker-wrapper" v-click-outside="onClickOutside" :style="position">
    <div class="picker-content">
      <input type="text" class="picker-input" ref="userFilterInput" v-model="filterKey" @keyup.esc="$emit('close')" autofocus >
      <div class="mt-05" style="max-height: 12rem; overflow-y: auto">
        <ul class="m-0 p-0 text-left">
          <li v-for="user in filterTeam" :key="user.id" class="p-025 font-md cursor-pointer" @click.stop="selected(user)">
            <bib-avatar :src="user.avatar" size="1.5rem"></bib-avatar> {{user.label}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {

  name: 'UserPicker',

  props: {
    show: {type: Boolean, default: false},
    coordinates: {
      type: Object,
      default: function () {
        return { left: 'hello', top: 'world' }
      }
      /*default: function() {
        return { left: 1920 / 2, top: 560 / 2 }
      }*/
    },
  },

  data() {
    return {
      // userPickerOpen: false,
      filterKey: "",
      /*position: {
        left: this.coordinates.left+'px',
        top: this.coordinates.top+'px',
      }*/
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
      // let target = document.querySelector('#userPicker');
      let target = this.$refs.userPicker
      observer.observe(target);
    },
    show(newValue){
      this.$nextTick(() => {
        // console.log(this.$refs.userFilterInput)
        this.$refs.userFilterInput.focus()
      });
    }
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
    }),
    filterTeam() {
      let regex = new RegExp(this.filterKey, 'g\i')
      return this.teamMembers.filter((u) => {
        if (regex.test(u.label) || regex.test(u.email)) {
          return u
        }
      })
    },
    position() {
      /*let left1 = this.coordinates.left || window.innerWidth/2
      let top1 = this.coordinates.top || window.innerHeight/2

      if (picker) {
        let diff = window.innerHeight - (picker.offsetTop + picker.offsetHeight + 10)
        if (window.innerHeight < (picker.offsetTop + picker.offsetHeight)) {
          top += diff
        } else {
          top += 0
        }
      }
      return { left: left1 + 'px', top: top1 + 'px' }*/
      
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
    selected(user){
      this.$emit("selected", user)
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
