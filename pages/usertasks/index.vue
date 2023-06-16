<template>
  <client-only>
    <div id="page" class="task-page-wrapper">
      <page-title
        :title="`${selectedUser.firstName} ${selectedUser.lastName}'s Tasks`"
      ></page-title>
      <user-name-task-actions
        :gridType="gridType"
        @userTaskGroup="UserTaskGroup($event)"
        v-on:filterView="filterView"
        v-on:userTaskSort="sortBy"
        v-on:new-task="toggleSidebar($event)"
        @search-user-tasks="searchUserTasks"
      ></user-name-task-actions>
    
          <div v-show="gridType == 'list'" id="task-table-wrapper" class="listview h-100 position-relative" :style="{ 'width': contentWidth }">  
              <div v-if="groupVisible" class="h-100">
                  <loading :loading="loading"></loading>

                  <adv-table-two :tableFields="taskFields" :tableData="localData" :contextItems="contextMenuItems" @context-item-event="contextItemClick" @row-click="openSidebar" @title-click="openSidebar" @update-field="updateTask" :isProject="true" @create-row="createTask" :drag="false"></adv-table-two>
              
              </div>
              <div v-else class="h-100">
                <loading :loading="loading"></loading>                
                <advance-table :tableFields="taskFields" :tableData="localData" :contextItems="contextMenuItems" @context-open="contextOpen"  @context-item-event="contextItemClick" @row-click ="openSidebar" @table-sort="sortBy" @title-click="openSidebar" @update-field="updateTask" @create-row="createTask" sectionTitle="Section" :drag="false"></advance-table>
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
        <!-- confirm delete task -->
        <!-- <confirm-dialog
          v-if="confirmModal"
          :message="confirmMsg"
          @close="confirmDelete"
        ></confirm-dialog> -->
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
import dayjs from "dayjs";
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: "UserTasks",
  data() {
    return {
      title: "UserTasks",
      gridType: "list",
      taskFields: TaskFields,
      taskContextMenu: false,
      beforeLocal:[],
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
      popupMessages: [],
      popupCoords: {},
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
      // confirmModal: false,
      // confirmMsg: "",
      taskToDelete: {},
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
    }),
  },

  watch: {
    localData(newValue, oldValue) {
      this.beforeLocal=oldValue
    },
    "$route.query": {
      immediate: true,
      handler(newVal) {
        this.userfortask = this.teamMembers.find((u) => {
          if (u.email == newVal.email) {
            this.selectedUser = u;
            return u;
          }
        });
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
      this.$nuxt.$on("update-key", async () => {
        await this.fetchUserTasks();
        this.beforeLocal=this.localData
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
      if (!this.$route.query.email) {
        this.$router.push({ path: "/dashboard" });
      }

      _.delay(() => {
        this.userfortask = this.teamMembers.find((u) => {
          if (u.email == this.$route.query.email) {
            this.selectedUser = u;
            return u;
          }
        });
        this.fetchUserTasks();
      }, 5000);
    }
  },

  methods: {
    UserTaskGroup($event) {
      if ($event ==="default" ) {
        this.groupVisible = false;
        this.groupBy = '';
        this.$store.commit('user/flatTasks');
        this.localData=this.userTasks
        return;
      }
      this.groupBy = $event;
      this.groupVisible = true
      this.fetchUserTasks()
     
    },
    async fetchUserTasks() {
      if (process.client) {
        this.loading = true;
        this.$store.dispatch("user/getUserTasks", {
          userId:this.userfortask ? this.userfortask.id : "",
          filter: "all",
          key:this.groupBy
      })
        .then(res=> {
          if (res.data.statusCode == 200) {
            if(this.groupBy!==''){
                this.$store.commit('user/getUserTasks',{data:res.data.data,key:this.groupBy})
                this.localData=this.userTasks
            }
            else {
                 let eachUserTasks = res.data.data;
                let organizedArr = [];
                for (let el of eachUserTasks) {
                  if (el.priorityId) {
                    organizedArr.unshift(el);
                  } else {
                    organizedArr.push(el);
                  }
                }

                let taskArr = organizedArr.sort((a, b) => {
                  if (a.priorityId && b.priorityId) {
                    return a.priorityId - b.priorityId;
                  }
                });
                this.localData = taskArr;
            }
             
              } else {
                console.error(e);
              }
              this.loading = false;
       
        })
   
      }
    },
    contextOpen(item){
      if(this.$CheckFavTask(item.id)){
       this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Add to Favorites" ? { ...item, label: "Remove favorite"} : item);
      }
      else{
        this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Remove favorite" ? { ...item, label: "Add to Favorites"} : item);
      }
      if(item.statusId==5){
       this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Mark Complete" ? { ...item, label: "Completed"} : item);
      }
      else {
         this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Completed" ? { ...item, label: "Mark Complete"} : item);
      }
      this.$store.dispatch("task/setSingleTask", item)
    },
    updateKey($event) {
      if ($event) {
        this.popupMessages.push({ text: $event, variant: "success" });
      }
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store
        .dispatch("company/fetchCompanyTasks", {
          companyId: compid,
          filter: "all",
          sort: this.sortName,
        })
        .then(() => {
          this.key += 1;
        });
      this.fetchUserTasks();
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

    createTask(task) {
      task.departmentId = null;
      task.budget = 0;
      task.dueDate = null;
      task.startDate = null;
      task.sectionId = null;
      task.user = [this.selectedUser];
      task.text = `Created a task ${task.title}`
      delete task.show;
      delete task.userId;
      this.$store.dispatch('task/createTask', task).then(() => {
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
      let data={ [payload.field]: payload.value }
      let before=this.beforeLocal.filter((item)=>item.id===payload.item.id)
    
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
        this.$store
        .dispatch("task/updateTask", {
          id: payload.item.id,
          projectId,
          data: data,
          user,
          text: `changed ${payload.label} to ${
            payload.historyText || payload.value
          }`,
        })
        .then(async (t) => {
          console.log("tt",t)
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
        this.popupMessages.push({
          text: "Action cancelled",
          variant: "orange",
        });
        // this.taskToDelete = {};
      }
      // this.taskToDelete = task;
      // this.confirmMsg = "Are you sure ";
      // this.confirmModal = true;
    },

    async filterView($event) {
      this.loading = true;
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      const res = await this.$axios.get("user/user-tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Filter: $event,
          userid: this.userfortask ? this.userfortask.id : "",
        },
      });
      if (res.data.statusCode == 200) {
        this.tasks = res.data.data;
        this.key += 1;
      } else {
        console.error(e);
      }
      this.viewName = $event;
      this.loading = false;
    },

    // Sort By Action List
    checkActive() {
      for (let i = 0; i < this.taskFields.length; i++) {
        if (this.taskFields[i].header_icon) {
          this.taskFields[i].header_icon.isActive = false;
        }

        if (
          this.taskFields[i].header_icon &&
          this.taskFields[i].key == this.sortName
        ) {
          this.taskFields[i].header_icon.isActive = true;
        }
      }
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
      this.localData=this.userTasks
      this.checkActive();
      this.key += 1;
    },
  

    toggleSidebar($event) {
      if (!$event) {
        this.$nuxt.$emit("open-sidebar", $event);
      }
      this.flag = !this.flag;
    },

    searchUserTasks(text) {
      let formattedText = text.toLowerCase().trim();

      let newArr = this.tasks.filter((t) => {
        if (t.title.includes(formattedText) || t.title.toLowerCase().includes(formattedText)) {
            return t;
        }
      });

      if (newArr.length >= 0) {
        this.localData = newArr;
        this.key++;
      } else {
        this.localData = this.tasks;
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
