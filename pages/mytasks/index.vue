<template>
  <client-only>
    <div id="page" class="mytask-page-wrapper ">
      <page-title title="My Tasks"></page-title>

      <user-tasks-actions :gridType="gridType" v-on:filterView="filterView"  @myTaskGroup="myTaskGroup($event)" @sort="sortBy" v-on:create-task="toggleSidebar($event)" v-on:add-section="toggleNewsection" @change-grid-type="($event)=>gridType = $event" @search-mytasks="searchTasks"></user-tasks-actions>

        <!-- <new-section-form :showNewsection="newSection" :showLoading="sectionLoading" :showError="sectionError" v-on:toggle-newsection="newSection = $event" v-on:create-section="createTodo"></new-section-form> -->
        <div v-show="gridType == 'list'" id="mytask-table-wrapper" class="h-100 mytask-table-wrapper position-relative " :style="{ 'width': contentWidth }">
          
          <!-- <adv-table-two :tableFields="taskFields" :tableData="localdata" :plusButton="false" :contextItems="contextMenuItems" @context-open="contextOpen" @context-item-event="contextItemClick" @table-sort="sortBy" @title-click="openSidebar" @row-click="openSidebar" @update-field="updateField" :showNewsection="newSection" @toggle-newsection="newSection = $event" @create-section="createTodo" @edit-section="renameTodo" @section-dragend="todoDragEnd" @row-dragend="taskDragEnd" :drag="dragTable"></adv-table-two> -->

          <adv-table-three :tableFields="taskFields" :tableData="localdata" :plusButton="false" :contextItems="contextMenuItems" @context-open="contextOpen" @context-item-event="contextItemClick" @table-sort="sortBy" @title-click="openSidebar" @row-click="openSidebar" @update-field="updateField" :showNewsection="newSection" @toggle-newsection="toggleNewsection" @create-section="createTodo" @edit-section="renameTodo" @section-dragend="todoDragEnd" @row-dragend="taskDragEnd" :drag="dragTable" :key="templateKey" :editSection="groupby"></adv-table-three>
              
          <!-- <loading :loading="loading"></loading> -->
            
        </div>

        <div v-show="gridType == 'grid'" id="tgs-scroll" class="bg-light grid-wrapper h-100 position-relative" :style="{ 'width': contentWidth }">
          <draggable v-model="localdata" class="d-flex grid-content" :move="moveTodo" @end="gridSectionDragend" handle=".section-drag-handle">
            <div v-if="newSection" class="task-grid-section">
              <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
                <input type="text" ref="newsectioninput" class="editable-input" placeholder="Enter title" @input="debounceNewSection($event.target.value, $event)" @focus.stop="">
              </div>
            </div>
            <div class="task-grid-section" v-for="(todo, index) in localdata" :key="index + viewName + '-' + key">
              <div class="w-100 d-flex justify-between bg-light" style="margin-bottom: 10px; position: sticky; top: 0; z-index: 2;">
                <task-grid-section-title :section="todo" @update-title="renameTodo"></task-grid-section-title>
                <div class="d-flex align-center section-options" :id="'tg-section-options-'+todo.id">
                  <div class="cursor-pointer mx-05 d-flex align-center" :id="'tg-section-addtask-'+todo.id" v-on:click.stop="$nuxt.$emit('open-sidebar', todo.id)">
                    <bib-icon icon="add" variant="gray5" :scale="1.25"></bib-icon>
                  </div>
                  <bib-popup pop="elipsis" icon-variant="gray5" :scale="1.1">
                    <template v-slot:menu>
                      <div :id="'tgs-list'+todo.id" class="list">
                        <span class="list__item" :id="'tgs-list-1'+todo.id" v-on:click.stop="$nuxt.$emit('open-sidebar', todo.id)">
                          <div class="d-flex align-center" :id="'tgs-list-flex-1'+todo.id">
                            <bib-icon icon="add"></bib-icon>
                            <span class="ml-05" :id="'tgs-list-span'+todo.id">Add task</span>
                          </div>
                        </span>
                        <hr>
                        <span class="list__item list__item__danger" :id="'tgs-list-3'+todo.id" v-on:click="deleteTodo(todo)">
                          Delete section
                        </span>
                      </div>
                    </template>
                  </bib-popup>
                </div>
              </div>
              <div class="task-section__body h-100">
                <draggable :list="todo.tasks" :group="{name: 'task'}" :move="moveTask" @start="taskDragStart" @end="gridTaskDragend" class="section-draggable h-100" :class="{highlight: highlight == todo.id}" :data-section="todo.id">
                  <template v-for="(task, index) in todo.tasks">
                    <task-grid :task="task" :key="task.id + '-' + index + key" :class="[ currentTask.id == task.id ? 'active' : '']" @update-key="updateKey" @open-sidebar="openSidebar" @date-picker="showDatePicker" @user-picker="showUserPicker"></task-grid>
                  </template>
                </draggable>
              </div>
            </div>
            <div class="task-grid-section " id="task-grid-section-blank-2"></div>
            <div class="task-grid-section " id="task-grid-section-blank-3" style="border-left-color: transparent;"></div>
            <!-- <div class="task-grid-section " id="task-grid-section-blank-4"></div> -->
          </draggable>
        </div>
          
        <!-- user-picker for board view -->
        <user-picker :show="userPickerOpen" :coordinates="popupCoords" @selected="updateAssignee({label: 'Assignee', field:'userId', value: $event.id, historyText: $event.label})" @close="userPickerOpen = false"></user-picker>
        <!-- date-picker for board view -->
        <inline-datepicker :show="datePickerOpen" :datetime="activeTask[datepickerArgs.field]" :coordinates="popupCoords" @date-updated="updateDate" @close="datePickerOpen = false"></inline-datepicker>
        <!-- status picker for board view -->
        <status-picker :show="statusPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Status', field:'statusId', value: $event.value, historyText: $event.label})" @close="statusPickerOpen = false" ></status-picker>
        <!-- priority picker for board view -->
        <priority-picker :show="priorityPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Priority', field:'priorityId', value: $event.value, historyText: $event.label})" @close="priorityPickerOpen = false" ></priority-picker>
        <!-- department-picker for list view -->
        <!-- <dept-picker :show="deptPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Department', field:'departmentId', value: $event.value, historyText: $event.label })" @close="deptPickerOpen = false"></dept-picker> -->

        <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>

        <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" autohide="5000">
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>

    </div>
  </client-only>
