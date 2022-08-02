<template>
  <table v-click-outside="unselectAll" class="table">
    <thead>
      <tr class="table__hrow">
        <th v-if="drag" width="3%">&nbsp;</th>
        <th v-for="(field, index) in fields" :key="field.key + index" :style="`width: ${field.width};`" :class="{'table__hrow__active': field.header_icon && field.header_icon.isActive}">
          <div class="align-center">
            <span> {{ field.label }} </span>
            <template v-if="field.header_icon">
              <div class="ml-05 shape-rounded bg-hover-black width-105 height-105 d-flex justify-center align-center cursor-pointer" :class="{'bg-black': field.header_icon.isActive }" @click="$emit(field.header_icon.event, field.key)">
                <bib-icon :icon="field.header_icon.icon" :scale="1.1" variant="gray5" hoverVariant="white"></bib-icon>
              </div>
            </template>
          </div>
        </th>
      </tr>
    </thead>
    <tr :style="{ width: '0rem' }" v-if="collapsible">
      <td :colspan="cols.length+1">
        <div class="section-header d-flex align-center gap-05 " :class="'text-'+collapseObj.variant">
          <div v-if="drag" class="drag-handle width-2 text-center"></div> <span class="d-flex gap-05 align-center cursor-pointer" @click="isCollapsed = !isCollapsed">
            <bib-icon icon="arrow-down" :scale="0.5" :variant="collapseObj.variant" :style="{transform: iconRotate}"></bib-icon> {{sectionTitle}}
          </span>
        </div>
      </td>
    </tr>
    <draggable v-if="drag" :list="tasks" tag="tbody" class="task-draggable " handle=".drag-handle" @start="taskDragStart" :move="moveTask" @end="taskDragEnd" :style="{ visibility: isCollapsed ? 'collapse': '' }">
      <tr v-for="(task, taskindex) in tasks" :key="task.title +'-'+ componentKey + taskindex" class="table__irow" @click.stop="rowClick(task)" @click.right.prevent="rowRightClick($event, task)">
        <td>
          <div class="drag-handle width-2 "><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
              <rect fill="none" height="24" width="24" />
              <path d="M20,9H4v2h16V9z M4,15h16v-2H4V15z" /></svg></div>
        </td>
        <td v-for="(col, index) in cols" :key="task.title + col + index + componentKey">
          <template v-if="col.key == 'userId'">
            <user-info :key="task.title+col.key+componentKey" :userId="task[col.key]"></user-info>
          </template>
          <template v-if="col.key == 'status'">
            <status-comp :key="task.title+col.key+componentKey" :status="task[col.key]"></status-comp>
          </template>
          <template v-if="col.key == 'priority'">
            <priority-comp :key="task.title+col.key+componentKey" :priority="task[col.key]"></priority-comp>
          </template>
          <template v-if="col.key == 'createdAt' || col.key == 'dueDate'">
            <format-date :key="task.title+col.key+componentKey" :datetime="task[col.key]"></format-date>
          </template>
          <template v-if="col.key == 'project'">
            <project-info v-if="task[col.key].length" :key="task.title+col.key+componentKey" :projectId="task[col.key][0].projectId"></project-info>
          </template>
          <div v-if="col.key == 'title'" class="h-100">
            <span v-if="col.event" class=" d-block" >
              {{task[col.key]}}
            </span>
            <span v-else>
              {{task[col.key]}}
            </span>
          </div>
          <template v-if="col.key == 'department'">
            {{task[col.key]}}
          </template>
        </td>
      </tr>
    </draggable>
    <tbody v-else :style="{ visibility: isCollapsed ? 'collapse': '' }">
      <tr v-for="(task, taskindex) in tasks" :key="task.title + componentKey + taskindex" class="table__irow" @click.stop="rowClick(task)" @click.right.prevent="rowRightClick($event, task)">
        <td v-for="(col, index) in cols" :key="task.title + col + index + componentKey">
          <template v-if="col.key == 'userId'">
            <user-info :key="task.title+col.key+componentKey" :userId="task[col.key]"></user-info>
          </template>
          <template v-if="col.key == 'status'">
            <status-comp :key="task.title+col.key+componentKey" :status="task[col.key]"></status-comp>
          </template>
          <template v-if="col.key == 'priority'">
            <priority-comp :key="task.title+col.key+componentKey" :priority="task[col.key]"></priority-comp>
          </template>
          <template v-if="col.key == 'createdAt' || col.key == 'dueDate'">
            <format-date :key="task.title+col.key+componentKey" :datetime="task[col.key]"></format-date>
          </template>
          <template v-if="col.key == 'project'">
            <project-info v-if="task[col.key].length" :key="task.title+col.key+componentKey" :projectId="task[col.key][0].projectId"></project-info>
          </template>
          <div v-if="col.key == 'title'" class="d-flex gap-05 align-center h-100">
            <bib-icon icon="check-circle" :scale="1.25" :variant="taskCheckIcon(task)" class="cursor-pointer" @click.self="updateTaskStatus(task)"></bib-icon>
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
    </tbody>
    <!-- <tr v-if="newTaskButton">
      <td colspan="2">
        <div class="d-inline-flex align-center gap-05 cursor-pointer font-md" :class="['text-'+newTaskButton.variant, 'text-hover-'+newTaskButton.hover]" v-on:click.stop="newTaskEvent">
          <bib-icon icon="add" variant="success" :scale="1.1" class=""></bib-icon> <span>{{newTaskButton.label}}</span>
        </div>
      </td>
    </tr> -->
  </table>
