<template>
  <section id="subtask-detail-wrapper" class="position-absolute subtask-detail-wrapper bg-white">
    <div class="d-flex align-center gap-05 px-105 py-075">
      <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" title="Close" @click="closeSidebarDetail">
        <bib-icon icon="page-last" class="m-auto"></bib-icon>
      </div>
      <!-- <div class="d-flex cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2">
        <bib-icon icon="expand-fullscreen" variant="gray6" class="m-auto"></bib-icon>
      </div> -->
    </div>
    <div class="border-top-gray3 border-bottom-gray3 position-relative px-105 py-025 mb-1">
      <div class="d-flex align-center gap-05">
        <div class="width-2 height-2 d-inline-flex align-center justify-center cursor-pointer" @click="markComplete">
          <bib-icon icon="check-circle-solid" :variant="isComplete.variant" :scale="1.5"></bib-icon>
        </div>
        <div class="flex-grow-1">
          <input type="text" class="editable-input" :class="{'error': error == 'invalid'}" ref="subtaskTitleInput" v-model="form.title" placeholder="Enter title..." v-on:keyup="debounceUpdateField({title: form.title})">
        </div>
        <div>
          <!-- <team-avatar-list :team="team"></team-avatar-list> -->
        </div>
        <div class="d-flex align-center justify-center width-2 height-2 shape-circle bg-light cursor-pointer" :title="assignee.label">
          <bib-avatar :src="assignee.avatar" size="1.5rem"></bib-avatar>
        </div>
      </div>
      <!-- <loading :loading="loading"></loading> -->
    </div>
    <!-- other fields -->
    <div class="of-scroll-y px-105">
            
        <div class="row">
          <div class="col-6">
            <bib-select label="Assignee" test_id="subtask_assignee_select" :options="orgUsers" v-model="form.userId" v-on:change="updateSubtask({userId: form.userId})"></bib-select>
          </div>
          <div class="col-6">
            <bib-datepicker class="align-right" v-model="dueDateInput" :value="dueDateInput" format="dd MMM yyyy" label="Due date" placeholder="Due date" @input="updateSubtask({dueDate: dueDateInput})"></bib-datepicker>
          </div>
          <!-- <div class="col-6"></div> -->
        </div>
        <div class="row " >
          <div class="col-6" >
            <bib-input type="select" label="Priority" v-model.number="form.priorityId" :options="priorityValues" placeholder="Please select..." v-on:change.native="updateSubtask({priorityId: form.priorityId})"></bib-input>
          </div>
          <div class="col-6" >
            <bib-input type="select" label="Status" v-model.number="form.statusId" :options="statusValues" placeholder="Please select..." v-on:change.native="updateSubtask({statusId: form.statusId})"></bib-input>
          </div>
        </div>
        <div class="row " >
          <div class="col-12" >
            <bib-input type="textarea" v-model.trim="form.description" placeholder="Enter subtask description..." label="Description" v-on:keyup.native="debounceUpdateField({description: form.description})"></bib-input>
          </div>
        </div>

        <div class="py-05 " >
            <div class="d-flex justify-between sub-title pb-05 border-bottom-gray2 ">
                <p class="text-gray5 font-md ">Conversation </p>
            </div>
            <template v-if="sortedData.length > 0">
                <div v-for="item in sortedData">
                  <task-message v-if="item.comment" :msg="item" ></task-message>
                  <!-- <task-history v-if="item.text" :history="item"></task-history> -->
                </div>
            </template>
        </div>
    </div>
    <!-- message input -->
    <div class="task-message-input d-flex gap-1 border-top-gray3 py-1 px-105">
      <bib-avatar :src="user2.Photo" size="2rem" class="flex-shrink-0" ></bib-avatar>
      <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div>
  </section>