</template>

<script>
import _ from 'lodash'
import draggable from 'vuedraggable'
import { USER_TASKS, TASK_CONTEXT_MENU } from "../../config/constants";
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: "MyTasks",
  components: {
    draggable
  },
  data() {
    return {
      taskFields: USER_TASKS,
      localdata: [],
      loading: false,
      gridType: 'list',
      viewName: null,
      sortName: null,
      orderBy: 'desc',
      flag: false,
      key: 11,
      templateKey: 0,
      newSection: false,
      sectionLoading: false,
      sectionError: "",
      highlight: null,
      taskDnDsectionId: null,
      taskDnDlist: [],
      renameModal: false,
      todoId: null,
      todoTitle: null,
      activeTask: {},
      taskToDelete: {},
      taskContextMenu: false,
      contextMenuItems: TASK_CONTEXT_MENU,
      popupCoords: {},
      popupMessages: [],
      userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: ""},
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
      alertDialog: false,
      alertMsg:"",
      contentWidth: "100%",
      tasksKey: 'tasks',
      groupby: "",
      dragTable: true
    }
  },

  computed: {
    ...mapGetters({
      todos: "todo/getAllTodos",
      favTasks: 'task/getFavTasks',
      currentTask: 'task/getSelectedTask',
      teamMembers: "user/getTeamMembers",
      sidebar: "task/getSidebarVisible",
      loggedUser: "user/getUser2",
    })
  },

  watch: {
    todos(newVal) {
      let localTodos = _.cloneDeep(newVal)
      localTodos.forEach(function(todo) {
        todo["tasks"] = todo.tasks?.sort((a, b) => a.tOrder - b.tOrder);
      })
      this.localdata = localTodos
    },

    gridType() {
      this.key++;
    },
    sidebar(newVal){
      const page = document.getElementById("page")
      this.$nextTick(() => {
        const panel = document.getElementById("side-panel-wrapper")
        if (this.sidebar) {
          this.contentWidth = (page.scrollWidth - panel.offsetWidth) + 'px'
        } else {
          this.contentWidth = '100%'
        }
      });
    }
  },

  created() {
    if (process.client) {
      this.$nuxt.$on("update-key", (msg) => {
        this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then(() => { this.key += 1 })
        if (msg) {
          this.popupMessages.push({text: msg, variant: 'success'})
        }
      })

    }
  },

  mounted() {

    for(let field of this.taskFields) {
      if(field.header_icon) {
        field.header_icon.isActive = false;
      }
    }
  },

  asyncData(context) {
    const token = context.$cookies.get('b_ssojwt')
    return  context.$axios.$get('/todo/all', {
      headers: { 'Authorization': `Bearer ${token}`, 'Filter': 'all' }
    }).then((res)=>{
     if (res.statusCode == 200) {
        context.store.dispatch('todo/setTodos', res.data)
        // context.store.dispatch('todo/setInitialTodos', res.data)
        return {localdata: res.data}
      }
      
    })
  },

  methods: {
    //group by
    myTaskGroup($event) {
      this.groupby=$event
      if($event != 'default') {
        this.dragTable = false;
      } else {
        this.groupby=''
        this.dragTable = true;
      }
      this.$store.commit('todo/groupMyTasks',{sName:this.groupby,team:this.teamMembers })
      },
    checkActive(sortName) {
      for(let i=0; i<this.taskFields.length; i++) {
          if(this.taskFields[i].header_icon) {
            this.taskFields[i].header_icon.isActive = false
          }

          if(this.taskFields[i].header_icon && this.taskFields[i].key == sortName) {
            this.taskFields[i].header_icon.isActive = true
          } 
      }
      this.templateKey++;
    },

    taskRightClick(payload) {
      this.taskContextMenu = true
      this.userPickerOpen = false
      this.datePickerOpen = false
      const { event, task } = payload
      this.activeTask = task;
      this.$store.dispatch('task/setSingleTask', task)
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
    },

    openSidebar(task, scroll) {
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false
      }
      this.$nuxt.$emit("open-sidebar", { ...task, scrollId: scroll });

      let el = document.getElementById("tgs-scroll")
      if (event.target.closest(".task-grid")) {
        let scrllLeft = event.target.closest(".task-grid").offsetLeft - event.target.offsetWidth;
        let scrllTop = event.target.closest(".task-grid").offsetTop - event.target.offsetHeight;
        el.scrollTo({
          top: scrllTop,
          left: scrllLeft,
          behavior: 'smooth'
        });
      }
    },

    closePopups() {
      this.taskContextMenu = false
      this.userPickerOpen = false
      this.datePickerOpen = false
      this.activeTask = {}
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
    contextItemClick(key, item) {
      // console.log(...arguments)
      switch (key) {
        case 'done-task':
          this.taskMarkComplete(item)
          break;
        case 'fav-task':
          this.taskSetFavorite(item)
          break;
        case 'delete-task':
          this.deleteTask(item)
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
          this.alertDialog = true
          this.alertMsg = "no task assigned"
          break;
      }
    },

    showUserPicker(payload){
      this.closeAllPickers()
      this.userPickerOpen = true
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showDatePicker(payload){
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
    },

    // task context menu methods ----------------------------------------

    taskSetFavorite(task) {
      this.loading = true
      let isFav = this.favTasks.some((f) => f.taskId == task.id)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => {
            this.updateKey("Removed favorite")
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      } else {
        this.$store.dispatch("task/addToFavorite", { id: task.id })
          .then(msg => {
            this.updateKey("Added to favorite")
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      }
    },

    updateField(payload){
      // console.log(payload)
      
      const { item, label, field, value, historyText } = payload
      let data = { [field]: value }
    
      if(field == "dueDate" && item.startDate){
        // console.log(field, value)
        if(new Date(value).getTime() > new Date(item.startDate).getTime()){
          data = { [field]: value }
        } else{
          data = { [field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey()
          return false
        }
      }
      if(field == "startDate" && item.dueDate){
        // console.log(field, value)
        if(new Date(value).getTime() < new Date(item.dueDate).getTime()){
          data = { [field]: value }
        } else {
          data = { [field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey()
          return false
        }
      }

      this.$store.dispatch("task/updateTask", {
        id: payload.id,
        projectId: item.project[0]?.projectId || null,
        data: { [field]: value },
        text: historyText
      })
        .then(t => {
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    taskMarkComplete(task) {
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          this.updateKey("Marked as complete")
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
        })
    },

    updateTask(payload) {
      let user
      if (payload.field == "userId" && payload.value != '') {
        user = this.teamMembers.filter(t => t.id == payload.value)
      } else {
        user = null
      }

      this.$store.dispatch("task/updateTask", {
        id: payload.task.id,
        projectId: payload.task.project[0].projectId || payload.task.project[0].project.id,
        data: { [payload.field]: payload.value },
        user,
        text: `changed ${payload.label} to ${payload.historyText || payload.value}`
      })
        .then(t => {
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    updateAssignee(payload){
      // console.log(payload)
      const { label, field, value, historyText } = payload
      let user
      if (field == "userId" && value != '') {
        user = this.teamMembers.filter(t => t.id == value)
      } else {
        user = null
      }

      this.userPickerOpen = false

      this.$store.dispatch("task/updateTask", {
        id: this.activeTask.id,
        data: { [field]: value},
        user,
        text: `changed ${label} to ${historyText}`
      })
        .then(t => {
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    updateDate(value){
      let newDate, data = { [this.datepickerArgs.field]: value}

      if(value && this.activeTask.startDate){
        if(new Date(value).getTime() > new Date(this.activeTask.startDate).getTime()){
          data = { [this.datepickerArgs.field]: value }
          newDate = dayjs(value).format("D MMM YYYY")
        } else{
          data = { [this.datepickerArgs.field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey()
          return false
        }
      }

      this.$store.dispatch("task/updateTask", {
        id: this.activeTask.id,
        data: data,
        user: null,
        text: `changed ${this.datepickerArgs.label} to ${newDate}`
      })
        .then(t => {
          this.updateKey()
        })
        .catch(e => console.warn(e))
    },

    deleteTask(task) {
      if (task) {
        this.$store.dispatch("task/deleteTask", task)
        .then(t => {
          if (t.statusCode == 200) {
            this.updateKey(t.message)
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
      }
    },

    createTask(item){
      let taskdata = item

      taskdata.user = [{
        id: this.loggedUser.Id,
        email: this.loggedUser.Email,
        firstName: this.loggedUser.FirstName,
        lastName: this.loggedUser.LastName
      }]
      console.log(taskdata)
      this.$store.dispatch("task/createTask", taskdata)
      .then(t => {
        console.log(t)
        this.updateKey()
      })
      .catch(e => console.warn(e))
    },

    updateKey($event) {
      if ($event) {
        this.popupMessages.push({ text: $event, variant: "success" })
      }
      
      this.$store.dispatch("todo/fetchTodos", { filter: 'all',sName:this.groupby}).then((res) => {
        if (res.statusCode == 200) {
          this.key += 1
        }
      })
    },

    /*showNewTodo() {
      this.newSection = true
      process.nextTick(() => {
        this.$refs.newsectioninput.focus()
      });
    },*/
    
    toggleNewsection(flag) {
      // console.log(flag)
      this.newSection = flag ? false : true

    },

    debounceNewSection: _.debounce(function(value, event) {
      if (value) {
        event.target.classList.remove("error")
        this.createTodo(value)
      } else {
        console.warn("Title cannot be left blank")
        event.target.classList.add("error")
      }
    }, 800),

    async createTodo($event) {
      let tempTodos = this.localdata.map((el, index) => {
        el.uOrder = index+1
        return el
      })
      tempTodos.unshift({title: $event, userId: JSON.parse(localStorage.getItem("user")).sub, uOrder: 0 })

      const todo = await this.$store.dispatch("todo/createTodo", {
        userId: JSON.parse(localStorage.getItem("user")).sub,
        title: $event,
        data: tempTodos,
      })

      if (todo.statusCode == 200) {
        this.newSection = false
        this.$store.dispatch("todo/fetchTodos", { filter: 'all' })
      } else {
        console.warn(todo)
      }
    },

    renameTodo(payload) {
      this.$store.dispatch("todo/renameTodo", {
        id: payload.id,
        data: {
          title: payload.title
        },
        text: `renamed section to "${payload.title}"`,
      }).then(res => {
        if (res.statusCode == 200) {
          this.updateKey()
        } else { 
          this.alertDialog = true
          this.alertMsg = "Error -> "+ res.statusCode
        }
      }).catch(e => console.warn(e))
    },

    deleteTodo(todo) {
      this.$store.dispatch("todo/deleteTodo", todo)
        .then((d) => {
          this.updateKey()
          this.popupMessages.push({ text: t.message, variant: "orange" })
        })
        .catch(e => console.log(e))
    },

    taskDragStart(e) {
      this.drag = true
    },

    moveTask(e) {
      this.taskDnDsectionId = +e.to.dataset.section
      this.highlight = +e.to.dataset.section
    },

    gridTaskDragend(e){
      let sectionData = this.localdata.filter(
        (s) => s.id == e.to.dataset.section
      );
      this.taskDragEnd({
        tasks: sectionData[0].tasks,
        sectionId: e.to.dataset.section,
      });
    },

    taskDragEnd: _.debounce(async function(payload) {

      this.highlight = null

      payload.tasks.forEach((e, i) => {
        e.tOrder = i
      })

      let taskDnD = await this.$axios.$put("/todo/crossTodoDragDrop", { data: payload.tasks, todoId: payload.sectionId }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      if (taskDnD.statusCode != 200) {
        this.alertDialog = true
        this.alertMsg = taskDnD.message
      }

      this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then((res) => {
        if (res.statusCode == 200) {
          this.key += 1
        }
      })
    }, 400),

    moveTodo(e) {
      this.highlight = +e.to.dataset.section
    },

    gridSectionDragend(e){
      this.todoDragEnd(this.localdata)
    },

    todoDragEnd: _.debounce(async function(todos) {
      todos.forEach((el, i) => {
        el.uOrder = i
      })

      let todoDnD = await this.$axios.$put("/todo/dragdrop", { data: todos }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      if (todoDnD.statusCode != 200) {
        this.alertDialog = true
        this.alertMsg = taskDnD.message
      }

      this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then((res) => {
        if (res.statusCode == 200) {
          this.key += 1
        }
      })

    }, 400),

    filterView($event) {
      this.$store.commit("todo/getFilterMyTasks",{filter:$event, groupBy:this.groupby})

      // this.loading = true
      // if ($event == 'complete') {
      //   this.$store.dispatch('todo/fetchTodos', { filter: 'complete',sName:this.groupby }).then((res) => {
      //     this.viewName = 'complete'
      //     this.key += 1;
      //     this.loading = false
      //   }).catch(e => console.log(e))
      // }
      // if ($event == 'incomplete') {
      //   this.$store.dispatch('todo/fetchTodos', { filter: 'incomplete',sName:this.groupby }).then((res) => {
      //     this.viewName = 'incomplete'
      //     this.key += 1;
      //     this.loading = false
      //   }).catch(e => console.log(e))
      // }
      // if ($event == 'all') {
      //   this.$store.dispatch('todo/fetchTodos', { filter: 'all',sName:this.groupby }).then((res) => {
      //     this.viewName = 'all'
      //     this.key += 1;
      //     this.loading = false
      //   }).catch(e => console.log(e))
      // }
    },

    // Sort By Action List
    sortBy($event) {
      // sort by title
      if ($event == 'title') {

          let newArr = JSON.parse(JSON.stringify(this.localdata))
       
          if (this.orderBy == "asc") {

              newArr.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.title && b.title) {
                    return a.title.localeCompare(b.title)
                  }
                })
              })

          } else {

            newArr.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.title && b.title) {
                    return b.title.localeCompare(a.title)
                  }
                })
              })
          }

          this.localdata = newArr; 
      }

      // sort By Project
      if ($event == 'project') {
      
          let newArr1 = [];

          for (let i = 0; i < this.localdata.length; i++) {
            newArr1.push(this.localdata[i]);
            let tNewArr = []
            for(let j=0; j<this.localdata[i].tasks.length; j++) {
              if (this.localdata[i].tasks[j].project.length > 0) {
                tNewArr.unshift(this.localdata[i].tasks[j])
              } else {
                tNewArr.push(this.localdata[i].tasks[j])
              }
            }
            newArr1[i]["tasks"] = tNewArr;
          }

          if (this.orderBy == "asc") {

              newArr1.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.project.length > 0 && b.project.length > 0) {
                    return a.project[0].project.title.localeCompare(b.project[0].project.title)
                  }
                })
              })

          } else {

            newArr1.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.project.length > 0 && b.project.length > 0) {
                    return b.project[0].project.title.localeCompare(a.project[0].project.title)
                  }
                })
              })
          }

          this.localdata = newArr1;  
      }


      // sort By Status
      if ($event == "status") {

          let newArr2 = [];

          for (let i = 0; i < this.localdata.length; i++) {
            newArr2.push(this.localdata[i]);
            let tNewArr = []
            for(let j=0; j<this.localdata[i].tasks.length; j++) {
              if (this.localdata[i].tasks[j].statusId) {
                tNewArr.unshift(this.localdata[i].tasks[j])
              } else {
                tNewArr.push(this.localdata[i].tasks[j])
              }
            }
            newArr2[i]["tasks"] = tNewArr;
          }

          if (this.orderBy == "asc") {

              newArr2.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.statusId && b.statusId) {
                    return a.status.text.localeCompare(b.status.text)
                  }
                })
              })

          } else {

            newArr2.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.statusId && b.statusId) {
                    return b.status.text.localeCompare(a.status.text)
                  }
                })
              })
          }

          this.localdata = newArr2;

      }

      // sort by create date
      if ($event == 'startDate') {

        let newArr3 = [];

        for (let i = 0; i < this.localdata.length; i++) {
          newArr3.push(this.localdata[i]);
          let tNewArr = []
          for(let j=0; j<this.localdata[i].tasks.length; j++) {
            if (this.localdata[i].tasks[j].startDate) {
              tNewArr.unshift(this.localdata[i].tasks[j])
            } else {
              tNewArr.push(this.localdata[i].tasks[j])
            }
          }
          newArr3[i]["tasks"] = tNewArr;
        }

        if (this.orderBy == "asc") {

            newArr3.forEach(todo => {
              todo["tasks"] = todo.tasks.sort((a, b) => {
                if (a.startDate && b.startDate) {
                  return new Date(a.startDate) - new Date(b.startDate)
                }
              })
            })

        } else {

          newArr3.forEach(todo => {
              todo["tasks"] = todo.tasks.sort((a, b) => {
                if (a.startDate && b.startDate) {
                  return new Date(b.startDate) - new Date(a.startDate)
                }
              })
            })
        }

        this.localdata = newArr3;
      }


      // sort by due date
      if ($event == 'dueDate') {
        let newArr4 = [];

        for (let i = 0; i < this.localdata.length; i++) {
          newArr4.push(this.localdata[i]);
          let tNewArr = []
          for(let j=0; j<this.localdata[i].tasks.length; j++) {
            if (this.localdata[i].tasks[j].dueDate) {
              tNewArr.unshift(this.localdata[i].tasks[j])
            } else {
              tNewArr.push(this.localdata[i].tasks[j])
            }
          }
          newArr4[i]["tasks"] = tNewArr;
        }

        if (this.orderBy == "asc") {

            newArr4.forEach(todo => {
              todo["tasks"] = todo.tasks.sort((a, b) => {
                if (a.dueDate && b.dueDate) {
                  return new Date(a.dueDate) - new Date(b.dueDate)
                }
              })
            })

        } else {

          newArr4.forEach(todo => {
              todo["tasks"] = todo.tasks.sort((a, b) => {
                if (a.dueDate && b.dueDate) {
                  return new Date(b.dueDate) - new Date(a.dueDate)
                }
              })
            })
        }

        this.localdata = newArr4;
      }


      // sort by priority
      if ($event == "priority") {
        let newArr5 = [];

          for (let i = 0; i < this.localdata.length; i++) {
            newArr5.push(this.localdata[i]);
            let tNewArr = []
            for(let j=0; j<this.localdata[i].tasks.length; j++) {
              if (this.localdata[i].tasks[j].priorityId) {
                tNewArr.unshift(this.localdata[i].tasks[j])
              } else {
                tNewArr.push(this.localdata[i].tasks[j])
              }
            }
            newArr5[i]["tasks"] = tNewArr;
          }

          if (this.orderBy == "asc") {

              newArr5.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.priorityId && b.priorityId) {
                    return a.priorityId - b.priorityId
                  }
                })
              })

          } else {

            newArr5.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.priorityId && b.priorityId) {
                    return b.priorityId - a.priorityId
                  }
                })
              })
          }

          this.localdata = newArr5;
      }


      // sort by department
      if ($event == "department") {
        let newArr6 = [];

          for (let i = 0; i < this.localdata.length; i++) {
            newArr6.push(this.localdata[i]);
            let tNewArr = []
            for(let j=0; j<this.localdata[i].tasks.length; j++) {
              if (this.localdata[i].tasks[j].departmentId) {
                tNewArr.unshift(this.localdata[i].tasks[j])
              } else {
                tNewArr.push(this.localdata[i].tasks[j])
              }
            }
            newArr6[i]["tasks"] = tNewArr;
          }

          if (this.orderBy == "asc") {

              newArr6.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.departmentId && b.departmentId) {
                    return a.department.title.localeCompare(b.department.title)
                  }
                })
              })

          } else {

            newArr6.forEach(todo => {
                todo["tasks"] = todo.tasks.sort((a, b) => {
                  if (a.departmentId && b.departmentId) {
                    return b.department.title.localeCompare(a.department.title)
                  }
                })
              })
          }

          this.localdata = newArr6;
      }


      this.key += 1
      this.checkActive($event)
      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
    },

    toggleSidebar($event) {
      // in case of create task 
      if (!$event) {
        // this.$nuxt.$emit("open-sidebar", $event)
        this.$nuxt.$emit("open-sidebar", {...$event,userId:JSON.parse(localStorage.getItem("user")).sub});
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
      let formattedText = text.toLowerCase().trim();
      let Ts = JSON.parse(JSON.stringify(this.todos))
      let newArr = Ts.map((todo) => {
        let filtered = todo.tasks.filter((t) => {
          if(t.title.includes(formattedText) || t.title.toLowerCase().includes(formattedText)) {
              return t
            } 
          })

        todo.tasks = filtered
        return todo;
      })

      if(newArr.length >= 0) {
        this.localdata = newArr
        this.key++;
      } else {
        this.localdata = this.todos;
        this.key++;
      }
    }
  },

}

</script>
<style lang="scss" scoped>
.mytask-page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  /*display: grid;
  grid-template-rows: auto auto calc(100vh - 150px);
  grid-template-columns: 1fr;*/
}
.mytask-table-wrapper {
  overflow: auto;
}
.grid-wrapper {
  overflow: auto;
  .grid-content {
    /*height: calc(100% - 18px);*/
  }
}
.highlight {
  outline: 2px skyblue dashed;
  background-color: azure;
}

</style>
