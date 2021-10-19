<template>
  <div>
    <div class="actions">
      <div class="action-left">
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
      </div>

      <div class="action-right"></div>
    </div>

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
      <li class="task-item justify-center" style="flex: 1">
        <svg
          viewBox="13.349 193.536 478.188 95.709"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
        >
          <path
            d="M 395.899 241.426 C 395.899 204.615 435.749 181.608 467.628 200.014 C 499.507 218.419 499.507 264.433 467.628 282.838 C 460.358 287.035 452.113 289.245 443.718 289.245 C 417.308 289.245 395.899 267.836 395.899 241.426 Z M 204.624 241.426 C 204.624 204.615 244.473 181.608 276.352 200.014 C 308.232 218.419 308.232 264.433 276.352 282.838 C 269.083 287.035 260.837 289.245 252.443 289.245 C 226.033 289.245 204.624 267.836 204.624 241.426 Z M 13.349 241.426 C 13.349 204.615 53.198 181.608 85.077 200.014 C 116.957 218.419 116.957 264.433 85.077 282.838 C 77.808 287.035 69.562 289.245 61.168 289.245 C 34.758 289.245 13.349 267.836 13.349 241.426 Z"
            style=""
          ></path>
        </svg>
      </li>
    </ul>

    <task-bundle
      title="Past Due"
      :tasks="tasks.slice(0, 2)"
      :isExpanded="true"
    />
    <task-bundle
      title="Due Today"
      :tasks="tasks.slice(2, 5)"
      :isExpanded="true"
    />
    <task-bundle
      title="Tomorrow"
      :tasks="tasks.slice(5, 9)"
      :isExpanded="true"
    />
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