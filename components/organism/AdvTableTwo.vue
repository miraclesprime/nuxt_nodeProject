<template>
  <div id="adv-table-wrapper" class="adv-table-wrapper position-relative" v-click-outside="unselectAll">
    <!-- <div class="adv-table resizable bg-white" :style="{'width': tableWidth}" role="table"> -->
      <!-- <div class="zero" :style="{ width: tableFields[0].width}">
        <div class="align-center gap-05">{{tableFields[0].label}} <span v-if="tableFields[0].header_icon" class="height-1" @click="$emit(tableFields[0].header_icon.event)"><bib-icon :icon="tableFields[0].header_icon.icon" :variant="tableFields[0].header_icon.isActive ? 'gray1' : 'gray4'"></bib-icon></span></div>
      </div> -->
      <!-- <ul class="border-success">
        <li v-for="section in tableData" >
          <p>{{section.title}}</p>
          <template v-if="section.tasks.length > 0">
            <ul class="my-05 mx-1 border-gray5">
              <li v-for="task in section.tasks">
                <p>{{task.title}}</p>
              </li>
            </ul>
          </template>
        </li>
      </ul> -->

      <div class=" adv-table resizable bg-white" :style="{'width': tableWidth}" role="table"  >
        <div class="tr" role="row">
          <div v-if="drag" class="width-2 th" role="cell"></div>
          <div v-for="(field, index) in tableFields" :key="field+index" class="th" :class="{ 'flex-grow-1': !field.width }" role="cell" :style="{ width: field.width}" :ref="'th-'+field.key">
            <div class="align-center gap-05">{{field.label}} <span v-if="field.header_icon" class="height-1 cursor-pointer" @click="$emit(field.header_icon.event, field)">
                <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'gray1' : 'gray4'"></bib-icon>
              </span></div>
          </div>
        </div>

        <draggable v-model="tableData" class="section-draggable" handle=".section-drag-handle">
          <template v-for="section in tableData">

            <!-- <template v-if="!isCollapsed"> -->
            <draggable class="task-draggable" handle=".drag-handle" :group="{ name: 'tasks' }">
              <div slot="header" class="tr position-relative height-205">
                <div class="position-absolute" style="inset: 0; border-bottom: 1px solid var(--bib-light);">
                  <div class="section-header d-flex align-center gap-05 height-205 " >
                    <div class="section-drag-handle width-2 h-100" ><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                      <rect fill="none" height="24" width="24" />
                      <path d="M20,9H4v2h16V9z M4,15h16v-2H4V15z" /></svg>
                    </div>
                    <bib-icon icon="arrow-down" :scale="0.5" :style="{transform: iconRotate}"></bib-icon> 
                    <span class="font-w-700 cursor-pointer" @click.stop="isCollapsed = !isCollapsed">
                      {{section.title}}
                    </span>
                  </div>
                </div>
              </div>
              <div v-for="item in section.tasks" :key="item.id" class="tr" role="row" @click.stop="rowClick($event, item)" @click.right.prevent="contextOpen($event, item)">
                <div class="td" role="cell">
                  <div v-if="drag" class="drag-handle width-105 h-100" ><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                    <rect fill="none" height="24" width="24" />
                    <path d="M20,9H4v2h16V9z M4,15h16v-2H4V15z" /></svg>
                  </div>
                </div>
                <div v-for="(field, index) in tableFields" :key="field+index" class="td" role="cell" :class="{'flex-grow-1': !field.width, 'date-cell': field.key.includes('Date')}" :style="`flex: ${field.width} 0 0;`" >
                  <div v-if="field.key == 'title'" class="align-center ">
                    <span v-if="field.icon" class="width-105 height-105 align-center justify-center" :class="{'cursor-pointer': field.icon.event}">
                      <bib-icon :icon="field.icon.icon" :scale="1.25" :variant="field.icon.variant" hover-variant="success"></bib-icon>
                    </span>
                    <span v-if="field.event" class=" flex-grow-1" style="line-height:1.25;">
                      <input type="text" class="editable-input" :value="item[field.key]" @click.stop @input.stop="debounceTitle($event.target.value, item)" @keyup.esc="unselectAll">
                    </span>
                    <span v-else class="flex-grow-1">
                      {{item[field.key]}}
                    </span>
                    <span v-if="field.event" class="width-105 height-105 align-center justify-center flex-shrink-0 cursor-pointer bg-hover-light" @click.stop="$emit(`${field.event}`, item)">
                      <bib-icon icon="arrow-right" variant="gray4" hover-variant="gray5"></bib-icon>
                    </span>
                  </div>
                  <!-- <template v-if="field.key == 'project'">{{item[field.key][0].project.title}}</template> -->
                  <template v-if="field.key == 'userId'">
                    <user-select :ref="'userSelect'+item.id" :userId="item[field.key]" @change="updateAssignee($event, item)" @close-other="closePopups('userSelect'+item.id)" ></user-select>
                  </template>
                  <template v-if="field.key == 'status'">
                    <status-select :ref="'stausSelect'+item.id" :key="'st-'+item.id" :status="item[field.key]" @change="updateStatus($event, item)" @close-other="closePopups('stausSelect'+item.id)"></status-select>
                  </template>
                  <template v-if="field.key == 'priority'">
                    <priority-select :ref="'prioritySelect'+item.id" :value="item[field.key]" @change="updatePriority($event, item)" @close-other="closePopups('prioritySelect'+item.id)"></priority-select>
                  </template>
                  <template v-if="field.key == 'department'">
                    <dept-select :ref="'deptSelect'+item.id" :dept="item[field.key]" @change="updateDept($event, item)" @close-other="closePopups('deptSelect'+item.id)"></dept-select>
                  </template>
                  <template v-if="field.key.includes('Date')" >
                    <!-- {{$formatDate(item[field.key])}} -->
                    <!-- <bib-datepicker class="align-right" size="sm" :value="new Date(item[field.key])" format="dd MMM YYYY" @click.native.stop="" @input="updateDate"></bib-datepicker> -->
                    <bib-datetime-picker v-model="item[field.key]" format="DD MM YYYY" displayFormat="DD MM YYYY" placeholder="No date" :style="{ width: datecell('th-'+field.key)}" @click.native.stop="" @input="updateDate"></bib-datetime-picker>
                  </template>
                </div>
              </div>
              <div v-if="!newRow.show" class="tr" role="row" style="border-bottom: var(--bib-light)">
                <div class="td " role="cell" style="border-bottom-color: transparent; border-right-color: transparent;"></div>
                <div class="td" role="cell" style="border-bottom-color: transparent; border-right-color: transparent;">
                  <div class="d-inline-flex align-center px-05 py-025 font-md cursor-pointer new-button shape-rounded" v-on:click.stop="newRowClick()">
                    <bib-icon :icon="newTaskButton.icon" variant="success" :scale="1.1" class=""></bib-icon> <span class="text-truncate">{{newTaskButton.label}}</span>
                  </div>
                </div>
                <!-- <div v-for="n in tableFields.length-1" class="td" style="border-bottom-color: transparent; border-right-color: transparent;"></div> -->
              </div>

              <div v-show="newRow.show" class="tr" role="row">
                <div v-if="drag" class="td text-center" role="cell">
                  <span class="d-inline-flex align-center height-105 bg-primary-sub1 shape-rounded"><bib-icon icon="drag" variant="light"></bib-icon></span>
                </div>
                <template v-for="td in tableFields">
                  <div v-if="td.key == 'title'" class="td" role="cell">
                    <input type="text" ref="newrowInput" class="editable-input" v-model="newRow.title" :class="{'error': validTitle}" @input="newRowCreate" @blur="newRowCreate" required placeholder="Enter title...">
                  </div>
                  <div v-else class="td" role="cell"></div>
                </template>
              </div>
            </draggable>

            <!-- </template> -->
          </template>

        </draggable>

      </div>
    <!-- </div> -->
    <template v-if="contextItems">
      <table-context-menu :items="contextItems" :show="contextVisible" :coordinates="popupCoords" @close-context="closePopups" @item-click="contextItemClick" ></table-context-menu>
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

  name: 'AdvTableTwo',
  components: {
    draggable
  },
  props: {
    tableFields: { type: Array, required: true, default: () => [] },
    tableData: { type: Array, required: true, default: () => [] },
    dataType: { type: String, default: 'nested' },
    // sectionTitle: { type: String, default: "Section" },
    contextItems: { type: Array },
    drag: { type: Boolean, default: true },
    // height: { type: String, default: '100%' }
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
      // highlight: false,
      validTitle: false,
      localData: _.cloneDeep(this.tableData),
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
    /*teamOptions(){
      return this.teamMembers.map(t => {
        return { value : t.id, label: t.label }
      })
    },*/
    /*filterTeam() {
      let regex = new RegExp(this.filterKey, 'g\i')
      return this.teamMembers.filter((u) => {
        if (regex.test(u.label) || regex.test(u.email)) {
          return u
        }
      })
    },*/
    tableWidth() {
      const main = document.getElementById("main-content")
      // console.log(main.clientWidth, main.offsetWidth, main.scrollWidth)
      let w = main.scrollWidth

      return w + "px"

      /*const resizeObserver = new ResizeObserver((entries) => {
        console.log(entries[0])
        if (entries[0].contentRect) {
          return entries[0].contentRect.width + "px"
        } else {
          return main.scrollWidth + "px"
        }
      });

      resizeObserver.observe(main);*/

    },

  },

  mounted() {
    // const sub = document.getElementById("sub-panel")
    this.resizableColumns()
  },

  methods: {
    parseDate(dateString, format) {
      // console.log(dayjs(dateString, "DD MMM YYYY").isValid())
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
      // console.log(table.rows[0].cells)
      // if (table.tagName != 'TABLE') return;
      this.id = table.id;

      // ============================================================
      // private data
      var self = this;

      // console.log(table.children[0].children)
      // var dragColumns  = table.rows[0].cells; // first row columns, used for changing of width
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
        for (var i = 0; i < dragColumns.length; i++) {
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
        // dragColumnNo = (e.target || e.srcElement).parentNode.parentNode;
        dragColumnNo = Array.from(dragEl.parentElement.children).indexOf(dragEl);
        // console.log(dragEl, dragColumnNo)
        // dragColumnNo = (e.target || e.srcElement).parentNode.parentNode.cellIndex;
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
      for (var i = 1; i < dragColumns.length; i++) {
        let clientw = dragColumns[i].clientWidth
        dragColumns[i].style.width = clientw + 'px'
        // console.log(dragColumns[i], clientw)
        dragColumns[i].innerHTML = "<div style='position:relative;height:100%;width:100%;padding:8px 5px;'>" +
          "<div class='resize-drag-handle' style='"+
          "position:absolute;height:100%;width:4px;right:0;top:0px;cursor:w-resize;z-index:10; background-color: var(--bib-secondary-sub4)'>"+
          "</div>"+
          dragColumns[i].innerHTML +
          "</div>";
        // BUGBUG: calculate real border width instead of 5px!!!
        dragColumns[i].firstChild.firstChild.onmousedown = this.startColumnDrag;
      }
    },
    resizableColumns() {
      // var tables = document.getElementsByTagName('table');
      var tables = document.getElementsByClassName("adv-table");
      // console.log(tables)
      for (let i = 0; tables.item(i); i++) {
        if (tables[i].className.match(/resizable/)) {
          // generate id
          if (!tables[i].id) tables[i].id = 'advtable' + (i + 1);
          // make table resizable
          this.resizableTables[this.resizableTables.length] = this.columnResize(tables[i]);
        }
      }
      //  alert(resizableTables.length + ' tables was added.');
    },
    datecell(refname){
      // console.log(refname)
      // console.log(this.$refs[`${refname}`][0].clientWidth)
      
      return (this.$refs[`${refname}`][0].clientWidth - 8) + 'px'
    },
    rowDragStart(e) {
      console.log(e.type, e);
      // this.highlight = true
    },
    rowDragEnd(e) {
      console.log(e.type, e)
      // this.highlight = false
      // let sectionData = this.localdata.filter(s => s.id == e.to.dataset.section)
      // this.$emit('task-dragend', sectionData[0].tasks)
    },
    moveTask(e) {
      console.log("move event", e)
      // this.taskMoveSection = +e.to.dataset.section
    },
    rowClick($event, item) {
      // console.log($event.target)
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
      // console.log($event)
      this.$emit("context-item-event", $event, this.activeItem)
      this.unselectAll()
    },
    async unselectAll() {
      let rows = document.getElementsByClassName('tr');
      for (let row of rows) {
        row.classList.remove('active');
      }
      this.newRow.show = false
      // console.log('clicked outside drag-table-simple component')
      // this.$emit("hide-newrow")
      // this.$emit("close-context-menu")
      return 'success'
    },
    closePopups(id) {
      this.contextVisible = false
      // console.log(this.$refs, id)
      for (let ref in this.$refs) {
        // console.log(ref)
        if(ref != id) this.$refs[ref][0].show = false
      }
    },

    newRowClick() {
      // console.log(sectionId)
      // this.newRow.sectionId = sectionId
      this.unselectAll()
      this.newRow.show = true
      process.nextTick(() => {
        this.$refs.newrowInput[0].focus()
      });
      // this.$refs['newRow'+sectionId].style.visibility = 'visible'
    },

    newRowCreate: _.debounce(function() {
      // console.table([this.newRow.sectionId, this.newRow.title]);
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
      // console.log(item)
      this.$emit("update-title", { id: item.id, field: "title", value: value, label: "Title", historyText: value })
    }, 800),
    updateStatus(status, item) {
      console.log(status, item)
    },
    updatePriority(priority, item) {
      console.log(priority, item)
    },
    updateDept(dept, item){
      console.log(dept, item)
    },
    updateAssignee(user, item) {
      console.log(user, item)
      this.$emit("update-field", { id: item.id, field: "userId", value: user.id, label: "Assignee", historyText: user.label })
    },
    updateDate(date) {
      console.log(date)
    },
  }
}

