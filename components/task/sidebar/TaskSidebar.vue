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
          <bib-button variant="light" pill label="invite" v-on:click="$nuxt.$emit('add-member-to-task')"></bib-button>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex" id='ts-icon-2'>
            <bib-icon icon="attachment" variant="gray5" class="m-auto"></bib-icon>
          </div>
          <!-- <div class="p-025 cursor-pointer" id='ts-icon-3'>
            <bib-icon icon="heart-like" variant="gray5" :scale="1.25"></bib-icon>
          </div> -->
          <!-- <div class="p-025 cursor-pointer" id='ts-icon-4'>
            <bib-icon icon="comment-forum" variant="gray5" :scale="1.25"></bib-icon>
          </div> -->
          <!-- <div class="p-025 cursor-pointer" id='ts-icon-5'>
            <bib-icon icon="share" variant="gray5" :scale="1.25"></bib-icon>
          </div> -->
          <!-- <div class="p-025 cursor-pointer" id='ts-icon-6'>
            <bib-icon icon="horizontal-dots" variant="gray5" :scale="1.25"></bib-icon>
          </div> -->
          <div id="ts-list-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
            <bib-button pop="horizontal-dots">
              <template v-slot:menu>
                <div class="list" id="ts-list">
                  <span class="list__item" id="ts-list-item-1" @click="markComplete">
                    <bib-icon :icon="isComplete.icon" :variant="isComplete.variant" class="mr-075"></bib-icon> {{isComplete.text}}
                  </span>
                  <span class="list__item" id="ts-list-item-2" @click="setFavorite">
                    <bib-icon :icon="isFavorite.icon" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                  </span>
                  <span class="list__item" id="ts-list-item-3">
                    <bib-icon icon="upload" variant="gray5" class="mr-075"></bib-icon> Attach file...
                  </span>
                  <span class="list__item" id="ts-list-item-4">
                    <bib-icon icon="user-add" variant="gray5" class="mr-075"></bib-icon> Invite
                  </span>
                  <span class="list__item" id="ts-list-item-5">
                    <bib-icon icon="notification" variant="gray5" class="mr-075"></bib-icon> Set reminder
                  </span>
                  <span class="list__item" id="ts-list-item-6">
                    <bib-icon icon="duplicate" variant="gray5" class="mr-075"></bib-icon> Copy
                  </span>
                  <span class="list__item" id="ts-list-item-7">
                    <bib-icon icon="warning" variant="gray5" class="mr-075"></bib-icon> Report
                  </span>
                  <hr>
                  <span class="list__item danger" id="ts-list-item-8">Delete</span>
                </div>
              </template>
            </bib-button>
          </div>
        </div>
      </div>
      <div class="row position-relative mx-0 mb-1" id='ts-row'>
        <div class="col-8" id='ts-col-1'>
          <bib-input type="text" v-model="form.title" placeholder="Enter task name..." label="Task name" v-on:keyup.native="debounceUpdate()"></bib-input>
          <small v-show="error == 'invalid'" class="text-danger font-xs d-block" style="margin-top: -0.25rem;">Task name is required</small>
        </div>
        <div class="col-4" id='ts-col-2'>
          <bib-input type="date" v-model="dateInput" placeholder="Enter date/range" label="Due date" v-on:change.native="debounceUpdate()"></bib-input>
        </div>
        <loading :loading="loading"></loading>
      </div>
      <!-- <div class="d-flex align-center gap-1 justify-center text-secondary font-sm" v-show="loading">
        <bib-spinner variant="primary" :scale="2"></bib-spinner> Saving changes...
      </div> -->
    </div>
    <div class="menu" id='ts-menu'>
      <bib-tabs :value="activeSidebarTab" @change="sidebarTabChange" :tabs="sidebarTabs"></bib-tabs>
    </div>
    <div class="of-scroll-y " id="ts-of-scroll-y">
      <template v-if="activeSidebarTab == 'Overview'">
        <div class="task-info position-relative pt-1" id='sidebar-inner-wrap'>
          <div class="row mx-0" id='sidebar-row-1'>
            <div class="col-4" id='sidebar-col-1'>
              <bib-select label="Assignee" test_id="task_assignee_select" :options="orgUsers" v-model="form.userId" v-on:change="debounceUpdate()"></bib-select>
              <!-- <bib-input type="select" :options="orgUsers" v-model="form.userId" placeholder="Please select..." label="Assignee" v-on:change.native="debounceUpdate()"></bib-input> -->
            </div>
            <div class="col-4" id='sidebar-col-2'>
              <bib-input type="select" label="Project" :options="companyProjects" v-model.number="form.projectId" v-on:change.native="changeProject"></bib-input>
            </div>
            <div class="col-4">
              <bib-input type="select" label="Section" :options="sectionOpts" v-model.number="form.sectionId" placeholder="Please select ..." v-on:change.native="debounceUpdate()" :disabled="!form.projectId"></bib-input>
            </div>
          </div>
          <div class="row mx-0" id='sidebar-row-2'>
            <div class="col-4" id='sidebar-col-3'>
              <bib-input type="select" label="Department" :options="department" placeholder="Please select..."></bib-input>
            </div>
            <div class="col-4" id='sidebar-col-4'>
              <bib-input type="select" label="Priority" v-model.number="form.priorityId" :options="priorityValues" placeholder="Please select..." v-on:change.native="debounceUpdate()"></bib-input>
            </div>
            <div class="col-4" id='sidebar-col-5'>
              <bib-input type="select" label="Status" v-model.number="form.statusId" :options="statusValues" placeholder="Please select..." v-on:change.native="debounceUpdate()"></bib-input>
            </div>
          </div>
          <div class="row mx-0" id='sidebar-row-3'>
            <div class="col-12" id='sidebar-col-6'>
              <bib-input type="textarea" v-model.trim="form.description" placeholder="Enter task description..." label="Description" v-on:keyup.native="debounceUpdate()"></bib-input>
            </div>
          </div>
          <div class="py-05 px-105" id="sidebar-btn-wrapper">
            <bib-button v-show="!currentTask.id" label="Create Task" variant="primary" v-on:click="createTask"></bib-button>
          </div>
          <loading :loading="loading"></loading>
        </div>
      </template>
      <sidebar-overview v-if="activeSidebarTab == 'Overview'" :fields="taskFields" :activeTask="form" v-on:create-task="createTask" v-on:update-task="updateTask" />
      <div class="container pt-1" id='ts-subtask-container' v-if="activeSidebarTab == 'Subtasks'">
        <task-group></task-group>
      </div>
      <sidebar-team v-if="activeSidebarTab == 'Team'"></sidebar-team>
      <sidebar-conversation v-if="activeSidebarTab == 'Conversations'"></sidebar-conversation>
      <sidebar-files v-if="activeSidebarTab == 'Files'"></sidebar-files>
      <sidebar-history v-if="activeSidebarTab == 'History'"></sidebar-history>
    </div>
  </article>
