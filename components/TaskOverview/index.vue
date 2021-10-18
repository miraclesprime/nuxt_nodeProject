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
    <bib-table :fields="fields" :sections="tasks">
      <template #cell(id)="data">
        {{ data.value.id }}
      </template>
      <template #cell(title)="data">
        {{ data.value.title }}
      </template>
      <template #cell(status)="data">
        {{ data.value.status }}
      </template>
      <template #cell(priority)="data">
        {{ data.value.priority }}
      </template>
      <template #cell(assignee)="data">
        {{ data.value.assignee }}
      </template>
      <template #cell(dueDate)="data">
        {{ $toDate(data.value.dueDate) }}
      </template>
    </bib-table>
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
