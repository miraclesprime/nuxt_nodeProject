<template>
  <div>
    <div id="project-name" style="border-bottom: 1px solid #dcdcdf" class="p-05 text-secondary font-sm">{{project.title ? project.title : 'My Project'}}</div>
    <!-- <task-sidebar :activeTask="activeTask" /> -->
    <!-- <div class="bread d-flex" id='bread-icons'>
      <div class="d-flex align-center" id='prev-icon'>
        <bib-icon icon="previous" :scale="2.0"></bib-icon>
      </div>
      <h3 class="bold mt-auto mb-auto d-flex" id='project-heading'>
        {{ projectName }}
      </h3>
    </div> -->
    
    <div class="menu" id='menu-content'>
      <bib-tabs :value="activeTab.value" @change="tabChange" :tabs="TABS" />
    </div>
    <div id='task-overview'>
      <task-overview v-if="activeTab.value == TAB_TITLES.overview" :fields="TABLE_FIELDS" :tasks="tasks" :gridType="gridType" />
      <task-view v-if="activeTab.value == TAB_TITLES.tasks" :fields="taskFields" :tasks="tasks" :gridType="gridType" />
      <task-conversations v-if="activeTab.value == TAB_TITLES.conversations" :fields="TABLE_FIELDS" :tasks="tasks" />
      <task-timeline-view v-if="activeTab.value == TAB_TITLES.timeline" :fields="TABLE_FIELDS" :tasks="tasks" />
      <task-calendar-view v-if="activeTab.value == TAB_TITLES.calendar" :fields="TABLE_FIELDS" :tasks="tasks" />
      <task-team v-if="activeTab.value == TAB_TITLES.team" :fields="TABLE_FIELDS" :tasks="tasks" />
      <task-files v-if="activeTab.value == TAB_TITLES.files" :fields="TABLE_FIELDS" :tasks="tasks" />
    </div>
    <task-modals @create-project="
        (project) => {
          createProject(project);
        }
      " ref="modals"></task-modals>
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

    this.$root.$on("change-grid-type", (type) => {
      this.gridType = type;
    });

    this.$root.$on("set-active-task", (task) => {
      this.activeTask = task;
    });

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
