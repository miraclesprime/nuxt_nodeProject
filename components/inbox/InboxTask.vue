<template>
  <div class="inbox-task h-100 position-relative" >
    <div class="d-flex justify-between side-panel__header__actions mb-05" id='ts-side-panel'>
      <!-- <div class="d-flex align-center gap-05" id="ts-icon-close-Wrapper">
          <div id='ts-icon-7' class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" @click="$nuxt.$emit('close-sidebar')">
            <bib-icon icon="page-last" class="m-auto"></bib-icon>
          </div>
          <div class="d-flex cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2" id='ts-icon-external-wrapper'>
            <bib-icon icon="expand-fullscreen" variant="gray6" class="m-auto"></bib-icon>
          </div>
        </div> -->
      <div class="d-flex gap-05 ml-auto align-center" id="ts-icon-attachment-wrapper">
        <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="ts-icon-3" v-tooltip="'Team'" @click="showAddTeamModal">
          <bib-icon icon="user-group-solid" variant="gray5"></bib-icon>
        </div>
        <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-3' v-scroll-to="'#task_subtasks'">
          <bib-icon icon="check-square-solid" variant="gray5"></bib-icon>
        </div>
        <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-4' v-scroll-to="'#task_conversation'">
          <bib-icon icon="comment-forum-solid" variant="gray5"></bib-icon>
        </div>
        <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-5' v-scroll-to="'#task_files'">
          <bib-icon icon="folder-solid" variant="gray5"></bib-icon>
        </div>
        <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="ts-icon-6" @click="setFavorite">
          <bib-icon icon="bookmark-solid" :variant="isFavorite.variant"></bib-icon>
        </div>
        <div id="ts-list-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
          <bib-button pop="elipsis">
            <template v-slot:menu>
              <div class="list" id="ts-list">
                <span class="list__item" id="ts-list-item-1" @click="markComplete">
                  <bib-icon icon="check-circle-solid" :variant="isComplete.variant" class="mr-075"></bib-icon> {{isComplete.text}}
                </span>
                <span class="list__item" id="ts-list-item-2" @click="setFavorite">
                  <bib-icon icon="bookmark-solid" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                </span>
                <span class="list__item" id="ts-list-item-4" @click="showAddTeamModal">
                  <bib-icon icon="user-group-solid" variant="gray5" class="mr-075"></bib-icon> Team
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
                <span class="list__item list__item__danger" id="ts-list-item-8" @click="deleteTask(item.taskId)">Delete</span>
              </div>
            </template>
          </bib-button>
        </div>
      </div>
    </div>
    <!-- task title -->
    <div class="d-flex align-center gap-05 border-top-light border-bottom-light py-025 px-1" id="ts-title">
      <div class="width-2 height-2 d-inline-flex align-center justify-center cursor-pointer" @click="markComplete">
        <bib-icon icon="check-circle-solid" :variant="isComplete.variant" :scale="1.5"></bib-icon>
      </div>
      <div class="flex-grow-1">
        <input type="text" class="editable-input" ref="taskTitleInput" v-model="form.title" placeholder="Enter task name..." v-on:keyup="debounceUpdate('Title', form.title)">
        <!-- <small v-show="error == 'invalid'" class="text-danger font-xs d-block" style="margin-top: -0.25rem;">Task name is required</small> -->
      </div>
      <!-- <div>
        <div class="team-avatar-list px-05">
          <bib-avatar v-for="(team, index) in teammates.main" :src="team.avatar" :key="index" v-tooltip="team.label" :title="team.label" :style="{ 'left': -0.5 * index + 'rem'}" class="border-gray2"></bib-avatar><span v-show="teammates.extra.length" class="extra">+{{teammates.extra.length}}</span>
        </div>
      </div> -->
      <div class="d-flex align-center justify-center width-2 height-2 shape-circle bg-light cursor-pointer" v-tooltip="'Team'" @click="showAddTeamModal">
        <bib-icon icon="user-group-solid"></bib-icon>
      </div>
    </div>
    <div class="of-scroll-y position-relative py-05" id="ts-row" >
      <!-- task form -->
        <div class="task-info position-relative px-1" id='sidebar-inner-wrap'>
          <div class="row mx-0" id='sidebar-row-1'>
            <div class="col-4" id='sidebar-col-1'>
              <bib-select label="Assignee" test_id="task_assignee_select" :options="orgUsers" v-model="form.userId" v-on:change="debounceUpdate('Assignee', form.userId)"></bib-select>
            </div>
            <div class="col-4">
              <bib-datepicker v-model="startdateInput" :value="startdateInput" format="dd MMM yyyy" label="Start date" placeholder="Start date" @input="debounceUpdate('Start date', startdateInput)"></bib-datepicker>
            </div>
            <div class="col-4">
              <bib-datepicker class="align-right" v-model="duedateInput" :value="duedateInput" format="dd MMM yyyy" label="Due date" placeholder="Due date" @input="debounceUpdate('Due date', duedateInput)"></bib-datepicker>
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
          <div class="py-05 px-05" id="sidebar-btn-wrapper">
            <bib-button v-show="!task.id" label="Create Task" variant="primary" v-on:click="createTask"></bib-button>
          </div>
          <!-- <loading :loading="loading"></loading> -->
        </div>
        <!-- subtasks -->
        <task-group></task-group>
        <!-- conversation -->
        <sidebar-conversation></sidebar-conversation>
        <!-- files -->
        <sidebar-files></sidebar-files>
    </div>
    <!-- message input -->
    <div class="task-message-input d-flex gap-1 border-top-light py-1 px-105">
      <bib-avatar :src="user.Photo" size="2rem" class="flex-shrink-0"></bib-avatar>
      <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>
