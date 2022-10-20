<template>
  <div class="py-05 px-105">
    <div class="d-flex justify-between sub-title pb-05 border-bottom-gray4 ">
      <p class="text-gray5 font-md">Team </p>
    </div>
    <div class="section-title py-025">
      <div class="d-inline-flex gap-05 align-center py-025 px-05 shape-rounded cursor-pointer bg-success-sub4 bg-hover-success-sub1 text-success text-hover-white" id="pta-add-teammate-button" v-on:click="addTeamMember">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon>
        <span>New Teammate</span>
      </div>
    </div>
    <template v-if="teammates.length">
      <bib-table :id="'teammate-' + index" class=" bg-white mt-1 border-top-light" :sections="teammates" headless :key="'teammate-' + teammates ? teammates[0].name : 100" :fields="tableFields" hide-no-column>
        <template #cell(name)="data">
          <user-info v-if="data.value.id" :userId="data.value.id"></user-info>
        </template>
        <template #cell(delete)="data">
          <span class="cursor-pointer shape-circle" v-on:click="deleteMember(data.value)">
            <bib-icon icon="trash" variant="danger"></bib-icon>
          </span>
        </template>
      </bib-table>
    </template>
    
    <loading :loading="loading"></loading>
    <!-- <add-teammember-modal ref="teamMemberModal"></add-teammember-modal> -->
    <add-member-to-task ref="taskTeamModal"></add-member-to-task>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { TaskTeamFields } from '../../../config/constants';

export default {

  data() {
    return {
      index: 0,
      norecord: false,
      tableFields: TaskTeamFields,
      loading: false,
    }
  },

  watch: {
    teammates() {
      if (this.teammates.length == 0) {
        this.loading = false
        // this.norecord = true
      } else {
        // this.norecord = false
        this.loading = false
      }
    }
  },

  computed: {
    ...mapGetters({
      teammates: 'task/getTaskMembers',
      task: 'task/getSelectedTask'
    })
  },

  methods: {
    addTeamMember() {
      this.$refs.taskTeamModal.showTaskTeamModal = true
    },
    async deleteMember(member) {
      this.loading = true
      let confirmDelete = window.confirm("Are you sure want to delete " + member.name + "!")
      if (confirmDelete) {
        await this.$store.dispatch("task/deleteMember", { memberId: member.id, text: `"${member.name}" removed from task` })
          .then((res) => {
            // console.log(res)
            this.key += 1
            console.log(res)
          })
          .catch(e => console.log(e))
        this.loading = false
      }
    },
  },

  mounted() {
    this.$store.dispatch('task/fetchTeamMember', { id: this.task.id })
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
  /*font-weight: 400;*/
}

</style>
