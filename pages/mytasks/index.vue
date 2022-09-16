<template>
  <client-only>
    <div id="my-tasks-page-wrapper" class="mytask-page-wrapper">
      <page-title title="My Tasks"></page-title>
      <user-tasks-actions :gridType="gridType" v-on:filterView="filterView" @sort="sortBy" v-on:create-task="toggleSidebar($event)" v-on:add-section="showNewTodo" />
      <div>
        <new-section-form :showNewsection="newSection" :showLoading="sectionLoading" :showError="sectionError" v-on:toggle-newsection="newSection = $event" v-on:create-section="createTodo"></new-section-form>
        <div id="mytask-table-wrapper" class="h-100 mytask-table-wrapper position-relative of-scroll-y">
          <template v-if="gridType == 'list'">
            <template v-if="todos.length">
              <drag-table :key="key" :componentKey="key" :fields="taskFields" :sections="localdata" v-on:task-click="$nuxt.$emit('open-sidebar', $event)" v-on:section-dragend="todoDragEnd" v-on:task-dragend="taskDragEnd" @table-sort="sortBy"  @row-click="openSidebar" @row-rightclick="taskRightClick"></drag-table>

              <!-- table context menu -->
              <table-context-menu :items="contextMenuItems" :show="taskContextMenu" :coordinates="contextCoords" :activeItem="activeTask" @close-context="closeContext" @item-click="contextItemClick" ></table-context-menu>

              <!-- <bib-table v-for="(todo, index) in localdata" :key="todo.id + '-' + viewName ? viewName : 'view' + '-' + sortName ? sortName : 'sort' + '-' + key" :fields="taskFields" :sections="todo.tasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: todo.title}" :headless="index > 0" class="border-gray4 bg-white" @file-title-sort="sortTitle" @file-project-sort="sortProject" @file-status-sort="sortByStatus" @file-startDate-sort="sortByStartDate" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
                <template #cell(title)="data">
                  <div class="d-flex gap-05 align-center">
                    <bib-icon icon="check-circle" :scale="1.5" :variant="taskCheckIcon(data)" class="cursor-pointer" @click="updateTaskStatus(data.value)"></bib-icon>
                    <span class="text-dark text-left cursor-pointer flex-grow-1" style=" line-height:1.25;" @click="$nuxt.$emit('open-sidebar', data.value)">{{ data.value.title }}</span>
                  </div>
                </template>
                <template #cell(projectId)="data">
                  <project-info :projectId="data.value.project[0] ? data.value.project[0].projectId : null" :key="key"></project-info>
                </template>
                <template #cell(owner)="data">
                  <user-info v-if="data.value.userId" :userId="data.value.userId"></user-info>
                </template>
                <template #cell(status)="data">
                  <status-comp :status="data.value.status"></status-comp>
                </template>
                <template #cell(createdAt)="data">
                  <format-date :datetime="data.value.createdAt" :key="key"></format-date>
                </template>
                <template #cell(dueDate)="data">
                  <format-date :datetime="data.value.dueDate" :key="key"></format-date>
                </template>
                <template #cell(priority)="data">
                  <priority-comp :priority="data.value.priority"></priority-comp>
                </template>
              </bib-table> -->
              <loading :loading="loading"></loading>
            </template>
            <div v-else>
              <span id="projects-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
                <bib-icon icon="warning"></bib-icon> No records found
              </span>
            </div>
          </template>
          <template v-else>
            <div class="h-100 of-scroll-x position-relative">
              <draggable :list="localdata" class="d-flex h-100" :move="moveTodo" v-on:end="todoDragEnd" handle=".section-drag-handle">
                <div class="task-grid-section" v-for="(todo, index) in localdata" :key="index + viewName + '-' + key">
                  <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
                    <div class="title section-drag-handle text-dark flex-grow-1">{{todo.title}}</div>
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
                      <task-grid :task="task" v-for="(task, index) in todo.tasks" :key="task.id + '-' + index + key"></task-grid>
                    </draggable>
                  </div>
                </div>
                <div class="task-grid-section"></div>
                <div class="task-grid-section"></div>
              </draggable>
            </div>
          </template>
        </div>
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
      </div>
    </div>
  </client-only>
</template>
<script>
import _ from 'lodash'
import draggable from 'vuedraggable'
import { USER_TASKS, TASK_CONTEXT_MENU } from "../../config/constants";
import { mapGetters } from 'vuex';

