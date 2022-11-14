<template>
  <draggable :list="localdata" tag="div" handle=".drag-handle" class="" @end="$emit('section-dragend', localdata)">
    <table v-for="(section, index) in localdata" :key="section.id + templateKey" v-click-outside="unselectAll" class="table" :class="{ 'table__headless': index>=1 }">
      <thead>
        <tr class="table__hrow">
          <th width="3%">&nbsp;</th>
          <th v-for="(field, index) in fields" :key="field.key + index" :style="`width: ${field.width};`" :class="{'table__hrow__active': field.header_icon && field.header_icon.isActive}">
            <div class="align-center">
              <span class="flex-grow-1"> {{ field.label }} </span>
              <template v-if="field.header_icon">
                <div class="ml-05 shape-circle bg-light bg-hover-gray2 width-105 height-105 d-flex justify-center align-center cursor-pointer" :class="{'bg-black': field.header_icon.isActive }" @click="$emit(field.header_icon.event, field.key)">
                  <bib-icon :icon="field.header_icon.icon" :scale="1" variant="gray5" hoverVariant="gray6"></bib-icon>
                </div>
              </template>
            </div>
          </th>
        </tr>
      </thead>
      <tr :style="{ width: '0rem' }" v-if="collapsible">
        <td :colspan="cols.length+1" class="section">
          <div class="section-header d-flex align-center gap-05 text-gray6">
            <div class="drag-handle width-2 text-center"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                <rect fill="none" height="24" width="24" />
                <path d="M20,9H4v2h16V9z M4,15h16v-2H4V15z" /></svg></div>
            <div class="d-flex gap-05 align-center cursor-pointer" @click.self="collapseItem($event, 'tbody'+section.id)">
              <bib-icon icon="arrow-down" :scale="0.5" variant="gray6"></bib-icon> {{section.title.includes('_section') ? 'Untitled section' : section.title}}
            </div>
          </div>
        </td>
      </tr>
      <draggable :list="section[tasksKey]" tag="tbody" :ref="'tbody'+section.id" :data-section="section.id" :group="{name: 'task'}" class="task-draggable " handle=".drag-handle" @start="taskDragStart" :move="moveTask" @end="taskDragEnd">
        <tr v-for="(task, index) in section[tasksKey]" :key="task.id + section.title + index + templateKey" class="table__irow" @click.stop="rowClick($event, task)" @click.right.prevent="rowRightClick($event, task)">
          <td>
            <div class="drag-handle width-2 "><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                <rect fill="none" height="24" width="24" />
                <path d="M20,9H4v2h16V9z M4,15h16v-2H4V15z" /></svg></div>
          </td>
          <td v-for="(col, index) in cols" :key="task.id + col + templateKey + index ">
            <template v-if="col.key == 'userId'">
              <user-info :key="componentKey" :userId="task[col.key]"></user-info>
            </template>
            <template v-if="col.key == 'status'">
              <status-comp :key="componentKey" :status="task[col.key]"></status-comp>
            </template>
            <template v-if="col.key == 'priority'">
              <priority-comp :key="componentKey" :priority="task[col.key]"></priority-comp>
            </template>
            <template v-if="col.key == 'startDate' || col.key == 'dueDate'">
              <span class="d-inline-flex align-center gap-05"><bib-icon icon="calendar" variant="gray4"></bib-icon><format-date :key="componentKey" :datetime="task[col.key]"></format-date></span> 
            </template>
            <template v-if="col.key == 'project'">
              <project-info v-if="task[col.key].length" :projectId="task[col.key][0].projectId"></project-info>
              <!-- <project-info :projectId="task[col.key][0].projectId" ></project-info> -->
            </template>
            <div v-if="col.key == 'title'" class="d-flex gap-05 align-center h-100">
              <bib-icon icon="check-circle" :scale="1.25" :variant="taskCheckIcon(task)" class="cursor-pointer" @click="updateTaskStatus(task)"></bib-icon>
              <span v-if="col.event" class=" flex-grow-1" style=" line-height:1.25;">
                {{task[col.key]}}
              </span>
              <span v-else class="flex-grow-1">
                {{task[col.key]}}
              </span>
            </div>
            <template v-if="col.key == 'department'">
              {{task[col.key]}}
            </template>
          </td>
        </tr>
      </draggable>
      <!-- <tr v-if="newTaskButton">
        <td colspan="2">
          <div class="d-inline-flex align-center gap-05 cursor-pointer font-md" :class="['text-'+newTaskButton.variant, 'text-hover-'+newTaskButton.hover]" v-on:click.stop="$emit(newTaskButton.event, section)">
            <bib-icon icon="add" variant="success" :scale="1.1" class=""></bib-icon> <span>{{newTaskButton.label}}</span>
          </div>
        </td>
      </tr> -->
    </table>
  </draggable>
