<template>
  <article id="side-panel" class="side-panel" v-click-outside="closeSidebar">
    <div class="side-panel__header" id="ts-header">
      <!-- <div class="side-panel__header__file__info" id='ts-header-file-info'>
        <div id='ts-secondary-text' class="p-05 of-hidden text-of-elipsis h-fit text-wrap text-secondary"></div>
      </div> -->
      <div class="d-flex justify-between side-panel__header__actions mb-05" id="ts-side-panel">
        <div class="d-flex align-center gap-05" id="ts-icon-close-Wrapper">
          <div id='ts-icon-close' class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" v-tooltip="'Close'" title="Close" @click="$nuxt.$emit('close-sidebar')">
            <bib-icon icon="page-last" class="m-auto"></bib-icon>
          </div>
          <div class="d-flex cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2" id='ts-icon-external'>
            <bib-icon icon="expand-fullscreen" variant="gray6" class="m-auto"></bib-icon>
          </div>
        </div>
        <div class="d-flex gap-05 align-center" id="ts-icons-wrapper">

          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="ts-icon-2" v-tooltip="'Team'" title="Team" @click="showAddTeamModal">
            <bib-icon icon="user-group-solid" variant="gray5" ></bib-icon>
          </div>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-3' v-tooltip="'Subtasks'"  v-scroll-to="'#task_subtasks'">
            <bib-icon icon="check-square-solid" variant="gray5"></bib-icon>
          </div>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-4' v-tooltip="'Conversation'" v-scroll-to="'#task_conversation'">
            <bib-icon icon="comment-forum-solid" variant="gray5" ></bib-icon>
          </div>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-5' v-tooltip="'Files'" v-scroll-to="'#task_files'">
            <bib-icon icon="folder-solid" variant="gray5" ></bib-icon>
          </div>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="ts-icon-6" v-tooltip="isFavorite.text" @click="setFavorite">
            <bib-icon icon="bookmark-solid" :variant="isFavorite.variant" ></bib-icon>
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
                  <span class="list__item" id="project-id-list-item3" @click="copyTaskLink">
                      <bib-icon icon="duplicate" class="mr-075"></bib-icon> Copy Link
                  </span>
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
            <bib-icon icon="check-circle-solid" :variant="isComplete.variant" :scale="1.5"></bib-icon>
          </div>
          <div class="flex-grow-1">
            <!-- <span v-if="!editTitle" class="font-w-700" @click.stop="editTitle = true">{{form.title}}</span> -->
            <input type="text" class="editable-input" :class="{'error': error == 'invalid'}" ref="taskTitleInput" v-model="form.title" placeholder="Enter title..." v-on:keyup="debounceUpdate({name:'Title', field:'title', value:form.title})" >
            <!-- <bib-input v-else type="text" v-model="form.title" placeholder="Enter task name..." v-on:keyup.native="debounceUpdate('Title', form.title)" @blur="editTitle = false"></bib-input> -->
            <!-- <small v-show="error == 'invalid'" class="text-danger font-xs d-block" style="margin-top: -0.25rem;">Task name is required</small> -->
          </div>
          <div>
            <!-- <div class="team-avatar-list px-05">
              <bib-avatar v-for="(team, index) in teammates.main" :src="team.avatar" :key="index" v-tooltip="team.label" :title="team.label" :style="{ 'left': -0.5 * index + 'rem'}" class="border-gray2"></bib-avatar><span v-show="teammates.extra.length" class="extra">+{{teammates.extra.length}}</span>
            </div> -->
            <team-avatar-list :team="team"></team-avatar-list>
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

    <div class="of-scroll-y d-grid" id="ts-of-scroll-y" style="grid-template-columns: none; align-items: start">
      <sidebar-fields :task="currentTask" :loading="loading" @update-project-field="updateProject" @update-field="updateTask" @create-task="createTask"></sidebar-fields>
      <sidebar-subtask id="task_subtasks" @view-subtask="viewSubtask($event)" @close-sidebar-detail="showSubtaskDetail = false" ></sidebar-subtask>
      <sidebar-conversation id="task_conversation" :reloadComments="reloadComments" :reloadHistory="reloadHistory"></sidebar-conversation>
      <sidebar-files id="task_files" :reloadFiles="reloadFiles"></sidebar-files>
      <!-- <sidebar-history></sidebar-history> -->
      <button ref="topScroll" id="topScroll" style="visibility: hidden; opacity: 0" v-scroll-to="scrollId ? '#'+scrollId : '#sidebar-inner-wrap'"></button>
    </div>

    <div class="task-message-input d-flex gap-1 border-top-gray3 py-1 px-2">
      <bib-avatar :src="userPhoto" size="2rem" class="flex-shrink-0" ></bib-avatar>
      <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div>

    <!-- <add-member-to-task ref="taskTeamModal"></add-member-to-task> -->
    <bib-modal-wrapper v-if="taskTeamModal" title="Team" size="lg" @close="taskTeamModal = false">
      <template slot="content">
        <div style="height: 12rem;">
          <task-team :task="currentTask"></task-team>
        </div>
      </template>
    </bib-modal-wrapper>
    
    <subtask-detail v-if="showSubtaskDetail" @close-sidebar-detail="showSubtaskDetail = false"></subtask-detail>

  </article>