export default {
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
      popupMessages: [],
      highlight: null,
      taskDnDsectionId: null,
      taskDnDlist: [],
      renameModal: false,
      todoId: null,
      todoTitle: null,
      taskContextMenu: false,
      activeTask: {},
      contextMenuItems: TASK_CONTEXT_MENU,
      contextCoords: { },
    }
  },

  computed: {
    ...mapGetters({
      // tasks: 'user/getUserTasks',
      todos: "todo/getAllTodos",
      favTasks: 'task/getFavTasks'
    }),
    /*localdata() {
      return JSON.parse(JSON.stringify(this.todos))
    }*/
  },

  watch: {
    todos(newVal) {
      // console.log(newVal)
      let todos = JSON.parse(JSON.stringify(newVal))
      todos.forEach(function(todo) {
        todo["tasks"] = todo.tasks.sort((a, b) => a.tOrder - b.tOrder);
      })
      this.localdata = todos
    }
  },

  created() {
    if (process.client) {
      this.$nuxt.$on('change-grid-type', ($event) => {
        this.gridType = $event;
      })
      this.$nuxt.$on("update-key", () => {
        // console.log('updated key event received')
        this.$store.dispatch("todo/fetchTodos", {filter: 'all'} ).then(() => { this.key += 1 })
      })
    }
  },

  mounted() {
    this.loading = true
    // this.$store.dispatch('user/setUserTasks', { filter: 'all' }).then((res) => {
    this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then((res) => {
      // console.log(res)
      if (res.statusCode == 200) {
        this.key += 1
      }
      this.loading = false;
    })
  },

  methods: {
    /*openSidebar(task) {
      // console.log(task)
      this.$nuxt.$emit("open-sidebar", task);

      let el = event.target.offsetParent
      let scrollAmt = event.target.offsetLeft - event.target.offsetWidth;

      el.scrollTo({
        top: 0,
        left: scrollAmt,
        behavior: 'smooth'
      });

    },*/
    taskRightClick(payload) {
      this.taskContextMenu = true;
      const { event, task } = payload
      this.activeTask = task;
      this.contextCoords = { left: event.pageX+'px', top: event.pageY+'px' }
    },

    openSidebar(task) {
      console.log(task)
      // let project = [{
      //   projectId: this.project.id,
      //   project: {
      //     id: this.project.id
      //   }
      // }]
      this.$nuxt.$emit("open-sidebar", task);
    },
    
    closeContext() {
      this.taskContextMenu = false
      this.activeTask = {}
    },

    contextItemClick(key){
      switch (key) {
        case 'done-task':
          // statements_1
          this.taskMarkComplete(this.activeTask)
          break;
        case 'fav-task':
          this.taskSetFavorite(this.activeTask)
          break;
        case 'delete-task':
          this.deleteTask(this.activeTask)
          break;
        case 'assign-task':
          // statements_1
          break;
        default:
          alert("no task assigned")
          break;
      }
    },

    // task context menu methods ----------------------------------------

    taskSetFavorite(task) {
      // console.info("to be fav task", task)
      this.loading = true
      let isFav = this.favTasks.some((f) => f.taskId == task.id)
      // console.log(isFav)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => {
            console.log(msg)
            // this.popupMessages.push({ text: msg, variant: "success" })
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
            console.log(msg)
            // this.popupMessages.push({ text: msg, variant: "success" })
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
      // console.log(typeof task, this.activeTask)
      this.loading = true
      if (typeof task == "object" && Object.keys(task).length > 0) {
        console.log(task)
      } else {
        // alert("no task selected")
        task = this.activeTask
      }
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          // console.log(d)
          this.loading = false
          // this.popupMessages.push({ text: d.message, variant: "success" })
          // this.$nuxt.$emit("update-key")
          this.updateKey()
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
          // this.popupMessages.push({ text: e.message, variant: "warning" })
          this.loading = false
        })
    },

    deleteTask(task) {
      let del = confirm("Are you sure")
      this.loading = true
      if (del) {
        this.$store.dispatch("task/deleteTask", task).then(t => {

          if (t.statusCode == 200) {
            // this.popupMessages.push({ text: t.message, variant: "success" })
            this.updateKey()
          } else {
            // this.popupMessages.push({ text: t.message, variant: "warning" })
            console.warn(t.message);
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          // this.popupMessages.push({ text: e, variant: "danger" })
          console.log(e)
        })
      } else {
        this.loading = false
      }
    },

    updateKey() {
      // console.log("update-key event received", $event)
      this.loading = true
      // this.popupMessages.push({ text: $event, variant: "success" })
      this.$store.dispatch("todo/fetchTodos", {filter: 'all'}).then((res) => {
        // console.log(res)
        if (res.statusCode == 200) {
          this.key += 1
        }
        this.loading = false;
      })
    },
    showNewTodo() {
      // this.$refs.newsectionform.newSection = true
      this.newSection = true
    },

    async createTodo($event) {
      console.log('create-todo', $event)
      this.sectionLoading = true
      const todo = await this.$store.dispatch("todo/createTodo", {
        userId: JSON.parse(localStorage.getItem("user")).sub,
        title: $event,
      })
      // console.log(todo)
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
    async renameTodo() {
      this.loading = true
      const res = await this.$store.dispatch("todo/renameTodo", {
        id: this.todoId,
        data: {
          title: this.todoTitle
        }
      })
      // console.log("rename todotion output", res)
      if (res.statusCode = 200) {
        this.renameModal = false
        this.popupMessages.push({ text: "Section renamed", variant: "success" })
        this.updateKey()
      }
      this.loading = false
    },
    deleteTodo(todo) {
      // console.log(todo.id)
      this.$store.dispatch("todo/deleteTodo", todo)
        .then((d) => {
          this.popupMessages.push({ text: d.message, variant: "success" })
          this.updateKey()
        })
        .catch(e => console.log(e))
    },

    taskCheckIcon(data) {
      return data.value.statusId == 5 ? 'success' : 'secondary-sub2'
    },
    updateTaskStatus(item) {
      // console.log(item)
      this.loading = true
      this.$store.dispatch('task/updateTaskStatus', item)
        .then(() => {
          this.$nuxt.$emit("update-key")
        })
        .catch(e => console.log(e))
        .then(() => this.loading = false)
    },
    taskDragStart(e) {
      this.drag = true
      // console.log('drag start', e)
    },
    moveTask(e) {
      // this.taskDnDlist = tasks
      console.log(e.to)
      this.taskDnDsectionId = +e.to.dataset.section
      this.highlight = +e.to.dataset.section

    },
    taskDragEnd: _.debounce(async function(payload) {
      // console.log('task move end =>', payload)

      this.highlight = null
      console.log(payload.tasks)

      payload.tasks.forEach((e, i) => {
        e.tOrder = i
      })

      console.log(payload)

      // let taskDnD;
      let taskDnD = await this.$axios.$put("/todo/crossTodoDragDrop", { data: payload.tasks, todoId: payload.sectionId }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      /*if (this.taskDnDsectionId) {
        taskDnD = await this.$axios.$put("/todo/crossTodoDragDrop", { data: tasks, todoId: tasks[0].sectionId }, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          }
        })
      }*/
      /*else {
             taskDnD = await this.$axios.$put("/task/todoTask-dd", { data: this.taskDnDlist }, {
               headers: {
                 "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                 "Content-Type": "application/json"
               }
             })
           }*/

      console.log(taskDnD.message)
      if (taskDnD.statusCode != 200) {
        // console.warn(taskDnD.message)
        this.popupMessages.push({ msg: taskDnD.message, variant: 'danger' })
      }

      this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then((res) => {
      // console.log(res)
      if (res.statusCode == 200) {
        this.key += 1
      }
      this.loading = false;
    })
    }, 600),

    moveTodo(e) {
      // console.log("move section =>",e.relatedContext.list)
      this.highlight = +e.to.dataset.section
    },

    todoDragEnd: _.debounce(async function(todos) {

      todos.forEach((el, i) => {
        el.uOrder = i
      })

      console.log("ordered todos=>", todos)

      let todoDnD = await this.$axios.$put("/todo/dragdrop", { data: todos }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      console.log(todoDnD)

      if (todoDnD.statusCode != 200) {
        // console.info(todoDnD.message)
        this.popupMessages.push({ msg: todoDnD.message, variant: 'danger' })
      }

      this.$store.dispatch("todo/fetchTodos", { filter: 'all' }).then((res) => {
      // console.log(res)
      if (res.statusCode == 200) {
        this.key += 1
      }
      this.loading = false;
    })

    }, 600),

    /*openSidebar(task) {
      this.$nuxt.$emit("open-sidebar", task);
    },*/

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
      // console.log($event, this.orderBy)
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
      if ($event == 'createdAt') {
        if (this.orderBy == "asc") {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          })
        } else {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
            todo["tasks"] = todo.tasks.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
          })
        } else {
          this.localdata.forEach(function(todo) {
            todo["tasks"] = todo.tasks.sort((a, b) => b.priority.text.localeCompare(a.priority.text));
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