</template>
<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {

  name: 'SubtaskDetail',
  /*props: {
      subtask: Object,
  },*/
  data() {
    return {
        statusValues: STATUS,
        priorityValues: PRIORITY,
      /*form: {
        title: '',

      },*/
      error: '',
      loading: false,
      comments: [],
      value: {
        files: [
          /*{ id: 156, name: 'thefile.png' },
          { id: 282, name: 'anotherfile.jpg' },*/
        ]
      },
      editMessage: {},
      subkey: 0,
    }
  },
  computed: {
    ...mapGetters({
      user2: "user/getUser2",
      subtask: "subtask/getSelectedSubTask",
      subtaskComments: "subtask,getSubTaskComments",
      teamMembers: "user/getTeamMembers",
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
        console.log(newValue, this)
        // this.title = newValue.title
      }
    },

    isComplete() {
      return { variant: this.form.isDone ? 'success' : 'gray4' };
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
    dueDateInput: {
      get() {
        // let nd
        if (!this.form.dueDate) {
          // nd = new Date()
          return new Date()
        } else {
          // nd = new Date(this.form.dueDate)
          return new Date(this.form.dueDate)
        }
      },
      set(newValue) {
        this.form.dueDate = new Date(newValue)
      }
    },
    sortedData(){
      // let s = [ ...this.history, ...this.comments]
        /*let s = [...this.subtaskComments]
      if(s.length > 0){
        return s.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      } else {
        return []
      }*/
        return [{id:1, text: 'lorem ipsum', userId: 'k61YQdJ6J7ldOGpJ', updatedAt: '2023-01-11T10:58:26.000Z'}, { id: 21, text: 'dolor sit amet', userId: 'DKgl9av2NwnaG1vz', updatedAt: '2023-01-12T11:23:52.000Z'}]
    },
  },

  created(){
    this.$nuxt.$on("edit-message", (msg) => {
      // console.log(msg)
      this.editMessage = msg
    })
  },

  mounted(){
    // console.log('mounted subtask detail')
    this.$store.dispatch("subtask/fetchSubTask", this.subtask)
    
    this.$store.dispatch("subtask/fetchSubtaskComments", this.subtask)
        .then(sc => {
            // console.log(sc.data)
            this.comments = sc.data
        })
        .catch(e => console.warn(e))
  },
  methods: {
    markComplete(){
      // let sub = subtask
      if (this.form.isDone) {
        this.form.statusId = 1
        this.form.isDone = false
      } else {
        this.form.isDone = true
        this.form.statusId = 5
      }
      console.info(this.form.id, this.form.statusId, this.form.isDone)
      this.updateSubtask({statusId: this.form.statusId, isDone: this.form.isDone})
    },

    async updateSubtask(data){
      // console.log(subtask.id, key, subtask[key])
      const sub = await this.$store.dispatch("subtask/updateSubtask", { id: this.form.id, data: data })
      // console.log(sub.data)
      if (sub.statusCode == 200) {
        // console.log('update subtask success->', sub.data)
        this.$store.dispatch("subtask/setSelectedSubtask", sub.data)
        // this.$store.dispatch("subtask/fetchSubTask", sub.data)
      } else {
        console.warn("error")
      }
    },
    closeSidebarDetail() {
      this.$emit('close-sidebar-detail')
      this.$store.dispatch("subtask/setSelectedSubtask", "")
    },

    debounceUpdateField: _.debounce(function(data) {
      // console.log(name, field, value)
      if (this.form?.id) {
        // this.$emit("update-field", { name: name, field: field, value: value })
        // console.log(name, field, value)
        // console.log(this.form, data)
        this.updateSubtask(data)
      }
    }, 1500),

    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },

    onsubmit(data) {
      // console.log(data, this.editMessage?.id)
      let trimComment = _.truncate(data.text.slice(3, -4), { length: 128 })

      if (this.editMessage?.id) {
        this.$store.dispatch("subtask/updateSubtaskComment", { taskId: this.subtask.id, commentId: this.editMessage.id, comment: data.text, text: `updated comment ${trimComment}` })
        .then(res => {
            console.log('update comment', res)
          // this.reloadComments += 1
        })
        .catch(e => console.log(e))
      } else {
        this.$store.dispatch("subtask/createSubtaskComment", { id: this.subtask.id, comment: data.text, text: `added comment "${trimComment}"` })
          .then(res => {
            if (this.value.files.length > 0) {
              // console.log(this.value.files, res.data)
              // this.uploadFiles(this.value.files, res.data)
            }
            console.log('create comment', res)
            // this.reloadComments += 1
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
