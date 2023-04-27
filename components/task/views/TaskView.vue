<template>
  <div id="task-view-wrapper" class="task-view-wrapper position-relative">
    <task-actions :gridType="gridType" v-on:create-task="toggleSidebar($event)" v-on:show-newsection="showNewsection" v-on:filterView="filterView" v-on:sort="taskSort($event)" @group="taskGroup($event)" @search-projectTasks="searchTasks"></task-actions>
    <new-section-form :showNewsection="newSection" :showLoading="sectionLoading" :showError="sectionError" v-on:toggle-newsection="newSection = $event" v-on:create-section="createSection"></new-section-form>

    <template v-if="gridType === 'list'">
      <!-- task list table -->
      <drag-table :fields="tableFields" :sections="localdata" :titleIcon="{icon:'check-circle-solid', event:'task-icon-click'}" :key="templateKey" :componentKey="templateKey" @row-click="openSidebar" @row-rightclick="taskRightClick" @task-icon-click="markComplete" @new-task="toggleSidebar($event)" @table-sort="taskSort($event)" @section-dragend="sectionDragEnd" @task-dragend="taskDragEnd" :newTaskButton="newTaskButton" :newRow="newRow" @create-newrow="createNewTask" @hide-newrow="resetNewRow" @edit-field="updateTask" @edit-section="renameSection" @user-picker="showUserPicker" @date-picker="showDatePicker" @status-picker="showStatusPicker" @priority-picker="showPriorityPicker" @dept-picker="showDeptPicker" ></drag-table>
      <!-- table context menu -->
      <table-context-menu :items="taskContextMenuItems" :show="taskContextMenu" :coordinates="popupCoords" :activeItem="activeTask" @close-context="closeContext" ref="task_menu" @item-click="contextItemClick"></table-context-menu>
    </template>

    <template v-else>
      <task-grid-section :sections="localdata" :activeTask="activeTask" :templateKey="templateKey" @create-section="createSection" @section-rename="renameSectionModal" @section-delete="deleteSection" v-on:update-key="updateKey" v-on:create-task="toggleSidebar($event)" v-on:set-favorite="setFavorite" v-on:mark-complete="markComplete" v-on:delete-task="deleteTask" @section-dragend="sectionDragEnd" @task-dragend="taskDragEnd" sectionType='singleProject'>
      </task-grid-section>
    </template>

    <!-- user-picker for list and board view -->
    <user-picker :show="userPickerOpen" :coordinates="popupCoords" @selected="updateAssignee('Assignee', 'userId', $event.id, $event.label)" @close="userPickerOpen = false"></user-picker>

    <!-- date-picker for list and board view -->
    <inline-datepicker :show="datePickerOpen" :datetime="activeTask[datepickerArgs.field]" :coordinates="popupCoords" @date-updated="updateDate" @close="datePickerOpen = false"></inline-datepicker>

    <!-- status picker for list view -->
    <status-picker :show="statusPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Status', field:'statusId', value: $event.value, historyText: $event.label})" @close="statusPickerOpen = false" ></status-picker>

    <!-- priority picker for list view -->
    <priority-picker :show="priorityPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Priority', field:'priorityId', value: $event.value, historyText: $event.label})" @close="priorityPickerOpen = false" ></priority-picker>
    <!-- department-picker for list view -->
    <dept-picker :show="deptPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Department', field:'departmentId', value: $event.value, historyText: $event.label })" @close="deptPickerOpen = false"></dept-picker>
    
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

    <!-- section rename modal -->
    <bib-modal-wrapper v-if="renameModal" title="Rename section" @close="renameModal = false">
      <template slot="content">
        <div>
          <bib-input type="text" v-model.trim="sectionTitle" placeholder="Enter name..."></bib-input>
          <loading :loading="loading"></loading>
        </div>
      </template>
      <template slot="footer">
        <div class="d-flex justify-between">
          <bib-button label="Cancel" variant="light" pill @click="renameModal = false"></bib-button>
          <bib-button label="Rename" variant="success" pill v-on:click="renameSection"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
</template>

