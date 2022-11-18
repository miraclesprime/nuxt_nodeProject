<template>
  <client-only>
    <div id="favorite_wrapper">
      <page-title title="Favorites"></page-title>
      <favorite-actions v-on:change-viewing="changeView" v-on:change-sorting="changeSort"></favorite-actions>
      <div id="favorite-scroll-wrap" class="of-scroll-y position-relative">
        <!-- projects table -->
        <drag-table-simple :fields="projectTableFields" :tasks="sortedProject" :titleIcon="{icon:'briefcase'}" :componentKey="key" :drag="false" :sectionTitle="'Favorite Projects'" @row-click="projectRoute" :newTaskButton="{label: 'New Project', event: 'new-project', variant: 'secondary', hover: 'dark'}" v-on:table-sort="sortProject" @row-context="projectRightClick"></drag-table-simple>
        
        <!-- task table -->
        <drag-table-simple :fields="taskTableFields" :componentKey="key+1" :tasks="sortedTask" :sectionTitle="'Favorite Tasks'" :titleIcon="{icon:'check-circle', event:'task-icon-click'}" @task-icon-click="taskMarkComplete" :drag="false" v-on:new-task="openSidebar" v-on:table-sort="sortTask" @row-click="openSidebar" @row-context="taskRightClick"></drag-table-simple>
        <!-- <ul>
          <li v-for="item in sortedTaskUtil" :key="item.id">{{ item.title }}</li>
        </ul> -->
        <loading :loading="loading"></loading>
        <table-context-menu :items="projectContextItems" :show="projectContextMenu" :coordinates="contextCoords" @close-context="projectContextMenu = false" @item-click="projContextItemClick" ref="proj_menu"></table-context-menu>
        <table-context-menu :items="taskContextMenuItems" :show="taskContextMenu" :coordinates="contextCoords" @close-context="taskContextMenu = false" @item-click="taskContextItemClick" ref="task_menu"></table-context-menu>
      </div>
      <!-- project rename modal -->
      <bib-modal-wrapper v-if="renameModal" title="Rename project" @close="renameModal = false">
        <template slot="content">
          <div>
            <bib-input type="text" v-model.trim="renameProjectData.title" placeholder="Enter name..."></bib-input>
            <loading :loading="loading"></loading>
          </div>
        </template>
        <template slot="footer">
          <div class="d-flex justify-between">
            <bib-button label="Cancel" variant="light" pill @click="renameModal = false"></bib-button>
            <bib-button label="Rename" variant="success" pill v-on:click="renameProject"></bib-button>
          </div>
        </template>
      </bib-modal-wrapper>
    </div>
  </client-only>
</template>

<script>
import _ from 'lodash'
import { PROJECT_FAVORITES, TASK_FAVORITES, PROJECT_CONTEXT_MENU, TASK_CONTEXT_MENU } from '../../config/constants'
import { mapGetters } from 'vuex';
// import { sortTaskUtil } from '~/utils/taskSort.js'

