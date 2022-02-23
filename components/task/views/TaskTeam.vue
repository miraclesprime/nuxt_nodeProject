<template>
  <div class="task-group w-100">
    <section-title />

    <custom-table
      :fields="taskFields"
      :taskSections="taskSections"
      class="bg-white p-0"
      :groupName="groupName"
    >
      <template #cell(key)="data">
        {{ data.value.key }}
      </template>

      <template #cell(name)="data">
        <custom-check-box :id="'team-' + groupName + '-' + data.value.key" />
        <span class="ml-05">{{ data.value.name }}</span>
      </template>

      <template #cell(location)="data">
        <span class="assignee-name ml-05">
          {{ data.value.location }}
        </span>
      </template>

      <template #cell(position)="data">
        {{ data.value.position }}
      </template>

      <template #cell(options)="data">
        {{ data.value.options }}
      </template>
    </custom-table>
  </div>
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
          name: "Persons Name",
          location: "Location",
          position: "Position",
          options: "Added/Modified",
        },
        {
          key: 2,
          name: "Persons Name",
          location: "Location",
          position: "Position",
          options: "Added/Modified",
        },
        {
          key: 3,
          name: "Persons Name",
          location: "Location",
          position: "Position",
          options: "Added/Modified",
        },
        {
          key: 4,
          name: "Persons Name",
          location: "Location",
          position: "Position",
          options: "Added/Modified",
        },
        {
          key: 5,
          name: "Persons Name",
          location: "Location",
          position: "Position",
          options: "Added/Modified",
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
          key: "location",
          label: "Location",
        },
        {
          key: "position",
          label: "Position",
        },
        {
          key: "options",
          label: "Add/Modified",
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
  .task-location {
    width: 16%;
  }
  .task-position {
    width: 15%;
  }
  .task-options {
    width: 15%;
  }
}
</style>