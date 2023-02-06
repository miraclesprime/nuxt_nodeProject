<template>
<client-only>
  <div class="h-100 inbox-project">
    <div class="d-flex gap-05 align-center justify-end position-relative border-bottom-light px-105 py-05" id="project-id-button-wraps">
      
      <!-- <bib-button label="invite" variant="light" pill v-on:click="$nuxt.$emit('add-teammember-modal')"></bib-button> -->
      <!-- <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item1" v-tooltip="'Team'" @click="projectTeamModal = true">
        <bib-icon icon="user-group-solid" class="m-auto"></bib-icon>
      </div> -->
      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item2" v-tooltip="'Conversation'">
        <bib-icon icon="comment-forum-solid" class="m-auto"></bib-icon>
      </div>
      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item3" v-tooltip="'Files'">
        <bib-icon icon="folder-solid" class="m-auto"></bib-icon>
      </div>
      <!-- <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item4" v-tooltip="'History'" >
          <bib-icon icon="time" class="m-auto"></bib-icon>
        </div> -->
      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex align-center justify-center cursor-pointer" id="project-id-bookmark" @click="setFavorite" v-tooltip="isFavorite.text">
        <bib-icon icon="bookmark-solid" :variant="isFavorite.variant"></bib-icon>
      </div>
      <div id="project-id-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
        <bib-popup pop="horizontal-dots" id="project-id-horizontal-dots">
          <template v-slot:menu>
            <div class="list" id="project-id-list">
              <!-- <span class="list__item" id="project-id-list-item1" @click="modalOpen('overview', 'Overview')">View details</span> -->
              <!-- <hr id="project-id-hr"> -->
              <span class="list__item" id="project-id-list-item2" @click="setFavorite">
                <bib-icon icon="bookmark-solid" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
              </span>
              <span class="list__item" id="project-id-list-item3">
                <bib-icon icon="user-group-solid" class="mr-075"></bib-icon> Team
              </span>
              <span class="list__item" id="project-id-list-item3">
                <bib-icon icon="comment-forum-solid" class="mr-075"></bib-icon> Conversation
              </span>
              <span class="list__item" id="project-id-list-item3">
                <bib-icon icon="folder-solid" class="mr-075"></bib-icon> Files
              </span>
              <!-- <span class="list__item" id="project-id-list-item3">
                  <bib-icon icon="group" class="mr-075"></bib-icon> Subtasks
                </span> -->
              <!-- <span class="list__item" id="project-id-list-item4" @click="renameModal = !renameModal">
                  <bib-icon icon="pencil" class="mr-075"></bib-icon> Rename
                </span> -->
              <!-- <div class="mt-1" id="project-id-div"></div> -->
              <span class="list__item" id="project-id-list-item5" @click="reportModal = !reportModal">
                <bib-icon icon="warning" class="mr-075"></bib-icon> Report
              </span>
              <hr id="project-id-hr2">
              <span v-if="cdp" class="list__item list__item__danger" id="project-id-list-item6" @click="deleteProject(project)">Delete </span>
            </div>
          </template>
        </bib-popup>
      </div>
      <loading :loading="favLoading"></loading>
    </div>

    <div class="d-flex align-center gap-05 px-105 py-025 border-bottom-light">
      <div class="width-2 height-2 d-inline-flex align-center justify-center cursor-pointer">
        <bib-icon icon="check-circle-solid" :variant="isComplete.variant" :scale="1.5"></bib-icon>
        <!-- <bib-avatar></bib-avatar> -->
      </div>
      <div class="flex-grow-1">
        <input type="text" class="editable-input" ref="taskTitleInput" placeholder="Project name" v-model="activeProject.title" v-on:keyup="debounceUpdate('title', activeProject.title)">
      </div>
      <!-- <div class="team-avatar-list pr-05">
        <bib-avatar v-for="(team, index) in teammates.main" :src="team.avatar" :key="index" size="2rem" :style="{ left: -0.5 * index + 'rem'}" class="border-gray2"></bib-avatar><span v-show="teammates.extra.length" class="extra">+{{teammates.extra.length}}</span>
      </div> -->
      <team-avatar-list :team="team" ></team-avatar-list>
      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex align-center justify-center cursor-pointer" id="project-id-team-menu" v-tooltip="'Team'" @click="projectTeamModal = true">
        <bib-icon icon="user-group-solid" ></bib-icon>
      </div>
    </div>

    <div class="of-scroll-y position-relative px-2">
      <div class="form-fields pt-05 pb-1">
        <div id="proj-row2" class="row">
          <div id="proj-row2-col1" class="col-6">
            <bib-select label="Owner" test_id="po-owner-dd1" :options="filterUser" v-model="activeProject.userId" v-on:change="debounceUpdate('Owner', activeProject.userId)"></bib-select>
          </div>
          <div id="proj-row2-col2" class="col-3">          
            <bib-datepicker test_id="date01" v-model="startDate" :value="startDate" :maxDate="dueDate" format="dd MMM yyyy" @input="debounceUpdate('Start date', startDate)" label="Start date" name="startDate" placeholder="Start date"></bib-datepicker>
          </div>
          <div id="proj-row2-col3" class="col-3">
            <bib-datepicker test_id="date02" class="align-right" v-model="dueDate" :value="dueDate" :minDate="startDate" format="dd MMM yyyy" @input="debounceUpdate('Due date', dueDate)" label="Due date" name="dueDate" placeholder="Due date"></bib-datepicker>
          </div>
        </div>
        <div id="proj-row3" class="row">
          <div id="proj-row3-col2" class="col-12">
            <bib-input type="select" label="Department" :options="department" placeholder="Department"></bib-input>
          </div>
        </div>
        <div id="proj-row4" class="row">
          <div id="proj-row4-col1" class="col-6">
            <bib-input type="select" label="Priority" v-model.number="activeProject.priorityId" :options="priority" placeholder="Please select..." v-on:change.native="debounceUpdate('Priority', activeProject.priorityId)"></bib-input>
          </div>
          <div id="proj-row4-col2" class="col-6">
            <bib-input type="select" label="Status" v-model.number="activeProject.statusId" :options="status" placeholder="Please select..." v-on:change.native="debounceUpdate('Status', activeProject.statusId)"></bib-input>
          </div>
        </div>
        <div id="proj-row5" class="row">
          <div id="proj-row5-col1" class="col-4">
            <label class="text-gray6">Time</label>
            <div class="shape-rounded border-gray4 my-05 p-05">Hours {{time}}</div>
          </div>
          <div id="proj-row5-col2" class="col-4">
            <bib-input type="number" icon-left="currency-dollar" v-model="activeProject.budget" placeholder="Set your Budget" label="Budget" v-on:keyup.native="debounceUpdate('Budget', activeProject.budget)"></bib-input>
          </div>
          <div id="proj-row5-col3" class="col-4">
            <label class="text-gray6">Progress</label>
            <div class="shape-rounded border-gray4 my-05 p-05">{{progress}}%</div>
          </div>
        </div>
        <div id="proj-row6" class="row">
          <div id="proj-row6-col1" class="col-12">
            <bib-input type="textarea" label="Brief" v-model="activeProject.description" placeholder="Project brief" v-on:keyup.native="debounceUpdate('Project brief', activeProject.description)"></bib-input>
          </div>
        </div>
        <loading :loading="loading"></loading>
      </div>
      
      <div class="border-bottom-gray2 d-flex justify-between sub-title pb-05">
        <p class="text-gray5 font-md">Conversation </p>
      </div>
      <project-conversation :project="project"></project-conversation>
      
      <div class="border-bottom-gray2 d-flex justify-between sub-title pb-05">
        <p class="text-gray5 font-md">Files </p>
      </div>
      <project-files></project-files>
    </div>
    <div id="project-message-input" class=" d-flex gap-1 border-top-light py-1 px-105">
      <bib-avatar :src="user2.Photo" size="2rem" class="flex-shrink-0"></bib-avatar>
      <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div>
  </div>
