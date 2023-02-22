<template>
  <div>
    <draggable v-if="localdata.length == 0" :list="localdata" tag="div" handle=".drag-handle" class="" @end="$emit('section-dragend', localdata)">
      <table class="table">
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
      </table>
    </draggable>

    <draggable v-if="localdata.length > 0" :list="localdata" tag="div" handle=".drag-handle" class="" @end="$emit('section-dragend', localdata)">
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
              <div class="d-flex gap-01 align-center w-25" >
                <span class="width-105 height-105 align-center justify-center cursor-pointer" @click.self="collapseItem($event, 'tbody'+section.id)">
                  <bib-icon icon="arrow-down" :scale="0.5" variant="gray6" class="events-none"></bib-icon>
                </span>
                <!-- {{section.title.includes('_section') ? 'Untitled section' : section.title}} -->
                <input type="text" class="editable-input" :value="section.title.includes('_section') ? 'Untitled section' : section.title" @input="debounceRenameSection(section.id, $event)">
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
                <span v-if="task[col.key]" class="user-info cursor-pointer" @click.stop="triggerUserPicker(task)">
                  <user-info :key="componentKey+task['id']" :userId="task[col.key]" :user="task['user']"></user-info>
                </span>
                <span v-else class="user-name-blank user-info cursor-pointer shape-circle align-center justify-center" @click.stop="triggerUserPicker(task)">
                  <bib-icon icon="user" variant="gray4" class="events-none"></bib-icon>
                </span>
              </template>
              <template v-if="col.key == 'status'">
                <status-comp :key="componentKey" :status="task[col.key]"></status-comp>
              </template>
              <template v-if="col.key == 'priority'">
                <priority-comp :key="componentKey" :priority="task[col.key]"></priority-comp>
              </template>
              <template v-if="col.key == 'startDate' || col.key == 'dueDate'">
                <span v-if="task[col.key]" class="d-inline-flex align-center gap-05">
                  <bib-icon icon="calendar" variant="gray4"></bib-icon>
                  <format-date :key="componentKey" :datetime="task[col.key]"></format-date>
                </span>
              </template>
              <template v-if="col.key == 'project'">
                <project-info v-if="task[col.key].length" :projectId="task[col.key][0].projectId || task[col.key][0].project.id"></project-info>
                <!-- <project-info :projectId="task[col.key][0].projectId" ></project-info> -->
              </template>
              <div v-if="col.key == 'title'" class="d-flex gap-025 align-center h-100">
                <span v-if="titleIcon.icon" class="width-105 height-105" :class="{'cursor-pointer': titleIcon.event}" @click.stop="updateTaskStatus(task)">
                  <bib-icon :icon="titleIcon.icon" :scale="1.5" :variant="taskCheckIcon(task)"></bib-icon>
                </span>
                <span v-if="col.event" class=" flex-grow-1" style=" line-height:1.25;">
                  <input type="text" class="editable-input" :value="task[col.key]" @input.stop="debounceUpdate(task, 'title', $event)">
                </span>
                <span v-else class="flex-grow-1">
                  {{task[col.key]}}
                </span>
                <span class="width-1 font-xs text-gray2">{{task['id']}}</span>
              </div>
              <template v-if="col.key == 'department'">
                {{task[col.key]}}
              </template>
            </td>
          </tr>
        </draggable>
        <tr v-if="newRow.sectionId == section.id" class="table__newrow">
          <td><span class="d-inline-flex align-center height-105 bg-primary shape-rounded">
              <bib-icon icon="drag" variant="light"></bib-icon>
            </span></td>
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
        <tr v-if="newTaskButton.show">
          <td></td>
          <td :colspan="cols.length">
            <div class="d-inline-flex align-center px-05 py-025 font-md cursor-pointer new-button shape-rounded" v-on:click.stop="newRowClick(section.id)">
              <bib-icon :icon="newTaskButton.icon" variant="success" :scale="1.1" class=""></bib-icon> <span class="text-truncate">{{newTaskButton.label}}</span>
            </div>
          </td>
        </tr>
      </table>
    </draggable>
    <!-- user picker popup -->
    <tippy :visible="userPickerOpen" id="user-picker" key="user-picker" appendTo="parent" theme="light-border" :animate-fill="false" arrow="false" distance="1" trigger="manual" interactive="true" >
        <bib-input type="text" v-model="filterKey" size="sm"></bib-input>
        <div style="max-height: 12rem; overflow-y: auto">
          <ul class="m-0 p-0 text-left">
            <li v-for="user in filterTeam" :key="user.id" class="p-025 cursor-pointer" @click="updateTask('userId', user.id, user.label)">
              <bib-avatar :src="user.avatar" size="1.5rem"></bib-avatar> {{user.label}}
            </li>
          </ul>
        </div>
      </tippy>
  </div>
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
 * @vue-emits ['row-click', 'row-rightclick', 'close-context-menu', 'section-dragend', 'task-dragend', 'edit-field', 'edit-section' ]
 * @vue-dynamic-emits [ 'header_icon click', 'task_checkmark click' 'newtask button click' ] 
 * @vue-prop componentKey=Number - key to update child components
 */
