<template>
  <bib-detail-collapse :label="label" :open="open" :class="labelClass">
    <template v-slot:content>
      <task-table
        :fields="taskFields"
        :taskSections="taskSections"
        :headless="headless"
        :groupName="groupName"
        class="bg-white p-0"
      >
        <template #cell(key)="data">
          {{ data.value.key }}
        </template>

        <template #cell(name)="data">
          <custom-check-box :id="groupName + '-' + data.value.key" />
          <span class="ml-05">{{ data.value.name }}</span>
        </template>

        <template #cell(status)="data">
          <span :class="statusClass(data.value.status)">
            {{ data.value.status }}
          </span>
          <span :class="statusClass(data.value.status)">
            {{ data.value.progress }}</span
          >
        </template>
        <template #cell(priority)="data">
          <span :class="priorityClass(data.value.priority)">
            {{ data.value.priority }}
          </span>
        </template>
        <template #cell(assignee)="data">
          <bib-avatar size="25px"></bib-avatar>
          <span class="assignee-name ml-05">
            {{ data.value.assignee }}
          </span>
        </template>
        <template #cell(dueDate)="data">
          {{ data.value.dueDate }}
        </template>
      </task-table>
    </template>
  </bib-detail-collapse>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default() {
        return "Task Section";
      },
    },
    open: {
      type: Boolean,
      default() {
        return false;
      },
    },
    headless: {
      type: Boolean,
      default() {
        return false;
      },
    },
    taskSections: {
      type: Array,
      default() {
        return [];
      },
    },
    taskFields: {
      type: Array,
      default() {
        return [];
      },
    },
    groupName: {
      type: String,
      default() {
        return "1";
      },
    },
    labelClass: {
      type: String,
      default() {
        return "text-dark";
      },
    },
  },
  methods: {
    activeTab(e) {},

    statusClass(status) {
      if (status === "Past Due") return "text-red";
      if (status === "In-progress") return "text-blue";
    },

    priorityClass(priority) {
      if (priority === "Urgent") return "text-red";
      if (priority === "Top") return "text-orange";
      return "text-green";
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .detail-collapse__content {
    padding: 0;
  }

  .table {
    tr:first-child td {
      border-top: none;
    }

    tr:nth-child(2) td {
      border-top: 1px solid $gray3;
    }
  }

  .detail-collapse__header {
    border-top: none !important;
  }

  .border-top-gray4 {
    border-top: 1px solid $gray4;
  }
}
</style>