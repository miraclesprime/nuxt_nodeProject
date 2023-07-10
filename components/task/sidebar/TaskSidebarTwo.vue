<template>
  <article id="side-panel-wrapper" class="side-panel" v-click-outside="closeSidebar">
    <div class="side-panel__header" id="tsb-header">
      <div class="d-flex justify-between pt-105 px-105 pb-05" id="ts-side-panel">
        <div class="" id="tsb-mark-button-wrapper">
          <!-- <div class="bg-light shape-rounded px-1 height-2 d-inline-flex gap-05 align-center justify-center cursor-pointer" @click="markComplete">
            <bib-icon icon="check-circle-solid" :variant="isComplete.variant" :scale="1"></bib-icon> <span class="font-md text-secondary">{{isComplete.text}}</span>
          </div> -->
           <bib-button :label="isComplete.text" :variant="isComplete.variant" icon="check-circle-solid" @click="markComplete"></bib-button>
        </div>
        <div class="d-flex gap-05 align-center" id="tsb-icons-wrapper">
          <div class="d-flex cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2" id='tsb-icon-external' >
            <bib-icon icon="expand-fullscreen" variant="gray6" class="m-auto"></bib-icon>
          </div>
          <!-- <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="tsb-icon-2" title="Team" @click="showAddTeamModal">
            <bib-icon icon="user-group-solid" variant="gray5" ></bib-icon>
          </div> -->
          <!-- <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='tsb-icon-3' v-scroll-to="'#task_subtasks'">
            <bib-icon icon="check-square-solid" variant="gray5"></bib-icon>
          </div> -->
          <!-- <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='tsb-icon-4' v-scroll-to="'#task_conversation'">
            <bib-icon icon="comment-forum-solid" variant="gray5" ></bib-icon>
          </div> -->
          <!-- <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='tsb-icon-5' v-scroll-to="'#task_files'">
            <bib-icon icon="folder-solid" variant="gray5" ></bib-icon>
          </div> -->
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="tsb-icon-6" @click="setFavorite">
            <bib-spinner v-if="favProcess" :scale="2" ></bib-spinner>
            <bib-icon v-else icon="bookmark-solid" :variant="isFavorite.variant" ></bib-icon>
          </div>
          <div id="tsb-list-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
            <bib-button pop="elipsis">
              <template v-slot:menu>
                <div class="list" id="tsb-list">
                  <span class="list__item" id="tsb-list-item-1" @click="markComplete">
                    <bib-icon icon="check-circle-solid" :variant="isComplete.variant" class="mr-075"></bib-icon> {{isComplete.text}}
                  </span>
                  <span class="list__item" id="tsb-list-item-2" @click="setFavorite">
                    <bib-spinner v-if="favProcess" :scale="2" ></bib-spinner>
                    <bib-icon v-else icon="bookmark-solid" :variant="isFavorite.variant" class="mr-075"></bib-icon>
                    {{isFavorite.text}}
                  </span>
                  <!-- <span class="list__item" id="tsb-list-item-4" @click="showAddTeamModal">
                    <bib-icon icon="user-group-solid" variant="gray4" class="mr-075" ></bib-icon> Team
                  </span> -->
                  <span class="list__item" id="tsb-list-item-5" v-scroll-to="'#task_subtasks'">
                    <bib-icon icon="check-square-solid" variant="gray4" class="mr-075" v-scroll-to=""></bib-icon> Subtasks
                  </span>
                  <span class="list__item" id="tsb-list-item-7" v-scroll-to="'#task_conversation'">
                    <bib-icon icon="comment-forum-solid" variant="gray4" class="mr-075"></bib-icon> Conversation
                  </span>
                  <span class="list__item" id="tsb-list-item-3" v-scroll-to="'#task_files'">
                    <bib-icon icon="folder-solid" variant="gray4" class="mr-075"></bib-icon> Files
                  </span>
                  <span class="list__item" id="tsb-project-id-list-item3" @click="copyTaskLink">
                      <bib-icon icon="duplicate" class="mr-075"></bib-icon> Copy Link
                  </span>
                  <hr>
                  <span class="list__item list__item__danger" id="tsb-list-item-8" @click="deleteTask(currentTask)">Delete</span>
                </div>
              </template>
            </bib-button>
          </div>
          <div id='tsb-icon-close' class="shape-circle bg-hover-light width-2 height-2 d-flex cursor-pointer" title="Close" @click="$nuxt.$emit('close-sidebar')">
            <bib-icon icon="close" class="m-auto"></bib-icon>
          </div>
        </div>
      </div>
      <div class=" border-bottom-gray3 position-relative px-105 pt-05 pb-105 mb-1" id="tsb-row">
        <input type="text" class="editable-input" :class="{'error': error == 'invalid'}" ref="taskTitleInput" v-model.trim="form.title" placeholder="Enter Task Name ..." v-on:keyup="debounceUpdate({name:'Title', field:'title', value:form.title})" >
      </div>
      
    </div>

    <div class="overflow-y-auto d-grid" id="tsb-of-scroll-y" style="grid-template-columns: none; align-items: start">
      <div class="border-bottom-gray3 px-105 py-05">
        <div class="align-center gap-05" >
          <span class="font-sm text-gray6" style="white-space: nowrap;">Assigned to</span> 
          <div style="flex-basis: 2rem;">
            <user-select :userId="currentTask.userId" mode="avatar" minWidth="15rem" maxWidth="18rem" @change="updateAssignee" ></user-select> <!-- <bib-avatar></bib-avatar> -->
          </div>
          <!-- <div class="d-inline-flex align-center">
          </div> -->
        
          <div class="align-center height-2 cursor-pointer" @click="showAddTeamModal"> 
            <div class="width-2 height-2 bg-success-sub6 align-center justify-center shape-circle">
              <bib-icon icon="add" variant="success"></bib-icon>
            </div>
            <team-avatar-list :team="team"></team-avatar-list>
            <!-- <bib-icon icon="user-group-solid"></bib-icon> -->
          </div>
        </div>
      </div>

      <sidebar-fields-two :task="currentTask" @update-project-field="updateProject" @update-field="updateTask" @newtask-fields="updateTaskform" ></sidebar-fields-two>
      <sidebar-subtask id="task_subtasks" @view-subtask="viewSubtask($event)" @close-sidebar-detail="showSubtaskDetail = false" ></sidebar-subtask>
      <sidebar-files id="task_files" :reloadFiles="reloadFiles"></sidebar-files>
      <sidebar-conversation id="task_conversation" :reloadComments="reloadComments" :reloadHistory="reloadHistory"></sidebar-conversation>
      <!-- <button ref="topScroll" id="topScroll" style="visibility: hidden; opacity: 0" v-scroll-to="scrollId"></button> -->
    </div>

    <div class="task-message-input d-flex gap-1 border-top-gray3 py-1 px-2">
      <bib-avatar :src="userPhoto" size="2rem" class="flex-shrink-0" ></bib-avatar>
      <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div>

    <!-- <confirm-dialog v-if="confirmModal" :message="confirmMsg" @close="confirmDelete"></confirm-dialog> -->
    <!-- <bib-modal-wrapper v-if="taskTeamModal" title="Team" size="lg" @close="taskTeamModal = false">
      <template slot="content">
        <div style="min-height: 12rem;">
          <task-team :task="currentTask"></task-team>
        </div>
      </template>
    </bib-modal-wrapper> -->
    
    <subtask-detail v-if="showSubtaskDetail" @close-sidebar-detail="showSubtaskDetail = false"></subtask-detail>

  </article>