</template>

<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from "vuex"
import { userInfo } from '@/utils/userInfo.client'
import dayjs from 'dayjs'
import _ from 'lodash'
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

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
      // reloadSubtask: 1,
      taskTeamModal: false,
      showSubtaskDetail: false,
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
      currentTask: "task/getSelectedTask",
      favTasks: "task/getFavTasks",
    }),
    /*orgUsers() {
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
    },*/
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

    isFavorite() {
      let fav = this.favTasks.some(t => t.task.id == this.currentTask.id)
      if (fav) {
        return { variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { variant: "gray5", text: "Add to favorites", status: false }
      }
    },
    isComplete() {
      if (this.currentTask.statusId == 5) {
        return { variant: "success", text: "Completed" }
      } else {
        return { variant: "gray5", text: "Mark Completed" }
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
    currentTask(newVal) {
      // console.log(newVal)
      if (Object.keys(this.currentTask).length) {
        // this.form = JSON.parse(JSON.stringify(this.currentTask));
        this.form = _.cloneDeep(this.currentTask);
        if (this.currentTask.project?.length) {
          this.form.projectId = this.currentTask.project[0].projectId || this.currentTask.project[0].project.id
        } else {
          this.form.projectId = this.project.id
        }
        // console.info(this.$refs.topScroll)
      } else {
        this.form = {
          id: '',
          title: "",
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
        this.$nextTick(() => {
          this.$refs.taskTitleInput.focus()
        });

        if (this.sectionIdActive) {
          this.form.sectionId = this.sectionIdActive
        }
      }
    },
    scrollId(newValue, oldValue){
      // console.info(newValue, oldValue)
      this.$nextTick(() => {
        this.$refs.topScroll.click()
      });
    },
    showSubtaskDetail(newValue){
      if(!newValue){
        this.$store.dispatch("subtask/fetchSubtasks", this.currentTask )
      } 
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
    // console.info('mounted-> task sidebar')
    this.showSubtaskDetail = false
  },

  methods: {
    showAddTeamModal() {
      // this.$refs.taskTeamModal.showTaskTeamModal = true
      this.taskTeamModal = true
    },
    closeSidebar(event) {
      // console.log('click outside task-sidebar', event.srcElement, event.target)
      let main = document.getElementById("main-content").className
      // console.info(main.indexOf('open-sidebar'), main.contains('open-sidebar'))
      if(main.indexOf('open-sidebar') > 0){
        const classlist = ["cursor-pointer", "menu-item", "task-grid", "table__irow"]
        classlist.forEach(c => {
          // console.info(c)
          if (event.target.classList.contains(c)) {
            // console.log('class found->', c)
            return false
          } /*else {
            console.warn("v-click-outside event", event.originalTarget)
          }*/
        })

        this.showSubtaskDetail = false
        this.$nuxt.$emit("close-sidebar");
      }
    },
    createTask($event) {

      if (this.error == "valid") {
        this.loading = true

        let user;
        if (!$event.userId || $event.userId != "") {
          user = this.teamMembers.filter(u => u.id == $event.userId)
        } else {
          user = null
        }

        if ($event.projectId && (!$event.sectionId || $event.sectionId == "")) {
          $event.sectionId = "_section" + $event.projectId
        }

        if (!$event.projectId || $event.projectId == "") {
          $event.projectId = null
          $event.sectionId = null
        }

        this.$store.dispatch("task/createTask", {
          "sectionId": $event.sectionId,
          "projectId": $event.projectId,
          "title": this.form.title,
          "description": $event.description,
          "createdAt": $event.createdAt || new Date(),
          "startDate": $event.startDate || new Date(),
          "dueDate": $event.dueDate || new Date(),
          "priorityId": $event.priorityId,
          "budget": 0,
          "statusId": $event.statusId,
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

    updateTask(taskData) {
      
      // this.loading = true

      let updatedvalue = taskData.value
      let projectId = null
      if (taskData.name == 'Assignee') {
        let user = this.teamMembers.find(t => t.id == taskData.value)
        updatedvalue = user.label
      }
      // if (taskData.name == 'Project') {
      //   let proj = this.projects.find(t => t.id == taskData.value)
      //   updatedvalue = proj.title
      //   projectId = taskData.value
      // }
      if( taskData.name == 'Section') {
        this.sections.find(sec => {
          if(sec.id == taskData.value) {
            updatedvalue = sec.title
          }
        })
      }
      if (taskData.name == 'Status') {
        this.statusValues.find(s => {
          if (s.value == taskData.value) {
            updatedvalue = s.label
          }
        })
      }
      if (taskData.name == 'Priority') {
        this.priorityValues.find(p => {
          if (p.value == taskData.value) {
            updatedvalue = p.label
          }
        })
      }
      if (taskData.name == "Due date" || taskData.name == "Start date") {
        updatedvalue = dayjs(taskData.value).format('DD MMM, YYYY')
      }

      let user;
      if (taskData.field == 'userId' && taskData.value != "") {
        user = this.teamMembers.filter(u => u.id == taskData.value)
      } else {
        user = null
      }

      this.$store.dispatch("task/updateTask", {
        id: this.form.id,
        data: { [taskData.field]: taskData.value },
        user,
        projectId: projectId ? projectId : null,
        text: `changed ${taskData.name} to ${updatedvalue}`,
      })
        .then((u) => {
          // console.log(u)
          this.$nuxt.$emit("update-key")
          this.reloadHistory += 1
          // this.loading = false
        })
        .catch(e => {
          console.log(e)
          // this.loading = false
        })

    },

    async updateProject(taskData) {

      let proj = this.projects.find(t => t.id == taskData.projValue)

      let user;
      if (taskData.field == 'userId' && taskData.value != "") {
        user = this.teamMembers.filter(u => u.id == taskData.value)
      } else {
        user = null
      }

      this.$store.dispatch("task/updateTask", {
        id: this.form.id,
        data: { [taskData.projField]: taskData.projValue, [taskData.secField]: taskData.secValue },
        user,
        projectId: taskData.oldProjValue,
        projectChanged: true, // do not log history to project
        text: proj ? `changed project to ${proj.title}` : 'Task removed from Project',
      })
        .then((u) => {
          // console.log(u)
          this.$nuxt.$emit("update-key")
          this.reloadHistory += 1
          // this.loading = false
        })
        .catch(e => {
          console.log(e)
          // this.loading = false
        })

    },

    debounceUpdate: _.debounce(function(payload) {
      if (this.form.id) {
        // console.log('Debounce', payload)
        
        if (this.form.priorityId == "") {
          this.form.priority = null
          this.form.priorityId = null
        }
        if (this.form.statusId == "") {
          this.form.status = null
          this.form.statusId = null
        }
        // console.log(updatedvalue)
        this.updateTask({ name: payload.name, field: payload.field, value: payload.value })
        this.reloadComments += 1

      } else {
        console.log(this.form)
        // this.createTask()
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
          this.editMessage = {}
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

    // subtask detail
    viewSubtask($event){
      // console.log($event)
      this.showSubtaskDetail = true
      // this.$store.dispatch("subtask/setSelectedSubtask", $event)
      this.$store.commit("subtask/setSelectedSubtask", $event)
    },

    copyTaskLink() {
      let url = window.location.host + `/tasks/${this.currentTask.id}`;

      if (navigator.clipboard) { 
        navigator.clipboard.writeText(url);
      } else { 
        unsecuredCopyToClipboard(url);
      }
    },
  },
};

</script>
<style lang="scss" scoped>
.side-panel {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  
}

.row {
  padding: 0 1rem;

  .input {
    color: #ccc;
  }
}



</style>
