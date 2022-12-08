<template>
  <client-only>
    <div id="task-page-wrapper" class="task-page-wrapper">
      <page-title title="Tasks"></page-title>
      <user-name-task-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:new-task="toggleSidebar($event)"></user-name-task-actions>
      <div id="task-table-wrapper" class="task-table-wrapper position-relative of-scroll-y">
        <template v-if="gridType == 'list'">
          <template>
            <drag-table-simple :key="key" :componentKey="key" :titleIcon="{icon:'check-circle', event:'task-icon-click'}" @task-icon-click="taskMarkComplete" :fields="taskFields" :tasks="tasks" :sectionTitle="'Department'" :drag="false" v-on:new-task="toggleSidebar($event)" @table-sort="sortBy" @row-context="taskRightClick" @row-click="openSidebar"></drag-table-simple>
            <!-- table context menu -->
            <table-context-menu :items="contextMenuItems" :show="taskContextMenu" :coordinates="contextCoords" :activeItem="activeTask" @close-context="closeContext" @item-click="contextItemClick"></table-context-menu>
          </template>
          <!-- <template v-else>
            <div>
              <span id="projects-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
                <bib-icon icon="warning"></bib-icon> No tasks found
              </span>
            </div>
          </template> -->
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
      activeTask: {},
      contextMenuItems: TASK_CONTEXT_MENU,
      loading: false,
      flag: false,
      viewName: "all",
      orderBy: 'desc',
      key: 100,
      popupMessages: [],
      contextCoords: {},
      userfortask: "",
      tasks: [],
      taskOrder: 'asc'
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      teamMembers: "user/getTeamMembers"
      // tasks: "company/getCompanyTasks",
      // favTasks: 'task/getFavTasks'
    }),
  },

  created() {
    if (process.client) {

      // this.userfortask = sessionStorage.getItem("usertaskadmin")
      
      this.$nuxt.$on('change-grid-type', ($event) => {
        this.gridType = $event;
      })
      /*this.$nuxt.$on("update-key", () => {
        // console.log('updated key event received')
        let user = JSON.parse(localStorage.getItem("user"))
        this.$store.dispatch('company/setCompanyTasks', { companyId: user.subb }).then(() => { this.key += 1 })
      })
      this.loading = true
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'all' }).then((res) => {
        this.loading = false;
      })*/
    }
  },

  watch: {
        '$route.query': {
            immediate: true,
            handler(newVal) {
                this.userfortask = this.teamMembers.find((u) => {
                  if(u.email == newVal.email) {
                    return u;
                  }
                })
                this.fetchUserTasks()
            }
        }
    },

  mounted() {

    if(process.client) {

      if(!this.$route.query.email) {
        this.$router.push({ path: "/dashboard"})
      }

      _.delay(() => {
          this.userfortask = this.teamMembers.find((u) => {
            if(u.email == this.$route.query.email) {
              return u;
            }
          })
          this.fetchUserTasks()
      }, 5000);
    }
    
  },

  created() {
    if (process.client) {
      
      this.$nuxt.$on("update-key", () => {
        this.fetchUserTasks()
      })  
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

        // if(res.data.statusCode == 403) {
        //     alert('403 error you are not allowed to see the tasks of other users because you are not admin. Please click on any other page link.')
        //     this.tasks = res.data.data
        //     return false;
        // }

        if (res.data.statusCode == 200) {
          // console.log(res.data)
          this.tasks = res.data.data
        } else {
          console.error(e);
        }
      this.loading = false
      }
    },
    updateKey($event) {
      // console.log("update-key event received", $event)
      this.popupMessages.push({ text: $event, variant: "success" })
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.fetchUserTasks()
      // this.$store.dispatch("company/setCompanyTasks", { companyId: compid, filter: "all" }).then(() => {
      //   this.key += 1
      // })
    },

    openSidebar(task) {
      console.log(task)
      this.$nuxt.$emit("open-sidebar", task);
    },

    taskRightClick(payload) {
      this.taskContextMenu = true;
      const { event, task } = payload
      this.activeTask = task;
      this.contextCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
    },

    closeContext() {
      this.taskContextMenu = false
      this.activeTask = {}
    },

    contextItemClick(key) {
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
          this.$store.dispatch("task/setSingleTask", d).then(() => {
            this.key += 1;
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
    sortBy($event) {

      // console.log($event)

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
          break;

        case 'priority':
          if (this.taskOrder == "asc") {
            this.tasks.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
            this.taskOrder = "desc"

          } else {
            this.tasks.sort((a, b) => b.priority.text.localeCompare(a.priority.text));
            this.taskOrder = "asc"

          }
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
          break;

        case 'dueDate':
          if (this.taskOrder == "asc") {
            this.tasks.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(a.dueDate) - new Date(b.dueDate) }
            });
            this.taskOrder = "desc"
          } else {
            this.tasks.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(b.dueDate) - new Date(a.dueDate) }
            });
            this.taskOrder = "asc"
          }
          this.key += 1
          break;

        case 'startDate':
          if (this.taskOrder == "asc") {
            this.tasks.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(a.startDate) - new Date(b.startDate) }
            });
            this.taskOrder = "desc"
          } else {
            this.tasks.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(b.startDate) - new Date(a.startDate) }
            });
            this.taskOrder = "asc"
          }
          this.key += 1
          break;

        case "project":
          let newArr = []

          for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].project[0]) {
              newArr.unshift(this.tasks[i])
            } else {
              newArr.push(this.tasks[i])
            }
          }

          if (this.taskOrder == "asc") { 
            newArr.sort((a, b) => {
              if (a.project[0].length > 0 && b.project[0].length > 0) {
                return a.project[0].project.title.localeCompare(b.project[0].project.title);
              }
            });
            this.taskOrder = "desc"
          } else {
              newArr.sort((a, b) => {
              if (a.project[0].length > 0 && b.project[0].length > 0) {
                return b.project[0].project.title.localeCompare(a.project[0].project.title);
              }
            });
            this.taskOrder = "asc"
          }

          this.tasks = newArr;
          this.key += 1
          break;
        default:
          this.fetchTasks()
          break;
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
