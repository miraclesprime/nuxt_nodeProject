<template>
  <div id="projects-wrapper" class="projects-wrapper" >   
    <page-title title="Projects" :count="projectcount"></page-title>  
    <project-actions  @sortValue='sortProject($event)' @groupValue="ProjectGroup($event)" @viewValue='ProjectView($event)' v-on:loading="loading = $event" v-on:sort="sortProject" @search-projects="searchProjects" />
   
    <div id="projects-list-wrapper" class="projects-list-wrapper position-relative" >
    
      <template v-if="projectcount > 0 ">
        <template v-if="groupVisible">
         
          <adv-table-three :tableFields="tableFields" :tableData="localData" :lazyComponent="lazyComponent" :contextItems="projectContextItems" @context-item-event="contextItemClick" @row-click="projectRoute" @context-open="contextOpen" @title-click="projectRoute" @table-sort="sortProject" @update-field="updateProject" @create-row="createProject" :drag="false" :key="templateKey" :editSection="groupBy" :filter="filterViews"></adv-table-three>
        </template>

        <template v-else>
          <advance-table :tableFields="tableFields" :tableData="localData" sectionTitle="" :lazyComponent="lazyComponent" :contextItems="projectContextItems" @context-item-event="contextItemClick" @row-click ="projectRoute" @context-open="contextOpen" @table-sort="sortProject" @title-click="projectRoute" @update-field="updateProject" @create-row="createProject" :plusButton="{label: 'New Project', icon: 'add'}" :drag="false" :key="templateKey"></advance-table>
        </template> 

      </template>

      <no-data v-else></no-data>

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
      <!-- delete confirm -->
      <bib-modal-wrapper v-if="projectDeleteConfirm" title="Delete project" @close="projectDeleteConfirm = false">
        <template slot="content">
          <p>Are you sure?</p>
          <loading :loading="loading"></loading>
        </template>
        <template slot="footer">
            <div v-show="!loading" class="justify-between gap-1">
              <bib-button label="Cancel" variant="secondary" pill @click="projectDeleteConfirm = false"></bib-button>
              <bib-button label="Delete" variant="primary-24" pill @click="deleteTask"></bib-button>
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
      dueDateSort: 'asc',
      startDateSort: 'asc',
      departmentSort: 'asc',
      prioritySort: 'asc',
      statusSort: 'asc',
      titleSort: 'asc',
      userSort: 'asc',
      newkey: "",
      alertDialog: false,
      alertMsg:"",
      localData: [],
      popupMessages: [],
      groupVisible: false,
      groupBy: '',
      lazyComponent: false,
      projectDeleteConfirm: false,
      projectToDelete: {},
    }
  },
  created() {
    if (process.client) {

      this.$nuxt.$on("refresh-table", () => {
        
        this.updateKey();
      });
      this.$nuxt.$on("project-refresh-table", () => {
        this.updateKey();
      });

    }
  },
  mounted() {
    if (this.projects.length<=0) {
      this.updateKey();
    }
    // this.loading = true;
    this.$store.commit('project/setGroupBy',"")

    for(let field of this.tableFields) {
      if(field.header_icon) {
        if(field.key == 'dueDate') {
          field.header_icon.isActive = true;
        } else {
          field.header_icon.isActive = false;
        }
      }
    }

    setTimeout(() => {
      this.$store.dispatch("project/setProjects", this.localData)
      // this.$store.commit("project/setTaskCount",this.localData)
      // this.$store.dispatch("project/fetchInitialProjects")
      this.lazyComponent = true
    }, 50)


    this.templateKey++;
  },
  beforeDestroy(){ 
    this.$nuxt.$off("refresh-table");
  },
  computed: {
    ...mapGetters({
        projects: 'project/getAllProjects',
        favProjects: 'project/getFavProjects',
        teamMembers: "user/getTeamMembers",
        user: "user/getUser2",
        filterViews :'task/getFilterView',
        projectcount:"project/getTaskCount"
    }),
    // projectcount(){
    //   if (this.groupBy == "") {
    //     return this.projects.length
    //   } else {
    //     return this.projects.reduce((acc, td) => acc + td.tasks?.length, 0)
    //   }
    // },
  },
  watch: {
    projects(newVal) {
        this.localData = _.cloneDeep(newVal)
    },
  },

  async asyncData({$axios, app,store}){
      const token = app.$cookies.get(process.env.SSO_COOKIE_NAME)
      const filter=store.getters['task/getFilterView']
      const res = await $axios.get(`project/company/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Filter': filter
      }
    })

      
    let newArr = [];

    for(let i=0; i<res.data.data.length; i++) {
      if(res.data.data[i].dueDate) {
        newArr.unshift(res.data.data[i])
      } else {
        newArr.push(res.data.data[i])
      }
    }
    return { localData: newArr }
   
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

      let projMenu = JSON.parse(JSON.stringify(PROJECT_CONTEXT_MENU));

        if(item.userId == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
          this.projectContextItems = projMenu;
        } else {
          projMenu.pop()
          this.projectContextItems = projMenu
        }
        
      if(this.$CheckFavProject(item.id)){
       this.projectContextItems=this.projectContextItems.map(item => item.label === "Add to Favorites" ? { ...item, label: "Remove favorite"} : item);
      }
      else{
        this.projectContextItems=this.projectContextItems.map(item => item.label === "Remove favorite" ? { ...item, label: "Add to Favorites"} : item);
      }
   
      this.$store.dispatch("task/setSingleTask", item)
    },

    ProjectGroup($event) {
      this.lazyComponent=false
      if ($event ==="default" ) {
        this.groupVisible = false;
        this.groupBy = '';
        this.$store.commit('project/setGroupBy','')
        this.updateKey()
        // this.$store.commit('project/flatProjects');
        setTimeout(() => {
            this.lazyComponent=true
            }, 30);
        return;
      }
      this.groupBy = $event;
      this.$store.commit('project/setGroupBy',$event)
      this.groupVisible = true
      this.updateKey()

      // this.$store.dispatch("project/fetchProjects").then(() => {
      //   if(this.groupVisible){
      //       this.$store.dispatch('project/groupProjects', { key: this.groupBy}).then((res) => {
      //   })
      // }
      //   this.templateKey += 1;
      // })
      // this.$store.dispatch('project/groupProjects', { key: $event}).then((res) => {
      //   this.groupVisible = true
      //   this.templateKey += 1;

      // })
    },
    ProjectView($event){
      this.$store.commit('task/setFilterView', {filter:$event})
      this.updateKey()
      // this.$store.commit("project/getFilterProjects",{filter:$event, groupBy:this.groupBy})
    },

    resetOtherSorts(sName) {

      switch (sName) {
        case 'title':
          this.statusSort = 'asc';
          this.userSort = 'asc';
          this.prioritySort = 'asc';
          this.departmentSort = 'asc';
          this.startDateSort = 'asc';
          this.dueDateSort = 'asc';
          break;
      
        case 'userId':
          this.statusSort = 'asc';
          this.titleSort = 'asc';
          this.prioritySort = 'asc';
          this.departmentSort = 'asc';
          this.startDateSort = 'asc';
          this.dueDateSort = 'asc';
          break;
        
        case 'status':
          this.titleSort = 'asc';
          this.userSort = 'asc';
          this.prioritySort = 'asc';
          this.departmentSort = 'asc';
          this.startDateSort = 'asc';
          this.dueDateSort = 'asc';
          break;

        case 'priority':
          this.statusSort = 'asc';
          this.userSort = 'asc';
          this.titleSort = 'asc';
          this.departmentSort = 'asc';
          this.startDateSort = 'asc';
          this.dueDateSort = 'asc';
          break;

        case 'department':
          this.statusSort = 'asc';
          this.userSort = 'asc';
          this.prioritySort = 'asc';
          this.titleSort = 'asc';
          this.startDateSort = 'asc';
          this.dueDateSort = 'asc';
          break;

        case 'startDate':
          this.statusSort = 'asc';
          this.userSort = 'asc';
          this.prioritySort = 'asc';
          this.departmentSort = 'asc';
          this.titleSort = 'asc';
          this.dueDateSort = 'asc';
          break;

        case 'dueDate':
          this.statusSort = 'asc';
          this.userSort = 'asc';
          this.prioritySort = 'asc';
          this.departmentSort = 'asc';
          this.startDateSort = 'asc';
          this.titleSort = 'asc';
          break;

        default:
          this.statusSort = 'asc';
          this.userSort = 'asc';
          this.prioritySort = 'asc';
          this.departmentSort = 'asc';
          this.startDateSort = 'asc';
          this.dueDateSort = 'asc';
          this.titleSort = 'asc';
          break;
      }
    },

    async sortProject($event) {
      await this.calcProjects();
      
      if($event == 'title') {
          if(this.titleSort == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'name', order: 'asc'} ).then((res) => {
              this.titleSort = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.titleSort == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'name', order: 'desc'} ).then((res) => {
              this.titleSort = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'title';
          this.resetOtherSorts($event)
          this.checkActive()
      }

      if($event == 'userId') {

          if(this.userSort == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'owner', order: 'asc'} ).then((res) => {
              this.userSort = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.userSort == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'owner', order: 'desc'} ).then((res) => {
              this.userSort = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'userId';
          this.resetOtherSorts($event)
          this.checkActive()
      }

      if($event == 'status') {

          if(this.statusSort == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'status', order: 'asc'} ).then((res) => {
              this.statusSort = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.statusSort == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'status', order: 'desc'} ).then((res) => {
              this.statusSort = 'asc'
              this.templateKey += 1;
            })
            
          }
          this.sortName = 'status';
          this.resetOtherSorts($event)
          this.checkActive()
      }

      if($event == 'priority') {

          if(this.prioritySort == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'priority', order: 'asc'} ).then((res) => {
              this.prioritySort = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.prioritySort == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'priority', order: 'desc'} ).then((res) => {
              this.prioritySort = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'priority';
          this.resetOtherSorts($event)
          this.checkActive()
      }

      if($event == 'department') {

          if(this.departmentSort == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'department', order: 'asc'} ).then((res) => {
              this.departmentSort = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.departmentSort == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'department', order: 'desc'} ).then((res) => {
              this.departmentSort = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'department';
          this.resetOtherSorts($event)
          this.checkActive()
      }

      if($event == 'startDate') {

          if(this.startDateSort == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'startDate', order: 'asc'} ).then((res) => {
              this.startDateSort = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.startDateSort == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'startDate', order: 'desc'} ).then((res) => {
              this.startDateSort = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'startDate';
          this.resetOtherSorts($event)
          this.checkActive()
      }
      
      if($event == 'dueDate') {

          if(this.dueDateSort == 'asc') {
            this.$store.dispatch('project/sortProjects', {key: 'dueDate', order: 'asc'} ).then((res) => {
              this.dueDateSort = 'desc'
              this.templateKey += 1;
            })
          }

          if(this.dueDateSort == 'desc') {
            this.$store.dispatch('project/sortProjects', {key: 'dueDate', order: 'desc'} ).then((res) => {
              this.dueDateSort = 'asc'
              this.templateKey += 1;
            })
          }
          this.sortName = 'dueDate';
          this.resetOtherSorts($event)
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
          // this.deleteTask(item)
          this.projectDeleteConfirm = true
          this.projectToDelete = item
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
      // console.log(payload)
      const { item, label, field, value, historyText } = payload
      let user

      if(field == "userId"){
        user = this.teamMembers.find(t => t.id == value)
      }
      else {
        user = null
      }
      
      // console.log(user)
      let data = { [field]: value }
    
      if(field == "dueDate" && item.startDate){
        if(value=="Invalid Date"){
          data = { [field]: null }
        }
        else
         {
          data = { [field]: value }
          //  if(new Date(value).getTime() > new Date(item.startDate).getTime())
          //  {
          //     data = { [field]: value }
          //   } 
          // else{
          //     data = { [field]: null }
          //     this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          //     // this.updateKey()
          //     return false
          //   }
        }
     
      }
      if(field == "startDate" && item.dueDate){
        if(value=="Invalid Date"){
          data = { [field]: null }
        }
        else
         {
          data = { [field]: value }
          //   if(new Date(value).getTime() < new Date(item.dueDate).getTime()){
          //   data = { [field]: value }
          // } else {
          //   data = { [field]: null }
          //   this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          //   // this.templateKey+=1;
          //   // this.updateKey()
          //   return false
          // }
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
          // console.log("update",t)
          if(t.statusCode == 200){
            if(this.groupBy == '' || this.groupBy == 'default'){
              // this.updateKey()
            }
          }
        })
        .catch(e => console.warn(e))
    },

    deleteTask() {
       if (this.projectToDelete) {

        this.loading = true
        this.$store
          .dispatch("project/deleteProject", this.projectToDelete)
          .then((t) => {
            if (t.statusCode == 200) {
              this.popupMessages.push({ text: "Project deleted successfully", variant: "primary-24" });
              this.$nuxt.$emit("delete_update_table",this.projectToDelete,this.$route.fullPath)
              // this.updateKey();
              this.$store.dispatch('project/fetchFavProjects')

            } else {
              this.popupMessages.push({ text: t.message, variant: "primary-24" });
              console.warn(t.message);

            }
          })
          .catch((e) => {
            this.popupMessages.push({text: e, variant: "danger"})
            console.warn(e);

          })
          .then(() => {
            this.loading = false;
            this.projectToDelete = {}
            this.projectDeleteConfirm = false
          });
      } else {
        this.popupMessages.push({
          text: "Action cancelled",
          variant: "primary-24",
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

      console.log(...arguments)
      return

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
        if (res.statusCode == 200) {
           this.$nuxt.$emit("newTask",res.data,this.$route.fullPath)
          }
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
      this.$store.dispatch("project/fetchProjects",{
          filter:this.filterViews,
        }).then(() => {
        if(this.groupVisible){
            this.$store.dispatch('project/groupProjects', { key: this.groupBy}).then((res) => {
        })
      }
        this.templateKey += 1;
      })
      
      
    },
    calcProjects() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch("project/fetchProjects", {
          filter: this.filterViews,
        })
          .then(() => {
            if (this.groupVisible) {
              this.$store.dispatch('project/groupProjects', { key: this.groupBy })
                .then(() => {
                  resolve();
                })
                .catch(error => {
                  reject(error);
                });
            } else {
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
},
    async searchProjects(text) {
      await this.calcProjects();
      let newArr=[]
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
        this.$store.commit("project/setTaskCount",newArr)
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
.projects-list-wrapper { overflow: auto;height: 100%; }
details {
  summary::-webkit-details-marker {
    display: none;
  }
}

</style>
