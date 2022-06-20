<template>
  <div class="position-relative">
    <bib-table v-for="(item, index) in sections" :key="`tasklist-${templateKey}${item.id}${sortName ? sortName : ''}`" :fields="tableFields" :sections="item.tasks" :headless="index > 0" :collapseObj="showSectionTitle(item)" hide-no-column class="border-gray4 bg-white" @file-title-sort="$emit('sort-task','name')" @file-status-sort="$emit('sort-task','status')" @file-priority-sort="$emit('sort-task','priority')" @file-owner-sort="$emit('sort-task','owner')" @file-startDate-sort="$emit('sort-task','startDate')" @file-dueDate-sort="$emit('sort-task','dueDate')">
      <template #cell(title)="data">
        <div class="d-flex gap-05 align-center">
          <bib-icon icon="check-circle" :scale="1.5" :variant="taskCheckIcon(data)" class="cursor-pointer" @click="handleTaskTable_status(data.value)"></bib-icon>
          <span class="text-dark text-left cursor-pointer flex-grow-1" style="  line-height:1.25;" @click="openSidebar(data.value, item.projectId)">{{ data.value.title }}</span>
        </div>
      </template>
      <template #cell(owner)="data">
        <user-info v-if="data.value.userId" :userId="data.value.userId"></user-info>
      </template>
      <template #cell(status)="data">
        <status-comp :status="data.value.status"></status-comp>
        
      </template>
      <template #cell(startDate)="data">
        <span class="text-dark d-inline-flex" style="line-height: normal;" v-format-date="data.value.createdAt"></span>
      </template>
      <template #cell(dueDate)="data">
        <span class="text-dark d-inline-flex" style="line-height: normal;" v-format-date="data.value.dueDate"></span>
      </template>
      <template #cell(priority)="data">
        <priority-comp :priority="data.value.priority"></priority-comp>
        
      </template>
    </bib-table>
    <loading :loading="loading"></loading>
  </div>
</template>
<script>
import { TASK_FIELDS } from "config/constants";
import { mapGetters } from 'vuex';
export default {
  props: {
    project: { type: Object, required: true },
    sections: { type: Array, required: true },
    templateKey: { default: 0 },
  },
  data() {
    return {
      tableFields: TASK_FIELDS,
      // key: 0,
      sortName: "",
      flag: false,
      loading: false,
    };
  },

  methods: {
    openSidebar(task, projectId) {
      let project = [{
        projectId: projectId,
        project: {
          id: projectId
        }
      }]
      this.$nuxt.$emit("open-sidebar", { ...task, project: project });
      /*this.$store.dispatch('task/setSingleTask', {...task, projectId: projectId})
      this.$store.dispatch('task/fetchTeamMember', { id: task.id } )*/
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

    handleTaskTable_status(item) {
      // console.log(item)
      this.loading = true
      this.$store.dispatch('task/updateTaskStatus', item)
        .then(() => {
          this.$emit("update-key")
        })
        .catch(e => console.log(e))
        .then(() => this.loading = false)
    },
  },
};

</script>
<style lang="scss" scoped>
</style>
