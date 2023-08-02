<template>
  <div id="task-view-wrapper" class="task-view-wrapper position-relative ">
    <task-actions
      :group="groupby"
      :gridType="gridType"
      v-on:create-task="toggleSidebar($event)"
      v-on:filterView="filterView"
      v-on:sort="taskSort($event)"
      @SingleProjectGroup="SingleProjectGroup($event)"
      @search-projectTasks="searchTasks"
      v-on:add-section="toggleNewsection"
    ></task-actions>
    <div v-show="gridType === 'list'" class="calc-height " :style="{ 'width': contentWidth }">

      <adv-table-three :tableFields="tableFields" :tableData="localdata" :lazyComponent="true" :contextItems="taskContextMenuItems" @context-open="contextOpen" @context-item-event="contextItemClick" @table-sort="taskSort" @row-click="openSidebar" @title-click="openSidebar" :newRow="newRow" @create-row="createNewTask" @update-field="updateTask" :showNewsection="newSection" @toggle-newsection="toggleNewsection" @create-section="createSection" @edit-section="renameSection" @section-dragend="sectionDragEnd" @row-dragend="taskDragEnd" :drag="dragTable" :key="templateKey" :editSection="groupby"></adv-table-three>

    </div>

    <div v-show="gridType == 'grid'" class="calc-height " >
      <task-grid-section
        :sections="localdata"
        :activeTask="activeTask"
        :templateKey="templateKey"
        @create-section="createSection"
        @section-delete="deleteSection"
        v-on:update-key="updateKey"
        v-on:create-task="toggleSidebar($event)"
        v-on:set-favorite="setFavorite"
        v-on:mark-complete="markComplete"
        v-on:delete-task="deleteTask"
        @section-dragend="sectionDragEnd"
        @task-dragend="taskDragEnd"
        sectionType="singleProject"
      >
      </task-grid-section>
    </div>

    <!-- user-picker for list and board view -->
    <user-picker
      :show="userPickerOpen"
      :coordinates="popupCoords"
      @selected="updateAssignee('Assignee', 'userId', $event.id, $event.label)"
      @close="userPickerOpen = false"
    ></user-picker>

    <!-- date-picker for list and board view -->
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

    <!-- section rename modal -->
    <bib-modal-wrapper
      v-if="renameModal"
      title="Rename section"
      @close="renameModal = false"
    >
      <template slot="content">
        <div>
          <bib-input
            type="text"
            v-model.trim="sectionTitle"
            placeholder="Enter name..."
          ></bib-input>
          <loading :loading="loading"></loading>
        </div>
      </template>
      <template slot="footer">
        <div class="d-flex justify-between">
          <bib-button
            label="Cancel"
            variant="light"
            pill
            @click="renameModal = false"
          ></bib-button>
          <bib-button
            label="Rename"
            variant="success"
            pill
            v-on:click="renameSection"
          ></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
</template>

<script>
import { TASK_FIELDS, TASK_CONTEXT_MENU } from "config/constants";
import { mapGetters } from "vuex";
import _ from "lodash";
import dayjs from "dayjs";
import { unsecuredCopyToClipboard } from "~/utils/copy-util.js";

