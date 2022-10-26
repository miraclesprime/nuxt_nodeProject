<template>
  <client-only>
    <div class="px-105 py-05 h-100" id="sc-container">
      <div class="d-flex justify-between sub-title pb-05 border-bottom-gray2 ">
        <p class="text-gray5 font-md ">Conversation </p>
      </div>
      <div class="task-conversation w-100 " id="sc-task-team">
        <div class="message-wrapper ">
          <template v-if="showPlaceholder">
            <div class="d-flex align-center p-05 border-bottom-gray2">
              <bib-icon icon="arrow-down" :scale="0.5"></bib-icon>
              <div class="px-1 ">
                <div class="animated-background width-6"></div>
              </div>
            </div>
            <div class="placeholder m-1 d-flex align-center gap-1">
              <div class="left">
                <div class="shape-circle width-3 height-3 animated-background"></div>
              </div>
              <div class="right">
                <div class="animated-background width-4"></div>
                <div class="animated-background width-10 mt-05"></div>
              </div>
            </div>
          </template>
          <template v-else-if="comments.length > 0">
            <!-- {{comments.length}} comment(s) found -->
            <div v-for="(msg, index) in comments" :key="index + msg.id">
              <task-message :msg="msg" @delete-message="onDeleteMessage" @upload-file="uploadFileTrigger"></task-message>
            </div>
            <!-- <task-message-list :messages="comments" @refresh-list="fetchTaskComments"></task-message-list> -->
          </template>
          <!-- <template v-else>
            <span class="d-inline-flex gap-1 align-center m-05 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
              <bib-icon icon="warning"></bib-icon> No conversation found
            </span>
          </template> -->
          <template v-if="sortedData.length > 0">
            <div v-for="item in sortedData">
              <task-message v-if="item.comment" :msg="item" @delete-message="onDeleteMessage" @upload-file="uploadFileTrigger"></task-message>
              <div v-else class="d-flex flex-wrap my-05 ml-5">
                {{item.userId}}<span class="ml-1 text-gray5 font-sm">{{displayDate(item.updatedAt)}}</span>
                <p class="flex-grow-1 text-gray6">{{item.text}}</p>
              </div>
            </div>
          </template>
        </div>
        <!-- <div class="task-message-input ">
          <message-input :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
        </div> -->
      </div>
    </div>
  </client-only>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex';
// dayjs.extend(relativeTime)
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
    };
  },
  props: {
    reload: { type: Number, default: 0 },
  },
  computed: {
    ...mapGetters({
      task: "task/getSelectedTask",
      taskHistory: "task/getTaskHistory",
      taskMembers: "task/getTaskMembers",
      project: "project/getSingleProject"
    }),
    sortedData(){
      let s = [ ...this.taskHistory, ...this.comments]
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
      }
    },
    reload(newValue, oldValue){
      if (newValue != oldValue) {
        this.fetchTaskComments()
      }
    },
  },
  
  mounted() {
    this.fetchTaskComments()
    this.fetchHistory()
    // this.$store.dispatch("task/fetchTaskComments", { id: this.task.id })
    // this.$store.dispatch("task/fetchTeamMember", { id: this.task.id })
    /*this.$nuxt.$on("edit-message", (msg) => {
      // console.log(msg)
      this.editMessage = msg
    })*/
  },
  methods: {
    /*inputContent(data) {
      console.log(data);
    },*/
    displayDate(date) {
      // let d = new Date(date)
      return dayjs(date).format('dddd, D MMM, YYYY @ HH:mm')
      // let diff = d.diff(dayjs(), 'dd')

      // return diff
    },
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
      this.msgLoading = true
      // let data = {taskId: this.task.id, commentId: payload.msgId }
      const del = await this.$store.dispatch("task/deleteTaskComment", {...payload, text: "task comment deleted"});
      if (del.statusCode == 200) {
        // this.$emit("refresh-list")
      }
      this.msgLoading = false
      // console.log(del)
    },

    uploadFileTrigger(msg){
      // console.log(msg)
      this.uploadModal = true
      this.msg = msg
    },

    fetchHistory() {
      this.loading = true
      this.$store.dispatch("task/fetchHistory", this.task)
        .then(h => {
          // console.log(h)
          this.history = h
          this.loading = false
        })
        .catch(e => {
          console.error(e)
          this.loading = false

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
    async uploadFile(commentFiles, data){
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
    }
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
