<template>
  <section id="subtask-detail-wrapper" class="position-absolute subtask-detail-wrapper bg-white">
    <div class="d-flex align-center gap-05 px-105 py-075">
      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" title="Close" @click="closeSidebarDetail">
        <bib-icon icon="page-last" class="m-auto"></bib-icon>
      </div>
      <span v-show="showTaskTitle" class="text-underline cursor-pointer" @click="gotoParent">{{form?.task?.title}}</span>
      <div class="ml-auto d-flex align-center gap-05">
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="ts-icon-6" v-tooltip="isFavorite.text" @click="setFavorite">
            <bib-icon icon="bookmark-solid" :variant="isFavorite.variant" ></bib-icon>
          </div>
          <div class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
            <bib-button pop="horizontal-dots">
              <template v-slot:menu>
                <div class="list" id="ts-list">
                  <span class="list__item" id="ts-list-item-1" @click="markComplete">
                    <bib-icon icon="check-circle-solid" :variant="isComplete.variant" class="mr-075"></bib-icon> {{isComplete.text}}
                  </span>
                  <span class="list__item" id="ts-list-item-2" @click="setFavorite">
                    <bib-icon icon="bookmark-solid" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                  </span>
                  <!-- <span class="list__item" id="ts-list-item-4" @click="showAddTeamModal">
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
                  </span> -->
                  
                  <hr>
                  <span class="list__item list__item__danger" id="ts-list-item-8" @click="$nuxt.$emit('delete-subtask', subtask)">Delete</span>
                </div>
              </template>
            </bib-button>
          </div>
      </div>
    </div>
    <div class="border-top-gray3 border-bottom-gray3 position-relative px-105 py-025 mb-1">
      <div class="d-flex align-center gap-05">
        <div class="width-2 height-2 d-inline-flex align-center justify-center cursor-pointer" @click="markComplete">
          <bib-icon icon="check-circle-solid" :variant="isComplete.variant" :scale="1.5"></bib-icon>
        </div>
        <div class="flex-grow-1">
          <input type="text" class="editable-input" :class="{'error': error == 'invalid'}" ref="subtaskTitleInput" v-model="form.title" placeholder="Enter title..." v-on:keyup="debounceUpdateField({field: 'title', value: form.title, name: 'Title'})">
        </div>
        <div>
          <team-avatar-list :team="team"></team-avatar-list>
        </div>
        <div class="d-flex align-center justify-center width-2 height-2 shape-circle bg-light cursor-pointer" v-tooltip="'Team'" @click="showAddTeamModal">
          <bib-icon icon="user-group-solid"></bib-icon>
        </div>
        <!-- <div class="d-flex align-center justify-center width-2 height-2 shape-circle bg-light cursor-pointer" :title="assignee.label">
          <bib-avatar :src="assignee.avatar" size="1.5rem"></bib-avatar>
        </div> -->
      </div>
      <!-- <loading :loading="loading"></loading> -->
    </div>
    <!-- other fields -->
    <div class="of-scroll-y px-105">
      <div class="row">
        <div class="col-4">
          <bib-select label="Assignee" test_id="subtask_assignee_select" :options="orgUsers" v-model="form.userId" v-on:change="updateSubtask({field: 'userId', value: form.userId, name: 'User' })"></bib-select>
        </div>
        <div class="col-4">
          <bib-datepicker v-model="startDateInput" :value="startDateInput" format="dd MMM yyyy" label="Start date" placeholder="Start date" @input="updateSubtask({name: 'Start date', field: 'startDate', value: form.startDate})"></bib-datepicker>
        </div>
        <div class="col-4">
          <bib-datepicker class="align-right" v-model="dueDateInput" :value="dueDateInput" format="dd MMM yyyy" label="Due date" placeholder="Due date" @input="updateSubtask({field: 'dueDate', value: form.dueDate, name: 'Due date'})"></bib-datepicker>
        </div>
        <!-- <div class="col-6"></div> -->
      </div>
      <div class="row ">
        <div class="col-4">
          <bib-input type="select" label="Priority" v-model.number="form.priorityId" :options="priorityValues" placeholder="Please select..." v-on:change.native="updateSubtask({field: 'priorityId', value: form.priorityId, name: 'Priority'})"></bib-input>
        </div>
        <div class="col-4">
          <bib-input type="select" label="Status" v-model.number="form.statusId" :options="statusValues" placeholder="Please select..." v-on:change.native="updateSubtask({field: 'statusId', value: form.statusId, name: 'Status'})"></bib-input>
        </div>
        <div class="col-4" >
          <bib-input type="select" label="Department" :options="departments" v-model.number="form.departmentId" v-on:change.native="updateSubtask({name:'Department', field: 'departmentId', value: form.departmentId})"></bib-input>
        </div>
      </div>
      <div class="row ">
        <div class="col-12">
          <bib-input type="textarea" v-model.trim="form.description" placeholder="Enter subtask description..." label="Description" v-on:keyup.native="debounceUpdateField({field: 'description', value: form.description, name: 'Description'})"></bib-input>
        </div>
      </div>
      <div class="py-05 ">
        <div class="d-flex justify-between sub-title pb-05 mb-05 border-bottom-gray2 ">
          <p class="text-gray5 font-md ">Conversation </p>
        </div>
        <div v-if="loadingComments" class="my-05">
          <div class="d-inline-flex gap-05 align-center ">
            <div class="shape-circle width-2 height-2 animated-background"></div>
            <div>
              <div class="animated-background width-10 mb-025" style="height: 0.8rem"></div>
              <div class="animated-background width-7" style="height:0.6rem"></div>
            </div>
          </div>
        </div>
        <template v-else-if="sortedData.length > 0">
          <div v-for="item in sortedData">
            <!-- <task-message v-if="item.comment" :msg="item" @delete-message="onDeleteMessage"></task-message> -->
            <message v-if="item.comment" :msg="item" fieldkey="subtask" @delete-message="onDeleteMessage"></message>
            <task-history v-if="item.text && !item.isHidden" :history="item"></task-history>
          </div>
        </template>

        <sidebar-files id="subtask_files" mode="subtask" :reloadFiles="reloadFiles"></sidebar-files>

      </div>
    </div>
    <!-- message input -->
    <div class="task-message-input d-flex gap-1 border-top-gray3 py-1 px-105">
      <bib-avatar :src="user2.Photo" size="2rem" class="flex-shrink-0"></bib-avatar>
      <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div>

    <bib-modal-wrapper v-if="taskTeamModal" title="Team" size="lg" @close="taskTeamModal = false">
      <template slot="content">
        <div style="min-height: 12rem;">
          <task-team :task="subtask" mode="subtask" ></task-team>
        </div>
      </template>
    </bib-modal-wrapper>
  </section>
