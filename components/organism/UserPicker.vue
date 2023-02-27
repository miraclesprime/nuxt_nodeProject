<template>
  <div ref="userPicker" class="picker-wrapper" :style="{left: position.left, top: position.top }">
    <div class="picker-content">
      <bib-input type="text" ref="userFilterInput" v-model="filterKey" size="sm"></bib-input>
      <div style="max-height: 12rem; overflow-y: auto">
        <ul class="m-0 p-0 text-left">
          <li v-for="user in filterTeam" :key="user.id" class="p-025 font-md cursor-pointer" @click.stop="$emit('selected', user)">
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
    coordinates: { type: Object, default () { return { left: window.innerWidth/2+'px', top: window.innerHeight/2+'px' } } },
  },

  data() {
    return {
      // userPickerOpen: false,
      filterKey: "",
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
      let top = this.coordinates.top
      let picker = this.$refs.userPicker
      // console.log(picker)
      if (picker) {
        let diff = window.innerHeight - (picker.offsetTop + picker.offsetHeight + 10)
        if (window.innerHeight < (picker.offsetTop + picker.offsetHeight)) {
          top += diff
        } else {
          top += 0
        }
      }
      return { left: this.coordinates.left + 'px', top: top+'px' }
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
}

</style>
