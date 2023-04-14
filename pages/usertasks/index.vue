<template>
  <client-only>
    <div id="task-page-wrapper" class="task-page-wrapper">
      <page-title :title="`${selectedUser.firstName} ${selectedUser.lastName}'s Tasks`"></page-title>
      <user-name-task-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:new-task="toggleSidebar($event)" @search-user-tasks="searchUserTasks"></user-name-task-actions>
      <div id="task-table-wrapper" class="task-table-wrapper position-relative of-scroll-y">
        <template v-if="gridType == 'list'">
          <template>
            <drag-table-simple :key="key" :componentKey="key" :titleIcon="{icon:'check-circle', event:'task-icon-click'}" @task-icon-click="taskMarkComplete" :fields="taskFields" :tasks="localData" :sectionTitle="'Department'" :drag="false" v-on:new-task="toggleSidebar($event)" @table-sort="sortBy" @row-context="taskRightClick" @row-click="openSidebar" @status-picker="showStatusPicker" @priority-picker="showPriorityPicker" @dept-picker="showDeptPicker" ></drag-table-simple>
            <!-- table context menu -->
            <table-context-menu :items="contextMenuItems" :show="taskContextMenu" :coordinates="popupCoords" :activeItem="activeTask" @close-context="closeContext" @item-click="contextItemClick"></table-context-menu>
            <!-- status picker for list view -->
            <status-picker :show="statusPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Status', field:'statusId', value: $event.value, historyText: $event.label})" @close="statusPickerOpen = false" ></status-picker>
            <!-- priority picker for list view -->
            <priority-picker :show="priorityPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Priority', field:'priorityId', value: $event.value, historyText: $event.label})" @close="priorityPickerOpen = false" ></priority-picker>
            <!-- department-picker for list view -->
            <dept-picker :show="deptPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Department', field:'departmentId', value: $event.value, historyText: $event.label })" @close="deptPickerOpen = false"></dept-picker>
          </template>
        </template>
        <template v-else>
          <div class="d-flex">
            <div class="task-grid-section">
              <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
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
        </template>
        <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>
        <loading :loading="loading"></loading>
        <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" :autohide="5000">
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>
      </div>
    </div>
  </client-only>
</template>
<script>
import { mapGetters } from "vuex";
import _ from 'lodash'
import { COMPANY_TASK_FIELDS as TaskFields, TASK_CONTEXT_MENU } from '../../config/constants'

