<template>
  <div>
    <task-actions :gridType="gridType" />

    <template v-if="gridType === 'list'">
      <custom-table
        :fields="tableFields"
        class="bg-white no-content"
        :contentless="true"
      >
      </custom-table>

      <task-list-section
        :headless="true"
        label="Past Due"
        :taskFields="tableFields"
        :taskSections="tableSections.slice(0, 3)"
        :open="true"
        labelClass="text-red"
        groupName="1"
      />
      <task-list-section
        :headless="true"
        label="Due Today"
        :taskFields="tableFields"
        :taskSections="tableSections.slice(3, 6)"
        :open="true"
        labelClass="text-orange"
        groupName="1"
      />
      <task-list-section
        :headless="true"
        label="Tomorrow"
        :taskFields="tableFields"
        :taskSections="tableSections.slice(6, 9)"
        :open="true"
        labelClass="text-green"
        groupName="1"
      />
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
      tableSections: DUMMY_TASKS,
    };
  },
};
</script>