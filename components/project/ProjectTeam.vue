<template>
  <div class="p-025">
    <div class="action-left">
      <div class="d-inline-flex gap-05 cursor-pointer text-secondary bg-hover-light text-hover-dark py-025 px-05 shape-rounded" v-on:click="$nuxt.$emit('add-teammember-modal')">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon>
        <span>New Teammate</span>
      </div>
    </div>
    <div class="list my-025">
      <span v-for="t in projectTeam" class="list__item ">
        <bib-avatar :src="t.avatar" size="1.5rem" class="mr-05"></bib-avatar> {{t.firstName}} {{t.lastName}} <bib-button pop="elipsis" variant="gray3" class="ml-auto">
          <template v-slot:menu>
            <div class="list">
              <span class="list__item">List item 1</span>
              <span class="list__item">List item 2</span>
              <span class="list__item">List item 3</span>
              <span class="list__item">List item 4</span>
            </div>
          </template>
        </bib-button>
      </span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {

  name: 'ProjectTeam',
  props: { team: Array },

  data() {
    return {
      // projectTeam: []
    }
  },
  computed: {
    ...mapGetters({
      members: 'user/getTeamMembers'
    }),
    projectTeam() {
      let ud = []
      this.members.filter(u => {
        this.team.forEach(t => {
          if (t.id == u.id) {
            // console.log(u)
            ud.push(u)
          }
        })
      })
      return ud
    }
  }
}

</script>
<style lang="scss" scoped>
.list {
  border-top: 1px solid $gray2;

  &__item {}
}

</style>
