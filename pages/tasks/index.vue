<template>
  <client-only>
    <div id="page" class="task-page-wrapper">
      <page-title title="Tasks"></page-title>
      <!-- <page-title title="Tasks" :count="tasksCount"></page-title> -->
      <company-tasks-actions
        :gridType="gridType"
        v-on:filterView="filterView"
        @taskSortValue="sortBy($event)"
        @taskGroupValue="taskGroup($event)"
        v-on:new-task="toggleSidebar($event)"
        @change-grid-type="($event) => (gridType = $event)"
        @search-tasks="searchTasks"
      ></company-tasks-actions>
      <div id="task-table-wrapper" class="task-table-wrapper position-relative overflow-y-auto" :class="{ 'bg-light': gridType != 'list' }" :style="{ 'width': contentWidth }">

          <div v-if="gridType === 'list'" class="h-100">
            <!-- <template v-if="!showPlaceholder"> -->
              
              <adv-table-three :tableFields="taskFields" :tableData="localData" :plusButton="plusButton" :contextItems="contextMenuItems" @context-open="contextOpen" @context-item-event="contextItemClick" @table-sort="sortBy" @row-click="openSidebar" @title-click="openSidebar" @update-field="updateTask" @section-dragend="sectionDragEnd" @row-dragend="taskDragEnd" :newRow="newRow" @create-row="createNewTask" :drag="dragTable" :key="templateKey" :editSection="group" :lazyComponent="lazyComponent" :filter="filterViews"></adv-table-three>
          
          </div>
        
          <div v-if="gridType == 'grid'" class="h-100">
            <task-grid-section
              :sections="localData"
              :activeTask="activeTask"
              :templateKey="key"
              v-on:update-key="updateKey"
              v-on:create-task="toggleSidebar($event)"
              v-on:set-favorite="taskSetFavorite"
              v-on:mark-complete="taskMarkComplete"
              v-on:delete-task="deleteTask"
              @section-dragend="sectionDragEnd"
              @task-dragend="taskDragEnd"
              sectionType="department"
            >
            </task-grid-section>
          </div>

        <!-- user-picker for board view -->
        <user-picker
          :show="userPickerOpen"
          :coordinates="popupCoords"
          @selected="
            updateAssignee('Assignee', 'userId', $event.id, $event.label)
          "
          @close="userPickerOpen = false"
        ></user-picker>

        <!-- date-picker for board view -->
        <inline-datepicker
          :show="datePickerOpen"
          :datetime="activeTask[datepickerArgs.field]"
          :coordinates="popupCoords"
          @date-updated="updateDate"
          @close="datePickerOpen = false"
        ></inline-datepicker>

        <loading :loading="loading"></loading>
        <!-- popup notification -->
        <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification
              v-for="(msg, index) in popupMessages"
              :key="index"
              :message="msg.text"
              :variant="msg.variant"
            >
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>
        <alert-dialog
          v-show="alertDialog"
          :message="alertMsg"
          @close="alertDialog = false"
        ></alert-dialog>
      </div>
    </div>
  </client-only>
</template>

<script>
import { mapGetters } from "vuex";
import { COMPANY_TASK_FIELDS, TASK_CONTEXT_MENU } from "../../config/constants";
import dayjs from "dayjs";
import { unsecuredCopyToClipboard } from "~/utils/copy-util.js";
import _ from "lodash";

