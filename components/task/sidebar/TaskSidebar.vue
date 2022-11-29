<template>
  <article id="side-panel" class="side-panel" v-click-outside="closeSidebar">
    <div class="side-panel__header" id='ts-header'>
      <!-- <div class="side-panel__header__file__info" id='ts-header-file-info'>
        <div id='ts-secondary-text' class="p-05 of-hidden text-of-elipsis h-fit text-wrap text-secondary"></div>
      </div> -->
      <div class="d-flex justify-between side-panel__header__actions mb-05" id='ts-side-panel'>
        <div class="d-flex align-center gap-05" id="ts-icon-close-Wrapper">
          <div id='ts-icon-7' class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" @click="$nuxt.$emit('close-sidebar')">
            <bib-icon icon="page-last" class="m-auto"></bib-icon>
          </div>
          <div class="d-flex cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2" id='ts-icon-external-wrapper'>
            <bib-icon icon="expand-fullscreen" variant="gray6" class="m-auto"></bib-icon>
          </div>
        </div>
        <div class="d-flex gap-05 align-center" id="ts-icon-attachment-wrapper">
          <!-- <bib-button variant="light" label="invite" v-on:click="$nuxt.$emit('add-member-to-task')"></bib-button> -->
          <!-- <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-2'>
            <bib-icon icon="attachment" variant="gray5" ></bib-icon>
          </div> -->
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-3' @click="showAddTeamModal">
            <bib-icon icon="user-group-solid" variant="gray5" ></bib-icon>
          </div>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-3' v-scroll-to="'#task_subtasks'">
            <bib-icon icon="check-square-solid" variant="gray5"></bib-icon>
          </div>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-4' v-scroll-to="'#task_conversation'">
            <bib-icon icon="comment-forum-solid" variant="gray5" ></bib-icon>
          </div>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-5' v-scroll-to="'#task_files'">
            <bib-icon icon="folder-solid" variant="gray5" ></bib-icon>
          </div>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="ts-icon-6" @click="setFavorite">
            <bib-icon :icon="isFavorite.icon" :variant="isFavorite.variant" ></bib-icon>
          </div>
          <div id="ts-list-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
            <bib-button pop="elipsis">
              <template v-slot:menu>
                <div class="list" id="ts-list">
                  <span class="list__item" id="ts-list-item-1" :class="['list__item__' + isComplete.variant]" @click="markComplete">
                    <bib-icon :icon="isComplete.icon" :variant="isComplete.variant" class="mr-075"></bib-icon> {{isComplete.text}}
                  </span>
                  <span class="list__item" id="ts-list-item-2" @click="setFavorite">
                    <bib-icon :icon="isFavorite.icon" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                  </span>
                  <span class="list__item" id="ts-list-item-4" @click="showAddTeamModal">
                    <bib-icon icon="user-group-solid" variant="gray5" class="mr-075" ></bib-icon> Team
                  </span>
                  <span class="list__item" id="ts-list-item-5" v-scroll-to="'#task_subtasks'">
                    <bib-icon icon="check-square-solid" variant="gray5" class="mr-075" v-scroll-to=""></bib-icon> Subtasks
                  </span>
                  <span class="list__item" id="ts-list-item-7" v-scroll-to="'#task_conversation'">
                    <bib-icon icon="comment-forum-solid" variant="gray5" class="mr-075"></bib-icon> Conversation
                  </span>
                  <span class="list__item" id="ts-list-item-3" v-scroll-to="'#task_files'">
                    <bib-icon icon="folder-solid" variant="gray5" class="mr-075"></bib-icon> Files
                  </span>
                  <!-- <span class="list__item" id="ts-list-item-6">
                    <bib-icon icon="duplicate" variant="gray5" class="mr-075"></bib-icon> Copy
                  </span> -->
                  <hr>
                  <span class="list__item list__item__danger" id="ts-list-item-8" @click="deleteTask(currentTask)">Delete</span>
                </div>
              </template>
            </bib-button>
          </div>
        </div>
      </div>
      <div class="border-top-gray3 border-bottom-gray3 position-relative px-105 py-025 mb-1" id="ts-row">
        <div class="d-flex align-center gap-05" id="ts-col-1">
          <div class="width-2 height-2 d-inline-flex align-center justify-center cursor-pointer" @click="markComplete">
            <bib-icon :icon="isComplete.icon" :variant="isComplete.variant" :scale="1.5"></bib-icon>
          </div>
          <div class="flex-grow-1">
            <!-- <span v-if="!editTitle" class="font-w-700" @click.stop="editTitle = true">{{form.title}}</span> -->
            <input type="text" class="editable-input" ref="taskTitleInput" v-model="form.title" placeholder="Enter task name..." v-on:keyup="debounceUpdate('Title', form.title)" >
            <!-- <bib-input v-else type="text" v-model="form.title" placeholder="Enter task name..." v-on:keyup.native="debounceUpdate('Title', form.title)" @blur="editTitle = false"></bib-input> -->
            <!-- <small v-show="error == 'invalid'" class="text-danger font-xs d-block" style="margin-top: -0.25rem;">Task name is required</small> -->
          </div>
          <div>
            <div class="team-avatar-list px-05">
              <bib-avatar v-for="(team, index) in teammates.main" :src="team.avatar" :key="index" v-tooltip="`${team.label}`" :title="team.label" :style="{ 'left': -0.5 * index + 'rem'}" class="border-gray2"></bib-avatar><span v-show="teammates.extra.length" class="extra">+{{teammates.extra.length}}</span>
            </div>
          </div>
          <div class="d-flex align-center justify-center width-2 height-2 shape-circle bg-light cursor-pointer" v-tooltip="'Team'" @click="showAddTeamModal">
            <bib-icon icon="user-group-solid"></bib-icon>
          </div>
        </div>
        <loading :loading="loading"></loading>
      </div>
      <!-- <div class="d-flex align-center gap-1 justify-center text-secondary font-sm" v-show="loading">
        <bib-spinner variant="primary" :scale="2"></bib-spinner> Saving changes...
      </div> -->
    </div>
    <!-- <div class="menu" id='ts-menu'>
      <bib-tabs :value="activeSidebarTab" @change="sidebarTabChange" :tabs="sidebarTabs"></bib-tabs>
    </div> -->
    <div class="of-scroll-y d-grid" id="ts-of-scroll-y" style="grid-template-columns: none; align-items: start">
      <!-- <template v-if="activeSidebarTab == 'Overview'"> -->
      <div class="task-info position-relative " id='sidebar-inner-wrap'>
        <div class="row mx-0" id='sidebar-row-1'>
          <div class="col-4" id='sidebar-col-1'>
            <bib-select label="Assignee" test_id="task_assignee_select" :options="orgUsers" v-model="form.userId" v-on:change="debounceUpdate('Assignee', form.userId)"></bib-select>
            <!-- <bib-input type="select" :options="orgUsers" v-model="form.userId" placeholder="Please select..." label="Assignee" v-on:change.native="debounceUpdate()"></bib-input> -->
          </div>
          <div class="col-4">
            <!-- <bib-input type="date" v-model="startDateInput" icon-left="calendar" placeholder="Enter date/range" label="Start date" v-on:change.native="debounceUpdate('Start date', startDateInput)"></bib-input> -->
            <bib-datepicker v-model="startDateInput" :value="startDateInput" format="dd MMM yyyy" label="Start date" placeholder="Start date" @input="debounceUpdate('Start date', startDateInput)" ></bib-datepicker>
          </div>
          <div class="col-4">
            <!-- <bib-input type="date" v-model="dateInput" icon-left="calendar" placeholder="Enter date/range" label="Due date" v-on:change.native="debounceUpdate('Due date', dateInput)"></bib-input> -->
            <bib-datepicker class="align-right" v-model="dateInput" :value="dateInput" format="dd MMM yyyy" label="Due date" placeholder="Due date" @input="debounceUpdate('Due date', dateInput)" ></bib-datepicker>
          </div>
        </div>
        <div class="row mx-0" id='sidebar-row-2'>
          <div class="col-4" id='sidebar-col-2'>
            <bib-input type="select" label="Project" :options="companyProjects" v-model.number="form.projectId" v-on:change.native="changeProject"></bib-input>
          </div>
          <div class="col-4">
            <bib-input type="select" label="Section" :options="sectionOpts" v-model.number="form.sectionId" placeholder="Please select ..." v-on:change.native="debounceUpdate('Section', form.sectionId)" :disabled="!form.projectId"></bib-input>
          </div>
          <div class="col-4" id='sidebar-col-3'>
            <bib-input type="select" label="Department" :options="department" placeholder="Please select..."></bib-input>
          </div>
        </div>
        <div class="row mx-0" id='sidebar-row-3'>
          <div class="col-4" id='sidebar-col-4'>
            <bib-input type="select" label="Priority" v-model.number="form.priorityId" :options="priorityValues" placeholder="Please select..." v-on:change.native="debounceUpdate('Priority', form.priorityId)"></bib-input>
          </div>
          <div class="col-4" id='sidebar-col-5'>
            <bib-input type="select" label="Status" v-model.number="form.statusId" :options="statusValues" placeholder="Please select..." v-on:change.native="debounceUpdate('Status', form.statusId)"></bib-input>
          </div>
        </div>
        <div class="row mx-0" id='sidebar-row-4'>
          <div class="col-12" id='sidebar-col-6'>
            <bib-input type="textarea" v-model.trim="form.description" placeholder="Enter task description..." label="Description" v-on:keyup.native="debounceUpdate('Description', form.description)"></bib-input>
          </div>
        </div>
        <div class="py-05 px-105" id="sidebar-btn-wrapper">
          <bib-button v-show="!currentTask.id" label="Create Task" variant="primary" v-on:click="createTask"></bib-button>
        </div>
        <loading :loading="loading"></loading>
      </div>
      <!-- </template> -->
      <!-- <sidebar-overview  :fields="taskFields" :activeTask="form" v-on:create-task="createTask" v-on:update-task="updateTask" /> -->
      <task-group id="task_subtasks"></task-group>
      <!-- <div class="container pt-1" >
        <task-group></task-group>
      </div> -->
      <!-- <sidebar-team :team="teammates.all"></sidebar-team> -->
      <sidebar-conversation id="task_conversation" :reloadComments="reloadComments" :reloadHistory="reloadHistory"></sidebar-conversation>
      <sidebar-files id="task_files" :reloadFiles="reloadFiles"></sidebar-files>
      <!-- <sidebar-history></sidebar-history> -->
      <button ref="topScroll" id="topScroll" style="visibility: hidden; opacity: 0" v-scroll-to="scrollId ? '#'+scrollId : '#sidebar-inner-wrap'"></button>
    </div>
    <!-- <add-member-to-task ref="taskTeamModal"></add-member-to-task> -->
    <bib-modal-wrapper v-if="taskTeamModal" title="Team" size="lg" @close="taskTeamModal = false">
      <template slot="content">
        <div style="height: 12rem;">
          <task-team></task-team>
        </div>
      </template>
    </bib-modal-wrapper>

    <div class="task-message-input d-flex gap-1 border-top-gray3 py-1 px-105">
      <bib-avatar :src="userPhoto" size="2rem" class="flex-shrink-0" ></bib-avatar>
      <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div>
  </article>
