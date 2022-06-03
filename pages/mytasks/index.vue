<template>
  <client-only>
    <div id="my-tasks-page-wrapper" class="mytask-page-wrapper">
      <page-title title="My Tasks"></page-title>
      <user-tasks-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:create-task="toggleSidebar($event)" />
      <template v-if="gridType == 'list'">
        <template v-if="tasks.length">
          <div id="mytask-table-wrapper" class="mytask-table-wrapper position-relative of-scroll-y">
            <bib-table :fields="taskFields" :sections="tasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Due Soon', variant: 'secondary'}" class="border-gray4 bg-white" :key="viewName + '-' + key" @file-title-sort="sortTitle" @file-project-sort="sortProject" @file-status-sort="sortByStatus" @file-startDate-sort="sortByStartDate" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
              <template #cell(title)="data">
                <div :id="'cell'+data.value.id" class="text-dark text-left cursor-pointer" @click="$nuxt.$emit('open-sidebar', data.value)">
                  {{ data.value.title }}
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
                  <bib-icon icon="urgent-solid" :scale="1" :variant="favoritePriorityVariable(data.value.priority ? data.value.priority.text : '')"></bib-icon>
                  <span id="project-text" :class="'text-' + favoritePriorityVariable(data.value.priority ? data.value.priority.text : '')">
                    {{ capitalizeFirstLetter(data.value.priority ? data.value.priority.text : '') }}
                  </span>
                </div>
              </template>
            </bib-table>
            <loading :loading="loading"></loading>
          </div>
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
        <div class=" d-flex">
          <div class="task-grid-section">
            <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
              <div class="title text-dark">Past Due</div>
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
          <div class="task-grid-section">
            <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
              <div class="title text-dark">Due Today</div>
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
              <!-- <div v-for="(item, index) in tasks" :key="item.name + '-' + index">
                <task-grid :task="item" />
              </div> -->
            </div>
          </div>
          <div class="task-grid-section">
            <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
              <div class="title text-dark ">This Week</div>
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
              <!-- <div v-for="(item, index) in tasks" :key="item.name + '-' + index">
                <task-grid :task="item" />
              </div> -->
            </div>
          </div>
          <div class="task-grid-section">
            <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
              <div class="title text-dark">This Month</div>
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
              <!-- <div v-for="(item, index) in tasks" :key="item.name + '-' + index">
                <task-grid :task="item" />
              </div> -->
            </div>
          </div>
        </div>
      </template>
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
      gridType: 'list',
      viewName: null,
      orderBy: 'desc',
      flag: false,
      key: 100
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
      this.$nuxt.$emit("open-sidebar", task);
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

    // Sort By Action List
    sortBy($event) {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: $event, order: this.orderBy })
      this.key += 1
    },

    // Sort By Head Actions
    sortTitle() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'name', order: this.orderBy })
      this.key += 1;
    },

    sortProject() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'projectId', order: this.orderBy })
      this.key += 1;
    },

    sortByStatus() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'status', order: this.orderBy })
      this.key += 1;
    },

    sortByStartDate() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'createdAt', order: this.orderBy })
      this.key += 1;
    },

    sortByDueDate() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'dueDate', order: this.orderBy })
      this.key += 1;
    },

    sortByPriority() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.$store.dispatch('user/sortUserTasks', { sName: 'priority', order: this.orderBy })
      this.key += 1;
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
      this.$nuxt.$on("update-key", () => {
        // console.log('updated key event received')
        this.$store.dispatch('user/setUserTasks', { filter: 'all' }).then(() => { this.key += 1 })
      })
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

.task-grid-section {
  flex: 0 0 16rem;
  padding: 10px;
  user-select: none;
  border-right: 1px solid $gray4;


  .title {
    font-weight: bold;
  }
}

.section-options {}

.task-grid {
  margin: 8px 4px 8px;
  background: var(--bib-light);
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;

  &.bg-danger {
    background-color: var(--bib-danger);
    color: #fff;

    .user-name {
      color: #fff
    }
  }

  &.active {
    background-color: var(--bib-gray4);
    border-color: var(--bib-gray6);
  }

  .task-image {
    aspect-ratio: 16 / 9;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  span {
    font-size: 15px;
    font-weight: 500;
  }

  .task-bottom span {
    font-size: 13px;
  }

}

</style>
