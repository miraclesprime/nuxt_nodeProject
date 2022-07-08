<template>
  <client-only>
    <div id="my-tasks-page-wrapper" class="mytask-page-wrapper">
      <page-title title="My Tasks"></page-title>
      <user-tasks-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:create-task="toggleSidebar($event)" v-on:add-section="showNewTodo" />
      <div>
        <new-section-form :showNewsection="newSection" :showLoading="sectionLoading" :showError="sectionError" v-on:toggle-newsection="newSection = $event" v-on:create-section="createTodo"></new-section-form>
        <div id="mytask-table-wrapper" class="h-100 mytask-table-wrapper position-relative of-scroll-y">
          <template v-if="gridType == 'list'">
            <template v-if="todos.length">
              <bib-table v-for="(todo, index) in localdata" :key="index + viewName + '-' + key" :fields="taskFields" :sections="todo.tasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: todo.title}" :headless="index > 0" class="border-gray4 bg-white" @file-title-sort="sortTitle" @file-project-sort="sortProject" @file-status-sort="sortByStatus" @file-startDate-sort="sortByStartDate" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
                <template #cell(title)="data">
                  <div class="d-flex gap-05 align-center">
                    <bib-icon icon="check-circle" :scale="1.5" :variant="taskCheckIcon(data)" class="cursor-pointer" @click="updateTaskStatus(data.value)"></bib-icon>
                    <span class="text-dark text-left cursor-pointer flex-grow-1" style=" line-height:1.25;" @click="$nuxt.$emit('open-sidebar', data.value)">{{ data.value.title }}</span>
                  </div>
                  <!-- <div :id="'cell'+data.value.id" class="text-dark text-left cursor-pointer" @click="$nuxt.$emit('open-sidebar', data.value)">
                  {{ data.value.title }}
                </div> -->
                </template>
                <template #cell(projectId)="data">
                  <project-info :projectId="data.value.project[0] ? data.value.project[0].projectId : null"></project-info>
                </template>
                <template #cell(owner)="data">
                  <user-info v-if="data.value.userId" :userId="data.value.userId"></user-info>
                </template>
                <template #cell(status)="data">
                  <status-comp :status="data.value.status"></status-comp>
                </template>
                <template #cell(createdAt)="data">
                  <span :id="'projects-' + data.value.createdAt + '-text'" class="text-dark text-truncate" v-format-date="data.value.createdAt"></span>
                </template>
                <template #cell(dueDate)="data">
                  <span :id="'projects-' + data.value.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.dueDate"></span>
                </template>
                <template #cell(priority)="data">
                  <priority-comp :priority="data.value.priority"></priority-comp>
                </template>
              </bib-table>
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
import { USER_TASKS } from "../../config/constants";
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
      orderBy: 'desc',
      flag: false,
      key: 100,
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
    }
  },

  computed: {
    ...mapGetters({
      tasks: 'user/getUserTasks',
      todos: "todo/getAllTodos",
    }),
    /*localdata() {
      return JSON.parse(JSON.stringify(this.todos))
    }*/
  },

  watch: {
    todos(newVal) {
      // console.info(newVal)
      this.localdata = JSON.parse(JSON.stringify(newVal))
    }
  },

  created() {
    if (process.client) {
      this.$nuxt.$on('change-grid-type', ($event) => {
        this.gridType = $event;
      })
      this.$nuxt.$on("update-key", () => {
        // console.log('updated key event received')
        this.$store.dispatch("todo/fetchTodos").then(() => { this.key += 1 })
      })
    }
  },

  mounted() {
    this.loading = true
    // this.$store.dispatch('user/setUserTasks', { filter: 'all' }).then((res) => {
    this.$store.dispatch("todo/fetchTodos").then((res) => {
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
    updateKey() {
      // console.log("update-key event received", $event)
      this.loading = true
      // this.popupMessages.push({ text: $event, variant: "success" })
      this.$store.dispatch("todo/fetchTodos").then((res) => {
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
      console.log(todo.id)
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
    taskDragEnd: _.debounce(async function(e) {
      // this.drag = false
      // console.log('move end =>', e)
      this.highlight = null

      console.log("move end (section id) =>", e.to.dataset.section)

      let tasklist = this.localdata.filter((t) => t.id == e.to.dataset.section)

      // console.log(tasklist)

      tasklist[0].tasks.forEach((e, i) => {
        e.tOrder = i
      })

      console.log(tasklist[0].tasks)

      let taskDnD;
      if (this.taskDnDsectionId) {
        taskDnD = await this.$axios.$put("/todo/crossTodoDragDrop", { data: tasklist[0].tasks, todoId: this.taskDnDsectionId }, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          }
        })
      } else {
        taskDnD = await this.$axios.$put("/task/todoTask-dd", { data: this.taskDnDlist }, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          }
        })
      }

      console.log(taskDnD.message)
      if (taskDnD.statusCode == 200) {
        // this.$emit("update-key")
      } else {
        console.warn(taskDnD.message)
      }
    }, 600),

    moveTodo(e) {
      // console.log("move section =>",e.relatedContext.list)
      this.highlight = +e.to.dataset.section
    },

    todoDragEnd: _.debounce(async function(e) {

      this.loading = true
      this.localdata.forEach((el, i) => {
        el.uOrder = i
      })

      console.log("ordered todos =>", this.localdata)

      let todoDnD = await this.$axios.$put("/todo/dragdrop", { data: this.localdata }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      // console.log(todoDnD)

      if (todoDnD.statusCode == 200) {
        console.info(todoDnD.message)
        // this.$store.dispatch("user/fetchUserTodos")
      }

      this.key += 1
      this.loading = false

    }, 600),

    /*openSidebar(task) {
      this.$nuxt.$emit("open-sidebar", task);
    },*/

    filterView($event) {
      this.loading = true
      if ($event == 'complete') {
        this.$store.dispatch('user/setUserTasks', { filter: 'complete' }).then((res) => {
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'complete'
      }
      if ($event == 'incomplete') {
        this.$store.dispatch('user/setUserTasks', { filter: 'incomplete' }).then((res) => {
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'incomplete'
      }
      if ($event == 'all') {
        this.$store.dispatch('user/setUserTasks', { filter: 'all' }).then((res) => {
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'all'
      }
      this.loading = false

    },

    // Sort By Action List
    sortBy($event) {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: $event, order: this.orderBy })
      this.key += 1
    },

    // Sort By Head Actions
    sortTitle() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'name', order: this.orderBy })
      this.key += 1;
    },

    sortProject() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'projectId', order: this.orderBy })
      this.key += 1;
    },

    sortByStatus() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'status', order: this.orderBy })
      this.key += 1;
    },

    sortByStartDate() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'createdAt', order: this.orderBy })
      this.key += 1;
    },

    sortByDueDate() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'dueDate', order: this.orderBy })
      this.key += 1;
    },

    sortByPriority() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'priority', order: this.orderBy })
      this.key += 1;
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
