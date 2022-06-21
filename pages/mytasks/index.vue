<template>
  <client-only>
    <div id="my-tasks-page-wrapper" class="mytask-page-wrapper">
      <page-title title="My Tasks"></page-title>
      <user-tasks-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:create-task="toggleSidebar($event)" />
      <div id="mytask-table-wrapper" class="mytask-table-wrapper position-relative of-scroll-y">
        <template v-if="gridType == 'list'">
          
          <template v-if="tasks.length">
            <bib-table v-for="(item, index) in localdata" :key="index + viewName + '-' + key" :fields="taskFields" :sections="item.tasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: item.title}" :headless="index > 0" class="border-gray4 bg-white"  @file-title-sort="sortTitle" @file-project-sort="sortProject" @file-status-sort="sortByStatus" @file-startDate-sort="sortByStartDate" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
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
                <status-comp :status="data.value.status"></status-comp>
              </template>
              <template #cell(createdAt)="data">
                <span :id="'projects-' + data.value.createdAt + '-text'" class="text-dark text-truncate" v-format-date="data.value.createdAt"></span>
              </template>
              <template #cell(dueDate)="data">
                <span :id="'projects-' + data.value.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.dueDate"></span>
              </template>
              <template #cell(priority)="data">
                <priority-comp :priority="data.value.priority"></priority-comp>
              </template>
            </bib-table>
            <loading :loading="loading"></loading>
          </template>
          <div v-else>
            <span id="projects-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
              <bib-icon icon="warning"></bib-icon> No records found
            </span>
          </div>
        </template>
        <template v-else>
          <div class=" d-flex">
            <!-- <div class="task-grid-section">
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
                  <task-grid :task="item" v-on:update-key="updateKey"></task-grid>
                </div>
              </div>
            </div> -->
            
            
            <div class="task-grid-section" v-for="(section, index) in localdata" :key="index + viewName + '-' + key">
              <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
                <div class="title text-dark">{{section.title}}</div>
                <div class="d-flex section-options">
                  <!-- <div class="mr-1">
                    <bib-icon icon="add" variant="success" :scale="1.2"></bib-icon>
                  </div>
                  <div>
                    <bib-icon icon="elipsis" :scale="1.2" />
                  </div> -->
                </div>
              </div>
              <div class="task-section__body">
                <div v-for="(task, index) in section.tasks" :key="task.name + '-' + index + key">
                <task-grid :task="task" />
              </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <bib-popup-notification-wrapper>
        <template #wrapper>
          <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
          </bib-popup-notification>
        </template>
      </bib-popup-notification-wrapper>
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
      key: 100,
      popupMessages: [],
    }
  },

  computed: {
    ...mapGetters({
      tasks: 'user/getUserTasks'
    }),
    localdata() {
      let arr = [
        { title: "Past Due", id: 101, tasks: [] },
        { title: "Due Today", id: 102, tasks: [] },
        { title: "This Week", id: 103, tasks: [] },
        { title: "This Month", id: 104, tasks: [] },
      ]
      this.tasks.map((t => {
        // console.log(new Date(t.dueDate))
        // console.info(new Date(t.dueDate).getDate() === new Date().getDate(), t.title);
        if (new Date(t.dueDate).getDate() < new Date().getDate()) {
          arr[0].tasks.push(t)
        }
        if (new Date(t.dueDate).getDate() == new Date().getDate()) {
          arr[1].tasks.push(t)
        }
        if (new Date(t.dueDate) > new Date() && new Date(t.dueDate).getDate() < new Date().getDate()+7) {
          arr[2].tasks.push(t)
        }
        if (new Date(t.dueDate).getDate() > new Date().getDate()+7 && new Date(t.dueDate).getDate() < new Date().getDate()+30) {
          arr[3].tasks.push(t)
        }
        // return new Date(t.dueDate) < new Date()
      }))
      return arr
    }
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

  methods: {
    updateKey($event) {
      // console.log("update-key event received", $event)
      this.popupMessages.push({ text: $event, variant: "success" })
      this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' }).then(() => {
        this.key += 1
      })
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


}

</script>
<style lang="scss" scoped>
.mytask-page-wrapper {
  display: grid;
  grid-template-rows: auto auto calc(100vh - 150px);
  grid-template-columns: 1fr;
}

</style>
