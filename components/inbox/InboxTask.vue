<template>
<client-only>
  <div id="inbox-task-wrapper" class="inbox-task h-100 position-relative" >
    <div class="d-flex justify-between pt-105 px-105 pb-05 side-panel__header__actions " id='it-inner-wrapper'>
      <div class="" id="it-mark-button-wrapper" >
        <span v-show="form.id">
         <bib-button :label="isComplete.text" :variant="isComplete.variant" icon="check-circle-solid" @click="markComplete"></bib-button >
        </span>
      </div>
      <div class="d-flex gap-05 align-center" id="it-icon-attachment-wrapper">
        <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='it-icon-3' v-tooltip="'Subtasks'" @click="scrollToSubtasks">
          <bib-icon icon="check-square-solid" variant="gray5"></bib-icon>
        </div>
        <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='it-icon-4' v-tooltip="'Conversation'" @click="scrollToConversation">
          <bib-icon icon="comment-forum-solid" variant="gray5"></bib-icon>
        </div>
        <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='it-icon-5' v-tooltip="'Files'" @click="scrollToFiles">
          <bib-icon icon="folder-solid" variant="gray5"></bib-icon>
        </div>
        <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="it-icon-6" v-tooltip="isFavorite.text" @click="setFavorite">
          <bib-icon icon="bookmark-solid" :variant="isFavorite.variant"></bib-icon>
        </div>
        <div id="it-list-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
          <bib-popup pop="horizontal-dots">
            <template v-slot:menu>
              <div class="list" id="it-list">
                <span class="list__item" id="it-list-item-1" @click="markComplete">
                  <bib-icon icon="check-circle-solid" :variant="isComplete.variant" class="mr-075"></bib-icon> {{isComplete.text}}
                </span>
                <span class="list__item" id="it-list-item-2" @click="setFavorite">
                  <bib-icon icon="bookmark-solid" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                </span>
                <!-- <span class="list__item" id="it-list-item-4" @click="showAddTeamModal">
                  <bib-icon icon="user-group-solid" variant="gray5" class="mr-075"></bib-icon> Team
                </span> -->
                <span class="list__item" id="'it-list-item-5'"  @click="scrollToSubtasks">
                  <bib-icon icon="check-square-solid" variant="gray5" class="mr-075"></bib-icon> Subtasks
                </span>
                <span class="list__item" id="'it-list-item-6'" @click="scrollToConversation">
                  <bib-icon icon="comment-forum-solid" variant="gray5" class="mr-075"></bib-icon> Conversation
                </span>
                <span class="list__item" id="'it-list-item-7'" @click="scrollToFiles">
                  <bib-icon icon="folder-solid" variant="gray5" class="mr-075"></bib-icon> Files
                </span>
                <hr>
                <span class="list__item list__item__danger" id="it-list-item-8" @click="deleteTask(item.taskId)">Delete</span>
              </div>
            </template>
          </bib-popup>
        </div>
      </div>
    </div>
    <!-- task title -->
    <div class=" border-bottom-gray3 position-relative px-105 pt-05 pb-05 " id="it-editable-input">
      <input type="text" class="editable-input" ref="taskTitleInput" v-model="form.title" placeholder="Enter task name..." v-on:keyup="debounceUpdate('Title', 'title', form.title)" id="it-taskTitleInput">
    </div>
    <div class="of-scroll-y position-relative py-05" id="it-of-scroll-y">
      <div class="border-bottom-gray3 px-105 py-05" v-show="form.id">
        <div class="align-center gap-05" >
          <span class="font-sm text-gray6" style="white-space: nowrap;">Assigned to</span> 
          <div class="mr-1" style="flex-basis: 2rem;">
            <user-select-two :userId="form.userId" mode="avatar" minWidth="15rem" maxWidth="18rem" @change="updateAssignee" ></user-select-two> <!-- <bib-avatar></bib-avatar> -->
          </div>
          <div class="align-center height-2 cursor-pointer" > 
            <user-select-two userId="" mode="icon" title="Add to team" min-width="15rem" max-width="18rem" @change="addTeamMember"></user-select-two>
            <team-list-two :team="team" @delete-member="deleteMember"></team-list-two>
            <!-- <bib-icon icon="user-group-solid"></bib-icon> -->
          </div>
        </div>
      </div>

      <sidebar-fields-two :task="form" @update-project-field="updateProject" @update-field="updateTask" @newtask-fields="updateTaskform"  :activeProp="form.id"></sidebar-fields-two>
      <sidebar-tag :tags="tags" @add-tag="addTag" @change="addTag" @delete-tag="removeTag"  :activeProp="form.id"></sidebar-tag>
      <sidebar-subtask id="inbox_task_subtasks" @view-subtask="viewSubtask($event)" @close-sidebar-detail="showSubtaskDetail = false"  :activeProp="form.id"></sidebar-subtask>
      <sidebar-files id="inbox_task_files" :reloadFiles="reloadFiles" :activeProp="form.id"></sidebar-files>
      <sidebar-conversation id="inbox_task_conversation" :reloadComments="reloadComments" :reloadHistory="reloadHistory" :activeProp="form.id"></sidebar-conversation>
    </div>
    <!-- message input -->
    <div id="it-message-input" class=" d-flex gap-1 border-top-light py-1 px-105">
      <bib-avatar :src="user.Photo" size="2rem" class="flex-shrink-0"></bib-avatar>
      <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div>
    
    <subtask-detail v-if="showSubtaskDetail" @close-sidebar-detail="showSubtaskDetail = false"></subtask-detail>

    <loading :loading="loading"></loading>
  </div>
