<template>
  <div>
    <template v-if="viewtype == 'list'">
      <drag-table :fields="fields" :sections="localdata" :tasksKey="'tasks'" :collapsible="true" v-on:task-click="taskClicked" v-on:new-task="newTask" v-on:section-dragend="sectionDragend" v-on:task-dragend="taskDragend">
      </drag-table>
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
          event: "task-click",
        },
        {
          key: "userId",
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
          key: "createdAt",
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
      sections: SECTION_TASKS,
      // localdata: [],
    }
  },
  computed: {
    localdata() {
      return JSON.parse(JSON.stringify(this.sections))
    }
  },
  mounted() {
    this.localdata = JSON.parse(JSON.stringify(this.sections))
  },
  methods: {
    taskClicked($event) {
      console.info('task clicked ->', $event.title);
    },
    rightClickRow($event) {
      console.log($event.row)
    },
    newTask($event) {
      console.log($event.id, $event.title)
      alert("new task in section")
    },
    sectionDragend($event) {
      console.log('section drag end', $event)
    },
    taskDragend($event) {
      console.log('task drag end', $event)
    }
  }

}

</script>
<style>
</style>
