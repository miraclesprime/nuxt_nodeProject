<template>
  <client-only>
    <div id="task-page-wrapper" class="task-page-wrapper">
      <page-title title="Tasks"></page-title>
      <company-tasks-actions :gridType="gridType" v-on:filterView="filterView" v-on:sort="sortBy" v-on:new-task="toggleSidebar($event)"></company-tasks-actions>
      <div id="task-table-wrapper" class="task-table-wrapper position-relative of-scroll-y">
        <template v-if="gridType == 'list'">
          <template v-if="tasks.length">
            <drag-table-simple :key="key" :componentKey="key" :fields="taskFields" :tasks="tasks" :sectionTitle="'Department'" :drag="false" v-on:task-click="$nuxt.$emit('open-sidebar', $event)" v-on:new-task="toggleSidebar($event)" @table-sort="sortBy"></drag-table-simple>
            <!-- <bib-table :fields="taskFields" :sections="tasks" :hide-no-column="true" :collapseObj="{collapsed: false, label: 'Department', variant: 'secondary'}" class="border-gray4 bg-white" :key="viewName + '-' + key" @file-title-sort="sortTitle" @file-owner-sort="sortOwner" @file-status-sort="sortByStatus" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
              <template #cell(title)="data">
                <span class="text-dark text-left cursor-pointer d-block" style=" line-height:1.25;" @click="$nuxt.$emit('open-sidebar', data.value)">{{ data.value.title }}</span>
              </template>
              <template #cell(status)="data">
                <status-comp :status="data.value.status"></status-comp>
                
              </template>
              <template #cell(priority)="data">
                <priority-comp :priority="data.value.priority"></priority-comp>
                
              </template>
              <template #cell(owner)="data">
                <user-info v-if="data.value.userId" :userId="data.value.userId"></user-info>
              </template>
              <template #cell(dueDate)="data">
                <span :id="'projects-' + data.value.dueDate + '-text'" class="text-dark text-truncate" v-format-date="data.value.dueDate"></span>
              </template>
            </bib-table> -->
          </template>
          <template v-else>
            <div>
              <span id="projects-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
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
                <div v-for="(item, index) in tasks" :key="index + '-' + key" >
                  <task-grid :task="item" v-on:update-key="updateKey" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <loading :loading="loading"></loading>
        <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>
      </div>
    </div>
  </client-only>
</template>
<script>
import { mapGetters } from "vuex";
import { COMPANY_TASK_FIELDS as TaskFields } from '../../config/constants'

export default {
  name: 'Tasks',
  data() {
    return {
      title: "Tasks",
      gridType: "list",
      taskFields: TaskFields,
      loading: false,
      flag: false,
      viewName: "all",
      orderBy: 'desc',
      key: 100,
      popupMessages: [],
    }
  },
  computed: {
    ...mapGetters({
      token: "token/getToken",
      user: "user/getUser",
      tasks: "company/getCompanyTasks"
    }),
  },

  created() {
    if (process.client) {
      this.$nuxt.$on('change-grid-type', ($event) => {
        this.gridType = $event;
      })
      this.$nuxt.$on("update-key", () => {
        // console.log('updated key event received')
        let user = JSON.parse(localStorage.getItem("user"))
        this.$store.dispatch('company/setCompanyTasks', { companyId: user.subb }).then(() => { this.key += 1 })
      })
      this.loading = true
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'all' }).then((res) => {
        this.loading = false;
      })
    }
  },

  methods: {
    updateKey($event) {
      // console.log("update-key event received", $event)
      this.popupMessages.push({ text: $event, variant: "success" })
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store.dispatch("company/setCompanyTasks", { companyId: compid, filter: "all" }).then(() => {
        this.key += 1
      })
    },

    openSidebar(task) {
      this.$nuxt.$emit("open-sidebar", true);

    },

    filterView($event) {
      this.loading = true
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      if ($event == 'complete') {
        this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'complete' }).then((res) => {
          this.key += 1;
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'complete'
      }
      if ($event == 'incomplete') {
        this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'incomplete' }).then((res) => {
          this.key += 1;
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'incomplete'
      }
      if ($event == 'all') {
        this.$store.dispatch('company/setCompanyTasks', { companyId: compid, filter: 'all' }).then((res) => {
          this.key += 1;
          this.loading = false
        }).catch(e => console.log(e))
        this.viewName = 'all'
      }
      this.loading = false

    },

    // Sort By Action List
    sortBy($event) {

      // console.log(this.key)

      if($event == 'title') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'name', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'userId') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'owner', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'projectId') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'project', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'status') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'status', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'priority') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'priority', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if($event == 'dueDate') {
        this.$store.dispatch('company/sortCompanyTasks', { sName: 'dueDate', order: this.orderBy }).then(() => {
          this.key += 1
        }).catch((err) => {
          console.log(err)
        })
      }

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }

      this.key += 1

    },


    toggleSidebar($event) {
      console.log($event)
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
.task-page-wrapper {
  display: grid;
  grid-template-rows: auto auto calc(100vh - 150px);
  grid-template-columns: 1fr;
}

.section-options {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}

</style>
