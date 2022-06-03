<template>
  <client-only>
    <div id="task-page-wrapper" class="task-page-wrapper">
      <page-title title="Tasks"></page-title>
      <company-tasks-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:create-task="toggleSidebar($event)" />
      <div id="task-table-wrapper" class="task-table-wrapper position-relative of-scroll-y">
      <template v-if="gridType == 'list'">
        <template v-if="tasks.length">
        <bib-table :fields="taskFields" :sections="tasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Department', variant: 'secondary'}" class="border-gray4 bg-white" :key="viewName + '-' + key"
        @file-title-sort="sortTitle" @file-owner-sort="sortOwner" @file-status-sort="sortByStatus"  @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
          <template #cell(title)="data">
            <div class="d-flex gap-05">
              <span class="text-dark text-left cursor-pointer" style="min-width: 100px; display: inline-block;  line-height:1.25;" @click="$nuxt.$emit('open-sidebar', data.value)">{{ data.value.title }}</span>
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
          </bib-table>
        </template>
          <template v-else>
            <div>
              <span id="projects-0" class="d-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
                <bib-icon icon="warning"></bib-icon> No records found
              </span>
            </div>
          </template>
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
                <div v-for="(item, index) in tasks" :key="item.name + '-' + index">
                  <task-grid :task="item" />
                </div>
              </div>
            </div>
          </div>
        </template>
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
      gridType: "list",
      taskFields: TaskFields,
      loading: false,
      flag: false,
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

    // Sort By Action List
    sortBy($event) {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('company/sortCompanyTasks', { sName: $event, order: this.orderBy })
      this.key += 1
    },

    // Sort By Head Actions
    sortTitle() {
      
      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('company/sortCompanyTasks', { sName: 'name', order: this.orderBy })
      this.key += 1
    },

    sortOwner() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      
      this.$store.dispatch('company/sortCompanyTasks', { sName: 'owner', order: this.orderBy })
      this.key += 1
    },

    sortByStatus() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      
      this.$store.dispatch('company/sortCompanyTasks', { sName: 'status', order: this.orderBy })
      this.key += 1
    },

    sortByDueDate() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      
      this.$store.dispatch('company/sortCompanyTasks', { sName: 'dueDate', order: this.orderBy })
      this.key += 1
    },

    sortByPriority() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      
      this.$store.dispatch('company/sortCompanyTasks', { sName: 'priority', order: this.orderBy })
      this.key += 1
    },

    
    toggleSidebar($event) {
      // in case of create task 
      if (!$event) {
        this.$nuxt.$emit("open-sidebar", $event)
      }
      this.flag = !this.flag;
    },
  },

  created() {
    if (process.client) {
      this.$nuxt.$on('change-grid-type', ($event) => {
        this.gridType = $event;
      })
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


.task-grid-section {
  flex: 0 0 16rem;
  padding: 10px;
  font-size: 15px;
  user-select: none;
  border-right: 1px solid $gray4;

  &:not(:first-child) {
    border-right: 1px solid $gray4;
  }
  .title { font-weight: bold; }
}

.section-options {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}

</style>