export default {
  name: 'UserTasks',
  data() {
    return {
      title: "UserTasks",
      gridType: "list",
      taskFields: TaskFields,
      taskContextMenu: false,
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
      popupMessages: [],
      popupCoords: { },
      /*userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: ""},*/
      activeTask: {},
      contextMenuItems: TASK_CONTEXT_MENU,
      loading: false,
      flag: false,
      viewName: "all",
      orderBy: 'desc',
      key: 100,
      /*popupMessages: [],
      contextCoords: {},*/
      userfortask: "",
      tasks: [],
      taskOrder: 'asc',
      selectedUser: {},
      alertDialog: false,
      alertMsg: "",
      localData: []
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      teamMembers: "user/getTeamMembers",
    }),
  },

  watch: {
    '$route.query': {
      immediate: true,
      handler(newVal) {
        this.userfortask = this.teamMembers.find((u) => {
          if (u.email == newVal.email) {
            this.selectedUser = u
            return u;
          }
        })
        this.fetchUserTasks()
      }
    },

    tasks(newVal) {
        this.localData = _.cloneDeep(newVal)
    },
  },

  created() {
    if (process.client) {

      this.$nuxt.$on("update-key", () => {
        this.fetchUserTasks()
      })
    }
  },

  mounted() {
    if (process.client) {
      if (!this.$route.query.email) {
        this.$router.push({ path: "/dashboard" })
      }

      _.delay(() => {
        this.userfortask = this.teamMembers.find((u) => {
          if (u.email == this.$route.query.email) {
            this.selectedUser = u
            return u;
          }
        })
        this.fetchUserTasks()
      }, 5000);
    }
  },

  methods: {

    async fetchUserTasks() {
      if (process.client) {
        this.loading = true
        const res = await this.$axios.get("user/user-tasks", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Filter': 'all',
            'userid': this.userfortask ? this.userfortask.id : ""
          }
        });

        if (res.data.statusCode == 200) {
          let taskArr = res.data.data.sort((a, b) => {
            if (a.dueDate && b.dueDate) {
              return new Date(b.dueDate) - new Date(a.dueDate)
            }
          });
          this.tasks = taskArr
        } else {
          console.error(e);
        }
        this.loading = false
      }
    },

    updateKey($event) {
      if ($event) {
        this.popupMessages.push({ text: $event, variant: "success" })
      }
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.fetchUserTasks()
    },

    openSidebar(task) {
      this.closeAllPickers()
      this.$nuxt.$emit("open-sidebar", task);
    },

    taskRightClick(payload) {
      this.closeAllPickers()
      this.taskContextMenu = true;
      const { event, task } = payload
      this.activeTask = task;
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
    },
    showStatusPicker(payload){
      this.closeAllPickers()
      this.statusPickerOpen = true
      /*this.userPickerOpen = false
      this.datePickerOpen = false*/
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showPriorityPicker(payload){
      this.closeAllPickers()
      this.priorityPickerOpen = true
      /*this.userPickerOpen = false
      this.datePickerOpen = false*/
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showDeptPicker(payload){
      this.closeAllPickers()
      this.deptPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },

    closeContext() {
      this.taskContextMenu = false
      this.activeTask = {}
    },

    closeAllPickers(){
      this.taskContextMenu = false
      this.statusPickerOpen = false
      this.priorityPickerOpen = false
      this.deptPickerOpen = false
      this.activeTask = {}
      // this.toggleSidebar()
    },

    contextItemClick(key) {

      switch (key) {
        case 'done-task':
          this.taskMarkComplete(this.activeTask)
          break;
        case 'fav-task':
          this.taskSetFavorite(this.activeTask)
          break;
        case 'delete-task':
          this.deleteTask(this.activeTask)
          break;
        case 'assign-task':
          break;
        default:
          // alert("no task assigned")
          this.alertDialog = true
          this.alertMsg = "no task assigned"
          break;
      }
    },

    // task context menu methods ----------------------------------------

    taskSetFavorite(task) {
      this.loading = true
      let isFav = this.favTasks.some((f) => f.taskId == task.id)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => {
            this.updateKey()
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      } else {
        this.$store.dispatch("task/addToFavorite", { id: task.id })
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

    taskMarkComplete(task) {
      this.loading = true
      if (typeof task == "object" && Object.keys(task).length > 0) {} else {
        task = this.activeTask
      }
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          this.loading = false
          this.updateKey()
          this.$store.dispatch("task/setSingleTask", d).then(() => {
            this.key += 1;
          })
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
    },
    updateTask(payload) {
      // console.log(payload)
      let user, projectId
      if (payload.field == "userId" && payload.value != '') {
        user = this.teamMembers.find(t => t.id == payload.value)
      } else {
        user = null
      }

      if (payload.task.project.length > 0) {
        projectId = payload.task.project[0].projectId || payload.task.project[0].project.id
      } else {
        projectId = null
      }

      this.$store.dispatch("task/updateTask", {
        id: payload.task.id,
        projectId,
        data: { [payload.field]: payload.value },
        user,
        text: `changed ${payload.label} to ${payload.historyText || payload.value}`
      })
        .then(t => {
          // console.log(t)
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    deleteTask(task) {
      // let del = confirm("Are you sure")
      this.loading = true
      // if (del) {
        this.$store.dispatch("task/deleteTask", task).then(t => {

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
      // } else {
      //   this.loading = false
      // }
    },

    async filterView($event) {
      this.loading = true
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      const res = await this.$axios.get("user/user-tasks", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Filter': $event,
          'userid': this.userfortask ? this.userfortask.id : ""
        }
      });
      if (res.data.statusCode == 200) {
        this.tasks = res.data.data
        this.key += 1;
      } else {
        console.error(e);
      }
      this.viewName = $event
      this.loading = false
    },

    // Sort By Action List
    checkActive() {
      for(let i=0; i<this.taskFields.length; i++) {
          if(this.taskFields[i].header_icon) {
            this.taskFields[i].header_icon.isActive = false
          }

          if(this.taskFields[i].header_icon && this.taskFields[i].key == this.sortName) {
            this.taskFields[i].header_icon.isActive = true
          } 
      }
    },

    sortBy($event) {

      switch ($event) {
        case 'title':
          if (this.taskOrder == "asc") {
            this.tasks.sort((a, b) => a.title.localeCompare(b.title))
            this.taskOrder = "desc"
          } else {
            this.tasks.sort((a, b) => b.title.localeCompare(a.title))
            this.taskOrder = "asc"
          }
          this.key += 1
          this.sortName = 'title';
          this.checkActive()
          break;

        case 'status':
          if (this.taskOrder == "asc") {
            this.tasks.sort((a, b) => a.status.text.localeCompare(b.status.text));
            this.taskOrder = "desc"

          } else {
            this.tasks.sort((a, b) => b.status.text.localeCompare(a.status.text));
            this.taskOrder = "asc"

          }
          this.key += 1
          this.sortName = 'status';
          this.checkActive()
          break;

        case 'priority':
          if (this.taskOrder == "asc") {
            this.tasks.sort((a, b) => a.priority.id - b.priority.id);
            this.taskOrder = "desc"

          } else {
            this.tasks.sort((a, b) => b.priority.id - a.priority.id);
            this.taskOrder = "asc"

          }
          this.key += 1
          this.sortName = 'priority';
          this.checkActive()
          break;

        case 'department':

          let deptArr = []

          for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].department.title) {
              deptArr.unshift(this.tasks[i])
            } else {
              deptArr.push(this.tasks[i])
            }
          }

          if (this.taskOrder == "asc") {
            deptArr.sort((a, b) => {
              if(a.departmentId && b.departmentId) {
                return a.department.title.localeCompare(b.department.title)
              }
            });
            this.taskOrder = "desc"

          } else {
            deptArr.sort((a, b) => {
              if(a.departmentId && b.departmentId) {
                return b.department.title.localeCompare(a.department.title)
              }
            });
            this.taskOrder = "asc"

          }

          this.tasks = deptArr;
          this.key += 1
          break;

        case 'userId':
          if (this.taskOrder == "asc") {
            this.tasks.sort((a, b) => {
              if (Object.keys(a.user).length > 0 && Object.keys(b.user).length > 0) { return a.user.firstName.localeCompare(b.user.firstName) }
            });
            this.taskOrder = "desc"
          } else {
            this.tasks.sort((a, b) => {
              if (Object.keys(a.user).length > 0 && Object.keys(b.user).length > 0) { return b.user.firstName.localeCompare(a.user.firstName) }
            });
            this.taskOrder = "asc"
          }
          this.key += 1
          this.sortName = 'userId';
          this.checkActive()
          break;

        case 'dueDate':

          let newArr = []

          for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].dueDate) {
              newArr.unshift(this.tasks[i])
            } else {
              newArr.push(this.tasks[i])
            }
          }

          if (this.taskOrder == "asc") {
            newArr.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(a.dueDate) - new Date(b.dueDate) }
            });
            this.taskOrder = "desc"
          } else {
            newArr.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(b.dueDate) - new Date(a.dueDate) }
            });
            this.taskOrder = "asc"
          }

          this.tasks = newArr;
          this.key += 1
          this.sortName = 'dueDate';
          this.checkActive()
          break;

        case 'startDate':

          let newArr2 = []

          for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].startDate) {
              newArr2.unshift(this.tasks[i])
            } else {
              newArr2.push(this.tasks[i])
            }
          }

          if (this.taskOrder == "asc") {
            newArr2.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(a.startDate) - new Date(b.startDate) }
            });
            this.taskOrder = "desc"
          } else {
            newArr2.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(b.startDate) - new Date(a.startDate) }
            });
            this.taskOrder = "asc"
          }

          this.tasks = newArr2;
          this.key += 1
          this.sortName = 'startDate';
          this.checkActive()
          break;

        case "project":
          let newArr3 = []

          for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].project[0]) {
              newArr3.unshift(this.tasks[i])
            } else {
              newArr3.push(this.tasks[i])
            }
          }

          if (this.taskOrder == "asc") {
            newArr3.sort((a, b) => {
              if (a.project[0].length > 0 && b.project[0].length > 0) {
                return a.project[0].project.title.localeCompare(b.project[0].project.title);
              }
            });
            this.taskOrder = "desc"
          } else {
            newArr3.sort((a, b) => {
              if (a.project[0].length > 0 && b.project[0].length > 0) {
                return b.project[0].project.title.localeCompare(a.project[0].project.title);
              }
            });
            this.taskOrder = "asc"
          }

          this.tasks = newArr3;
          this.key += 1
          this.sortName = 'project';
          this.checkActive()
          break;

        default:
          this.fetchUserTasks()
          break;
      }

      this.key += 1

    },

    toggleSidebar($event) {
      if (!$event) {
        this.$nuxt.$emit("open-sidebar", $event)
      }
      this.flag = !this.flag;
    },

    searchUserTasks(text) {

      let formattedText = text.toLowerCase().trim();
      
        let newArr = this.tasks.filter((t) => {
          
          if(t.description) {
            if(t.title.includes(formattedText) || t.title.toLowerCase().includes(formattedText) || t.description.includes(formattedText) || t.description.toLowerCase().includes(formattedText)) {
              return t
            } 
          } else {
            if(t.title.includes(formattedText) || t.title.toLowerCase().includes(formattedText)) {
              return t
            } 
          }

        })

        if(newArr.length >= 0) {
          this.localData = newArr
          this.key++;
        } else {
          this.localData = this.tasks;
          this.key++;
        }
      }
    }

}

</script>
<style lang="scss" scoped>
.task-page-wrapper {
  display: grid;
  grid-template-rows: auto auto calc(100vh - 150px);
  grid-template-columns: 1fr;
}

.section-options {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}

</style>
