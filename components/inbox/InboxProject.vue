<template>
<client-only>
  <div class="h-100 inbox-project" id="inbox-project-wrapper">
    <div class="d-flex gap-05 align-center justify-end position-relative border-bottom-light px-105 py-05" id="inbox-project-button-wraps">

      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="inbox-project-menu-item2" v-tooltip="'Conversation'" @click="scrollToConversation">
        <bib-icon icon="comment-forum-solid" class="m-auto"></bib-icon>
      </div>
      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="inbox-project-menu-item3" v-tooltip="'Files'" @click="scrollToFiles">
        <bib-icon icon="folder-solid" class="m-auto"></bib-icon>
      </div>
      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex align-center justify-center cursor-pointer" id="inbox-project-bookmark" @click="setFavorite" v-tooltip="isFavorite.text">
        <bib-icon icon="bookmark-solid" :variant="isFavorite.variant"></bib-icon>
      </div>
      <div id="inbox-project-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
        <bib-popup pop="horizontal-dots" id="inbox-project-horizontal-dots">
          <template v-slot:menu>
            <div class="list" id="inbox-project-list">
              <span class="list__item" id="inbox-project-list-item2" @click="setFavorite">
                <bib-icon icon="bookmark-solid" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
              </span>
              <span class="list__item" id="inbox-project-list-item3" @click="showAddTeamModal">
                <bib-icon icon="user-group-solid" class="mr-075"></bib-icon> Team
              </span>
              <span class="list__item" id="inbox_project_list-item4" @click="scrollToConversation">
                <bib-icon icon="comment-forum-solid" class="mr-075"></bib-icon> Conversation
              </span>
              <span class="list__item" id="inbox_project_list-item5" @click="scrollToFiles">
                <bib-icon icon="folder-solid" class="mr-075"></bib-icon> Files
              </span>
              <!-- <span class="list__item" id="inbox-project-list-item5" @click="reportModal = !reportModal">
                <bib-icon icon="warning" class="mr-075"></bib-icon> Report
              </span> -->
              <hr id="inbox-project-hr2">
              <span v-if="cdp" class="list__item list__item__danger" id="inbox-project-list-item6" @click="deleteProject(project)">Delete </span>
            </div>
          </template>
        </bib-popup>
      </div>
      <loading :loading="favLoading"></loading>
    </div>

    <div class="d-flex align-center gap-05 px-105 py-025 border-bottom-light" id="ip-title-team-modal-wrap">
      <div class="width-2 height-2 d-inline-flex align-center justify-center cursor-pointer" id="ip-check-circle-solid">
        <bib-icon icon="check-circle-solid" :variant="isComplete.variant" :scale="1.5"></bib-icon>
      </div>
      <div class="flex-grow-1" id="ip-title-wrap">
        <input type="text" class="editable-input" ref="taskTitleInput" placeholder="Project name" v-model="activeProject.title" v-on:keyup="debounceUpdate('title', activeProject.title)" id="taskTitleInput">
      </div>
      <team-avatar-list :team="team" ></team-avatar-list>
      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex align-center justify-center cursor-pointer" id="inbox-project-team-menu" v-tooltip="'Team'" @click="showAddTeamModal"> 
        <bib-icon icon="user-group-solid" ></bib-icon>
      </div>
    </div>

    <div class="of-scroll-y position-relative px-2" id="ip-field-wrapper">
      <div class="form-fields pt-05 pb-1" id="ip-field-inner-wrapper">
        <div class="row" id="ip-project-row">
          <div id="ip-proj-row2-col1" class="col-6">
            <bib-select label="Owner" test_id="po-owner-dd1" :options="filterUser" v-model="activeProject.userId" v-on:change="debounceUpdate('Owner', activeProject.userId)"></bib-select>
          </div>
          <div id="ip-proj-row2-col2" class="col-3">          
            <bib-datepicker test_id="date01" v-model="startDate" :value="startDate" :maxDate="dueDate" format="dd MMM yyyy" @input="debounceUpdate('Start date', startDate)" label="Start date" name="startDate" placeholder="Start date"></bib-datepicker>
          </div>
          <div id="ip-proj-row2-col3" class="col-3">
            <bib-datepicker test_id="date02" class="align-right" v-model="dueDate" :value="dueDate" :minDate="startDate" format="dd MMM yyyy" @input="debounceUpdate('Due date', dueDate)" label="Due date" name="dueDate" placeholder="Due date"></bib-datepicker>
          </div>
        </div>
        <div id="ip-proj-row3" class="row">
          <div id="proj-row3-col2" class="col-12">
            <bib-input type="select" label="Department" :options="departments" v-model.number="activeProject.departmentId" v-on:change.native="debounceUpdate('Department', activeProject.departmentId)"></bib-input>
          </div>
        </div>
        <div id="ip-proj-row4" class="row">
          <div id="ip-proj-row4-col1" class="col-6">
            <bib-input type="select" label="Priority" v-model.number="activeProject.priorityId" :options="priority" placeholder="Please select..." v-on:change.native="debounceUpdate('Priority', activeProject.priorityId)"></bib-input>
          </div>
          <div id="ip-proj-row4-col2" class="col-6">
            <bib-input type="select" label="Status" v-model.number="activeProject.statusId" :options="status" placeholder="Please select..." v-on:change.native="debounceUpdate('Status', activeProject.statusId)"></bib-input>
          </div>
        </div>
        <div id="ip-proj-row5" class="row">
          <div id="ip-proj-row5-col1" class="col-4">
            <label id="ip-label-1" class="text-gray6">Time</label>
            <div id="ip-hours" class="inbox-proj-time font-md shape-rounded border-gray4 my-05 p-05" >Hours {{time}}</div>
          </div>
          <div id="ip-proj-row5-col2" class="col-4">
            <bib-input type="number" icon-left="currency-dollar" v-model="activeProject.budget" placeholder="Set your Budget" label="Budget" v-on:keyup.native="validate('Budget', activeProject.budget)"></bib-input>
          </div>
          <div id="ip-proj-row5-col3" class="col-4">
            <label id="ip-label-2" class="text-gray6">Progress</label>
            <div id="ip-progress" class="inbox-proj-progress font-md shape-rounded border-gray4 my-05 p-05">{{progress}}%</div>
          </div>
        </div>
        <div id="ip-proj-row6" class="row">
          <div id="ip-proj-row6-col1" class="col-12">
            <bib-input type="textarea" label="Brief" v-model="activeProject.description" placeholder="Project brief" v-on:keyup.native="debounceUpdate('Project brief', activeProject.description)"></bib-input>
          </div>
        </div>
        <loading :loading="loading"></loading>
      </div>
      
      <div id="ip-conv-wrap" class="border-bottom-gray2 d-flex justify-between sub-title pb-05">
        <p id="ip-coversation-para" class="text-gray5 font-md">Conversation </p>
      </div>
      <project-conversation id="inbox_project_conversation" :project="activeProject" :key="'conv-'+activeProject.id"></project-conversation>
      
      <div id="ip-files-wrap" class="border-bottom-gray2 d-flex justify-between sub-title pb-05">
        <p id="ip-files-para" class="text-gray5 font-md">Files </p>
      </div>
      <project-files id="inbox_project_files" :proj="activeProject" :key="'files'+activeProject.id"></project-files>
    </div>
    <div id="inbox-project-message-input" class=" d-flex gap-1 border-top-light py-1 px-105">
      <bib-avatar :src="user2.Photo" size="2rem" class="flex-shrink-0"></bib-avatar>
      <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div>

    <!-- project team -->
      <bib-modal-wrapper v-if="projectTeamModal" title="Team" size="lg" @close="projectTeamModal = false">
        <template slot="content">
          <div id="ip-bib-modal-project-team">
            <project-team-modal :project="project"></project-team-modal>
          </div>
        </template>
      </bib-modal-wrapper>

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
  </div>
