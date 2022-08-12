<template>
  <div class="container h-100">
    <div class="row w-100 h-100">
      <div class="col-2">
        <project-team :team="projectMembers"></project-team>
      </div>
      <!-- <div class="divider" id="task-conv-divider" style="left: 33.8%" /> -->
      <div class="col-10 border-left d-flex flex-d-column">
        <!-- <project-conversation-action></project-conversation-action> -->
        <div class="message-wrapper flex-grow-1 of-scroll-y">
          <message-list :messages="comments"></message-list>
        </div>
        <div class="task-message-input ">
          <message-input :value="value" @input="onFileInput" @submit="onsubmit"></message-input>
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
      // comments: []
    };
  },
  computed: {
    ...mapGetters({
      project: "project/getSingleProject",
      projectMembers: "project/getProjectMembers",
      comments: "project/getProjectComments",
    })
  },
  mounted() {
    this.$store.dispatch("project/fetchProjectComments", { id: this.project.id })
    this.$store.dispatch("project/fetchTeamMember", { projectId: this.project.id })
  },
  methods: {
    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },
    onsubmit(data) {
      // console.log(data)
      this.$store.dispatch("project/createProjectComment", { id: this.project.id, comment: data.text })
        .then(res => {
          console.log(res)
        })
        .catch(e => console.log(e))
    }
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
