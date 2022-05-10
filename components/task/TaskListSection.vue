<template>
  <div class="position-relative">
    <bib-table v-for="(item, index) in sections" :key="`tasklist-${key}${item.id}${sortName ? sortName : ''}`" :fields="tableFields" :sections="item.tasks" :headless="index > 0" :collapseObj="showSectionTitle(item)" hide-no-column class="border-gray4 bg-white" @file-title-sort="$emit('sort-task','name')" @file-status-sort="$emit('sort-task','status')" @file-priority-sort="$emit('sort-task','priority')" @file-owner-sort="$emit('sort-task','owner')" @file-startDate-sort="$emit('sort-task','startDate')" @file-dueDate-sort="$emit('sort-task','dueDate')"  >
      <template #cell(title)="data">
        <div class="d-flex gap-05 align-center">
          <bib-icon icon="check-circle" :scale="1.5" :variant="taskCheckIcon(data)" class="cursor-pointer" @click="handleTaskTable_status(data)"></bib-icon>
          <span class="text-dark text-left cursor-pointer" style="min-width: 100px; display: inline-block;  line-height:1.25;" @click="openSidebar(data.value, item.projectId)">{{ data.value.title }}</span>
        </div>
      </template>
      <template #cell(owner)="data">
        <user-info :userId="data.value.userId" ></user-info>
      </template>
      <template #cell(status)="data">
        <div class="d-flex gap-05 align-center">
          <div class="shape-circle max-width-005 max-height-005 min-width-005 min-height-005" :class="'bg-' + taskStatusVariable(data.value.status ? data.value.status.text : '')"></div>
          <span class="text-dark">{{ taskStatusLabel(data.value.status ? data.value.status.text : '') }}</span>
        </div>
      </template>
      <template #cell(startDate)="data">
          <span class="text-dark d-inline-flex" style="line-height: normal;" v-format-date="data.value.createdAt"></span>
      </template>
      <template #cell(dueDate)="data">
          <span class="text-dark d-inline-flex" style="line-height: normal;" v-format-date="data.value.dueDate"></span>
      </template>
      <template #cell(priority)="data">
        <div class="d-flex gap-05 align-center">
          <bib-icon icon="urgent-solid" :scale="1.1" :variant="taskPriorityVariable(data.value.priority ? data.value.priority.text : '')"></bib-icon>
          <span :class="'text-' + taskPriorityVariable(data.value.priority ? data.value.priority.text : '')">{{ capitalizeFirstLetter(data.value.priority ? data.value.priority.text : '') }}</span>
        </div>
      </template>
    </bib-table>
  </div>
</template>
<script>
import { TASK_FIELDS } from "config/constants";
import { mapGetters } from 'vuex';
export default {
  props: {
    project: { type: Object, required: true},
    sections: { type: Array, required: true},
  },
  data() {
    return {
      tableFields: TASK_FIELDS,
      key: 0,
      sortName: "",
      flag: false,
    };
  },
  
  methods: {
    openSidebar(task, projectId) {
      this.$nuxt.$emit("open-sidebar", true);
      this.$store.dispatch('task/setSingleTask', {...task, projectId: projectId})
    },
    /*updateKey($event) {
      // console.log($event)
      this.$store.dispatch("section/fetchProjectSections", {projectId:this.$route.params.id})
      // this.$store.dispatch("task/fetchTasks", { id: this.$route.params.id, filter: 'all' })
      this.key += $event
    },*/
    showSectionTitle(section) {
      if (section.title.includes("_section")) {
        return null
      } else {
        return {
          collapsed: false,
          label: section.title,
          variant: 'black',
        }
      }
    },
    itemClicked() {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
    },
    taskCheckIcon(data) {
      return data.value.statusId == 5 ? 'success' : 'secondary-sub1'
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
  },
};

</script>
<style lang="scss" scoped>
</style>
