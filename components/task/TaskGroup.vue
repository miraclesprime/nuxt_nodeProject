<template>
  <div class="task-group w-100" id="task-group-main-wrapper">
    <section-title></section-title>
    <bib-table
      :fields="taskFields"
      :sections="taskSections"
      :headless="true"
      hide-no-column
      class="bg-white border-top-gray4"
    >
      <template #cell(name)="data">
        <div  class="d-flex gap-05 align-center">
          <bib-icon icon="check-circle" variant="secondary" class="cursor-pointer" ></bib-icon>
          <span class="text-dark">{{ data.value.name }}</span>
        </div>
      </template>
      <template #cell(assignee)="data">
        <user-info :user="data.value.assignee"></user-info>
      </template>
      <template #cell(dueDate)="data">
        <span class="text-dark">{{ data.value.dueDate }}</span>
      </template>
      <template #cell(options)="data">
        <bib-icon icon="horizontal-dots"></bib-icon>
        <!-- <bib-button pop="horizontal-dots">
          <template v-slot:menu>
            <div class="list">
              <span class="list__item">View profile</span>
              <span class="list__item">Edit</span>
              <span class="list__item">Delete</span>
            </div>
          </template>
        </bib-button> -->
      </template>
    </bib-table>
    <!-- <custom-table
      :fields="taskFields"
      :taskSections="taskSections"
      :headless="true"
      class="bg-white p-0"
      hide-no-column
      :groupName="groupName"
    >
      <template #cell(key)="data">
        {{ data.value.key }}
      </template>

      <template #cell(name)="data">
        <custom-check-box :id="'sidebar-' + groupName + '-' + data.value.key" />
        <span class="ml-05" id="tgroup-name">{{ data.value.name }}</span>
      </template>

      <template #cell(assignee)="data">
        <bib-avatar size="25px"></bib-avatar>
        <span class="assignee-name ml-05" id="tgroup-assignee">
          {{ data.value.assignee }}
        </span>
      </template>

      <template #cell(dueDate)="data">
        {{ data.value.dueDate }}
      </template>

      <template #cell(options)="data">
        <bib-icon :icon="data.value.options" />
      </template>
    </custom-table> -->
  </div>
  <!-- </div> -->
</template>
<script>
export default {
  props: {
    groupName: {
      type: String,
      default () {
        return "123";
      },
    },
  },
  data: function() {
    return {
      taskSections: [{
          key: 1,
          name: "Remind me what itme it is",
          assignee: {firstName: "Bruno", lastName: "Goulet"},
          dueDate: "Jan-22",
          options: "elipsis",
        },
        {
          key: 2,
          name: "Turn the music up",
          assignee: {firstName: "Elon", lastName: "Musk"},
          dueDate: "Jan-22",
          options: "elipsis",
        },
        {
          key: 3,
          name: "Live longer and prosper",
          assignee: {firstName: "Johny", lastName: "Boy"},
          dueDate: "Jan-22",
          options: "elipsis",
        },
      ],
      taskFields: [{
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

</style>
