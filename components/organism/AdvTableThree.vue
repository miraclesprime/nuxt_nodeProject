<template>
  <div id="adv-table-wrapper" class="adv-table-wrapper position-relative" v-click-outside="unselectAll">

      <div :id="'advTableTwo-'+componentKey" class=" adv-table  bg-white" :style="{'width': tableWidth}"  >

        <draggable v-model="localData" id="mainDraggable" class="section-draggable-wrapper sortable-list position-relative" @end="$emit('section-dragend', localData)">
          <div class="table resizable w-100 position-sticky" ref="headrow" style="top: 0; z-index:2;">
            <div class="tr " role="row" >
              <div v-show="drag" class="width-2 th" role="cell" ></div>
              <div v-for="(field, index) in tableFields" :key="field+index" class="th" role="cell" :style="{width: field.width}" :ref="'th'+field.key" :data-key="field.key" >
                <div class="align-center gap-05" >{{field.label}} <span v-if="field.header_icon" :id="'adv-table-header-icon'+index" class="height-1 cursor-pointer sortingtrigger" :data-event="field.header_icon.event" :data-key="field.key" @click="field.header_icon?.event ? $emit(field.header_icon.event, field.key) : null" >
                    <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'dark' : 'gray4'"></bib-icon>
                  </span>
                </div>
              </div>
            </div>
            
            <template v-if="showNewsection">
              <div slot="header" class="tr position-relative height-205">
                <div class="position-absolute border-bottom-light" style="inset: 0; ">
                    <div class="section-header d-flex align-center gap-05 height-205 bg-white" >
                      <div v-show="drag" class="section-drag-handle width-2 h-100" ><bib-icon icon="drag" variant="gray5"></bib-icon>
                      </div>
                      <div class="position-sticky align-center gap-05" style="left: 0.5rem;" >
                        <bib-icon icon="arrow-down" :scale="0.5" style="transform: rotate(-90deg);" ></bib-icon> 
                        <span class="font-w-700 cursor-pointer ml-025" >
                          <input type="text" class="editable-input section-title" placeholder="Enter title..." ref="newsectioninput" @input="debounceNewSection($event.target.value, $event)" @blur="restoreField" />
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
            </template>
          </div>
          <section v-for="(section, index) in localData" class="resizable w-100">
            <div class="thead">
              
              <div class="tr hidden" role="row" >
                <div v-show="drag" class="width-2 th" role="cell" ></div>
                <div v-for="(field, index) in tableFields" :key="field+index" class="th" role="cell" :data-key="field.key" :style="{ width: field.width}" >
                  <!-- <div class="align-center gap-05" > </div> -->
                </div>
              </div>

              <div class="tr position-relative height-205" role="row">
                <div class="position-absolute border-bottom-light" style="inset: 0; ">
                  <div class="section-header d-flex align-center gap-05 height-205 " >
                    <div v-show="drag" class="section-drag-handle width-2 h-100" ><bib-icon icon="drag" variant="gray5"></bib-icon>
                    </div>
                    <div class="position-sticky align-center" style="left: 0.5rem;" >
                      <span class="width-1 cursor-pointer" @click.stop="collapseItem('sectionContent' + section.id)">
                        <bib-icon icon="arrow-down" :scale="0.5" ></bib-icon> 
                      </span>
                      <span class="font-w-700 cursor-pointer ml-025" v-if="editSection" >
                       {{ section.title }}
                      </span>
                      <span class="font-w-700 cursor-pointer ml-025" v-else >
                        <input type="text" class="editable-input section-title" :value="section.title.includes('_section') ? 'Untitled section'
                      : section.title" @input="debounceRenameSection(section.id, $event)" @blur="restoreField" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <draggable class="section-content" tag="article" :list="section[tasksKey]" :group="{ name: 'tasks' }" :data-section="section.id" :ref="'sectionContent' + section.id" @start="rowDragStart" :move="moveRow" @end="rowDragEnd">

              <div v-for="item in section[tasksKey]" :key="item.id" ref="trdata" role="row" class="tr sortable drag-item" @click.stop="rowClick($event, item)" @click.right.prevent="contextOpen($event, item)">
                <div v-show="drag" class="td" role="cell" >
                  <div class="drag-handle width-105 h-100" ><bib-icon icon="drag" variant="gray5"></bib-icon>
                  </div>
                </div>
                <div v-for="(field, index) in tableFields" :key="field+index" class="td" role="cell" >
                  <div v-if="field.key == 'title'" class="align-center w-100">
                    <span v-if="field.icon" class="width-105 height-105 align-center justify-center" :class="{'cursor-pointer': field.icon.event}" @click.stop="markComplete($event, item)">
                      <bib-icon :icon="field.icon.icon" :scale="1.25" :variant="item.statusId == 5 ? 'success' : field.icon.variant" hover-variant="success-sub3"></bib-icon>
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
                  <template v-if="field.key == 'project'">
                    <div class="align-center height-2">{{item[field.key][0]?.project?.title}}</div>
                  </template>
                  <template v-if="field.key == 'userId'">
                    <user-select :ref="'userSelect'+item.id" :userId="item[field.key]" @change="updateAssignee($event, item)" @close-other="closePopups('userSelect'+item.id)" ></user-select>
                  </template>
                  <template v-if="field.key == 'status'">
                    <status-select :ref="'statusSelect'+item.id" :key="'st-'+item.id" :status="item[field.key]" @change="updateStatus($event, item)" @close-other="closePopups('statusSelect'+item.id)"></status-select>
                  </template>
                  <template v-if="field.key == 'priority'">
                    <priority-select :ref="'prioritySelect'+item.id" :priority="item[field.key]" @change="updatePriority($event, item)" @close-other="closePopups('prioritySelect'+item.id)"></priority-select>
                  </template>
                  <template v-if="field.key == 'difficultyId'">
                    <difficulty-select :ref="'difficultySelect'+item.id" :difficulty="item[field.key]" @change="updateDifficulty($event, item)" @close-other="closePopups('difficultySelect'+item.id)"></difficulty-select>
                  </template>
                  <template v-if="field.key == 'department'">
                    <dept-select :ref="'deptSelect'+item.id" :dept="item[field.key]" @change="updateDept($event, item)" @close-other="closePopups('deptSelect'+item.id)"></dept-select>
                  </template>
                  <template v-if="field.key == 'startDate'" >
                    <!-- {{$formatDate(item[field.key])}} -->
                    
                    <bib-datetime-picker v-model="item[field.key]" :format="format" :parseDate="parseDate" :formatDate="formatDate" placeholder="No date" @input="updateDate($event, item, field.key, field.label)" @click.native.stop></bib-datetime-picker>
                  </template>
                  <template v-if="field.key == 'dueDate'" >
                    <!-- {{$formatDate(item[field.key])}} -->
                    
                    <bib-datetime-picker v-model="item[field.key]" :format="format" :parseDate="parseDate" :formatDate="formatDate" placeholder="No date" @input="updateDate($event, item, field.key, field.label)" @click.native.stop></bib-datetime-picker>

                  </template>
                </div>
              </div>

              <template v-if="plusButton" >
                <div v-show="localNewrow.sectionId != section.id" :key="'plusbtn'+akey" class="tr" role="row" style="border-bottom: var(--bib-light)">
                  <div v-show="drag" class="td width-2" role="cell" style="border-bottom-color: transparent; border-right-color: transparent;"></div>
                  <div class="td" role="cell" style="border-bottom-color: transparent; border-right-color: transparent; width: 360px;">
                    <div class="d-inline-flex align-center px-05 py-025 font-md cursor-pointer new-button shape-rounded" v-on:click.stop="newRowClick(section.id)">
                      <bib-icon :icon="plusButton.icon" variant="success" :scale="1.1" class=""></bib-icon> <span class="text-truncate">{{plusButton.label}}</span>
                    </div>
                  </div>
                </div>

                <div v-show="localNewrow.sectionId == section.id" :key="'plusinput'+akey" class="tr" role="row" >
                  <div v-show="drag" class="td text-center " role="cell">
                    <span class="d-inline-flex align-center justify-center width-105 h-100 bg-secondary-sub4 shape-rounded"><bib-icon icon="drag" variant="white"></bib-icon></span>
                  </div>
                  <div class="td" role="cell">
                    <input type="text" :ref="'newrowInput'+section.id" class="editable-input" v-model="localNewrow.title" :class="{'error': validTitle}" @input="newRowCreate(section)" @blur="unselectAll" @keyup.esc="unselectAll" required placeholder="Enter title...">
                  </div>
                </div>

              </template>

            </draggable>

          </section>
          
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
// import fecha, { format } from "fecha";
import draggable from 'vuedraggable'

