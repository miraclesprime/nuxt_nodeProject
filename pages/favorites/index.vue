<template>
  <client-only>
    <div id="favorite_wrapper">
      <page-title title="Favorites"></page-title>
      <favorite-actions v-on:change-viewing="changeView" v-on:change-sorting="changeSort" @search-projects-tasks="searchProjectOrTasks"></favorite-actions>
      <div id="favorite-scroll-wrap" class="of-scroll-y position-relative">
        <!-- project table -->
        <drag-table-simple :fields="projectTableFields" :tasks="projLocalData" :titleIcon="{icon:'briefcase'}" :componentKey="key" :drag="false" :sectionTitle="'Favorite Projects'" @row-click="projectRoute" v-on:table-sort="sortProject" @row-context="projectRightClick" @edit-field="renameProject" @user-picker="showProjUserpicker" @date-picker="showProjDatepicker" @status-picker="showProjectStatuspicker" @priority-picker="showProjectPrioritypicker" @dept-picker="showProjDeptPicker" ></drag-table-simple>

        <!-- project context menu -->
        <table-context-menu :items="projectContextItems" :show="projectContextMenu" :coordinates="popupCoords" @close-context="closePopups" @item-click="projContextItemClick" ref="proj_menu"></table-context-menu>
        <!-- user-picker for project -->
        <user-picker :show="projUserpickerOpen" :coordinates="popupCoords" @selected="updateProjAssignee('Assignee', 'userId', $event.id, $event.label)" @close="closePopups"></user-picker>
        <!-- date-picker for project -->
        <inline-datepicker :show="projDatepickerOpen" :datetime="activeProject[datepickerArgs.field]" :coordinates="popupCoords" @date-updated="updateProjDate" @close="closePopups"></inline-datepicker>
        <!-- status picker for project -->
        <status-picker :show="projStatuspickerOpen" :coordinates="popupCoords" @selected="renameProject({ task: activeProject, label:'Status', field:'statusId', value: $event.value, historyText: $event.label})" @close="projStatuspickerOpen = false" ></status-picker>
        <!-- priority picker for list view -->
        <priority-picker :show="projPriorityPickerOpen" :coordinates="popupCoords" @selected="renameProject({ task: activeProject, label:'Priority', field:'priorityId', value: $event.value, historyText: $event.label})" @close="projPriorityPickerOpen = false" ></priority-picker>
        <!-- department-picker for list view -->
        <dept-picker :show="projDeptPickerOpen" :coordinates="popupCoords" @selected="renameProject({ task: activeProject, label:'Department', field:'departmentId', value: $event.value, historyText: $event.label })" @close="projDeptPickerOpen = false"></dept-picker>
        
        <!-- task table -->
        <drag-table-simple :fields="taskTableFields" :componentKey="key+1" :tasks="taskLocalData" :sectionTitle="'Favorite Tasks'" :titleIcon="{icon:'check-circle', event:'task-icon-click'}" @task-icon-click="taskMarkComplete" :drag="false" v-on:new-task="openSidebar" v-on:table-sort="sortTask" @row-click="openSidebar" @row-context="taskRightClick" @edit-field="updateTask" @user-picker="showTaskUserpicker" @date-picker="showTaskDatepicker" @status-picker="showTaskStatusPicker" @priority-picker="showTaskPriorityPicker" @dept-picker="showTaskDeptPicker" ></drag-table-simple>

        <!-- task context menu -->
        <table-context-menu :items="taskContextMenuItems" :show="taskContextMenu" :coordinates="popupCoords" @close-context="closePopups" @item-click="taskContextItemClick" ref="task_menu"></table-context-menu>
        <!-- user-picker for task -->
        <user-picker :show="taskUserpickerOpen" :coordinates="popupCoords" @selected="updateTaskAssignee('Assignee', 'userId', $event.id, $event.label)" @close="closePopups"></user-picker>
        <!-- date-picker for task -->
        <inline-datepicker :show="taskDatepickerOpen" :datetime="activeTask[datepickerArgs.field]" :coordinates="popupCoords" @date-updated="updateTaskDate" @close="closePopups"></inline-datepicker>
        <!-- status picker for task -->
        <status-picker :show="taskStatuspickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeProject, label:'Status', field:'statusId', value: $event.value, historyText: $event.label})" @close="taskStatuspickerOpen = false" ></status-picker>
        <!-- priority picker for task -->
        <priority-picker :show="taskPrioritypickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Priority', field:'priorityId', value: $event.value, historyText: $event.label})" @close="taskPrioritypickerOpen = false" ></priority-picker>
        <!-- department-picker for list view -->
        <dept-picker :show="taskDeptpickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Department', field:'departmentId', value: $event.value, historyText: $event.label })" @close="taskDeptpickerOpen = false"></dept-picker>

        <loading :loading="loading"></loading>
      </div>
      <!-- project rename modal -->
      <bib-modal-wrapper v-if="renameModal" title="Rename project" @close="renameModal = false">
        <template slot="content">
          <div>
            <bib-input type="text" v-model.trim="currentProject.title" placeholder="Enter name..."></bib-input>
            <loading2 :loading="loading2"></loading2>
          </div>
        </template>
        <template slot="footer">
          <div class="d-flex justify-between">
            <bib-button label="Cancel" variant="light" pill @click="renameModal = false"></bib-button>
            <bib-button label="Rename" variant="success" pill v-on:click="renameProject"></bib-button>
          </div>
        </template>
      </bib-modal-wrapper>
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
  </client-only>
