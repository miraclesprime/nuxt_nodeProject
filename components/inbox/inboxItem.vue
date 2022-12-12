<template>
  <div class="inbox-item border-bottom-gray2 py-1 px-3 position-relative cursor-pointer" :class="{'bg-light': active == item.id}" @click="itemClick">
    <div class="new text-white font-xs position-absolute">New
      <span class="triangle"></span>
    </div>
    <div class="d-inline-flex gap-05 pb-05 text-secondary font-md">
      <span>
        <user-info :userId="item.userId"></user-info>
      </span>
      <span v-if="projTitle">
        <!-- <strong>assigned a task to you in</strong> -->
        <bib-icon icon="briefcase" variant="gray5"></bib-icon> {{projTitle}}
      </span>
      <!-- <span v-else><strong>{{item.text}}</strong></span> -->
    </div>
    <div class="d-flex align-center justify-between">
      <h4>{{taskTitle || projTitle}}</h4>
      <span class="duedate d-inline-flex align-center gap-05 text-secondary font-md">
        <bib-icon icon="calendar" variant="gray5"></bib-icon>
        <format-date :datetime="item.updatedAt"></format-date>
      </span>
    </div>
    <div class="content font-md py-05">
      <div v-if="item.content" class="inbox-item-content mb-05">
        <template v-for="c in item.content" >
          <div>{{c.title}}</div><div>@ {{c.time}}</div> 
        </template>
      </div>
      <!-- <drag-table-simple v-if="item.content" :fields="fields" :tasks="item.content" headless :titleIcon="{ icon: 'tick'}" :collapsible="false" :drag="false"></drag-table-simple> -->
      <span v-else>{{item.text}}<br></span>
      <div v-html="taskComment.comment"></div>
      <div v-html="projComment.comment"></div>
    </div>
    <div class="sent font-sm text-gray5">Sent <!-- on Sept. 22, 2022 --> @ {{$toTime(item.updatedAt)}} </div>
  </div>
</template>
<script>
import { DUMMY_TASKS } from '~/dummy/tasks'
export default {

  name: 'InboxItem',

  props: {
    item: Object,
    active: Number,
  },

  data() {
    return {
      fields: [{
        key: "title",
        label: "Task name",
        width: "70%",
      },
      {
        key: "time",
        label: "@",
      },
       /*{
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
      }*/],
      tasks: DUMMY_TASKS,
    }
  },
  computed: {
    taskTitle() {
      return this.item['task'] ? this.item.task.title : ''
    },
    taskComment() {
      return this.item['taskComment'] ? this.item.taskComment : ''
    },
    projTitle() {
      return this.item['project'] ? this.item.project.title : ''
    },
    projComment() {
      return this.item['projectComment'] ? this.item.projectComment : ''
    },
  },
  methods: {
    itemClick() {
      if (this.item.taskId) {
        this.$emit('task-click', {id: this.item.id, taskId: this.item.taskId})
      }
      if (this.item.projectId) {
        this.$emit('project-click', {id: this.item.id, projectId: this.item.projectId})
      }
    },
  }
}

</script>
<style lang="scss" scoped>
.inbox-item {
  h4 {
    font-size: 16px;
  }
  &-content {
    background-color: white;
    display: grid;
    grid-template-columns: 1fr max-content;
    /*gap: 0.25rem;*/
    border-top: 1px solid $light;
    border-right: 1px solid $light;
    > * { padding: 0.325rem; border-bottom: 1px solid $light; border-left: 1px solid $light; }
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