</template>
<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
import _ from 'lodash'
export default {

  name: 'SubtaskDetail',
  props: {
      // subtask: Object,
    showTaskTitle: { type: Boolean, default: true },
    titleClick: { type: String, default: "close" }
  },
  data() {
    return {
      statusValues: STATUS,
      priorityValues: PRIORITY,
      /*form: {
        title: '',

      },*/
      error: '',
      loading: false,
      loadingComments: false,
      // comments: [],
      value: {
        files: [
          /*{ id: 156, name: 'thefile.png' },
          { id: 282, name: 'anotherfile.jpg' },*/
        ]
      },
      editMessage: {},
      // isFavorite: { variant: "gray5", text: "Add to favorites", status: false },
      // subkey: 0,
      reloadFiles: 0,
      taskTeamModal: false,
    }
  },
  computed: {
    ...mapGetters({
      user2: "user/getUser2",
      subtask: "subtask/getSelectedSubTask",
      team: 'subtask/getSubtaskMembers',
      favsubtasks: "subtask/getFavSubtasks",
      subtaskComments: "subtask/getSubTaskComments",
      subtaskHistory: "subtask/getSubtaskHistory",
      teamMembers: "user/getTeamMembers",
      departments: "department/getAllDepartments",
    }),

    orgUsers() {
      let data = this.teamMembers
        .map(u => {
          return { label: u.firstName + ' ' + u.lastName, img: u.avatar, value: u.id }
        })
      return [{ label: 'Please select...', value: null }, ...data]
    },

    form: {
      get() {
        return _.cloneDeep(this.subtask)
      },
      set(newValue) {
        // console.log(newValue)
        // this.title = newValue.title
      }
    },

    isComplete() {
      if (this.form.isDone) {
        return { variant: "success", text: "Completed" }
      } else {
        return { variant: "gray5", text: "Mark Completed" }
      }
    },

    assignee() {
      // return this.$userInfo(this.form.userId)
      // const team = store.state.user.teamMembers
      if (this.teamMembers.length > 0 && this.form.userId) {
        return this.teamMembers.find((m) => m.id == this.form.userId)
      } else {
        return { Name: "no user found" }
      }
    },
    startDateInput: {
      get() {
        if (!this.form.startDate) {
          return null
        } else {
          return new Date(this.form.startDate)
        }
      },
      set(newValue) {
        if(!newValue)this.form.startDate="";
        else
        this.form.startDate = new Date(newValue)
      }
    },
    dueDateInput: {
      get() {
        if (!this.form.dueDate) {
          return null
        } else {
          if(!newValue)this.form.dueDate="";
        else
          return new Date(this.form.dueDate)
        }
      },
      set(newValue) {
        this.form.dueDate = new Date(newValue)
      }
    },
    sortedData() {
      // let s = [ ...this.history, ...this.comments]
      let s = [...this.subtaskComments, ...this.subtaskHistory]
      if (s.length > 0) {
        return s.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      } else {
        return []
      }
    },
    isFavorite(){
        let fav = this.favsubtasks.findIndex(fv => fv.subtaskId == this.subtask.id)
        if (fav >= 0) {
            return { variant: "orange", text: "Remove favorite", status: true }
        } else {
            return { variant: "gray5", text: "Add to favorites", status: false }
        }
    },
  },
  
  watch: {
    subtask (newVal, oldVal) {
      if (newVal != oldVal) {
        console.log('watch subtask change')
        this.fetchSubtaskMembers(this.subtask)
        this.fetchSubtaskComments(this.subtask)
        this.fetchSubtaskHistory(this.subtask)
      }
    }
  },

  created() {
    this.$nuxt.$on("edit-message", (msg) => {
      // console.log(msg)
      this.editMessage = msg
    })
  },

  mounted() {
    // console.log('mounted subtask detail')
    this.$store.dispatch("subtask/fetchSubTask", this.subtask)
    this.$store.dispatch("subtask/fetchSubtaskMembers", this.subtask)
    this.$store.dispatch("subtask/fetchFavorites")

    this.loadingComments = true
    this.$store.dispatch("subtask/fetchSubtaskComments", this.subtask)
      .then(subc => { this.loadingComments = false })
      .catch(e => {
        console.warn(e)
        this.loadingComments = false
      })

    this.$store.dispatch("subtask/fetchSubtaskHistory", this.subtask)
  },
  methods: {

    ...mapActions({
      fetchSubtaskMembers: "subtask/fetchSubtaskMembers",
      fetchSubtaskComments: "subtask/fetchSubtaskComments",
      fetchSubtaskHistory: "subtask/fetchSubtaskHistory",
    }),

    showAddTeamModal() {
      // this.$refs.taskTeamModal.showTaskTeamModal = true
      this.taskTeamModal = true
    },
    fetchComments() {
      this.loadingComments = true
      this.$store.dispatch("subtask/fetchSubtaskComments", this.subtask)
        .then(subc => { this.loadingComments = false })
        .catch(e => {
          console.warn(e)
          this.loadingComments = false
        })
    },
    markComplete() {
      // let sub = subtask
      if (this.form.isDone) {
        this.form.statusId = 1
        this.form.isDone = false
      } else {
        this.form.isDone = true
        this.form.statusId = 5
      }
      // console.info(this.form.id, this.form.statusId, this.form.isDone)
      this.updateSubtask({ field: 'statusId', value: this.form.statusId, name: 'Status', isDone: this.form.isDone })
    },

    setFavorite() {
      // console.info(this.subtask.id, this.isFavorite.status)

      if (this.isFavorite.status) {
        this.$axios.delete("subtask/"+this.subtask.id+"/favorite", { 
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            } 
        })
          .then(msg => {
            console.log(msg.data.message)
            this.$store.dispatch("subtask/fetchFavorites")
        })
          .catch(e => console.log(e))
      } else {
        this.$axios.post("subtask/"+this.subtask.id+"/favorite", {}, { 
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            } 
        })
          .then(msg => {
            console.log(msg.data.message)
            this.$store.dispatch("subtask/fetchFavorites")

        })
          .catch(e => console.log(e))
      }
    },

    async updateSubtask(data) {
      // console.log(data.dueDate, this.form.dueDate)
        let updata = {[data.field]: data.value}
        let userobj = {}
        let sub
        let histvalue = data.value
        if (data.name == 'Status' && data.value == 5) {
            let st = this.statusValues.find(s => s.value == data.value)
            updata = { [data.field]: data.value, isDone: true }
            histvalue = st.label
        }
        
        if (data.name == 'Status' && data.value != 5) {
            let st = this.statusValues.find(s => s.value == data.value)
            updata = { [data.field]: data.value, isDone: false }
            histvalue = st.label
        } 

        if ( data.name == "Priority"){
            let pr = this.priorityValues.find(p => p.value == data.value)
            histvalue = pr.label
        }
        if ( data.name == "Department"){
            let dp = this.departments.find(d => {
              if(data.value == undefined) {
                return null;
              } 
              if(d.value == data.value) {
                return d;
              }
            })

            console.log(dp)
            if(dp == undefined) {
              updata = { [data.field]: null}
              histvalue = "not assigned"
            } else {
              histvalue = dp.label
            }

        }
        if (data.name == "Due date" || data.name == "Start date") {
          histvalue = dayjs(data.value).format('DD MMM YYYY')
        }
        if (data.name == 'User') {
            userobj = this.$userInfo(data.value)
            let user = { id: userobj.Id, email: userobj.Email, firstName: userobj.FirstName, lastName: userobj.LastName }
            sub = await this.$store.dispatch("subtask/updateSubtask", { id: this.form.id, data: updata, user, text: `updated ${data.name} to ${userobj.Name}` })
        } else {
            // console.log(data, userobj, updata)
            sub = await this.$store.dispatch("subtask/updateSubtask", { id: this.form.id, data: updata, text: `updated ${data.name} to ${histvalue}` })
        }
        // console.log(sub.data)
        if (sub.statusCode == 200) {
            this.$store.dispatch("subtask/setSelectedSubtask", sub.data)
            this.$store.dispatch('subtask/fetchSubTask', sub.data).then((res) => {
              // console.log(res)
              this.form = res;
            })
            this.$store.dispatch("subtask/fetchSubtaskHistory", this.subtask)
        } else {
            console.warn("error")
        }
    },
    closeSidebarDetail() {
      this.$emit('close-sidebar-detail')
      this.$store.dispatch("subtask/setSelectedSubtask", "")
    },

    gotoParent(){
      if (this.titleClick == "task") {
        window.open('/tasks/'+this.form.task?.id)
      } else {
        this.closeSidebarDetail()
      }
    },

    debounceUpdateField: _.debounce(function(data) {
      // console.log(name, field, value)
      if (this.form?.id) {
        // this.$emit("update-field", { name: name, field: field, value: value })
        // console.log(name, field, value)
        // console.log(this.form, data)
        this.updateSubtask(data)
      }
    }, 800),

    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },

    onsubmit(data) {
      // console.log(data, this.editMessage?.id)
      let trimComment = _.truncate(data.text.slice(3, -4), { length: 128 })

      if (this.editMessage?.id) {
        this.$store.dispatch("subtask/updateSubtaskComment", { subtaskId: this.subtask.id, commentId: this.editMessage.id, comment: data.text, text: `updated comment ${trimComment}` })
          .then(res => {
            // console.log('update comment', res)
            this.editMessage = {}
          })
          .catch(e => console.log(e))
      } else {
        this.$store.dispatch("subtask/createSubtaskComment", { id: this.subtask.id, comment: data.text, text: `added comment "${trimComment}"` })
          .then(res => {
            if (res.data.statusCode == 200) {

            }
            if (this.value.files.length > 0) {
              // console.log(this.value.files, res.data)
              this.uploadFiles(this.value.files, res.data)
            }
            // console.log('create comment', res)
          })
          .catch(e => console.log(e))
      }
    },

    /*async uploadFiles(files, commentRes) {
      let filelist = []

      let formdata = new FormData()
      files.forEach(file => {
        formdata.append('files', file)
        filelist.push(file.name)
      })
      formdata.append('subtaskId', commentRes.taskId)
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
    },*/

    async onDeleteMessage(payload) {
      console.log(payload)
      this.loadingComments = true
      // let data = {taskId: this.task.id, commentId: payload.msgId }
      const del = await this.$store.dispatch("subtask/deleteSubtaskComment", { ...payload, subtaskId: this.subtask.id, text: "subtask comment deleted" });
      if (del.statusCode == 200) {
        // this.$emit("refresh-list")
        this.fetchComments()
      } else {
        console.warn(del.message)
      }
      // this.msgLoading = false
      // console.log(del)
    },
  }
}

</script>
<style lang="scss" scoped>
.subtask-detail-wrapper {
  inset: 0;
  z-index: 8;
  display: grid;
  grid-template-rows: 1fr 1fr minmax(60vh, 100%) 1fr;
}

</style>
