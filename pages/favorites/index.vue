<template>
<client-only>
  <div id="favorite_wrapper">
    <page-title title="Favorites"></page-title>
    <favorite-actions v-on:change-viewing="changeView" v-on:change-sorting="changeSort"></favorite-actions>
    <div id="favorite-scroll-wrap" class="of-scroll-y position-relative">
      <bib-table :key="'fproj'+key" :fields="projectTableFields" class="border-gray4 bg-white" :sections="sortedProject" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Favorite Projects'}" @file-title-sort="sortProject('name')" @file-status-sort="sortProject('status')" @file-priority-sort="sortProject('priority')" @file-owner-sort="sortProject('owner')" @file-dueDate-sort="sortProject('dueDate')">
        <template #cell(title)="data">
          <div class="d-flex gap-05 align-center text-dark " :id="'projects-' + data.value.title">
            <bib-icon icon="briefcase" variant="gray5" :scale="1.1"></bib-icon>
            <nuxt-link :to="'/projects/'+data.value.id" class="text-dark">{{data.value.title}}</nuxt-link>
          </div>
        </template>
        <template #cell(department)="data">
          Department
        </template>
        <template #cell(status)="data">
          <div class="d-flex gap-05 align-center">
            <div class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-' + favoriteStatusVariable(data.value.status ? data.value.status.text : '')"></div>
            <span class="text-dark ">{{ favoriteStatusLabel(data.value.status ? data.value.status.text : '') }}</span>
          </div>
        </template>
        <template #cell(priority)="data">
          <div class="d-flex gap-05 align-center">
            <bib-icon icon="urgent-solid" :scale="1.1" :variant="favoritePriorityVariable(data.value.priority ? data.value.priority.text : '')"></bib-icon>
            <span id="project-text" :class="'text-' + favoritePriorityVariable(data.value.priority ? data.value.priority.text : '')" class="text-capitalize">
              {{ data.value.priority ? data.value.priority.text : '' }}
            </span>
          </div>
        </template>
        <template #cell(owner)="data">
          <user-info :userId="data.value.userId"></user-info>
        </template>
        <template #cell(dueDate)="data">
          <format-date :datetime="data.value.dueDate"></format-date>
        </template>
      </bib-table>
      <!-- task table -->
      <bib-table :key="'ftasks'+key" :fields="taskTableFields" class="border-gray4 bg-white" :sections="sortedTask" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Favorite Tasks'}" @file-title-sort="sortTask('name')" @file-status-sort="sortTask('status')" @file-priority-sort="sortTask('priority')" @file-owner-sort="sortTask('owner')" @file-dueDate-sort="sortTask('dueDate')">
        <template #cell(title)="data">
          <div class="d-flex gap-05 align-center" :id="'projects-' + data.value.title">
            <bib-icon icon="check-circle" :scale="1.5" :variant="taskCheckIcon(data.value.statusId)"></bib-icon>
            <!-- <bib-icon icon="briefcase" variant="gray5" :scale="1.1" class="mr-025"></bib-icon> -->
            <span :id="'projects-' + data.value.title + '-text'" class="text-dark text-left cursor-pointer" style="min-width: 100px; display: inline-block;  line-height:1.25;">{{data.value.title}}</span>
          </div>
        </template>
        <template #cell(owner)="data">
          <user-info :userId="data.value.userId"></user-info>
        </template>
        <template #cell(status)="data">
          <div class="d-flex gap-05 align-center">
            <div class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-' + favoriteStatusVariable(data.value.status ? data.value.status.text : '')" :id="'projects-' + data.value.statusId ? data.value.statusId : ''">
            </div>
            <span :id="'projects-' + data.value.statusId ? data.value.statusId : '' + '-text'" class="text-dark text-truncate">{{ favoriteStatusLabel(data.value.status ? data.value.status.text : "") }}</span>
          </div>
        </template>
        <template #cell(dueDate)="data">
          <format-date :datetime="data.value.dueDate"></format-date>
        </template>
        <template #cell(priority)="data">
          <div class="d-flex gap-05 align-center">
            <bib-icon icon="urgent-solid" :scale="1.1" :variant="favoritePriorityVariable(data.value.priority ? data.value.priority.text : '')"></bib-icon>
            <span id="project-text" :class="'text-' + favoritePriorityVariable(data.value.priority ? data.value.priority.text : '')" class="text-capitalize">
              {{ data.value.priority ? data.value.priority.text : '' }}
            </span>
          </div>
        </template>
      </bib-table>
      <loading :loading="loading"></loading>
    </div>
  </div>
</client-only>
</template>