export default {

  name: 'AdvTableThree',
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
    editSection:{type:String, default:""},
    tasksKey: {
      type: String,
      default() {
        return "tasks";
      },
    },
    plusButton: {
      type: [Object, Boolean],
      default () {
        return {
          label: "New Task",
          icon: "add",
        }
      }
    },
    newRow: {
      type: [Object, Boolean],
      default () {
        return {
          show: false,
          sectionId: -1,
          title: "",
          user: [],
          statusId: null,
          priorityId: null,
          startDate: "",
          dueDate: "",
          departmentId: null,
          description: "",
          budget: "",
          text: "",
        }
      }
    },
    showNewsection: { type: Boolean, default: false},
    // isProject: { type: Boolean, default: false},
  },

  data() {
    return {
      // isCollapsed: false,
      contextVisible: false,
      popupCoords: { left: 0, top: 0 },
      activeItem: {},
      resizableTables: [],
      format: "DD MMM YYYY",
      // highlight: false,
      validTitle: false,
      localData: [],
      localNewrow: {},
      akey: 0,
    }
  },
  
  watch: {
    newRow(newValue){
      // console.log(newValue.sectionId)
      // this.localNewrow = _.cloneDeep(this.newRow)
      this.localNewrow = newValue

    },
    tableData(newValue){
      this.localData = _.cloneDeep(newValue)
    },
    showNewsection(newValue){
      process.nextTick(() => {
        if(newValue){
          this.$refs.newsectioninput.focus()
        }
      });
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
    componentKey(){
      return Math.floor((Math.random() * 999))
    },

    tableWidth() {
      const main = document.getElementById("main-content")
      // console.log(main.clientWidth, main.offsetWidth, main.scrollWidth)
      let w = main.scrollWidth - 18

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
    this.localData = _.cloneDeep(this.tableData)
    this.resizableColumns()

  },

  methods: {
    parseDate(dateString, format) {
        return new Date(dateString)
    },
    formatDate(dateObj, format) {
        return dayjs(dateObj).format(format);
    },
    startdateValid(date, duedate){
      console.log(...arguments)
      const maxDate = new Date(duedate)
      return date < maxDate
      /*if (date) {
        return { from: new Date(duedate)}
      } else {
        return {}
      }*/
    },
    duedateValid(date, startdate) {
      console.log(...arguments)
      // const minDate = new Date(startdate)
      const minDate = new Date(startdate);
      // const maxDate = new Date("2023-06-30");
      return date < minDate.setDate(minDate.getDate() - 1);
      /*if (date) {
        return { to: new Date(startdate)}
      } else {
        return {}
      }*/
    },
    collapseItem(refId, refIcon) {
      let elem = this.$refs[refId][0].$el
      // let icon = this.$refs[refIcon][0].$el
      // let tar = event.target;

      // console.log(elem.style.height)
      elem.classList.toggle("collapsed")
      
    },

    /*iconRotate(expanded){
      if (expanded) {
        return {'transform': 'rotate(-90deg)'}
      } else {
        return {"transform": 'rotate(0deg)'}
      }
    },*/
    
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
        
        let col1key = dragColumns[no].dataset.key
        let col2key = dragColumns[no + 1].dataset.key
        let col1 = document.querySelectorAll(`.th[data-key="${col1key}"]`)
        let col2 = document.querySelectorAll(`.th[data-key="${col2key}"]`)
        // console.log(col1, col2)
        for (var i = 0; i < col1.length; i++) {
          // console.log(col1[i])
          col1[i].style.width = dragColumns[no].clientWidth + "px"
          col2[i].style.width = dragColumns[no + 1].clientWidth + "px"
        }
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
        // console.log(dragColumnNo, X, dragX)
        return false;
      }

      // ============================================================
      // stops column dragging
      this.stopColumnDrag = function(e) {

        var ev = e || window.event;
        ev.stopPropagation()
        ev.stopImmediatePropagation()
        // console.log(ev)

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
        // console.log(colWidth)

        self.preventEvent(ev);
      }

      // ============================================================
      // init data and start dragging
      this.startColumnDrag = function(e) {
        var e = e || window.event;
        // e.cancelBubble = true
        // e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        // console.log(e)
        // if not first button was clicked
        if (e.button != 0) return;

        // remember dragging object
        var dragEl = (e.target || e.srcElement).offsetParent.parentElement
        // dragColumnNo = (e.target || e.srcElement).parentNode.parentNode;
        dragColumnNo = Array.from(dragEl.parentElement.children).indexOf(dragEl);
        // dragColumnNo = (e.target || e.srcElement).parentNode.parentNode.cellIndex;
        dragX = e.clientX || e.pageX;

        // console.log(dragEl, dragColumnNo, dragX)
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

        dragColumns[i].innerHTML = "<div style='position:relative;height:100%;width:100%;padding:8px 5px;'><div class='resize-drag-handle position-absolute h-100' ></div>"+dragColumns[i].innerHTML+"</div>";
        // BUGBUG: calculate real border width instead of 5px!!!
        
        dragColumns[i].firstChild.firstChild.onmousedown = this.startColumnDrag;
      }

      // const headElems = document.getElementsByClassName("th")
      const sorttrig = document.getElementsByClassName('sortingtrigger')

      for (var i = 0; i < sorttrig.length; i++) {
        // console.log(sorttrig[i])
        sorttrig[i].addEventListener("click", (e) => {
          // console.log(e.currentTarget, e.currentTarget.dataset)
          this.$emit(e.currentTarget.dataset.event, e.currentTarget.dataset.key)
        })
      }

    },
    resizableColumns() {
      // var tables = document.getElementsByTagName('table');
      // var table = document.getElementsByClassName("adv-table");
      // var table = document.getElementById(`advTableTwo-${this.componentKey}`);
      var table = this.$refs.headrow
      // console.log(table)
      if (table.className.match(/resizable/)) {
        this.resizableTables = this.columnResize(table);
      }
    },
    
    rowDragStart(e) {
      // console.log("row drag start ", e);
      // this.highlight = true
    },
    rowDragEnd(e) {
      // this.highlight = false;
      let sectionData = this.localData.filter(
        (s) => s.id == e.to.dataset.section
      );

      // console.log("row drag end ", e, sectionData[0][this.tasksKey])
      this.$emit("row-dragend", {
        [this.tasksKey]: sectionData[0][this.tasksKey],
        sectionId: e.to.dataset.section,
      });
    },
    moveRow(e) {
      // console.log("move row ", e)
      // this.taskMoveSection = +e.to.dataset.section
    },
    rowClick($event, item) {
      // console.log($event.target)
      this.unselectAll()
        // .then(r => {
          $event.currentTarget.classList.add("active")
        // })
      this.$emit("row-click", item)
    },
   
    contextOpen($event, item) {
      this.unselectAll()
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.contextVisible = true
      this.activeItem = item
      this.$emit("context-open", item)
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
      this.localNewrow.sectionId = null
      this.localNewrow.title = ""
      this.localNewrow.show = false;
      this.akey+=1
      this.$emit("toggle-newsection", 'hide') //send any string to hide
      // console.log('unselect all ')
      // this.$emit("hide-newrow")
      // this.$emit("close-context-menu")
      return 'success'
    },
    closePopups(id) {
      this.contextVisible = false
      if (id) {
        for (let ref in this.$refs) {
          if(ref != id && this.$refs[ref][0]) this.$refs[ref][0].show = false
        }
      }
    },

    newRowClick(sectionId) {
      // console.log(sectionId)

      this.unselectAll().then((res) => {
        this.localNewrow.sectionId = sectionId
        this.localNewrow.title = ""
        this.akey+=1
        // console.log(this.akey, this.localNewrow)
      })

      process.nextTick(() => {
        this.$refs['newrowInput'+sectionId][0].focus()
      });

    },

    newRowCreate: _.debounce(function(section) {
      // console.table([this.newRow.sectionId, this.newRow.title]);
      if (!this.localNewrow.title) {
        console.warn("title is required")
        this.validTitle = "alert"
        return false
      }
      this.validTitle = ""
      // console.info("valid input->", this.localNewrow.title)
      this.$emit("create-row", this.localNewrow, section)
    }, 800),

    debounceTitle: _.debounce(function(value, item) {
      // console.log(item)
      this.$emit("update-field", { id: item.id, field: "title", value: value, label: "Title", historyText: `changed Title to ${value}`, item })
    }, 800),
    markComplete($event, item){
      // console.log($event, item.statusId)
      if (item.statusId == 5) {
        this.$emit("update-field", { id: item.id, field: "statusId", value: 1, label: "Status", historyText: "changed Status to Not Started" ,item})
      } else {
        this.$emit("update-field", { id: item.id, field: "statusId", value: 5, label: "Status", historyText: "changed Status to Done",item })
      }
    },
    updateStatus(status, item) {
      // console.log(status, item)
      this.$emit("update-field", { id: item.id, field: "statusId", value: status.value, label: "Status", historyText: `changed Status to ${status.label}`, item })
    },
    updatePriority(priority, item) {
      // console.log(priority, item)
      this.$emit("update-field", { id: item.id, field: "priorityId", value: priority.value, label: "Priority", historyText: `changed Priority to ${priority.label}`, item })
    },
    updateDifficulty(difficulty, item) {
      this.$emit("update-field", { id: item.id, field: "difficultyId", value: difficulty.value, label: "Difficulty", historyText: `changed Difficulty to ${difficulty.label}`, item })
    },
    updateDept(dept, item){
      // console.log(dept, item)
      this.$emit("update-field", { id: item.id, field: "departmentId", value: dept.value, label: "Department", historyText: `changed Department to ${dept.label}`, item })
    },
    updateAssignee(user, item) {
      // console.log(user, item)
      this.$emit("update-field", { id: item.id, field: "userId", value: user.id, label: "Assignee", historyText: `changed Assignee to ${user.label}`, item })
    },
    updateDate(d, item, field, label) {
      // console.log(...arguments)
      // let d = new Date(date)
      this.$emit("update-field", { id: item.id, field, value: new Date(d), label, historyText: `Changed ${label} to ${dayjs(d).format('DD MMM YYYY')}`, item: item})
    },
    debounceNewSection: _.debounce(function(value, event) {
      if (value) {
        // console.log(...arguments)
        event.target.classList.remove("error")
        this.$emit("create-section", value)
      } else {
        console.warn("Title cannot be left blank")
        event.target.classList.add("error")
      }
    }, 800),
    debounceRenameSection: _.debounce(function (id, event) {
      if (_.trim(event.target.value) == "") {
        event.target.classList.add("error");
        console.warn("section title cannot be blank");
      } else {
        event.target.classList.remove("error");
        this.$emit("edit-section", { id, title: event.target.value });
      }
    }, 800),
    restoreField() {
      event.target.blur();
      event.target.classList.remove("error");
      this.unselectAll();
    },
  },
  
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
  /*min-width: 1400px;*/
}