</client-only>
</template>

<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import dayjs from 'dayjs'
export default {

  name: 'InboxTask',
  props: {
    task: Object,
    // commentKey: Number,
  },

  data() {
    return {
      loading: false,
      statusValues: STATUS,
      priorityValues: PRIORITY,
      department: DEPARTMENT,
      form: {},
      value: {
        files: []
      },
      editMessage: {},
      reloadComments: 1,
      reloadHistory: 1,
      reloadFiles: 1,
      showSubtaskDetail: false,
      tags: [],
    }
  },
  watch: {
    task(newValue){
      this.form = _.cloneDeep(newValue)
      this.getTags()
      this.$store.dispatch("task/fetchTeamMember", this.task)
      this.reloadFiles++;
      this.reloadComments++;
      this.reloadHistory++;
    },
    showSubtaskDetail(newValue){
      if(!newValue){
        this.$store.dispatch("subtask/fetchSubtasks", this.task )
      }
    },
    /*commentKey(newValue){
      this.reloadComments += 1
    },*/
    
  },
  computed: {
    ...mapGetters({
      favTasks: "task/getFavTasks",
      team: 'task/getTaskMembers',
      departments: "department/getAllDepartments",
      teamMembers: "user/getTeamMembers",
      projects: "project/getAllProjects",
      sections: "section/getProjectSections",
      alltags: "company/getCompanyTags",
    }),
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
  },
  created() {
    this.$nuxt.$on("edit-message", (msg) => {
      this.editMessage = msg
    })
  },

  /*created(){
    this.$nuxt.$on("reload-comments", () => {
      console.log("emitted from inbox history")
      this.reloadComments += 1
    })
  },*/

  methods: {
    markComplete() {
      this.loading = true
      this.$store.dispatch('task/updateTaskStatus', this.task)
        .then((d) => {
          this.loading = false
          this.$emit("update-key", d)
          this.$store.dispatch("task/setSingleTask", d)
          this.reloadComments += 1
        }).catch(e => {
          this.loading = false
        })
    },
    setFavorite() {
      if (this.isFavorite.status) {
        this.$store.dispatch("task/removeFromFavorite", { id: this.task.id })
          .then(msg => console.log(msg))
          .catch(e => console.log(e))
      } else {
        this.$store.dispatch("task/addToFavorite", { id: this.task.id })
          .then(msg => console.log(msg))
          .catch(e => console.log(e))
      }
    },
    /*showAddTeamModal() {
      this.$nuxt.$emit("add-member-to-task")
    },*/

    updateAssignee(userData){
      let user = this.teamMembers.filter(u => u.id == userData.id)
      // console.log(userData, user)

      this.$store.dispatch("task/updateTask", {
        id: this.form.id,
        data: { userId: userData.id},
        user,
        // projectId: projectId ? projectId : null,
        text: `changed Assignee to ${userData.label}`,
      })
        .then((u) => {
          this.$nuxt.$emit("update-key")
          // this.$store.dispatch("task/setSingleTask", u)
          this.reloadHistory += 1
        })
        .catch(e => {
          console.log(e)
        })
    },

    addTeamMember(userData){
      console.log(userData)

      this.$store.dispatch('task/addMember', { taskId: this.form.id, team: [userData], text: `added ${userData.label} to task` })
        .then((res) => {
          if (res.statusCode == 200) {
            this.popupMessages.push({text: res.message, variant: "success"})
            this.$store.dispatch('task/fetchTeamMember', { id: this.form.id })
          } else {
            this.popupMessages.push({text: res.message, variant: "warning"})
            console.warn(res)
          }
        })
        .catch((err) => {
          console.warn(err)
        })
    },

    async deleteMember(member) {
      console.log(member)
      await this.$store.dispatch("task/deleteMember", { taskId: this.form.id, memberId: member.id, text: `removed ${member.label}` })
        .then((res) => {
          this.$store.dispatch('task/fetchTeamMember', { id: this.form.id })
          this.popupMessages.push({text: "Deleted successfully", variant: "success"})
        })
        .catch(e => console.warn(e))
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

      }
    }, 1000),

    updateTask(taskData, historyText, projectId) {

      let updatedvalue = taskData.value
      if (taskData.name == 'Assignee') {
        let userFound = this.teamMembers.find(t => t.id == taskData.value)
        updatedvalue = userFound.label
      }
      if (taskData.name == 'Project') {
        let userFound = this.projects.find(t => t.id == taskData.value)
        updatedvalue = userFound.title
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

      if (taskData.name == 'Department') {
        this.departments.find(d => {
          if (d.value == taskData.value) {
            updatedvalue = d.label
          }
        })
      }

      if( taskData.name == 'Section') {
        this.sections.find(sec => {
          if(sec.id == taskData.value) {
            updatedvalue = sec.title
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
        projectId: this.form.projectId ? this.form.projectId : null,
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
        text: proj ? `changed project to ${proj.title}` : `Task removed from Project`,
      })
        .then((u) => {
          this.$nuxt.$emit("update-key")
          this.reloadHistory += 1
        })
        .catch(e => {
          console.log(e)
        })

    },
    
    onFileInput(payload) {
      this.value.files = payload.files
    },
    onsubmit(data) {
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
        _.delay(() => {
          this.reloadFiles += 1;
          this.value.files = []
        }, 1200)
      }
    },
    createTask($event) {
      console.log($event)
    },
    viewSubtask($event){
      this.showSubtaskDetail = true
      this.$store.commit("subtask/setSelectedSubtask", $event)
    },
    updateTaskform(taskfields){
      this.form = taskfields
      this.createTask(this.form)
    },

    async getTags(){
      if (this.form.id) {
        const tags = await this.$axios.get("/tag/task/"+this.form.id, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          }
        })
        // console.log(tags.data)
        if (tags.data.statusCode == 200) {
          this.tags = tags.data.data.map(t => t.tag)
        }
      }
    },
    addTag(tag){
      if (tag.id) {
        // console.log('existing tag->', tag.id, tag.content)
        this.$axios.post("/tag/assign-to-task",  { tagId: tag.id, taskId: this.form.id }, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          }
        })
        .then(res => {
          // console.log(res)
          this.getTags()
          this.$nuxt.$emit("update-key")
        })
        .catch(e => console.error(e))
      } else {
        // console.log('new tag->', tag)
        let tagExist = this.alltags.find(t => t.content == tag)
        if (tagExist) {
          // console.log('tag already exists', tag)
          this.popupMessages.push({text: "tag already exists", variant: "orange"})
          return
        } else {
          this.$store.dispatch("company/addCompanyTag", {content: tag})
          .then((res)=>{
            // console.log(res.data)
            if (res.data.statusCode == 200) {
              this.$store.dispatch("company/fetchCompanyTags")
              this.$axios.post("/tag/assign-to-task",  { tagId: res.data.data.id, taskId: this.form.id }, {
                headers: {
                  "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                }
              }).then((res) => {
                // console.log(res)
                this.getTags()
                this.$nuxt.$emit("update-key")
              }).catch(e=>console.error(e))
            } else {
              console.warn("error creating tag")
            }
          })
          .catch(e=>console.error(e))
        }
      }
    },
    removeTag(tag){
      // console.log(tag)
      this.$axios.delete("/tag/remove-from-task", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "tagid": tag.id,
          "taskid": this.form.id,
        }
      }).then(res => {
        console.log(res.data.message)
        this.getTags()
        this.$nuxt.$emit("update-key")
      }).catch(e => console.warn(e))
    },

    scrollToSubtasks() {
    this.$nextTick(() => {
      const element = document.getElementById('inbox_task_subtasks');
      console.log(element)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' ,block: "center" });
      }
    });
  },
  scrollToFiles() {
    this.$nextTick(() => {
      const element = document.getElementById('inbox_task_files');
      console.log(element)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth',block: "center" });
      }
    });
  },
  scrollToConversation() {
    this.$nextTick(() => {
      const element = document.getElementById('inbox_task_conversation');
      console.log(element)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' ,block: "end"});
      }
    });
  },
  }
}

</script>
<style lang="scss" scoped>
  .inbox-task { display: grid; grid-template-columns: none; grid-template-rows: 1fr 1fr minmax(400px, auto) 1fr; }
</style>
