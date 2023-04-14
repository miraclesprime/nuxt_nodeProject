<template>
  <div id="projects-wrapper" class="projects-wrapper" >   
    <page-title title="Projects"></page-title>  
    <project-actions @sortValue='sortName=$event' @viewValue='viewName=$event' v-on:loading="loading = $event" v-on:sort="sortProject" @search-projects="searchProjects" />
   
    <div id="projects-list-wrapper" class="projects-list-wrapper of-scroll-y position-relative" >
      <loading :loading="loading"></loading>
      <template v-if="projects.length">

        <drag-table-simple :key="templateKey" :fields="tableFields" :tasks="localData" :titleIcon="{ icon: 'briefcase-solid', event: 'row-click'}" :componentKey="templateKey" :drag="false" :sectionTitle="'Projects'" @row-click="projectRoute" v-on:table-sort="sortProject" @row-context="projectRightClick" @edit-field="updateProject" @user-picker="showUserPicker" @date-picker="showDatePicker" @status-picker="showStatusPicker" @priority-picker="showPriorityPicker" @dept-picker="showDeptPicker" ></drag-table-simple>
        
        <!-- table context menu -->
        <table-context-menu :items="projectContextItems" :show="projectContextMenu" :coordinates="popupCoords" :activeItem="activeProject" @close-context="closeContext" @item-click="contextItemClick" ></table-context-menu>

        <!-- user-picker for list and board view -->
        <user-picker :show="userPickerOpen" :coordinates="popupCoords" @selected="updateAssignee('Assignee', 'userId', $event.id, $event.label)" @close="userPickerOpen = false"></user-picker>

        <!-- date-picker for list and board view -->
        <inline-datepicker :show="datePickerOpen" :datetime="activeProject[datepickerArgs.field]" :coordinates="popupCoords" @date-updated="updateDate" @close="datePickerOpen = false"></inline-datepicker>

        <!-- status picker for list view -->
        <status-picker :show="statusPickerOpen" :coordinates="popupCoords" @selected="updateProject({ task: activeProject, label:'Status', field:'statusId', value: $event.value, historyText: $event.label})" @close="statusPickerOpen = false" ></status-picker>
        <!-- priority picker for list view -->
        <priority-picker :show="priorityPickerOpen" :coordinates="popupCoords" @selected="updateProject({ task: activeProject, label:'Priority', field:'priorityId', value: $event.value, historyText: $event.label})" @close="priorityPickerOpen = false" ></priority-picker>
        <!-- department-picker for list view -->
        <dept-picker :show="deptPickerOpen" :coordinates="popupCoords" @selected="updateProject({ task: activeProject, label:'Department', field:'departmentId', value: $event.value, historyText: $event.label })" @close="deptPickerOpen = false"></dept-picker>
      </template>
      <template v-else>
        <span id="projects-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
          <bib-icon icon="warning"></bib-icon> No records found
        </span>
      </template>

      <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>
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
import { PROJECT_CONTEXT_MENU, PROJECT_FIELDS } from '../../config/constants';
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: "Projects",
  data() {
    return {
      sortName: '',
      viewName: '',
      projectContextItems: PROJECT_CONTEXT_MENU,
      projectContextMenu: false,
      userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: ""},
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
      popupCoords: {},
      activeProject: {},
      renameProjectData: {},
      renameModal: false,
      projectName: "",
      loading: true,
      templateKey: 0,
      tableFields: PROJECT_FIELDS,
      gridType: "list",
      orderBy: 'asc',
      newkey: "",
      alertDialog: false,
      alertMsg:"",
      localData: []
    }
  },

  mounted() {

    for(let field of this.tableFields) {
      if(field.header_icon) {
        field.header_icon.isActive = false;
      }
    }

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
        teamMembers: "user/getTeamMembers",
    })
  },

  watch: {
    projects(newVal) {
        this.localData = _.cloneDeep(newVal)
    },
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
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        // this.$nuxt.$emit("close-sidebar");
        this.closeContext()
        this.userPickerOpen = false
        this.datePickerOpen = false
        return false
      }
      this.$router.push('/projects/' + project.id)
    },

    projectRightClick(payload) {
      this.closeAllPickers()
      this.projectContextMenu = true;
      const { event, task } = payload
      this.activeProject = task;
      this.renameProjectData = JSON.parse(JSON.stringify(task));
      this.popupCoords = { left: event.pageX+'px', top: event.pageY+'px' }
    },

    sortProject($event) {
      
      if($event == 'title') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'name', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'name', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'title';
          this.checkActive()
      }

      if($event == 'userId') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'owner', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'owner', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'userId';
          this.checkActive()
      }

      if($event == 'status') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'status', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'status', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
            })
            
          }
          this.sortName = 'status';
          this.checkActive()
      }

      if($event == 'priority') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'priority', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'priority', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'priority';
          this.checkActive()
      }

      if($event == 'department') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'department', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'department', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'department';
          this.checkActive()
      }

      if($event == 'startDate') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'startDate', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'startDate', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'startDate';
          this.checkActive()
      }
      
      if($event == 'dueDate') {

          if(this.orderBy == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'dueDate', order: 'asc'} ).then((res) => {
              this.orderBy = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.orderBy == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'dueDate', order: 'desc'} ).then((res) => {
              this.orderBy = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'dueDate';
          this.checkActive()
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
          // alert("no project assigned")
          this.alertDialog = true
          this.alertMsg = "no task assigned"
          break;
      }
    },

    showUserPicker(payload){
      // console.log(payload)
      this.closeAllPickers()
      this.userPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeProject = payload.task
    },
    showDatePicker(payload){
      // console.log(payload)
      // payload consists of event, task, label, field
      this.closeAllPickers()
      this.datePickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeProject = payload.task
      this.datepickerArgs.field = payload.field || 'dueDate'
      this.datepickerArgs.label = payload.label || 'Due date'
    },
    showStatusPicker(payload){
      this.closeAllPickers()
      this.statusPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeProject = payload.task
    },
    showPriorityPicker(payload){
      this.closeAllPickers()
      this.priorityPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeProject = payload.task
    },
    showDeptPicker(payload){
      this.closeAllPickers()
      this.deptPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeProject = payload.task
    },

    closeAllPickers(){
      this.projectContextMenu = false
      this.userPickerOpen = false
      this.datePickerOpen = false
      this.statusPickerOpen = false
      this.priorityPickerOpen = false
      this.deptPickerOpen = false
      this.activeProject = {}
      // this.toggleSidebar()
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

    updateProject(payload){
      const { task, label, field, value, historyText } = payload
      let user = this.teamMembers.find(t => t.id == task.userId)

      this.$store.dispatch("project/updateProject", {
        // id: task.id,
        id: this.activeProject.id,
        user,
        data: { [field]: value},
        text: `changed ${label} to ${historyText || value}`
      })
        .then(t => {
          // console.log(t)
          if (t.statusCode == 200) {
            this.updateKey()
          } else {
            console.warn(t)
          }
        })
        .catch(e => console.warn(e))
    },

    updateAssignee(label, field, value, historyText){
      // console.log(...arguments)

      this.userPickerOpen = false
      let user = this.teamMembers.find(t => t.id == value)

      this.$store.dispatch("project/updateProject", {
        id: this.activeProject.id,
        user,
        data: { [field]: value},
        text: `changed ${label} to ${historyText}`
      })
        .then(t => {
          // console.log(t)
          if (t.statusCode == 200) {
            this.updateKey()
          } else {
            console.warn(t)
          }
        })
        .catch(e => console.warn(e))
    },

    updateDate(value){
      // console.log(...arguments, this.datepickerArgs)
      let user = this.teamMembers.find(tm => tm.id == this.activeProject.userId)
      let newDate = dayjs(value).format("D MMM YYYY")

      this.$store.dispatch("project/updateProject", {
        id: this.activeProject.id,
        user,
        data: { [this.datepickerArgs.field]: value},
        text: `changed ${this.datepickerArgs.label} to ${newDate}`
      })
        .then(t => {
          // console.log(t)
          if (t.statusCode == 200) {
            this.updateKey()
          } else {
            console.warn(t)
          }
        })
        .catch(e => console.warn(e))
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
        // this.$store.dispatch("project/setSingleProject", proj.data.data)
        this.updateKey()
        this.renameModal = false
      }
      this.renameProjectData = {}
      this.loading = false
    },

    copyProjectLink(proj) {
        let url = window.location.host + `/projects/${proj.id}`;

        if (navigator.clipboard) { 
          navigator.clipboard.writeText(url);
        } else { 
          unsecuredCopyToClipboard(url);
        }
    },

    updateKey() {
      this.$store.dispatch("project/fetchProjects").then(() => {
        // console.log('fetched again')
        this.templateKey += 1;
      })
    },

    searchProjects(text) {

      let formattedText = text.toLowerCase().trim();;
      
      let newArr = this.projects.filter((p) => {
       
       if(p.description) {
          if(p.title.includes(formattedText) || p.title.toLowerCase().includes(formattedText) || p.description.includes(formattedText) || p.description.toLowerCase().includes(formattedText)) {
            return p
          } 
        } else {
          if(p.title.includes(formattedText) || p.title.toLowerCase().includes(formattedText)) {
            return p
          } 
        }

      })

      if(newArr.length >= 0) {
        this.localData = newArr
        this.templateKey++;
      } else {
        this.localData = JSON.parse(JSON.stringify(this.projects));
        this.templateKey++;
      }
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
