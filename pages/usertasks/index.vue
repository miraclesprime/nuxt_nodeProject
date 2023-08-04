<template>
  <client-only>
    <div id="page" class="task-page-wrapper">
      <page-title
        :title="`${selectedUser.firstName} ${selectedUser.lastName}'s Tasks`"
      ></page-title>
      <user-name-task-actions
        :gridType="gridType"
        @userTaskGroup="userTaskGroup($event)"
        v-on:filterView="filterView"
        v-on:userTaskSort="sortBy"
        v-on:new-task="toggleSidebar($event)"
        @search-user-tasks="searchUserTasks"
      ></user-name-task-actions>
    
      <div v-show="gridType == 'list'" id="task-table-wrapper" class="listview h-100 position-relative" :style="{ 'width': contentWidth }">  
        <div v-if="groupVisible" class="h-100">
          <adv-table-three :tableFields="taskFields" :tableData="localData" :lazyComponent="true" :contextItems="contextMenuItems" @context-open="contextOpen" @context-item-event="contextItemClick" @row-click="openSidebar" @title-click="openSidebar" @table-sort="sortBy"  @update-field="updateTask" @create-row="createTask" :drag="false" :key="templateKey" :editSection="groupBy"></adv-table-three>              
        </div>
        <div v-else class="h-100">
          <advance-table :tableFields="taskFields" :tableData="localData" :lazyComponent="true" :contextItems="contextMenuItems" @context-open="contextOpen"  @context-item-event="contextItemClick" @row-click ="openSidebar" @table-sort="sortBy" @title-click="openSidebar" @update-field="updateTask" @create-row="createTask" sectionTitle="" :drag="false" :key="templateKey"></advance-table>
        </div> 
      </div>
    
      <div v-show="gridType == 'grid'" id="task-grid-wrapper" class="d-flex gridview h-100" >
        <div class="task-grid-section">
          <div
            class="w-100 d-flex justify-between"
            style="margin-bottom: 10px"
          >
            <div class="title text-gray">Department</div>
            <div class="d-flex section-options">
              <div class="mr-1">
                <bib-icon icon="add" variant="success" :scale="1.2" />
              </div>
              <div>
                <bib-icon icon="elipsis" :scale="1.2" />
              </div>
            </div>
          </div>
          <div class="task-section__body">
            <div v-for="(item, index) in tasks" :key="index + '-' + key">
              <task-grid :task="item" v-on:update-key="updateKey" />
            </div>
          </div>
        </div>
      </div>
        
      <alert-dialog
        v-show="alertDialog"
        :message="alertMsg"
        @close="alertDialog = false"
      ></alert-dialog>
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
  </client-only>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import {
  COMPANY_TASK_FIELDS as TaskFields,
  TASK_CONTEXT_MENU,
} from "../../config/constants";
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: "UserTasks",
  data() {
    return {
      title: "UserTasks",
      gridType: "list",
      taskFields: TaskFields,
      taskContextMenu: false,
      // beforeLocal:[],
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
      popupMessages: [],
      popupCoords: {},
      templateKey: 0,
      userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: "" },
      activeTask: {},
      contextMenuItems: TASK_CONTEXT_MENU,
      loading: false,
      flag: false,
      viewName: "all",
      orderBy: "desc",
      key: 100,
      userfortask: "",
      tasks: [],
      taskOrder: "asc",
      selectedUser: {},
      alertDialog: false,
      alertMsg: "",
      localData: [],
      contentWidth: "100%",
      groupVisible: false,
      groupBy:'',
      filterData:'all',
      taskToDelete: {},
      sortName: 'priority'
    };
  },
  computed: {
    ...mapGetters({
      userTasks:'user/getUserTasks',
      user: "user/getUser",
      teamMembers: "user/getTeamMembers",
      sidebar: "task/getSidebarVisible",
      user: "user/getUser2",
      favTasks: 'task/getFavTasks',
      filterViews :'task/getFilterView',
      selectedTask :'task/getSelectedTask',
      userInfo :"user/getUserInfo"
    }),
  },

  watch: {
    filterViews(newValue){
      return _.cloneDeep(newValue)
    },
    userTasks(newVal) {
      this.localData = _.cloneDeep(newVal);
    },
    "$route.query": {
      immediate: true,
      handler(newVal) {
        if(Object.keys(newVal).length === 0){
          newVal=this.userInfo
          this.$route.query.id=this.userInfo.id
        }
        this.userfortask = this.teamMembers.find((u) => {
          if (u.id == newVal.id) {
            this.selectedUser = u;
            return u;
          }
        });
        //save userinfo to the store for expand taskside
        this.$store.commit('user/setUserForTask',this.userfortask)
        this.fetchUserTasks();
      },
    },

    gridType() {
      this.key++;
    },

    tasks(newVal) {
      let data = _.cloneDeep(newVal);
      let sortedData = data.sort((a, b) => {
        if (a.priorityId && b.priorityId) {
          return a.priorityId - b.priorityId;
        }
      });

      for(let field of this.taskFields) {
          if(field.header_icon) {
            if(field.key == 'priority') {
              field.header_icon.isActive = true;
            } else {
              field.header_icon.isActive = false;
            }
          }
        }

      this.localData = sortedData;
    },

    sidebar(newVal){
      const page = document.getElementById("page")
      this.$nextTick(() => {
        const panel = document.getElementById("side-panel-wrapper")
        // console.log("page width="+page.scrollWidth+", panel width="+panel.offsetWidth)
        if (this.sidebar) {
          this.contentWidth = (page.scrollWidth - panel.offsetWidth) + 'px'
          this.contentWidth = (page.scrollWidth - panel.offsetWidth) + 'px'
        } else {
          this.contentWidth = '100%'
        }
      });
    }
  },

  created() {
    if (process.client) {
      this.$nuxt.$on("update-key", async (payload) => {
        this.$store.commit('user/updateFetchUserTasks',{createORupdate:payload,data:this.selectedTask,filter:this.filterViews,key:this.groupBy})
        // await this.fetchUserTasks();
        // this.beforeLocal = this.localData
      });
      this.$nuxt.$on("user-picker", (payload) => {
        // emitted from <task-grid>
        this.showUserPicker(payload);
      });
      this.$nuxt.$on("date-picker", (payload) => {
        // emitted from <task-grid>
        this.showDatePicker(payload);
      });
    }
  },

  mounted() {
    if (process.client) {

      if (JSON.parse(localStorage.getItem("user")).subr != "ADMIN") {
        this.$router.push('/error/403')    
      } 

      for(let field of this.taskFields) {
        if(field.header_icon) {
          if(field.key == 'priority') {
            field.header_icon.isActive = true;
          } else {
            field.header_icon.isActive = false;
          }
        }
      }
      
       setTimeout(() => {
        this.userfortask=this.userInfo
        this.fetchUserTasks()
      }, 200);

      if (!this.$route.query.id) {
        this.$router.push({ path: "/dashboard" });
      }

    }
  },

  methods: {

    checkActive() {
      for(let i=0; i<this.taskFields.length; i++) {
          if(this.taskFields[i].header_icon) {
            this.taskFields[i].header_icon.isActive = false
          }

          if(this.taskFields[i].header_icon && this.taskFields[i].key == this.sortName) {
            this.taskFields[i].header_icon.isActive = true
          } 
      }
      this.templateKey++;
    },

    userTaskGroup($event) {
      if ($event ==="default" ) {
        this.groupVisible = false;
        this.groupBy = '';
        this.$store.commit('user/flatTasks');
        this.localData = this.userTasks
        return;
      }
      this.groupBy = $event;
      this.groupVisible = true
      this.$store.commit('user/groupUserTasks',{key:this.groupBy})
      this.localData = this.userTasks
    },

    async fetchUserTasks() {
      if (process.client) {
        this.$store.dispatch("user/getUserTasks", {
          userId:this.userfortask ? this.userfortask.id : "",
          filter: 'all',
      })
        .then(res=> {
          this.$store.commit('user/setFetchUserTasks',{data:res,filter:this.filterViews,key:this.groupBy})         
        })
   
      }
    },
    contextOpen(item){
      if(this.$CheckFavTask(item.id)){
       this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Add to Favorites" ? { ...item, label: "Remove favorite"} : item);
      } else {
        this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Remove favorite" ? { ...item, label: "Add to Favorites"} : item);
      }
      if(item.statusId==5){
       this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Mark Complete" ? { ...item, label: "Completed"} : item);
      } else {
         this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Completed" ? { ...item, label: "Mark Complete"} : item);
      }
      this.$store.dispatch("task/setSingleTask", item)
    },
    updateKey($event) {
      if ($event) {
        this.popupMessages.push({ text: $event, variant: "success" });
      }
      if (process.client) {
        this.$store.dispatch("user/getUserTasks", {
          userId:this.userfortask ? this.userfortask.id : "",
          filter: 'all',
      })
        .then(res=> {
          this.$store.commit('user/setFetchUserTasks',{data:res,filter:this.filterViews,key:this.groupBy})         
        })
   
      }
      // let compid = JSON.parse(localStorage.getItem("user")).subb;
      // this.$store
      //   .dispatch("company/fetchCompanyTasks", {
      //     companyId: compid,
      //     filter: "all",
      //     sort: this.sortName,
      //     sName: this.groupBy
      //   })
      //   .then(() => {
      //     this.key += 1;
      //   });
    },

    openSidebar(task, scroll) {
      let fwd = this.$donotCloseSidebar(event.target.classList);
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false;
      }
      this.$nuxt.$emit("open-sidebar", { ...task, scrollId: scroll });
    },

    contextItemClick(key, item) {
      switch (key) {
        case "done-task":
          this.taskMarkComplete(item);
          break;
        case "fav-task":
          this.taskSetFavorite(item);
          break;
        case "delete-task":
          this.deleteTask(item);
          break;
        case 'copy-task':
          this.copyTaskLink(item);
          break;
        case 'gotoTeam':
          this.$nuxt.$emit('add-member-to-task')
          break;
        case 'gotoComment':
          this.openSidebar(item, 'task_conversation')
          break;
        case 'gotoSubtask':
          this.openSidebar(item, 'task_subtasks')
          break;
        case 'gotoFiles':
          this.openSidebar(item, 'task_files')
          break;
        default:
          this.alertDialog = true;
          this.alertMsg = "no task assigned";
          break;
      }
    },

    // task context menu methods ----------------------------------------

    copyTaskLink(task) {
        let url = window.location.host + `/tasks/${task.id}`;
        if (navigator.clipboard) { 
          navigator.clipboard.writeText(url);
        } else { 
          unsecuredCopyToClipboard(url);
        }
    },

    createTask(proj,section) {
      proj.group = this.groupBy;
          proj.status=null
          proj.statusId=null
          proj.priority=null
          proj.priorityId=null
          proj.departmentId = null;
          proj.department = null;
          proj.projectId=null
          proj.budget = 0;
          proj.dueDate = null;
          proj.startDate = null;
          proj.user = [this.selectedUser];
          proj.text = `Created a task ${proj.title}`
      if(this.groupBy=="priority"){
        proj.priority=section.tasks[0]?.priority
        proj.priorityId=section.tasks[0]?.priorityId
     
      }
      if(this.groupBy=="status"){
        proj.status=section.tasks[0]?.status
        proj.statusId=section.tasks[0]?.statusId
      }
      if(this.groupBy=="department"){
        proj.department=section.tasks[0]?.department
        proj.departmentId=section.tasks[0]?.departmentId
      }
      if(this.groupBy=="project"){
        proj.projectId=section.tasks[0]?.project?.[0].project?.id||null 
      }
      delete proj.show
      delete proj.sectionId
      this.$store.dispatch('task/createTask', proj).then(() => {
        this.updateKey();
      });
    },

    taskSetFavorite(task) {
      this.loading = true;
      let isFav = this.favTasks.some((f) => f.taskId == task.id);

      if (isFav) {
        this.$store
          .dispatch("task/removeFromFavorite", { id: task.id })
          .then((msg) => {
            this.updateKey();
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.log(e);
          });
      } else {
        this.$store
          .dispatch("task/addToFavorite", { id: task.id })
          .then((msg) => {
            this.updateKey();
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.log(e);
          });
      }
    },

    taskMarkComplete(task) {
      this.loading = true;
  
      this.$store
        .dispatch("task/updateTaskStatus", task)
        .then((d) => {
          this.loading = false;
          this.updateKey();
          this.$store.dispatch("task/setSingleTask", d).then(() => {
            this.key += 1;
          });
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    updateTask(payload) {
      // console.log(payload)

      let user, projectId;
      if (payload.field == "userId" && payload.value != "") {
        user = [this.teamMembers.find((t) => t.id == payload.value)];
      } else {
        user = null;
      }
  
      if (payload.item.project.length > 0) {
        projectId = payload.item.project[0].projectId || payload.item.project[0].project.id;
      } else {
        projectId = null;
      }
      let data = { [payload.field]: payload.value }
      // let before = this.beforeLocal.filter((item)=>item.id === payload.item.id)
    
      if(payload.field == "dueDate" && payload.item.startDate){
        if(payload.value=="Invalid Date"){
          data = { [payload.field]: null }
        }else {
          if(new Date(payload.value).getTime() > new Date(payload.item.startDate).getTime()){
          // console.log('dueDate > startDate')
          data = { [payload.field]: payload.value }
        } else {
          data = { [payload.field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey();
          return false
        }
        }
        // console.log(payload.value, 'startDate', payload.item.startDate)
        // if(new Date(payload.value).toISOString().slice(0, 10)>new Date(payload.item.startDate).toISOString().slice(0, 10)){
   
      }

      if(payload.field == "startDate" && payload.item.dueDate) {
        if(payload.value=="Invalid Date"){
          data = { [payload.field]: null }
        }else {
          if(new Date(payload.value).getTime() < new Date(payload.item.dueDate).getTime()) {
          // console.log('startDate < dueDate')
          data = { [payload.field]: payload.value }
        } else {
          data = { [payload.field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey();
          return false
        }
        }
        // console.log(payload.value, 'dueDate', payload.item.dueDate)
  
      }

      // console.log(data)
      
      this.$store
      .dispatch("task/updateTask", {
        id: payload.item.id,
        projectId,
        data: data,
        user,
        text: payload.historyText,
      })
      .then(async (t) => {
        // console.log("tt",t)
        if (t.statusCode == 200) {
          this.updateKey();
        } else {
          console.warn(t);
        }
      })
      .catch((e) => console.warn(e));
     
    },

    deleteTask(task) {
      if (task) {
        this.loading = true;
        // console.log(this.taskToDelete);
        this.$store
          .dispatch("task/deleteTask", task)
          .then((t) => {
            if (t.statusCode == 200) {
              this.updateKey(t.message);
            } else {
              this.popupMessages.push({ text: t.message, variant: "orange" });
              console.warn(t.message);
            }
            this.loading = false;
          })
          .catch((e) => {
            console.warn(e);
            this.loading = false;
          });
      } else {
        this.popupMessages.push({ text: "Action cancelled", variant: "orange" });
      }
    },
    async filterView($event) {
      this.filterData=$event
      this.$store.commit('task/setFilterView', {filter:$event})
      this.$store.commit("user/getFilterUserTasks",{filter:$event, groupBy:this.groupBy})
    
    },

    sortBy($event) {
      this.sortName = $event;
      if ($event == "title") {
        this.$store
          .dispatch("user/sortUserTasks", {
            key: $event,
            order: this.orderBy,
          })
      }

      if ($event == "userId") {
        this.$store
          .dispatch("user/sortUserTasks", {
            key: $event,
            order: this.orderBy,
          })
      }

      if ($event == "project") {
        this.$store
          .dispatch("user/sortUserTasks", {
            key: $event,
            order: this.orderBy,
          })
      }

      if ($event == "status") {
        this.$store
          .dispatch("user/sortUserTasks", {
            key: $event,
            order: this.orderBy,
          })
      }

      if ($event == "difficultyId") {
        this.$store
          .dispatch("user/sortUserTasks", {
            key: $event,
            order: this.orderBy,
          })
      }

      if ($event == "priority") {
        this.$store
          .dispatch("user/sortUserTasks", {
            key: $event,
            order: this.orderBy,
          })
      }

      if ($event == "startDate") {
        this.$store
          .dispatch("user/sortUserTasks", {
            key: $event,
            order: this.orderBy,
          })
      }

      if ($event == "dueDate") {
        this.$store
          .dispatch("user/sortUserTasks", {
            key: $event,
            order: this.orderBy,
          })
      }

      if (this.orderBy == "asc") {
        this.orderBy = "desc";
      } else {
        this.orderBy = "asc";
      }
      this.localData = this.userTasks
      this.checkActive();
      this.key += 1;
    },
  

    toggleSidebar($event) {
      if (!$event) {
        this.$nuxt.$emit("open-sidebar", {...$event,email:this.userfortask});
      }
      this.flag = !this.flag;
    },

    searchUserTasks(text) {
      let formattedText = text.toLowerCase().trim();
      let newArr
      if(this.userTasks[0]?.tasks){
        newArr = this.userTasks.map((item) => {
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
        newArr = this.userTasks.filter((t) => {
          if (t.title.includes(formattedText) || t.title.toLowerCase().includes(formattedText)) {
              return t;
          }
        });
      }

      if (newArr.length >= 0) {
        this.localData = newArr;
        this.key++;
      } else {
        this.localData = this.userTasks;
        this.key++;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.task-page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.listview,
.gridview {
  overflow: auto;
}

.section-options {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}
</style>
