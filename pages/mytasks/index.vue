<template>
  <client-only>
    <div id="my-tasks-page-wrapper" class="mytask-page-wrapper ">
      <page-title title="My Tasks"></page-title>
      <user-tasks-actions :gridType="gridType" v-on:filterView="filterView" @sort="sortBy" v-on:create-task="toggleSidebar($event)" v-on:add-section="showNewTodo" @change-grid-type="($event)=>gridType = $event" @search-mytasks="searchTasks"></user-tasks-actions>
      <div>
        <new-section-form :showNewsection="newSection" :showLoading="sectionLoading" :showError="sectionError" v-on:toggle-newsection="newSection = $event" v-on:create-section="createTodo"></new-section-form>
        <div id="mytask-table-wrapper" class="h-100 mytask-table-wrapper position-relative of-scroll-y">
          <template v-if="gridType == 'list'">
            <template v-if="todos.length">
              <drag-table :key="key" :componentKey="key" :fields="taskFields" :sections="localdata" :titleIcon="{icon:'check-circle-solid', event:'task-icon-click'}" v-on:section-dragend="todoDragEnd" v-on:task-dragend="taskDragEnd" @table-sort="sortBy" @row-click="openSidebar" @row-rightclick="taskRightClick" @task-icon-click="taskMarkComplete" @edit-field="updateTask" @edit-section="renameTodo" @date-picker="showDatePicker" @status-picker="showStatusPicker"></drag-table>
              <!-- table context menu -->
              <table-context-menu :items="contextMenuItems" :show="taskContextMenu" :coordinates="popupCoords" :activeItem="activeTask" @close-context="closePopups" @item-click="contextItemClick"></table-context-menu>
              <loading :loading="loading"></loading>
            </template>
            <div v-else>
              <span id="projects-0" class="d-inline-flex gap-05 align-center m-1 text-gray5">
                <bib-icon icon="warning" variant="orange"></bib-icon> No records found
              </span>
            </div>
          </template>
          <template v-else>
            <div id="tgs-scroll" class="bg-light h-100 of-scroll-x position-relative">
              <draggable :list="localdata" class="d-flex h-100" :move="moveTodo" v-on:end="todoDragEnd" handle=".section-drag-handle">
                <div class="task-grid-section" v-for="(todo, index) in localdata" :key="index + viewName + '-' + key">
                  <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
                    <!-- <div class="title section-drag-handle text-dark flex-grow-1">{{todo.title}}</div> -->
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
                            </span><span class="list__item" :id="'tgs-list-2'+todo.id" v-on:click="showRenameModal(todo)">
                              <div class="d-flex align-center" :id="'tgs-list-flex-2'+todo.id">
                                <bib-icon icon="pencil"></bib-icon>
                                <span class="ml-05" :id="'tgs-list-span'+todo.id">Rename</span>
                              </div>
                            </span>
                            <hr>
                            <span class="list__item danger" :id="'tgs-list-3'+todo.id" v-on:click="deleteTodo(todo)">
                              Delete section
                            </span>
                          </div>
                        </template>
                      </bib-popup>
                    </div>
                  </div>
                  <div class="task-section__body h-100">
                    <draggable :list="todo.tasks" :group="{name: 'task'}" :move="moveTask" @start="taskDragStart" @end="taskDragEnd" class="section-draggable h-100" :class="{highlight: highlight == todo.id}" :data-section="todo.id">
                      <template v-for="(task, index) in todo.tasks">
                        <task-grid :task="task" :key="task.id + '-' + index + key" :class="[ currentTask.id == task.id ? 'active' : '']" @update-key="updateKey" @open-sidebar="openSidebar" @date-picker="showDatePicker" @user-picker="showUserPicker"></task-grid>
                      </template>
                    </draggable>
                  </div>
                </div>
                <div class="task-grid-section " id="task-grid-section-blank-2"></div>
                <div class="task-grid-section " id="task-grid-section-blank-3"></div>
                <div class="task-grid-section " id="task-grid-section-blank-4" style="border-left-color: transparent;"></div>
              </draggable>
            </div>
          </template>
          
          <!-- user-picker for board view -->
          <user-picker :show="userPickerOpen" :coordinates="popupCoords" @selected="updateAssignee('Assignee', 'userId', $event.id, $event.label)" @close="userPickerOpen = false"></user-picker>
          
          <!-- date-picker for list and board view -->
          <inline-datepicker :show="datePickerOpen" :datetime="activeTask[datepickerArgs.field]" :coordinates="popupCoords" @date-updated="updateDate" @close="datePickerOpen = false"></inline-datepicker>

          <!-- status picker for list view -->
          <status-picker :show="statusPickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Status', field:'statusId', value: $event.value, historyText: $event.label})" @close="statusPickerOpen = false" ></status-picker>
        </div>
        
        <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>

        <!-- rename section modal -->
        <bib-modal-wrapper v-if="renameModal" title="Rename section" @close="renameModal = false">
          <template slot="content">
            <div>
              <bib-input type="text" v-model.trim="todoTitle" placeholder="Enter name..."></bib-input>
              <loading :loading="loading"></loading>
            </div>
          </template>
          <template slot="footer">
            <div class="d-flex justify-between">
              <bib-button label="Cancel" variant="light" pill @click="renameModal = false"></bib-button>
              <bib-button label="Rename" variant="success" pill v-on:click="renameTodo"></bib-button>
            </div>
          </template>
        </bib-modal-wrapper>
        <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>

        <confirm-dialog v-if="confirmModal" :message="confirmMsg" @close="confirmDelete"></confirm-dialog>
      </div>
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
      confirmModal: false,
      confirmMsg: "",
      alertDialog: false,
      alertMsg:"",
    }
  },

  computed: {
    ...mapGetters({
      todos: "todo/getAllTodos",
      favTasks: 'task/getFavTasks',
      currentTask: 'task/getSelectedTask',
      teamMembers: "user/getTeamMembers",
    })
  },

  watch: {
    todos(newVal) {
      // let todos = JSON.parse(JSON.stringify(newVal))
      let todos = _.cloneDeep(newVal)
      todos.forEach(function(todo) {
        todo["tasks"] = todo.tasks.sort((a, b) => a.tOrder - b.tOrder);
      })
      this.localdata = todos
    }
  },

  created() {
    if (process.client) {
      /*this.$nuxt.$on('change-grid-type', ($event) => {
        this.gridType = $event;
      })*/
      this.$nuxt.$on("update-key", (msg) => {
        this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then(() => { this.key += 1 })
        if (msg) {
          this.popupMessages.push({text: msg, variant: 'success'})
        }
      })

    }
  },

  mounted() {
    this.loading = true
    this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then((res) => {
      if (res.statusCode == 200) {
        this.key += 1
      }
      this.loading = false;
    })
  },

  methods: {

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
      // console.log(event.target)
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false
      }
      this.$nuxt.$emit("open-sidebar", { ...task, scrollId: scroll });

      let el = document.getElementById("tgs-scroll")
      if (event.target.closest(".task-grid")) {
        // let el = event.target.offsetParent
        // let scrollAmt = event.target.offsetLeft - event.target.offsetWidth;
        let scrollAmt = event.target.closest(".task-grid").offsetLeft - event.target.offsetWidth;
        el.scrollTo({
          top: 0,
          left: scrollAmt,
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
        case 'copy-task':
          this.copyTaskLink(this.activeTask);
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

    showUserPicker(payload){
      // console.log(payload)
      this.userPickerOpen = true
      this.datePickerOpen = false
      this.taskContextMenu = false
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
    },
    showDatePicker(payload){
      // console.log(payload)
      // payload consists of event, task, label, field
      this.datePickerOpen = true
      this.userPickerOpen = false
      this.taskContextMenu = false
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
      this.datepickerArgs.field = payload.field || 'dueDate'
      this.datepickerArgs.label = payload.label || 'Due date'
    },
    showStatusPicker(payload){
      this.statusPickerOpen = true
      this.userPickerOpen = false
      this.datePickerOpen = false
      this.taskContextMenu = false
      this.popupCoords = { left: event.clientX + 'px', top: event.clientY + 'px' }
      this.activeTask = payload.task
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
        projectId: payload.task.project[0].projectId || payload.task.project[0].project.id,
        data: { [payload.field]: payload.value },
        user,
        text: `changed ${payload.label} to "${payload.historyText || payload.value}"`
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
      // this.loading = true
      this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then((res) => {
        if (res.statusCode == 200) {
          this.key += 1
        }
        // this.loading = false;
      })
    },

    showNewTodo() {
      this.newSection = true
    },

    async createTodo($event) {
      console.log('create-todo', $event)
      this.sectionLoading = true
      const todo = await this.$store.dispatch("todo/createTodo", {
        userId: JSON.parse(localStorage.getItem("user")).sub,
        title: $event,
      })

      if (todo.statusCode == 200) {
        this.updateKey()
        this.newSection = false
        this.sectionLoading = false
      } else {
        this.sectionError = todo.message
        this.sectionLoading = false
      }
    },

    showRenameModal(todo) {
      this.todoTitle = todo.title
      this.todoId = todo.id
      this.renameModal = true
    },

    renameTodo(payload) {
      // console.table(payload);
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
          // alert("Error -> "+ res.statusCode)
        }
      }).catch(e => console.warn(e))
    },

    deleteTodo(todo) {
      this.$store.dispatch("todo/deleteTodo", todo)
        .then((d) => {
          this.updateKey()
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

    taskDragEnd: _.debounce(async function(payload) {

      this.highlight = null
      console.log(payload.tasks)

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
        // alert(taskDnD.message)
      }

      this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then((res) => {
        if (res.statusCode == 200) {
          this.key += 1
        }
        this.loading = false;
      })
    }, 600),

    moveTodo(e) {
      this.highlight = +e.to.dataset.section
    },

    todoDragEnd: _.debounce(async function(todos) {

      todos.forEach((el, i) => {
        el.uOrder = i
      })

      // console.log("ordered todos=>", todos)

      let todoDnD = await this.$axios.$put("/todo/dragdrop", { data: todos }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      if (todoDnD.statusCode != 200) {
        this.alertDialog = true
        this.alertMsg = taskDnD.message
        // alert(taskDnD.message)
      }

      this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then((res) => {
        if (res.statusCode == 200) {
          this.key += 1
        }
        this.loading = false;
      })

    }, 600),

    filterView($event) {
      this.loading = true
      if ($event == 'complete') {
        this.$store.dispatch('todo/fetchTodos', { filter: 'complete' }).then((res) => {
          this.viewName = 'complete'
          this.key += 1;
          this.loading = false
        }).catch(e => console.log(e))
      }
      if ($event == 'incomplete') {
        this.$store.dispatch('todo/fetchTodos', { filter: 'incomplete' }).then((res) => {
          this.viewName = 'incomplete'
          this.key += 1;
          this.loading = false
        }).catch(e => console.log(e))
      }
      if ($event == 'all') {
        this.$store.dispatch('todo/fetchTodos', { filter: 'all' }).then((res) => {
          this.viewName = 'all'
          this.key += 1;
          this.loading = false
        }).catch(e => console.log(e))
      }
    },

    // Sort By Action List
    sortBy($event) {
      // sort by title
      if ($event == 'title' && this.orderBy == 'asc') {
        this.localdata.forEach(function(todo, index) {
          todo["tasks"] = todo.tasks.sort((a, b) => a.title.localeCompare(b.title))
        })
      }

      if ($event == 'title' && this.orderBy == 'desc') {
        this.localdata.forEach(function(todo, index) {
          todo["tasks"] = todo.tasks.sort((a, b) => b.title.localeCompare(a.title))
        })
      }

      // sort By Project
      if ($event == 'project' && this.orderBy == 'asc') {

        this.localdata.forEach(function(todo) {
          todo["tasks"] = todo.tasks.sort((a, b) => {
            if (a.project && b.project) {
              return a.project[0].project.title.localeCompare(b.project[0].project.title)
            }
          });
        })

      }

      if ($event == 'project' && this.orderBy == 'desc') {
        this.localdata.forEach(function(todo) {
          todo["tasks"] = todo.tasks.sort((a, b) => {
            if (a.project && b.project) {
              return b.project[0].project.title.localeCompare(a.project[0].project.title)
            }
          });
        })
      }

      // sort By Status
      if ($event == "status") {

        if (this.orderBy == "asc") {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => a.status.text.localeCompare(b.status.text));
          })
        } else {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => b.status.text.localeCompare(a.status.text));
          })
        }

      }

      // sort by create date
      if ($event == 'startDate') {
        if (this.orderBy == "asc") {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          })
        } else {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          })
        }
      }


      // sort by due date
      if ($event == 'dueDate') {
        if (this.orderBy == "asc") {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          })
        } else {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
          })
        }
      }


      // sort by priority
      if ($event == "priority") {
        if (this.orderBy == "asc") {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => a.priority.id - b.priority.id);
          })
        } else {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => b.priority.id - a.priority.id);
          })
        }
      }

      this.key += 1
      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
    },

    toggleSidebar($event) {
      // in case of create task 
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

      let formattedText = text.toLowerCase().trim();

      let Ts = JSON.parse(JSON.stringify(this.todos))
      
      let newArr = Ts.map((todo) => {

          let filtered = todo.tasks.filter((t) => {
          
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
  display: grid;
  grid-template-rows: auto auto calc(100vh - 150px);
  grid-template-columns: 1fr;
}

.highlight {
  outline: 2px skyblue dashed;
  background-color: azure;
}

</style>
