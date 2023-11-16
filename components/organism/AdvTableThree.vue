<template>
  <div id="adv-table-wrapper" class="adv-table-wrapper position-relative" v-click-outside="unselectAll" @scroll="handleScroll" ref="myTable" :style="{minWidth: tableWidth+'px'}">

      <div :id="'advTableTwo-'+componentKey" class="adv-table position-relative bg-white" >
        <div class="table w-100 " ref="headrow" >
          <div class="tr " role="row" >
            <div v-if="drag && filterViews == 'all'" class="width-2 th" role="cell" ></div>
            <div v-for="(field, index) in tableFields" :key="field+index" class="th height-2" role="cell" :width="colSizes[index]+'%'" :style="{width: `calc(1.0045% * ${colSizes[index]})`}" :ref="'th'+field.key" :data-key="field.key" >
              <!-- <div class="align-center gap-05" >{{field.label}} <span v-if="field.header_icon" :id="'adv-table-header-icon'+index" class="height-1 cursor-pointer sortingtrigger" :data-event="field.header_icon.event" :data-key="field.key" @click="field.header_icon?.event ? $emit(field.header_icon.event, field.key) : null" >
                  <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'dark' : 'gray4'"></bib-icon>
                </span>
              </div> -->
            </div>
          </div>
          
          <template v-if="showNewsection">
            <div slot="header" class="tr position-relative height-205">
              <div class="position-absolute border-bottom-light" style="inset: 0; ">
                  <div class="section-header d-flex align-center gap-05 height-205 bg-white" >
                    <div v-show="drag&&filterViews=='all'" class="section-drag-handle width-2 h-100" ><bib-icon icon="drag" variant="gray5"></bib-icon>
                    </div>
                    <div class="position-sticky align-center gap-05" style="left: 0.5rem;" >
                      <bib-icon icon="arrow-down" :scale="0.5" style="transform: rotate(-90deg);" ></bib-icon> 
                      <span class="font-w-700 cursor-pointer " >
                        <input type="text" class="editable-input section-title" placeholder="Enter title..." ref="newsectioninput" @input="debounceNewSection($event.target.value, $event)" @blur="restoreField" />
                      </span>
                    </div>
                  </div>
                </div>
            </div>
          </template>
        </div>
        <draggable v-model="localData" class="sortable-list " @end="sectionDragend(localData)" >
          <section v-for="(section, groupIdx) in localData" :key="section.id" class="sortable w-100" >
            <div class="thead">
              
              <div class="tr hidden" role="row" >
                <div v-if="drag&&filterViews=='all'" class="width-2 th" role="cell" ></div>
                <div v-for="(field, index) in tableFields" :key="field+index" class="th" role="cell" :data-key="field.key" :style="{ width: colSizes[index]+'%'}" >
                </div>
              </div>

              <div class="tr position-relative height-205" role="row">
                <div class="position-absolute border-bottom-light" style="inset: 0; ">
                  <div class="section-header d-flex align-center gap-05 height-205 " >
                    <div v-show="drag&&filterViews=='all'" class="section-drag-handle width-2 h-100" ><bib-icon icon="drag" variant="gray5"></bib-icon>
                    </div>
                    <div class="position-sticky align-center" style="left: 0.5rem;" >
                      <span class="width-1 text-center cursor-pointer" @click.stop="collapseItem(section.id)">
                        <bib-icon icon="arrow-down" :scale="0.5" :ref="'collapseIcon'+section.id" ></bib-icon> 
                      </span>
                      <span class="font-w-700 cursor-pointer " v-if="editSection" >
                       {{ section.title }}
                      </span>
                      <span class="font-w-700 cursor-pointer " v-else >
                        <input type="text" class="editable-input section-title"  :value="section.title.includes('_section') ? 'Untitled section'
                      : section.title" @input="debounceRenameSection(section.id, $event)" @blur="restoreField" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
          </div>

            <draggable :class="sectionClass" tag="article" :list="section.tasks" :group="{ name: 'tasks' }" :data-section="section.id" :ref="'sectionContent' + section.id" @end="rowDragEnd">
              <div v-for="(item, itemIdx) in section.tasks" :key="item.id" ref="trdata" role="row" class="tr sortable drag-item" @click.stop="rowClick($event, item)" @click.right.prevent="contextOpen($event, item)">
                <div v-if="drag && filterViews == 'all'" class="td width-105" role="cell" >
                  <div class="drag-handle width-105 height-2" ><bib-icon icon="drag" variant="gray5"></bib-icon>
                  </div>
                </div>
                <div v-for="(field, index) in tableFields" :key="field+index" class="td" role="cell" >
                  <div v-if="field.key == 'title'" class="align-center w-100 pl-025">
                    <span v-if="field.icon" class="width-105 height-105 align-center justify-center" :class="{'cursor-pointer': field.icon.event}" @click.stop="markComplete($event, item)">
                      <bib-icon :icon="field.icon.icon" :scale="1.25" :variant="item.statusId == 5 ? 'success' : field.icon.variant" hover-variant="success-sub3"></bib-icon>
                    </span>
                    <span v-if="field.event" class=" flex-grow-1" style="line-height:1.25;">
                      <input type="text" class="editable-input" :value="item[field.key]" @focus="$nuxt.$emit('open-sidebar', item)"  @click.stop @input.stop="debounceTitle($event.target.value, item)" @keyup.esc="unselectAll">
                    </span>
                    <span v-else class="flex-grow-1">
                      {{item[field.key]}}
                    </span>
                    <span v-if="field.event" class="width-105 height-105 align-center justify-center flex-shrink-0 cursor-pointer bg-hover-light" @click.stop="titleClick(`${field.event}`, item)">
                      <bib-icon icon="arrow-right" variant="gray4" hover-variant="gray5"></bib-icon>
                    </span>
                  </div>
                  <template v-if="field.key == 'project'">
                    <div class="align-center height-2 w-100 text-wrap text-of-elipsis of-hidden">{{item[field.key]?.[0]?.project?.title}}</div>
                  </template>
                  <template v-if="field.key == 'userId'">
                    <lazy-user-select v-if="isLazy(groupIdx, itemIdx) || isRendered" :ref="'userSelect'+item.id" :userId="item[field.key]" @change="updateAssignee($event, item)" @close-other="closePopups('userSelect'+item.id)" ></lazy-user-select>
                    <skeleton-box v-else></skeleton-box>
                  </template>
                  <template v-if="field.key == 'status'">
                    <lazy-status-select v-if="isLazy(groupIdx, itemIdx) || isRendered" :ref="'statusSelect'+item.id" :key="'st-'+item.id" :status="item[field.key]" @change="updateStatus($event, item)" @close-other="closePopups('statusSelect'+item.id)"></lazy-status-select>
                    <skeleton-box v-else></skeleton-box>
                  </template>
                  <template v-if="field.key == 'priority'">
                    <lazy-priority-select v-if="isLazy(groupIdx, itemIdx) || isRendered" :ref="'prioritySelect'+item.id" :priority="item[field.key]" @change="updatePriority($event, item)" @close-other="closePopups('prioritySelect'+item.id)"></lazy-priority-select>
                    <skeleton-box v-else></skeleton-box>
                  </template>
                  <template v-if="field.key == 'difficultyId'">
                    <lazy-difficulty-select v-if="isLazy(groupIdx, itemIdx) || isRendered" :ref="'difficultySelect'+item.id" :difficulty="item[field.key]" @change="updateDifficulty($event, item)" @close-other="closePopups('difficultySelect'+item.id)"></lazy-difficulty-select>
                    <skeleton-box v-else></skeleton-box>
                  </template>
                  <template v-if="field.key == 'department'">
                    <lazy-dept-select v-if="isLazy(groupIdx, itemIdx) || isRendered" :ref="'deptSelect'+item.id" :dept="item[field.key]" @change="updateDept($event, item)" @close-other="closePopups('deptSelect'+item.id)"></lazy-dept-select>
                    <skeleton-box v-else></skeleton-box>
                  </template>
                  <template v-if="field.key == 'tag'">
                    <template v-if="item['TaskTags']?.length > 0">
                      <tag-comp :tags="item['TaskTags']"></tag-comp>
                    </template>
                  </template>
                  <template v-if="field.key == 'startDate'" >
                    <bib-datetime-picker v-if="isLazy(groupIdx, itemIdx) || isRendered" v-model="item[field.key]" variant="gray4" :format="format" :parseDate="parseDate" :formatDate="formatDate" placeholder="No date" @input="updateDate($event, item, field.key, field.label)" @click.native.stop></bib-datetime-picker>
                    <skeleton-box v-else></skeleton-box>
                  </template>
                  <template v-if="field.key == 'dueDate'" >
                    <bib-datetime-picker v-if="isLazy(groupIdx, itemIdx) || isRendered" v-model="item[field.key]" variant="gray4" :format="format" :parseDate="parseDate" :formatDate="formatDate" placeholder="No date" @input="updateDate($event, item, field.key, field.label)" @click.native.stop></bib-datetime-picker>
                    <skeleton-box v-else></skeleton-box>
                  </template>
                   
                </div>
              </div>

              <template v-if="plusButton" >
                <div v-show="localNewrow.sectionId != section.id" :key="'plusbtn'+akey" class="tr position-relative" role="row" >
                  <div v-if="drag && filterViews == 'all'" class="td width-2" role="cell" style="border-right-color: transparent;"></div>
                  <div class="td" role="cell" style="border-right-color: transparent; width: 360px;">
                    <div class="d-inline-flex align-center px-05 py-025 font-md cursor-pointer new-button shape-rounded" v-on:click.stop="newRowClick(section.id)">
                      <bib-icon :icon="plusButton.icon" variant="success" :scale="1.1" class=""></bib-icon> <span class="text-truncate">{{plusButton.label}}</span>
                    </div>
                  </div>
		              <div class="position-absolute" style="left:0; bottom:0; right:0; z-index:1; height: 1px; border-bottom: 1px solid var(--bib-light)"></div>
                </div>

                <div v-show="localNewrow.sectionId == section.id" :key="'plusinput'+akey" class="tr position-relative" role="row" >
                  <div v-if="drag && filterViews == 'all'" class="td text-center " role="cell">
                    <span class="d-inline-flex align-center justify-center width-105 h-100 bg-secondary-sub4 shape-rounded"><bib-icon icon="drag" variant="white"></bib-icon></span>
                  </div>
                  <div class="td" role="cell" style="border-right-color: transparent;">
                    <input type="text" :ref="'newrowInput'+section.id" class="editable-input" v-model="localNewrow.title" :class="{'error': validTitle}"  @blur="testNewRowCreate(section)" @keyup.esc="unselectAll" @keyup.enter="testCreateNewRow" required placeholder="Enter title...">
                  </div>
		              <div class="position-absolute" style="left:0; bottom:0; right:0; z-index:1; height: 1px; border-bottom: 1px solid var(--bib-light)"></div>
                </div>
              </template>

            </draggable>
          </section>
        </draggable>
        <div id="header_wrap" class="position-absolute header-wrap" >
            
          <div class="split position-sticky" >
            <div v-if="drag && filterViews == 'all'"  class="width-2 border-bottom-gray2" id="advtable-th-1" ></div>
            <div v-for="(field, index) in tableFields" class="splitcell border-bottom-gray2" :class="['splitcell'+componentKey]" :id="'split'+index+componentKey" :minwidth="field.minwidth" >
              <div class="align-center gap-05 height-2 px-05" :style="{'min-width': field.minWidth}" style="white-space: nowrap;">{{field.label}} <span v-if="field.header_icon" id="advtable-header-icon" class="height-1 cursor-pointer sortingtrigger" :data-event="field.header_icon.event" :data-key="field.key" @click="field.header_icon?.event ? $emit(field.header_icon.event, field.key) : null">
                  <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'dark' : 'gray4'"></bib-icon>
                </span>
              </div>
            </div>
            <div class="border-bottom-gray2"></div>
          </div>

          <div ref="splitHint" class="split-indicator h-100 position-absolute"></div>
        </div>
      </div>
    <template v-if="contextItems">
      <table-context-menu :items="contextItems" :show="contextVisible" :coordinates="popupCoords" @close-context="closePopups" @item-click="contextItemClick" ></table-context-menu>
    </template>
    
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Split from 'split.js'
import dayjs from 'dayjs'
import draggable from 'vuedraggable'

