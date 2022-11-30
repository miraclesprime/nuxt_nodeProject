<template>
  <div class="inbox-item border-bottom-light py-1 px-3 position-relative">
    <div class="new text-white font-xs position-absolute">New
      <span class="triangle"></span>
    </div>
    <div class="d-inline-flex gap-05 pb-1 text-secondary font-md">
      <span>
        <user-info :userId="'O3GWpmbk5ezJn4KR'"></user-info>
      </span> <strong>assigned a task to you in</strong>
      <bib-icon icon="briefcase" variant="gray5" ></bib-icon> {{item.projectTitle}}
    </div>
    <div class="d-flex align-center justify-between">
      <h4>{{item.taskTitle}}</h4>
      <span class="duedate d-inline-flex align-center gap-05 text-secondary font-md">
        <bib-icon icon="calendar" variant="gray5"></bib-icon> <format-date :datetime="item.updatedAt"></format-date>
      </span>
    </div>
    <div class="content font-md py-1">
      {{item.text}}
    </div>
    <drag-table-simple :fields="fields" :tasks="tasks" headless :titleIcon="{ icon: 'check-circle'}" :collapsible="false" :drag="false" ></drag-table-simple>
    <div class="sent font-sm">Sent on Sept. 22, 2022 @ 9:32 PM (EST)</div>
  </div>
</template>
<script>
import { DUMMY_TASKS } from '~/dummy/tasks'
export default {

  name: 'InboxItem',

  props: {
    item: Object,
  },

  data() {
    return {
      fields: [{
        key: "title",
        label: "Task name",
        width: "32%",
      }, {
        key: "status",
        label: "Status",
      }, {
        key: "priority",
        label: "Priority",
      }, {
        key: "assignee",
        label: "Owner",
      }, {
        key: "startDate",
        label: "Start Date",
      }, {
        key: "dueDate",
        label: "Due Date",
      }],
      tasks: DUMMY_TASKS,
    }
  }
}

</script>
<style lang="scss" scoped>
.inbox-item {
  h4 {
    font-size: 16px;
  }
}

.new {
  background-color: $success;
  left: 0;
  top: 1rem;
  padding-left: 0.25rem;
  padding-right: 0.6rem;
  height: 24px;
  line-height: 24px;

  span {
    position: absolute;
    right: 0;
    top: 0;
    width: 0;
    height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 6px solid white;
  }
}

</style>