</template>
<script>
/**
 * @module Orgamisms/DragTable
 * @author Vishwajeet
 * @rebuild Vishwajeet
 * @desc Table component with drag-drop
 * @vue-prop headless=false {Boolean} - table without header.
 * @vue-prop fields=[] {Array} - table header names.
 * @vue-prop sections=[] {Array} - table data.
 * @vue-prop collapseObj=null {Object} - collapsible table settings.
 * @vue-prop newTaskbutton={Object} - add new row button
 * @vue-emits ['row-click', 'row-rightclick', 'close-context-menu', 'task-checkmark-click', 'section-dragend', 'task-dragend' ]
 * @vue-dynamic-emits [ 'header_icon click', 'task_checkmark click' 'newtask button click' ] 
 * @vue-prop componentKey=Number - key to update child components
 */
import draggable from 'vuedraggable'
export default {
  name: "DragTable",
  components: {
    draggable
  },
  props: {
    /*headless: {
      type: Boolean,
      default () {
        return false;
      },
    },*/
    fields: {
      type: Array,
      default () {
        return [];
      },
      required: true,
    },
    sections: {
      type: Array,
      default () {
        return [];
      },
      required: true,
    },
    tasksKey: {
      type: String,
      default () {
        return "tasks"
      },
    },
    collapsible: { type: Boolean, default: true },
    /*collapseObj: {
      type: Object,
      default () {
        return {
          variant: "dark"
        };
      }
    },*/
    newTaskButton: {
      type: Object,
      default () {
        return {
          label: "New Task",
          event: "new-task",
          variant: "secondary",
          hover: "dark",
        }
      }
    },
    componentKey: Number,
    default: 0,
  },
  data() {
    return {
      cols: [],
      // item: {},
      templateKey: 11,
      // isCollapsed: this.collapseObj ? this.collapseObj.collapsed : false,
      localdata: [],
      taskMoveSection: null,
      highlight: false,
    };
  },
  computed: {
    activeClass() { return keyI => this.sections[keyI].active ? 'active' : '' },

  },
  created() {
    // console.info('created lifecycle', this.cols.length)
    this.cols = this.fields.map((field) => { return { key: field.key, event: field.event } })
    // this.cols.shift();
  },
  mounted() {
    // console.info('mounted lifecycle', this.sections.length);
    this.localdata = this.sections ? JSON.parse(JSON.stringify(this.sections)) : []
    this.templateKey += 1
  },
  methods: {
    collapseItem(event, refId) {
      // console.log(refId, event)
      let elem = this.$refs[refId][0].$el
      let tar = event.target

      if (elem.style.visibility == 'collapse') {
        elem.style.visibility = 'visible'
        tar.firstChild.style.transform = 'rotate(0deg)'
      } else {
        elem.style.visibility = 'collapse'
        tar.firstChild.style.transform = 'rotate(-90deg)'
      }
    },
    taskCheckIcon(task) {
      if (task.statusId == 5) {
        return 'success'
      } else {
        return 'gray5'
      }
    },
    updateTaskStatus(task) {
      console.log(task.statusId)
      this.$emit('task-checkmark-click', task)
    },
    rowClick($event, task) {
      this.unselectAll()
        .then(r => {
          $event.currentTarget.classList.add("active")
        })
      // console.log($event.currentTarget)
      this.$emit('row-click', task)
      // document.getElementById(key).classList.toggle('active')
    },
    rowRightClick($event, task) {
      this.$emit("close-context-menu")
      this.unselectAll()
        .then(r => {
          $event.currentTarget.classList.add("active")
        })
      setTimeout(() => {
        this.$emit("row-rightclick", { event: $event, task: task })
      }, 200)

    },
    async unselectAll() {
      let rows = document.querySelectorAll('.table__irow');
      for (let row of rows) {
        row.classList.remove('active');
      }

      return "success"
    },
    taskDragStart(e) {
      // console.warn(e.to.classList.add("highlight"));
      this.highlight = true
    },
    taskDragEnd(e) {
      // console.log(e)
      this.highlight = false
      let sectionData = this.localdata.filter(s => s.id == e.to.dataset.section)
      this.$emit('task-dragend', { tasks: sectionData[0].tasks, sectionId: e.to.dataset.section })
    },
    moveTask(e) {
      // console.log('dragged->' ,e.draggedContext)
      // console.info('related->', e.relatedContext.component.$el)
      // console.warn(e.to.dataset.section)
      this.taskMoveSection = +e.to.dataset.section
    },

  },
};

