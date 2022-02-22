<template>
  <div>
    <task-actions :gridType="gridType"></task-actions>
    <template v-if="gridType === 'list'">
      <!-- <bib-table :fields="tableFields" :sections="sections" @item-clicked="toggleSidebar"> -->
        <bib-table
            v-for="(item, index) in sections"
            :key="index"
            :fields="tableFields"
            :sections="item.tasks"
            :headless="index == 0 ? false : true"
            :collapseObj="{collapsed: false, label: `${item.title}`}"
            class="border-gray4 bg-white"
            :style="{ borderBottom: 'none'}"
            @item-clicked="toggleSidebar"
          >
        <!-- <div v-for="(item, index) in sections"> -->
          <template #cell(title)="data">
            <div class="d-flex gap-05" id='task-wrapper'>
              <span class="text-dark" id='task-text' @click="taskSelected(data.value)">{{ data.value ? data.value.title : '' }}</span>
            </div>
          </template>
          <template #cell(status)="data">
            <div class="justify-between text-dark" id='t-status-wrapper'>
              <span :class="statusClass( data.value.status ? data.value.status.text : '')" id='task-status'>
                {{ data.value.status ? data.value.status.text : '' }}
              </span>
              <span :class="statusClass(data.value.status)" id='task-progress'>
                {{ data.value.progress }}<span v-if="data.value.progress">%</span></span>
            </div>
          </template>
          <template #cell(priority)="data">
            <div class="justify-between text-dark" id='t-priority-wrapper'>
              <span :class="priorityClass(data.value.priority)" id='task-priority'>
                {{ data.value.priority ? data.value.priority.text : '' }}
              </span>
            </div>
          </template>
          <template #cell(assignee)="data">
            <div class="text-dark" id='t-assignee-wrapper'>
              <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
              <span id='task-assignee'><user-info :id="data.value ? data.value.userId : ''"  /></span>
            </div>
          </template>
          <template #cell(dueDate)="data">
            <div class="text-dark" id='t-dueDate-wrapper'>
              <span id='task-dueDate' v-format-date="data.value.dueDate"></span>
            </div>
          </template>
        <!-- </div> -->
      </bib-table>
    </template>
    <template v-else>
      <div class="d-flex" id='task-grid'>
        <task-grid-section :headless="true" label="Section" :taskFields="tableFields" :taskSections="tasks.slice(0, 3)" :open="true" groupName="1" />
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
    };
  },
  computed: {
    ...mapGetters({
      // sections: "section/getAllSections",
      user: "user/getUser"
    }),
  },
  mounted() {
    // this.$nextTick(async () => {
    this.$store.dispatch("section/fetchSections");
    // });
  },
  methods: {
    toggleSidebar() {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
    },

    statusClass(status) {
      if (status === "Past Due") return "text-red";
      if (status === "In-progress") return "text-blue";
    },

    priorityClass(priority) {
      if (priority === "Urgent") return "text-red";
      if (priority === "Top") return "text-orange";
      return "text-green";
    },
    taskSelected($event) {
      this.$store.dispatch('task/setSingleTask', $event)
    }
  },

};

</script>
