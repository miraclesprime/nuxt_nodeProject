<template>
  <div class="container pt-1">
    <div class="task-group w-100">
      <section-title title="Day or Date" icon="arrowhead-down" />

      <custom-table
        :fields="taskFields"
        :taskSections="taskSections"
        :headless="true"
        class="bg-white p-0"
        :groupName="groupName"
      >
        <template #cell(time)="data">
          {{ data.value.time }}
        </template>

        <template #cell(content)="data">
          <custom-check-box
            :id="'sidebar-' + groupName + '-' + data.value.key"
          />
          <span class="ml-05">Entity</span>
          <span class="ml-05">Action</span>
          <span class="ml-05 text-blue">Location</span>
        </template>
      </custom-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groupName: {
      type: String,
      default() {
        return "history";
      },
    },
  },
  data: function () {
    return {
      taskSections: [
        {
          key: 1,
          time: "8:00",
          content: "Action",
        },
        {
          key: 2,
          time: "8:00",
          content: "Action",
        },
        {
          key: 3,
          time: "8:00",
          content: "Action",
        },
      ],
      taskFields: [
        {
          key: "time",
          label: "Time",
        },
        {
          key: "content",
          label: "Task Content",
        },
      ],
      flag: false,
    };
  },
};
</script>