<template>
  <div>
    <task-actions :gridType="gridType"></task-actions>

    <template v-if="gridType === 'list'">
      <bib-table
        :fields="tableFields"
        :sections="tableSections.slice(0, 3)"
        :collapseObj="{
          collapsed: false,
          label: 'Section',
        }"
        class="border-gray4 bg-white"
        :style="{ borderBottom: 'none' }"
        @item-clicked="toggleSidebar"
      >
        <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
            <span class="text-dark">{{ data.value.name }}</span>
          </div>
        </template>
        <template #cell(status)="data">
          <div class="justify-between text-dark">
            <span :class="statusClass(data.value.status)">
              {{ data.value.status }}
            </span>
            <span :class="statusClass(data.value.status)">
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
        <template #cell(assignee)="data">
          <div class="text-dark">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>

            <span>{{ data.value.assignee }}</span>
          </div>
        </template>
        <template #cell(dueDate)="data">
          <div class="text-dark">
            <span>{{ data.value.dueDate }}</span>
          </div>
        </template>
      </bib-table>

      <bib-table
        :fields="tableFields"
        :sections="tableSections.slice(3, 6)"
        :headless="true"
        :collapseObj="{
          collapsed: true,
          label: 'Section',
        }"
        class="border-gray4 bg-white"
        :style="{ borderBottom: 'none' }"
        @item-clicked="toggleSidebar"
      >
        <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
            <span class="text-dark">{{ data.value.name }}</span>
          </div>
        </template>
        <template #cell(status)="data">
          <div class="justify-between text-dark">
            <span :class="statusClass(data.value.status)">
              {{ data.value.status }}
            </span>
            <span :class="statusClass(data.value.status)">
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
        <template #cell(assignee)="data">
          <div class="text-dark">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>

            <span>{{ data.value.assignee }}</span>
          </div>
        </template>
        <template #cell(dueDate)="data">
          <div class="text-dark">
            <span>{{ data.value.dueDate }}</span>
          </div>
        </template>
      </bib-table>

      <bib-table
        :fields="tableFields"
        :sections="tableSections.slice(6, 9)"
        :headless="true"
        :collapseObj="{
          collapsed: true,
          label: 'Section',
        }"
        class="border-gray4 bg-white"
        :style="{ borderBottom: 'none' }"
        @item-clicked="toggleSidebar"
      >
        <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
            <span class="text-dark">{{ data.value.name }}</span>
          </div>
        </template>
        <template #cell(status)="data">
          <div class="justify-between text-dark">
            <span :class="statusClass(data.value.status)">
              {{ data.value.status }}
            </span>
            <span :class="statusClass(data.value.status)">
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
        <template #cell(assignee)="data">
          <div class="text-dark">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>

            <span>{{ data.value.assignee }}</span>
          </div>
        </template>
        <template #cell(dueDate)="data">
          <div class="text-dark">
            <span>{{ data.value.dueDate }}</span>
          </div>
        </template>
      </bib-table>
    </template>

    <template v-else>
      <div class="d-flex">
        <task-grid-section
          :headless="true"
          label="Section"
          :taskFields="tableFields"
          :taskSections="tableSections.slice(0, 3)"
          :open="true"
          groupName="1"
        />
        <task-grid-section
          :headless="true"
          label="Section"
          :taskFields="tableFields"
          :taskSections="tableSections.slice(3, 6)"
          groupName="1"
        />
        <task-grid-section
          :headless="true"
          label="Section"
          :taskFields="tableFields"
          :taskSections="tableSections.slice(6, 9)"
          groupName="1"
        />
        <task-grid-section
          :headless="true"
          label="Section"
          :taskFields="tableFields"
          :taskSections="tableSections.slice(9, 12)"
          groupName="1"
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
      tableSections: DUMMY_TASKS,
      flag: false,
    };
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
  },
};
</script>