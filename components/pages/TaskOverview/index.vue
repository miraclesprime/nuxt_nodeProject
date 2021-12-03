<template>
  <div>
    <task-actions @change-data="getData" />

    <template v-if="gridType === 'list'">
      <bib-table
        v-for="(item, index) in sections"
        :key="'table-section-' + index"
        :fields="tableFields"
        :sections="item.tasks"
        :collapseObj="{
          collapsed: false,
          label: item.title,
          variant: 'danger',
        }"
        :headless="index !== 0"
        class="border-gray4 bg-white"
        :style="{ borderBottom: 'none' }"
        @item-clicked="toggleSidebar"
      >
        <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
            <span class="text-dark">{{ data.value.title }}</span>
          </div>
        </template>
        <template #cell(status)="data">
          <div class="justify-between text-dark">
            <span :class="statusClass(data.value.status.text)">
              {{ data.value.status.text }}
            </span>
            <span :class="statusClass(data.value.status.text)">
              {{ data.value.progress }}</span
            >
          </div>
        </template>
        <template #cell(priority)="data">
          <div class="justify-between text-dark">
            <span :class="priorityClass(data.value.priority)">
              {{ data.value.priority }}
            </span>
          </div>
        </template>
        <template #cell(assignee)>
          <div class="text-dark">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>

            <!-- <span>{{ data.value.assignee }}</span> -->
            <span>assignee</span>
          </div>
        </template>
        <template #cell(dueDate)="data">
          <div class="text-dark">
            <span>{{ data.value.dueDate }}</span>
          </div>
        </template>
      </bib-table> -->
    </template>

    <template v-else>
      <div class="d-flex">
        <task-grid-section
          label="Past Due"
          :taskSections="tableSections.slice(0, 3)"
          groupName="grid-"
        />

        <task-grid-section
          label="Due Today"
          :taskSections="tableSections.slice(3, 6)"
          groupName="grid-"
        />

        <task-grid-section
          label="Tomorrow"
          :taskSections="tableSections.slice(6, 9)"
          groupName="grid-"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { DUMMY_TASKS, DUMMY_TASK_FIELDS } from "~/dummy/tasks.js";

export default {
  props: {
    gridType: String,
  },
  data() {
    return {
      tableFields: DUMMY_TASK_FIELDS,
      sections: [],
      tableSections: DUMMY_TASKS,
      flag: false,
    };
  },
  created() {
    this.getData();
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

    async getData() {
      let response = await this.$axios.$get("/section");
      this.sections = response.data;
    },
  },
};
</script>