<template>
  <div id="favorite_wrapper">
    <page-title title="Favorites"></page-title>
    <favorite-actions v-on:change-viewing="projectView"></favorite-actions>
    <div id="favorite-scroll-wrap" class="of-scroll-y position-relative">
      <bib-table :fields="projectTableFields" class="border-gray4 bg-white" :sections="sortedProject" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Favorite Projects'}" :key="'fproj'+key">
        <template #cell(title)="data">
          <div class="d-flex align-center text-dark " :id="'projects-' + data.value.title">
            <bib-icon icon="briefcase" variant="gray5" :scale="1.1" class="mr-025"></bib-icon>
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
          <span :id="'projects-' + data.value.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.dueDate"></span>
        </template>
      </bib-table>
      <!-- task table -->
      <bib-table :fields="taskTableFields" class="border-gray4 bg-white" :sections="sortedTask" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Favorite Tasks'}" :key="'ftasks'+key">
        <template #cell(title)="data">
          <div class="d-flex gap-05 align-center" :id="'projects-' + data.value.title">
            <bib-icon icon="check-circle" :scale="1.5" :variant="taskCheckIcon(data)"></bib-icon>
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
          <span :id="'projects-' + data.value.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.dueDate"></span>
          <!-- <div class="justify-between text-dark" :id="'projects-' + data.value.dueDate">
            </div> -->
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
      sortName: 'order',
    }
  },

  computed: {
    ...mapGetters({
      favoriteProjects: 'favorite/getFavProjects',
      favoriteTasks: 'favorite/getFavTasks'
    })
  },


  mounted() {
    // this.loading = true

    this.$store.dispatch('favorite/fetchFavProjects').then(() => {
      this.fetchProjects()
    })

    this.$store.dispatch('favorite/fetchFavTasks').then(() => {
      this.fetchTasks()
    })

  },

  methods: {
    async fetchProjects() {
      this.loading = true
      // this.$store.dispatch('favorite/fetchFavProjects').then(() => {
      // console.log(fp)
      let favProj = await JSON.parse(JSON.stringify(this.favoriteProjects))

      // let favProj = fp.map(p => p.projects)
      let sorted = await favProj.sort((a, b) => b.title.toUpperCase() - a.title.toUpperCase())

      console.log("sorted =>", sorted)
      this.sortedProject = sorted
      this.key += 1
      this.loading = false
      // })
    },
    async fetchTasks() {
      this.loading = true
      // this.$store.dispatch('favorite/fetchFavTasks').then(() => {
      // console.log(ft)
      let favTask = await JSON.parse(JSON.stringify(this.favoriteTasks))

      // let favTask = ft.map(s => s.task)
      let sorted = await favTask.sort((a, b) => a.order - b.order)

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

    taskCheckIcon(data) {
      return data.value.statusId == 5 ? 'success' : 'secondary-sub1'
    },
    projectView($event) {
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
    }
  }
}

</script>
<style lang="scss" scoped>
#favorite-scroll-wrap {
  max-height: calc(100vh - 160px);
}

</style>
