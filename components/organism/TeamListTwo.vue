<template>
  <div class="team-avatar-list d-inline-flex align-center px-05" id="team-avatar-list-wrapper">
    <tippy arrow v-for="(team, index) in teammates.main" :key="team.id + index" :style="{'margin-left': -2*index+'px'}">
      <template v-slot:trigger>
        <div id="avatar-wrap" class="position-relative avatar-wrap">
          <bib-avatar :src="team.avatar" size="2rem" class="border-gray2"></bib-avatar>
          <span id="delete-btn" class="position-absolute bg-danger shape-circle delete-btn" @click="deleteMember(team)"></span>
        </div>
      </template>
      {{team.label}}
    </tippy>
    <tippy v-if="teammates.extra.length && !showall" arrow  >
      <template v-slot:trigger>
        <span class="extra" id="team-avatar-list-extra" @click="showAll">and {{teammates.extra.length}} others</span>
      </template>
      {{extraNames}}
    </tippy>
    <template v-else>
      <tippy v-for="(te, index) in teammates.extra" arrow :key="te.id + index" :style="{'margin-left': -1.5*index+'px'}" >
        <template v-slot:trigger>
          <div id="avatar-wrap2" class="position-relative avatar-wrap">
            <bib-avatar :src="te.avatar" size="2rem" class="border-gray2"></bib-avatar>
            <span id="delete-btn2" class="position-absolute bg-danger shape-circle delete-btn" @click="deleteMember(te)"></span>
          </div>
        </template>
        {{te.label}}
      </tippy>
      <span v-show="showall" class="extra" id="team-avatar-list-extra" @click="showAll">show less </span>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TippyComponent } from "vue-tippy";
export default {

  name: 'TeamListTwo',
  props: {
    team: Array,
    count: { type: Number, default: 4 },
  },
  components: {
    tippy: TippyComponent,
  },

  data() {
    return {
      showall: false,
    }
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
    }),
    teammates() {
      let tm = { main: [], extra: [], all: [] }
      this.teamMembers.filter(u => {
        this.team.forEach((t, index) => {
          if (t.id == u.id) {
            tm.all.push(u)
            if (index < this.count) {
              tm.main.push(u)
            } else {
              tm.extra.push(u)
            }
          }
        })
      })
      return tm
    },
    extraNames() {
      let eArr = this.teammates.extra.map(e => e.label)
      return eArr.join(', ')
    },
  },
  methods: {
    showAll(){
      this.showall = !this.showall
    },
    deleteMember(member){
      console.log(member)
      this.$emit("delete-member", member)
    },
  }
}

</script>
<style lang="scss" scoped>
.team-avatar-list {
  position: relative;


  .extra {
    margin-left: 0.5rem;
    font-size: $font-size-sm;
    color: $secondary;
    vertical-align: middle;
  }
  .avatar-wrap {
    &:hover {
      .avatar { z-index: 11; }
      .delete-btn { opacity: 1; z-index: 12; }
    }

  }
  .delete-btn {
    width: 12px;
    height: 12px;
    top:0;
    right: 0;
    opacity: 0;
    transition: opacity 200ms ease;
    &::before, &::after {
      content: "";
      position: absolute;
      width: 1px;
      height: 8px;
      background-color: white;
      top: 2px;
      left: 6px;
    }
    &::before { transform: rotate(45deg)}
    &::after { transform: rotate(-45deg)}
  }
}

</style>
