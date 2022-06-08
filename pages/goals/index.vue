<template>
  <div id="goals-wrapper" class="goals-wrapper" >
    
    <page-title title="Goals"></page-title>
    
    <goal-actions  />
    <div id="goals-list-wrapper" class="projects-list-wrapper of-scroll-y position-relative" >
      <!-- <loading :loading="loading"></loading> -->
      <template v-if="goals.length">
        Bib-Table
      </template>
      <template v-else>
        <span id="projects-0" class="d-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
          <bib-icon icon="warning"></bib-icon> No records found
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { PROJECT_FIELDS } from '../../dummy/project';
// import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      sortName: '',
      viewName: '',
      loading: true,
      goals: [],
      tableFields: PROJECT_FIELDS,
      gridType: "list",
      activeTask: {
        assignee: null,
        priority: null,
        status: null,
      },
      orderBy: '',
      newkey: "",
    }
  },
//   mounted() {
//     this.$store.dispatch('project/fetchProjects').then(() => { 
//       this.newkey = parseInt( Math.random().toString().slice(-3) )
//       this.loading = false 
//     })
    
//   },
//   computed: {
//     ...mapGetters({
//       projects: 'project/getAllProjects'
//     })
//   },

  methods: {
    // checkActive() {
    //   for(let i=0; i<this.tableFields.length; i++) {
    //       if(this.tableFields[i].header_icon) {
    //         this.tableFields[i].header_icon.isActive = false
    //       }

    //       if(this.tableFields[i].header_icon && this.tableFields[i].key == this.sortName) {
    //         this.tableFields[i].header_icon.isActive = true
    //       } 
    //   }
    // },

    // tabChange(value) {
    //   this.activeTab = value;
    // },
    // goToProjectId(project) {
    //   // console.log(project)
    //   this.$store.dispatch('project/setSingleProject', project)
    //   this.$router.push("/projects/" + project.id)
    // },

  // methods for bib-table

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
    }
  },


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