<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {

  name: 'InboxTask',
  props: {
    task: Object,
  },

  data() {
    return {
      loading: false,
      statusValues: STATUS,
      priorityValues: PRIORITY,
      department: DEPARTMENT,
      form: {},
      value: {
        files: [
          /*{ id: 156, name: 'thefile.png' },
          { id: 282, name: 'anotherfile.jpg' },*/
        ]
      },
      // user: this.$userInfo(this.task.userId),
      editMessage: {},
    }
  },
  watch: {
    task(newValue){
      this.form = _.cloneDeep(newValue)
    },
  },
  computed: {
    ...mapGetters({
      favTasks: "task/getFavTasks",
      teamMembers: "user/getTeamMembers",
      projects: "project/getAllProjects",
      sections: "section/getProjectSections",
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
    startdateInput: {
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
    duedateInput: {
      get() {
        let nd
        if (!this.form.dueDate) {
          nd = new Date()
          return new Date()
        } else {
          nd = new Date(this.form.dueDate)
          return new Date(this.form.dueDate)
        }
      },
      set(newValue) {
        this.form.dueDate = new Date(newValue)
      }
    },
    isFavorite() {
      let fav = this.favTasks.some(t => t.task.id == this.task.id)
      if (fav) {
        return { variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { variant: "gray5", text: "Add to favorites", status: false }
      }
    },
    isComplete() {
      if (this.task.statusId == 5) {
        return { variant: "success", text: "Completed" }
      } else {
        return { variant: "gray4", text: "Mark Completed" }
      }
    },
    user() {
      return this.$userInfo(this.task.userId)
    },
    /*userPhoto(){
      if (this.task.user?.Photo) {
        return this.task.user.Photo
      }
    },*/
  },
  created() {
    this.$nuxt.$on("edit-message", (msg) => {
      // console.log(msg)
      this.editMessage = msg
    })
  },
  mounted() {
    this.$store.dispatch("project/fetchProjects")

  },
  methods: {
    markComplete() {},
    setFavorite() {},
    showAddTeamModal() {
      this.$nuxt.$emit("add-member-to-task")
    },
    
    debounceUpdate() {},
    deleteTask(taskId) {

    },
    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },
    onsubmit(data) {
      // console.log(data, this.editMessage?.id)
      let trimComment = _.truncate(data.text.slice(3, -4), { length: 128 })

      if (this.editMessage?.id) {
        this.$store.dispatch("task/updateTaskComment", { taskId: this.task.id, commentId: this.editMessage.id, comment: data.text, text: `updated comment ${trimComment}` })
          .then(res => {
            this.reloadComments += 1
          })
          .catch(e => console.log(e))
      } else {
        this.$store.dispatch("task/createTaskComment", { id: this.task.id, comment: data.text, text: `added comment ${trimComment}` })
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
    createTask($event) {
      console.log($event)
    },
  }
}

</script>
<style lang="scss" scoped>
.inbox-task { display: grid; grid-template-columns: none; grid-template-rows: 1fr 1fr minmax(400px, auto) 1fr; }
</style>