export default {

  name: 'AdvTableThree',
  components: {
    draggable,
  },
  props: {
    tableFields: { type: Array, required: true, default: () => [] },
    tableData: { type: Array, required: true, default: () => [] },
    filter:{ type: String, default: 'all' },
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
    lazyComponent: false,
    // isProject: { type: Boolean, default: false},
    
  },

  data() {
    return {
      // isCollapsed: false,
      contextVisible: false,
      popupCoords: { left: 0, top: 0 },
      activeItem: {},
      format: "D MMM YYYY",
      // highlight: false,
      validTitle: false,
      localData: [],
      newValue: [],
      localNewrow: {},
      akey: 0,
      itemsPerPage: 20,
      allDataDisplayed: false,
      previousIndex: { groupIdx: -1, curIdxInGroup: -1 },
      lastDisplayedIndex:{ groupIdx: -1, curIdxInGroup: -1},
      dataDisplayed: false, 
      available_tasks: [],
      showedCount: 0,
      loading:false,
      filterViews:"",
      isRendered: false,
      sectionClass:'section-content',
      testIsLoadingData: false,
      colIds: [],
      colSizes: [],
      colmw: [],
      tableWidth: "100%"
    }
  },
  watch: {
    newRow(newValue){
      // console.log(newValue.sectionId)
      // this.localNewrow = _.cloneDeep(this.newRow)
      this.localNewrow = newValue
    },
    filter:{
          immediate:true,
          handler(newValue){
            this.filterViews=_.cloneDeep(newValue)
          }
      },
    tableData: {
      immediate: true, // Execute the watcher immediately on component mount
      deep: true, // Watch for changes in nested properties of tableData
      handler(newValue) {
        // console.log(newValue)
        this.newValue=_.cloneDeep(newValue)
        newValue.forEach(ele => {
          if (this.$refs['sectionContent' + ele.id] === undefined || this.$refs['sectionContent' + ele.id]?.length === 0) { 
            return;
          }
          const el = this.$refs['sectionContent' + ele.id][0].$el;
          const icon = this.$refs['collapseIcon' + ele.id][0].$el;
          if (el.classList.contains('collapsed')) {
            el.classList.remove('collapsed');
            icon.style.transform = 'rotate(0deg)';
          }
        });
        this.$nextTick(() => {
          this.localData=[]
          // this.$refs.myTable.scrollTop=0
          this.lastDisplayedIndex={ groupIdx: -1, curIdxInGroup: -1}
          this.previousIndex={ groupIdx: -1, curIdxInGroup: -1 },

          this.showedCount=0
          this.available_tasks=[]
          this.allDataDisplayed=false
          this.showData();
        });
      },
    },
    
    /*tableFields(newValue){
      let nowidth = 0;
      let arr = newValue.map(w => (parseInt(w.width) / parseInt(this.tableWidth)) * 100 )
      // console.log(arr)
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

    showNewsection(newValue){
      process.nextTick(() => {
        if(newValue){
          this.$refs.newsectioninput.focus()
        }
      });
    },
    sectionClass(newValue) {
      if (newValue === "section-content collapsed") {
        this.$emit('sectionExpandedEvent', { sectionId: 1 })
      }
    },
    myTaskGroupBy(newValue){
      return _.cloneDeep(newValue)
    },
    taskGroupBy(newValue){
      return _.cloneDeep(newValue)
    },
    usertaskGroupBy(newValue){
      return _.cloneDeep(newValue)
    },
    singleProjectGroupBy(newValue){
      return _.cloneDeep(newValue)
    },
  },

  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      myTaskGroupBy:"todo/getGroupBy",
      projectGroupBy:"project/getGroupBy",  
      taskGroupBy:"task/getGroupBy",  
      usertaskGroupBy:"user/getGroupBy",  
      singleProjectGroupBy:"section/getGroupBy",  
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

    /*tableWidth() {
      const main = document.getElementById("main-content")
      // console.log(main.clientWidth, main.offsetWidth, main.scrollWidth)
      let w = main.scrollWidth - 18

      return w + "px"

    },*/

  },
  created() {
    // Register the listener for the "newTask" event
    this.$nuxt.$on("newTask", this.handleNewTask);
    this.$nuxt.$on("delete_update_table", this.delete_UpdateLocalData)
    this.$nuxt.$on("update_table", this.edit_UpdateLocalData)

  },
  mounted() {
    // this.localData=_.cloneDeep(this.tableData)

    // let nowidth = 0;
    // let nowidthIndex = [];
    this.tableWidth = this.tableFields.reduce((acc, curr) => curr.width + acc, 0)
    this.colSizes = this.tableFields.map(w => (parseInt(w.width) / parseInt(this.tableWidth)) * 100)
    // let colwidthArr = this.tableFields.map(w => (parseInt(w.width) / parseInt(this.tableWidth)) * 100 )
    // console.log(colwidthArr)
    
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

    Split(this.colIds, {
      sizes: this.colSizes,
      minSize: this.colmw,
      gutterSize: 6,
      snapOffset: 4,
      dragInterval: 5,
      onDragEnd: (sizes) => {
        this.colSizes = sizes
        // sessionStorage.setItem("cols"+pg, JSON.stringify(sizes))
      }
    })

    // const divHeight = this.$refs.myTable.clientHeight;
    // this.itemsPerPage = parseInt((divHeight - 40) / 40);
    this.$on('sectionExpandedEvent', (event) => {
      this.sectionShow(event.sectionId)
    })
  },

  beforeDestroy(){
    this.localData = []
    this.available_tasks = []
    this.activeItem = {}
    this.$nuxt.$off("delete_update_table", this.delete_UpdateLocalData)
    this.$nuxt.$off("update_table", this.edit_UpdateLocalData)
    this.$nuxt.$off("newTask", this.handleNewTask);
    
  },

  methods: {

    delete_UpdateLocalData(payload,param) {
      if(this.localData.reduce((acc, td) => acc + td.tasks.length, 0)==1){
        this.$nuxt.$emit("refresh-table");
      }
      else {
        this.localData = this.localData.map((items) => {
          const updatedTasks=items.tasks.filter(obj=>obj.id!==payload.id)
            return {...items,tasks:updatedTasks}
          });
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
    handleNewTask (payload,param){

  if (this.localData.length>0) {
    
        if(param=="/mytasks"){
            if(this.myTaskGroupBy=="") 
                {
                    if(this.localData?.[0]?.tasks.length>0)
                    {
                      this.localData[0].tasks.push(payload);
                      
                    }
                    else
                    {
                      this.$nuxt.$emit("refresh-table");
                      
                    }
                    this.$store.commit("todo/setAddTaskCount")
            
                }
                else 
                {
                    this.changeIntoGroupBy(payload,this.myTaskGroupBy)
                    this.$store.commit("todo/setAddTaskCount")
                }
        }
       if(param=="/tasks"){
       this.changeIntoGroupBy(payload,this.taskGroupBy)
       this.$store.commit("company/setAddTaskCount")
       }   
       if(param.includes("usertasks")){
       this.changeIntoGroupBy(payload,this.usertaskGroupBy)
       this.$store.commit("user/setAddTaskCount")
       }   
       if(param=="/projects"){
       this.changeIntoGroupBy(payload,this.projectGroupBy)
       this.$store.commit("project/setAddTaskCount")
       }   
       if(param.includes("/projects/")){
        if(this.singleProjectGroupBy=="") 
                {
                  if(this.localData.length>=0){
                      let exist_item= this.localData.find((item)=>item.title=="_section32")
                      if(exist_item) {
                        let index = this.localData.findIndex((item) => item.title == "_section32");
                        this.localData[index].tasks.push(payload);
                      }
                      else {
                        this.$nuxt.$emit("refresh-table");
                    // this.$store.commit("section/setAddTaskCount")

                      }
                  }
                    else
                    {
                      this.$nuxt.$emit("refresh-table");
                    }
                    this.$store.commit("section/setAddTaskCount")
                }
                else 
                {
                  this.changeIntoGroupBy(payload,this.singleProjectGroupBy)
                  this.$store.commit("section/setAddTaskCount")
                }

       
       }  
      //  if (param)
  }
  else 
  {
    this.$nuxt.$emit("refresh-table");
    // this.$store.commit("todo/setAddTaskCount")
  }

// Remove the listener after handling the event

},
    changeIntoGroupBy (payload,groupBy) {
        if (this.localData?.[0]?.tasks?.length>0)
        {
          //To groupBy, change the localData
          this.localData = this.localData.reduce((acc, ele) => {
            return [...acc, ...ele.tasks];
          }, []);
          //insert the newTask
          if (!this.localData.some(item => item.id === payload.id)) {
            this.localData.push(payload);
          }
          //change the localData into groupBy
          this.localData=this.$groupBy( this.localData,groupBy)
         
        } 
        else 
        {
          this.$nuxt.$emit("refresh-table");
        }  
    },
    edit_UpdateLocalData(payload) {
          if (this.localData !== null) {
          this.localData = this.localData.map((items) => {
            const updatedTasks = items.tasks.map((task) => {
              if (task.id == payload.id) {
                return { ...task, ...payload };
              } else {
                return task;
              }
            });
            return { ...items, tasks: updatedTasks };
          });
        }
    },

    modifyDateFormat(value){
     value.map((item) => {
          item.tasks?.forEach((items)=>{
            items.dueDate = items.dueDate ? dayjs(items.dueDate).format(this.format) : null
              items.startDate = items.startDate ? dayjs(items.startDate).format(this.format) : null
              return items
          })
        }
      )
      return value

    },
    isLazy(groupIdx, itemIdx) {
      if (groupIdx > this.previousIndex.groupIdx || (itemIdx > this.previousIndex.curIdxInGroup && groupIdx === this.previousIndex.groupIdx) ) {
        return false;
      }
      return true;
    },
    handleScroll(event) {
      const tableContainer = event.target;
      if (this.allDataDisplayed) {
        return; // Stop adding data if all data has been displayed
      }
      const scrollPercentage = (tableContainer.scrollTop + tableContainer.clientHeight) / tableContainer.scrollHeight;
      if (scrollPercentage >= 0.7 ) {

          if (this.testIsLoadingData) return;
            this.testIsLoadingData = true;
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve('Changed successfully!');
              }, 1500);
            }).then(() => {
              this.showData();
            this.testIsLoadingData = false;
            });

          }

    },
    showData() {
      
      let allTasks = this.newValue.length > 0 ? [...this.newValue] : [...this.tableData];
      allTasks=this.modifyDateFormat(allTasks)
      let remainingCount = this.itemsPerPage;
      let start = this.lastDisplayedIndex.curIdxInGroup;
      this.showedCount += remainingCount;
      let i;
      for (i = start === -1 ? this.lastDisplayedIndex.groupIdx + 1 : this.lastDisplayedIndex.groupIdx; i < allTasks.length; ++ i) {
        if (start === -1) {
        
          if (remainingCount < allTasks[i].tasks?.length - start - 1) {
            
            this.localData.push({});
            for (const [key, value] of Object.entries(allTasks[i])) {
              if (key !== 'tasks') { 
                this.localData[i][key] = value;
              }
            }
            this.localData[i].tasks = allTasks[i].tasks.slice(start + 1, start + remainingCount + 1);
            this.available_tasks[allTasks[i].title] = allTasks[i].tasks.slice(start + 1, start + remainingCount + 1);
            start += remainingCount;
            remainingCount = 0;
          } else {
            this.localData.push(allTasks[i])
            this.available_tasks[allTasks[i].title] = allTasks[i].tasks;
            remainingCount -= allTasks[i].tasks?.length;
            start = -1;
          }
        }
        else {

            let tmp = {};
            if (start + remainingCount + 1 <=allTasks[i].tasks?.length) {
              Object.assign(tmp, this.localData[i])

              tmp.tasks.push(...allTasks[i].tasks.slice(start + 1, start + remainingCount + 1))
              this.available_tasks[allTasks[i].title] = tmp.tasks;
              this.localData.length -= 1;
              this.localData.push(tmp)
              start += remainingCount;
              remainingCount = 0;
            } else {
              Object.assign(tmp, this.localData[i])
              // console.log(tmp)
              // console.log(allTasks[i])
              tmp.tasks.push(...allTasks[i].tasks.slice(start + 1, allTasks[i].tasks?.length))
              this.available_tasks[allTasks[i].title] = tmp.tasks;
              this.localData.length -= 1;
              this.localData.push(tmp)
              remainingCount -= (allTasks[i].tasks?.length - start - 1);
              start = -1;
            }

        }
        if (remainingCount == 0) break;

      }
      if(!this.allDataDisplayed){
        this.isRendered = false;
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve('Changed successfully!');
          }, 100)
        }).then(() => {
          this.isRendered = true;
        });
      }
    
      if (i >= allTasks.length - 1 && start === -1) 
      {
        this.allDataDisplayed = true;
        this.lastDisplayedIndex.groupIdx = -1;
        this.lastDisplayedIndex.curIdxInGroup = -1;
        return 
      }

      Object.assign(this.previousIndex, this.lastDisplayedIndex);
      this.lastDisplayedIndex.groupIdx = i;
      this.lastDisplayedIndex.curIdxInGroup = start;
      
    },
    

    parseDate(dateString, format) {
        return new Date(dateString)
    },
    formatDate(dateObj, format) {
        return dayjs(dateObj).format(format);
    },
    startdateValid(date, duedate){
      // console.log(...arguments)
      const maxDate = new Date(duedate)
      return date < maxDate
      
    },
    duedateValid(date, startdate) {
      // console.log(...arguments)
      // const minDate = new Date(startdate)
      const minDate = new Date(startdate);
      // const maxDate = new Date("2023-06-30");
      return date < minDate.setDate(minDate.getDate() - 1);
      
    },
    sectionShow(sectionId){
      // let elem = this.$refs['sectionContent'+sectionId][0].$el
      // let icon = event.currentTarget.children[0]
          const collapsedSection = this.newValue.find(ele => ele.id === sectionId);
        

        this.showedCount -= this.available_tasks[collapsedSection.title].length
        if (this.available_tasks[collapsedSection.title].length !== collapsedSection.tasks.length) {
          const groupIdx = this.lastDisplayedIndex.groupIdx;
          let tmp = {};
          Object.assign(tmp, this.localData[groupIdx])
          tmp.tasks.push(...this.newValue[groupIdx].tasks.slice(this.lastDisplayedIndex.curIdxInGroup + 1, this.newValue[groupIdx].tasks?.length))
          this.available_tasks[this.newValue[groupIdx].title] = tmp.tasks;
          this.localData.length -= 1;
          this.localData.push(tmp)
          this.lastDisplayedIndex.curIdxInGroup = -1;
        }
        if (this.showedCount < this.itemsPerPage) {
          if (this.lastDisplayedIndex.groupIdx === this.newValue.length - 1) {
            this.allDataDisplayed = true;
            return;
          }
          if (this.allDataDisplayed ) {
            return; // Stop adding data if all data has been displayed
          }
          this.showData();

        }
        // this.$forceUpdate()
    },

    collapseItem(sectionId) {
      let elem = this.$refs['sectionContent'+sectionId][0].$el
      let icon = event.currentTarget.children[0]
      elem.classList.toggle("collapsed")
      if (elem.classList.contains("collapsed")) {
        icon.style.transform = 'rotate(-90deg)'
        setTimeout(() => {
          this.$emit('sectionExpandedEvent', { sectionId: sectionId })
        }, 0)
      } else {
        icon.style.transform = 'rotate(0deg)'
        const collapsedSection = this.newValue.find(ele => ele.id === sectionId);
        this.showedCount += this.available_tasks[collapsedSection.title].length
      }

    },

    sectionDragend(newValue){
      // console.log(newValue)
      this.$emit('section-dragend', newValue)
    },
    
    rowDragEnd(e) {
      // this.highlight = false;
      let sectionData = this.localData.filter(
        (s) => s.id == e.to.dataset.section
      );

      // console.log("row dragend ", e, sectionData)
      this.$emit("row-dragend", {
        [this.tasksKey]: sectionData[0][this.tasksKey],
        sectionId: e.to.dataset.section,
      });
    },
    
    rowClick($event, item) {
      // console.log($event.target)
      this.unselectAll()
        // .then(r => {
          $event.currentTarget.classList.add("active")
        // })
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
      if (!this.localNewrow.show) {
        this.localNewrow.title = ""
      }
      this.localNewrow.show = false;
      this.akey+=1
      this.$emit("toggle-newsection", 'hide') //send any string to hide
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

    testNewRowCreate(section) {
      if (!this.localNewrow.title) {
        // console.warn("title is required")
        this.validTitle = "alert"
        return false
      }
      this.validTitle = ""
      // console.info("valid input->", this.localNewrow.title)
      this.$emit("create-row", this.localNewrow, section)
      this.localNewrow.title = ""
    },

    newRowCreate: _.debounce(function(section) {
      // console.table([this.newRow.sectionId, this.newRow.title]);
      if (!this.localNewrow.title) {
        // console.warn("title is required")
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
       this.localData= this.localData.map((items)=>{
          const updateTasks=items.tasks.map((task)=>{
            if(task.id==item.id){
               return { ...task, statusId: 2, status:{id:2,text:'In-Progress'} };
            }
            else {
                return task
            } 
          })
          return { ...items, tasks: updateTasks };
        })
        this.$emit("update-field", { id: item.id, field: "statusId", value: 2, label: "Status", historyText: "changed Status to Not Started" ,item})
      } else {
        this.localData= this.localData.map((items)=>{
          const updateTasks=items.tasks.map((task)=>{
            if(task.id==item.id){
               return { ...task, statusId: 5 ,status:{id:5,text:'Done'}};
            }
            else {
                return task
            } 
          })
          return { ...items, tasks: updateTasks };
        })
        this.$emit("update-field", { id: item.id, field: "statusId", value: 5, label: "Status", historyText: "changed Status to Done",item })
      }
    },
    updateStatus(status, item) {
      this.localData= this.localData.map((items)=>{
          const updateTasks=items.tasks.map((task)=>{
            if(task.id==item.id){
               return { ...task, statusId: status.value, status:{id:status.value,text:status.label}};
            }
            else {
                return task
            } 
          })
          return { ...items, tasks: updateTasks };
        })
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
      this.$emit("update-field", { id: item.id, field, value: new Date(d), label, historyText: `Changed ${label} to ${dayjs(d).format('D MMM YYYY')}`, item: item})
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

/*
*::-webkit-scrollbar {
  width: thin;
  height: thin;
}

::-webkit-scrollbar {
  width: thin;
  height: thin;
}
*/

.adv-table-wrapper {
  overflow: auto;
  height: 100%;
  
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

.table { display: table; table-layout: fixed; }
.adv-table {
  min-width: 100%;
  font-size: $base-size;
  
  section { display: table; table-layout: fixed; }
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
    transition: width 50ms linear;
    will-change: width;

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
      z-index: 1;
      background: #fff;
    }
    &.hidden { visibility: hidden;
      .th { height: 2px; padding: 0;}
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
    &:hover {
      .drag-handle {
        opacity: 1;
      }
      .td { background-color: rgba(lightgray, 0.15); }
    }
    &.active {
      /*background-color: $secondary-sub3;*/
      .td { background-color: $gray9; }
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
    &.collapsed { /*height: 0; overflow: hidden;*/ /*visibility: hidden;*/ display: none; }
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
