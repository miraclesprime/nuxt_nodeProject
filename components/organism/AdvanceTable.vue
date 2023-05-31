<template>
  <div id="adv-table-wrapper" class="adv-table-wrapper position-relative" v-click-outside="unselectAll">

      <draggable class="task-draggable adv-table resizable bg-white" handle=".drag-handle" :style="{'width': tableWidth}" role="table" @start="rowDragStart" @end="rowDragEnd" :move="moveTask" >
        <div slot="header" class="tr" role="row" id="adv-table-row1">
          <div v-if="drag" class="width-2 th" id="adv-table-cell1" role="cell"></div>
          <div v-for="(field, index) in tableFields" :key="field+'-'+index" class="th" id="adv-table-th1" role="cell" :style="{ width: field.width}" @click="field.header_icon?.event ? $emit(field.header_icon.event, field.key) : null">
            <div class="align-center gap-05">{{field.label}} <span v-if="field.header_icon" class="height-1 cursor-pointer"  id="adv-table-header-icon">
                <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'gray1' : 'gray4'"></bib-icon>
              </span></div>
          </div>
        </div>

        <div class="tr position-relative height-2" id="adv-table-tr1" v-if="sectionTitle">
          <div class="position-absolute" id="adv-table-section-header-wrapper" style="inset: 0; border-bottom: 1px solid var(--bib-light);">
            <div class="section-header d-flex align-center gap-05 height-2 px-1" id="adv-table-section-header">
              <bib-icon icon="arrow-down" :scale="0.5" :style="{transform: iconRotate}"></bib-icon> 
              <span class="font-w-700 cursor-pointer" id="adv-table-section-title" @click.stop="isCollapsed = !isCollapsed">
                {{sectionTitle}}
              </span>
            </div>
          </div>
        </div>

        <template v-if="!isCollapsed">
          <div v-for="(item, index) in tableData" :key="item.id+'-'+index" class="tr" :id="'adv-table-table-data-'+index" role="row" @click.stop="rowClick($event, item)" @click.right.prevent="contextOpen($event, item)">
            <div class="td" role="cell" id="adv-table-td">
              <div v-if="drag" class="drag-handle width-105 h-100" id="adv-table-drag-handle"><!-- <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                <rect fill="none" height="24" width="24" />
                <path d="M20,9H4v2h16V9z M4,15h16v-2H4V15z" /></svg> --><bib-icon icon="drag" variant="gray5"></bib-icon>
              </div>
            </div>
            <div v-for="(field, index) in tableFields" :id="'adv-table-table-fields-'+index" :key="field+index" class="td" role="cell">
              <div v-if="field.key == 'title'" class="align-center " id="adv-table-title-field">
                <span v-if="field.icon" class="width-105 height-105 align-center justify-center" id="adv-table-field-icon" :class="{'cursor-pointer': field.icon.event}">
                  <bib-icon :icon="field.icon.icon" :scale="1.25" :variant="field.icon.variant" hover-variant="success-sub3"></bib-icon>
                </span>
                <span v-if="field.event" class=" flex-grow-1" style="line-height:1.25;" id="adv-table-field-event">
                  <input type="text" class="editable-input" id="adv-table-editable-input" :value="item[field.key]" @click.stop @input.stop="debounceTitle($event.target.value, item)" @keyup.esc="unselectAll">
                </span>
                <span v-else class="flex-grow-1" id="adv-table-item-field-key">
                  {{item[field.key]}}
                </span>
                <span v-if="field.event" class="width-105 height-105 align-center justify-center flex-shrink-0 cursor-pointer bg-hover-light" id="adv-table-field-event-arrow-right" @click.stop="$emit(`${field.event}`, item)">
                  <bib-icon icon="arrow-right" variant="gray4" hover-variant="gray5"></bib-icon>
                </span>
              </div>
              <template v-if="field.key == 'project'">{{item[field.key][0].project.title}}</template>
              <template v-if="field.key == 'userId'">
                <user-select :ref="'userSelect'+item.id" :userId="item[field.key]" @change="updateAssignee($event, item)" ></user-select>
              </template>
              <template v-if="field.key == 'status'">
                <status-select :ref="'stausSelect'+item.id" :key="'st-'+item.id" :status="item[field.key]" @change="updateStatus($event, item)"></status-select>
              </template>
              <template v-if="field.key == 'priority'">
                <priority-select :ref="'prioritySelect'+item.id" :value="item[field.key]" @change="updatePriority($event, item)"></priority-select>
              </template>
              <template v-if="field.key == 'department'">
                <dept-select :ref="'deptSelect'+item.id" :dept="item[field.key]" @change="updateDept($event, item)"></dept-select>
              </template>
              <template v-if="field.key.includes('Date')" class="date-cell">
                <!-- {{$formatDate(item[field.key])}} -->
                <!-- <bib-datepicker class="align-right" :value="new Date(item[field.key])" format="dd MMM YYYY" @click.native.stop="" @input="updateDate"></bib-datepicker> -->
                <bib-datetime-picker v-model="item[field.key]" format="MM/DD/YYYY" placeholder="No date" @input="updateDate($event, item, field.key)" @click.native.stop></bib-datetime-picker>

              </template>
            </div>
          </div>

          <div v-if="!newRow.show" class="tr" role="row" style="border-bottom: var(--bib-light)" id="adv-table-newRow-wrapper">
            <div class="td " id="adv-table-newRow-td1" role="cell" style="border-bottom-color: transparent; border-right-color: transparent;"></div>
            <div class="td" id="adv-table-newRow-td2" role="cell" style="border-bottom-color: transparent; border-right-color: transparent;">
              <div class="d-inline-flex align-center px-05 py-025 font-md cursor-pointer new-button shape-rounded" id="adv-table-newRow-newTaskBtn" v-on:click.stop="newRowClick()">
                <bib-icon :icon="newTaskButton.icon" variant="success" :scale="1.1" class=""></bib-icon> <span class="text-truncate">{{newTaskButton.label}}</span>
              </div>
            </div>
            <div v-for="n in tableFields.length-1" class="td" id="adv-table-newRow-td3" style="border-bottom-color: transparent; border-right-color: transparent;"></div>
          </div>

          <div v-show="newRow.show" class="tr" role="row" id="adv-table-newRow-2">
            <div v-if="drag" class="td text-center" id="adv-table-newRow2-td" role="cell">
              <span class="d-inline-flex align-center height-105 bg-secondary-sub4 shape-rounded" id="adv-table-newRow2-drag"><bib-icon icon="drag" variant="white"></bib-icon></span>
            </div>
            <template v-for="(td,index) in tableFields">
              <div v-if="td.key == 'title'" class="td" role="cell" :id="'adv-table-newRow2-td-'+index">
                <input type="text" ref="newrowInput" class="editable-input" :id="'adv-table-editable-input-2-'+index" v-model="newRow.title" :class="{'error': validTitle}" @input="newRowCreate" @blur="newRowCreate" required placeholder="Enter title...">
              </div>
              <div v-else class="td" role="cell" :id="'adv-table-else-td-'+index"></div>
            </template>
          </div>
        </template>

      </draggable>
    <!-- </div> -->
    <template v-if="contextItems">
      <table-context-menu :items="contextItems" :show="contextVisible" :coordinates="popupCoords" @item-click="contextItemClick" ></table-context-menu>
    </template>
    
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import dayjs from 'dayjs'
import fecha, { format } from "fecha";
import draggable from 'vuedraggable'

