<template>
  <div class="text-center">
    <h2 class="p-2 text-secondary">Welcome </h2>
    
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";
import { DUMMY_PROJECT } from "~/dummy/tasks.js";

export default {
  auth: false,
  data() {
    return {
      activeTab: DEFAULT_TAB,
      TABS,
      TAB_TITLES,
      TABLE_FIELDS,
      gridType: "list",
      activeTask: {
        assignee: null,
        priority: null,
        status: null,
      },
      // taskModal: this.$refs.modals.showCreateProjectModal,
      projectName: ''
    };
  },
  computed: {
    // ...mapState("task", ["list", "single"]),
    ...mapGetters({
      tasks: "task/tasksForListView",
      taskFields: "task/tableFields",
      token: "token/getToken",
      project: "project/getSingleProject"
    }),
  },
  methods: {

    // Change Tab
    tabChange(value) {
      this.activeTab = value;
    },

    async createProject(project) {
      //COLLECTING FOLDER INFO
      if (project.name != "") {
        this.$store.dispatch('project/createProject', project.name)
        this.$refs.modals.showCreateProjectModal = false;
        // this.$emit("change-data");
      }
    },

    closeMenus() {
      // this.showSortMenu = false;
      // this.showMoreMenu = false;
      // this.showFolderMenu = false;
      // this.showFileMenu = false;
      // this.showFileSectionMenu = false;
      // for (let file of this.files.data) {
      //   file.active = false;
      // }
    },
  },
  created() {
    // this.$nextTick(async () => {
    //   await this.$store.dispatch("task/fetchTasks");
    // });

    /*this.$root.$on("change-grid-type", (type) => {
      this.gridType = type;
    });

    this.$root.$on("set-active-task", (task) => {
      this.activeTask = task;
    });*/

  },

};

</script>
<style lang="scss" scoped>

details {
  summary::-webkit-details-marker {
    display: none;
  }
}

</style>
