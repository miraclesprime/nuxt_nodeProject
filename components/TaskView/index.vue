<template>
  <div>
    <task-actions></task-actions>

    <ul class="task-bundle" v-if="gridType === 'grid'">
      <li class="task-item task-number">
        <span>#</span>
      </li>
      <li class="task-item task-name">
        <span>Task name</span>
      </li>
      <li class="task-item task-status">
        <span>Status</span>
      </li>
      <li class="task-item task-priority">
        <span>Priority</span>
      </li>
      <li class="task-item task-assignee">
        <span>Assignee</span>
      </li>
      <li class="task-item task-date">
        <span>Due date</span>
      </li>
      <li class="task-item" style="flex: 1">
        <span></span>
      </li>
    </ul>

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
  </div>
</template>

<script>
export default {
  props: {
    tasks: {
      type: Array,
      default: [],
    },
    fields: {
      type: Array,
      default: [],
    },
    gridType: {
      type: String,
      default: "grid",
    },
  },
  watch: {
    gridType() {
      console.log("this gird", this.gridType);
    },
  },
};
</script>