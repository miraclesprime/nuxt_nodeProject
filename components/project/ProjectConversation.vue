<template>
  <div class="container h-100">
    <div class="row w-100 h-100">
      <div class="col-2">
        <project-team :team="projectMembers"></project-team>
      </div>
      <!-- <div class="divider" id="task-conv-divider" style="left: 33.8%" /> -->
      <div class="col-10 border-left d-flex flex-d-column">
        <!-- <project-conversation-action></project-conversation-action> -->
        <div class="message-wrapper py-05 flex-grow-1 of-scroll-y">
          <template v-if="comments.length > 0">
            <message-list :messages="comments" @refresh-list="fetchProjectComments"></message-list>
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
      // comments: [],
    };
  },
  computed: {
    ...mapGetters({
      project: "project/getSingleProject",
      projectMembers: "project/getProjectMembers",
      comments: "project/getProjectComments",
    })
  },
  created() {
    this.$nuxt.$on("edit-message", (msg) => {
      // console.log(msg)
      this.editMessage = msg
    })
    this.$nuxt.$on("refresh-list", () => {
      this.fetchProjectComments()
    })
  },
  mounted() {
    this.fetchProjectComments()
    // this.$store.dispatch("project/fetchProjectComments", { id: this.project.id })
    this.$store.dispatch("project/fetchTeamMember", { projectId: this.project.id })
  },
  methods: {
    fetchProjectComments() {
      this.$store.dispatch("project/fetchProjectComments", { id: this.project.id })
    },
    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },
    onsubmit(data) {
      // console.log(data, this.editMessage?.id)

      if (this.editMessage?.id) {
        this.$store.dispatch("project/updateProjectComment", { projectId: this.project.id, commentId: this.editMessage.id, comment: data.text })
      } else {
        this.$store.dispatch("project/createProjectComment", { id: this.project.id, comment: data.text })
          .then(res => {
            // console.log(res)
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