.adv-table {
  min-width: 100%;
  font-size: $base-size;

  .table, section { display: table; table-layout: fixed; }
  article { display: table-row-group; }
  
  .thead,
  .tbody,
  .tfoot {
    display: table-row-group;
  }

  .th,
  .td {
    display: table-cell;
    /*display: inline-flex;*/
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

    .resize-drag-handle {
      background-color: $secondary;
    }

    .th:nth-child(2),
    .td:nth-child(2) {
      position: sticky;
      min-width: 2rem;
      left: 0;
      z-index: 1;
      background: #fff;
    }
    &.hidden { visibility: hidden;
      .th { height: 2px; padding: 0;}
    }

    .th {
      /*position: sticky;
      top: 0;
      z-index: 9;*/
      background: $gray9;
      font-weight: bold;
      color: $secondary;
      /*padding: 0.325rem 0.25rem;*/
      padding: 0;
      border-bottom-color: $gray2;

      &:nth-child(2) {
        z-index: 5;
        background: $gray9;
      }
      &:not(:last-child) {
        border-right: 1px solid $gray8;
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

  /*.section-header { position: sticky; left: 0; }*/

  /*.sortable-chosen {
    .td { background-color: $success-sub6; }
    .td:nth-child(2) { background-color: $success-sub6; }
  }*/

  .section-content {
    &.collapsed { /*height: 0; overflow: hidden;*/ /*visibility: hidden;*/ }
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
  &.section-title { font-weight: bold; }
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
#adv-table-th1.th {
  border-right: 1px solid #e3e3ea !important;
}
</style>
