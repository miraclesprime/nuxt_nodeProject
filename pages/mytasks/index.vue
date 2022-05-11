<template>
  <div id="my-tasks-page-wrapper" class="mytask-page-wrapper">
    <page-title title="My Tasks"></page-title>
    <task-actions />
    <div id="mytask-table-wrapper" class="mytask-table-wrapper position-relative of-scroll-y">
      <bib-table :fields="taskFields" :sections="tasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Due Soon', variant: 'secondary'}" class="border-gray4 bg-white">
        <template #cell(title)="data">
          <div class="d-flex gap-05">
            <span class="text-dark">{{ data.value.title }}</span>
          </div>
        </template>
        <!-- <template #cell(projectId)="data">
          {{data.value.project.project.title}}
       </template> -->
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
    </div>
  </div>
</template>
<script>
import { USER_TASKS } from "../../config/constants";

export default {
  data() {
    return {
      taskFields: USER_TASKS,
      tasks: []
    }
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

  created() {
    if (process.client) {
      this.$axios.$get("user/tasks", {
        headers: { 'Authorization': "Bearer " + localStorage.getItem("accessToken") }
      }).then(res => {
        this.tasks = res.data;
      });
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
