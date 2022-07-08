<template>
  <div>
    <template v-if="viewtype == 'list'">
      <drag-table v-for="(item, index) in sections" :key="item.id" :fields="fields" :sections="item.tasks" :collapseObj="{'collapsed': false, 'label': item.title, 'variant': 'black',}" :headless="index > 0">
        <template #cell(title)="data">
          <div class="d-flex gap-05 align-center">
            <bib-icon icon="check-circle" :scale="1.25" variant="secondary" class="cursor-pointer" ></bib-icon>
            <span class="text-dark text-left cursor-pointer flex-grow-1" style="  line-height:1.25;" >{{ data.value.title }}</span>
          </div>
        </template>
        <template #cell(owner)="data">
          <user-info v-if="data.value.userId" :userId="data.value.userId"></user-info>
        </template>
        <template #cell(status)="data">
          <status-comp :status="data.value.status"></status-comp>
        </template>
        <template #cell(startDate)="data">
          <span class="text-dark d-inline-flex" style="line-height: normal;" v-format-date="data.value.createdAt"></span>
        </template>
        <template #cell(dueDate)="data">
          <span class="text-dark d-inline-flex" style="line-height: normal;" v-format-date="data.value.dueDate"></span>
        </template>
        <template #cell(priority)="data">
          <priority-comp :priority="data.value.priority"></priority-comp>
        </template>
      </drag-table>
    </template>
  </div>
</template>
<script>
import {SECTION_TASKS} from '~/dummy/tasks.js'
export default {
  name: "GoalTasks",
  data: function() {
    return {
      viewtype: "list",
      fields: [
        {
          key: "title",
          label: "Task name",
          width: "30%",
        },
        {
          key: "assignee",
          label: "Assignee",
          width: "20%",
        },
        {
          key: "status",
          label: "Status",
          width: "12%",
        },
        {
          key: "priority",
          label: "Priority",
          width: "12%",
        },
        {
          key: "startDate",
          label: "Start Date",
          width: "10%",
        },
        {
          key: "dueDate",
          label: "Due Date",
          width: "10%",
        }
      ],
      sections: SECTION_TASKS
    }
  }

}

</script>
<style>
</style>
