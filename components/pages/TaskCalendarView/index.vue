<template>
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