export default {

  name: 'AdvanceTable',
  components: {
    draggable
  },
  props: {
    tableFields: { type: Array, required: true, default: () => [] },
    tableData: { type: Array, required: true, default: () => [] },
    dataType: { type: String, default: 'nested' },  
    sectionTitle: { type: String, default: "Section" },
    contextItems: { type: Array },
    drag: { type: Boolean, default: true },
    newTaskButton: {
      type: Object,
      default () {
        return {
          label: "New Task",
          icon: "add",
        }
      }
    },
    newRow: {
      type: Object,
      default () {
        return {
          show: false,
          sectionId: "",
          title: "",
          userId: "",
          statusId: 1,
          priorityId: 3,
          startDate: "",
          dueDate: "",
          departmentId: "",
          description: "",
          budget: "",
          text: "",
        }
      }
    },
  },

  data() {
    return {
      isCollapsed: false,
      contextVisible: false,
      popupCoords: { left: 0, top: 0 },
      activeItem: {},
      resizableTables: [],
      format: "DD MMM YYYY",
      validTitle: false,
    }
  },

  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
    }),

    iconRotate(){
      if (this.isCollapsed) {
        return 'rotate(-90deg)'
      } else {
        return 'rotate(0deg)'
      }
    },
    tableWidth() {
      const main = document.getElementById("main-content")
      let w = main.scrollWidth - 18
      return w + "px"
    },
  },

  mounted() {
    this.resizableColumns()
  },

  methods: {
    parseDate(dateString, format) {
      return fecha.parse(dateString, this.format);
    },

    formatInputDate(dateObj, format) {
      if (dateObj) {
        return fecha.format(dateObj, this.format);
      } else {
        return ""
      }
    },
    
    // main class prototype
    columnResize(table) {
      this.id = table.id;

      // ============================================================
      // private data
      var self = this;

      var dragColumns = table.children[0].children
      // console.log(dragColumns)
      if (!dragColumns) return; // return if no table exists or no one row exists

      var dragColumnNo; // current dragging column
      var dragX; // last event X mouse coordinate

      var saveOnmouseup; // save document onmouseup event handler
      var saveOnmousemove; // save document onmousemove event handler
      var saveBodyCursor; // save body cursor property

      // ============================================================
      // methods

      // ============================================================
      this.preventEvent = function(e) {
        var ev = e || window.event;
        if (ev.preventDefault) ev.preventDefault();
        else ev.returnValue = false;
        if (ev.stopPropagation)
          ev.stopPropagation();
        return false;
      }
      this.getWidth = function(x) {
        if (x.currentStyle)
          // in IE
          var y = x.clientWidth - parseInt(x.currentStyle["paddingLeft"]) - parseInt(x.currentStyle["paddingRight"]);
        // for IE5: var y = x.offsetWidth;
        else if (window.getComputedStyle)
          // in Gecko
          var y = document.defaultView.getComputedStyle(x, null).getPropertyValue("width");
        return y || 0;
      }

      // do changes columns widths
      // returns true if success and false otherwise
      this.changeColumnWidth = function(no, w) {
        if (!dragColumns) return false;

        if (no < 0) return false;
        if (dragColumns.length < no) return false;

        if (parseInt(dragColumns[no].style.width) <= -w) return false;
        if (dragColumns[no + 1] && parseInt(dragColumns[no + 1].style.width) <= w) return false;

        dragColumns[no].style.width = parseInt(dragColumns[no].style.width) + w + 'px';
        if (dragColumns[no + 1])
          dragColumns[no + 1].style.width = parseInt(dragColumns[no + 1].style.width) - w + 'px';

        return true;
      }

      // ============================================================
      // do drag column width
      this.columnDrag = function(e) {
        var e = e || window.event;
        var X = e.clientX || e.pageX;
        if (!self.changeColumnWidth(dragColumnNo, X - dragX)) {
          // stop drag!
          self.stopColumnDrag(e);
        }

        dragX = X;
        // prevent other event handling
        self.preventEvent(e);
        return false;
      }

      // ============================================================
      // stops column dragging
      this.stopColumnDrag = function(e) {
        var e = e || window.event;
        if (!dragColumns) return;

        // restore handlers & cursor
        document.onmouseup = saveOnmouseup;
        document.onmousemove = saveOnmousemove;
        document.body.style.cursor = saveBodyCursor;

        // remember columns widths in cookies for server side
        var colWidth = '';
        var separator = '';
        for (var i = 1; i < dragColumns.length; i++) {
          colWidth += separator + parseInt(self.getWidth(dragColumns[i]));
          separator = '+';
        }
        /*var expire = new Date();
        expire.setDate(expire.getDate() + 365); // year
        document.cookie = self.id + '-width=' + colWidth +
          '; expires=' + expire.toGMTString();*/

        self.preventEvent(e);
      }

      // ============================================================
      // init data and start dragging
      this.startColumnDrag = function(e) {
        var e = e || window.event;

        // if not first button was clicked
        //if (e.button != 0) return;

        // remember dragging object
        var dragEl = (e.target || e.srcElement).offsetParent.parentElement
        dragColumnNo = Array.from(dragEl.parentElement.children).indexOf(dragEl);
        dragX = e.clientX || e.pageX;

        // set up current columns widths in their particular attributes
        // do it in two steps to avoid jumps on page!
        var colWidth = new Array();
        for (var i = 0; i < dragColumns.length; i++)
          colWidth[i] = parseInt(self.getWidth(dragColumns[i]));
        for (var i = 0; i < dragColumns.length; i++) {
          dragColumns[i].width = ""; // for sure
          dragColumns[i].style.width = colWidth[i] + "px";
        }

        saveOnmouseup = document.onmouseup;
        document.onmouseup = self.stopColumnDrag;

        saveBodyCursor = document.body.style.cursor;
        document.body.style.cursor = 'w-resize';

        // fire!
        saveOnmousemove = document.onmousemove;
        document.onmousemove = self.columnDrag;

        self.preventEvent(e);
      }

      // prepare table header to be draggable
      // it runs during class creation
      for (var i = 0; i < dragColumns.length; i++) {
        dragColumns[i].innerHTML = "<div style='position:relative;height:100%;width:100%;padding:8px 5px;'>" +
          "<div class='resize-drag-handle' style='"+
          "position:absolute;height:100%;width:4px;right:0;top:0px;cursor:w-resize;z-index:4; background-color: var(--bib-secondary-sub4)'>"+
          "</div>"+
          dragColumns[i].innerHTML +
          "</div>";
        // BUGBUG: calculate real border width instead of 5px!!!
        dragColumns[i].firstChild.firstChild.onmousedown = this.startColumnDrag;
      }
    },
    resizableColumns() {
      var tables = document.getElementsByClassName("adv-table");
      for (let i = 0; tables.item(i); i++) {
        if (tables[i].className.match(/resizable/)) {
          // generate id
          if (!tables[i].id) tables[i].id = 'advtable' + (i + 1);
          // make table resizable
          this.resizableTables[this.resizableTables.length] = this.columnResize(tables[i]);
        }
      }
    },
    rowDragStart(e) {
      console.log(e.type, e);
    },
    rowDragEnd(e) {
      console.log(e.type, e)
    },
    moveTask(e) {
      console.log("move event", e)
    },
    rowClick($event, item) {
      this.unselectAll()
        .then(r => {
          $event.currentTarget.classList.add("active")
        })
      this.$emit("row-click", item)
    },
    contextOpen($event, item) {
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.contextVisible = true
      this.activeItem = item
      $event.currentTarget.classList.add("active")
    },
    contextItemClick($event){
      this.$emit("context-item-event", $event, this.activeItem)
      this.unselectAll()
    },
    async unselectAll() {
      let rows = document.getElementsByClassName('tr');
      for (let row of rows) {
        row.classList.remove('active');
      }
      this.newRow.show = false
      this.contextVisible = false
      return 'success'
    },

    newRowClick() {
      this.unselectAll()
      this.newRow.show = true
      process.nextTick(() => {
        this.$refs.newrowInput[0].focus()
      });
    },

    newRowCreate: _.debounce(function() {
      if (!this.newRow.title) {
        console.warn("title is required")
        this.validTitle = "alert"
        return false
      }
      this.validTitle = ""
      console.info("valid input->", this.newRow.title)
      this.$emit("create-row", this.newRow)
    }, 800),

    debounceTitle: _.debounce(function(value, item) {
      this.$emit("update-field", { id: item.id, field: "title", value: value, label: "Title", historyText: `Changed Title to ${value}`, item: item })
    }, 800),
    updateStatus(status, item) {
      this.$emit("update-field", { id: item.id, field: "statusId", value: status.value, label: "Status", historyText: `changed Status to ${status.label}`, item: item })
    },
    updatePriority(priority, item) {
      this.$emit("update-field", { id: item.id, field: "priorityId", value: priority.value, label: "Priority", historyText: `changed priority to ${priority.label}`, item: item })
    },
    updateDept(dept, item){
      this.$emit("update-field", { id: item.id, field: "departmentId", value: dept.value, label: "Department", historyText: `changed department to ${dept.label}`, item: item })
    },
    updateAssignee(user, item) { 
      this.$emit("update-field", { id: item.id, field: "userId", value: user.id, label: "Assignee", historyText: `Changed Assignee To ${user.label}`, item: item })
    },
    updateDate(d, item, field) {
      let date = new Date(d);
      let dateFieldText = '';
      if(field == 'startDate') {
        dateFieldText = 'Start Date'
      } else {
        dateFieldText = 'Due Date'
      }
      this.$emit("update-field", { id: item.id, field: `${field}`, value: date, label: "Date", historyText: `Changed ${dateFieldText} to ${dayjs(d).format('DD MMM YYYY')}`, item: item})
    },
  }
}

