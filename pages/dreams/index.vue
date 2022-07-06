<template>
  <div id="dreams-wrapper" class="dreams-wrapper" >
    
    <page-title title="Dreams"></page-title>
    
    <dream-actions v-on:dream-create-modal="openCreateDreamModal"  />
    <div id="dreams-list-wrapper" class="dreams-list-wrapper of-scroll-y position-relative" >
      <!-- <loading :loading="loading"></loading> -->
      <template v-if="dreams.length">
        <bib-table :fields="tableFields" class="border-gray4 bg-white" :sections="dreams" :hide-no-column="true">
          <template #cell(title)="data">
            <div class="d-flex align-center text-dark cursor-pointer" :id="'goals-' + data.value.title">
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
        <span id="projects-0" class="d-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
          <bib-icon icon="warning"></bib-icon> No records found
        </span>
      </template>
    </div>
    <create-dream-modal ref="createDreamModal"></create-dream-modal>
  </div>
</template>

<script>
import { PROJECT_FIELDS } from '../../dummy/project';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      sortName: '',
      viewName: '',
      loading: true,
      tableFields: PROJECT_FIELDS,
      gridType: "list",
      activeTask: {
        assignee: null,
        priority: null,
        status: null,
      },
      orderBy: '',
      newkey: 0,
    }
  },

  computed: {
    ...mapGetters({
      dreams: "dream/getDreams"
    })
  },

  mounted() {
    this.$store.dispatch('dream/fetchDreams').then(() => { 
      this.newkey = Math.floor(Math.random() * 1000) + 1;
      this.loading = false 
    })
    
  },

  methods: {

    projectStatusLabel(status) {
      switch (status) {
        case 'Delayed':
          return 'Delayed'
        case 'In-Progress':
          return 'In-Progress'
        case 'Done':
          return 'Done'
        case 'Waiting':
          return 'Waiting'
        case 'Not Started':
          return 'Not Started'
      }
    },
    projectStatusVariable(status) {
      switch (status) {
        case 'Delayed':
          return 'danger'
        case 'In-Progress':
          return 'primary'
        case 'Done':
          return 'success'
        case 'Waiting':
          return 'warning'
        case 'Not Started':
          return 'secondary'
      }
    },
    projectPriorityVariable(priority) {
      switch (priority) {
        case 'high':
          return 'danger'
        case 'medium':
          return 'orange'
        case 'low':
          return 'success'
        case 'none':
          return 'secondary'
      }
    },
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    sortTitle() {
      
      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('project/sortProjects', {key: 'name', order: this.orderBy} )
      this.sortName = 'title';
      this.checkActive()
    },

    sortOwner() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('project/sortProjects', {key: 'owner', order: this.orderBy} )
      this.sortName = 'userId';
      this.checkActive()
    },

    sortByStatus() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('project/sortProjects', {key: 'status', order: this.orderBy} )
      this.sortName = 'status';
      this.checkActive()
    },

    sortByStartDate() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('project/sortProjects', {key: 'startDate', order: this.orderBy} )
      this.sortName = 'createdAt';
      this.checkActive()
    },

    sortByDueDate() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('project/sortProjects', {key: 'dueDate', order: this.orderBy} )
      this.sortName = 'dueDate';
      this.checkActive()
    },

    sortByPriority() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('project/sortProjects', {key: 'priority', order: this.orderBy} )
      this.sortName = 'priority';
      this.checkActive()
    },

    openCreateDreamModal(){
      this.$refs.createDreamModal.showCreateDreamModal = true
    },
  },

}

</script>
<style lang="scss" scoped>
.dreams-wrapper { display: flex; flex-direction: column; height: 100%; }

details {
  summary::-webkit-details-marker {
    display: none;
  }
}

</style>
