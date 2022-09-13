<template>
  <div class="container h-100">
    <div class="row w-100 h-100">
      <!-- <div class="col-2">
        <task-team :team="taskMembers"></task-team>
      </div> -->
      <!-- <div class="divider" id="task-conv-divider" style="left: 33.8%" /> -->
      <div class="col-12 border-left d-flex flex-d-column">
        <!-- <task-conversation-action></task-conversation-action> -->
        <div class="message-wrapper py-05 flex-grow-1 of-scroll-y">
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
            <task-message-list :messages="comments" @refresh-list="fetchTaskComments"></task-message-list>
          </template>
          <template v-else>
            <span class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
              <bib-icon icon="warning"></bib-icon> No conversation found
            </span>
          </template>
        </div>
        <div class="task-message-input ">
          <message-input :value="value" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data: function() {
    return {
      value: {
        files: [
          /*{ id: 156, name: 'thefile.png' },
          { id: 282, name: 'anotherfile.jpg' },*/
        ]
      },
      editMessage: {},
      comments: [],
      showPlaceholder: false,
    };
  },
  computed: {
    ...mapGetters({
      task: "task/getSelectedTask",
      taskMembers: "task/getTaskMembers",
      // comments: "task/getTaskComments",
    })
  },
  created() {
    this.$nuxt.$on("edit-message", (msg) => {
      // console.log(msg)
      this.editMessage = msg
    })
    this.$nuxt.$on("refresh-list", () => {
      this.fetchTaskComments()
    })
  },
  mounted() {
    this.fetchTaskComments()
    // this.$store.dispatch("task/fetchTaskComments", { id: this.task.id })
    this.$store.dispatch("task/fetchTeamMember", { id: this.task.id })
  },
  methods: {
    async fetchTaskComments() {
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
    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },
    onsubmit(data) {
      // console.log(data, this.editMessage?.id)

      if (this.editMessage?.id) {
        this.$store.dispatch("task/updateTaskComment", { taskId: this.task.id, commentId: this.editMessage.id, comment: data.text })
      } else {
        this.$store.dispatch("task/createTaskComment", { id: this.task.id, comment: data.text })
          .then(res => {
            // console.log(res)
            this.fetchTaskComments()
          })
          .catch(e => console.log(e))
      }
    },
  },
};

</script>
<style lang="scss" scoped>
.container {
  padding: 0 0.5rem;
}

.task-message-input {}

.border-left {
  border-left: 1px solid $gray4;
}

</style>
