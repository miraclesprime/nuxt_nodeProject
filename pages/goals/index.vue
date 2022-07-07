<template>
  <div id="goals-wrapper" class="goals-wrapper" >
    
    <page-title title="Goals"></page-title>
    
    <goal-actions v-on:goal-create-modal="openCreateGoalModal"></goal-actions>
    <div id="goals-list-wrapper" class="projects-list-wrapper of-scroll-y position-relative" >
      <!-- <loading :loading="loading"></loading> -->
      <template v-if="goals.length">
        <bib-table :fields="tableFields" class="border-gray4 bg-white" :sections="goals" :hide-no-column="true" @file-title-sort="sortTitle" @file-owner-sort="sortOwner" @file-status-sort="sortByStatus" @file-department-sort="sortByDepartment" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
          <template #cell(title)="data">
            <div class="d-flex align-center text-dark cursor-pointer" :id="'goals-' + data.value.title" @click="goToGoalId(data.value)">
              <bib-icon icon="briefcase" variant="gray5" :scale="1.1" class="mr-025"></bib-icon>
              <span :id="'goals-' + data.value.title + '-text'">{{data.value.title}}</span>
            </div>
          </template>
          <template #cell(department)="data">
            <span>{{data.value.department}}</span>
          </template>
          <template #cell(status)="data">
            <status-comp :status="data.value.status"></status-comp>
          </template>
          <template #cell(priority)="data">
            <priority-comp :priority="data.value.priority"></priority-comp>
          </template>
          <template #cell(userId)="data">
            <user-info :userId="data.value.userId" :key="newKey"></user-info>
          </template>
          <template #cell(dueDate)="data">
            <format-date :datetime="data.value.dueDate" :key="newKey"></format-date>
          </template>
        </bib-table>
      </template>
      <template v-else>
        <span id="goal-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
          <bib-icon icon="warning"></bib-icon> No records found
        </span>
      </template>
    </div>
    <create-goal-modal ref="createGoalModal"></create-goal-modal>
  </div>
</template>

<script>
import { GOAL_FIELDS } from '../../dummy/goals';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      sortName: '',
      viewName: '',
      loading: true,
      tableFields: GOAL_FIELDS,
      gridType: "list",
      activeTask: {
        assignee: null,
        priority: null,
        status: null,
      },
      orderBy: '',
      newkey: '',
    }
  },
  mounted() {
    this.$store.dispatch('goals/fetchGoals').then(() => { 
      this.newkey = Math.floor(Math.random() * 1000) + 1;
      this.loading = false 
    })
    
  },
  computed: {
    ...mapGetters({
        goals: 'goals/getGoals'
    })
  },

  methods: {
    openCreateGoalModal(){
      this.$refs.createGoalModal.showCreateGoalModal = true
    },

    goToGoalId(goal) {
      this.$store.dispatch('goals/setSingleGoal', goal)
      this.$router.push("/goals/" + goal.id)
    },

    checkActive() {
      for(let i=0; i<this.tableFields.length; i++) {
          if(this.tableFields[i].header_icon) {
            this.tableFields[i].header_icon.isActive = false
          }

          if(this.tableFields[i].header_icon && this.tableFields[i].key == this.sortName) {
            this.tableFields[i].header_icon.isActive = true
          } 
      }
    },

    
  }

}

</script>
<style lang="scss" scoped>
.goals-wrapper { display: flex; flex-direction: column; height: 100%; }

details {
  summary::-webkit-details-marker {
    display: none;
  }
}

</style>
