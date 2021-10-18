<template>
  <div>
    <a href="#" class="add-task w-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 48 48"
      >
        <g>
          <path
            d="M39,22H26V9a2,2,0,0,0-4,0V22H9a2,2,0,0,0,0,4H22V39a2,2,0,0,0,4,0V26H39a2,2,0,0,0,0-4Z"
          ></path>
        </g>
      </svg>

      <span>Add Team Members</span>
    </a>
    <ul class="task-bundle">
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

    <task-bundle
      title="Section"
      :tasks="tasks.slice(2, 9)"
      :isExpanded="true"
    />
    <task-bundle title="Section" :tasks="tasks.slice(2, 9)" />
    <task-bundle title="Section" :tasks="tasks.slice(2, 9)" />
    <task-bundle title="Section" :tasks="tasks.slice(2, 9)" />
    <task-bundle title="Section" :tasks="tasks.slice(2, 9)" />
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
  },
};
</script>