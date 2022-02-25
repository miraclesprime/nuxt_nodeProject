<template>
  <div id="task-view-wrapper">
    <task-actions :gridType="gridType" v-on:create-task="toggleSidebar($event)" ></task-actions>
    
    <loading :loading="loading"></loading>
    <template v-if="gridType === 'list'">
      <bib-table v-for="(item, index) in sections" :key="index" :fields="tableFields" :sections="item.tasks" :headless="index == 0 ? false : true" :collapseObj="{collapsed: false, label: `${item.title}`}" class="border-gray4 bg-white" :style="{ borderBottom: 'none'}" @item-clicked="toggleSidebar">
        <template #cell(title)="data">
          <div class="d-flex gap-05" id='tv-title-wrap'>
            <span class="text-dark" id='tv-title-text' @click="taskSelected(data.value)">{{ data.value ? data.value.title : '' }}</span>
          </div>
        </template>
        <template #cell(status)="data">
          <div class="justify-between text-dark" id='tv-status-wrap'>
            <span :class="statusClass( data.value.statusId ? data.value.statusId : '')" id='tv-status-text'>
              {{ data.value.status ? data.value.status.text : '' }}
            </span>
            <!-- <span :class="statusClass(data.value.statusId)" id='tv-progress-wrap'>
              {{ data.value.progress }}<span v-if="data.value.progress" id="tv-percent-sign">%</span></span> -->
          </div>
        </template>
        <template #cell(priority)="data">
          <div class="justify-between text-dark" id='tv-priority-wrap'>
            <span :class="priorityClass(data.value.priorityId)" id='tv-priority-text'>
              {{ data.value.priority ? data.value.priority.text : '' }}
            </span>
          </div>
        </template>
        <template #cell(assignee)="data">
          <div class="text-dark" id='tv-assignee-wrap'>
            <!-- <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar> -->
            <span id='tv-assignee-text'>
              <user-info :id="data.value ? data.value.userId : ''" />
            </span>
          </div>
        </template>
        <template #cell(dueDate)="data">
          <div class="text-dark" id='tv-dueDate-wrap'>
            <span id='tv-dueDate-text' v-format-date="data.value.dueDate"></span>
          </div>
        </template>
      </bib-table>
    </template>
    <template v-else>
      <div class="d-flex" id='tv-grid-wrap'>
        <task-grid-section :headless="true" label="Section" :taskFields="tableFields" :taskSections="sections" :open="true" groupName="1" />
      </div>
    </template>
    <task-sidebar @open-sidebar="toggleSidebar()"></task-sidebar>
  </div>
</template>

<script>
import { TASK_FIELDS } from "~/dummy/tasks.js";
import { mapGetters } from 'vuex';

export default {
  props: {
    gridType: String,
    sections: Array,
  },
  data() {
    return {
      tableFields: TASK_FIELDS,
      flag: false,
      // loading: true
    };
  },
  computed: {
    ...mapGetters({
      // sections: "section/getAllSections",
      user: "user/getUser"
    }),
    loading(){
      if (this.sections != null) {
        return false
      } else {
        return true
      }
    }
  },

  methods: {
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

    statusClass(status) {
      /*1 Not Started
      2 In-Progress
      3 Waiting
      4 Deferred
      5 Done*/
      switch (status) {
        case 1:
          return "text-secondary"
          break;
        case 2:
          return "text-blue"
          break;
        case 3:
          return "text-orange"
          break;
        case 4:
          return "text-red"
          break;
        default:
          return "text-green"
          break;
      }
    },

    priorityClass(priority) {
      /*1 high
      2 medium
      3 low*/
      switch (priority) {
        case 1:
          return "text-red"
          break;
        case 2:
          return "text-orange"
          break;
        default:
          return "text-green"
          break;
      }
    },
    taskSelected($event) {
      this.$store.dispatch('task/setSingleTask', $event)
    }
  },

};

</script>
