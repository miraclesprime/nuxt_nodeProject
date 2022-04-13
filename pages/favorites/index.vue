<template>
  <div id="favorite_wrapper">
    <page-title title="Favorites"></page-title>
    <favorite-actions />
    <div id="favorite-scroll-wrap" class="of-scroll-y position-relative">
      <bib-table :fields="projectTableFields" class="border-gray4 bg-white" :sections="favoriteProjects" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Favorite Projects'}" >
        <template #cell(title)="data">
          <div class="d-flex align-center text-dark cursor-pointer" :id="'projects-' + data.value.projects.title">
            <bib-icon icon="briefcase" variant="gray5" :scale="1.1" class="mr-025"></bib-icon>
            <span :id="'projects-' + data.value.projects.title + '-text'">{{data.value.projects.title}}</span>
          </div>
        </template>
        <template #cell(department)="data">
          Department
        </template>
        <template #cell(status)="data">
          <div class="d-flex gap-05 align-center">
            <div class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-' + favoriteStatusVariable(data.value.projects.status ? data.value.projects.status.text : '')"></div>
            <span class="text-dark">{{ favoriteStatusLabel(data.value.projects.status ? data.value.projects.status.text : '') }}</span>
          </div>
        </template>
        <template #cell(priority)="data">
          <div class="d-flex gap-05 align-center">
            <bib-icon icon="urgent-solid" :scale="1.1" :variant="favoritePriorityVariable(data.value.projects.priority ? data.value.projects.priority.text : '')"></bib-icon>
            <span id="project-text" :class="'text-' + favoritePriorityVariable(data.value.projects.priority ? data.value.projects.priority.text : '')">
              {{ capitalizeFirstLetter(data.value.projects.priority ? data.value.projects.priority.text : '') }}
            </span>
          </div>
        </template>
        <template #cell(owner)="data">
          <user-info :user="data.value.projects.user"></user-info>
        </template>
        <template #cell(dueDate)="data">
          <span :id="'projects-' + data.value.projects.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.projects.dueDate"></span>
          <!-- <div class="justify-between text-dark" :id="'projects-' + data.value.dueDate">
            </div> -->
        </template>
      </bib-table>
      <bib-table :fields="taskTableFields" class="border-gray4 bg-white" :sections="favoriteTasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Favorite Tasks'}">
        <template #cell(title)="data">
          <div class="d-flex align-center text-dark cursor-pointer" :id="'projects-' + data.value.task.title">
            <bib-icon icon="briefcase" variant="gray5" :scale="1.1" class="mr-025"></bib-icon>
            <span :id="'projects-' + data.value.task.title + '-text'">{{data.value.task.title}}</span>
          </div>
        </template>
        <template #cell(owner)="data">
          <user-info :user="data.value.task.user"></user-info>
        </template>
        <template #cell(status)="data">
          <div class="d-flex gap-05 align-center">
            <div class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-' + favoriteStatusVariable(data.value.task.status ? data.value.task.status.text : '')" :id="'projects-' + data.value.task.statusId ? data.value.task.statusId : ''">
            </div>
            <span :id="'projects-' + data.value.task.statusId ? data.value.task.statusId : '' + '-text'" class="text-dark text-truncate">{{ favoriteStatusLabel(data.value.task.status ? data.value.task.status.text : "") }}</span>
          </div>
        </template>
        <template #cell(dueDate)="data">
          <span :id="'projects-' + data.value.task.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.task.dueDate"></span>
          <!-- <div class="justify-between text-dark" :id="'projects-' + data.value.dueDate">
            </div> -->
        </template>
        <template #cell(priority)="data">
          <div class="d-flex gap-05 align-center">
            <bib-icon icon="urgent-solid" :scale="1.1" :variant="favoritePriorityVariable(data.value.task.priority ? data.value.task.priority.text : '')"></bib-icon>
            <span id="project-text" :class="'text-' + favoritePriorityVariable(data.value.task.priority ? data.value.task.priority.text : '')">
              {{ capitalizeFirstLetter(data.value.task.priority ? data.value.task.priority.text : '') }}
            </span>
          </div>
        </template>
      </bib-table>
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
      taskTableFields: TASK_FAVORITES
    }
  },

  computed: {
    ...mapGetters({
      favoriteProjects: 'favorite/getFavProjects',
      favoriteTasks: 'favorite/getFavTasks'
    })
  },

  methods: {
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
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

  },

  mounted() {
    this.$store.dispatch('favorite/fetchFavTasks');
    this.$store.dispatch('favorite/fetchFavProjects');
  }
}

</script>
<style lang="scss" scoped>
  #favorite-scroll-wrap { max-height: calc(100vh - 160px);}
</style>
