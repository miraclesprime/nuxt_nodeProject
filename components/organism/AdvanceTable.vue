<template>
  <div id="adv-table-wrapper" class="adv-table-wrapper position-relative" v-click-outside="unselectAll" :style="{minWidth: tableWidth+'px'}">

    <div class="adv-table bg-white position-relative" :id="'advTable-'+componentKey"  >
      <div :id="'table-'+componentKey" role="table" class="table w-100">
        <div class="thead">
          <div  class="tr position-relative" role="row" id="advtable-head-row">
            <!-- <div v-if="drag" class="width-2 th" id="advtable-th" role="cell"></div> -->
            <div v-for="(field, index) in tableFields" :key="field+index" class="th height-2" :id="'advtable-th'+index" role="cell" :width="colSizes[index]+'%'" :style="{width: `calc(1.001% * ${colSizes[index]})`}" >
              {{field.label}}
              <!-- <div class="align-center gap-05" :style="{'min-width': field.minWidth}">{{field.label}} <span v-if="field.header_icon" id="adv-table-header-icon" class="height-1 cursor-pointer sortingtrigger" :data-event="field.header_icon.event" :data-key="field.key" @click="field.header_icon?.event ? $emit(field.header_icon.event, field.key) : null">
                  <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'dark' : 'gray4'"></bib-icon>
                </span></div> -->
            </div>
          </div>

          <div class="tr position-relative height-2" id="advtable-title-row" v-if="sectionTitle">
            <div class="position-absolute" id="adv-table-section-header-wrapper" style="inset: 0; border-bottom: 1px solid var(--bib-light);">
              <div class="section-header d-flex align-center gap-05 height-2 px-075" id="adv-table-section-header">
                <div class="position-sticky align-center" style="left: 0.5rem;" >
                  <!-- <span class="width-1 cursor-pointer" @click.stop="isCollapsed = !isCollapsed">
                    <bib-icon icon="arrow-down" :scale="0.5" :style="{transform: iconRotate}"></bib-icon> 
                  </span> -->
                  <span class="font-w-700 " id="adv-table-section-title" >
                    {{sectionTitle}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template >
        <div class="table w-100">
          <!-- <article class="tbody"> -->
            <div class="tr hidden" role="row" >
              <div v-for="(field, index) in tableFields" :key="field+index" :width="colSizes[index]+'%'" class="th" role="cell" :style="{ width: `calc(1.001% * ${colSizes[index]})`}" >
              </div>
            </div>
            <div v-for="(item, index) in localData" :key="item.id+'-'+index" class="tr" :id="'advtable-row-'+index" role="row" @click.stop="rowClick($event, item)" @click.right.prevent="contextOpen($event, item)"  >
              <!-- <div v-if="drag" class="td" role="cell" :id="'advtable-td-'+index">
                <div v-show="drag" class="drag-handle width-105 height-2" :id="'advtable-drag-handle'+item.id"><bib-icon icon="drag" variant="gray5"></bib-icon>
                </div>
              </div> -->
              <div v-for="(field, findex) in tableFields" :id="'advtable-fields-'+index+findex" :key="field+findex" class="td" role="cell"  >
                <div v-if="field.key == 'title'" class="align-center " id="advtable-title-field" >
                  <span v-if="field.icon" class="width-105 height-105 align-center justify-center" :class="{'cursor-pointer': field.icon.event}" @click.stop="markComplete($event, item)">
                    <bib-icon :icon="field.icon.icon" :scale="1.25" :variant="item.statusId == 5 ? 'success' : field.icon.variant" hover-variant="success-sub3"></bib-icon>
                  </span>
                  <span v-if="field.event" class=" flex-grow-1" style="line-height:1.25;" id="adv-table-field-event">
                    <input type="text" class="editable-input" id="advtable-editable-input" :value="item[field.key]" @focus="item.project?$emit(`${field.event}`, item):''" @click.stop @input.stop="debounceTitle($event.target.value, item)" @keyup.esc="unselectAll">
                  </span>
                  <span v-else class="flex-grow-1" id="adv-table-item-field-key">
                    {{item[field.key]}}
                  </span>
                  <span v-if="field.event" class="width-105 height-105 align-center justify-center flex-shrink-0 cursor-pointer bg-hover-light" :id="'advtable-field-event-trigger-'+index" @click.stop="titleClick(`${field.event}`, item)">
                    <bib-icon icon="arrow-right" variant="gray4" hover-variant="gray5"></bib-icon>
                  </span>
                </div>
                <template v-if="field.key == 'project'">
                  <div class="align-center height-2 w-100 text-wrap text-of-elipsis of-hidden">{{item[field.key]?.[0]?.project?.title}}</div>
                </template>
                <template v-if="field.key == 'userId'">
                  <!-- <div style="text-wrap: wrap;">
                    {{field.width}} - {{field.minwidth}} - {{item[field.key]}}
                  </div> -->
                  <lazy-user-select v-if="lazyComponent" :ref="'userSelect'+item.id" :userId="item[field.key]" @change="updateAssignee($event, item)" @close-other="closePopups('userSelect'+item.id)" ></lazy-user-select>
                  <!-- <skeleton-box v-else></skeleton-box> -->
                </template>
                <template v-if="field.key == 'status'">
                  <lazy-status-select v-if="lazyComponent" :ref="'statusSelect'+item.id" :key="'st-'+item.id" :status="item[field.key]" @change="updateStatus($event, item)" @close-other="closePopups('statusSelect'+item.id)"></lazy-status-select>
                  <skeleton-box v-else></skeleton-box>
                </template>
                <template v-if="field.key == 'priority'">
                  <lazy-priority-select v-if="lazyComponent" :ref="'prioritySelect'+item.id" :priority="item[field.key]" @change="updatePriority($event, item)" @close-other="closePopups('prioritySelect'+item.id)"></lazy-priority-select>
                  <skeleton-box v-else></skeleton-box>
                </template>
                <template v-if="field.key == 'difficultyId'">
                  <lazy-difficulty-select v-if="lazyComponent" :ref="'difficultySelect'+item.id" :difficulty="item[field.key]" @change="updateDifficulty($event, item)" @close-other="closePopups('difficultySelect'+item.id)"></lazy-difficulty-select>
                  <skeleton-box v-else></skeleton-box>
                </template>
                <template v-if="field.key == 'department'">
                  <lazy-dept-select v-if="lazyComponent" :ref="'deptSelect'+item.id" :dept="item[field.key]" @change="updateDept($event, item)" @close-other="closePopups('deptSelect'+item.id)"></lazy-dept-select>
                  <skeleton-box v-else></skeleton-box>
                </template>
                <template v-if="field.key == 'tag'">
                  <template v-if="item['TaskTags']?.length > 0">
                    <tag-comp :tags="item['TaskTags']"></tag-comp>
                  </template>
                </template>
                <template v-if="field.key.includes('Date')" class="date-cell">
                  <!-- {{$formatDate(item[field.key])}} -->
                  <bib-datetime-picker v-if="lazyComponent" v-model="item[field.key]" variant="gray4" :format="format" :parseDate="parseDate" :formatDate="formatDate" placeholder="No date" @input="updateDate($event, item, index, field.key, field.label)" @click.native.stop></bib-datetime-picker>
                  <skeleton-box v-else></skeleton-box>
                </template>
              </div>
            </div>
            <template v-if="plusButton">
              
              <div v-show="!newrowDisplay" class="tr" role="row" style="border-bottom: var(--bib-light)" id="advtable-newRow-wrapper">
                <!-- <div v-if="drag" class="td " id="adv-table-newRow-td1" role="cell" style="border-bottom-color: transparent; border-right-color: transparent;"></div> -->
                <div class="td" id="advtable-newRow-td2" role="cell" style="border-bottom-color: transparent; border-right-color: transparent;">
                  <div class="d-inline-flex align-center font-md cursor-pointer new-button border-primary-24 shape-rounded" id="advtable-newRow-newTaskBtn" v-on:click.stop="newRowClick()">
                    <bib-icon :icon="plusButton.icon" variant="" :scale="0.8" class=""></bib-icon><span class="text-truncate ">{{plusButton.label}}</span>
                  </div>
                </div>
                <div v-for="(n, index) in tableFields.length-1" class="td" :id="'advtable-newRow-td2'+index" style="border-bottom-color: transparent; border-right-color: transparent;"></div>
              </div>

              <div v-show="newrowDisplay" class="tr" role="row" id="advtable-newRow2">
                <!-- <div v-if="drag" class="td text-center" id="adv-table-newRow2-td" role="cell">
                  <span class="d-inline-flex align-center height-105 bg-secondary-sub4 shape-rounded" id="adv-table-newRow2-drag"><bib-icon icon="drag" variant="white"></bib-icon></span>
                </div> -->
                <template v-for="(td,index) in tableFields">
                  <div v-if="td.key == 'title'" class="td" role="cell" :id="'advtable-newRow2-td-'+index">
                    <!-- :class="{'error': validTitle}" -->
                    <input type="text" ref="newrowInput" class="editable-input" :id="'advtable-editable-input2-'+index" v-model="localNewrow.title"  @blur="testCreateNewRow" @keyup.enter="testCreateNewRow" @keyup.esc="unselectAll" required placeholder="Enter title...">
                  </div>
                </template>
              </div>
            </template>

      <div id="header_wrap" class="position-absolute header-wrap" >
        <div class="split position-sticky " >
          <!-- <div v-if="drag" class="width-2 " id="advtable-th-1" ></div> -->
          <div v-for="(field, index) in tableFields" class="splitcell border-bottom-gray2" :class="['splitcell'+componentKey]" :id="'split'+index+componentKey" :minwidth="field.minwidth" >
            <div class="align-center gap-05 height-2 px-05" :style="{'min-width': field.minWidth}" style="white-space: nowrap;">{{field.label}} <span v-if="field.header_icon" id="advtable-header-icon" class="height-1 cursor-pointer sortingtrigger" :data-event="field.header_icon.event" :data-key="field.key" @click="field.header_icon?.event ? $emit(field.header_icon.event, field.key) : null">
              <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'dark' : 'gray4'"></bib-icon>
            </span></div>
          </div>
          <!-- <div class="border-bottom-gray2"></div> -->
        </div>
        <!-- <div ref="splitHint" class="split-indicator h-100 position-absolute"></div> -->
      </div>
    </div>
  </template>
    
    <template v-if="contextItems">
      <table-context-menu :items="contextItems" :show="contextVisible" :coordinates="popupCoords" @close-context="closePopups" @item-click="contextItemClick" ></table-context-menu>
    </template>

    <bib-popup-notification-wrapper>
      <template #wrapper>
        <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" :autohide="4000">
        </bib-popup-notification>
      </template>
    </bib-popup-notification-wrapper>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Split from 'split.js'
// import ColumnResizer from 'column-resizer';
import dayjs from 'dayjs'
// import draggable from 'vuedraggable'

export default {

  name: 'AdvanceTable',
  /*components: {
    draggable,
  },*/
  props: {
    tableFields: { type: Array, required: true, default: () => [] },
    tableData: { type: Array, required: true, default: () => [] },
    dataType: { type: String, default: 'nested' },  
    sectionTitle: { type: String, default: "Section" },
    contextItems: { type: Array },
    drag: { type: Boolean, default: true },
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
      type: Object,
      default () {
        return {
          show: false,
          sectionId: "",
          title: "",
          userId: "",
          statusId: null,
          priorityId: null,
          startDate: "",
          dueDate: "",
          format: "D MMM YYYY",
          departmentId: "",
          description: "",
          budget: "",
          text: "",
        }
      }
    },
    lazyComponent: false,
  },

  data() {
    return {
      isCollapsed: false,
      contextVisible: false,
      popupCoords: { left: 0, top: 0 },
      activeItem: {},
      format: "DD MMM YYYY",
      validTitle: false,
      localData: [],
      localNewrow: _.cloneDeep(this.newRow),
      newrowDisplay: false,
      colIds: [],
      colSizes: [],
      colmw: [],
      // columns: []
      tableWidth: "100%",
      popupMessages: [],
    }
  },

  watch: {
    tableData(newValue){
      // console.log(newValue.length)
      this.localData = _.cloneDeep(newValue)
      this.modifyDateFormat()
    },
    /*tableFields(newValue){
      let nowidth = 0;
      let arr = newValue.map(w => (parseInt(w.width) / parseInt(this.tableWidth)) * 100 )
      console.log(arr)
      for (var i = 0; i < arr.length; i++) {
        if(isNaN(arr[i])){
          arr[i] = 30
        } else {
          nowidth += arr[i]
          arr[i] = Number(arr[i].toFixed(4))
        }
        this.colSizes = arr[i]
      }
      
    },*/
  },

  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      // sidebarVisible: "task/getSidebarVisible",
    }),

    iconRotate(){
      if (this.isCollapsed) {
        return 'rotate(-90deg)'
      } else {
        return 'rotate(0deg)'
      }
    },
    /*tableWidth: {
      get: function() {
        const main = document.getElementById("main-content")
        let w = main.scrollWidth - 18
        
        return w + "px"
      },
      set: function(newValue){
        console.log(newValue)
      }
    },*/
    componentKey(){
      return Math.floor((Math.random() * 999))
    },
  },
  created() {

  // Register the listener for the "newTask" event
    this.$nuxt.$on("newTask", this.handleNewTask);
    this.$nuxt.$on("delete_update_table", this.delete_UpdateLocalData)
    this.$nuxt.$on("update_table", this.edit_UpdateLocalData)
  },
  mounted() {
    /*const main = document.getElementById("main-content")
    let pageWidth
    const resizeObserver = new ResizeObserver((entries) => {
      console.log(entries[0].contentRect)
      if (entries[0].contentRect) {
        pageWidth = entries[0].contentRect.width
      } else {
        pageWidth = main.scrollWidth - 18
      }
    });

    resizeObserver.observe(main);*/
    
    this.localData = _.cloneDeep(this.tableData)
    this.modifyDateFormat()

    let nowidth = 0;
    let nowidthIndex = [];
    this.tableWidth = this.tableFields.reduce((acc, curr) => curr.width + acc, 0)
    this.colSizes = this.tableFields.map(w => (parseInt(w.width) / parseInt(this.tableWidth)) * 100)
    // this.colSizes = this.tableFields.map(w => parseInt(100 / (this.tableWidth / w.width)))
    // console.log(" column width->",this.colSizes)
    
    let elemIds = document.getElementsByClassName("splitcell"+this.componentKey)
    for(let c of elemIds){
      // console.log(c.getAttribute("id"))
      this.colIds.push("#"+c.getAttribute("id"))
      this.colmw.push(Number(c.getAttribute("minwidth")))
    }

    /*var pg = this.$route.path.replace(/\//g,'-')
    var sizes = sessionStorage.getItem('cols'+pg)

    if (sizes) {
      this.colSizes = JSON.parse(sizes)
    }*/

    let splitCol = Split(this.colIds, {
      sizes: this.colSizes,
      minSize: this.colmw,
      gutterSize: 2,
      snapOffset: 4,
      dragInterval: 5,
      
      onDragEnd: (sizes) => {
        // console.log(sizes[1])
        this.colSizes = sizes
        /*if (pg.indexOf("favorite") < 0) {
          sessionStorage.setItem("cols"+pg, JSON.stringify(sizes))
        }*/
      }
    })

    setTimeout(() => {
        splitCol.setSizes(this.colSizes);

    }, 100)

  },

  beforeDestroy(){
    this.localData = [];
    this.activeItem = {}
    this.localNewrow = {}
    this.colIds = []
    this.colSizes = []
    this.colmw = []
    this.$nuxt.$off("newTask", this.handleNewTask);
    this.$nuxt.$off("delete_update_table", this.delete_UpdateLocalData)
    this.$nuxt.$off("update_table", this.edit_UpdateLocalData)
   
  },

  methods: {

    handleNewTask (payload,param) {
      if (this.localData.length>0) {
          this.localData.push(payload);
        } else {
          this.$nuxt.$emit("refresh-table");
        }
      if(param=="/projects"){
       this.$store.commit("project/setAddTaskCount")
       }   
      if(param.includes("usertasks")){
      this.$store.commit("user/setAddTaskCount")
      }   
  },
    
    delete_UpdateLocalData(payload,param) {
      if(this.localData.length==1){
        this.$nuxt.$emit("refresh-table");
      }
      else {
        this.localData = this.localData.filter(obj => obj.id !== payload.id)
      }
      if(param=="/mytasks"){
          this.$store.commit("todo/setDeleteTaskCount")
        }
        if(param=="/tasks"){
          this.$store.commit("company/setDeleteTaskCount")
        }
        if(param.includes("usertasks")){
          this.$store.commit("user/setDeleteTaskCount")
        }
        if(param=="/projects"){
          this.$store.commit("project/setDeleteTaskCount")
        }
        if(param.includes("/projects/")){
          this.$store.commit("section/setDeleteTaskCount")
        }
    },
    
    edit_UpdateLocalData(payload) {
      this.localData = this.localData.map((items) => {
        if (items.id == payload.id) {
          return { ...items, ...payload };
        } else {
          return items;
        }
      });
      this.modifyDateFormat()
    },
  //   handleAddNewTask(payload) {
  //     console.log(payload)
  //   if (this.localData != null) {
  //     let temp = this.localData.filter((item) => item.id === payload.id);
  //     if (temp && temp.length) {
  //       return;
  //     } else {
  //       if (this.localData.length) {
  //         this.localData.push(payload);
  //       } else {
  //         this.$nuxt.$emit("refresh-table");
  //       }
  //     }
  //   } else {
  //     this.$nuxt.$emit("refresh-table");
  //   }
  // },
    parseDate(dateString, format) {
        return new Date(dateString);
    },
    formatDate(dateObj, format) {
        return dayjs(dateObj).format(format);
    },

    modifyDateFormat(){
      // console.log(this.localData)
      this.localData.map((task) => {
          task.dueDate = task.dueDate ? dayjs(task.dueDate).format(this.format) : null
          task.startDate = task.startDate ? dayjs(task.startDate).format(this.format) : null
          // console.log(task.title, " start",task.startDate, " due",task.dueDate)
          return task;
        }
      )
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
    titleClick(fieldEvent, item){
      this.unselectAll().then(r => {
        let elem = event.currentTarget.closest(".tr")
        elem.classList.add('active')
        // console.log(elem)
      })
      this.$emit(`${fieldEvent}`, item)
    },
    contextOpen($event, item) {
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.contextVisible = true
      this.activeItem = item
      this.$emit("context-open", item)
      $event.currentTarget.classList.add("active")
    },
    contextItemClick($event){
      this.$emit("context-item-event", $event, this.activeItem)
      this.unselectAll()
    },
    
    async unselectAll(event) {
      /*if (event) {
        let sidebar = event.target.closest("#side-panel-wrapper")
        // console.log(sidebar.classList.contains("side-panel"))
        if(sidebar.classList.contains("side-panel")){
          return false
        }
      }*/

      let rows = document.getElementsByClassName('tr');
      for (let row of rows) {
        row.classList.remove('active');
      }
      // this.newRow.show = false
      /*if (!this.newrowDisplay) {
        this.localNewrow.title = ""
      }*/
      this.localNewrow.title = ""
      this.localNewrow.sectionId = null
      this.newrowDisplay = false;
      this.contextVisible = false
      return 'success'
    },

    closePopups(id) {
      // this.contextVisible = false
      this.unselectAll()
      // console.log("this.$refs",this.$refs)
      if (id) {
        for (let ref in this.$refs) {
          if(ref != id && this.$refs[ref][0]) this.$refs[ref][0].show = false
        }
      }
    },

    newRowClick() {
      this.unselectAll().then(() => {
        this.newrowDisplay = true
        // console.log('click event after unselectAll')
      })
      process.nextTick(() => {
        this.$refs.newrowInput[0].focus()
      });
    },

    testCreateNewRow() {
      if (!this.localNewrow.title) {
        // console.warn("title is required")
        this.validTitle = "Title is required"
        return false
      }
      this.validTitle = false
      // console.info("valid input->", this.localNewrow.title)
      this.$emit("create-row", this.localNewrow)
      // this.localNewrow.title = ""
      // this.newrowDisplay = false
      process.nextTick(() => {
        this.unselectAll()
      });
    },  

    newRowCreate: _.debounce(function() {
      // console.log("here is blur event")
      if (!this.localNewrow.title) {
        // console.warn("title is required")
        this.validTitle = "Title is required"
        return false
      }
      this.validTitle = false
      // console.info("valid input->", this.localNewrow.title)
      this.$emit("create-row", this.localNewrow)
    }, 800),

    debounceTitle: _.debounce(function(value, item) {
      this.$emit("update-field", { id: item.id, field: "title", value: value, label: "Title", historyText: `Changed Title to ${value}`, item: item })
    }, 800),
    markComplete($event, item){
      // console.log($event, item.statusId)
      if (item.statusId == 5) {
          this.localData=this.localData.map((task)=>{
            if(task.id==item.id){
               return { ...task, statusId: 2, status:{id:2,text:'In-Progress'} };
            }
            else {
                return task
            } 
          })
       
        this.$emit("update-field", { id: item.id, field: "statusId", value: 2, label: "Status", historyText: "changed Status to Not Started" ,item: item} )
      } else {
        this.localData=this.localData.map((task)=>{
            if(task.id==item.id){
               return { ...task, statusId: 5, status:{id:5,text:'Done'} };
            }
            else {
                return task
            } 
          })
        this.$emit("update-field", { id: item.id, field: "statusId", value: 5, label: "Status", historyText: "changed Status to Done" ,item: item})
      }
    },
    updateStatus(status, item) {
      this.localData=this.localData.map((task)=>{
            if(task.id==item.id){
               return { ...task, statusId: status.value, status:{id:status.value,text:status.label}};
            }
            else {
                return task
            } 
          })
      this.$emit("update-field", { id: item.id, field: "statusId", value: status.value, label: "Status", historyText: `changed Status to ${status.label}`, item: item })
    },
    updatePriority(priority, item) {
      this.$emit("update-field", { id: item.id, field: "priorityId", value: priority.value, label: "Priority", historyText: `changed priority to ${priority.label}`, item: item })
    },
    updateDifficulty(difficulty, item) {
      this.$emit("update-field", { id: item.id, field: "difficultyId", value: difficulty.value, label: "Difficulty", historyText: `changed difficulty to ${difficulty.label}`, item: item })
    },
    updateDept(dept, item){
      this.$emit("update-field", { id: item.id, field: "departmentId", value: dept.value, label: "Department", historyText: `changed department to ${dept.label}`, item: item })
    },
    updateAssignee(user, item) { 
      this.$emit("update-field", { id: item.id, field: "userId", value: user.id, label: "Assignee", historyText: `changed Assignee to ${user.label}`, item: item })
    },
    updateDate(d, item, index, field, label) {
      // console.log(...arguments)
      let jd = new Date(d);

      if (field == "startDate" ) {

            let selectDueDate = new Date(d);
            let selectedDateUTC = new Date(Date.UTC(selectDueDate.getUTCFullYear(), selectDueDate.getUTCMonth(), selectDueDate.getUTCDate()));
            selectedDateUTC.setUTCHours(0, 0, 0, 0);

          if(!item.dueDate){
            this.$emit("update-field", { id: item.id, field, value: jd, label, historyText: `changed ${label} to ${dayjs(d).format(this.format)}`, item})
            return;
          }
       
            let DueDate = new Date(item.dueDate);
            let DueDateUTC = new Date(Date.UTC(DueDate.getUTCFullYear(), DueDate.getUTCMonth(), DueDate.getUTCDate()));
            DueDateUTC.setUTCHours(0, 0, 0, 0);

        if (item.dueDate &&selectedDateUTC.getTime() > DueDateUTC.getTime() ) {
          this.localData[index].startDate = this.tableData[index].startDate
          this.popupMessages.push({ text: "Start date should be before Due date", variant: "danger" });
          // this.popupMessages.push({ text: "Invalid Date", variant: "danger" });
          this.modifyDateFormat(this.localData)
        } else {
          // console.info("valid startDate" )
          this.$emit("update-field", { id: item.id, field, value: jd, label, historyText: `changed ${label} to ${dayjs(d).format(this.format)}`, item})
        }
      } else {

            
        if(!item.startDate) {
          this.$emit("update-field", { id: item.id, field, value: jd, label, historyText: `changed ${label} to ${dayjs(d).format(this.format)}`, item})
          return;
        }
        
            let selectDueDate = new Date(d);
            let selectedDateUTC = new Date(Date.UTC(selectDueDate.getUTCFullYear(), selectDueDate.getUTCMonth(), selectDueDate.getUTCDate()));
            selectedDateUTC.setUTCHours(0, 0, 0, 0);
            
            let startDueDate = new Date(item.startDate);
            let startDateUTC = new Date(Date.UTC(startDueDate.getUTCFullYear(), startDueDate.getUTCMonth(), startDueDate.getUTCDate()));
            startDateUTC.setUTCHours(0, 0, 0, 0);

        if (item.startDate && selectedDateUTC.getTime() < startDateUTC.getTime() ) {

          this.localData[index].dueDate = this.tableData[index].dueDate
          this.popupMessages.push({ text: "Due date should be after Start date", variant: "danger" });
          // this.popupMessages.push({ text: "Invalid Date", variant: "danger" });
          this.modifyDateFormat(this.localData)
        } else {
          // console.info("valid dueDate" )
          this.$emit("update-field", { id: item.id, field, value: jd, label, historyText: `changed ${label} to ${dayjs(d).format(this.format)}`, item})
        }
      }

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
  border-bottom: 1px solid $gray2;
  
  .split {
    display: flex;
    flex-direction: row;
    /*width: 100%;
    min-width: 100%;*/
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: $gray9;
    top: 0; z-index: 1;

    .splitcell {
      transition: width 50ms linear;
      will-change: width;

      &:nth-child(1) {
        background-color: $gray9;
        position: sticky;
        left:0;
        z-index: 2;
      }
    }
  }
  .split-indicator { width: 2px; background-color: $gray9; top: 0; bottom: 0; display: none; }

}

.adv-table {
  min-width: 100%;
  font-size: $base-size;
  .table {
    display: table;
    table-layout: fixed;
  }
  .thead,
  .tbody,
  .tfoot {
    display: table-row-group;
  }
  article {
    display: table-row-group;
  }

  .th,
  .td {
    display: table-cell;
    border-bottom: 1px solid $light;
    padding: 0.25rem;
    vertical-align: middle;
    min-width: min-content;
    white-space: nowrap;
    transition: width 50ms linear;
    will-change: width;

    &:not(:last-child) {
      border-right: 1px solid $light;
    }
  }

  .tr {
    display: table-row;
    .th:nth-child(1),
    .td:nth-child(1) {
      position: sticky;
      min-width: 2rem;
      left: 0;
      z-index: 1;
      background: #fff;
    }

    .th {
      background: $gray9;
      font-weight: bold;
      color: $secondary;
      padding: 0;
      border-bottom-color: $gray2;

      &:nth-child(2) {
        z-index: 5;
        background: $gray9;
      }
      &:not(:last-child) {
        border-right: 1px solid $gray8;
      }
    }
    &.hidden { visibility: hidden;
      .th { height: 2px; padding: 0;}
    }
    &:hover {
      .drag-handle {
        opacity: 1;
      }
      .td { background-color: rgba(lightgray, 0.15); }
    }
    &.active {
      /*background-color: $secondary-sub4;*/
      .td { background-color: $gray9; }
    }
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

  /*.sortable-chosen {
    .td { background-color: $success-sub6; }
    .td:nth-child(2) { background-color: $success-sub6; }
  }*/

  .new-button {
    padding-inline: 0.7rem;
    padding-block: 0.3rem;
    background-color: white;
    color: $primary-24;
    span { max-width: 0; overflow: hidden; transition: all 200ms ease-in; }
    
    &:hover {
      background-color: $primary-24-sub;
      color: white;
      span { max-width: 8rem; padding-left: 0.25rem; padding-right: 0.5rem; }
    }
    ::v-deep {
      .icon {
        svg { fill: $primary-24; }
      }
      &:hover {
        .icon {
          svg { fill: white;}
        }
      }
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
    background-color: transparent;

    &:hover {
      border-color: transparent;
    }
  }
}

#adv-table-th1.th {
  border-right: 1px solid #e3e3ea !important;
}

</style>
