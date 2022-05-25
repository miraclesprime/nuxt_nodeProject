<template>
  <div class="p-1">
    <div class="d-flex gap-05 cursor-pointer text-secondary text-hover-dark" id="pta-add-teammate-button" v-on:click="$nuxt.$emit('add-member-to-task')">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon>
            <span >New Teammate</span>
      </div>

    <template v-if="teammates.length">

    <bib-table 
        :id="'teammate-' + index"
        class="border-gray4 bg-white mt-05"
        :sections="teammates" 
        headless="true"
        :key="'teammate-' + teammates ? teammates[0].name : 100"
        :fields="tableFields"
        hide-no-column
    >
      
      <template #cell(name)="data">
        <user-info v-if="data.value.id" :userId="data.value.id" ></user-info>
      </template>
      
      <template #cell(delete)="data">
        <span class="cursor-pointer shape-circle" v-on:click="deleteMember(data.value)">
          <bib-icon icon="trash" variant="danger"></bib-icon>
        </span>
      </template>

    </bib-table>

    </template>

    <template v-if="norecord">
      <span id="taskTeam-0" class="d-inline-flex gap-1 align-center my-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
        <bib-icon icon="warning"></bib-icon> No records found
      </span>
    </template>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {TaskTeamFields} from '../../../config/constants';

export default {

  data() {
    return {
      norecord: false,
      tableFields: TaskTeamFields,
      loading: false,
    }
  },

  watch: {
    teammates() {
      if (this.teammates.length == 0) {
        this.loading = false
        this.norecord = true
      } else {
        this.norecord = false
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
