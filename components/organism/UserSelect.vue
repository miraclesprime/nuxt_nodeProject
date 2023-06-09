<template>
  <div id="user-select-wrapper" class="picker-wrapper" v-click-outside="onClickOutside">
    <button type="button" id="user-select-trigger-open" class="user-data cursor-pointer height-2 w-100 align-center justify-between" @click.stop="triggerOpen">
      <span v-if="user" id="user-select-user-avatar" class="align-center gap-025 flex-grow-1">
        <bib-avatar :src="user.avatar" size="1.5rem"></bib-avatar> <span class="user-label text-truncate">{{user.label}}</span>
      </span>
      <span v-else id="user-select-user-avatar">
        <span class="shape-circle d-inline-flex width-105 height-105 ">
          <bib-avatar size="1.5rem"></bib-avatar>
        </span>
      </span>
      <bib-icon icon="arrow-down" variant="gray4" :scale="0.5"></bib-icon>
    </button>

    <div v-show="show" class="picker-content" id="user-select-content">
      <input type="text" class="picker-input" id="user-select-input" ref="userFilterInput" v-model="filterKey" @keyup.esc="$emit('close')" autofocus>
      <div class="mt-05" style="max-height: 12rem; overflow-y: auto" id="user-select-user-avatar-list-wrapper">
        <ul class="m-0 p-0 text-left" id="user-select-user-avatar-list">
          <li v-for="(user, index) in filterTeam" :key="user.id"  :id="'user-select-user-avatar-'+index" class="py-025 align-center gap-025 font-md cursor-pointer" @click.stop="selected(user)">
            <bib-avatar :src="user.avatar" size="1.5rem"></bib-avatar> <span class="user-label text-truncate">{{user.label}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {

  name: 'UserSelect',

  props: {
    userId: { type: String },
  },

  data() {
    return {
      localUser: this.userId,
      filterKey: "",
      show: false,
    }
  },
  watch: {
    show(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.userFilterInput.focus()
        });
      }
    }
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
    }),
    user: {
      get: function() {
        return this.teamMembers.find(t => t.id == this.localUser)
      },
      set: function(value) {
        this.localUser = value.id
      }
    },
    filterTeam() {
      let regex = new RegExp(this.filterKey, 'g\i')
      return this.teamMembers.filter((u) => {
        if (regex.test(u.label) || regex.test(u.email)) {
          return u
        }
      })
    },
  },
  methods: {
    triggerOpen() {
      this.show = !this.show
      this.$emit('close-other')
    },
    selected(user) {
      this.user = user
      this.show = false
      this.$emit("change", user)
    },
    onClickOutside() {
      this.show = false
    },
  }
}

</script>
<style lang="scss" scoped>
.picker-wrapper {
  position: relative;

  .user-data {
    border: 0 none;
    background-color: transparent;
  }
  .user-label { max-width: 80%; display: inline-block; }

  .picker-content {
    position: absolute;
    z-index: 55;
    left: -5px;
    top: -5px;
    min-height: fit-content;
    max-height: 30rem;
    min-width: calc(100% + 10px);
    max-width: 15rem;
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
