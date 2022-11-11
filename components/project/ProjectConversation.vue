<template>
  <div class=" h-100">
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
        <message-list :messages="comments" ></message-list>
      </template>
      <template v-else>
        <span class="d-inline-flex gap-05 align-center my-025 text-gray5">
          <bib-icon icon="warning" variant="gray5"></bib-icon> No conversation found
        </span>
      </template>
    </div>
    <!-- <div class="message-input-wrapper ">
      <message-input :value="value" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
    </div> -->
    
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
      project: "project/getSingleProject",
      projectMembers: "project/getProjectMembers",
      // comments: "project/getProjectComments",
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
    async fetchProjectComments() {
      this.showPlaceholder = true
      const comm = await this.$axios.get(`/project/${this.project.id}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if (comm.data.statusCode == 200) {
        this.comments = comm.data.data
      }
      this.showPlaceholder = false
      // this.$store.dispatch("project/fetchProjectComments", { id: this.project.id })
    },
    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },
  },
};

</script>
<style lang="scss" scoped>
.container {
  padding: 0 0.5rem;
}

</style>
