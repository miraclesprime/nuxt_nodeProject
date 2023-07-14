<template>
  <div id="projects-wrapper" class="projects-wrapper" >   
    <page-title title="Projects"></page-title>  
    <project-actions  @sortValue='sortProject($event)' @groupValue="ProjectGroup($event)" @viewValue='ProjectView($event)' v-on:loading="loading = $event" v-on:sort="sortProject" @search-projects="searchProjects" />
   
    <div id="projects-list-wrapper" class="projects-list-wrapper position-relative" >
    
      <template v-if="projects.length">
        <template v-if="groupVisible">
         
          <adv-table-three :tableFields="tableFields" :tableData="localData" :contextItems="projectContextItems" @context-item-event="contextItemClick" @row-click="projectRoute" @context-open="contextOpen" @title-click="projectRoute" @table-sort="sortProject"  @update-field="updateProject" @create-row="createProject" :drag="false" :key="templateKey" :editSection="groupBy"></adv-table-three>
        </template>

        <template v-else>
          <advance-table :tableFields="tableFields" :tableData="localData" :contextItems="projectContextItems" @context-item-event="contextItemClick" @row-click ="projectRoute" @context-open="contextOpen" @table-sort="sortProject" @title-click="projectRoute" @update-field="updateProject" @create-row="createProject" sectionTitle="" :plusButton="{label: 'New Project', icon: 'add'}" :drag="false" :key="templateKey"></advance-table>
        </template> 

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
            <!-- <loading :loading="loading"></loading> -->
          </div>
        </template>
        <template slot="footer">
          <div class="d-flex justify-between">
            <bib-button label="Cancel" variant="light" pill @click="renameModal = false"></bib-button>
            <bib-button label="Rename" variant="success" pill v-on:click="renameProject"></bib-button>
          </div>
        </template>
      </bib-modal-wrapper>
      <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" :autohide="5000">
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>
    </div>
  </div>
</template>

