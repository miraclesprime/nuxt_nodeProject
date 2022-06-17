<template>
  <div id="projects-wrapper" class="projects-wrapper" >
    <!-- <div id="project-name" class="project-heading p-05 text-secondary font-sm"> -->
    <!-- <nav id="projects-nav-wrapper" class="d-flex align-center gap-05 pt-05 pb-05">
      <nuxt-link to="/" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <span class="font-lg font-w-700  mr-1" id="projects-title-head">Projects</span>
    </nav> -->
    <page-title title="Projects"></page-title>
    <!-- </div> -->
    <project-actions @sortValue='sortName=$event' @viewValue='viewName=$event' v-on:loading="loading = $event" v-bind:sort="sortName" />
    <div id="projects-list-wrapper" class="projects-list-wrapper of-scroll-y position-relative" >
      <loading :loading="loading"></loading>
      <template v-if="projects.length">
        <bib-table :fields="tableFields" class="border-gray4 bg-white" :sections="projects" :key="'sort-'+ sortName ? sortName : 'sName' + 'view-' + viewName ? viewName : 'vName' + Math.random().split(-3) " :hide-no-column="true" @file-title-sort="sortTitle" @file-owner-sort="sortOwner" @file-status-sort="sortByStatus" @file-startDate-sort="sortByStartDate" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
          <template #cell(title)="data">
            <div class="d-flex align-center text-dark cursor-pointer" :id="'projects-' + data.value.title" @click="goToProjectId(data.value)">
              <bib-icon icon="briefcase" variant="gray5" :scale="1.1" class="mr-025"></bib-icon>
              <span :id="'projects-' + data.value.title + '-text'">{{data.value.title}}</span>
            </div>
          </template>
          <template #cell(userId)="data">
            <user-info :userId="data.value.userId" :key="newkey" ></user-info>
          </template>
          <template #cell(status)="data">
            <status-comp :status="data.value.status"></status-comp>
            <!-- <div class="d-flex gap-05 align-center">
              <div class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-'+ projectStatusVariable(data.value.status ? data.value.status.text : '')" :id="'projects-' + data.value.statusId ? data.value.statusId : ''">
              </div>
                <span :id="'projects-' + data.value.statusId ? data.value.statusId : '' + '-text'" class="text-dark text-truncate">{{ projectStatusLabel(data.value.status ? data.value.status.text : "") }}</span>
            </div> -->
          </template>
          <template #cell(createdAt)="data">
            <format-date :datetime="data.value.createdAt" :key="newkey"></format-date>
            <!-- <span :id="'projects-' + data.value.createdAt + '-text'" class="text-dark text-truncate" v-format-date="data.value.createdAt"></span> -->
            
          </template>
          <template #cell(dueDate)="data">
            <!-- <span :id="'projects-' + data.value.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.dueDate"></span> -->
            <format-date :datetime="data.value.dueDate" :key="newkey"></format-date>
            
          </template>
          <template #cell(priority)="data">
            <priority-comp :priority="data.value.priority"></priority-comp>
            <!-- <div class="d-flex gap-05 align-center">
              <bib-icon icon="urgent-solid" :scale="1.1" :variant="projectPriorityVariable(data.value.priority ? data.value.priority.text : '')"></bib-icon>
                <span id="project-text" :class="'text-' + projectPriorityVariable(data.value.priority ? data.value.priority.text : '')">
                  {{ capitalizeFirstLetter(data.value.priority ? data.value.priority.text : '') }}
                </span>
            </div> -->
          </template>
        </bib-table>
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
      newkey: "",
    }
  },
  mounted() {
    this.$store.dispatch('project/fetchProjects').then(() => { 
      this.newkey = parseInt( Math.random().toString().slice(-3) )
      this.loading = false 
    })
    
  },
  computed: {
    ...mapGetters({
      projects: 'project/getAllProjects'
    })
  },

  methods: {
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

    tabChange(value) {
      this.activeTab = value;
    },
    goToProjectId(project) {
      // console.log(project)
      this.$store.dispatch('project/setSingleProject', project)
      this.$router.push("/projects/" + project.id)
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
.projects-wrapper { display: flex; flex-direction: column; height: 100%; }

details {
  summary::-webkit-details-marker {
    display: none;
  }
}

</style>
