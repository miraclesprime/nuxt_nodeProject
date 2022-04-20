<template>
  <div class="task-group w-100" id="task-group-main-wrapper">
    <section-title></section-title>
    <table class="table ">
      <!-- <thead>
        <tr>
          <th v-for="field in taskFields" :key="field.key">{{field.label}}</th>
        </tr>
      </thead> -->
      <tbody>
        <tr v-for="sub in taskSections" :key="sub.key">
          <!-- <td>{{sub.key}}</td> -->
          <td>
            <div class="d-flex gap-05 align-center">
              <bib-icon icon="check-circle" :variant="sub.isDone ? 'success' : 'gray4'"></bib-icon> {{sub.name}}
            </div>
          </td>
          <td>
            <user-info :user="sub.assignee" avatar="https://i.pravatar.cc/32"></user-info>
          </td>
          <td>{{sub.dueDate}}</td>
          <td>
            <!-- <bib-popup :pop="sub.options" icon-variant="gray5" size="sm" >
              <template v-slot:menu>
                <div class="list">
                  <span class="list__item">View</span>
                  <span class="list__item">Edit</span>
                  <span class="list__item danger">Delete</span>
                </div>
              </template>
            </bib-popup> -->
            <bib-icon :icon="sub.options" variant="gray5"></bib-icon>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <bib-table
      :fields="taskFields"
      :sections="taskSections"
      :headless="true"
      hide-no-column
      class="bg-white border-white border-top-gray4"
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
      </template>
    </bib-table> -->
  </div>
  <!-- </div> -->
</template>
<script>
export default {
  name: "TaskGroup",

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
          name: "Remind me what time it is",
          assignee: { firstName: "Bruno", lastName: "Goulet" },
          dueDate: "22 Jan 2022",
          isDone: false,
          options: "elipsis",
        },
        {
          key: 2,
          name: "Turn the music up",
          assignee: { firstName: "Elon", lastName: "Musk" },
          dueDate: "28 Feb 2022",
          isDone: false,
          options: "elipsis",
        },
        {
          key: 3,
          name: "Live longer and prosper",
          assignee: { firstName: "Johny", lastName: "Boy" },
          dueDate: "02 Mar 2022",
          isDone: true,
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
          label: "Options",
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

.table {
  width: 100%;
  border: 1px solid transparent;
  border-collapse: collapse;

  thead {

    th,
    td {
      text-align: left;
      font-weight: bold;
      padding: 0.2rem;
      border-top: 1px solid var(--bib-light);
      color: var(--bib-text-light);

      &:not(:first-child) {
        border-left: 1px solid var(--bib-light);
      }
    }
  }

  tbody {
    td {
      padding: 0.2rem;
      border-top: 1px solid var(--bib-light);
      border-bottom: 1px solid var(--bib-light);
      color: var(--bib-dark-sub1);

      &:not(:first-child) {
        border-left: 1px solid var(--bib-light);
      }
    }
  }
}

</style>
