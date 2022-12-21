<template>
  <div class="team-avatar-list d-inline-flex align-center px-05">
    <tippy arrow v-for="(team, index) in teammates.main" :key="team.id + index" theme="light-border" :style="{ 'margin-left': -2*index+'px'}">
      <template v-slot:trigger>
        <bib-avatar :src="team.avatar" size="2rem" class="border-gray2"></bib-avatar>
      </template>
      {{team.label}}
    </tippy>
    <tippy arrow placement="left" theme="light-border">
      <template v-slot:trigger>
        <span v-show="teammates.extra.length" class="extra">+{{teammates.extra.length}}</span>
      </template>
      {{extraNames}}
    </tippy>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import tippy from 'tippy.js';
import VueTippy, { TippyComponent } from "vue-tippy";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
export default {

  name: 'TeamAvatarList',
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
      // team: 'task/getTaskMembers',
      teamMembers: "user/getTeamMembers",
    }),
    teammates() {
      let tm = { main: [], extra: [], all: [] }
      /*if (Object.keys(this.task).length == 0) {
        return tm
      }*/
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
    margin-left: 0.25rem;
    width: 2rem;
    color: $secondary;
    vertical-align: middle;
  }
}
::v-deep {
  .tippy-tooltip { background-color: $gray7; padding: 3px 6px; }
}

</style>