import { DEPARTMENT, STATUS, PRIORITY, TASK_FIELDS } from '~/config/constants.js'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import _ from 'lodash'
import tippy from 'tippy.js';
import VueTippy, { TippyComponent } from 'vue-tippy';
export default {
  name: "DragTable",
  components: {
    draggable,
    tippy: TippyComponent,
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
    titleIcon: {
      type: Object,
      default () {
        return {
          icon: '',
          event: '',
        }
      }
    },
    tasksKey: {
      type: String,
      default () {
        return "tasks"
      },
    },
    collapsible: {
      type: Boolean,
      default: true,
    },
    newTaskButton: {
      type: Object,
      default () {
        return {
          show: false,
          label: "New Task",
          icon: "add",
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
      department: DEPARTMENT,
      status: STATUS,
      priority: PRIORITY,
      tableFields: TASK_FIELDS,
      userPickerOpen: false,
      filterKey: "",
      validTitle: "",
      activeTask: {},
    };
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
    }),
    activeClass() { return keyI => this.sections[keyI].active ? 'active' : '' },
    filterUser() {
      return this.teamMembers.map((u) => {
        return {
          value: u.id,
          id: u.id,
          label: u.firstName + ' ' + u.lastName,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          img: u.avatar
        }
      })
    },
    filterTeam() {
      let regex = new RegExp(this.filterKey, 'g\i')
      return this.teamMembers.filter((u) => {
        if (regex.test(u.label) || regex.test(u.email)) {
          return u
        }
      })
    },
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
    defer(func) {
      setTimeout(func, 100);
    },
    
    triggerUserPicker(task) {
      // console.log(task.id, task.title)
      this.activeTask = task
      this.userPickerOpen = !this.userPickerOpen
    },
    debounceUpdate: _.debounce(function(task, field, event){
      // console.log(task.id, field, event.target.value)
      this.$emit('edit-field', {task: task, field, value: event.target.value})
    }, 1200),
    
    debounceRenameSection: _.debounce(function(id, event) {
      // console.log(id, event.target.value)
      this.$emit("edit-section", {id, title: event.target.value})
    },1200),

    collapseItem(event, refId) {
      let elem = this.$refs[refId][0].$el
      let tar = event.target

      // console.log(event.target, elem)
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
      // this.$emit('task-checkmark-click', task)
      this.$emit(this.titleIcon.event, task)
    },
    updateTask(field, value, label) {
      // console.log(arguments)
      this.$emit('edit-field', {task: this.activeTask, field, value, label})
    },
    rowClick($event, task) {
      this.unselectAll()
        .then(r => {
          $event.currentTarget.classList.add("active")
        })
      // console.log($event.currentTarget)
      this.$emit('row-click', task)
      
    },
    rowRightClick($event, task) {
      // this.$emit("close-context-menu")
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
      this.$emit("hide-newrow")
      // this.$emit("close-context-menu")
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
      this.taskMoveSection = +e.to.dataset.section
    },
    newRowClick(sectionId) {
      // console.log(sectionId)
      // this.newRow.show = true
      this.newRow.sectionId = sectionId
      this.unselectAll
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
      .editable-input { font-weight: normal; font-size: $base-size; }
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

  &__newrow {
    td {
      background-color: $light;
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
    }
    .editable-input { font-size: $base-size; color: $gray6; }
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

.user-name-blank,
.date-info-blank {
  width: 1.5rem;
  height: 1.5rem;
  border: 1px dashed $gray4;
}

::v-deep {
  .table__newrow {

    .input input,
    .input select,
    .bib-select .select__real {
      margin-top: 0.1rem;
      margin-bottom: 0.1rem;
    }

    .bib-select .select__btn {
      padding-left: 0;
      padding-right: 0;
    }
  }
}

</style>
