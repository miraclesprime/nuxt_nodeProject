<template>
  <div id="task-view-wrapper" class="position-relative">
    <task-actions :gridType="gridType" v-on:create-task="toggleSidebar($event)" v-on:create-section="createSectionInline" v-on:filterView="filterView" v-on:sort="sortBy"></task-actions>
    <loading :loading="loading"></loading>
    <section v-show="newSection" id="tv-new-section-input-container">
      <div id="tv-new-section-input-wrapper" class="d-flex align-center p-05 bg-light">
        <input id="tv-new-section-input" type="text" class="new-section-input" ref="newsectioninput" v-model.trim="newSectionName" v-on:blur="clickOutside" v-on:keyup.enter="createSectionOnEnter" placeholder="Enter section name">
        <small v-if="sectionError" class="text-danger ml-05">invalid input</small>
        <div v-show="sectionLoading" class="d-flex align-center">
          <bib-spinner :scale="2"></bib-spinner> <span class="text-secondary">Creating section ...</span>
        </div>
        <bib-icon icon="close" class="ml-auto" v-on:click="clickOutside"></bib-icon>
      </div>
      <!-- <bib-input type="text" ref="newsectionbibinput" v-model="newSectionName" name="sectionname" size="sm" placeholder="Enter section name"></bib-input> -->
    </section>
    <template v-if="gridType === 'list'">
      <bib-table v-for="(item, index) in sections" :key="`tasklist-${key}${item.id}${sortName ? sortName : ''}`" :fields="tableFields" :sections="taskWithSection(item.id)" :headless="index > 0" :collapseObj="showSectionTitle(item)" hide-no-column class="border-gray4 bg-white" @file-title-sort="sortTitle" @file-owner-sort="sortOwner" @file-status-sort="sortByStatus" @file-startDate-sort="sortByStartDate" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
        <template #cell(title)="data">
          <div class="d-flex gap-05 align-center">
            <bib-icon icon="check-circle" :scale="1.5" :variant="taskCheckIcon(data)" class="cursor-pointer" @click="handleTaskTable_status(data)"></bib-icon>
            <span class="text-dark text-left cursor-pointer" style="min-width: 100px; display: inline-block; min-height: 30px;" @click="taskSelected(data.value)">{{ data.value.title }}</span>
          </div>
        </template>
        <template #cell(owner)="data">
          <user-info :user="data.value.user" avatar="https://i.pravatar.cc/32"></user-info>
        </template>
        <template #cell(status)="data">
          <div class="d-flex gap-05 align-center">
            <div class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-' + taskStatusVariable(data.value.status ? data.value.status.text : '')"></div>
            <span class="text-dark">{{ taskStatusLabel(data.value.status ? data.value.status.text : '') }}</span>
          </div>
        </template>
        <template #cell(startDate)="data">
          <div class="d-flex gap-05">
            <span class="text-dark" v-format-date="data.value.createdAt"></span>
          </div>
        </template>
        <template #cell(dueDate)="data">
          <div class="d-flex gap-05">
            <span class="text-dark" v-format-date="data.value.dueDate"></span>
          </div>
        </template>
        <template #cell(priority)="data">
          <div class="d-flex gap-05 align-center">
            <bib-icon icon="urgent-solid" :scale="1.1" :variant="taskPriorityVariable(data.value.priority ? data.value.priority.text : '')"></bib-icon>
            <span :class="'text-' + taskPriorityVariable(data.value.priority ? data.value.priority.text : '')">{{ capitalizeFirstLetter(data.value.priority ? data.value.priority.text : '') }}</span>
          </div>
        </template>
      </bib-table>
      <!-- <div class="bg-white w-100 p-025 border-bottom-gray4 border-top-white">
        <div class="d-flex align-center p-025 cursor-pointer bg-hover-gray2 shape-rounded w-fit gap-05" @click="addTask(sec_index)">
          <bib-icon icon="add" variant="success" :scale="1.4"></bib-icon>
          <span class="text-dark"> New Task </span>
        </div>
      </div> -->
    </template>
    <template v-else>
      <div class="d-flex of-scroll-x" id='tv-grid-wrap'>
        <task-grid-section v-for="item in sections" :key="`grid-${key}${item.title}${item.id}`" :headless="true" :label="showSectionTitleBoard(item)" :taskFields="tableFields" :taskSections="taskWithSection(item.id)" :open="true" groupName="1" v-on:update-key="updateKey" />
      </div>
    </template>
    <span id="projects-0" v-show="sections.length == 0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
      <bib-icon icon="warning"></bib-icon> No records found
    </span>
    <task-sidebar :activeTask="activeTask" @open-sidebar="toggleSidebar()" v-on:update-key="updateKey"></task-sidebar>
  </div>
