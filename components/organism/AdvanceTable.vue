<template>
  <div id="adv-table-wrapper" class="adv-table-wrapper position-relative">
    <div class="adv-table resizable bg-white" :style="{'width': tableWidth}" role="table">
      <!-- <div class="zero" :style="{ width: tableFields[0].width}">
        <div class="align-center gap-05">{{tableFields[0].label}} <span v-if="tableFields[0].header_icon" class="height-1" @click="$emit(tableFields[0].header_icon.event)"><bib-icon :icon="tableFields[0].header_icon.icon" :variant="tableFields[0].header_icon.isActive ? 'gray1' : 'gray4'"></bib-icon></span></div>
      </div> -->
      <div class="tr" role="row">
        <div v-for="(field, index) in tableFields" :key="field+index" class="th" role="cell" :style="{ width: field.width}">
          <div class="align-center gap-05">{{field.label}} <span v-if="field.header_icon" class="height-1 cursor-pointer" @click="$emit(field.header_icon.event, field)">
              <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'gray1' : 'gray4'"></bib-icon>
            </span></div>
        </div>
        <!-- <div class="th">owner</div>
        <div class="th">due date</div> -->
      </div>
      <!-- <div class="thead">
      </div> -->
      <div v-for="item in tableData" :key="item.id" class="tr" role="row" @click.right.prevent="contextOpen($event, item)">
        <div v-for="(field, index) in tableFields" :key="field+index" class="td" role="cell">
          <div v-if="field.key == 'title'" class="align-center ">
            <span v-if="field.icon" class="width-105 height-105 align-center justify-center" :class="{'cursor-pointer': field.icon.event}">
              <bib-icon :icon="field.icon.icon" :scale="1.25" :variant="field.icon.variant" hover-variant="success"></bib-icon>
            </span>
            <span v-if="field.event" class=" flex-grow-1" style=" line-height:1.25;">
              <input type="text" class="editable-input" :value="item[field.key]" @input="debounceTitle($event.target.value, item)">
            </span>
            <span v-else class="flex-grow-1">
              {{item[field.key]}}
            </span>
            <span v-if="field.event" class="width-105 height-105 align-center justify-center flex-shrink-0 cursor-pointer bg-hover-light" @click.stop="$emit(`${field.event}`, item)">
              <bib-icon icon="arrow-right" variant="gray4" hover-variant="gray5"></bib-icon>
            </span>
          </div>
          <template v-if="field.key == 'project'">{{item[field.key][0].project.title}}</template>
          <template v-if="field.key == 'userId'">
            <user-select :ref="'userSelect'+item.id" :userId="item[field.key]" @change="updateAssignee($event, item)" @close-other="closePopups('userSelect'+item.id)" ></user-select>
            <!-- <user-info :userId="item[field.key]"></user-info> -->
            <!-- <bib-select :options="teamOptions" placeholder="Owner" @change="updateAssignee($event, item)" ></bib-select> -->
          </template>
          <template v-if="field.key == 'status'">
            <!-- <status-comp :status="item[field.key]"></status-comp> -->
            <status-select :ref="'stausSelect'+item.id" :key="'st-'+item.id" :status="item[field.key]" @change="updateStatus($event, item)" @close-other="closePopups('stausSelect'+item.id)"></status-select>
          </template>
          <template v-if="field.key == 'priority'">
            <!-- <priority-comp :priority="item[field.key]"></priority-comp> -->
            <priority-select :ref="'prioritySelect'+item.id" :value="item[field.key]" @change="updatePriority($event, item)" @close-other="closePopups('prioritySelect'+item.id)"></priority-select>
          </template>
          <template v-if="field.key == 'department'">
            <!-- {{item[field.key]?.title}} -->
            <dept-select :ref="'deptSelect'+item.id" :dept="item[field.key]" @change="updateDept($event, item)" @close-other="closePopups('deptSelect'+item.id)"></dept-select>
          </template>
          <template v-if="field.key.includes('Date')" class="date-cell">
            <!-- {{$formatDate(item[field.key])}} -->
            <bib-datetime-picker v-model="item[field.key]" placeholder="" @input="updateDate"></bib-datetime-picker>
          </template>
          <!-- {{item[field.key]}} -->
        </div>
        <!-- <div class="td">asdf</div>
        <div class="td">asdf</div> -->
      </div>
      <!-- <div class="tbody">
        
      </div> -->
      <!-- <div class="tfoot">
      <div class="tr">
        <div class="td">foot asdf</div>
        <div class="td">foot asdf</div>
        <div class="td">foot asdf</div>
      </div>
    </div> -->
    </div>
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

export default {

  name: 'AdvanceTable',

  props: {
    tableFields: { type: Array, required: true, default: () => [] },
    tableData: { type: Array, required: true, default: () => [] },
    dataType: { type: String, default: 'nested' },
    contextItems: { type: Array },
    draggable: { type: Boolean, default: true },
    // height: { type: String, default: '100%' }
  },

  data() {
    return {
      contextVisible: false,
      popupCoords: { left: 0, top: 0 },
      activeItem: {},
      resizableTables: [],
      format: "DD MMM YYYY",
    }
  },

  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
    }),
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

    formatDate(dateObj, format) {
      return fecha.format(dateObj, this.format);
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
      console.log(dragColumns)
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
      for (var i = 0; i < dragColumns.length; i++) {
        dragColumns[i].innerHTML = "<div style='position:relative;height:100%;width:100%;padding:5px;'>" +
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

    contextOpen($event, item) {
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.contextVisible = true
      this.activeItem = item
    },
    contextItemClick($event){
      // console.log($event)
      this.$emit("context-item-event", $event, this.activeItem)
    },
    closePopups(id) {
      this.contextVisible = false
      // console.log(this.$refs, id)
      for (let ref in this.$refs) {
        // console.log(ref)
        if(ref != id) this.$refs[ref][0].show = false
      }
    },
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
}

*::-webkit-scrollbar {
  width: unset;
  height: unset;
}

::-webkit-scrollbar {
  width: unset;
  height: unset;
}

*::-webkit-scrollbar-track {
  border-radius: unset;
  background-color: initial;
}

*::-webkit-scrollbar-thumb {
  border-radius: unset;
  background-color: initial;
}

::-webkit-scrollbar {
    all:unset;
}

::-webkit-scrollbar-thumb {
    all:unset;
}
*/

.adv-table-wrapper {
  overflow: auto;
  /*height: calc(100vh - 200px);*/
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

    .th:first-child,
    .td:first-child {
      position: sticky;
      width: 100px;
      left: 0;
      z-index: 10;
      background: #fff;
    }

    .th {
      position: sticky;
      top: 0;
      z-index: 9;
      background: $gray9;
      padding: 0;

      &:first-child {
        z-index: 11;
        background: $gray9;
      }
      &:hover {
        .resize-drag-handle { background-color: $primary; }
      }
    }
  }

  .resize-drag-handle {
    background-color: $secondary;
  }

}


.editable-input {
  font-size: $base-size;
  font-weight: normal;
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
