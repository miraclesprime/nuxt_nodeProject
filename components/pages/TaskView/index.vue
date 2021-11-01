<template>
  <div>
    <task-actions :gridType="gridType"></task-actions>

    <template v-if="gridType === 'list'">
      <custom-table
        :fields="tableFields"
        class="bg-white no-content"
        :contentless="true"
      >
      </custom-table>

      <task-list-section
        :headless="true"
        label="Section"
        :taskFields="tableFields"
        :taskSections="tableSections.slice(0, 3)"
        :open="true"
        groupName="1"
      />
      <task-list-section
        :headless="true"
        label="Section"
        :taskFields="tableFields"
        :taskSections="tableSections.slice(3, 6)"
        groupName="1"
      />
      <task-list-section
        :headless="true"
        label="Section"
        :taskFields="tableFields"
        :taskSections="tableSections.slice(6, 9)"
        groupName="1"
      />
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