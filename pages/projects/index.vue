<template>
  <div id="projects-wrapper" class="projects-wrapper" >
    
    <page-title title="Projects"></page-title>
    
    <project-actions @sortValue='sortName=$event' @viewValue='viewName=$event' v-on:loading="loading = $event" v-bind:sort="sortName" />
    <div id="projects-list-wrapper" class="projects-list-wrapper of-scroll-y position-relative" >
      <loading :loading="loading"></loading>
      <template v-if="projects.length">
        <!-- <bib-table :fields="tableFields" class="border-gray4 bg-white" :sections="projects" :key="'sort-'+ sortName ? sortName : 'sName' + 'view-' + viewName ? viewName : 'vName' + Math.random().split(-3) " :hide-no-column="true" @file-title-sort="sortTitle" @file-owner-sort="sortOwner" @file-status-sort="sortByStatus" @file-startDate-sort="sortByStartDate" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
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
          </template>
          <template #cell(createdAt)="data">
            <format-date :datetime="data.value.createdAt" :key="newkey"></format-date>
          </template>
          <template #cell(dueDate)="data">
            <format-date :datetime="data.value.dueDate" :key="newkey"></format-date>
          </template>
          <template #cell(priority)="data">
            <priority-comp :priority="data.value.priority"></priority-comp>
          </template>
        </bib-table> -->

        <drag-table-simple :fields="tableFields" :tasks="projects" :componentKey="templateKey" :drag="false" :sectionTitle="'Projects'" @row-click="projectRoute" v-on:table-sort="sortProject" @row-context="projectRightClick"></drag-table-simple>
        
        <!-- table context menu -->
        <table-context-menu :items="projectContextItems" :show="projectContextMenu" :coordinates="contextCoords" :activeItem="activeProject" @close-context="closeContext" @item-click="contextItemClick" ></table-context-menu>
      </template>
      <template v-else>
        <span id="projects-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
          <bib-icon icon="warning"></bib-icon> No records found
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { PROJECT_FIELDS } from '../../dummy/project';
import {PROJECT_CONTEXT_MENU} from '../../config/constants';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      sortName: '',
      viewName: '',
      projectContextItems: PROJECT_CONTEXT_MENU,
      projectContextMenu: false,
      contextCoords: { },
      activeProject: {},
      loading: true,
      templateKey: 0,
      tableFields: PROJECT_FIELDS,
      gridType: "list",
      activeTask: {
        assignee: null,
        priority: null,
        status: null,
      },
      orderBy: 'asc',
      newkey: "",
    }
  },
  mounted() {
    this.$store.dispatch('project/fetchProjects').then(() => { 
      this.templateKey += 1;
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


    projectRoute() {
      console.log('project Route!')
    },

    projectRightClick(payload) {
      this.projectContextMenu = true;
      const { event, task } = payload
      this.contextCoords = { left: event.pageX+'px', top: event.pageY+'px' }
    },

    sortProject($event) {
      console.log($event, this.orderBy)
      
      if($event == 'title') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'name', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
              this.sortName = 'title';
              this.checkActive()
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'name', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
              this.sortName = 'title';
              this.checkActive()
            })
            
          }
      }

      if($event == 'userId') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'owner', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
              this.sortName = 'owner';
              this.checkActive()
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'owner', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
              this.sortName = 'owner';
              this.checkActive()
            })
            
          }
      }

      if($event == 'status') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'status', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
              this.sortName = 'status';
              this.checkActive()
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'status', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
              this.sortName = 'status';
              this.checkActive()
            })
            
          }
      }

      if($event == 'priority') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'priority', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
              this.sortName = 'priority';
              this.checkActive()
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'priority', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
              this.sortName = 'priority';
              this.checkActive()
            })
            
          }
      }

      if($event == 'createdAt') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'owner', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
              this.sortName = 'start date';
              this.checkActive()
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'owner', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
              this.sortName = 'start date';
              this.checkActive()
            })
            
          }
      }
      
      if($event == 'dueDate') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'dueDate', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
              this.sortName = 'due date';
              this.checkActive()
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'dueDate', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
              this.sortName = 'due date';
              this.checkActive()
            })
            
          }
      }

      this.templateKey += 1;
    },

    closeContext() {
      this.projectContextMenu = false
      this.activeProject = {}
      // this.$store.dispatch('task/setSingleTask', {})
    },

    contextItemClick(key){
      console.log(key)
      switch (key) {
        case 'done-task':
          // statements_1
          this.markComplete(this.activeTask)
          break;
        case 'fav-task':
          this.setFavorite(this.activeTask)
          break;
        case 'delete-task':
          this.deleteTask(this.activeTask)
          break;
        case 'assign-task':
          // statements_1
          break;
        default:
          alert("no task assigned")
          break;
      }
    },
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
