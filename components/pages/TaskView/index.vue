<template>
  <div>
    <task-actions></task-actions>

    <template v-if="gridType === 'grid'">
      <custom-table
        :fields="tableFields"
        class="bg-white no-content"
        :contentless="true"
      >
      </custom-table>

      <task-section
        :headless="true"
        label="Section"
        :taskFields="tableFields"
        :taskSections="tableSections.slice(0, 3)"
        :open="true"
        groupName="1"
      />
      <task-section
        :headless="true"
        label="Section"
        :taskFields="tableFields"
        :taskSections="tableSections.slice(3, 6)"
        groupName="1"
      />
      <task-section
        :headless="true"
        label="Section"
        :taskFields="tableFields"
        :taskSections="tableSections.slice(6, 9)"
        groupName="1"
      />
    </template>

    <template v-if="gridType === 'list'">
      <div :class="{ 'd-flex': gridType === 'list' }">
        <task-bundle
          title="Section"
          :tasks="tasks.slice(2, 5)"
          :isExpanded="index === 0 ? true : false"
          :gridType="gridType"
          v-for="(item, index) in [1, 2, 3, 4, 5]"
          :key="'task-bundle-' + index"
        />
      </div>
    </template>
  </div>
</template>


<script>
import { DUMMY_TASKS, DUMMY_TASK_FIELDS } from "~/dummy/tasks.js";

export default {
  data() {
    return {
      tableFields: DUMMY_TASK_FIELDS,
      tableSections: DUMMY_TASKS,
      gridType: "grid",
    };
  },
};
</script>