</template>
<script>
/**
 * @module Orgamisms/DragTable
 * @author Vishwajeet
 * @rebuild Vishwajeet
 * @desc Table component with drag-drop
 * @vue-prop fields=[] {Array} - table header names.
 * @vue-prop sectionTitle=String - table section title
 * @vue-prop tasks=[] {Array} - table data.
 * @vue-prop collapseObj=null {Object} - collapsible table settings.
 * @vue-prop newTaskbutton={Object} - add new row button
 * @vue-emits ['task-checkmark-click', 'task-dragend' ]
 * @vue-dynamic-emits [ 'header_icon click', 'title click', 'task_checkmark click' 'newtask button click' ] 
 * @vue-prop componentKey=Number - key to update child components
 */
import draggable from 'vuedraggable'
export default {
  name: "DragTableSimple",
  components: {
    draggable
  },
  props: {
    sectionTitle: {
      type: String,
      default: "Section 1",
    },
    fields: {
      type: Array,
      default () {
        return [];
      },
    },
    tasks: {
      type: Array,
      default () {
        return []
      },
    },
    collapsible: {
      type: Boolean,
      default: true
    },
    collapseObj: {
      type: Object,
      default () {
        return {
          variant: "dark"
        };
      }
    },
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
    drag: {
      type: Boolean,
      default: true,
    },
    componentKey: { type: Number, default: 0 },

  },
  data() {
    return {
      cols: [],
      // item: {},
      isCollapsed: this.collapseObj ? this.collapseObj.collapsed : false,
      localdata: [],
      taskMoveSection: null,
      highlight: false,
      // actionMenu: false,
    };
  },
  computed: {
    activeClass() { return keyI => this.sections[keyI].active ? 'active' : '' },
    iconRotate() { return this.isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' },

  },
  created() {
    // console.info('created lifecycle', this.cols.length)
    this.cols = this.fields.map((field) => { return { key: field.key, event: field.event } })
    // this.cols.shift();
  },
  mounted() {
    // console.info('mounted lifecycle', this.tasks.length);
    this.localdata = this.tasks ? JSON.parse(JSON.stringify(this.tasks)) : []
  },
  methods: {
    rowClick(task) {
      this.$emit("row-click", task)
    },
    rowRightClick($event, task) {
      this.$emit("close-context-menu")
      setTimeout(() => {
        this.$emit("row-context", { event: $event, task: task })
      }, 200)
      // this.actionMenu = true
      // const targetEl = $event.target
      // this.$refs.c_menu.style.left = $event.pageX + 'px'
      // this.$refs.c_menu.style.top = $event.pageY + 'px'

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
    /*isFavorite(task) {
      let fav = this.favTasks.some(t => t.task.id == task.id)
      if (fav) {
        return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { icon: "bookmark", variant: "gray5", text: "Add to favorites", status: false }
      }
    },*/
    unselectAll() {
      let rows = document.getElementsByClassName('table__irow');
      for (let row of rows) {
        row.classList.remove('active');
      }
      // console.log('clicked outside drag-table-simple component')
      this.$emit("close-context-menu")
    },
    taskDragStart(e) {
      // console.warn(e.to.classList.add("highlight"));
      this.highlight = true
    },
    taskDragEnd(e) {
      // console.log(e)
      this.highlight = false
      let sectionData = this.localdata.filter(s => s.id == e.to.dataset.section)
      this.$emit('task-dragend', sectionData[0].tasks)
    },
    moveTask(e) {
      // console.log('dragged->' ,e.draggedContext)
      // console.info('related->', e.relatedContext.component.$el)
      // console.warn(e.to.dataset.section)
      this.taskMoveSection = +e.to.dataset.section

    },

    newTaskEvent() {
      this.$emit(this.newTaskButton.event, false)
    }
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
  }

  &__hrow {
    height: 2.5rem;
    background-color: $light;
    color: $gray5;
    font-size: $base-size;
    font-weight: normal;

    th {
      border: $gray4 1px solid;
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
      border-bottom-color: $dark-sub1 !important;

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
      background-color: #f6f6f6;
      outline: 1px solid $gray4;
    }

    &.active {
      background-color: #f6f6f6;
      outline: 1px solid $gray4;
    }
  }

  &__headless {
    border-top: 0;

    .table__hrow {
      visibility: collapse;
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

.section-header {
  font-size: $base-size;
  font-weight: bold;
}

</style>
