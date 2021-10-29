<template>
  <div>
    <task-actions />

    <custom-table
      :fields="tableFields"
      class="bg-white no-content"
      :contentless="true"
    >
    </custom-table>

    <task-section
      :headless="true"
      label="Past Due"
      :taskFields="tableFields"
      :taskSections="tableSections.slice(0, 3)"
      :open="true"
      labelClass="text-red"
      groupName="1"
    />
    <task-section
      :headless="true"
      label="Due Today"
      :taskFields="tableFields"
      :taskSections="tableSections.slice(3, 6)"
      :open="true"
      labelClass="text-orange"
      groupName="1"
    />
    <task-section
      :headless="true"
      label="Tomorrow"
      :taskFields="tableFields"
      :taskSections="tableSections.slice(6, 9)"
      :open="true"
      labelClass="text-green"
      groupName="1"
    />
  </div>
</template>

<script>
import { DUMMY_TASKS, DUMMY_TASK_FIELDS } from "~/dummy/tasks.js";

export default {
  data() {
    return {
      tableFields: DUMMY_TASK_FIELDS,
      tableSections: DUMMY_TASKS,
    };
  },
};
</script>