<script>
import { PROJECT_FAVORITES, TASK_FAVORITES } from '../../config/constants'
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      projectTableFields: PROJECT_FAVORITES,
      taskTableFields: TASK_FAVORITES,
      sortedProject: [],
      sortedTask: [],
      key: 0,
      loading: false,
      view: 'all',
      sortName: '',
      projOrder: 'asc',
      taskOrder: 'asc',
    }
  },

  computed: {
    ...mapGetters({
      favoriteProjects: 'favorite/getFavProjects',
      favoriteTasks: 'favorite/getFavTasks'
    })
  },


  mounted() {
    this.loading = true

    this.$store.dispatch('favorite/fetchFavProjects').then(() => {
      this.fetchProjects()
    })

    this.$store.dispatch('favorite/fetchFavTasks').then(() => {
      this.fetchTasks()
    })

  },

  methods: {
    async fetchProjects() {
      // this.loading = true

      let favProj = await JSON.parse(JSON.stringify(this.favoriteProjects))

      // let favProj = fp.map(p => p.projects)
      let sorted = await favProj.sort((a, b) => a.title.localeCompare(b.title))

      // console.log("sorted =>", sorted)
      this.sortedProject = sorted
      this.key += 1
      this.loading = false
      // })
    },
    async fetchTasks() {
      // this.loading = true

      let favTask = await JSON.parse(JSON.stringify(this.favoriteTasks))

      // let favTask = ft.map(s => s.task)
      let sorted = await favTask.sort((a, b) => a.title.localeCompare(b.title))

      // console.log("sorted =>", sorted)
      this.sortedTask = sorted
      this.key += 1
      this.loading = false
      // })
    },
    favoriteStatusLabel(status) {
      switch (status) {
        case 'Delayed':
          return 'Delayed'
        case 'In-Progress':
          return 'In-Progress'
        case 'Done':
          return 'Done'
        case 'Waiting':
          return 'Waiting'
        case 'Not Started':
          return 'Not Started'
      }
    },
    favoriteStatusVariable(status) {
      switch (status) {
        case 'Delayed':
          return 'danger'
        case 'In-Progress':
          return 'primary'
        case 'Done':
          return 'success'
        case 'Waiting':
          return 'warning'
        case 'Not Started':
          return 'secondary'
      }
    },
    favoritePriorityVariable(priority) {
      switch (priority) {
        case 'high':
          return 'danger'
        case 'medium':
          return 'orange'
        case 'low':
          return 'success'
        case 'none':
          return 'secondary'
      }
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
    sortProject(field) {
      // console.log(field, this.projOrder)
      switch (field) {
        case 'name':
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
          if (this.projOrder == "asc") {
            this.sortedProject.sort((a, b) => a.status.text.localeCompare(b.status.text));
            this.projOrder = "desc"
          } else {
            this.sortedProject.sort((a, b) => b.status.text.localeCompare(a.status.text));
            this.projOrder = "asc"
          }
          this.key += 1
          break;
        case 'priority':
          if (this.projOrder == "asc") {
            this.sortedProject.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
            this.projOrder = "desc"
          } else {
            this.sortedProject.sort((a, b) => b.priority.text.localeCompare(a.priority.text));
            this.projOrder = "asc"
          }
          this.key += 1
          break;
        case 'owner':
          if (this.projOrder == "asc") {
            this.sortedProject.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
            this.projOrder = "desc"
          } else {
            this.sortedProject.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
            this.projOrder = "asc"
          }
          this.key += 1
          break;
        case 'dueDate':
          if (this.projOrder == "asc") {
            this.sortedProject.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            this.projOrder = "desc"
          } else {
            this.sortedProject.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
            this.projOrder = "asc"
          }
          this.key += 1
          break;
        default:
          this.fetchProjects()
          break;
      }
    },
    sortTask(field) {
      // console.log(field, this.taskOrder)
      switch (field) {
        case 'name':
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
        case 'owner':
          if (this.taskOrder == "asc") {
            this.sortedTask.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
            this.taskOrder = "desc"
          } else {
            this.sortedTask.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
            this.taskOrder = "asc"
          }
          this.key += 1
          break;
        case 'dueDate':
          if (this.taskOrder == "asc") {
            this.sortedTask.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            this.taskOrder = "desc"
          } else {
            this.sortedTask.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
            this.taskOrder = "asc"
          }
          this.key += 1
          break;
        default:
          this.fetchTasks()
          break;
      }
    },
    changeSort($event) {
      // sort by title
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
  }
}

</script>
<style lang="scss" scoped>
#favorite-scroll-wrap {
  max-height: calc(100vh - 160px);
}

</style>
