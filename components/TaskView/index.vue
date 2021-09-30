<template>
  <bib-table :fields="fields" :sections="tasks">
    <template #cell(id)="data">
      {{ data.value }}
    </template>
    <template #cell(title)="data">
      {{ data.value }}
    </template>
    <template #cell(status)="data">
      {{ data.value }}
    </template>
    <template #cell(priority)="data">
      {{ data.value }}
    </template>
    <template #cell(assignee)="data">
      {{ data.value }}
    </template>
    <template #cell(dueDate)="data">
      {{ $toDate(data.value) }}
    </template>
  </bib-table>
</template>

<script>
export default {
  props: {
    tasks: {
      type: Array,
      default: []
    },
    fields: {
      type: Array,
      default: []
    }
  }
};
</script>