</template>

<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from "vuex"
import { userInfo } from '@/utils/userInfo.client'
import dayjs from 'dayjs'
import _ from 'lodash'

export default {
  name: "TaskSidebar",
  props: {
    // activeTask: Object,
    sectionIdActive: Number,
    scrollId: String,
  },
  data: function() {
    return {
      loading: false,
      // activeItem: {},
      // editTitle: false,
      form: {},
      sidebarTabs: [
        { title: "Overview", value: "Overview" },
        { title: "Subtasks", value: "Subtasks" },
        { title: "Team", value: "Team" },
        { title: "Conversations", value: "Conversations" },
        { title: "Files", value: "Files" },
        { title: "History", value: "History" },
      ],
      activeSidebarTab: "Overview",
      taskFields: [{
          key: "id",
          label: "#",
        },
        {
          key: "title",
          label: "Task name",
        },
        {
          key: "status",
          label: "Status",
        },
        {
          key: "priority",
          label: "Priority",
        },
        {
          key: "assignee",
          label: "Assignee",
        },
        {
          key: "dueDate",
          label: "Due Date",
        },
      ],
      assignee: "",
      statusValues: STATUS,
      priorityValues: PRIORITY,
      department: DEPARTMENT,
      // error: false
      // companyProjects: [],
      value: {
        files: [
          /*{ id: 156, name: 'thefile.png' },
          { id: 282, name: 'anotherfile.jpg' },*/
        ]
      },
      editMessage: {},
      reloadComments: 1,
      reloadHistory: 1,
      reloadFiles: 1,
      taskTeamModal: false
    };
  },

  computed: {
    ...mapGetters({
      user: "user/getUser2",
      teamMembers: "user/getTeamMembers",
      tasks: "task/tasksForListView",
      team: 'task/getTaskMembers',
      project: "project/getSingleProject",
      projects: "project/getAllProjects",
      sections: "section/getProjectSections",
      currentTask: 'task/getSelectedTask',
      favTasks: "task/getFavTasks",
    }),
    orgUsers() {
      let data = this.teamMembers.map(u => {
        return { label: u.firstName + ' ' + u.lastName, img: u.avatar, value: u.id }
      })
      return [{ label: 'Please select...', value: null }, ...data]
    },
    companyProjects() {
      // console.log("new project", this.project.id, this.project.title)
      let data = this.projects.map(p => {
        return { label: p.title, value: p.id }
      })
      return [{ label: 'Please select...', value: null }, ...data]
    },
    sectionOpts() {
      let sec = [{ label: "Select section", value: "_section" + this.form.projectId }]
      this.sections.forEach((s) => {
        if (s.title.includes("_section")) {
          return false
        }
        sec.push({ label: s.title, value: s.id })
      });
      return sec
    },
    teammates() {
      let tm = { main: [], extra: [], all: [] }
      if (Object.keys(this.currentTask).length == 0) {
        return tm
      }
      this.teamMembers.filter(u => {
        this.team.forEach((t, index) => {
          if (t.id == u.id) {
            tm.all.push(u)
            if (index < 4) {
              tm.main.push(u)
            } else {
              tm.extra.push(u)
            }
          }
        })
      })
      return tm
    },

    startDateInput: {
      get() {
        if (!this.form.startDate) {
          // return dayjs().format('YYYY-MM-DD')
          return new Date()
        } else {
          // return dayjs(this.form.startDate).format('YYYY-MM-DD')
          return new Date(this.form.startDate)
        }
      },
      set(newValue) {
        this.form.startDate = new Date(newValue)
      }
    },
    dateInput: {
      get() {
        let nd
        if (!this.form.dueDate) {
          nd = new Date()
          return new Date()
        } else {
          nd = new Date(this.form.dueDate)
          return new Date(this.form.dueDate)
        }
        /*let mm = (nd.getMonth() + 1) < 10 ? '0' + (nd.getMonth() + 1) : nd.getMonth() + 1
        let dd = (nd.getDate()) < 10 ? '0' + (nd.getDate()) : nd.getDate()
        return `${nd.getFullYear()}-${mm}-${dd}`*/
      },
      set(newValue) {
        this.form.dueDate = new Date(newValue)
      }
    },
    isFavorite() {
      let fav = this.favTasks.some(t => t.task.id == this.currentTask.id)
      if (fav) {
        return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { icon: "bookmark", variant: "gray5", text: "Add to favorites", status: false }
      }
    },
    isComplete() {
      if (this.currentTask.statusId == 5) {
        return { icon: "check-circle", variant: "success", text: "Completed" }
      } else {
        return { icon: "check-circle", variant: "gray5", text: "Mark Completed" }
      }
    },
    userPhoto(){
      if (this.user?.Photo) {
        return this.user.Photo
      }
    },
    error() {
      if (this.form.title) {
        return "valid"
      } else {
        return "invalid"
      }
    }
  },

  watch: {
    currentTask() {
      // console.log(this.currentTask)
      if (Object.keys(this.currentTask).length) {
        this.form = JSON.parse(JSON.stringify(this.currentTask));
        if (this.currentTask.project.length) {
          this.form.projectId = this.currentTask.project[0].projectId || this.currentTask.project[0].project.id
        } else {
          this.form.projectId = this.project.id
        }
        // console.info(this.$refs.topScroll)
      } else {
        this.form = {
          id: '',
          title: "Enter title...",
          createdAt: "",
          startDate: "",
          dueDate: "",
          userId: "",
          sectionId: "_section" + this.project.id,
          projectId: this.project.id,
          statusId: 1,
          priorityId: 2,
          description: '',
          budget: 0,
        }
        if (this.sectionIdActive) {
          this.form.sectionId = this.sectionIdActive
        }
      }
    },
    scrollId(newValue, oldValue){
      console.info(newValue, oldValue)
      this.$nextTick(() => {
        this.$refs.topScroll.click()
      });
    },

  },

  created(){
    this.$nuxt.$on("edit-message", (msg) => {
      // console.log(msg)
      this.editMessage = msg
    })
  },

  mounted() {
    this.$store.dispatch("project/fetchProjects")
    this.activeSidebarTab = 'Overview'
    
  },

  methods: {
    showAddTeamModal() {
      // this.$refs.taskTeamModal.showTaskTeamModal = true
      this.taskTeamModal = true
    },
    closeSidebar(event) {
      // console.log('click-outside task-sidebar',  event.originalTarget, event.target.classList)
      const classlist = ["cursor-pointer", "menu-item", "task-grid", "table__irow"]
      classlist.forEach(c => {
        // console.info(c)
        if (event.target.classList.contains(c)) {
          console.log('class found->', c)
          return false
        } /*else {
          console.warn("v-click-outside event", event.originalTarget)
        }*/
      })

      this.$nuxt.$emit("close-sidebar");
    },
    /*sidebarTabChange(tab) {
      this.activeSidebarTab = tab.value;
    },*/
    /*formattedDate(d) {
      let date = new Date(d);
      let month = date.getMonth() + 1;
      let day = '0' + date.getDay();
      let year = date.getFullYear()
      return `${year}-${month}-${day}`

    },*/
    changeProject() {
      if (!this.form.projectId || this.form.projectId == "") {
        this.form.projectId = null
        this.form.sectionId = null
        if (this.form.id) {
          this.updateTask('removed from project', this.form.projectId)
          return false
        }
        return false
      }
      this.loading = true
      if (this.form.projectId && (!this.form.sectionId || this.form.sectionId == "")) {
        this.form.sectionId = "_section" + this.form.projectId
      }
      // console.log(this.form, this.form.projectId)
      this.$store.dispatch("section/fetchProjectSections", { projectId: this.form.projectId, filter: 'all' }).then((sections) => {
        // console.log(sections)
        if (!this.form.id || this.form.id == "") {
          this.loading = false
          return false
        }
        let sec = sections.find(s => s.title.includes("_section"))
        let proj = this.companyProjects.find(p => p.value == this.form.projectId)
        // console.warn(sec);
        if (!sec) {
          // this.form.sectionId = null
          this.form.sectionId = "_section" + this.form.projectId
        } else {
          this.form.sectionId = sec.id
        }
        this.updateTask(`removed from project "${proj.label}"`, this.form.projectId)

      })
    },
    createTask($event) {
      // console.table($event);
      if (this.error == "valid") {
        this.loading = true

        let user;
        if (!this.form.userId || this.form.userId != "") {
          user = this.teamMembers.filter(u => u.id == this.form.userId)
        } else {
          user = null
        }

        if (this.form.projectId && (!this.form.sectionId || this.form.sectionId == "")) {
          this.form.sectionId = "_section" + this.form.projectId
        }

        if (!this.form.projectId || this.form.projectId == "") {
          this.form.projectId = null
          this.form.sectionId = null
        }

        this.$store.dispatch("task/createTask", {
          "sectionId": this.form.sectionId,
          "projectId": this.form.projectId,
          "title": this.form.title,
          "description": this.form.description,
          "createdAt": this.form.createdAt || new Date(),
          "startDate": this.form.startDate || new Date(),
          "dueDate": this.form.dueDate || new Date(),
          "priorityId": this.form.priorityId,
          "budget": 0,
          "statusId": this.form.statusId,
          user,
          "text": `task "${this.form.title}" created`,
        }).then(() => {
          this.$emit("update-key")
          this.$nuxt.$emit("update-key")
          this.loading = false
          // this.hideSidebar()
          this.$nuxt.$emit('close-sidebar')
        }).catch(e => {
          console.warn(e)
          this.loading = false
        })
      }
    },

    async updateTask(historyText, projectId) {
      this.loading = true

      let user;
      if (!this.form.userId || this.form.userId != "") {
        user = this.teamMembers.filter(u => u.id == this.form.userId)
      } else {
        user = null
      }

      this.$store.dispatch("task/updateTask", { id: this.form.id, data: { ...this.form }, user, projectId: this.form.projectId ? this.form.projectId : null, text: historyText })
        .then((u) => {
          // console.log(u)
          this.$nuxt.$emit("update-key")
          // this.$nuxt.$emit("refresh-history")
          this.reloadHistory += 1
          this.loading = false
        })
        .catch(e => {
          console.log(e)
          this.loading = false
        })

    },

    debounceUpdate: _.debounce(function(name, value) {
      if (this.form.id) {
        // console.log('Debounce', name, value)
        let updatedvalue = value
        if (name == 'Assignee') {
          let user = this.teamMembers.find(t => t.id == value)
          updatedvalue = user.label
        }
        if (name == 'Status') {
          this.statusValues.find(s => {
            if (s.value == value) {
              updatedvalue = s.label
            }
          })
        }
        if (name == 'Priority') {
          this.priorityValues.find(p => {
            if (p.value == value) {
              updatedvalue = p.label
            }
          })
        }
        if (name == "Due date" || name == "Start date") {
          updatedvalue = dayjs(value).format('DD MMM, YYYY')
        }
        if (this.form.priorityId == "") {
          this.form.priority = null
          this.form.priorityId = null
        }
        if (this.form.statusId == "") {
          this.form.status = null
          this.form.statusId = null
        }
        // console.log(updatedvalue)
        this.updateTask(`changed ${name} to "${updatedvalue}"`)
        this.reloadComments += 1

      }
    }, 1000),
    setFavorite() {
      // console.info(this.isFavorite.status)
      if (this.isFavorite.status) {
        this.$store.dispatch("task/removeFromFavorite", { id: this.currentTask.id })
          .then(msg => console.log(msg))
          .catch(e => console.log(e))
      } else {
        this.$store.dispatch("task/addToFavorite", { id: this.currentTask.id })
          .then(msg => console.log(msg))
          .catch(e => console.log(e))
      }
    },
    markComplete() {
      // console.log(this.currentTask)
      this.loading = true
      this.$store.dispatch('task/updateTaskStatus', this.currentTask)
        .then((d) => {
          // console.log(d)
          this.loading = false
          this.$nuxt.$emit("update-key")
          this.$store.dispatch("task/setSingleTask", d)
          this.reloadComments += 1
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
    },
    deleteTask(task) {
      this.loading = true
      this.$store.dispatch("task/deleteTask", task).then(t => {
        if (t.statusCode == 200) {
          this.$nuxt.$emit("update-key")
          this.$nuxt.$emit("close-sidebar");
          // console.warn(t.message);
        } else {
          console.warn(t.message);
        }
        this.loading = false
      }).catch(e => {
        // this.popupMessages.push({ text: e, variant: "danger" })
        this.loading = false
        console.log(e)
      })
    },
    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },
    onsubmit(data) {
      // console.log(data, this.editMessage?.id)
      let trimComment = _.truncate(data.text.slice(3, -4), { length: 128 })

      if (this.editMessage?.id) {
        this.$store.dispatch("task/updateTaskComment", { taskId: this.currentTask.id, commentId: this.editMessage.id, comment: data.text, text: `updated comment ${trimComment}` })
        .then(res => {
          this.reloadComments += 1
        })
        .catch(e => console.log(e))
      } else {
        this.$store.dispatch("task/createTaskComment", { id: this.currentTask.id, comment: data.text, text: `added comment ${trimComment}` })
          .then(res => {
            if (this.value.files.length > 0) {
              // console.log(this.value.files, res.data)
              this.uploadFiles(this.value.files, res.data)
            }
            this.reloadComments += 1
          })
          .catch(e => console.log(e))
      }
    },

    async uploadFiles(files, commentRes) {
      let filelist = []

      let formdata = new FormData()
      files.forEach(file => {
        formdata.append('files', file)
        filelist.push(file.name)
      })
      formdata.append('taskId', commentRes.taskId)
      formdata.append('taskCommentId', commentRes.id)
      formdata.append('text', `uploaded file(s) "${filelist.join(", ")}" to task`)

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      
      if (fi.data.statusCode == 200) {
        this.reloadFiles += 1;
        this.value.files = []
      }
    },
  },
};

</script>
<style lang="scss" scoped>
.side-panel {
  display: grid;
  /*grid-template-rows: 1fr auto minmax(1rem, 6fr);*/
  grid-template-rows: 1fr auto 1fr;
  /*.task-title-input {
    width: 99%;
    padding: 0.2rem 0.3rem;
    font-size: $font-size-lg;
    font-weight: 600;
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
    border-radius: 0.25rem;
    &:hover { border-color: $gray4;}
    &:focus { outline: none; border-color: $dark; box-shadow: 0 0 2px $dark-sub4; }
  }*/
}

.row {
  padding: 0 1rem;

  .input {
    /*font-size: $sidebar-size;*/
    color: #ccc;
  }
}

.container.pt-1::v-deep {
  padding-top: 1rem;
}

.container.pt-2::v-deep {
  padding-top: 2rem;
}

.team-avatar-list {
  position: relative;

  .avatar:hover {
    z-index: 11
  }

  .extra {
    margin-left: 0.25rem;
    color: $secondary;
    vertical-align: middle;
  }
}



</style>
