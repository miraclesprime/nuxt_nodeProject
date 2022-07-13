<template>
  <div>
    <template v-if="viewtype == 'list'">
      <draggable :list="localdata" tag="div" class="" @end="sectionDragend">
        <drag-table v-for="(item, index) in localdata" :key="item.id" :fields="fields" :sections="item.tasks" :collapseObj="{'collapsed': false, 'label': item.title, 'variant': 'black'}" :headless="index > 0" v-on:new-task="newTask" v-on:section-dragend="sectionDragend" v-on:task-dragend="taskDragend">
          <template #cell(title)="data">
            <div class="d-flex gap-05 align-center">
              <bib-icon icon="check-circle" :scale="1.25" variant="secondary" class="cursor-pointer"></bib-icon>
              <span class="text-dark text-left cursor-pointer flex-grow-1" style="  line-height:1.25;">{{ data.value.title }}</span>
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
      </draggable>
    </template>
  </div>
</template>
<script>
import { SECTION_TASKS } from '~/dummy/tasks.js'
import draggable from 'vuedraggable'
export default {
  name: "GoalTasks",
  components: {
    draggable
  },
  data: function() {
    return {
      viewtype: "list",
      fields: [{
          key: "title",
          label: "Task name",
          width: "30%",
          header_icon: {
            icon: "swap-vertical",
            event: "title-sort",
            isActive: false,
          },
        },
        {
          key: "assignee",
          label: "Assignee",
          width: "20%",
          header_icon: {
            icon: "swap-vertical",
            event: "assignee-sort",
            isActive: false,
          },
        },
        {
          key: "status",
          label: "Status",
          width: "12%",
          header_icon: {
            icon: "swap-vertical",
            event: "status-sort",
            isActive: false,
          },
        },
        {
          key: "priority",
          label: "Priority",
          width: "12%",
          header_icon: {
            icon: "swap-vertical",
            event: "priority-sort",
            isActive: false,
          },
        },
        {
          key: "startDate",
          label: "Start Date",
          width: "10%",
          header_icon: {
            icon: "swap-vertical",
            event: "startDate-sort",
            isActive: false,
          },
        },
        {
          key: "dueDate",
          label: "Due Date",
          width: "10%",
          header_icon: {
            icon: "swap-vertical",
            event: "dueDate-sort",
            isActive: false,
          },
        }
      ],
      sections: SECTION_TASKS
    }
  },
  computed: {
    localdata() {
      return JSON.parse(JSON.stringify(this.sections))
    }
  },
  methods: {
    rightClickRow($event) {
      console.log($event.row)
    },
    newTask($event) {
      console.log($event)
      alert("new task in section")
    },
    sectionDragend() {
      console.log('section drag end')
    },
    taskDragend($event) {
      console.log('task drag end', $event)
    }
  }

}

</script>
<style>
</style>
