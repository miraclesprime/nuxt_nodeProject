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
      <tr v-for="(task, taskindex) in tasks" :key="task.title +'-'+ componentKey + taskindex" class="table__irow" @click.stop="rowClick($event, task)" @click.right.prevent="rowRightClick($event, task)">
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
          <template v-if="col.key == 'startDate' || col.key == 'dueDate'">
            <span class="d-inline-flex align-center gap-05"><bib-icon icon="calendar" variant="gray4"></bib-icon><format-date :key="task.title+col.key+componentKey" :datetime="task[col.key]"></format-date></span>
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
      <tr v-for="(task, taskindex) in tasks" :key="task.title + componentKey + taskindex" class="table__irow" @click.stop="rowClick($event, task)" @click.right.prevent="rowRightClick($event, task)">
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
          <template v-if="col.key == 'startDate' || col.key == 'dueDate'">
            <span class="d-inline-flex align-center gap-05"><bib-icon icon="calendar" variant="gray4"></bib-icon><format-date :key="task.title+col.key+componentKey" :datetime="task[col.key]"></format-date></span>
          </template>
          <template v-if="col.key == 'project'">
            <project-info v-if="task[col.key].length" :key="task.title+col.key+componentKey" :projectId="task[col.key][0].projectId || task[col.key][0].project.id"></project-info>
          </template>
          <div v-if="col.key == 'title'" class="d-flex gap-05 align-center h-100">
            <span v-if="titleIcon.icon" class="width-105 height-105 " :class="{'cursor-pointer': titleIcon.event}" @click.stop="updateTaskStatus(task)">
              <!-- <bib-icon :icon="check-circle" :scale="1.25" :variant="taskCheckIcon(task)" ></bib-icon> -->
              <bib-icon :icon="titleIcon.icon" :scale="1.5" :variant="taskCheckIcon(task)" ></bib-icon>
            </span>
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
    <tr v-if="newRow" class="table__newrow">
      <!-- <td><span class="d-inline-flex align-center height-105 bg-primary shape-rounded">
          <bib-icon icon="drag" variant="light"></bib-icon>
        </span></td> -->
      <td v-for="col in cols">
        <template v-if="col.key == 'title'">
          <bib-input size="sm" autofocus v-model="newRow.title" :variant="validTitle" @input="newRowCreate" required placeholder="Enter title..."></bib-input>
        </template>
        <template v-if="col.key == 'userId'">
          <bib-select size="sm" :options="filterUser" v-model="newRow.userId" @change="newRowCreate" placeholder="Enter title..."></bib-select>
        </template>
        <template v-if="col.key == 'status'">
          <bib-input type="select" size="sm" :options="status" v-model="newRow.statusId" @change.native="newRowCreate" placeholder="Status"></bib-input>
        </template>
        <template v-if="col.key == 'priority'">
          <bib-input type="select" size="sm" :options="priority" v-model="newRow.priorityId" @change.native="newRowCreate" placeholder="Priority"></bib-input>
        </template>
        <template v-if="col.key == 'startDate'">
          <span class="d-inline-flex align-center gap-05">
            <bib-icon icon="calendar" variant="gray4"></bib-icon>
            <bib-input size="sm" v-model="newRow.startDate" type="date" @input="newRowCreate" ></bib-input>
          </span>
        </template>
        <template v-if="col.key == 'dueDate'">
          <span class="d-inline-flex align-center gap-05">
            <bib-icon icon="calendar" variant="gray4"></bib-icon>
            <bib-input size="sm" v-model="newRow.dueDate" type="date" @input="newRowCreate"></bib-input>
          </span>
        </template>
      </td>
    </tr>
    <!-- <tr v-if="newTaskButton">
      <td colspan="2">
        <div class="d-inline-flex align-center gap-05 cursor-pointer font-md" :class="['text-'+newTaskButton.variant, 'text-hover-'+newTaskButton.hover]" v-on:click.stop="newTaskEvent">
          <bib-icon icon="add" variant="success" :scale="1.1" class=""></bib-icon> <span>{{newTaskButton.label}}</span>
        </div>
      </td>
    </tr> -->
    <tr v-if="newTaskButton">
      
      <td :colspan="cols.length">
        <div class="d-inline-flex align-center px-05 py-025 cursor-pointer new-button shape-rounded" v-on:click.stop="newRowClick()">
          <bib-icon :icon="newTaskButton.icon" variant="success" :scale="1.1" class=""></bib-icon> <span class="text-truncate">{{newTaskButton.label}}</span>
        </div>
      </td>
    </tr>
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
    titleIcon: {
      type: Object,
      default(){
        return {
          icon: '',
          event: '',
        }
      }
    },
    sectionTitle: {
      type: String,
      default: "Section 1",
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
          icon: "add",
          variant: "secondary",
        }
      }
    },
    newRow: {
      type: Object,
      default () {
        return {
          sectionId: "",
          title: "",
          userId: "",
          statusId: 1,
          priorityId: 3,
          startDate: "",
          dueDate: "",
          department: "",
          description: "",
          budget: "",
          text: "",
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
    rowClick($event, task) {
      // console.log($event.target)
      this.$emit("row-click", task)
    },
    rowRightClick($event, task) {
      this.$emit("close-context-menu")
      setTimeout(() => {
        this.$emit("row-context", { event: $event, task: task })
      }, 200)
    },
    taskCheckIcon(task) {
      if (task.statusId == 5) {
        return 'success'
      } else {
        return 'gray5'
      }
    },
    updateTaskStatus(task) {
      // this.$emit('task-checkmark-click', task)
      this.$emit(this.titleIcon.event, task)
    },
    unselectAll() {
      let rows = document.getElementsByClassName('table__irow');
      for (let row of rows) {
        row.classList.remove('active');
      }
      // console.log('clicked outside drag-table-simple component')
      this.$emit("hide-newrow")
      this.$emit("close-context-menu")
      return 'success'
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
      this.taskMoveSection = +e.to.dataset.section
    },

    /*newTaskEvent() {
      this.$emit(this.newTaskButton.event, false)
    },*/
    newRowClick() {
      // console.log(sectionId)
      // this.newRow.sectionId = sectionId
      // this.$nuxt.$emit('close-sidebar')
      this.unselectAll
      // this.$refs['newRow'+sectionId].style.visibility = 'visible'
    },
    newRowCreate: _.debounce(function() {
      // console.table([this.newRow.sectionId, this.newRow.title]);
      if (!this.newRow.title) {
        console.warn("new row title is required")
        this.validTitle = "alert"
        return false
      }
      this.validTitle = ""
      this.$emit("create-newrow", this.newRow)
    }, 1500),
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
  .new-button {
    background-color: $success-sub6;
    color: $success;
    /*padding: 2px 2px;*/
    span { max-width: 0; overflow: hidden; transition: all 200ms ease-in; }

    &:hover {
      background-color: $success-sub3;
      span { max-width: 8rem; padding-left: 0.5rem; }
    }
  }
}

.section-header {
  font-size: $base-size;
  font-weight: bold;
}

</style>
