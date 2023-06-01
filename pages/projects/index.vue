<template>
  <div id="projects-wrapper" class="projects-wrapper" >   
    <page-title title="Projects"></page-title>  
    <project-actions @sortValue='sortName=$event' @viewValue='viewName=$event' v-on:loading="loading = $event" v-on:sort="sortProject" @search-projects="searchProjects" />
   
    <div id="projects-list-wrapper" class="projects-list-wrapper position-relative" >
      <loading :loading="loading"></loading>
      <!-- popup notification -->
      <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification
              v-for="(msg, index) in popupMessages"
              :key="index"
              :message="msg.text"
              :variant="msg.variant"
            >
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>
        <!-- confirm delete task -->
        <!-- <confirm-dialog
          v-if="confirmModal"
          :message="confirmMsg"
          @close="confirmDelete"
        ></confirm-dialog> -->
      <template v-if="projects.length">

        <advance-table :tableFields="tableFields" :tableData="localData" :contextItems="projectContextItems" @context-item-event="contextItemClick" @row-click ="projectRoute" @table-sort="sortProject" @title-click="projectRoute" @update-field="updateProject" @create-row="createProject" sectionTitle=""></advance-table>

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
      <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification
              v-for="(msg, index) in popupMessages"
              :key="index"
              :message="msg.text"
              :variant="msg.variant"
              :autohide="5000"
            >
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>
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
      datepickerArgs: { label: "", field: ""},
      popupMessages: [],
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
      localData: [],
      popupMessages: [],
      // confirmModal: false,
      // confirmMsg: "",
      // taskToDelete: {}
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
        user: "user/getUser2"
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
        return false
      }
      this.$router.push('/projects/' + project.id)
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

      let data={ [payload.field]: payload.value }
      // let before=this.beforeLocal.filter((item)=>item.id===payload.item.id)
    
      if(payload.field==="dueDate")
        {
          if(new Date(payload.value).toISOString().slice(0, 10)>new Date(payload.item.startDate).toISOString().slice(0, 10))
            {
              
                data={ [payload.field]: payload.value }
            }
            else{
              data={ [payload.field]: null }
              this.popupMessages.push({ text: "Invalid date", variant: "danger" });
            }
        }
        if(payload.field==="startDate")
        {
          if(new Date(payload.value).toISOString().slice(0, 10)<new Date(payload.item.dueDate).toISOString().slice(0, 10))
            {
              data={ [payload.field]: payload.value }
            }
            else {
              data={ [payload.field]: null }
              this.popupMessages.push({ text: "Invalid date", variant: "danger" });
            }
          
        }
      this.$store.dispatch("project/updateProject", {
        id: item.id,
        user,
        data: data,
        text: historyText
      })
        .then(t => {
          if (t.statusCode == 200) {
            this.updateKey()
          } else {
            console.warn(t)
          }
        })
        .catch(e => console.warn(e))
    },

    // confirmDelete(state) {
    //   // this.confirmModal = false;
    //   // this.confirmMsg = "";
    //   if (state) {
    //     this.loading = true
    //     this.$store
    //       .dispatch("project/deleteProject", this.taskToDelete)
    //       .then((t) => {
    //         if (t.statusCode == 200) {
    //           this.popupMessages.push({ text: t.message, variant: "success" });
    //           this.updateKey();
    //           this.taskToDelete = {};
              
    //          this.loading = false;
    //         } else {
    //           this.popupMessages.push({ text: t.message, variant: "orange" });
    //           console.warn(t.message);
              
    //     this.loading = false;
    //         }
    //       })
    //       .catch((e) => {
    //         console.warn(e);
            
    //     this.loading = false;
    //       });
    //   } else {
    //     this.popupMessages.push({
    //       text: "Action cancelled",
    //       variant: "orange",
    //     });
    //     this.taskToDelete = {};
    //   }
    // },

    deleteTask(project) {
       if (project) {
        this.loading = true
        this.$store
          .dispatch("project/deleteProject", project)
          .then((t) => {
            if (t.statusCode == 200) {
              this.popupMessages.push({ text: t.message, variant: "success" });
              this.updateKey();
              // this.taskToDelete = {};
              
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
        // this.taskToDelete = {};
      }

      // this.taskToDelete = project;
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
        this.renameModal = false
      }
      this.renameProjectData = {}
      this.loading = false
    },

    async createProject(proj) {
      let u = {
        id: this.user.Id,
        firstName: this.user.FirstName,
        lastName: this.user.LastName,
        email: this.user.Email
      }
      proj.departmentId = null;
      proj.budget = 0;
      proj.dueDate = null;
      proj.startDate = null;
      proj.user = u;
      delete proj.show;
      delete proj.sectionId;
      this.$store.dispatch('project/createProject', proj);
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
        this.templateKey += 1;
      })
    },

    searchProjects(text) {

      let formattedText = text.toLowerCase().trim();;
      
      let newArr = this.projects.filter((p) => {
       
       if(p.title.includes(formattedText) || p.title.toLowerCase().includes(formattedText)) {
          return p
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
.projects-list-wrapper { overflow: auto; }
details {
  summary::-webkit-details-marker {
    display: none;
  }
}

</style>
