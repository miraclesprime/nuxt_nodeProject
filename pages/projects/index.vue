<template>
  <div id="projects-wrapper" class="projects-wrapper" >   
    <page-title title="Projects"></page-title>  
    <project-actions @sortValue='sortName=$event' @viewValue='viewName=$event' v-on:loading="loading = $event" v-bind:sort="sortName" />
   
    <div id="projects-list-wrapper" class="projects-list-wrapper of-scroll-y position-relative" >
      <loading :loading="loading"></loading>
      <template v-if="projects.length">

        <drag-table-simple :fields="tableFields" :tasks="projects" :titleIcon="{ icon: 'briefcase-solid', event: 'row-click'}" :componentKey="templateKey" :drag="false" :sectionTitle="'Projects'" @row-click="projectRoute" v-on:table-sort="sortProject" @row-context="projectRightClick" ></drag-table-simple>
        
        <!-- table context menu -->
        <table-context-menu :items="projectContextItems" :show="projectContextMenu" :coordinates="contextCoords" :activeItem="activeProject" @close-context="closeContext" @item-click="contextItemClick" ></table-context-menu>
      </template>
      <template v-else>
        <span id="projects-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
          <bib-icon icon="warning"></bib-icon> No records found
        </span>
      </template>

      <!-- project rename modal -->
      <bib-modal-wrapper v-if="renameModal" title="Rename project" @close="renameModal = false">
        <template slot="content">
          <div>
            <bib-input type="text" v-model.trim="renameProjectData.title" placeholder="Enter name..."></bib-input>
            <loading :loading="loading"></loading>
          </div>
        </template>
        <template slot="footer">
          <div class="d-flex justify-between">
            <bib-button label="Cancel" variant="light" pill @click="renameModal = false"></bib-button>
            <bib-button label="Rename" variant="success" pill v-on:click="renameProject"></bib-button>
          </div>
        </template>
      </bib-modal-wrapper>
    </div>
  </div>
</template>

<script>
import { PROJECT_FIELDS } from '../../dummy/project';
import { PROJECT_CONTEXT_MENU } from '../../config/constants';
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
      renameProjectData: {},
      renameModal: false,
      projectName: "",
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
        projects: 'project/getAllProjects',
        favProjects: 'project/getFavProjects',
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

    projectRoute(project) {
      this.$router.push('/projects/' + project.id)
    },

    projectRightClick(payload) {
      this.projectContextMenu = true;
      const { event, task } = payload
      this.activeProject = task;
      this.renameProjectData = JSON.parse(JSON.stringify(task));
      this.contextCoords = { left: event.pageX+'px', top: event.pageY+'px' }
    },

    sortProject($event) {
      
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

      if($event == 'startDate') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'startDate', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
              this.sortName = 'start date';
              this.checkActive()
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'startDate', order: 'desc'} ).then((res) => {
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
    },

    contextItemClick(key){
      switch (key) {
        case 'fav-project':
          this.setFavorite(this.activeProject)
          break;
        case 'rename-project':
          this.renameModal = true
          break;
        case 'delete-project':
          this.deleteTask(this.activeProject)
          break;
        case 'copy-project':
          this.copyProjectLink(this.activeProject)
          break;
        case 'share-project':
          break;
        case 'report-project':
          break;
        default:
          alert("no project assigned")
          break;
      }
    },

    setFavorite(project) {
      this.loading = true
      let isFav = this.favProjects.some((f) => f.id == project.id)

      if (isFav) {
        this.$store.dispatch("project/removeFromFavorite", { id: project.id })
          .then(msg => {
            this.updateKey()
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      } else {
        this.$store.dispatch("project/addToFavorite", { id: project.id })
          .then(msg => {
            this.updateKey()
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      }
    },

    deleteTask(project) {
      let del = confirm("Are you sure")
      this.loading = true
      if (del) {
        this.$store.dispatch("project/deleteProject", project).then(t => {

          if (t.statusCode == 200) {
            this.updateKey()
          } else {
            console.warn(t.message);
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          console.log(e)
        })
      } else {
        this.loading = false
      }
    },

    async renameProject() {
      this.loading = true
      const proj = await this.$axios.put("/project", {
        id: this.renameProjectData.id,
        data: {
          title: this.renameProjectData.title
        },
        user: this.renameProjectData.user
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      
      if (proj.data.statusCode == 200) {
        this.$store.dispatch("project/setSingleProject", proj.data.data)
        this.updateKey()
        this.renameModal = false
      }
      this.renameProjectData = {}
      this.loading = false
    },

    async copyProjectLink(proj) {
      let url = window.location.host + `/projects/${proj.id}`;

      await navigator.clipboard.writeText(url);
    },

    updateKey() {
      this.$store.dispatch("project/fetchProjects").then(() => {
        console.log('fetched again')
        this.templateKey += 1;
      })
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
