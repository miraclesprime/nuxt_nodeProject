<template>
  <div class="py-05 position-relative">
    <div class="action-left pb-05">
      <div class="d-inline-flex gap-05 cursor-pointer text-secondary bg-hover-light text-hover-dark py-025 px-05 shape-rounded" v-on:click="$nuxt.$emit('add-teammember-modal')">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon>
        <span>New Teammate</span>
      </div>
    </div>
    <div class="list team-list my-05">
      <span v-for="(t, index) in projectTeam" :key="index + key" class="list__item ">
        <bib-avatar :src="t.avatar" size="1.75rem" class="mr-05"></bib-avatar> {{t.firstName}} {{t.lastName}} <bib-button pop="elipsis" variant="gray3" class="ml-auto">
          <template v-slot:menu>
            <div class="list">
              <span class="list__item">Edit Profile</span>
              <span class="list__item" @click="removeMember(t)">Remove from team</span>
              <!-- <span class="list__item list__item__danger">Delete</span> -->
            </div>
          </template>
        </bib-button>
      </span>
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {

  name: 'ProjectTeam',
  props: { team: Array },

  data() {
    return {
      key: 11,
      loading: false,
      // projectTeam: []
    }
  },
  computed: {
    ...mapGetters({
      members: 'user/getTeamMembers',
      project: 'project/getSingleProject',
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
  },
  created() {
    this.$nuxt.$on("update-key", () => {
      this.$store.dispatch("project/fetchTeamMember", { projectId: this.project.id })
    })
    this.$nuxt.$on("remove-member", (user) => {
      this.removeMember(user)
    })
  },
  mounted() {
    // this.$store.dispatch("project/fetchTeamMember", { projectId: this.project.id })
  },
  methods: {
    async removeMember(member) {
      // console.log(member)
      this.loading = true
      let confirmDelete = window.confirm("Are you sure want to delete " + member.name + "!")
      if (confirmDelete) {
        await this.$store.dispatch("project/deleteMember", { projectId: this.project.id, memberId: member.id })
          .then((res) => {
            // console.log(res)
            this.key += 1
            // alert(res)
          })
          .catch(e => console.log(e))
        this.loading = false
      }
    },
  }
}

</script>
<style lang="scss" scoped>
.action-left {
  border-bottom: 1px solid $gray2;
}

.team-list {

  .list__item {
    font-size: 1rem;
    height: 2.5rem;

    .list {
      &__item {
        font-size: $base-size;
        height: 2rem;
      }
    }

    .button--pop {
      opacity: 0.01;
    }

    &:hover {
      .button--pop {
        opacity: 1;
      }
    }
  }

}

</style>
