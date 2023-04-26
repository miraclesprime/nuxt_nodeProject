<template>
  <client-only>
    <div id="task-page-wrapper" class="task-page-wrapper ">
      <page-title title="Tasks"></page-title>
      <company-tasks-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:new-task="toggleSidebar($event)" @change-grid-type="($event)=>gridType = $event" @search-tasks="searchTasks"></company-tasks-actions>
      <div id="task-table-wrapper" class="task-table-wrapper position-relative of-scroll-y" :class="{ 'bg-light': gridType != 'list'}">
        <template v-if="gridType == 'list'">
          <template v-if="tasks.length">
            <drag-table :key="key" :componentKey="key" drag-table :fields="taskFields" :sections="localData" :titleIcon="{icon:'check-circle-solid', event:'task-icon-click'}" @task-icon-click="taskMarkComplete" :drag="false" v-on:new-task="toggleSidebar($event)" @table-sort="sortBy" @row-context="taskRightClick" @row-click="openSidebar" @edit-field="updateTask" @user-picker="showUserPicker" @date-picker="showDatePicker" @status-picker="showStatusPicker" @priority-picker="showPriorityPicker" @dept-picker="showDeptPicker" @section-dragend="sectionDragEnd"></drag-table>

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
          <task-grid-section :sections="localData" :activeTask="activeTask" :templateKey="key" v-on:update-key="updateKey" v-on:create-task="toggleSidebar($event)" v-on:set-favorite="taskSetFavorite" v-on:mark-complete="taskMarkComplete" v-on:delete-task="deleteTask" @section-dragend="sectionDragEnd" sectionType="department">
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
      key: 99,
      sortName: "",
      popupMessages: [],
      popupCoords: { },
      userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: ""},
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
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
        sName: "company/getSortName",
        sOrder: "company/getSortOrder",
    }),

  },

  watch: {
    tasks(newVal) {
        this.localData = _.cloneDeep(newVal)
        // console.log("watch ",this.sortName, this.orderBy)
    },
  },

  created() {
    if (process.client) {
      // console.info("created hook")
      this.$nuxt.$on("update-key", (msg) => {
        console.info("on update-key")
        this.loading = true
        let user = JSON.parse(localStorage.getItem("user"))
        this.$store.dispatch('company/fetchCompanyTasks', { companyId: user.subb, sort: true })
          .then((data) => {
            this.loading = false
            this.localData = data;
            this.checkActive()
            this.key += 1
          })
        if (msg) {
          this.popupMessages.push({text: msg, variant: 'success'})
        }
      })
      
    }
  },

  mounted(){
    // console.info("mounted hook")
    this.loading = true
    let compid = JSON.parse(localStorage.getItem("user")).subb;
    this.$store.dispatch('company/fetchCompanyTasks', { companyId: compid, filter: 'all' }).then((res) => {
      this.localData = res;
      this.key += 1;
      this.loading = false;
    })
  },

  methods: {
    showUserPicker(payload){
      // console.log('userpicker', payload)
      this.closeAllPickers()
      this.userPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showDatePicker(payload){
      // console.log('datepicker', payload)
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
    updateKey($event) {
      if ($event) {
        this.popupMessages.push({ text: $event, variant: "success" })
      }
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      
      let tasks = this.$store.dispatch("company/fetchCompanyTasks", { companyId: compid, filter: "all", sort: this.sortName })
        .then(() => {
          this.key += 1
        })
      // let sorted = this.$store.dispatch("company/sortCompanyTasks", { sName: this.sortName, order: this.orderBy })
      
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

    updateSingleRow(taskData){

      let depts = JSON.parse(JSON.stringify(this.tasks));

      depts.map((dept) => {
        let replaceIndex = dept.tasks.findIndex(lt => lt.id == taskData.id);
        dept.tasks.splice(replaceIndex, 1, taskData)
      })

      this.localData = depts;
      this.key += 1
    },

    updateTask(payload) {
      // console.log(payload)
      // alert("in progress. Updated value => " + payload.value)
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

      if (payload.field == "statusId" && payload.value == 0) {
        payload.value = null
      }

      if (payload.field == "priorityId" && payload.value == 0) {
        payload.value = null
      }

      this.$store.dispatch("task/updateTask", {
        id: payload.task.id,
        projectId,
        data: { [payload.field]: payload.value },
        user,
        text: `changed ${payload.label} to "${payload.historyText || payload.value}"`
      })
        .then(t => {
          this.updateSingleRow(t.data)
        })
        .catch(e => console.warn(e))
    },

    updateAssignee(label, field, value, historyText){
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
        text: `changed ${label} to ${historyText}`
      })
        .then(t => {
          // console.log(t)
          this.updateSingleRow(t.data)
          // this.updateKey()
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
          this.updateSingleRow(t.data)
          // this.updateKey()
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

    async filterView($event) {
      
      if ($event == 'complete') {
        let viewData = await JSON.parse(JSON.stringify(this.tasks));
        let newArr = []
        await viewData.map((dept) => {
          let tArr = dept.tasks.filter((t) => t.statusId == 5)
          dept['tasks'] = tArr;
          newArr.push(dept);
        })

        this.localData = newArr
        this.key += 1;
      }

      if ($event == 'incomplete') {    
        let viewData = await JSON.parse(JSON.stringify(this.tasks));
        let newArr = []
        await viewData.map((dept) => {
          let tArr = dept.tasks.filter((t) => t.statusId != 5)
          dept['tasks'] = tArr;
          newArr.push(dept)
        })

        this.localData = newArr
        this.key += 1;
      }

      if ($event == 'all') {
        let viewData = await JSON.parse(JSON.stringify(this.tasks));

        this.localData = viewData
        this.key += 1;
      }

    },

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

    // Sort By Action List
    sortBy($event) {

      this.sortName = $event
      if($event == 'title') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: $event, order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'userId') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: $event, order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'project') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: $event, order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'status') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: $event, order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'priority') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: $event, order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'startDate') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: $event, order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'dueDate') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: $event, order: this.orderBy }).then(() => {
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

      this.checkActive()
      this.key += 1

    },

    toggleSidebar($event) {
      this.flag = !this.flag;
      // this.$emit("open-sidebar", $event);
      if ($event.id) {
        this.$nuxt.$emit("open-sidebar", $event.id)
      } else {
        this.$nuxt.$emit("open-sidebar", {department: $event});
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

    searchTasks(text) {

      let formattedText = text.toLowerCase().trim();

      let depts = JSON.parse(JSON.stringify(this.tasks))
      
      let newArr = depts.map((d) => {

          let filtered = d.tasks.filter((t) => {
          
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

        d['tasks'] = filtered
        return d;
      
      })


      if(newArr.length >= 0) {
        this.localData = newArr
        this.key++;
      } else {
        this.localData = JSON.parse(JSON.stringify(this.tasks));
        this.key++;
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

      let sectionDnD = await this.$axios.$put("/department/dragdrop", { data: clone }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      // console.log(sectionDnD.message)

      if (sectionDnD.statusCode == 200) {
        let user = JSON.parse(localStorage.getItem("user"))
        this.$store.dispatch("company/fetchCompanyTasks", { companyId: user.subb }).then(() => {
          this.key++;
        })
      }

      this.loading = false

    }, 600),
  },

}

</script>
<style lang="scss" scoped>
.task-page-wrapper {
  display: grid;
  grid-template-rows: auto auto calc(100vh - 180px);
  grid-template-columns: 1fr;
}

.section-options {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}

</style>