</script>
<style lang="scss" scoped>
/*
* {
  scrollbar-width: unset;
  scrollbar-height: unset;
  scrollbar-gutter: unset;
  scrollbar-color: unset;
}

*::-webkit-scrollbar {
  width: unset;
  height: unset;
}

::-webkit-scrollbar {
  width: unset;
  height: unset;
  all:unset;
}

*::-webkit-scrollbar-track {
  border-radius: unset;
  background-color: unset;
}

*::-webkit-scrollbar-thumb {
  border-radius: unset;
  background-color: unset;
}

::-webkit-scrollbar-thumb {
    all:unset;
}
*/

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
  /*display: table;*/
  min-width: 100%;
  font-size: $base-size;

  .thead,
  .tbody,
  .tfoot {
    display: table-row-group;
  }

  .th,
  .td {
    /*display: table-cell;*/
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
    /*display: table-row;*/
    display: flex;

    .th:nth-child(2),
    .td:nth-child(2) {
      position: sticky;
      min-width: 2rem;
      left: 0;
      z-index: 10;
      background: #fff;
    }

    .th {
      position: sticky;
      top: 0;
      z-index: 9;
      background: $gray9;
      font-weight: bold;
      color: $secondary;
      padding: 0;
      border-bottom-color: $gray2;

      &:nth-child(2) {
        z-index: 11;
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
      /*outline: 1px solid $gray4;*/
      .td { background-color: $secondary-sub3; }
    }
  }

  .resize-drag-handle {
    background-color: $secondary;
  }
  .drag-handle,
  .section-drag-handle {
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
    /*background-color: skyblue;*/
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