</script>
<style lang="scss" scoped>
.table {
  width: 100%;
  height: max-content;
  margin: 0;
  border-collapse: collapse;
  cellspacing: 0;
  cellpadding: 0;

  tr {
    height: 2.5rem;
  }

  th,
  td {
    padding-left: 8px;
    padding-right: 6px;
    background-color: white;
  }

  &__hrow {
    height: 2.5rem;
    background-color: $light;
    color: $gray5;
    font-size: $base-size;
    font-weight: normal;

    th {
      border: $light 1px solid;
      border-top: none;
      text-align: left;

      &.cell_action_header {
        width: 0rem;
      }
    }

    &__no {
      text-align: center !important;
    }

    &__active {
      border-color: $dark-sub1;

      span {
        color: $dark-sub1 !important;
      }
    }

    &.collapsed {
      visibility: collapse;
    }

  }

  &__srow {
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }

  .highlight {
    .table__irow {
      background-color: skyblue;
    }
  }

  &__irow {
    color: $gray6;
    font-weight: 400;
    line-height: 2.5rem;
    font-size: $base-size;
    outline: 1px solid transparent;
    transition: background-color .3s linear, outline-color .3s linear;


    td {
      border: 1px solid $light;

      &:not(:last-child) {
        border-right: none;
      }

      color: $text;

      &:first-child {
        text-align: center;
      }
    }

    &:hover {
      cursor: default;
      background-color: #f6f6f6;
      border-color: $gray4;

      .drag-handle {
        opacity: 1;
      }
    }

    &:active {
      cursor: default;
      /*background-color: #f6f6f6;*/
      outline: 1px solid $dark;
      box-shadow: 0 0 4px $primary-sub3;
    }

    &.active {
      /*background-color: #f6f6f6;*/
      outline: 1px solid $dark;
      box-shadow: 0 0 4px $primary-sub3;
    }
  }

  &__headless {
    border-top: 0;

    .table__hrow {
      visibility: collapse;
    }
  }

  td.section {
    border-bottom: 1px solid $gray4;
    .section-header {
      font-size: $base-size;
      font-weight: bold;
      /*color: $gray6;*/
    }
  }

  .drag-handle {
    cursor: grab;
    opacity: 0.125;
    transition: all 300ms ease-in;

    svg {
      fill: $gray5;
    }
  }
}


</style>