</client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import dayjs from 'dayjs'

import _ from 'lodash'
export default {

  name: 'InboxProject',
  props: {
    project: Object,
  },

  data() {
    return {
      activeProject: {},
      owner: {},
      department: DEPARTMENT,
      status: STATUS,
      priority: PRIORITY,
      loading: false,
      favLoading: false,
      cdp: false,
      value: {
        files: [
          /*{ id: 156, name: 'thefile.png' },
          { id: 282, name: 'anotherfile.jpg' },*/
        ]
      },
      editMessage: {},
    }
  },

  watch: {
    project(newVal) {
        this.activeProject = _.cloneDeep(newVal)
        this.owner = this.teamMembers.filter(tm => tm.id == newVal.userId)
    },
  },

  computed: {
    ...mapGetters({
      allusers: "user/getTeamMembers",
      teamMembers: "user/getTeamMembers",
      team: "project/getProjectMembers",
      sections: "section/getProjectSections",
      favProjects: "project/getFavProjects",
      user2: "user/getUser2",
    }),
    /*activeProject() {
      return this.project;
    },*/
    totalTasks() {
      let tasks = []
      this.sections.map(t => {
        tasks.push(...t.tasks)
      })
      return tasks
    },
    isComplete() {
      if (this.project.statusId == 5) {
        return { variant: "success" }
      } else {
        return { variant: "gray5" }
      }
    },
    filterUser() {
      return this.teamMembers.map((u) => {
        return { value: u.id, id: u.id, label: u.firstName + ' ' + u.lastName, firstName: u.firstName, lastName: u.lastName, email: u.email, img: u.avatar }
      })
    },
    startDate: {
      get() {
        if (!this.activeProject.startDate) {
          return new Date()
        } else {
          return new Date(this.activeProject.startDate)
        }
      },
      set(newValue) {
        this.activeProject.startDate = new Date(newValue)
      }
    },

    dueDate: {
      get() {
        if (!this.activeProject.dueDate) {
          return new Date()
        } else {
          return new Date(this.activeProject.dueDate)
        }
      },
      set(newValue) {
        this.activeProject.dueDate = new Date(newValue)
      }
    },
    time() {
      if (this.activeProject.dueDate) {
        let d = dayjs(this.activeProject.dueDate)
        /*let diff = new Date(this.activeProject.dueDate) - new Date();
        let diffDays = Math.floor(diff / 864e5); // days
        let diffHrs = Math.floor((diff % 864e5) / 36e5); // hours
        let diffMins = Math.round(((diff % 864e5) % 36e5) / 6e4); // minutes
        let totalHrs = (diffDays * 24) + diffHrs*/
        // return `${totalHrs}:${diffMins}`
        // return dayjs(this.activeProject.dueDate).fromNow(true)
        return d.diff(dayjs(), 'hour')
      } else {
        return "00:00"
      }
    },
    progress() {
      if (this.totalTasks.length < 1) {
        return 0
      } else {
        let done = this.totalTasks.filter(t => t.statusId == 5)
        // console.log(done.length, this.totalTasks.length)
        return Math.round((done.length / this.totalTasks.length) * 100)
      }
    },
    isFavorite() {
      let fav = this.favProjects.some(t => t.id == this.project.id)
      if (fav) {
        return { variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { variant: "gray5", text: "Add to favorites", status: false }
      }
    },
    teammates() {
      let tm = { main: [], extra: [] }
      this.allusers.filter(u => {
        this.team.forEach((t, index) => {
          if (t.id == u.id && index < 4) {
            tm.main.push(u)
          } else if (t.id == u.id) {
            tm.extra.push(u)
          }
        })
      })
      return tm
    }
  },

  created() {
    this.$nuxt.$on("edit-message", (msg) => {
      // console.log(msg)
      this.editMessage = msg
    })
  },

  mounted() {
    setTimeout(() => {
      this.$store.dispatch("project/fetchTeamMember", { projectId: this.project.id }).then(() => {
        this.canDeleteProject();
      })
    }, 2500)
  },

  methods: {
    debounceUpdate: _.debounce(function(name, value) {
      // console.log('Debounce ', name, value)

      let updatedvalue = value
      if (name == "Owner") {
        this.owner = this.teamMembers.filter(tm => tm.id == value)
        updatedvalue = this.owner[0].label
      }
      if (name == 'Status') {
        this.status.find(s => {
          if (s.value == value) {
            updatedvalue = s.label
          }
        })
      }
      if (name == 'Priority') {
        this.priority.find(p => {
          if (p.value == value) {
            updatedvalue = p.label
          }
        })
      }
      if (name == "Due date") {
        updatedvalue = dayjs(value).format('DD MMM, YYYY')
      }

      if (name == "Start date") {
        updatedvalue = dayjs(value).format('DD MMM, YYYY')
      }

      if (this.activeProject.priorityId == "") {
        this.activeProject.priority = null
        this.activeProject.priorityId = null
      }
      if (this.activeProject.statusId == "") {
        this.activeProject.status = null
        this.activeProject.statusId = null
      }
      this.updateProject(`changed ${name} to ${updatedvalue}`)
    }, 1200),

    async updateProject(text) {
      // this.loading = true
      let proj = await this.$axios.$put("/project", { 
          id: this.activeProject.id, 
          user: this.owner[0], 
          data: this.activeProject, 
          text: text || '' 
        }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })

      if (proj.statusCode == 200) {
        this.$store.dispatch("project/setSingleProject", proj.data)
        // this.$store.dispatch("project/fetchSingleProject", proj.data.id)
      }
      // this.loading = false
    },

    setFavorite() {
      this.favLoading = true
      if (this.isFavorite.status) {
        this.$store.dispatch("project/removeFromFavorite", { id: this.project.id })
          .then(msg => {
            // this.popupMessages.push({ text: msg, variant: "orange" })
            alert(msg)
          })
          .catch(e => console.log(e))
          .then(() => this.favLoading = false)
      } else {
        this.$store.dispatch("project/addToFavorite", { id: this.project.id })
          .then(msg => {
            // this.popupMessages.push({ text: msg, variant: "success" })
            alert(msg)
          })
          .catch(e => console.log(e))
          .then(() => this.favLoading = false)
      }
      // this.favLoading = false
    },

    deleteProject(project) {
      this.loading = true
      this.$store.dispatch("project/deleteProject", project).then(p => {

        if (p.statusCode == 200) {
          // this.popupMessages.push({ text: p.message, variant: "success" })
          this.$router.push('/projects')
        } else {
          this.popupMessages.push({ text: p.message, variant: "warning" })
          console.warn(p.message);
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.popupMessages.push({ text: e, variant: "danger" })
        console.log(e)
      })
    },

    canDeleteProject() {
      // console.log(this.project.userId, JSON.parse(localStorage.getItem('user')).sub)
      //  console.log(JSON.parse(localStorage.getItem('user')).subr)
      if (this.project.userId == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
        this.cdp = true
        // return true;
      } else {
        this.cdp = false
      }
      // return false
    },
    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },
    onsubmit(data) {
      if (this.editMessage?.id) {
        this.$store.dispatch("project/updateProjectComment", { projectId: this.project.id, commentId: this.editMessage.id, comment: data.text })
        .then(res => {
          if (this.value.files.length > 0) {
            this.uploadFile(this.value.files, this.editMessage)
            this.value.files = []
          }
          // this.fetchProjectComments()
          this.$nuxt.$emit('refresh-list')
          this.editMessage = {}

        })
        .catch(e => console.log(e))
      } else {
        this.$store.dispatch("project/createProjectComment", { id: this.project.id, comment: data.text })
          .then(res => {
            // console.log("comment submit->", res.data)
            if (this.value.files.length > 0) {
              this.uploadFile(this.value.files, res.data)
              this.value.files = []
            }
            // this.fetchProjectComments()
            this.$nuxt.$emit('refresh-list')
          })
          .catch(e => console.log(e))
      }
    },
    async uploadFile(commentFiles, data){
      let formdata = new FormData()
      let filelist = []

      commentFiles.forEach(file => {
        formdata.append('files', file)
        filelist.push(file.name)
      })
      formdata.append('projectId', this.project.id)
      formdata.append('projCommentId', data.id)
      formdata.append('text', `uploaded file(s) "${filelist.join(", ")}" to comment`)

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      // console.log(fi.data)
      if (fi.data.statusCode == 200) {
        // console.log("file upload->", fi.data)
        this.value.files = []
        this.$nuxt.$emit("get-msg-files")
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.inbox-project {
  display: grid;
  grid-template-columns: none;
  grid-template-rows: 1fr 1fr minmax(400px, auto) 1fr;
}
.sub-title {
  font-size: 1rem;
}
</style>
