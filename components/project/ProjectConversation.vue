<template>
  <div class="message-wrapper mb-105">
    <template v-if="showPlaceholder">
      <!-- <div class="d-flex align-center p-05 border-bottom-gray2">
          <bib-icon icon="arrow-down" :scale="0.5"></bib-icon>
          <div class="px-1 ">
            <div class="animated-background width-6"></div>
          </div>
        </div> -->
      <div class="placeholder m-1 d-flex align-center gap-05">
        <div class="left">
          <div class="shape-circle width-3 height-3 animated-background"></div>
        </div>
        <div class="right">
          <div class="animated-background width-4"></div>
          <div class="animated-background width-10 mt-05"></div>
        </div>
      </div>
    </template>
    <template v-else-if="sortedData.length > 0">
      <div v-for="item in sortedData">
        <message v-if="item.comment" :msg="item"></message>
        <task-history v-if="item.text" :history="item"></task-history>
      </div>
    </template>
    <template v-else>
      <span class="d-inline-flex gap-05 align-center my-025 text-gray5">
        <bib-icon icon="warning" variant="gray5"></bib-icon> No conversation found
      </span>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    project: {
      type: Object, // String, Number, Boolean, Function, Object, Array
      default: null
    },
  },
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
      history: [],
    };
  },
  computed: {
    ...mapGetters({
      // user: "user/getUser2",
      // members: 'user/getTeamMembers',
      selectedProject: "project/getSingleProject",
      // projectMembers: "project/getProjectMembers",
      // comments: "project/getProjectComments",
    }),
    sortedData() {
      let s = [...this.history, ...this.comments]
      if (s.length > 0) {
        return s.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      } else {
        return []
      }
    },
  },
  watch: {
    project(newVal) {
      if (Object.keys(newVal).length > 0 || newVal != null) {
        this.fetchComments()
      }
    },
  },
  created() {
    this.$nuxt.$on("edit-message", (msg) => {
      // console.log(msg)
      this.editMessage = msg
    })
    this.$nuxt.$on("refresh-list", () => {
      this.fetchComments()
    })
  },
  mounted() {
    if (this.project?.id) {
      this.fetchComments()
    } else {
      this.showPlaceholder = true
      this.$store.dispatch("project/fetchProjectComments", { id: this.selectedProject.id }).then(c => {
        this.comments = c.data
        this.fetchHistory()
        this.showPlaceholder = false
      }).catch(e => {
        console.warn(e)
        this.showPlaceholder = false
      })
    }
    // this.$store.dispatch("project/fetchProjectComments", { id: this.project.id })
    // this.$store.dispatch("project/fetchTeamMember", { projectId: this.project.id })
    /*this.$store.dispatch("project/fetchHistory", this.project)
      .then(h => {
        // console.log(h)
        this.history = h
      })
      .catch(e => console.error(e))*/
  },
  methods: {
    fetchComments() {
      // this.showPlaceholder = true
      /*const comm = await this.$axios.get(`/project/${this.project.id}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if (comm.data.statusCode == 200) {
        this.comments = comm.data.data
      }*/
      this.$store.dispatch("project/fetchProjectComments", { id: this.project.id })
      .then(c => {
        console.log(c)
        // if (true) {}
        this.comments = c.data
        this.fetchHistory()
        // this.showPlaceholder = false
      }).catch(e => {
        console.warn(e)
        // this.showPlaceholder = false
      })
    },
    fetchHistory() {
      this.$store.dispatch("project/fetchHistory", this.project)
        .then(h => {
          // console.log(h)
          this.history = h
        })
        .catch(e => console.error(e))
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
.message-wrapper { margin-bottom: 1.5rem;}
</style>
