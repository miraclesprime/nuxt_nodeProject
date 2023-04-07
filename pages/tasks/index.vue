<template>
  <client-only>
    <div id="task-page-wrapper" class="task-page-wrapper ">
      <page-title title="Tasks"></page-title>
      <company-tasks-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:new-task="toggleSidebar($event)" @change-grid-type="($event)=>gridType = $event" @search-tasks="searchTasks"></company-tasks-actions>
      <div id="task-table-wrapper" class="task-table-wrapper position-relative of-scroll-y" :class="{ 'bg-light': gridType != 'list'}">
        <template v-if="gridType == 'list'">
          <template v-if="tasks.length">
            <drag-table-simple :key="key" :componentKey="key" :fields="taskFields" :tasks="localData" :sectionTitle="'Department'" :titleIcon="{icon:'check-circle-solid', event:'task-icon-click'}" @task-icon-click="taskMarkComplete" :drag="false" v-on:new-task="toggleSidebar($event)" @table-sort="sortBy" @row-context="taskRightClick" @row-click="openSidebar" @edit-field="updateTask" @user-picker="showUserPicker" @date-picker="showDatePicker" ></drag-table-simple>

            <!-- table context menu -->
            <table-context-menu :items="contextMenuItems" :show="taskContextMenu" :coordinates="popupCoords" :activeItem="activeTask" @close-context="closeContext" @item-click="contextItemClick" ></table-context-menu>

          </template>
          <div v-else>
            <span id="projects-0" class="d-inline-flex gap-1 align-center m-1 shape-rounded py-05 px-1">
              <bib-icon icon="warning"></bib-icon> No records found
            </span>
          </div>
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
                <div v-for="(task, index) in localData" :key="index + '-' + key" >
                  <task-grid :task="task" :class="[ currentTask.id == task.id ? 'active' : '']" v-on:update-key="updateKey" @open-sidebar="openSidebar" @date-picker="showDatePicker" @user-picker="showUserPicker" ></task-grid>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- user-picker for board view -->
        <user-picker :show="userPickerOpen" :coordinates="popupCoords" @selected="updateAssignee('Assignee', 'userId', $event.id, $event.label)" @close="userPickerOpen = false"></user-picker>
        
        <!-- date-picker for list and board view -->
        <inline-datepicker :show="datePickerOpen" :datetime="activeTask[datepickerArgs.field]" :coordinates="popupCoords" @date-updated="updateDate" @close="datePickerOpen = false"></inline-datepicker>
        <loading :loading="loading"></loading>
        <!-- popup notification -->
        <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>
        <!-- confirm delete task -->
        <confirm-dialog v-if="confirmModal" :message="confirmMsg" @close="confirmDelete"></confirm-dialog>
        <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>
      </div>
    </div>
  </client-only>
</template>

<script>
import { mapGetters } from "vuex";
import { COMPANY_TASK_FIELDS as TaskFields, TASK_CONTEXT_MENU } from '../../config/constants'
import dayjs from 'dayjs'
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'
import _ from 'lodash'