</script>
<style lang="scss" scoped>

*::-webkit-scrollbar {
  width: thin;
  height: thin;
}

::-webkit-scrollbar {
  width: thin;
  height: thin;
}

.adv-table-wrapper {
  overflow: auto;
  height: 100%;
}

.adv-table {
  display: table;
  min-width: 100%;
  font-size: $base-size;

  .thead,
  .tbody,
  .tfoot {
    display: table-row-group;
  }

  .th,
  .td {
    display: table-cell;
    border-bottom: 1px solid $light;
    padding: 0.25rem;
    vertical-align: middle;
    min-width: fit-content;
    white-space: nowrap;

    &:not(:last-child) {
      border-right: 1px solid $light;
    }
  }

  .tr {
    display: table-row;

    .th:nth-child(2),
    .td:nth-child(2) {
      position: sticky;
      min-width: 2rem;
      left: 0;
      z-index: 2;
      background: #fff;
    }

    .th {
      position: sticky;
      top: 0;
      z-index: 2;
      background: $gray9;
      font-weight: bold;
      color: $secondary;
      padding: 0;
      border-bottom-color: $gray2;

      &:nth-child(2) {
        z-index: 3;
        background: $gray9;
      }
      &:hover {
        .resize-drag-handle { background-color: $primary; }
      }
    }
    &:hover {
      .drag-handle {
        opacity: 1;
      }
    }
    &.active {
      background-color: $secondary-sub3;
      .td { background-color: $secondary-sub3; }
    }
  }

  .resize-drag-handle {
    background-color: $secondary;
  }
  .drag-handle {
    cursor: grab;
    opacity: 0.35;
    transition: all 300ms ease-in;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    svg {
      fill: $secondary;
    }
  }

  .sortable-chosen {
    .td { background-color: $success-sub6; }
    .td:nth-child(2) { background-color: $success-sub6; }
  }

  .new-button {
    background-color: $success-sub6;
    color: $success;
    span { max-width: 0; overflow: hidden; transition: all 200ms ease-in; }

    &:hover {
      background-color: $success-sub3;
      span { max-width: 8rem; padding-left: 0.5rem; }
    }
  }

}


.editable-input {
  font-size: $base-size;
  font-weight: normal;
  background-color: transparent;
  &:hover { background-color: $white; }
}

::v-deep {
  .bib-select {
    line-height: normal;

    .select__real {
      margin: 0 !important;
    }

    .select__btn {
      background-color: transparent !important;
      line-height: normal;
    }
  }
  .vdpComponent__calendar-icon { z-index: 0 }
  .vdpComponent__input {
    margin: 0;
    min-height: 2rem;
    border-color: transparent;

    &:hover {
      border-color: transparent;
    }
  }
}

</style>