</client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import { STATUS, PRIORITY } from '~/config/constants.js'
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
      status: STATUS,
      priority: PRIORITY,
      loading: false,
      favLoading: false,
      cdp: false,
      value: {
        files: []
      },
      editMessage: {},
      projectTeamModal: false,
      popupMessages: [],
    }
  },

  watch: {
    project(newVal) {
        this.activeProject = _.cloneDeep(newVal)
        this.$store.dispatch("project/setProject", JSON.parse(JSON.stringify(this.activeProject)))
        this.$store.dispatch("project/fetchTeamMember", {projectId: this.activeProject.id})
        this.owner = this.teamMembers.filter(tm => tm.id == newVal.userId)
    },
  },

  computed: {
    ...mapGetters({
      allusers: "user/getTeamMembers",
      teamMembers: "user/getTeamMembers",
      departments: "department/getAllDepartments",
      team: "project/getProjectMembers",
      sections: "section/getProjectSections",
      favProjects: "project/getFavProjects",
      user2: "user/getUser2",
    }),
    totalTasks() {
      let tasks = []
      this.sections.map(t => {
        tasks.push(...t.tasks)
      })
      return tasks
    },
    isComplete() {
      if (this.activeProject.statusId == 5) {
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
        return Math.round((done.length / this.totalTasks.length) * 100)
      }
    },
    isFavorite() {
      let fav = this.favProjects.some(t => t.id == this.activeProject.id)
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
      this.editMessage = msg
    })
  },

  // mounted() {
  //   setTimeout(() => {
  //     this.$store.dispatch("project/fetchTeamMember", { projectId: this.activeProject?.id }).then(() => {
  //       this.canDeleteProject();
  //     })
  //   }, 2500)
  // },

  methods: {
    validate(name, value) {
      let dec = Number.parseFloat(value).toFixed(2)
      // console.log(dec)
      this.debounceUpdate(name, dec)
    },

    debounceUpdate: _.debounce(function(name, value) {

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

      if (name == 'Department') {
        this.departments.find(d => {
          if (d.value == value) {
            updatedvalue = d.label
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
    }, 800),

    async updateProject(text) {

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
      }
    },

    setFavorite() {
      this.favLoading = true
      if (this.isFavorite.status) {
        this.$store.dispatch("project/removeFromFavorite", { id: this.activeProject.id })
          .then(msg => {
            this.popupMessages.push({ text: msg, variant: "orange" })
          })
          .catch(e => console.log(e))
          .then(() => this.favLoading = false)
      } else {
        this.$store.dispatch("project/addToFavorite", { id: this.activeProject.id })
          .then(msg => {
            this.popupMessages.push({ text: msg, variant: "success" })
          })
          .catch(e => console.log(e))
          .then(() => this.favLoading = false)
      }
    },

    showAddTeamModal() {
      this.projectTeamModal = true
    },

    deleteProject(project) {
      this.loading = true
      this.$store.dispatch("project/deleteProject", project).then(p => {

        if (p.statusCode == 200) {
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
      if (this.activeProject.userId == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
        this.cdp = true
      } else {
        this.cdp = false
      }
    },
    onFileInput(payload) {
      this.value.files = payload.files
    },
    onsubmit(data) {
      if (this.editMessage?.id) {
        this.$store.dispatch("project/updateProjectComment", { projectId: this.activeProject.id, commentId: this.editMessage.id, comment: data.text })
        .then(res => {
          if (this.value.files.length > 0) {
            this.uploadFile(this.value.files, this.editMessage)
            this.value.files = []
          }
          this.$nuxt.$emit('refresh-list')
          this.editMessage = {}

        })
        .catch(e => console.log(e))
      } else {
        this.$store.dispatch("project/createProjectComment", { id: this.activeProject.id, comment: data.text })
          .then(res => {
            if (this.value.files.length > 0) {
              this.uploadFile(this.value.files, res.data)
              this.value.files = []
            }
            this.$nuxt.$emit('refresh-list')
          })
          .catch(e => console.log(e))
      }
    },
    async uploadFile(commentFiles, data){
      let formdata = new FormData()
      let filelist = []
      let delayTime = 100;

      if(commentFiles.length > 1) {
        delayTime = 6000;
      } else {
        delayTime = 800;
      }

      commentFiles.forEach(file => {
        formdata.append('files', file)
        filelist.push(file.name)
      })
      formdata.append('projectId', this.activeProject.id)
      formdata.append('projCommentId', data.id)
      formdata.append('text', `uploaded file(s) "${filelist.join(", ")}" to comment`)

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (fi.data.statusCode == 200) {
        this.value.files = []
        _.delay(() => {
          console.log("after 5 seconds")
          this.$nuxt.$emit("get-msg-files")
        }, delayTime)
      }
    },

    scrollToFiles() {
      this.$nextTick(() => {
        const element = document.getElementById('inbox_project_files');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth',block: "center" });
        }
      });
    },

    scrollToConversation() {
      this.$nextTick(() => {
        const element = document.getElementById('inbox_project_conversation');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' ,block: "end"});
        }
      });
    },
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

.inbox-proj-time, .inbox-proj-progress {
  background: var(--bib-light);
}

</style>