export default {
  data() {
    return {
      projectTableFields: PROJECT_FAVORITES,
      taskTableFields: TASK_FAVORITES,
      sortedProject: [],
      renameModal: false,
      sortedTask: [],
      activeProject: {},
      renameProjectData: {},
      activeTask: {},
      key: 0,
      loading: false,
      view: 'all',
      sortName: '',
      projOrder: 'asc',
      taskOrder: 'asc',
      // sortedTaskUtil: [],
      projectContextItems: PROJECT_CONTEXT_MENU,
      taskContextMenuItems: TASK_CONTEXT_MENU,
      projectContextMenu: false,
      taskContextMenu: false,
      contextCoords: { },
    }
  },

  computed: {
    ...mapGetters({
      favProjects: 'project/getFavoriteProjects',
      favTasks: 'task/getFavTasks'
    })
  },


  mounted() {
    console.info("mounted favorites page");
    this.loading = true

    let user = localStorage.getItem("user")

    this.$store.dispatch("company/fetchCompanyMembers", user.subb)

    this.$store.dispatch('project/setFavProjects').then(() => {
      this.fetchProjects()
    })

    this.$store.dispatch('task/getFavTasks').then(() => {
      this.fetchTasks()
    })

  },

  methods: {

    async fetchProjects() {
      // this.loading = true

      let favProj = await JSON.parse(JSON.stringify(this.favProjects))

      // let favProj = fp.map(p => p.projects)
      let sorted = await favProj.sort((a, b) => a.projects.title.localeCompare(b.projects.title))

      // console.log("sorted fav project =>", sorted)
      let sortedArray = []
      sorted.forEach(p => { sortedArray.push(p.projects) })
      this.sortedProject = sortedArray
      this.key += 1
      this.loading = false
      // })
    },
    async fetchTasks() {
      // this.loading = true

      let favTask = await JSON.parse(JSON.stringify(this.favTasks))

      // let favTask = ft.map(s => s.task)
      let sorted = await favTask.sort((a, b) => a.task.title.localeCompare(b.task.title))

      // console.log("sorted fav task =>", sorted)
      let sortedArray = []
      sorted.forEach(t => { sortedArray.push(t.task) })
      this.sortedTask = sortedArray
      this.key += 1
      this.loading = false
      // })
    },

    projectRoute(project) {
      // console.log(project)
      this.$router.push('/projects/' + project.id)
    },

    projectRightClick(payload) {
      // console.log(payload, this.$refs.proj_menu.$el)
      this.taskContextMenu = false
      this.projectContextMenu = true
      // console.info(this.$refs.proj_menu.$el)
      const { event, task } = payload
      this.activeProject = task;
      this.renameProjectData = JSON.parse(JSON.stringify(task));
      this.contextCoords = { left: event.pageX+'px', top: event.pageY+'px' }
      // this.$refs.proj_menu.$el.style.left = payload.event.pageX + 'px'
      // this.$refs.proj_menu.$el.style.top = payload.event.pageY + 'px'
    },

    taskRightClick(payload) {
      this.projectContextMenu = false
      this.taskContextMenu = true
      const { event, task } = payload
      this.activeTask = task;
      // console.info(this.$refs.task_menu.$el)
      // this.$refs.task_menu.$el.style.left = payload.event.pageX + 'px'
      // this.$refs.task_menu.$el.style.top = payload.event.pageY + 'px'
      this.contextCoords = { left: event.pageX+'px', top: event.pageY+'px' }
    },

    taskCheckIcon(statusId) {
      // console.log(statusId)
      return statusId == 5 ? 'success' : 'secondary-sub1'
    },
    changeView($event) {
      // console.log($event)
      if ($event == 'complete') {
        this.fetchProjects().then(() => {
          let com = this.sortedProject.filter(p => p.statusId == 5)
          this.sortedProject = com
        })
        this.fetchTasks().then(() => {
          let com = this.sortedTask.filter(t => t.statusId == 5)
          this.sortedTask = com
        })

      }
      if ($event == 'incomplete') {
        this.fetchProjects().then(() => {
          let com = this.sortedProject.filter(p => p.statusId != 5)
          this.sortedProject = com
        })
        this.fetchTasks().then(() => {
          let com = this.sortedTask.filter(t => t.statusId != 5)
          this.sortedTask = com
        })
      }
      if ($event == 'all') {
        this.fetchProjects()
        this.fetchTasks()
      }
    },
    changeSort($event) {
      // sort by title
      // console.log($event)
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
    sortProject(field) {
      // console.log(field, this.projOrder)
      switch (field) {
        case 'title':
          if (this.projOrder == "asc") {
            this.sortedProject.sort((a, b) => a.title.localeCompare(b.title))
            this.projOrder = "desc"
          } else {
            this.sortedProject.sort((a, b) => b.title.localeCompare(a.title))
            this.projOrder = "asc"
          }
          this.key += 1
          break;
        case 'status':
          let sArr = []

          for (let i = 0; i < this.sortedProject.length; i++) {
            if (this.sortedProject[i].statusId) {
              sArr.unshift(this.sortedProject[i])
            } else {
              sArr.push(this.sortedProject[i])
            }
          }

          this.sortedProject = sArr;

          if (this.projOrder == "asc") {
            this.sortedProject.sort((a, b) => {
              if (a.status && b.status) { return a.status.text.localeCompare(b.status.text) }
            });
            this.projOrder = "desc"
          } else {
            this.sortedProject.sort((a, b) => {
              if (a.status && b.status) { return b.status.text.localeCompare(a.status.text) }
            });
            this.projOrder = "asc"
          }

          this.key += 1
          break;
        case 'priority':
          let pArr = []

          for (let i = 0; i < this.sortedProject.length; i++) {
            if (this.sortedProject[i].priorityId) {
              pArr.unshift(this.sortedProject[i])
            } else {
              pArr.push(this.sortedProject[i])
            }
          }

          this.sortedProject = pArr;

          if (this.projOrder == "asc") {
            this.sortedProject.sort((a, b) => {
              if (a.priority && b.priority) { return a.priority.text.localeCompare(b.priority.text) }
            });
            this.projOrder = "desc"
          } else {
            this.sortedProject.sort((a, b) => {
              if (a.priority && b.priority) { return b.priority.text.localeCompare(a.priority.text) }
            });
            this.projOrder = "asc"
          }
          this.key += 1
          break;
        case 'userId':
          let uArr = []

          for (let i = 0; i < this.sortedProject.length; i++) {
            if (this.sortedProject[i].userId) {
              uArr.unshift(this.sortedProject[i])
            } else {
              uArr.push(this.sortedProject[i])
            }
          }

          this.sortedProject = uArr;

          if (this.projOrder == "asc") {
            this.sortedProject.sort((a, b) => {
              if (a.user && b.user) { return a.user.firstName.localeCompare(b.user.firstName) }
            });
            this.projOrder = "desc"
          } else {
            this.sortedProject.sort((a, b) => {
              if (a.user && b.user) { b.user.firstName.localeCompare(a.user.firstName) }
            });
            this.projOrder = "asc"
          }
          this.key += 1
          break;
        case 'dueDate':
          let dArr = []

          for (let i = 0; i < this.sortedProject.length; i++) {
            if (this.sortedProject[i].userId) {
              dArr.unshift(this.sortedProject[i])
            } else {
              dArr.push(this.sortedProject[i])
            }
          }

          this.sortedProject = dArr;
          if (this.projOrder == "asc") {
            this.sortedProject.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(a.dueDate) - new Date(b.dueDate) }
            });
            this.projOrder = "desc"
          } else {
            this.sortedProject.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(b.dueDate) - new Date(a.dueDate) }
            });
            this.projOrder = "asc"
          }
          this.key += 1
          break;
        default:
          this.fetchProjects()
          break;
      }
    },
    async sortTask(field) {
      // console.log(field, this.taskOrder)

      switch (field) {
        case 'title':
          if (this.taskOrder == "asc") {
            this.sortedTask.sort((a, b) => a.title.localeCompare(b.title))
            this.taskOrder = "desc"
          } else {
            this.sortedTask.sort((a, b) => b.title.localeCompare(a.title))
            this.taskOrder = "asc"
          }
          this.key += 1
          break;
        case 'status':
          if (this.taskOrder == "asc") {
            this.sortedTask.sort((a, b) => a.status.text.localeCompare(b.status.text));
            this.taskOrder = "desc"

          } else {
            this.sortedTask.sort((a, b) => b.status.text.localeCompare(a.status.text));
            this.taskOrder = "asc"

          }
          this.key += 1
          break;
        case 'priority':
          if (this.taskOrder == "asc") {
            this.sortedTask.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
            this.taskOrder = "desc"

          } else {
            this.sortedTask.sort((a, b) => b.priority.text.localeCompare(a.priority.text));
            this.taskOrder = "asc"

          }
          this.key += 1
          break;
        case 'userId':
          if (this.taskOrder == "asc") {
            this.sortedTask.sort((a, b) => {
              if (a.user && b.user) { return a.user.firstName.localeCompare(b.user.firstName) }
            });
            this.taskOrder = "desc"
          } else {
            this.sortedTask.sort((a, b) => {
              if (a.user && b.user) { return b.user.firstName.localeCompare(a.user.firstName) }
            });
            this.taskOrder = "asc"
          }
          this.key += 1
          break;
        case 'dueDate':
          if (this.taskOrder == "asc") {
            this.sortedTask.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(a.dueDate) - new Date(b.dueDate) }
            });
            this.taskOrder = "desc"
          } else {
            this.sortedTask.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(b.dueDate) - new Date(a.dueDate) }
            });
            this.taskOrder = "asc"
          }
          this.key += 1
          break;
        case "project":
          // let favTask = await _.cloneDeep(this.favTasks)
          // let favTask = await JSON.parse(JSON.stringify(this.favTasks))
          let newArr = []

          // console.log('favTask=>',favTask)

          for (let i = 0; i < this.sortedTask.length; i++) {
            if (this.sortedTask[i].project[0]) {
              newArr.unshift(this.sortedTask[i])
            } else {
              newArr.push(this.sortedTask[i])
            }
          }

          newArr.sort((a, b) => {
            if (a.project[0] && b.project[0]) {
              return a.project[0].project.title.localeCompare(b.project[0].project.title);
            }
          });
          this.sortedTask = newArr;
          this.key += 1
          break;
        default:
          this.fetchTasks()
          break;
      }
      this.key += 1
    },

    projectCheckActive() {
      for (let i = 0; i < this.projectTableFields.length; i++) {
        if (this.projectTableFields[i].header_icon) {
          this.projectTableFields[i].header_icon.isActive = false
        }

        if (this.projectTableFields[i].header_icon && this.projectTableFields[i].key == this.sortName) {
          this.projectTableFields[i].header_icon.isActive = true
        }
      }
    },
    taskCheckActive() {
      for (let i = 0; i < this.taskTableFields.length; i++) {
        if (this.taskTableFields[i].header_icon) {
          this.taskTableFields[i].header_icon.isActive = false
        }

        if (this.taskTableFields[i].header_icon && this.taskTableFields[i].key == this.sortName) {
          this.taskTableFields[i].header_icon.isActive = true
        }
      }
    },

    projContextItemClick(key){
      console.log(key)
      switch (key) {
        case 'fav-project':
          console.log('fav project')
          this.projSetFavorite(this.activeProject)
          break;
        case 'rename-project':
          console.log('rename project')
          this.renameModal = true
          break;
        case 'delete-project':
          console.log('delete project')
          this.projDeleteTask(this.activeProject)
          break;
        case 'share-project':
          console.log('share project')
          // statements_1
          break;
        case 'report-project':
          console.log('report project')
          break;
        default:
          alert("no project assigned")
          break;
      }
    },

    taskContextItemClick(key){
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

    // project context menu methods ------------------------

    projSetFavorite(project) {
      // console.info("to be fav task", task)
      this.loading = true
      let isFav = this.favProjects.some((f) => f.projects.id == project.id)

      if (isFav) {
        this.$store.dispatch("project/removeFromFavorite", { id: project.id })
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
        this.$store.dispatch("project/addToFavorite", { id: project.id })
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

    projDeleteTask(project) {
      let del = confirm("Are you sure")
      this.loading = true
      if (del) {
        this.$store.dispatch("project/deleteProject", project).then(t => {

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

    async renameProject() {
      this.loading = true
      const proj = await this.$axios.put("/project", {
        id: this.renameProjectData.id,
        data: {
          title: this.renameProjectData.title
        },
        user: this.renameProjectData.user
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      // console.log(proj)
      if (proj.data.statusCode == 200) {
        this.$store.dispatch("project/setSingleProject", proj.data.data)
        this.updateKey()
        this.renameModal = false
      }
      this.renameProjectData = {}
      this.loading = false
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
      console.log(typeof task, this.activeTask)
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
      // console.log("update-key event received", this.templateKey)
      this.$store.dispatch('project/setFavProjects').then(() => {
        this.fetchProjects()
      })

      this.$store.dispatch('task/getFavTasks').then(() => {
        this.fetchTasks()
      })
    },

    // task context menu methods ------------------------------------------

    openSidebar(task) {
      this.$nuxt.$emit("open-sidebar", task);
      /*this.$store.dispatch('task/setSingleTask', {...task, projectId: projectId})
      this.$store.dispatch('task/fetchTeamMember', { id: task.id } )*/
    },
    newProject() {
      console.log('new project')
      this.$nuxt.$emit('create-project-modal')
    }
  }
}

</script>
<style lang="scss" scoped>
#favorite-scroll-wrap {
  max-height: calc(100vh - 160px);
}

</style>