</template>
<script>
import { TASK_FIELDS } from "config/constants";
import { mapGetters } from 'vuex';

export default {
  props: {
    gridType: String,
    sections: Array,
    tasks: Array,
  },
  data() {
    return {
      tableFields: TASK_FIELDS,
      activeTask: {},
      headless: null,
      flag: false,
      newSection: false,
      newSectionName: "",
      // sectionError: false,
      sectionLoading: false,
      sortName: "",
      // loading: true,
      filterTask: [],
      key: 0,
      orderBy: ''
    };
  },
  computed: {
    ...mapGetters({
      token: "token/getToken",
      // vuexSections: "section/getAllSections",
      user: "user/getUser",
      project: "project/getSingleProject"
    }),
    sectionError() {
      if (this.newSectionName.indexOf("_") == 0) {
        return true
      } else {
        return false
      }
    },
    loading() {
      if (this.sections != null) {
        return false
      } else {
        return true
      }
    },
  },

  methods: {
    updateKey($event) {
      console.log($event)
      this.key += $event
    },
    showSectionTitle(section) {
      if (section.title.includes("_section")) {
        return false
      } else {
        return {
          collapsed: false,
          label: section.title,
          variant: 'black',
        }
      }
    },
    showSectionTitleBoard(section){
      if (section.title.includes("_section")) {
        return ''
      } else {
        return section.title
      }
    },
    taskWithSection(sectionId) {
      var arr = []

      for (var j = 0; j < this.tasks.length; ++j) {
        if (this.tasks[j].sectionId == sectionId) {
          arr.push(this.tasks[j]);
        }
      }

      // Sort By Title
      if (this.sortName == 'name' && this.orderBy == 'asc') {
        arr.sort((a, b) => a.title.localeCompare(b.title));
      }

      if (this.sortName == 'name' && this.orderBy == 'desc') {
        arr.sort((a, b) => b.title.localeCompare(a.title));
      }

      // Sort By owner
      if (this.sortName == 'owner' && this.orderBy == 'asc') {
        arr.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
      }

      if (this.sortName == 'owner' && this.orderBy == 'desc') {
        arr.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
      }

      // sort By Status
      if (this.sortName == 'status' && this.orderBy == 'asc') {
        arr.sort((a, b) => a.status.text.localeCompare(b.status.text));
      }

      if (this.sortName == 'status' && this.orderBy == 'desc') {
        arr.sort((a, b) => b.status.text.localeCompare(a.status.text));
      }

      // sort By Start Date

      if (this.sortName == 'startDate' && this.orderBy == 'asc') {
        arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      if (this.sortName == 'startDate' && this.orderBy == 'asc') {
        arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // sort By DueDate
      if (this.sortName == 'dueDate' && this.orderBy == 'asc') {
        arr.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      }

      if (this.sortName == 'dueDate' && this.orderBy == 'desc') {
        arr.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      }

      // Sort By Priotity
      if (this.sortName == 'priority' && this.orderBy == 'asc') {
        arr.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
      }

      if (this.sortName == 'priority' && this.orderBy == 'desc') {
        arr.sort((a, b) => b.priority.text.localeCompare(a.priority.text));
      }

      return arr;
    },

    toggleSidebar($event) {
      // console.log($event)
      // in case of create task 
      if (!$event) {
        this.$store.dispatch("task/setSingleTask", {})
      }
      this.flag = !this.flag;
      this.$emit("open-sidebar", this.flag);
      this.$nuxt.$emit("open-sidebar", this.flag);
    },

    createSectionInline() {
      this.newSection = true
      // console.log(this.$refs.newsectioninput.clientWidth, this.$refs.newsectioninput.clientHeight)
      var inputdisplay = setTimeout(() => {
        // console.log(this.$refs.newsectioninput.clientHeight)
        this.$refs.newsectioninput.focus()
      }, 500)
    },
    /*onFocus(event) {
      console.log('focus', event)
      console.log(this.$refs.newsectioninput.clientWidth, this.$refs.newsectioninput.clientHeight)
    },*/
    clickOutside() {
      if (this.newSectionName) {
        this.createSectionOnEnter
      } else {
        this.newSectionName = ""
        this.newSection = false
      }
    },
    async createSectionOnEnter($event) {
      // console.log("blur ", $event.target)
      let newvalue = this.newSectionName;
      if (newvalue) {
        if (this.sectionError) {
          return false
        }
        this.processing = true
        this.$refs.newsectioninput.setAttribute("disabled", true)
        this.sectionLoading = true

        this.$store.dispatch("section/createSection", {
          "projectId": this.project.id,
          "title": newvalue.trim()
        }).then(() => {
          this.sectionLoading = false
          this.newSection = false
          this.$refs.newsectioninput.removeAttribute("disabled")
        }).catch(e => console.log(e))

      } else {
        this.newSection = false
        console.log('No section added')
      }
    },

    taskSelected($event) {
      this.$store.dispatch('task/setSingleTask', $event)
      this.activeTask = $event;
      this.toggleSidebar($event)
    },

    filterView($event) {
      if ($event == 'complete') {
        this.$store.dispatch('task/fetchTasks', { id: this.$route.params.id, filter: 'complete' })
      }
      if ($event == 'incomplete') {
        this.$store.dispatch('task/fetchTasks', { id: this.$route.params.id, filter: 'incomplete' })
      }
      if ($event == 'all') {
        this.$store.dispatch('task/fetchTasks', { id: this.$route.params.id, filter: 'all' })
      }
    },

    sortBy($event) {
      this.sortName = $event;
    },

    // methods for bib-table
    taskCheckIcon(data) {
      return data.status == 5 ? 'success' : 'secondary-sub1'
    },

    taskStatusLabel(status) {
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
        default:
          return ''
      }
    },
    taskStatusVariable(status) {
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
        default:
          return ''
      }
    },
    taskPriorityVariable(priority) {
      switch (priority) {
        case 'high':
          return 'danger'
        case 'medium':
          return 'orange'
        case 'low':
          return 'success'
        case 'none':
          return 'secondary'
        default:
          return ""
      }
    },
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    handleTaskTable_status(item) {
      console.log(item)
      this.$store.dispatch('task/updateTaskStatus', item)
    },

    sortTitle() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'name';
      this.checkActive()
    },

    sortOwner() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'owner';
      this.checkActive()
    },

    sortByStatus() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'status';
      this.checkActive()
    },

    sortByStartDate() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'startDate';
      this.checkActive()
    },

    sortByDueDate() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'dueDate';
      this.checkActive()
    },

    sortByPriority() {

      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'priority';
      this.checkActive()
    },

    checkActive() {
      for (let i = 0; i < this.tableFields.length; i++) {
        if (this.tableFields[i].header_icon) {
          this.tableFields[i].header_icon.isActive = false
        }

        if (this.tableFields[i].header_icon && this.tableFields[i].key == this.sortName) {
          this.tableFields[i].header_icon.isActive = true
        }
      }
    },
  },

};

</script>
<style lang="scss" scoped>
.new-section-input {
  min-height: 2rem;
  padding: 0 0.5rem;
  font-size: $font-size-sm;
  border-radius: 0.18rem;
  border: 1px solid var(--bib-gray4);

  &:focus {
    outline: none;
    border: 2px solid var(--bib-gray6);
    border-radius: 0;
  }
}

</style>
