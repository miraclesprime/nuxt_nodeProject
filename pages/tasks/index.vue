<template>
  <client-only>
    <div id="task-page-wrapper" class="task-page-wrapper ">
      <page-title title="Tasks"></page-title>
      <company-tasks-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:new-task="toggleSidebar($event)"></company-tasks-actions>
      <div id="task-table-wrapper" class="task-table-wrapper position-relative of-scroll-y" :class="{ 'bg-light': gridType != 'list'}">
        <template v-if="gridType == 'list'">
          <template v-if="tasks.length">
            <drag-table-simple :key="key" :componentKey="key" :fields="taskFields" :tasks="tasks" :sectionTitle="'Department'" :titleIcon="{icon:'check-circle', event:'task-icon-click'}" @task-icon-click="taskMarkComplete" :drag="false" v-on:new-task="toggleSidebar($event)" @table-sort="sortBy" @row-context="taskRightClick" @row-click="openSidebar" ></drag-table-simple>

            <!-- table context menu -->
            <table-context-menu :items="contextMenuItems" :show="taskContextMenu" :coordinates="contextCoords" :activeItem="activeTask" @close-context="closeContext" @item-click="contextItemClick" ></table-context-menu>

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
                <div v-for="(item, index) in tasks" :key="index + '-' + key" >
                  <task-grid :task="item" v-on:update-key="updateKey" @open-sidebar="openSidebar" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <loading :loading="loading"></loading>
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
import { mapGetters } from "vuex";
import { COMPANY_TASK_FIELDS as TaskFields, TASK_CONTEXT_MENU } from '../../config/constants'

export default {
  name: 'Tasks',
  data() {
    return {
      title: "Tasks",
      gridType: "list",
      taskFields: TaskFields,
      taskContextMenu: false,
      activeTask: {},
      contextMenuItems: TASK_CONTEXT_MENU,
      loading: false,
      flag: false,
      viewName: "all",
      orderBy: 'desc',
      key: 100,
      popupMessages: [],
      contextCoords: { },
    }
  },
  computed: {
    ...mapGetters({
      token: "token/getToken",
      user: "user/getUser",
      tasks: "company/getCompanyTasks",
      favTasks: 'task/getFavTasks'
    }),
  },

  created() {
    if (process.client) {
      this.$nuxt.$on('change-grid-type', ($event) => {
        this.gridType = $event;
      })
      this.$nuxt.$on("update-key", () => {
        // console.log('updated key event received')
        let user = JSON.parse(localStorage.getItem("user"))
        this.$store.dispatch('company/setCompanyTasks', { companyId: user.subb }).then(() => { this.key += 1 })
      })
      this.loading = true
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'all' }).then((res) => {
        this.loading = false;
      })
    }
  },

  methods: {
    updateKey($event) {
      // console.log("update-key event received", $event)
      this.popupMessages.push({ text: $event, variant: "success" })
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store.dispatch("company/setCompanyTasks", { companyId: compid, filter: "all" }).then(() => {
        this.key += 1
      })
    },

    openSidebar(task, scroll) {
      // console.log(task)
      this.$nuxt.$emit("open-sidebar", {...task, scrollId: scroll});
    },

    taskRightClick(payload) {
      this.taskContextMenu = true;
      const { event, task } = payload
      this.activeTask = task;
      this.$store.dispatch('task/setSingleTask', task)
      this.contextCoords = { left: event.pageX+'px', top: event.pageY+'px' }
    },

    closeContext() {
      this.taskContextMenu = false
      this.activeTask = {}
    },

    contextItemClick(key){
      console.log(key)
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
        case 'gotoTeam':
          // this.openSidebar(this.activeTask, 'comment')
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
          this.$store.dispatch("task/setSingleTask", d).then(() => {
            this.updateKey()
          })
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

      console.log($event)

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
      // console.log($event)
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