export default {
  name: 'Tasks',
  data() {
    return {
      title: "Tasks",
      gridType: "list",
      taskFields: TaskFields,
      taskContextMenu: false,
      activeTask: {},
      taskToDelete: {},
      contextMenuItems: TASK_CONTEXT_MENU,
      loading: false,
      flag: false,
      viewName: "all",
      orderBy: 'desc',
      key: 100,
      popupMessages: [],
      popupCoords: { },
      userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: ""},
      confirmModal: false,
      confirmMsg: "",
      alertDialog: false,
      alertMsg: "",
      localData: []
    }
  },
  computed: {
    ...mapGetters({
        user: "user/getUser",
        tasks: "company/getCompanyTasks",
        favTasks: 'task/getFavTasks',
        currentTask: 'task/getSelectedTask',
        teamMembers: "user/getTeamMembers",
    }),

  },

  created() {
    if (process.client) {
      /*this.$nuxt.$on('change-grid-type', (layout) => {
        // console.log(layout)
        this.gridType = layout;
      })*/

      this.$nuxt.$on("update-key", (msg) => {
        let user = JSON.parse(localStorage.getItem("user"))
        this.$store.dispatch('company/setCompanyTasks', { companyId: user.subb }).then(() => { this.key += 1 })
        if (msg) {
          this.popupMessages.push({text: msg, variant: 'success'})
        }
      })
      
      this.loading = true
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'all' }).then((res) => {
        this.loading = false;
      })
    }
  },

  watch: {
    tasks(newVal) {
        this.localData = _.cloneDeep(newVal)
    },
  },

  methods: {
    showUserPicker(payload){
      // console.log('userpicker', payload)
      this.userPickerOpen = true
      this.datePickerOpen = false
      this.taskContextMenu = false
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showDatePicker(payload){
      // console.log('datepicker', payload)
      // payload consists of event, task, label, field
      this.datePickerOpen = true
      this.userPickerOpen = false
      this.taskContextMenu = false
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
      this.datepickerArgs.field = payload.field || 'dueDate'
      this.datepickerArgs.label = payload.label || 'Due date'
    },
    updateKey($event) {
      if ($event) {
        this.popupMessages.push({ text: $event, variant: "success" })
      }
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store.dispatch("company/setCompanyTasks", { companyId: compid, filter: "all" }).then(() => {
        this.key += 1
      })
    },

    openSidebar(task, scroll) {
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false
      }
      this.$nuxt.$emit("open-sidebar", {...task, scrollId: scroll});
    },

    taskRightClick(payload) {
      this.taskContextMenu = true;
      const { event, task } = payload
      this.activeTask = task;
      this.$store.dispatch('task/setSingleTask', task)
      this.popupCoords = { left: event.pageX+'px', top: event.pageY+'px' }
    },

    closeContext() {
      this.taskContextMenu = false
      this.activeTask = {}
    },

    contextItemClick(key){
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
        case 'copy-task':
          this.copyTaskLink(this.activeTask)
          break;
        case 'gotoTeam':
          this.$nuxt.$emit('add-member-to-task')
          break;
        case 'gotoComment':
          this.openSidebar(this.activeTask, 'task_conversation')
          break;
        case 'gotoSubtask':
          this.openSidebar(this.activeTask, 'task_subtasks')
          break;
        case 'gotoFiles':
          this.openSidebar(this.activeTask, 'task_files')
          break;
        default:
          // alert("no task assigned")
          this.alertDialog = true
          this.alertMsg = "No task assigned"
          break;
      }
    },

    updateTask(payload) {
      console.log(payload)
      // alert("in progress. Updated value => " + payload.value)
      let user, projectId
      if (payload.field == "userId" && payload.value != '') {
        user = this.teamMembers.filter(t => t.id == payload.value)
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
        text: `changed ${payload.field} to "${payload.historyText || payload.value}"`
      })
        .then(t => {
          // console.log(t)
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    updateAssignee(label, field, value, historyValue){
      // console.log(...arguments)
      let user
      if (field == "userId" && value != '') {
        user = this.teamMembers.filter(t => t.id == value)
      } else {
        user = null
      }

      this.userPickerOpen = false

      this.$store.dispatch("task/updateTask", {
        id: this.activeTask.id,
        // projectId: this.$route.params.id,
        data: { [field]: value},
        user,
        text: `changed ${label} to ${historyValue}`
      })
        .then(t => {
          // console.log(t)
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    updateDate(value){
      // console.log(...arguments, this.datepickerArgs)
      let newDate = dayjs(value).format("D MMM YYYY")

      this.$store.dispatch("task/updateTask", {
        id: this.activeTask.id,
        // projectId: this.$route.params.id,
        data: { [this.datepickerArgs.field]: value},
        user: null,
        text: `changed ${this.datepickerArgs.label} to ${newDate}`
      })
        .then(t => {
          // console.log(t)
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    taskSetFavorite(task) {
      this.loading = true
      let isFav = this.favTasks.some((f) => f.taskId == task.id)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => {
            this.updateKey('Removed from favorites')
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.warn('fav-task->',e)
          })
      } else {
        this.$store.dispatch("task/addToFavorite", { id: task.id })
          .then(msg => {
            this.updateKey('Added to favorites')
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.warn('fav-task->',e)
          })
      }
    },

    taskMarkComplete(task) {
      // this.loading = true
      if (typeof task == "object" && Object.keys(task).length > 0) {
        console.log(task)
      } else {
        task = this.activeTask
      }
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          // this.loading = false
          this.$store.dispatch("task/setSingleTask", d).then(() => {
            this.updateKey()
          })
        }).catch(e => {
          console.warn(e)
          // this.loading = false
        })
    },
    confirmDelete(state){
      // console.log(state, this.taskToDelete)
      this.confirmModal = false
      this.confirmMsg = ""
      if (state) {
        this.$store.dispatch("task/deleteTask", this.taskToDelete)
        .then(t => {
          // console.log(t)
          if (t.statusCode == 200) {
            this.updateKey(t.message)
            this.taskToDelete = {}
          } else {
            this.popupMessages.push({ text: t.message, variant: "orange" })
            console.warn(t.message);
          }
        })
        .catch(e => {
          console.warn(e)
        })
      } else {
        this.popupMessages.push({ text: "Action cancelled", variant: "orange" })
        this.taskToDelete = {}
      }
    },
    deleteTask(task) {
      // let del = confirm("Are you sure")
      this.taskToDelete = task
      this.confirmMsg = "Are you sure "
      this.confirmModal = true
    },

    filterView($event) {
      this.loading = true
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      if ($event == 'complete') {
        this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'complete' }).then((res) => {
          this.key += 1;
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'complete'
      }
      if ($event == 'incomplete') {
        this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'incomplete' }).then((res) => {
          this.key += 1;
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'incomplete'
      }
      if ($event == 'all') {
        this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'all' }).then((res) => {
          this.key += 1;
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'all'
      }
      this.loading = false

    },

    // Sort By Action List
    sortBy($event) {

      if($event == 'title') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'name', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'userId') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'userId', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'project') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'project', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'status') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'status', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'priority') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'priority', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'startDate') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'startDate', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'dueDate') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'dueDate', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.key += 1

    },


    toggleSidebar($event) {
      if (!$event) {
        this.$nuxt.$emit("open-sidebar", $event)
      }
      this.flag = !this.flag;
    },

    copyTaskLink(task) {
      
        let url = window.location.host + `/tasks/${task.id}`;

        if (navigator.clipboard) { 
          navigator.clipboard.writeText(url);
        } else { 
          unsecuredCopyToClipboard(url);
        }
    },

    searchTasks(text) {
      
      let newArr = this.tasks.filter((t) => {
        if(t.title.includes(text) || t.title.toLowerCase().includes(text) || t.description.includes(text) || t.description.toLowerCase().includes(text)) {
          return t  
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
  },

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