</template>
<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from "vuex";
import _ from 'lodash';

export default {
  name: "TaskSidebar",
  props: {
    activeTask: Object,
    // teamKey: Number
  },
  data: function() {
    return {
      loading: false,
      // activeItem: {},
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
    };
  },

  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      tasks: "task/tasksForListView",
      project: "project/getSingleProject",
      projects: "project/getAllProjects",
      sections: "section/getProjectSections",
      currentTask: 'task/getSelectedTask',
      favTasks: "task/getFavTasks",
    }),
    orgUsers() {
      let data = this.teamMembers.map(u => {
        return { label: u.firstName + ' ' + u.lastName, value: u.id }
      })
      return [{ label: 'Please select...', value: null }, ...data]
    },
    companyProjects() {
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
    dateInput: {
      get: function() {
        let nd
        if (!this.form.dueDate) {
          nd = new Date()
        } else {
          nd = new Date(this.form.dueDate)
        }
        let mm = (nd.getMonth() + 1) < 10 ? '0' + (nd.getMonth() + 1) : nd.getMonth() + 1
        let dd = (nd.getDate()) < 10 ? '0' + (nd.getDate()) : nd.getDate()
        return `${nd.getFullYear()}-${mm}-${dd}`
      },
      set: function(newValue) {
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
      if (Object.keys(this.currentTask).length) {
        this.form = JSON.parse(JSON.stringify(this.currentTask));
        this.form.projectId = this.project.id
      } else {
        this.form = {
          id: '',
          title: "",
          dueDate: "",
          userId: "",
          sectionId: "_section" + this.project.id,
          projectId: this.project.id,
          statusId: 1,
          priorityId: 2,
          description: '',
          budget: 0,

        }
      }
    },

  },

  mounted() {
    this.$store.dispatch("project/fetchProjects")
    this.activeSidebarTab = 'Overview'
  },

  methods: {

    closeSidebar(event) {
      // console.log(event.originalTarget.classList, event.target.classList)
      if (event.target.classList.contains("cursor-pointer") || event.target.classList.contains("task-grid")) {
        // console.info('class found')
        return false
      }

      this.$nuxt.$emit("close-sidebar");
    },
    sidebarTabChange(tab) {
      this.activeSidebarTab = tab.value;
    },
    formattedDate(d) {
      let date = new Date(d);
      let month = date.getMonth() + 1;
      let day = '0' + date.getDay();
      let year = date.getFullYear()
      return `${year}-${month}-${day}`

    },
    changeProject() {
      if (!this.form.projectId || this.form.projectId == "") {
        this.form.projectId = null
        this.form.sectionId = null
        if (this.form.id) {
          this.updateTask(this.form.projectId)
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
        // console.warn(sec);
        if (!sec) {
          this.form.sectionId = null
        } else {
          this.form.sectionId = sec.id
        }
        this.updateTask(this.form.projectId)

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
          "dueDate": this.form.dueDate,
          "priorityId": this.form.priorityId,
          "budget": 0,
          "statusId": this.form.statusId,
          user
        }).then(() => {
          this.$emit("update-key")
          this.$nuxt.$emit("update-key")
          this.loading = false
          // this.hideSidebar()
          this.$nuxt.$emit('close-sidebar')
        }).catch(e => console.warn(e)).then(() => {
          this.loading = false
        })
      }
    },

    async updateTask(projectId) {
      this.loading = true

      let user;
      if (!this.form.userId || this.form.userId != "") {
        user = this.teamMembers.filter(u => u.id == this.form.userId)
      } else {
        user = null
      }

      let task = await this.$axios.$put("/task", { id: this.form.id, data: { ...this.form }, user, projectId: projectId ? projectId : null }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      // console.info(task)
      if (task.statusCode == 200) {
        // this.$store.dispatch("task/fetchTasks", { id: this.project.id }).then(() => this.loading = false)
        // this.loading = false
        this.$nuxt.$emit("update-key")

      }
      // console.log("update task =>", task)
      this.loading = false

    },

    debounceUpdate: _.debounce(function() {
      if (this.form.id) {
        // console.log('Debounce clicked!')
        this.updateTask()
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
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
    },
  },
};

</script>
<style lang="scss" scoped>
.side-panel {
  display: grid;
  grid-auto-flow: row;
  align-content: start;
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

</style>