export default {
  props: {
    gridType: String, // project ID page
  },
  data() {
    return {
      tableFields: TASK_FIELDS,
      taskContextMenuItems: TASK_CONTEXT_MENU,
      taskContextMenu: false,
      userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: "" },
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
      popupCoords: {},
      popupMessages: [],
      activeTask: {},
      taskToDelete: {},
      headless: null,
      flag: false,
      newSection: false,
      newSectionName: "",
      sectionLoading: false,
      sectionError: "",
      localdata: [],
      sortName: "",
      loading: false,
      templateKey: 0,
      orderBy: "asc",
      renameModal: false,
      alertDialog: false,
      alertMsg: "",
      sectionId: null,
      sectionTitle: "",
      plusButton: {
        label: "New Task",
        icon: "add",
      },
      newRow: {
        show: false,
        id: "",
        sectionId: null,
        title: "",
        userId: "",
        statusId: null,
        priorityId: null,
        departmentId: null,
        startDate: "",
        dueDate: "",
        department: "",
        description: "",
        budget: "",
        text: "",
      },
      contentWidth: "100%",
      groupby:'',
      dragTable: true
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      teamMembers: "user/getTeamMembers",
      task: "task/getSelectedTask",
      favTasks: "task/getFavTasks",
      project: "project/getSingleProject",
      sections: "section/getProjectSections",
      sidebar: "task/getSidebarVisible",
      filterViews :'task/getFilterView'
    }),
  },

  watch: {
    sections(newVal) {
      this.localdata = _.cloneDeep(newVal);

       let sorted = this.localdata.map((s) => {
        let t = s.tasks.sort((a, b) => a.order - b.order);
        s.tasks = t;
        return s;
      });
      this.localdata = sorted;
      this.templateKey += 1;
    },

    gridType() {
      this.templateKey++;
    },
    sidebar(newVal){
      const page = document.getElementById("page")
      this.$nextTick(() => { 
        const panel = document.getElementById("side-panel-wrapper")
        // console.log("page width="+page.scrollWidth+", panel width="+panel.offsetWidth)
        if (this.sidebar) {
          this.contentWidth = (page.scrollWidth - panel.offsetWidth) + 'px'
        } else {
          this.contentWidth = '100%'
        }
      });
    }
  },

  created() {
    this.$nuxt.$on("update-key", () => {
      this.updateKey();
    });
    this.$nuxt.$on("user-picker", (payload) => {
      // emitted from <task-grid>
      this.showUserPicker(payload);
    });
    this.$nuxt.$on("date-picker", (payload) => {
      // emitted from <task-grid>
      this.showDatePicker(payload);
    });
  },

  methods: {
    changeSection($event){
      this.newSection = $event
    },
    toggleNewsection(flag) {
      // console.log(flag)
      this.newSection = flag ? false : true

    },
    taskByOrder() {
      this.localdata = JSON.parse(JSON.stringify(this.sections));

      let sorted = this.localdata.map((s) => {
        let t = s.tasks.sort((a, b) => a.order - b.order);
        s.tasks = t;
        return s;
      });
      this.localdata = sorted;
      this.templateKey += 1;
    },
    contextItemClick(key, item) {
      switch (key) {
        case "done-task":
          this.markComplete(item);
          break;
        case "fav-task":
          this.setFavorite(item);
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
        case "assign-task":
          break;
        default:
          this.alertDialog = true;
          this.alertMsg = "no task assigned";
          break;
      }
    },
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
      this.userPickerOpen = false;
      this.datePickerOpen = false;
      this.activeTask = {};
    },

    taskSort($event) {
      let newData = JSON.parse(JSON.stringify(this.localdata));
      if ($event == "title") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc";
          newData.forEach(function (sec, index) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.title && b.title) {
                return a.title.localeCompare(b.title)
              }
            });
          });
        } else {
          this.orderBy = "asc";
          newData.forEach(function (sec, index) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.title && b.title) {
                return b.title.localeCompare(a.title)
              }
            });
          });
        }
        this.sortName = "title";
        this.localdata = newData;
        this.checkActive();
      }
      // Sort By owner
      if ($event == "userId") {

        let userArr = [];

        for (let i = 0; i < newData.length; i++) {
          let t = []
          for(let j=0; j<newData[i].tasks.length; j++) {
            if (newData[i].tasks[j].userId) {
              t.unshift(newData[i].tasks[j])
            } else {
              t.push(newData[i].tasks[j])
            }
          }
          newData[i].tasks = t;
          userArr.push(newData[i]);
        }

        if (this.orderBy == "asc") {
          this.orderBy = "desc";
          userArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.user && b.user) {
                return a.user.firstName.localeCompare(b.user.firstName);
              }
            });
          });
        } else {
          this.orderBy = "asc";
          userArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.user && b.user) {
                return b.user.firstName.localeCompare(a.user.firstName);
              }
            });
          });
        }
        this.sortName = "userId";
        this.localdata = userArr
        this.checkActive();
      }
      // sort By Status
      if ($event == "status") {

        let statusArr = [];

        for (let i = 0; i < newData.length; i++) {
          let t = []
          for(let j=0; j<newData[i].tasks.length; j++) {
            if (newData[i].tasks[j].statusId) {
              t.unshift(newData[i].tasks[j])
            } else {
              t.push(newData[i].tasks[j])
            }
          }
          newData[i].tasks = t;
          statusArr.push(newData[i]);
        }

        if (this.orderBy == "asc") {
          this.orderBy = "desc";
          statusArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.statusId && b.statusId) {
                return a.status.text.localeCompare(b.status.text)
              }
            });
          });
        } else {
          this.orderBy = "asc";
          statusArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.statusId && b.statusId) {
                return b.status.text.localeCompare(a.status.text)
              }
            });
          });
        }
        this.sortName = "status";
        this.localdata = statusArr
        this.checkActive();
      }
      // Sort By Priotity
      if ($event == "priority") {

        let priorityArr = [];

        for (let i = 0; i < newData.length; i++) {
          let t = []
          for(let j=0; j<newData[i].tasks.length; j++) {
            if (newData[i].tasks[j].priorityId) {
              t.unshift(newData[i].tasks[j])
            } else {
              t.push(newData[i].tasks[j])
            }
          }
          newData[i].tasks = t;
          priorityArr.push(newData[i]);
        }

        if (this.orderBy == "asc") {
          this.orderBy = "desc";
          priorityArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.priorityId && b.priorityId) {
                return a.priority.id - b.priority.id
              }
            });
          });
        } else {
          this.orderBy = "asc";
          priorityArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.priorityId && b.priorityId) {
                return b.priority.id - a.priority.id
              }
            });
          });
        }
        this.sortName = "priority";
        this.localdata = priorityArr
        this.checkActive();
      }

      // Sort By Department
      if ($event == "department") {

        let deptArr = [];

        for (let i = 0; i < newData.length; i++) {
          let t = []
          for(let j=0; j<newData[i].tasks.length; j++) {
            if (newData[i].tasks[j].departmentId) {
              t.unshift(newData[i].tasks[j])
            } else {
              t.push(newData[i].tasks[j])
            }
          }
          newData[i].tasks = t;
          deptArr.push(newData[i]);
        }

        if (this.orderBy == "asc") {
          this.orderBy = "desc";
          deptArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.departmentId && b.departmentId) {
                return a.department.title.localeCompare(b.department.title);
              }
            });
          });
        } else {
          this.orderBy = "asc";
          deptArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.departmentId && b.departmentId) {
                return b.department.title.localeCompare(a.department.title);
              }
            });
          });
        }
        this.sortName = "department";
        this.localdata = deptArr
        this.checkActive();
      }

      // Sort By Difficulty
      if ($event == "difficultyId") {

        let deptArr = [];

        for (let i = 0; i < newData.length; i++) {
          let t = []
          for(let j=0; j<newData[i].tasks.length; j++) {
            if (newData[i].tasks[j].difficultyId) {
              t.unshift(newData[i].tasks[j])
            } else {
              t.push(newData[i].tasks[j])
            }
          }
          newData[i].tasks = t;
          deptArr.push(newData[i]);
        }

        if (this.orderBy == "asc") {
          this.orderBy = "desc";
          deptArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.difficultyId && b.difficultyId) {
                return a.difficultyId - b.difficultyId;
              }
            });
          });
        } else {
          this.orderBy = "asc";
          deptArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.difficultyId && b.difficultyId) {
                return b.difficultyId - a.difficultyId;
              }
            });
          });
        }
        this.sortName = "difficulty";
        this.localdata = deptArr;
        this.checkActive();
      }

      // sort By Start Date
      if ($event == "startDate") {

        let sdArr = [];

        for (let i = 0; i < newData.length; i++) {
          let t = []
          for(let j=0; j<newData[i].tasks.length; j++) {
            if (newData[i].tasks[j].startDate) {
              t.unshift(newData[i].tasks[j])
            } else {
              t.push(newData[i].tasks[j])
            }
          }
          newData[i].tasks = t;
          sdArr.push(newData[i]);
        }

        if (this.orderBy == "asc") {
          this.orderBy = "desc";
          sdArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.startDate && b.startDate) {
                return new Date(a.startDate) - new Date(b.startDate)
              }
            });
          });
        } else {
          this.orderBy = "asc";
          sdArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.startDate && b.startDate) {
                return new Date(b.startDate) - new Date(a.startDate)
              }
            });
          });
        }
        this.sortName = "startDate";
        this.localdata = sdArr
        this.checkActive();
      }

      // sort By DueDate
      if ($event == "dueDate") {

        let ddArr = [];

        for (let i = 0; i < newData.length; i++) {
          let t = []
          for(let j=0; j<newData[i].tasks.length; j++) {
            if (newData[i].tasks[j].dueDate) {
              t.unshift(newData[i].tasks[j])
            } else {
              t.push(newData[i].tasks[j])
            }
          }
          newData[i].tasks = t;
          ddArr.push(newData[i]);
        }

        if (this.orderBy == "asc") {
          this.orderBy = "desc";
          ddArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate)
              }
            });
          });
        } else {
          this.orderBy = "asc";
          ddArr.forEach(function (sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if(a.dueDate && b.dueDate) {
                return new Date(b.dueDate) - new Date(a.dueDate)
              }
            });
          });
        }
        this.sortName = "dueDate";
        this.localdata = ddArr
        this.checkActive();
      }

      this.templateKey += 1;
    },
    async SingleProjectGroup($event) {
      this.groupby=$event
      if($event != 'default') {
        this.dragTable = false;
      } else {
        this.groupby=''
        this.dragTable = true;
      }
      await this.$store.commit('section/groupSectionProject', { sName: this.groupby })
    
    },

    contextOpen(item){
      if(this.$CheckFavTask(item.id)){
       this.taskContextMenuItems=this.taskContextMenuItems.map(item => item.label === "Add to Favorites" ? { ...item, label: "Remove favorite"} : item);
      }
      else{
        this.taskContextMenuItems=this.taskContextMenuItems.map(item => item.label === "Remove favorite" ? { ...item, label: "Add to Favorites"} : item);
      }
      if(item.statusId==5){
       this.taskContextMenuItems=this.taskContextMenuItems.map(item => item.label === "Mark Complete" ? { ...item, label: "Completed"} : item);
      }
      else {
         this.taskContextMenuItems=this.taskContextMenuItems.map(item => item.label === "Completed" ? { ...item, label: "Mark Complete"} : item);
      }
       this.$store.dispatch("task/setSingleTask", item)
    },
    updateKey() {
      this.userPickerOpen = false;
      this.taskContextMenu = false;
      this.$store
        .dispatch("section/fetchProjectSections", {
          projectId: this.$route.params.id,
          filter: 'all',
          sName:this.groupby
        })
        .then(() => {
          this.taskByOrder();
        });
    },

    toggleSidebar($event) {

      this.flag = !this.flag;
      if ($event.id) {
        this.$nuxt.$emit("open-sidebar", $event.id);
      } else {
        this.$nuxt.$emit("open-sidebar", $event);
      }
    },
    openSidebar(task) {
      let fwd = this.$donotCloseSidebar(event.target.classList);
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false;
      }

      let project = [
        {
          projectId: this.project?.id,
          project: {
            id: this.project?.id,
          },
        },
      ];
      this.$nuxt.$emit("open-sidebar", { ...task, project: project });
    },

    createNewTask(proj, section) {
      proj.group = this.groupby;
      proj.status = null
      proj.statusId = null
      proj.priority = null
      proj.priorityId = null
      proj.departmentId = null;
      proj.department = null;
      proj.user = null
      proj.userId = null
      proj.sectionId = this.groupby ? null : section.id

      if(this.groupby == "priority"){
        proj.priority = section.tasks[0]?.priority
        proj.priorityId = section.tasks[0]?.priorityId
     
      }
      if(this.groupby == "status"){
        proj.status = section.tasks[0]?.status
        proj.statusId = section.tasks[0]?.statusId
      }
      if(this.groupby=="assignee"){
        proj.user=[section.tasks[0]?.user]
        proj.userId=section.tasks[0]?.userId
      }
      if(this.groupby == "department"){
        proj.department = section.tasks[0]?.department
        proj.departmentId = section.tasks[0]?.departmentId
      }
      delete proj.show
      // delete proj.sectionId
      // console.log(proj, section)
      this.$store.dispatch("task/createTask", {
          ...proj,
          projectId: Number(this.$route.params.id),
          sectionId: this.groupby ? "_section"+this.$route.params.id : section.id,
          text: `created task ${proj.title}`,
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
        userId: null,
        user:null,
        statusId: null,
        status: null,
        priority: null,
        priorityId: null,
        departmentId: null,
        department: null,
        startDate: "",
        dueDate: "",
        description: "",
        budget: "",
        text: "",
      };
      this.userPickerOpen = false;
    },

    showNewSection() {
      this.newSection = true
      process.nextTick(() => {
        this.$refs.newsectioninput.focus()
      });
    },

    async createSection($event) {
      this.newSection = $event.newSection;
      // this.sectionLoading = $event.sectionLoading;
      this.sectionError = $event.sectionError;
      // this.sectionLoading = true;
      let tempSections = this.localdata.map((el, index) => {
        el.order = index+1
        return el
      })
      tempSections.unshift({title: $event.title, projectId: this.project?.id, order: 0 })
      // console.log(tempSections)
      const res = await this.$store.dispatch("section/createSection", {
        projectId: this.project?.id,
        title: $event.title || $event,
        isDeleted: false,
        data: tempSections,
        text: `section '${$event.title || $event}' created`,
      });
      if (res.statusCode == 200) {
        this.$store
          .dispatch("section/fetchProjectSections", {
            projectId: this.$route.params.id,
            filter: "all",
          })
          .then(() => {
            this.taskByOrder();
          });
        this.newSection = false;
        // this.sectionLoading = false;
      } else {
        this.sectionError = res.message;
        // this.sectionLoading = false;
      }
    },

    async renameSection(payload) {
      const sec = await this.$store.dispatch("section/renameSection", {
        projectId: Number(this.$route.params.id),
        id: this.sectionId || payload.id,
        data: {
          title: this.sectionTitle || payload.title,
        },
        text: `renamed section to "${this.sectionTitle || payload.title}"`,
      });
      if ((sec.statusCode = 200)) {
        this.updateKey();
      }
    },

    filterView($event) {
      this.filterData=$event
      this.$store.commit('task/setFilterView', {filter:$event})
      this.$store.commit("section/getFilterSections",{filter:$event, groupBy:this.groupby})
      // this.loading = true;
      // if ($event == "complete") {
      //   this.$store
      //     .dispatch("section/fetchProjectSections", {
      //       projectId: this.$route.params.id,
      //       filter: "complete",
      //       sName:this.groupby
      //     })
      //     .then(() => {
      //       this.taskByOrder();
      //     })
      //     .catch((e) => console.log(e));
      // }
      // if ($event == "incomplete") {
      //   this.$store
      //     .dispatch("section/fetchProjectSections", {
      //       projectId: this.$route.params.id,
      //       filter: "incomplete",
      //       sName:this.groupby
      //     })
      //     .then(() => {
      //       this.taskByOrder();
      //     })
      //     .catch((e) => console.log(e));
      // }
      // if ($event == "all") {
      //   this.$store
      //     .dispatch("section/fetchProjectSections", {
      //       projectId: this.$route.params.id,
      //       filter: "all",
      //       sName:this.groupby
      //     })
      //     .then(() => {
      //       this.taskByOrder();
      //     })
      //     .catch((e) => console.log(e));
      // }
      // this.loading = false;
    },

    checkActive() {
      for (let i = 0; i < this.tableFields.length; i++) {
        if (this.tableFields[i].header_icon) {
          this.tableFields[i].header_icon.isActive = false;
        }

        if (
          this.tableFields[i].header_icon &&
          this.tableFields[i].key == this.sortName
        ) {
          this.tableFields[i].header_icon.isActive = true;
        }
      }
      this.templateKey++;
    },

    setFavorite(task) {
      this.loading = true;
      let isFav = this.favTasks.some((f) => f.taskId == task.id);

      if (isFav) {
        this.$store
          .dispatch("task/removeFromFavorite", { id: task.id })
          .then((msg) => {
            this.updateKey();
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.log(e);
          });
      } else {
        this.$store
          .dispatch("task/addToFavorite", { id: task.id })
          .then((msg) => {
            this.updateKey();
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.log(e);
          });
      }
    },

    markComplete(task) {
      this.loading = true;
      if (typeof task == "object" && Object.keys(task).length > 0) {
      } else {
        task = this.activeTask;
      }
      this.$store
        .dispatch("task/updateTaskStatus", task)
        .then((d) => {
          this.loading = false;
          this.updateKey();
          // this.$store.dispatch("task/setSingleTask", d);
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },

    updateTask(payload) {
      const { item, label, field, value, historyText } = payload
      
      let user;
      if (field == "userId" && value != "") {
        user = this.teamMembers.filter((t) => t.id == value);
      } else {
        user = null;
      }

      let data = { [field]: value }
    
      if(field == "dueDate" && item.startDate){
        if(value=="Invalid Date"){
          data = { [field]: null }
        } else {
          if(new Date(value).getTime() > new Date(item.startDate).getTime()){
            data = { [field]: value }
          } else {
            data = { [field]: null }
            this.popupMessages.push({ text: "Invalid date", variant: "danger" });
            this.updateKey()
            return false
          }
        }
        
      }
      if(field == "startDate" && item.dueDate){
        if(value=="Invalid Date"){
          data = { [field]: null }
        } else {
          if(new Date(value).getTime() < new Date(item.dueDate).getTime()){
            data = { [field]: value }
          } else {
            data = { [field]: null }
            this.popupMessages.push({ text: "Invalid date", variant: "danger" });
            this.updateKey()
            return false
          }
        }
     
      }
      this.$store
        .dispatch("task/updateTask", {
          id: payload.id,
          data: data,
          user: user,
          text: `${historyText || value}`,
        })
        .then((t) => {
          this.updateKey();
        })
        .catch((e) => console.warn(e));
    },

    updateAssignee(label, field, value, historyValue) {
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
          user,
          text: `changed ${label} to ${historyValue}`,
        })
        .then((t) => {
          this.updateKey();
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

    deleteTask(task) {
      if (task) {
        this.$store
          .dispatch("task/deleteTask", task)
          .then((t) => {
            if (t.statusCode == 200) {
              this.updateKey(t.message);
              // this.taskToDelete = {};
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
        // this.taskToDelete = {};
      }
    },

    deleteSection(section) {
      this.loading = true;
      let del = confirm("Are you sure?");
      if (del) {
        this.$store
          .dispatch("section/deleteSection", section)
          .then((s) => {
            if (s.statusCode == 200) {
              this.updateKey();
            } else {
              console.warn(t.message);
            }
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.log(e);
          });
      } else {
        this.loading = false;
      }
    },

    sectionDragEnd: _.debounce(async function (payload) {
      this.loading = true;

      let clone = _.cloneDeep(payload);
      clone.forEach((el, i) => {
        el.order = i;
      });

      let sectionDnD = await this.$axios.$put(
        "/section/dragdrop",
        { projectId: this.project?.id, data: clone },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          },
        }
      );

      if (sectionDnD.statusCode == 200) {
        this.$store
          .dispatch("section/fetchProjectSections", {
            projectId: this.$route.params.id,
          })
          .then(() => {
            this.$nuxt.$emit("update-key");
          });
      }

      this.loading = false;
    }, 600),

    taskDragEnd: _.debounce(async function (payload) {
      this.loading = true;
      let tasks = _.cloneDeep(payload.tasks);

      tasks.forEach((el, i) => {
        el.order = i;
      });

      let taskDnD = await this.$axios.$put(
        "/section/crossSectionDragDrop",
        { data: tasks, sectionId: payload.sectionId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          },
        }
      );

      if (taskDnD.statusCode == 200) {
        this.updateKey()
      } else {
        console.warn(taskDnD.message);
      }
      this.loading = false;
    }, 600),

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

      let secs = JSON.parse(JSON.stringify(this.sections));

      let newArr = secs.map((s) => {
        let filtered = s.tasks.filter((t) => {
          if (t.title.includes(formattedText) || t.title.toLowerCase().includes(formattedText)) {
              return t;
            }
        });

        s.tasks = filtered;

        return s;
      });

      if (newArr.length >= 0) {
        this.localdata = newArr;
        this.templateKey++;
      } else {
        this.localdata = this.sections;
        this.templateKey++;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.task-view-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100% - 57px);
  .calc-height {
    height: calc(100% - 57px);
  }
}

.new-section-input {
  min-height: 2rem;
  padding: 0 0.5rem;
  font-size: $font-size-sm;
  border-radius: 0.18rem;
  border: 1px solid var(--bib-gray4);

  &:focus {
    outline: none;
    border: 2px solid var(--bib-gray6);
    border-radius: 0;
  }
}
</style>
