<template>
  <div id="user-select-wrapper" class="picker-wrapper " :class="{'w-100': mode!='avatar', 'width-2': mode=='avatar'}" v-click-outside="onClickOutside">
    <div id="user-select-trigger-open" class="user-data cursor-pointer height-2 align-center justify-between gap-05" @click.stop="triggerOpen">
      <div v-if="user" id="user-select-user-avatar" class="align-center gap-025 ">
        <tippy arrow v-if="mode == 'full'" >
          <template v-slot:trigger>
            <bib-avatar :src="user.avatar" size="2rem"></bib-avatar>
          </template>
          {{user.label}}
        </tippy>
        
        <bib-avatar v-if="mode == 'full'" :src="user.avatar" size="2rem"></bib-avatar>
        
        <span class="user-label text-truncate" :style="{ maxWidth: 'calc(${maxWidth} - 3rem)'}">{{user.label}}</span>
      </div>
      <div v-else id="user-select-user-avatar" class="align-center gap-025" >
        <span v-if="mode == 'full'" class="shape-circle d-inline-flex width-2 height-2 ">
          <bib-avatar size="2rem"></bib-avatar>
        </span>
        <span class="text-gray5">No assignee</span>
      </div>
      <bib-icon icon="arrow-down" variant="gray4" :scale="0.5"></bib-icon>
    </div>

    <div v-show="show" ref="pickerContent" class="picker-content p-025" :style="styleObj" id="user-select-content">
      <p class="font-sm text-left border-bottom-light p-025">{{title}}</p>
      <input type="text" class="picker-input m-025" id="user-select-input" ref="userFilterInput" v-model="filterKey" @keyup.esc="$emit('close')" autofocus>
      <div class="mt-05" style="max-height: 12rem; overflow-y: auto" id="user-select-user-avatar-list-wrapper">
        <ul class="m-0 p-0 text-left" id="user-select-user-avatar-list">
          <li v-for="(user, index) in filterTeam" :key="user.id"  :id="'user-select-user-avatar-'+index" class="p-025 pr-05 align-center gap-025 font-md cursor-pointer bg-hover-light" @click.stop="selected(user)">
            <bib-avatar v-if="mode == 'full'" :src="user.avatar" size="1rem"></bib-avatar> <span class="user-label text-truncate" :style="{ maxWidth: 'calc(${maxWidth} - 3rem)'}">{{user.label}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TippyComponent } from "vue-tippy";
export default {

  name: 'UserSelect',

  props: {
    userId: { type: String },
    mode: { type: String, default: "name"}, //name, full, 
    title: { type: String, default: "Assign to" },
    // avatarSize: { type: String, default: "2rem" },
    minWidth: { type: String, default: "calc(100% + 10px)" },
    maxWidth: { type: String, default: "15rem" },
  },

  components: {
    tippy: TippyComponent,
  },

  data() {
    return {
      localUser: "",
      filterKey: "",
      show: false,
    }
  },
  watch: {
    userId(newValue){
      this.localUser = newValue
    },

    show(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.userFilterInput.focus()
          this.positionDropdown()
        });
      } else {
        this.positionDropdown(true)
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
    styleObj(){
      /*if (this.minWidth && this.maxWidth) {
        return { 'min-width': this.minWidth; 'max-width': this.maxWidth }
      }
      if (this.minWidth) {
        return { 'min-width': 'calc(100% + 10px)'; 'max-width': '15rem'}
      }*/
      return { minWidth: this.minWidth, maxWidth: this.maxWidth }
    }
  },
  mounted(){
    this.localUser = _.clone(this.userId)
  },
  methods: {
    positionDropdown(original){
      const box = this.$refs.pickerContent

      if (original) {
        box.style.removeProperty('transform')
        return
      }

      const rect = box.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // console.log(rect, viewportWidth, viewportHeight)

      const isInViewport = rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewportHeight &&
        rect.right <= viewportWidth;
      
      // console.log(isInViewport)

      if (!isInViewport) {
        const offsetY = (rect.top + rect.height) - viewportHeight
        const offsetX = (rect.left + rect.width) - viewportWidth
        // console.log("X-",offsetX, "Y-", offsetY)
        if (offsetX > 0 && offsetY > 0) {
          box.style.transform = "translate("+(-offsetX-20)+"px, "+(-offsetY-20)+"px)"
          return
        }
        if (offsetX > 0) {
          box.style.transform = "translateX("+(-offsetX-20)+"px)"
          return
        }
        if (offsetY > 0) {
          box.style.transform = "translateY("+(-offsetY-20)+"px)"
          return
        }
      } 
    },
    triggerOpen() {
      this.show = !this.show
      this.$emit('close-other')
    },
    selected(user) {
      this.user = user
      // this.show = false
      this.onClickOutside()
      this.$emit("change", user)
    },
    onClickOutside() {
      this.filterKey = ""
      this.show = false
    },
  }
}

</script>
<style lang="scss" scoped>
.picker-wrapper {
  position: relative;
  color: var(--bib-text);

  .user-data {
    border: 0 none;
    background-color: transparent;
  }
  .user-label { display: inline-block; }

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
