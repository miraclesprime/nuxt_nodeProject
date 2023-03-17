<template>
  <client-only>
    <div class="px-2 py-05 " id="sc-container">
      <div class="d-flex justify-between sub-title pb-05 border-bottom-gray2 ">
        <p class="text-gray5 font-md ">Conversation </p>
      </div>
      <div class="task-conversation w-100 " id="sc-task-team">
        <div class="message-wrapper py-05 position-relative">
          <template v-if="showPlaceholder">
            <div class="placeholder my-05 d-flex align-center gap-05">
              <div class="left">
                <div class="shape-circle width-2 height-2 animated-background"></div>
              </div>
              <div class="right">
                <div class="animated-background width-4 " style="height: 0.8rem;"></div>
                <div class="animated-background width-10 mt-025" style="height: 0.6rem;"></div>
              </div>
            </div>
          </template>
          <template v-else-if="sortedData.length > 0">
            <div v-for="item in sortedData">
              <!-- <task-message v-if="item.comment" :msg="item" @delete-message="onDeleteMessage" @upload-file="uploadFileTrigger"></task-message> -->
              <message v-if="item.comment" :msg="item" fieldkey="task" @delete-message="onDeleteMessage" @upload-file="uploadFileTrigger"></message>
              <task-history v-if="item.text && !item.isHidden" :history="item"></task-history>
            </div>
          </template>
          <!-- <template v-else>
            <span class="d-inline-flex gap-1 align-center m-05 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
              <bib-icon icon="warning"></bib-icon> No conversation found
            </span>
          </template> -->
          <!-- <loading :loading="msgLoading"></loading> -->
        </div>
        <!-- <div class="task-message-input ">
          <message-input :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
        </div> -->
      </div>
    </div>
  </client-only>
</template>
<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'

export default {
  data: function() {
    return {
      value: {
        files: [
          /*{ id: 156, name: 'thefile.png' },
          { id: 282, name: 'anotherfile.jpg' },*/
        ]
      },
      // editMessage: {},
      comments: [],
      history: [],
      showPlaceholder: false,
      msgLoading: false,
    };
  },
  props: {
    reloadComments: { type: Number, default: 0 },
    reloadHistory: { type: Number, default: 0 },
  },
  computed: {
    ...mapGetters({
      task: "task/getSelectedTask",
      // taskHistory: "task/getTaskHistory",
      taskMembers: "task/getTaskMembers",
      project: "project/getSingleProject"
    }),
    sortedData(){
      let s = [ ...this.history, ...this.comments]
      if(s.length > 0){
        return s.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      } else {
        return []
      }
    },
  },
  watch: {
    task(newValue, oldValue) {
      // console.log(newValue.id, newValue.title)
      if (newValue.id && newValue.id != oldValue.id) {
        // console.log(newValue.id, oldValue.id)
        this.fetchTaskComments()
        this.fetchHistory()
      } else {
        this.comments = []
        this.history = []
      }
    },
    reloadComments(newValue, oldValue){
      if (newValue != oldValue) {
        this.fetchTaskComments()
      }
    },
    reloadHistory(newValue, oldValue){
      if (newValue != oldValue) {
        this.fetchHistory()
      }
    },
  },
  
  mounted() {
    // this.fetchTaskComments()
    // this.fetchHistory()
    this.$nuxt.$on("refresh-history", () => {
      this.fetchHistory()
    })
    this.$nuxt.$on("refresh-comments", () => {
      this.fetchTaskComments()
    })
  },
  methods: {
    /*inputContent(data) {
      console.log(data);
    },*/
    
    async fetchTaskComments() {
      if (Object.keys(this.task).length == 0) {
        console.log('no task selected')
        this.comments = []
        return
      }
      this.showPlaceholder = true
      const comm = await this.$axios.get(`/task/${this.task.id}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      // console.log(comm.data)

      if (comm.data.statusCode == 200) {
        this.comments = comm.data.data
      }
      this.showPlaceholder = false
      // this.$store.dispatch("task/fetcTaskComments", { id: this.task.id })
    },

    async onDeleteMessage(payload) {
      // this.msgLoading = true
      // let data = {taskId: this.task.id, commentId: payload.msgId }
      const del = await this.$store.dispatch("task/deleteTaskComment", {...payload, text: "task comment deleted"});
      if (del.statusCode == 200) {
        // this.$emit("refresh-list")
        this.fetchTaskComments()
      }
      // this.msgLoading = false
      // console.log(del)
    },

    uploadFileTrigger(msg){
      // console.log(msg)
      this.uploadModal = true
      this.msg = msg
    },

    fetchHistory() {
      // this.msgLoading = true
      this.$store.dispatch("task/fetchHistory", this.task)
        .then(h => {
          // console.log(h)
          this.history = h
          // this.msgLoading = false
        })
        .catch(e => {
          console.error(e)
          // this.msgLoading = false

        })
    },

    /*onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },*/
    /*onsubmit(data) {
      // console.log(data, this.editMessage?.id)
      let trimComment = _.truncate(data.text.slice(3, -4), { length: 128 })

      if (this.editMessage?.id) {
        this.$store.dispatch("task/updateTaskComment", { taskId: this.task.id, commentId: this.editMessage.id, comment: data.text, text: `updated comment ${trimComment}` })
        .then(res => {
          this.fetchTaskComments()
        })
        .catch(e => console.log(e))
      } else {
        this.$store.dispatch("task/createTaskComment", { id: this.task.id, comment: data.text, text: `added comment ${trimComment}` })
          .then(res => {
            // console.log(res)
            if (this.value.files.length > 0) {
              this.uploadFile(this.value.files, res.data)
            }
            this.fetchTaskComments()
          })
          .catch(e => console.log(e))
      }
    },*/
    /*async uploadFile(commentFiles, data){
      let formdata = new FormData()
      let filelist = []
      commentFiles.forEach(file => {
        formdata.append('files', file)
        filelist.push(file.name)
      })
      // formdata.append('projectId', this.project.id)
      formdata.append('taskCommentId', data.id)
      formdata.append('taskId', this.task.id)
      formdata.append('text', `uploaded file(s) "${filelist.join(", ")}" to task comment`)

      if(Object.keys(this.project).length > 0) {
        formdata.append('projectId', this.project.id)
      }

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      // console.log(fi.data)
      if (fi.data.statusCode == 200) {
        console.log("file upload->", fi.data)
        this.value.files = []
        this.$nuxt.$emit("get-taskmsg-files")
      }
    }*/
  },
};

</script>
<style lang="scss" scoped>
.container {
  padding: 0 0.5rem;
}

.border-left {
  border-left: 1px solid $gray4;
}

</style>