</template>

<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from "vuex"
import dayjs from 'dayjs'
import _ from 'lodash'
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: "TaskSidebar",
  props: {
    sectionIdActive: Number,
    // scrollId: {type: String, default: "sidebar-inner-wrap"},
    departmentId: {type: Number},
    // visible: Boolean,
  },
  data: function() {
    return {
      loading: false,
      favProcess: false,
      form: {},
      statusValues: STATUS,
      priorityValues: PRIORITY,
      department: DEPARTMENT,
      value: {
        files: []
      },
      editMessage: {},
      reloadComments: 1,
      reloadHistory: 1,
      reloadFiles: 1,
      // taskTeamModal: false,
      showSubtaskDetail: false,
      taskToDelete: {},
      // confirmModal: false,
      // confirmMsg: "",
    };
  },

  computed: {
    ...mapGetters({
      user: "user/getUser2",
      teamMembers: "user/getTeamMembers",
      tasks: "task/tasksForListView",
      team: 'task/getTaskMembers',
      departments: "department/getAllDepartments",
      project: "project/getSingleProject",
      projects: "project/getAllProjects",
      sections: "section/getProjectSections",
      currentTask: "task/getSelectedTask",
      favTasks: "task/getFavTasks",
      sideBarUser:"user/getSideBarUser"
    }),
    
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
        return { variant: "gray4", text: "Add to favorites", status: false }
      }
    },
    isComplete() {
      if (this.currentTask.statusId == 5) {
        return { variant: "success", text: "Completed" }
      } else {
        return { variant: "light", text: "Mark Completed" }
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
      this.showSubtaskDetail = false
      if (Object.keys(this.currentTask).length) {
        this.form = _.cloneDeep(this.currentTask);
        if (this.currentTask.project?.length) {
          this.form.projectId = this.currentTask.project[0]?.projectId || this.currentTask.project[0].project?.id
        } else {
          this.form.projectId = this.project?.id
        }
        this.reloadFiles += 1
      } else {
        this.form = {
          id: '',
          title: "",
          createdAt: "",
          startDate: "",
          dueDate: "",
          userId: "",
          sectionId: "",
          departmentId: this.departmentId || null,
          projectId: "",
          statusId: null,
          priorityId: null,
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
    /*scrollId(newValue, oldValue){
      this.$nextTick(() => {
        this.$refs.topScroll.click()
      });
    },*/
    showSubtaskDetail(newValue){
      if(!newValue){
        this.$store.dispatch("subtask/fetchSubtasks", this.currentTask )
      } 
    },

  },

  created(){
    this.$nuxt.$on("edit-message", (msg) => {
      this.editMessage = msg
    })
  },

  mounted() {
    this.$store.dispatch("project/fetchProjects")
    this.showSubtaskDetail = false
  },

  methods: {
    showAddTeamModal() {
      // this.taskTeamModal = true
      console.info("clicked to open team modal")
    },
    closeSidebar(event) {
      let main = document.getElementById("main-content").className
      if(main.indexOf('open-sidebar') > 0){
        const classlist = ["cursor-pointer", "menu-item", "task-grid", "table__irow"]
        classlist.forEach(c => {
          if (event.target.classList.contains(c)) {
            return false
          } 
        })

        this.showSubtaskDetail = false
        this.$nuxt.$emit("close-sidebar");
      }
    },
    createTask(taskform) {

      if (this.error == "valid") {
        this.loading = true

        let user;
        if (!taskform.userId || taskform.userId != "") {
          user = this.teamMembers.filter(u => u.id == taskform.userId)
        } else {
          user = null
        }

        if (taskform.projectId && (!taskform.sectionId || taskform.sectionId == "")) {
          taskform.sectionId = "_section" + taskform.projectId
        } else {
          taskform.sectionId = ""
        }

        if (!taskform.projectId || taskform.projectId == "") {
          taskform.projectId = null
          taskform.sectionId = null
        }

        this.$store.dispatch("task/createTask", {
          "sectionId": taskform.sectionId,
          "projectId": taskform.projectId,
          "title": this.form.title,
          "description": taskform.description,
          "startDate": taskform.startDate,
          "dueDate": taskform.dueDate,
          "priorityId": taskform.priorityId,
          "departmentId": taskform.departmentId,
          "budget": taskform.budget,
          "statusId": taskform.statusId,
          user,
          "text": `task "${this.form.title}" created`,
        }).then((task) => {
          this.$store.dispatch("task/setSingleTask", task.data)
          this.$emit("update-key")
          this.$nuxt.$emit("update-key")
          this.loading = false
        }).catch(e => {
          console.warn(e)
          this.loading = false
        })
      }
    },

    updateTask(taskData) {
      // console.log(taskData)
      let updata={[taskData.field]: taskData.value}
      let updatedvalue = taskData.value
      let projectId = null
      /*if (taskData.name == 'Assignee') {
        let user = this.teamMembers.find(t => t.id == taskData.value)
        updatedvalue = user.label
      }*/
      if( taskData.name == 'Section') {
        this.sections.find(sec => {
          if(sec.id == taskData.value) {
            updatedvalue = sec.title
          }
        })
      }
      if (taskData.name == 'Status') {

        if(taskData.value == 0) {
          taskData.value = null
        }

        this.statusValues.find(s => {
          if (s.value == taskData.value) {
            updatedvalue = s.label
          }
        })
      }

      if (taskData.name == 'Priority') {
        if(taskData.value == 0) {
          taskData.value = null
        }
        
        this.priorityValues.find(p => {
          if (p.value == taskData.value) {
            updatedvalue = p.label
          }
        })
      }
      if (taskData.name == 'Department') {
        let dp = this.departments.find(d => {
            if(taskData.value == undefined) {
              return null;
            } 
            if(d.value == taskData.value) {
              return d.label;
            }
          })
          console.log(dp)
          if(dp == undefined) {
            updata = { [taskData.field]: null}
            updatedvalue = "not assigned"
          } else {
            updatedvalue = dp.label
          }
      }
      if (taskData.name == "Due date" || taskData.name == "Start date") {
        updatedvalue = dayjs(taskData.value).format('DD MMM YYYY')
      }

      let user;
      if (taskData.field == 'userId' && taskData.value != "") {
        user = this.teamMembers.filter(u => u.id == taskData.value)
      } else {
        user = null
      }
      
      this.$store.dispatch("task/updateTask", {
        id: this.form.id,
        data: updata,
        user,
        projectId: projectId ? projectId : null,
        text: `changed ${taskData.name} to ${updatedvalue}`,
      })
        .then((u) => {
          this.$nuxt.$emit("update-key")
          this.reloadHistory += 1
        })
        .catch(e => {
          console.log(e)
        })

    },

    updateAssignee(userData){
      console.log(userData)
      let user = this.teamMembers.filter(u => u.id == userData.id)

      this.$store.dispatch("task/updateTask", {
        id: this.form.id,
        data: { userId: userData.id},
        user,
        // projectId: projectId ? projectId : null,
        text: `changed Assignee to ${userData.label}`,
      })
        .then((u) => {
          this.$nuxt.$emit("update-key")
          this.reloadHistory += 1
        })
        .catch(e => {
          console.log(e)
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
          this.$nuxt.$emit("update-key")
          this.reloadHistory += 1
        })
        .catch(e => {
          console.log(e)
        })
    },

    updateTaskform(taskfields){
      this.form = taskfields
      this.createTask(this.form)
    },

    debounceUpdate: _.debounce(function(payload) {
      if (this.form.id) {
        
        if (this.form.priorityId == "") {
          this.form.priority = null
          this.form.priorityId = null
        }
        if (this.form.statusId == "") {
          this.form.status = null
          this.form.statusId = null
        }
        this.updateTask({ name: payload.name, field: payload.field, value: payload.value })
        this.reloadComments += 1

      } else {
        // if new task
        this.$refs.taskTitleInput.blur()
        this.form.projectId = this.project?.id || ""
        this.form.userId=this.sideBarUser?.id || this.sideBarUser || "";
        this.createTask(this.form)
        this.$store.dispatch("user/setSideBarUser",[])
        
      }
    }, 500),
    setFavorite() {
      this.favProcess = true
      if (this.isFavorite.status) {
        this.$store.dispatch("task/removeFromFavorite", { id: this.currentTask.id })
          .then(msg => console.log(msg))
          .catch(e => console.log(e))
          .then(()=>this.favProcess = false)
      } else {
        this.$store.dispatch("task/addToFavorite", { id: this.currentTask.id })
          .then(msg => console.log(msg))
          .catch(e => console.log(e))
          .then(()=>this.favProcess = false)
      }
    },
    markComplete() {
      this.loading = true
      this.$store.dispatch('task/updateTaskStatus', this.currentTask)
        .then((d) => {
          this.loading = false
          this.$nuxt.$emit("update-key")
          this.$store.dispatch("task/setSingleTask", d)
          this.reloadComments += 1
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
    },
    // confirmDelete(state){
    //   this.confirmModal = false
    //   this.confirmMsg = ""
    //   if (state) {
    //     this.$store.dispatch("task/deleteTask", this.taskToDelete)
    //     .then(t => {
    //       if (t.statusCode == 200) {
    //         this.$nuxt.$emit("close-sidebar");
    //         this.$nuxt.$emit("update-key", t.message)
    //         this.taskToDelete = {}
    //       } else {
    //         console.warn(t.message);
    //       }
    //     })
    //     .catch(e => {
    //       console.warn(e)
    //     })
    //   } else {
    //     this.taskToDelete = {}
    //   }
    // },
    deleteTask(task) {
      if (task) {
        this.$store.dispatch("task/deleteTask", task)
        .then(t => {
          if (t.statusCode == 200) {
            this.$nuxt.$emit("close-sidebar");
            this.$nuxt.$emit("update-key", t.message)
            // this.taskToDelete = {}
          } else {
            console.warn(t.message);
          }
        })
        .catch(e => {
          console.warn(e)
        })
      } else {
        // this.taskToDelete = {}
      }
      // this.taskToDelete = task
      // this.confirmMsg = "Are you sure "
      // this.confirmModal = true
    },
    onFileInput(payload) {
      this.value.files = payload.files
    },
    onsubmit(data) {
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
    viewSubtask(subtask){
      this.showSubtaskDetail = true
      this.$store.dispatch("subtask/setSelectedSubtask", subtask)
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
  grid-template-rows: 1fr minmax(4fr, auto) 1fr;
  color: var(--bib-secondary);
}

.editable-input { border-color: var(--bib-light)}

.row {
  padding: 0 1rem;

  .input {
    color: #ccc;
  }
}



</style>
