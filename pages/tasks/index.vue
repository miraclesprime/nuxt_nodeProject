<template>
<client-only>
  <div id="task-page-wrapper" class="task-page-wrapper">
    <page-title title="Tasks"></page-title>
    <company-tasks-actions v-on:filterView="filterView" v-on:sort="sortBy" />
    <div id="task-table-wrapper" class="task-table-wrapper position-relative of-scroll-y">
      <bib-table :fields="taskFields" :sections="tasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Department', variant: 'secondary'}" class="border-gray4 bg-white" :key="viewName + '-' + key">
        <template #cell(title)="data">
          <div class="d-flex gap-05">
            <span class="text-dark">{{ data.value.title }}</span>
          </div>
        </template>
        <template #cell(owner)="data">
          <user-info v-if="data.value.userId" :userId="data.value.userId"></user-info>
        </template>
        <template #cell(status)="data">
          <div class="d-flex gap-05 align-center">
            <div class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-' + favoriteStatusVariable(data.value.status ? data.value.status.text : '')" :id="'projects-' + data.value.statusId ? data.value.statusId : ''">
            </div>
            </div>
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
          <template #cell(dueDate)="data">
            <span :id="'projects-' + data.value.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.dueDate"></span>
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
import { mapGetters } from "vuex";
import { TASK_FAVORITES as TaskFields } from '../../config/constants'

export default {
  name: 'Tasks',
  data() {
    return {
      title: "Tasks",
      taskFields: TaskFields,
      loading: false,
      viewName: null,
      orderBy: 'desc',
      key: 100
    }
  },
  computed: {
    ...mapGetters({
      token: "token/getToken",
      user: "user/getUser",
      tasks: "company/getCompanyTasks"
    }),
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
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      if ($event == 'complete') {
        this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'complete' }).then((res) => {
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'complete'
      }
      if ($event == 'incomplete') {
        this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'incomplete' }).then((res) => {
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'incomplete'
      }
      if ($event == 'all') {
        this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'all' }).then((res) => {
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'all'
      }
      this.loading = false

    },

    sortBy($event) {

      if(this.orderBy == 'asc') {
          this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('company/sortCompanyTasks', {sName: $event, order: this.orderBy})
      this.key += 1 
    }
  },

  created() {
    if (process.client) {
      this.loading = true
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'all' }).then((res) => {
        this.loading = false;
      })
    }
  },
}

</script>
<style lang="scss" scoped>
.task-page-wrapper {
  display: grid;
  grid-template-rows: auto auto calc(100vh - 150px);
  grid-template-columns: 1fr;
}

</style>