<script>
import { PROJECT_CONTEXT_MENU, PROJECT_FIELDS } from '../../config/constants';
import { mapGetters } from 'vuex';
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: "Projects",
  data() {
    return {
      sortName: '',
      viewName: '',
      projectContextItems: PROJECT_CONTEXT_MENU,
      datepickerArgs: { label: "", field: ""},
      popupMessages: [],
      renameProjectData: {},
      renameModal: false,
      projectName: "",
      loading: false,
      templateKey: 0,
      tableFields: PROJECT_FIELDS,
      gridType: "list",
      orderBy: 'asc',
      newkey: "",
      alertDialog: false,
      alertMsg:"",
      localData: [],
      popupMessages: [],
      groupVisible: false,
      groupBy: '',
    }
  },

  mounted() {
    this.loading = true;

    for(let field of this.tableFields) {
      if(field.header_icon) {
        if(field.key == 'dueDate') {
          field.header_icon.isActive = true;
        } else {
          field.header_icon.isActive = false;
        }
      }
    }

    this.$store.dispatch("project/setProjects",{data:this.localData})

      this.templateKey++;
  },
  computed: {
    ...mapGetters({
        projects: 'project/getAllProjects',
        favProjects: 'project/getFavProjects',
        teamMembers: "user/getTeamMembers",
        user: "user/getUser2"
    })
  },
  watch: {
    projects(newVal) {
        this.localData = _.cloneDeep(newVal)
    },
  },

  asyncData(context){
    const token = context.$cookies.get('b_ssojwt')
      return context.$axios.$get(`project/company/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Filter': 'all'
      }
    }).then((res)=>{
      
      let newArr = [];

      for(let i=0; i<res.data.length; i++) {
        if(res.data[i].dueDate) {
          newArr.unshift(res.data[i])
        } else {
          newArr.push(res.data[i])
        }
      }

      return {localData: newArr}
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
      this.templateKey++;
    },

    projectRoute(project) {

      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        return false
      }
      this.$router.push('/projects/' + project.id)
    },

    contextOpen(item){
      if(this.$CheckFavProject(item.id)){
       this.projectContextItems=this.projectContextItems.map(item => item.label === "Add to Favorites" ? { ...item, label: "Remove favorite"} : item);
      }
      else{
        this.projectContextItems=this.projectContextItems.map(item => item.label === "Remove favorite" ? { ...item, label: "Add to Favorites"} : item);
      }
   
      this.$store.dispatch("task/setSingleTask", item)
    },
    ProjectGroup($event) {
      if ($event ==="default" ) {
        this.groupVisible = false;
        this.groupBy = '';
        this.$store.commit('project/flatProjects');
        return;
      }
      this.groupBy = $event;
      this.$store.dispatch('project/groupProjects', { key: $event}).then((res) => {
        this.groupVisible = true
        this.templateKey += 1;

      })
    },
    ProjectView($event){
      this.$store.commit("project/getFilterProjects",{filter:$event, groupBy:this.groupBy})
      // this.$store.dispatch('project/fetchProjects', $event).then(() => { 
      //   if(this.groupVisible){
      //         this.$store.dispatch('project/groupProjects', { key: this.groupBy}).then((res) => {
      //     })
      //   }
       
      //  })
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


    contextItemClick(key, item){
      switch (key) {
        case 'fav-project':
          this.setFavorite(item)
          break;
        case 'rename-project':
          this.renameProjectData = item;
          this.renameModal = true
          break;
        case 'delete-project':
          this.deleteTask(item)
          break;
        case 'copy-project':
          this.copyProjectLink(item)
          break;
        case 'share-project':
          break;
        case 'report-project':
          break;
        default:
          this.alertDialog = true
          this.alertMsg = "no task assigned"
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
    
    
    updateProject(payload){
      const { item, label, field, value, historyText } = payload
      
      let user = this.teamMembers.find(t => t.id == item.userId)

      let data = { [field]: value }
    
      if(field == "dueDate" && item.startDate){
        // console.log(field, value)
        if(new Date(value).getTime() > new Date(item.startDate).getTime()){
          data = { [field]: value }
        } else{
          data = { [field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          // this.templateKey+=1;
          this.updateKey()
          return false
        }
      }
      if(field == "startDate" && item.dueDate){
        if(new Date(value).getTime() < new Date(item.dueDate).getTime()){
          data = { [field]: value }
        } else {
          data = { [field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          // this.templateKey+=1;
          this.updateKey()
          return false
        }
      }

      this.$store.dispatch("project/updateProject", {
        id: item.id,
        user,
        data: data,
        text: historyText,
        groupBy: this.groupBy,
      })
        .then(t => {
          if(t.statusCode == 200){
            if(this.groupBy == '' || this.groupBy == 'default'){
              this.updateKey()
            }
          }
        })
        .catch(e => console.warn(e))
    },

    deleteTask(project) {
       if (project) {
        this.loading = true
        this.$store
          .dispatch("project/deleteProject", project)
          .then((t) => {
            if (t.statusCode == 200) {
              this.popupMessages.push({ text: t.message, variant: "success" });
              this.updateKey();
              
             this.loading = false;
            } else {
              this.popupMessages.push({ text: t.message, variant: "orange" });
              console.warn(t.message);
              
            this.loading = false;
            }
          })
          .catch((e) => {
            console.warn(e);
            
          this.loading = false;
          });
      } else {
        this.popupMessages.push({
          text: "Action cancelled",
          variant: "orange",
        });
      }

      // this.confirmMsg = "Are you sure ";
      // this.confirmModal = true;
    },

    async renameProject() {
      this.loading = true
      const proj = await this.$axios.put("/project", {
        id: this.renameProjectData.id,
        data: {
          title: this.renameProjectData.title
        },
        user: this.renameProjectData.user,
        text: `Changed Project Name to ${this.renameProjectData.title}`
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      
      if (proj.data.statusCode == 200) {
        this.updateKey()
        this.loading=false
        this.renameModal = false
      }
      this.renameProjectData = {}
      this.loading = false
    },

    async createProject(proj,section) {
      let u = {
        id: this.user.Id,
        firstName: this.user.FirstName,
        lastName: this.user.LastName,
        email: this.user.Email
      }
      proj.user = u;
      proj.groupBy = this.groupBy;
      proj.status=null
      proj.statusId=null
      proj.priority=null
      proj.priorityId=null
      proj.departmentId = null;
      proj.department = null;

      if(this.groupBy=="priority"){
        proj.priority=section.tasks[0]?.priority
        proj.priorityId=section.tasks[0]?.priorityId
     
      }
      if(this.groupBy=="status"){
        proj.status=section.tasks[0]?.status
        proj.statusId=section.tasks[0]?.statusId
      }
      if(this.groupBy=="assignee"){
        proj.user=section.tasks[0]?.user
        proj.userId=section.tasks[0]?.userId
      }
      if(this.groupBy=="department"){
        proj.department=section.tasks[0]?.department
        proj.departmentId=section.tasks[0]?.departmentId
      }
    
      delete proj.show;
      delete proj.sectionId;
      
      this.$store.dispatch('project/createProject', proj).then(res => {
      });
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
      // this.loading=true
      this.$store.dispatch("project/fetchProjects").then(() => {
        if(this.groupVisible){
            this.$store.dispatch('project/groupProjects', { key: this.groupBy}).then((res) => {
        })
      }
        this.templateKey += 1;
      })
      
      
    },

    searchProjects(text) {
      let newArr
      let formattedText = text.toLowerCase().trim();
      if(this.projects[0]?.tasks){
              newArr = this.projects.map((item) => {
            const filteredTasks = item.tasks.filter((ele) => {
              if (ele.title.includes(formattedText) || ele.title.toLowerCase().includes(formattedText)) {
                console.log("Found matching task:", ele);
                return ele;
              } 
            })
            return { ...item, tasks: filteredTasks };
          })
      }
    else {
        newArr = this.projects.filter((p) => {
       
       if(p.title.includes(formattedText) || p.title.toLowerCase().includes(formattedText)) {
          return p
       } 
     
      })
    }
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
.projects-list-wrapper { overflow: auto; }
details {
  summary::-webkit-details-marker {
    display: none;
  }
}

</style>
