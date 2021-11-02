<template>
  <div class="task-group w-100">
    <section-title />

    <custom-table
      :fields="taskFields"
      :taskSections="taskSections"
      :headless="true"
      class="bg-white p-0"
      :groupName="groupName"
    >
      <template #cell(key)="data">
        {{ data.value.key }}
      </template>

      <template #cell(name)="data">
        <custom-check-box :id="'sidebar-' + groupName + '-' + data.value.key" />
        <span class="ml-05">{{ data.value.name }}</span>
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

      <template #cell(options)="data">
        <bib-icon :icon="data.value.options" />
      </template>
    </custom-table>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  props: {
    groupName: {
      type: String,
      default() {
        return "123";
      },
    },
  },
  data: function () {
    return {
      taskSections: [
        {
          key: 1,
          name: "Remind me what itme it is",
          assignee: "Bruno Goulet",
          dueDate: "Jan-22",
          options: "elipsis",
        },
        {
          key: 2,
          name: "Turn the music up",
          assignee: "Elon Musk",
          dueDate: "Jan-22",
          options: "elipsis",
        },
        {
          key: 3,
          name: "Live longer and prosper",
          assignee: "Johny Boy",
          dueDate: "Jan-22",
          options: "elipsis",
        },
      ],
      taskFields: [
        {
          key: "key",
          label: "#",
        },
        {
          key: "name",
          label: "Task name",
        },
        {
          key: "assignee",
          label: "Assignee",
        },
        {
          key: "dueDate",
          label: "Due Date",
        },
        {
          key: "options",
          label: "options",
        },
      ],
      flag: false,
    };
  },
};
</script>

<style scoped lang="scss">
.task-group {
  margin-bottom: 3rem;
}

::v-deep {
  .task-key {
    width: 4%;
    justify-content: center;
  }
  .task-name {
    width: 50%;
  }
  .task-assignee {
    width: 25%;
  }
  .task-dueDate {
    width: 16%;
  }
  .task-options {
    justify-content: center;
  }
}
</style>