export default {
  name: "Tasks",
  data() {
    return {
      title: "Tasks",
      gridType: "list",
      taskFields: COMPANY_TASK_FIELDS,
      taskContextMenu: false,
      activeTask: {},
      taskToDelete: {},
      contextMenuItems: TASK_CONTEXT_MENU,
      loading: false,
      flag: false,
      viewName: "all",
      orderBy: "desc",
      key: 99,
      templateKey: 0,
      sortName: "",
      popupMessages: [],
      popupCoords: {},
      userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: "" },
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
      alertDialog: false,
      alertMsg: "",
      localData: [],
      localData2: [],
      lazyComponent: false,
      plusButton: {
        show: true,
        label: "New Task",
        icon: "add",
      },
      group:"department",
      newRow: {
        show: false,
        id: "",
        sectionId: "",
        title: "",
        userId: "",
        statusId: null,
        priorityId: null,
        startDate: "",
        dueDate: "",
        departmentId: null,
        description: "",
        budget: "",
        text: "",
      },
      contentWidth: "100%",
      dragTable: true,
      showPlaceholder: false,

    };
  },
  computed: {
    ...mapGetters({
      tasks: "company/getCompanyTasks",
      teamMembers: "user/getTeamMembers",
      filterViews :'task/getFilterView',
      sidebar: "task/getSidebarVisible",
      grid:"task/getGridType"
    }),
  
  },

  watch: {
    filterViews(newValue){
         return _.cloneDeep(newValue)
    },
    tasks(newVal) {
      let data = _.cloneDeep(newVal);
      this.localData = data
    },
    gridType() {
      this.$store.commit('task/gridType',{gridType:this.gridType})
      this.key++;
    },
    sidebar(newVal){
      const page = document.getElementById("page")
      this.$nextTick(() => {
        const panel = document.getElementById("side-panel-wrapper")
        if (this.sidebar) {
          this.contentWidth = (page.scrollWidth - panel.offsetWidth) + 'px'
        } else {
          this.contentWidth = '100%'
        }
      });
    }
  },

  async asyncData({$axios, app,store}){

    const token = app.$cookies.get(process.env.SSO_COOKIE_NAME)
    const filter=store.getters['task/getFilterView']
    const res = await $axios.get(`company/tasks/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Filter': filter
      }
    })
    let data=res.data.data
   await data.map(item=>{
      if(item.id){
        return item
      }
      else {
        item['id']=res.data.length
        return item
      }
    })
    
    store.dispatch('company/setCompanyTasks', data)
    return { localData: data}

  },

  created() {
    if (process.client) {
      this.$nuxt.$on("update-key", (msg) => {
        this.updateKey()
      });

      this.$nuxt.$on("user-picker", (payload) => {
        // emitted from <task-grid>
        this.showUserPicker(payload);
      });
      this.$nuxt.$on("date-picker", (payload) => {
        // emitted from <task-grid>
        this.showDatePicker(payload);
      });
    }
  },

  mounted() {

  if(process.client) {

    if (JSON.parse(localStorage.getItem("user")).subr != "ADMIN") {
      this.$router.push('/error/403')    
    } 

    for(let field of this.taskFields) {
      if(field.header_icon) {
        field.header_icon.isActive = false;
      }
    }
    this.$store.dispatch("company/fetchInitialCompanyTasks",{filter:'all'})
      this.$nuxt.$on("close-sidebar", (msg) => {
        this.updateKey()
      });
      setTimeout(() => {
        this.gridType=this.grid
      }, 300);
  }
  
  },

  methods: {
    

    showUserPicker(payload) {
      this.closeAllPickers();
      this.userPickerOpen = true;
      this.popupCoords = {
        left: event.clientX + "px",
        top: event.clientY + "px",
      };
      this.activeTask = payload.task;
    },
    showDatePicker(payload) {
      // payload consists of event, task, label, field
      this.closeAllPickers();
      this.datePickerOpen = true;
      this.popupCoords = {
        left: event.clientX + "px",
        top: event.clientY + "px",
      };
      this.activeTask = payload.task;
      this.datepickerArgs.field = payload.field || "dueDate";
      this.datepickerArgs.label = payload.label || "Due date";
    },
    
    closeAllPickers() {
      this.taskContextMenu = false;
      this.userPickerOpen = false;
      this.datePickerOpen = false;
      this.activeTask = {};
    },
    contextOpen(item){
      if(this.$CheckFavTask(item.id)){
       this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Add to Favorites" ? { ...item, label: "Remove favorite"} : item);
      }
      else{
        this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Remove favorite" ? { ...item, label: "Add to Favorites"} : item);
      }
      if(item.statusId==5){
       this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Mark Complete" ? { ...item, label: "Completed"} : item);
      }
      else {
         this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Completed" ? { ...item, label: "Mark Complete"} : item);
      }
      this.$store.dispatch("task/setSingleTask", item)
    },
    updateKey(value) {
      if (value) {
        this.popupMessages.push({ text: value, variant: "success" });
      }
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store
        .dispatch("company/fetchCompanyTasks", {
          companyId: compid,
          filter:this.filterViews,
          sName:this.group
        })
        .then(() => {
          this.key += 1;
          this.templateKey++;
        });
       
    },

    openSidebar(task, scroll) {
      let fwd = this.$donotCloseSidebar(event.target.classList);
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false;
      }
      this.$nuxt.$emit("open-sidebar", { ...task, scrollId: scroll });
    },

    closeContext() {
      this.taskContextMenu = false;
      this.activeTask = {};
    },

    contextItemClick(key, item) {
      switch (key) {
        case "done-task":
          this.taskMarkComplete(item);
          break;
        case "fav-task":
          this.taskSetFavorite(item);
          break;
        case "delete-task":
          this.deleteTask(item);
          break;
        case "copy-task":
          this.copyTaskLink(item);
          break;
        case "gotoTeam":
          this.$nuxt.$emit("add-member-to-task");
          break;
        case "gotoComment":
          this.openSidebar(item, "task_conversation");
          break;
        case "gotoSubtask":
          this.openSidebar(item, "task_subtasks");
          break;
        case "gotoFiles":
          this.openSidebar(item, "task_files");
          break;
        default:
          this.alertDialog = true;
          this.alertMsg = "No task assigned";
          break;
      }
    },

    updateTask(payload) {
      let user, projectId;
      let data = { [payload.field]: payload.value }

      if (payload.field == "userId" && payload.value != "") {
        user = this.teamMembers.find((t) => t.id == payload.value);
      } else {
        user = null;
      }
 
      if (payload.item.project && payload.item.project?.length > 0) {
        projectId = payload.item.project[0].project.id || payload.item.project[0].project.id;
      } else {
        projectId = null;
      }

      if (payload.field == "statusId" && payload.value == 0) {
        data = { [payload.field]: null};
      }

      if (payload.field == "priorityId" && payload.value == 0) {
        data = { [payload.field]: null};
      }
    
      if(payload.field == "dueDate" && payload.item.startDate){
        if(payload.value=="Invalid Date"){
          data = { [payload.field]: null }
        }else {
          if(new Date(payload.value).getTime() > new Date(payload.item.startDate).getTime()){
          data = { [payload.field]: payload.value }
        } else{
          data = { [payload.field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey()
          return false
        }
        }
  
      }
      if(payload.field == "startDate" && payload.item.dueDate){
        if(payload.value=="Invalid Date"){
          data = { [payload.field]: null }
        }else {
            if(new Date(payload.value).getTime() < new Date(payload.item.dueDate).getTime()){
            data = { [payload.field]: payload.value }
          } else {
            data = { [payload.field]: null }
            this.popupMessages.push({ text: "Invalid date", variant: "danger" });
            this.updateKey()
            return false
          }
        }
      }
      
      this.$store
        .dispatch("task/updateTask", {
          id: payload.item.id,
          projectId,
          data: data,
          user: user ? [user] : null,
          text: payload.historyText,
        })
        .then((t) => {
          this.updateKey()
        })
        .catch((e) => console.warn(e));
    },

    updateAssignee(label, field, value, historyText) {
      let user;
      if (field == "userId" && value != "") {
        user = this.teamMembers.filter((t) => t.id == value);
      } else {
        user = null;
      }
      this.userPickerOpen = false;

      this.$store
        .dispatch("task/updateTask", {
          id: this.activeTask.id,
          data: { [field]: value },
          user: user ? user : null,
          text: `changed ${label} to ${historyText}`,
        })
        .then((t) => {
            this.updateKey("success")
        })
        .catch((e) => console.warn(e));
    },

    updateDate(value) {
      if(this.datepickerArgs.field==="dueDate")
        {
          if(new Date(value).toISOString().slice(0, 10)>new Date(this.activeTask.startDate).toISOString().slice(0, 10))
            {
                this.changeDate(value)
            }
            else{
              this.popupMessages.push({ text: "Invalid date", variant: "danger" });
            }
        }
        else
        {
          if(new Date(value).toISOString().slice(0, 10)<new Date(this.activeTask.dueDate).toISOString().slice(0, 10))
            {
                this.changeDate(value)
            }
            else {
              this.popupMessages.push({ text: "Invalid date", variant: "danger" });
            }
          
        }
        
      
    },

    changeDate(value){
        let newDate = dayjs(value).format("D MMM YYYY");
          this.$store
            .dispatch("task/updateTask", {
              id: this.activeTask.id,
              data: { [this.datepickerArgs.field]: value },
              user: null,
              text: `changed ${this.datepickerArgs.label} to ${newDate}`,
            })
            .then((t) => {
                this.updateKey();
            })
            .catch((e) => console.warn(e));
    },

    taskSetFavorite(task) {
      this.loading = true;
      if(this.$CheckFavTask(task.id)){
        this.$store
          .dispatch("task/removeFromFavorite", { id: task.id })
          .then((msg) => {
            this.updateKey("Removed from favorites");
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.warn("fav-task->", e);
          });
      } else {
        this.$store
          .dispatch("task/addToFavorite", { id: task.id })
          .then((msg) => {
            this.updateKey("Added to favorites");
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.warn("fav-task->", e);
          });
      }
    },

    taskMarkComplete(task) {
      if (typeof task == "object" && Object.keys(task).length > 0) {
        console.log(task);
      } else {
        task = this.activeTask;
      }
      this.$store
        .dispatch("task/updateTaskStatus", task)
        .then((d) => {
          this.$store.dispatch("task/setSingleTask", d).then(() => {
            this.updateKey("success");
          });
        })
        .catch((e) => {
          console.warn(e);
        });
    },

    deleteTask(task) {
      if (task) {
        this.$store
          .dispatch("task/deleteTask", task)
          .then((t) => {
            if (t.statusCode == 200) {
              
              this.updateKey(t.message);
            } else {
              this.popupMessages.push({ text: t.message, variant: "orange" });
              console.warn(t.message);
            }
          })
          .catch((e) => {
            console.warn(e);
          });
      } else {
        this.popupMessages.push({
          text: "Action cancelled",
          variant: "orange",
        });
      }
    },

    async filterView($event) {
      this.$store.commit('task/setFilterView', {filter:$event})
      this.$store.commit("company/getFilterTasks",{filter:$event, groupBy:this.group})
    },

    checkActive() {
      for (let i = 0; i < this.taskFields.length; i++) {
        if (this.taskFields[i].header_icon) {
          this.taskFields[i].header_icon.isActive = false;
        }

        if (
          this.taskFields[i].header_icon &&
          this.taskFields[i].key == this.sortName
        ) {
          this.taskFields[i].header_icon.isActive = true;
        }
      }
      this.templateKey++;
    },
    //group by
    taskGroup($event) {
      this.group = $event
      this.lazyComponent = false
      if($event != 'default') {
        this.dragTable = false;
      } else {
        this.group='department'
        this.dragTable = true;
        this.$store.commit('company/groupTasks',{sName:"department"})
        return;
      }
      this.lazyComponent = true
      this.$store.commit('company/groupTasks',{sName:this.group})
      },
    // Sort By Action List
    sortBy($event) {
      this.sortName = $event;
      if ($event == "title") {
        this.$store
          .dispatch("company/sortCompanyTasks", {
            sName: $event,
            order: this.orderBy,
          })
      }

      if ($event == "userId") {
        this.$store
          .dispatch("company/sortCompanyTasks", {
            sName: $event,
            order: this.orderBy,
          })
      }

      if ($event == "project") {
        this.$store
          .dispatch("company/sortCompanyTasks", {
            sName: $event,
            order: this.orderBy,
          })
      }
      if ($event == "department") {
        this.$store
          .dispatch("company/sortCompanyTasks", {
            sName: $event,
            order: this.orderBy,
          })
      }
      if ($event == "difficultyId") {
        this.$store
          .dispatch("company/sortCompanyTasks", {
            sName: $event,
            order: this.orderBy,
          })
      }

      if ($event == "status") {
        this.$store
          .dispatch("company/sortCompanyTasks", {
            sName: $event,
            order: this.orderBy,
          })
      }

      if ($event == "priority") {
        this.$store
          .dispatch("company/sortCompanyTasks", {
            sName: $event,
            order: this.orderBy,
          })
      }

      if ($event == "startDate") {
        this.$store
          .dispatch("company/sortCompanyTasks", {
            sName: $event,
            order: this.orderBy,
          })
      }

      if ($event == "dueDate") {
        this.$store
          .dispatch("company/sortCompanyTasks", {
            sName: $event,
            order: this.orderBy,
          })
      }

      if (this.orderBy == "asc") {
        this.orderBy = "desc";
      } else {
        this.orderBy = "asc";
      }

      this.checkActive();
      this.key += 1;
    },

    toggleSidebar($event) {
      this.flag = !this.flag;
      if ($event.id) {
        this.$nuxt.$emit("open-sidebar", $event.id);
      } else {
        this.$nuxt.$emit("open-sidebar", { department: $event });
      }
    },

    copyTaskLink(task) {
      let url = window.location.host + `/tasks/${task.id}`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
      } else {
        unsecuredCopyToClipboard(url);
      }
    },

    searchTasks(text) {
      let formattedText = text.toLowerCase().trim();

      let depts = JSON.parse(JSON.stringify(this.tasks));

     

      let newArr = depts.map((d) => {
        let filtered = d.tasks.filter((t) => {
          if (t.title.includes(formattedText) || t.title.toLowerCase().includes(formattedText)) {
            return t;
          }
        });

        d["tasks"] = filtered;
        return d;
      });

      if (newArr.length >= 0) {
        this.localData = newArr;
        this.key++;
      } else {
        this.localData = JSON.parse(JSON.stringify(this.tasks));
        this.key++;
      }
    },

    sectionDragEnd: _.debounce(async function (payload) {
      // this.loading = true;

      let clone = _.cloneDeep(payload);
      clone.forEach((el, i) => {
        el.order = i;
      });

      console.log(clone)
      // this.$store.dispatch("company/setCompanyTasks",{data:clone})

      let sectionDnD = await this.$axios.$put(
        "/department/dragdrop",
        { data: clone },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          },
        }
      );
      // if (sectionDnD.statusCode == 200) {
      //   this.updateKey()
      // }

      // this.loading = false;
    }, 600),

    taskDragEnd: _.debounce(async function (payload) {
      this.loading = true;
      let tasks = _.cloneDeep(payload.tasks);

      tasks.forEach((el, i) => {
        el.dOrder = i;
      });

      let taskDnD = await this.$axios.$put(
        "/department/crossDepartmentDragDrop",
        { data: tasks, departmentId: payload.sectionId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          },
        }
      );
      if (taskDnD.statusCode == 200) {
        this.updateKey();
      } else {
        console.warn(taskDnD.message);
      }
      this.loading = false;
    }, 600),

    createNewTask(task,section) {
      task.group = this.group;
          task.status = null
          task.statusId = null
          task.priority = null
          task.priorityId = null
          task.departmentId = null;
          task.department = null;
          task.user = null
          task.userId = null
          task.projectId = null
      
      if(this.group == "priority"){
        task.priority = section.tasks[0]?.priority
        task.priorityId = section.tasks[0]?.priorityId
     
      }
      if(this.group == "status"){
        task.status = section.tasks[0]?.status
        task.statusId = section.tasks[0]?.statusId
      }
      if(this.group == "assignee"){
        task.user = [section.tasks[0]?.user]
        task.userId = section.tasks[0]?.userId
      }
      if(this.group == "department"){
        task.department = section.tasks[0]?.department
        task.departmentId = section.tasks[0]?.departmentId
      }
      if(this.group == "project"){
        task.projectId = section.tasks[0]?.project?.[0].project?.id || null 
      }

      section.tasks.forEach((el, i) => {
        el.dOrder = i;
      });

      // console.log(task, section)
      delete task.show
      delete task.sectionId
      this.$store.dispatch("task/createTask", {
          ...task,
          data: section,
          mode: "department",
          text: `created task ${task.title}`,
        })
        .then((t) => {
          this.resetNewRow();
          this.updateKey();
        })
        .catch((e) => {
          console.warn(e);
        });
    },

    resetNewRow() {
      this.newRow = {
        show: false,
        id: "",
        sectionId: null,
        title: "",
        user:null,
        userId: null,
        statusId: null,
        priorityId: null,
        projectId: null,
        startDate: "",
        dueDate: "",
        departmentId: null,
        description: "",
        budget: "",
        text: "",
      };
      this.userPickerOpen = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.task-page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.task-table-wrapper {
  height: calc(100% - 110px);
}

.section-options {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}
</style>
