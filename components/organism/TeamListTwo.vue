<template>
  <div class="team-avatar-list d-inline-flex align-center px-05" id="team-avatar-list-wrapper">
    <tippy arrow v-for="(team, index) in teammates.main" :key="team.id + index" :style="{ 'margin-left': -2*index+'px'}">
      <template v-slot:trigger>
        <bib-avatar :src="team.avatar" size="2rem" class="border-gray2"></bib-avatar>
      </template>
      {{team.label}}
    </tippy>
    <tippy v-if="teammates.extra.length" arrow  >
      <template v-slot:trigger>
        <span class="extra" id="team-avatar-list-extra">and {{teammates.extra.length}} others</span>
      </template>
      {{extraNames}}
    </tippy>
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
  }
}

</script>
<style lang="scss" scoped>
.team-avatar-list {
  position: relative;

  .avatar:hover {
    z-index: 11
  }

  .extra {
    margin-left: 0.5rem;
    /*width: 2rem;*/
    font-size: $font-size-sm;
    color: $secondary;
    vertical-align: middle;
  }
}

</style>