<script>
import { TASK_FIELDS, TASK_CONTEXT_MENU } from "config/constants";
import { mapGetters } from 'vuex';
import _ from 'lodash'
import dayjs from 'dayjs'
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {

  props: {
    gridType: String, // project ID page 
  },
  data() {
    return {
      tableFields: TASK_FIELDS,
      taskContextMenuItems: TASK_CONTEXT_MENU,
      taskContextMenu: false,
      userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: ""},
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
      popupCoords: {},
      popupMessages: [],
      activeTask: {},
      taskToDelete: {},
      headless: null,
      flag: false,
      newSection: false,
      newSectionName: "",
      sectionLoading: false,
      sectionError: "",
      localdata: [],
      sortName: "",
      loading: false,
      templateKey: 0,
      orderBy: "asc",
      renameModal: false,
      confirmModal: false,
      confirmMsg: "",
      alertDialog: false,
      alertMsg:"",
      sectionId: null,
      sectionTitle: "",
      newTaskButton: {
        show: true,
        label: "New Task",
        icon: "add",
      },
      newRow: {
        id: "",
        sectionId: "",
        title: "",
        userId: "",
        statusId: 1,
        priorityId: 3,
        startDate: "",
        dueDate: "",
        department: "",
        description: "",
        budget: "",
        text: "",
      }
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      teamMembers: "user/getTeamMembers",
      task: "task/getSelectedTask",
      favTasks: "task/getFavTasks",
      project: "project/getSingleProject",
      sections: "section/getProjectSections",
    }),

  },

  watch: {
    sections(newVal) {
        this.localdata = _.cloneDeep(newVal)
    },
  },

  created() {

    this.$nuxt.$on("update-key", () => {
      // console.log('update key event capture')
      this.updateKey()
    })
    this.$nuxt.$on("user-picker", (payload) => {
      // emitted from <task-grid>
      this.showUserPicker(payload)
    })
    this.$nuxt.$on("date-picker", (payload) => {
      // emitted from <task-grid>
      this.showDatePicker(payload)
    })
  },

  mounted() {
    this.loading = true
    this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' }).then((res) => {

      this.localdata = JSON.parse(JSON.stringify(this.sections))

      let sorted = this.localdata.map(s => {
        let t = s.tasks.sort((a, b) => a.order - b.order)
        s.tasks = t
        return s
      })
      // console.log("sorted =>", sorted)
      this.localdata = sorted
      this.templateKey += 1
      this.loading = false
    }).catch(e => console.log(e))

  },

  methods: {
    taskByOrder() {
      this.localdata = JSON.parse(JSON.stringify(this.sections))

      let sorted = this.localdata.map(s => {
        let t = s.tasks.sort((a, b) => a.order - b.order)
        s.tasks = t
        return s
      })
      // console.log("sorted =>", sorted)
      this.localdata = sorted
      this.templateKey += 1
      // this.$nuxt.$emit("update-key", this.key)
    },
    taskRightClick(payload) {
      this.projectContextMenu = false
      this.taskContextMenu = true
      this.userPickerOpen = false
      this.datePickerOpen = false
      const { event, task } = payload

      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.activeTask = task
      // console.log(task)
    },
    closeContext() {
      this.taskContextMenu = false
      this.activeTask = {}
    },
    contextItemClick(key) {
      // console.log(key)
      switch (key) {
        case 'done-task':
          // statements_1
          this.markComplete(this.activeTask)
          break;
        case 'fav-task':
          this.setFavorite(this.activeTask)
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
        case 'assign-task':
          // statements_1
          break;
        default:
          // alert("no task assigned")
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
      this.activeTask = payload.task
    },
    showDatePicker(payload){
      // console.log(payload)
      // payload consists of event, task, label, field
      this.closeAllPickers()
      this.datePickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
      this.datepickerArgs.field = payload.field || 'dueDate'
      this.datepickerArgs.label = payload.label || 'Due date'
    },
    showStatusPicker(payload){
      this.closeAllPickers()
      this.statusPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showPriorityPicker(payload){
      this.closeAllPickers()
      this.priorityPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showDeptPicker(payload){
      this.closeAllPickers()
      this.deptPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    closeAllPickers(){
      this.taskContextMenu = false
      this.userPickerOpen = false
      this.datePickerOpen = false
      this.statusPickerOpen = false
      this.priorityPickerOpen = false
      this.deptPickerOpen = false
      this.activeTask = {}
      // this.toggleSidebar()
    },

    taskSort($event) {
      // sort by title
      // console.log('sort key->', $event, 'sort-order->', this.orderBy)
      if ($event == "title") {
        // var orderBy = "asc"
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec, index) {
            sec["tasks"] = sec.tasks.sort((a, b) => a.title.localeCompare(b.title))
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec, index) {
            sec["tasks"] = sec.tasks.sort((a, b) => b.title.localeCompare(a.title))
          })
        }
        this.sortName = 'title'
        this.checkActive()
        // this.templateKey += 1
        // console.log(this.key, this.orderBy)
      }
      // Sort By owner
      if ($event == "userId") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          /*this.localdata.forEach(function(sec, index) {
            sec["tasks"] = sec.tasks.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
          })*/
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.user && b.user) {
                return a.user.firstName.localeCompare(b.user.firstName)
              }
            });
          })
        } else {
          this.orderBy = "asc"
          /*this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
          })*/
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.user && b.user) {
                return b.user.firstName.localeCompare(a.user.firstName)
              }
            });
          })
        }
        this.sortName = 'userId'
        this.checkActive()
        // this.templateKey += 1
        // console.log(this.key, this.orderBy)
      }
      // sort By Status
      if ($event == "status") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => a.status.text.localeCompare(b.status.text));
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => b.status.text.localeCompare(a.status.text));
          })
        }
        this.sortName = 'status'
        this.checkActive()
        // this.templateKey += 1
        // console.log(this.key, this.orderBy)
      }
      // Sort By Priotity
      if ($event == "priority") {
        // console.log('sort priority',$event)
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => a.priority.id - b.priority.id);
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => b.priority.id - a.priority.id);
          })
        }
        this.sortName = 'priority'
        this.checkActive()
        // this.templateKey += 1
      }

      // Sort By Department
      if ($event == "department") {

        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.departmentId && b.departmentId) {
                return a.department.title.localeCompare(b.department.title)
              }
            });
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.departmentId && b.departmentId) {
                return b.department.title.localeCompare(a.department.title)
              }
            });
          })
        }
        // this.templateKey += 1
        this.sortName = 'department'
        this.checkActive()
      }

      // sort By Start Date
      if ($event == "startDate") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          })

        }
        this.sortName = 'startDate'
        this.checkActive()
        // this.templateKey += 1
      }

      // sort By DueDate
      if ($event == "dueDate") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
          })
        }
        this.sortName = 'dueDate'
        this.checkActive()
        // this.templateKey += 1
      }

      this.templateKey += 1

    },
    taskGroup($event) {
      console.log($event)
    },
    updateKey() {
      // console.log("update-key event received", this.templateKey)
      this.userPickerOpen = false
      this.taskContextMenu = false
      this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' }).then(() => {
        this.taskByOrder()
      })
    },

    toggleSidebar($event) {
      // console.log("taskview => ",$event)

      this.flag = !this.flag;
      // this.$emit("open-sidebar", $event);
      if ($event.id) {
        this.$nuxt.$emit("open-sidebar", $event.id)
      } else {
        this.$nuxt.$emit("open-sidebar", $event);
      }
    },
    openSidebar(task) {
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false
      }

      let project = [{
        projectId: this.project.id,
        project: {
          id: this.project.id
        }
      }]
      this.$nuxt.$emit("open-sidebar", { ...task, project: project });
    },

    createNewTask(payload) {
      // this.loading = true
      this.$store.dispatch("task/createTask", { ...payload, projectId: this.$route.params.id, text: `task "${payload.title}" created` })
        .then(t => {          
          // this.loading = false
          this.resetNewRow()
          this.updateKey()
        })
        .catch(e => {
          console.warn(e)
          // this.loading = false
        })
    },

    resetNewRow() {
      this.newRow = {
        id: "",
        sectionId: "",
        title: "",
        userId: "",
        statusId: 1,
        priorityId: 3,
        startDate: "",
        dueDate: "",
        department: "",
        description: "",
        budget: "",
        text: "",
      }
      this.userPickerOpen = false
    },

    showNewsection() {
      this.$nextTick(() => {
        this.newSection = true
      })
    },

    async createSection($event) {
      this.sectionLoading = true
      const res = await this.$store.dispatch("section/createSection", {
        "projectId": this.project.id,
        "title": $event,
        "isDeleted": false,
        "text": `section '${$event}' created`,
      })
      if (res.statusCode == 200) {
        this.updateKey()
        this.newSection = false
        this.sectionLoading = false
      } else {
        this.sectionError = res.message
        this.sectionLoading = false
      }

    },

    renameSectionModal($event) {
      console.log($event)
      /*this.renameModal = true
      this.sectionId = $event.id
      this.sectionTitle = $event.title*/
    },

    async renameSection(payload) {
      const sec = await this.$store.dispatch("section/renameSection", {
        projectId: Number(this.$route.params.id),
        id: this.sectionId || payload.id,
        data: {
          title: this.sectionTitle || payload.title
        },
        text: `renamed section to "${this.sectionTitle || payload.title}"`,
      })
      // console.log("rename section output", sec)
      if (sec.statusCode = 200) {
        // this.renameModal = false
        this.updateKey()
      }
    },


    filterView($event) {
      this.loading = true
      if ($event == 'complete') {
        this.$store.dispatch('section/fetchProjectSections', { projectId: this.$route.params.id, filter: 'complete' }).then(() => {
          this.taskByOrder()
        }).catch(e => console.log(e))
      }
      if ($event == 'incomplete') {
        this.$store.dispatch('section/fetchProjectSections', { projectId: this.$route.params.id, filter: 'incomplete' }).then(() => {
          this.taskByOrder()
        }).catch(e => console.log(e))
      }
      if ($event == 'all') {
        this.$store.dispatch('section/fetchProjectSections', { projectId: this.$route.params.id, filter: 'all' }).then(() => {
          this.taskByOrder()
        }).catch(e => console.log(e))
      }
      this.loading = false
    },

    checkActive() {
      for (let i = 0; i < this.tableFields.length; i++) {
        if (this.tableFields[i].header_icon) {
          this.tableFields[i].header_icon.isActive = false
        }

        if (this.tableFields[i].header_icon && this.tableFields[i].key == this.sortName) {
          this.tableFields[i].header_icon.isActive = true
        }
      }
    },

    setFavorite(task) {
      // console.info("to be fav task", task)
      this.loading = true
      let isFav = this.favTasks.some((f) => f.taskId == task.id)
      // console.log(isFav)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => {
            // console.log(msg)
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
            // console.log(msg)
            this.updateKey()
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      }
    },

    markComplete(task) {
      // console.log(typeof task, this.task)
      this.loading = true
      if (typeof task == "object" && Object.keys(task).length > 0) {
        // console.log(task)
      } else {
        // alert("no task selected")
        task = this.activeTask
      }
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          // console.log(d)
          this.loading = false
          // this.$nuxt.$emit("update-key")
          this.updateKey()
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
    },

    updateTask(payload) {
      // console.log(payload)
      let user
      if (payload.field == "userId" && payload.value != '') {
        user = this.teamMembers.filter(t => t.id == payload.value)
      } else {
        user = null
      }

      this.$store.dispatch("task/updateTask", {
        id: payload.task.id,
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

    deleteSection(section) {
      // let sec = this.sections.find(s => s.id == section.id)
      // console.log('section->',section, sec.title)
      this.loading = true;
      let del = confirm("Are you sure?")
      if (del) {
        this.$store.dispatch("section/deleteSection", section).then(s => {
          if (s.statusCode == 200) {
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

    sectionDragEnd: _.debounce(async function(payload) {

      this.loading = true

      // console.log(payload)
      let clone = _.cloneDeep(payload)
      clone.forEach((el, i) => {
        el.order = i
      })

      // console.log("ordered sections =>", clone)

      let sectionDnD = await this.$axios.$put("/section/dragdrop", { projectId: this.project.id, data: clone }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      // console.log(sectionDnD.message)

      if (sectionDnD.statusCode == 200) {
        this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id }).then(() => {
          this.$nuxt.$emit("update-key")
        })
      }

      this.loading = false

    }, 600),

    taskDragEnd: _.debounce(async function(payload) {
      // console.log('task dragend =>', payload)
      // this.highlight = null
      this.loading = true
      let tasks = _.cloneDeep(payload.tasks)

      tasks.forEach((el, i) => {
        el.order = i
      })

      // console.log("sorted->", tasks)

      let taskDnD = await this.$axios.$put("/section/crossSectionDragDrop", { data: tasks, sectionId: payload.sectionId }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      // console.log(taskDnD.message)
      if (taskDnD.statusCode == 200) {
        this.$emit("update-key")
      } else {
        console.warn(taskDnD.message)
      }
      this.loading = false
    }, 600),

    copyTaskLink(task) {
      let url = window.location.host + `/tasks/${task.id}`;

      if (navigator.clipboard) { 
        navigator.clipboard.writeText(url);
      } else { 
        unsecuredCopyToClipboard(url);
      }
    },

    searchTasks(text) {

      let formattedText = text.toLowerCase().trim();

      let secs = JSON.parse(JSON.stringify(this.sections))
      
      let newArr = secs.map((s) => {

          let filtered = s.tasks.filter((t) => {
          
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

        s.tasks = filtered

        return s;
      
      })

      if(newArr.length >= 0) {
        this.localdata = newArr
        this.templateKey++;
      } else {
        this.localdata = this.sections;
        this.templateKey++;
      }
    }
  },

};

</script>
<style lang="scss" scoped>
.task-view-wrapper {
  min-height: 5rem;
  min-height: 100%;
}

.new-section-input {
  min-height: 2rem;
  padding: 0 0.5rem;
  font-size: $font-size-sm;
  border-radius: 0.18rem;
  border: 1px solid var(--bib-gray4);

  &:focus {
    outline: none;
    border: 2px solid var(--bib-gray6);
    border-radius: 0;
  }
}

</style>
