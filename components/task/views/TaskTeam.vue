<template>
  <div id="task-team-wrapper" class="task-group w-100">
    <project-team-action />

    <custom-table
      :fields="tableFields"
      :taskSections="tableRowData"
      class="bg-white p-0"
      hide-no-column
    >
      <template #cell(key)="data">
        {{ data.value.key }}
      </template>

      <template #cell(name)="data">
        <custom-check-box :id="'team-' + data.value.key" />
        <span id="tt-name" class="ml-05">{{ data.value.name }}</span>
      </template>

      <template #cell(location)="data">
        <span id="tt-location" class="assignee-name ml-05">
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
import {PROJECT_TEAM_FIELDS} from '../../../config/constants';

export default {
  data: function () {
    return {
      tableRowData: [
        {
          name: "Persons Name",
          location: "Location",
          position: "Position",
          options: "Added/Modified",
        },
      ],
      tableFields: PROJECT_TEAM_FIELDS,
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