</template>

<script>
import _ from 'lodash'
import { PROJECT_FAVORITES, TASK_FAVORITES, PROJECT_CONTEXT_MENU, TASK_CONTEXT_MENU } from '../../config/constants'
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: "Favorites",
  data() {
    return {
      projectTableFields: PROJECT_FAVORITES,
      taskTableFields: TASK_FAVORITES,
      sortedProject: [],
      renameModal: false,
      sortedTask: [],
      activeProject: {},
      currentProject: {},
      activeTask: {},
      taskToDelete: {},
      popupMessages: [],
      key: 0,
      loading: false,
      loading2: false,
      view: 'all',
      projSortName: '',
      taskSortName: '',
      projOrder: 'asc',
      taskOrder: 'asc',
      projectContextMenu: false,
      projectContextItems: PROJECT_CONTEXT_MENU,
      projUserpickerOpen: false,
      projDatepickerOpen: false,
      projStatuspickerOpen: false,
      projPriorityPickerOpen: false,
      projDeptPickerOpen: false,
      popupCoords: {},
      datepickerArgs: { label: null, field: null },
      taskContextMenu: false,
      taskContextMenuItems: TASK_CONTEXT_MENU,
      taskUserpickerOpen: false,
      taskDatepickerOpen: false,
      taskStatuspickerOpen: false,
      taskPrioritypickerOpen: false,
      taskDeptpickerOpen: false,
      confirmModal: false,
      confirmMsg: "",
      alertDialog: false,
      alertMsg:"",
      projLocalData: [],
      taskLocalData: []
    }
  },

  computed: {
    ...mapGetters({
      favProjects: 'project/getFavoriteProjects',
      favTasks: 'task/getFavTasks',
      teamMembers: "user/getTeamMembers",
    })
  },

  created() {
    if (process.client) {
      this.$nuxt.$on("update-key", (msg) => {
        this.$store.dispatch('project/fetchFavProjects').then(() => {
          this.fetchProjects()
        })
        this.$store.dispatch('task/getFavTasks').then(() => {
          this.fetchTasks()
        })
        if (msg) {
          this.popupMessages.push({text: msg, variant: 'success'})
        }
      })

    }
  },

  mounted() {
    this.loading = true
    let user = JSON.parse(localStorage.getItem("user"))
    this.$store.dispatch("company/fetchCompanyMembers", user.subb)
    this.$store.dispatch('project/fetchFavProjects').then(() => {
      this.fetchProjects()
    })
    this.$store.dispatch('task/getFavTasks').then(() => {
      this.fetchTasks()
    })
  },

  watch: {
    favProjects(newVal) {
        let favProj = JSON.parse(JSON.stringify(newVal))
        let sorted = favProj.sort((a, b) => a.projects.title.localeCompare(b.projects.title))
        let sortedArray = []
        sorted.forEach(p => { sortedArray.push(p.projects) })
        this.projLocalData = sortedArray
    },

    favTasks(newVal) {
      let favTask = JSON.parse(JSON.stringify(newVal))
      let sorted = favTask.sort((a, b) => a.task.title.localeCompare(b.task.title))
      let sortedArray = []
      sorted.forEach(t => { sortedArray.push(t.task) })
      this.taskLocalData = sortedArray
    }
  },

  methods: {

    async fetchProjects() {
      let favProj = await JSON.parse(JSON.stringify(this.favProjects))
      let sorted = await favProj.sort((a, b) => a.projects.title.localeCompare(b.projects.title))
      let sortedArray = []
      sorted.forEach(p => { sortedArray.push(p.projects) })
      this.sortedProject = sortedArray
      this.key += 1
      this.loading = false
    },

    async fetchTasks() {
      let favTask = await JSON.parse(JSON.stringify(this.favTasks))
      let sorted = await favTask.sort((a, b) => a.task.title.localeCompare(b.task.title))
      let sortedArray = []
      sorted.forEach(t => { sortedArray.push(t.task) })
      this.sortedTask = sortedArray
      this.key += 1
      this.loading = false
    },

    projectRoute(project) {
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        // this.$nuxt.$emit("close-sidebar");
        return false
      }
      this.$router.push('/projects/' + project.id)
    },

    projectRightClick(payload) {
      this.projectContextMenu = true

      const { event, task } = payload
      this.activeProject = task;
      this.currentProject = _.cloneDeep(task);
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
    },

    taskRightClick(payload) {
      this.taskContextMenu = true
      const { event, task } = payload
      this.activeTask = task;
      this.$store.dispatch('task/setSingleTask', task)
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
    },

    showProjUserpicker(payload) {
      // console.log(payload)
      // payload consists of event, task
      this.closePopups()
      this.projUserpickerOpen = true
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.activeProject = payload.task
    },
    showProjDatepicker(payload) {
      // console.log(payload)
      // payload consists of event, task, label, field
      this.closePopups()
      this.projDatepickerOpen = true
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.activeProject = payload.task
      this.datepickerArgs.field = payload.field || 'dueDate'
      this.datepickerArgs.label = payload.label || 'Due date'
    },
    showProjectStatuspicker(payload){
      this.closePopups()
      this.projStatuspickerOpen = true
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.activeProject = payload.task
    },
    showProjectPrioritypicker(payload){
      this.closePopups()
      this.projPriorityPickerOpen = true
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.activeProject = payload.task
    },
    showProjDeptPicker(payload){
      this.closePopups()
      this.projDeptPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeProject = payload.task
    },

    showTaskUserpicker(payload) {
      // console.log(payload)
      this.closePopups()
      this.taskUserpickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showTaskDatepicker(payload) {
      // console.log(payload)
      // payload consists of event, task, label, field
      this.closePopups()
      this.taskDatepickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
      this.datepickerArgs.field = payload.field || 'dueDate'
      this.datepickerArgs.label = payload.label || 'Due date'
    },
    showTaskStatusPicker(payload){
      this.closePopups()
      this.taskStatuspickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showTaskPriorityPicker(payload){
      this.closePopups()
      this.taskPrioritypickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showTaskDeptPicker(payload){
      this.closePopups()
      this.taskDeptpickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },

    closePopups() {
      // project
      this.projectContextMenu = false
      this.projUserpickerOpen = false
      this.projDatepickerOpen = false
      this.projStatuspickerOpen = false
      this.projPriorityPickerOpen = false
      this.projDeptPickerOpen = false
      // task
      this.taskContextMenu = false
      this.taskUserpickerOpen = false
      this.taskDatepickerOpen = false
      this.taskStatuspickerOpen = false
      this.taskPrioritypickerOpen = false
      this.taskDeptpickerOpen = false

      this.activeProject = {}
      this.activeTask = {}
      this.datepickerArgs = { label: null, field: null }
    },

    changeView($event) {
      if ($event == 'complete') {
        this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.taskLocalData = JSON.parse(JSON.stringify(this.sortedTask));
        this.fetchProjects().then(() => {
          let com = this.projLocalData.filter(p => p.statusId == 5)
          this.projLocalData = com
        })
        this.fetchTasks().then(() => {
          let com = this.taskLocalData.filter(t => t.statusId == 5)
          this.taskLocalData = com
        })

      }

      if ($event == 'incomplete') {
        this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.taskLocalData = JSON.parse(JSON.stringify(this.sortedTask));
        this.fetchProjects().then(() => {
          let com = this.projLocalData.filter(p => p.statusId != 5)
          this.projLocalData = com
        })
        this.fetchTasks().then(() => {
          let com = this.taskLocalData.filter(t => t.statusId != 5)
          this.taskLocalData = com
        })
      }

      if ($event == 'all') {
        this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.taskLocalData = JSON.parse(JSON.stringify(this.sortedTask));
      }

    },
    changeSort($event) {
      if (this.projOrder == this.taskOrder) {
        this.sortProject($event)
        this.sortTask($event)
      } else {
        this.projOrder = 'asc'
        this.taskOrder = 'asc'
        this.sortProject($event)
        this.sortTask($event)
      }

    },

    checkActive() {
      for(let i=0; i<this.projectTableFields.length; i++) {
          if(this.projectTableFields[i].header_icon) {
            this.projectTableFields[i].header_icon.isActive = false
          }

          if(this.projectTableFields[i].header_icon && this.projectTableFields[i].key == this.projSortName) {
            this.projectTableFields[i].header_icon.isActive = true
          } 
      }
      for(let i=0; i<this.taskTableFields.length; i++) {
          if(this.taskTableFields[i].header_icon) {
            this.taskTableFields[i].header_icon.isActive = false
          }

          if(this.taskTableFields[i].header_icon && this.taskTableFields[i].key == this.taskSortName) {
            this.taskTableFields[i].header_icon.isActive = true
          } 
      }
    },

    sortProject(field) {

      switch (field) {

        case 'title':
          if (this.projOrder == "asc") {
            this.projLocalData.sort((a, b) => a.title.localeCompare(b.title))
            this.projOrder = "desc"
          } else {
            this.projLocalData.sort((a, b) => b.title.localeCompare(a.title))
            this.projOrder = "asc"
          }
          this.key += 1
          this.projSortName = 'title'
          this.checkActive()
          break;

        case 'status':
          let sArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].statusId) {
              sArr.unshift(this.projLocalData[i])
            } else {
              sArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = sArr;

          if (this.projOrder == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.status && b.status) { return a.status.text.localeCompare(b.status.text) }
            });
            this.projOrder = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.status && b.status) { return b.status.text.localeCompare(a.status.text) }
            });
            this.projOrder = "asc"
          }

          this.key += 1
          this.projSortName = 'status'
          this.checkActive()
          break;

        case 'priority':
          let pArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].priorityId) {
              pArr.unshift(this.projLocalData[i])
            } else {
              pArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = pArr;

          if (this.projOrder == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.priority && b.priority) { return a.priority.id - b.priority.id }
            });
            this.projOrder = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.priority && b.priority) { return b.priority.id - a.priority.id }
            });
            this.projOrder = "asc"
          }
          this.key += 1
          this.projSortName = 'priority'
          this.checkActive()
          break;

        case 'department':
          let deptArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].departmentId) {
              deptArr.unshift(this.projLocalData[i])
            } else {
              deptArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = deptArr;

          if (this.projOrder == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.departmentId && b.departmentId) { return a.department.title.localeCompare(b.department.title) }
            });
            this.projOrder = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.departmentId && b.departmentId) { return b.department.title.localeCompare(a.department.title) }
            });
            this.projOrder = "asc"
          }
          this.key += 1
          this.projSortName = 'department'
          this.checkActive()
          break;

        case 'userId':
          let uArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].userId) {
              uArr.unshift(this.projLocalData[i])
            } else {
              uArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = uArr;

          if (this.projOrder == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.user && b.user) { return a.user.firstName.localeCompare(b.user.firstName) }
            });
            this.projOrder = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.user && b.user) { b.user.firstName.localeCompare(a.user.firstName) }
            });
            this.projOrder = "asc"
          }
          this.key += 1
          this.projSortName = 'userId'
          this.checkActive()
          break;

        case 'dueDate':
          let dArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].dueDate) {
              dArr.unshift(this.projLocalData[i])
            } else {
              dArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = dArr;
          if (this.projOrder == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(a.dueDate) - new Date(b.dueDate) }
            });
            this.projOrder = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(b.dueDate) - new Date(a.dueDate) }
            });
            this.projOrder = "asc"
          }
          this.key += 1
          this.projSortName = 'dueDate'
          this.checkActive()
          break;

        case 'startDate':
          let dArr2 = []

          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].startDate) {
              dArr2.unshift(this.projLocalData[i])
            } else {
              dArr2.push(this.projLocalData[i])
            }
          }

          this.projLocalData = dArr2;
          if (this.projOrder == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(a.startDate) - new Date(b.startDate) }
            });
            this.projOrder = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(b.startDate) - new Date(a.startDate) }
            });
            this.projOrder = "asc"
          }
          this.key += 1
          this.projSortName = 'startDate'
          this.checkActive()
          break;

        default:
          this.fetchProjects()
          break;
      }
    },

    async sortTask(field) {

      switch (field) {

        case 'title':
          if (this.taskOrder == "asc") {
            this.taskLocalData.sort((a, b) => a.title.localeCompare(b.title))
            this.taskOrder = "desc"
          } else {
            this.taskLocalData.sort((a, b) => b.title.localeCompare(a.title))
            this.taskOrder = "asc"
          }
          this.key += 1
          this.taskSortName = 'title'
          this.checkActive()
          break;

        case 'status':
          let taskStArr = []
          for (let i = 0; i < this.taskLocalData.length; i++) {
            if (this.taskLocalData[i].statusId) {
              taskStArr.unshift(this.taskLocalData[i])
            } else {
              taskStArr.push(this.taskLocalData[i])
            }
          }

          this.taskLocalData = taskStArr;

          if (this.taskOrder == "asc") {
            this.taskLocalData.sort((a, b) => a.status.text.localeCompare(b.status.text));
            this.taskOrder = "desc"
          } else {
            this.taskLocalData.sort((a, b) => b.status.text.localeCompare(a.status.text));
            this.taskOrder = "asc"
          }
          this.key += 1
          this.taskSortName = 'status'
          this.checkActive()
          break;

        case 'priority':
          let taskPrArr = []
          for (let i = 0; i < this.taskLocalData.length; i++) {
            if (this.taskLocalData[i].priorityId) {
              taskPrArr.unshift(this.taskLocalData[i])
            } else {
              taskPrArr.push(this.taskLocalData[i])
            }
          }

          this.taskLocalData = taskPrArr;

          if (this.taskOrder == "asc") {
            this.taskLocalData.sort((a, b) => a.priority.id - b.priority.id);
            this.taskOrder = "desc"
          } else {
            this.taskLocalData.sort((a, b) => b.priority.id - a.priority.id);
            this.taskOrder = "asc"
          }
          this.key += 1
          this.taskSortName = 'priority'
          this.checkActive()
          break;
        
        case 'department':
          let taskDeptArr = []
          for (let i = 0; i < this.taskLocalData.length; i++) {
            if (this.taskLocalData[i].departmentId) {
              taskDeptArr.unshift(this.taskLocalData[i])
            } else {
              taskDeptArr.push(this.taskLocalData[i])
            }
          }

          this.taskLocalData = taskDeptArr;

          if (this.taskOrder == "asc") {
            this.taskLocalData.sort((a, b) => a.department.title.localeCompare(b.department.title));
            this.taskOrder = "desc"
          } else {
            this.taskLocalData.sort((a, b) => b.department.title.localeCompare(a.department.title));
            this.taskOrder = "asc"
          }
          this.key += 1
          break;

        case 'userId':
          let taskUserArr = []
          for (let i = 0; i < this.taskLocalData.length; i++) {
            if (this.taskLocalData[i].userId) {
              taskUserArr.unshift(this.taskLocalData[i])
            } else {
              taskUserArr.push(this.taskLocalData[i])
            }
          }

          this.taskLocalData = taskUserArr;

          if (this.taskOrder == "asc") {
            this.taskLocalData.sort((a, b) => {
              if (a.user && b.user) { return a.user.firstName.localeCompare(b.user.firstName) }
            });
            this.taskOrder = "desc"
          } else {
            this.taskLocalData.sort((a, b) => {
              if (a.user && b.user) { return b.user.firstName.localeCompare(a.user.firstName) }
            });
            this.taskOrder = "asc"
          }
          this.key += 1
          this.taskSortName = 'userId'
          this.checkActive()
          break;

        case 'dueDate':
          let taskDArr = []
          for (let i = 0; i < this.taskLocalData.length; i++) {
            if (this.taskLocalData[i].dueDate) {
              taskDArr.unshift(this.taskLocalData[i])
            } else {
              taskDArr.push(this.taskLocalData[i])
            }
          }

          this.taskLocalData = taskDArr;
          if (this.taskOrder == "asc") {
            this.taskLocalData.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(a.dueDate) - new Date(b.dueDate) }
            });
            this.taskOrder = "desc"
          } else {
            this.taskLocalData.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(b.dueDate) - new Date(a.dueDate) }
            });
            this.taskOrder = "asc"
          }
          this.key += 1
          this.taskSortName = 'dueDate'
          this.checkActive()
          break;

        case 'startDate':
          let taskSArr = []
          for (let i = 0; i < this.taskLocalData.length; i++) {
            if (this.taskLocalData[i].startDate) {
              taskSArr.unshift(this.taskLocalData[i])
            } else {
              taskSArr.push(this.taskLocalData[i])
            }
          }

          this.taskLocalData = taskSArr;
          if (this.taskOrder == "asc") {
            this.taskLocalData.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(a.startDate) - new Date(b.startDate) }
            });
            this.taskOrder = "desc"
          } else {
            this.taskLocalData.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(b.startDate) - new Date(a.startDate) }
            });
            this.taskOrder = "asc"
          }
          this.key += 1
          this.taskSortName = 'startDate'
          this.checkActive()
          break;

        case "project":
          let newArr = []
          for (let i = 0; i < this.taskLocalData.length; i++) {
            if (this.taskLocalData[i].project[0]) {
              newArr.unshift(this.taskLocalData[i])
            } else {
              newArr.push(this.taskLocalData[i])
            }
          }

          newArr.sort((a, b) => {
            if (a.project[0] && b.project[0]) {
              return a.project[0].project.title.localeCompare(b.project[0].project.title);
            }
          });
          this.taskLocalData = newArr;
          this.key += 1
          this.taskSortName = 'project'
          this.checkActive()
          break;

        default:
          this.fetchTasks()
          break;
      }
      this.key += 1
    },


    projContextItemClick(key) {
      switch (key) {
        case 'fav-project':
          this.projSetFavorite(this.activeProject)
          break;
        case 'rename-project':
          this.renameModal = true
          break;
        case 'delete-project':
          this.projDelete(this.activeProject)
          break;
        case 'copy-project':
          this.copyProjectLink(this.activeProject)
          break;
        case 'share-project':
          break;
        case 'report-project':
          break;
        default:
          this.alertDialog = true
          this.alertMsg = "no project assigned"
          break;
      }
    },

    taskContextItemClick(key) {
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
          this.alertMsg = "no task assigned"
          break;
      }
    },

    // project context menu methods ------------------------

    projSetFavorite(project) {
      this.loading = true
      let isFav = this.favProjects.some((f) => f.projects.id == project.id)

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

    projDelete(project) {
      let del = confirm("Are you sure")
      this.loading = true
      if (del) {
        this.$store.dispatch("project/deleteProject", project).then(t => {

          if (t.statusCode == 200) {
            this.updateKey(t.message)
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

    renameProject(payload) {
      // console.info(payload)
      // payload consists of task(row), field, value

      this.loading2 = true
      this.$store.dispatch("project/updateProject", {
        id: this.currentProject.id || payload.task.id,
        data: { [payload.field]: this.currentProject.title || payload.value },
        user: this.currentProject.user || payload.task.user,
        text: `changed ${payload.label} to ${payload.historyText || payload.value}`
      }).then(res => {
        // console.log(res)
        if (res.statusCode == 200) {
          this.$store.dispatch("project/setSingleProject", res.data)
          this.updateKey()
          this.renameModal = false
        }
        this.currentProject = {}
        this.loading2 = false
      }).catch(e => console.warn(e))
    },

    copyProjectLink(proj) {
      
      let url = window.location.host + `/projects/${proj.id}`;
      
      if (navigator.clipboard) { 
        navigator.clipboard.writeText(url);
      } else { 
        unsecuredCopyToClipboard(url);
      }
    },

    copyTaskLink(task) {
      
        let url = window.location.host + `/tasks/${task.id}`;
       
        if (navigator.clipboard) { 
          navigator.clipboard.writeText(url);
        } else { 
          unsecuredCopyToClipboard(url);
        }
    },

    updateTask(payload) {
      const { task, label, field, value, historyText} = payload
      // console.log(task, label, field, value, historyText, this.activeTask)
      // payload consists of task, field, value

      let user
      if (field == "userId" && value != '') {
        user = this.teamMembers.filter(t => t.id == value)
      } else {
        user = null
      }

      let projectId = null
      if (this.activeTask.project.length > 0) {
        projectId = this.activeTask.project[0].projectId
      } /*else {
        projectId = this.activeTask.project[0].projectId
      }*/

      let taskId
      if (task?.id) {
        taskId = task.id
      } else {
        taskId = this.activeTask.id
      }

      this.$store.dispatch("task/updateTask", {
          id: taskId,
          projectId,
          data: {[field]: value},
          user,
          text: `changed ${label} to ${historyText || value}`
        }).then(t => {
          this.updateKey()
        }).catch(e => console.warn(e))
    },

    updateProjAssignee(label, field, value, historyValue) {
      this.$store.dispatch("project/updateProject", {
        id: this.activeProject.id,
        data: {
          [field]: value
        },
        user: this.activeProject.user,
        text: `changed ${label} to ${historyValue}`
      }).then(res => {
        console.log(res)
        if (res.statusCode == 200) {
          this.$store.dispatch("project/setSingleProject", res.data)
          this.updateKey()
        }
        this.currentProject = {}
      }).catch(e => console.warn(e))
    },

    updateTaskAssignee(label, field, value, historyValue) {
      let user
      if (field == "userId" && value != '') {
        user = this.teamMembers.filter(t => t.id == value)
      } else {
        user = null
      }

      this.taskUserpickerOpen = false

      this.$store.dispatch("task/updateTask", {
          id: this.activeTask.id,
          data: {
            [field]: value
          },
          user,
          text: `changed ${label} to ${historyValue}`
        })
        .then(t => {
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    updateProjDate(value) {
      let newDate = dayjs(value).format("D MMM YYYY")

      this.$store.dispatch("project/updateProject", {
          id: this.activeProject.id,
          data: {
            [this.datepickerArgs.field]: value
          },
          user: this.activeProject.user,
          text: `changed ${this.datepickerArgs.label} to ${newDate}`
        })
        .then(t => {
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    updateTaskDate(value) {

      let newDate = dayjs(value).format("D MMM YYYY")

      this.$store.dispatch("task/updateTask", {
          id: this.activeTask.id,
          data: {
            [this.datepickerArgs.field]: value
          },
          user: null,
          text: `changed ${this.datepickerArgs.label} to ${newDate}`
        })
        .then(t => {
          this.updateKey()
        })
        .catch(e => console.warn(e))
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
      console.log(typeof task, this.activeTask)
      this.loading = true
      if (typeof task == "object" && Object.keys(task).length > 0) {
        console.log(task)
      } else {
        task = this.activeTask
      }
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          this.loading = false
          this.updateKey()
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
    },
    confirmDelete(state){
      console.log(state, this.taskToDelete)
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

    updateKey($event) {
      if ($event) {
        this.popupMessages.push({ text: $event, variant: "success" })
      }
      this.$store.dispatch('project/fetchFavProjects').then(() => {
        this.fetchProjects()
      })

      this.$store.dispatch('task/getFavTasks').then(() => {
        this.fetchTasks()
      })
    },

    // task context menu methods ------------------------------------------
    openSidebar(task, scroll) {
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false
      }
      this.$nuxt.$emit("open-sidebar", { ...task, scrollId: scroll });
    },

    searchProjectOrTasks(text) {

      let formattedText = text.toLowerCase().trim();
      
      let tArr = this.sortedTask.filter((t) => {
        
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

      let pArr = this.sortedProject.filter((p) => {
       
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

      if(pArr.length >= 0) {
        this.projLocalData = pArr
        this.key++;
      } else {
        this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.key++;
      }

      if(tArr.length >= 0) {
        this.taskLocalData = tArr
        this.key++;
      } else {
        this.taskLocalData = this.sortedTask;
        this.key++;
      }
    }

  }
}

</script>
<style lang="scss" scoped>
#favorite-scroll-wrap {
  max-height: calc(100vh - 160px);
}

</style>
