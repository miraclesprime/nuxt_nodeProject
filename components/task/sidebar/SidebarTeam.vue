<template>
  <div :class="adClass" :id="adClass">
    <!-- <section-title title="Add Team Member"  /> -->
    <div class="d-flex gap-05 cursor-pointer text-secondary text-hover-dark" id="pta-add-teammate-button" v-on:click="$nuxt.$emit('add-member-to-task')">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon>
            <span >New Teammate</span>
      </div>

    <div class="team-list w-100" style="margin-top: 10px;" id="sidebar-team-team-list">
      <div
        :id="'teammate-' + index"
        class="teammate"
        v-for="(item, index) in teammates"
        :key="'teammate-' + index"
      >
        <bib-avatar :src="'https://i.pravatar.cc/' + index * 100" size="25px">
        </bib-avatar>

        <span class="teammate-name" :id="item.name">{{ item.name }} 
          <template>
          <span class="cursor-pointer shape-circle" v-on:click="deleteMember(item)">
            <bib-icon icon="trash" variant="danger"></bib-icon>
          </span>
        </template>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    adClass: {
      type: String,
      default: "container pt-1",
    },
  },

  computed: {
    ...mapGetters({
      teammates: 'task/getTaskMembers',
      task: 'task/getSelectedTask'
    })
  },

  methods: {
    async deleteMember(member) {
      
      this.loading = true
      let confirmDelete = window.confirm("Are you sure want to delete " + member.name + "!")
      if (confirmDelete) {
        await this.$store.dispatch("task/deleteMember", { memberId: member.id })
          .then((res) => {
            // console.log(res)
            this.key += 1
            alert(res)
          })
          .catch(e => console.log(e))
        this.loading = false
      }
    },
  },

  mounted() {
    this.$store.dispatch('task/fetchTeamMember', {id: this.task.id})
  }
};
</script>

<style lang="scss" scoped>
.teammate {
  padding: 7px 0;
  border-bottom: 1px solid $gray6;

  &:first-child {
    border-top: 1px solid $gray6;
  }
}

.teammate-name {
  font-size: $sidebar-size;
  font-weight: 400;
}
</style>
