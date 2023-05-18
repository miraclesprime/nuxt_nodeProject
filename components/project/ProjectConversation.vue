<template>
  <div class="message-wrapper mb-105" id="proj-conv-wrapper">
    <template v-if="showPlaceholder">
      <div class="placeholder m-1 d-flex align-center gap-05" id="proj-conv-inner-wrap">
        <div class="left" id="proj-conv-left">
          <div class="shape-circle width-3 height-3 animated-background" id="proj-conv-shape-circle"></div>
        </div>
        <div class="right" id="proj-conv-right">
          <div class="animated-background width-4" id="proj-conv-animated-background-w4"></div>
          <div class="animated-background width-10 mt-05" id="proj-conv-animated-background-w10"></div>
        </div>
      </div>
    </template>
    <template v-else-if="sortedData.length > 0">
      <div v-for="(item, index) in sortedData" :key="index" :id="'proj-conv-'+index">
        <message v-if="item.comment" :msg="item"></message>
        <task-history v-if="item.text && !item.isHidden" :history="item"></task-history>
      </div>
    </template>
    <template v-else>
      <span class="d-inline-flex gap-05 align-center my-025 text-gray5" id="proj-conv-warning">
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
        files: []
      },
      editMessage: {},
      comments: [],
      showPlaceholder: false,
      history: [],
    };
  },
  computed: {
    ...mapGetters({
      selectedProject: "project/getSingleProject",
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
  },
  methods: {
    fetchComments() {
      this.$store.dispatch("project/fetchProjectComments", { id: this.project.id })
      .then(c => {
        this.comments = c.data
        this.fetchHistory()
      }).catch(e => {
        console.warn(e)
      })
    },
    fetchHistory() {
      this.$store.dispatch("project/fetchHistory", this.project)
        .then(h => {
          this.history = h
        })
        .catch(e => console.error(e))
    },
    onFileInput(payload) {
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
