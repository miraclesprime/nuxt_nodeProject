<template>
  <client-only>
    <div id="my-tasks-page-wrapper" class="mytask-page-wrapper">
      <page-title title="My Tasks"></page-title>
      <user-tasks-actions v-on:filterView="filterView" />
      <div id="mytask-table-wrapper" class="mytask-table-wrapper position-relative of-scroll-y">
        <bib-table :fields="taskFields" :sections="tasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Due Soon', variant: 'secondary'}" class="border-gray4 bg-white" :key="viewName">
          <template #cell(title)="data">
            <div class="gap-05 align-center">
              <span class="text-dark text-left cursor-pointer" @click="openSidebar(data.value)">{{ data.value.title }}</span>
            </div>
          </template>
          <template #cell(projectId)="data">
            <project-info :projectId="data.value.project[0] ? data.value.project[0].projectId : null"></project-info>
          </template>
          <template #cell(owner)="data">
            <user-info v-if="data.value.userId" :userId="data.value.userId"></user-info>
          </template>
          <template #cell(status)="data">
            <div class="d-flex gap-05 align-center">
              <div class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-' + favoriteStatusVariable(data.value.status ? data.value.status.text : '')" :id="'projects-' + data.value.statusId ? data.value.statusId : ''">
              </div>
              <span :id="'projects-' + data.value.statusId ? data.value.statusId : '' + '-text'" class="text-dark text-truncate">{{ favoriteStatusLabel(data.value.status ? data.value.status.text : "") }}</span>
            </div>
          </template>
          <template #cell(createdAt)="data">
            <span :id="'projects-' + data.value.createdAt + '-text'" class="text-dark text-truncate" v-format-date="data.value.createdAt"></span>
            <!-- <div class="justify-between text-dark" :id="'projects-' + data.value.dueDate">
            </div> -->
          </template>
          <template #cell(dueDate)="data">
            <span :id="'projects-' + data.value.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.dueDate"></span>
            <!-- <div class="justify-between text-dark" :id="'projects-' + data.value.dueDate">
            </div> -->
          </template>
          <template #cell(priority)="data">
            <div class="d-flex gap-05 align-center">
              <bib-icon icon="urgent-solid" :scale="1.1" :variant="favoritePriorityVariable(data.value.priority ? data.value.priority.text : '')"></bib-icon>
              <span id="project-text" :class="'text-' + favoritePriorityVariable(data.value.priority ? data.value.priority.text : '')">
                {{ capitalizeFirstLetter(data.value.priority ? data.value.priority.text : '') }}
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
import { USER_TASKS } from "../../config/constants";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      taskFields: USER_TASKS,
      loading: false,
      viewName: null
    }
  },

  computed: {
    ...mapGetters({
      tasks: 'user/getUserTasks'
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

    openSidebar(task) {
      this.$nuxt.$emit("open-sidebar", true);
      
    },

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
  },

  created() {
    if (process.client) {
      this.loading = true
      this.$store.dispatch('user/setUserTasks', { filter: 'all' }).then((res) => {
        this.loading = false;
      })
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

</style>
