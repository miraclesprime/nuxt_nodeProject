<template>
  <div id="project-id-wrapper" class="project-id-wrapper of-scroll-y">
    <nav id="project-id-nav" class="d-flex align-center gap-05 pt-05 pb-05">
      <nuxt-link to="/projects" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <bib-avatar></bib-avatar>
      <span id="project-id-project-title" class="font-lg font-w-700  mr-1 ">{{project ? project.title : ''}}</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <span id="project-id-badge-status" class="badge-status">{{project.status ? project.status.text : ''}}</span>
      <div class="ml-auto d-flex gap-05 align-center" id="project-id-button-wraps">
        <bib-avatar></bib-avatar>
        <bib-button label="invite" variant="light" pill v-on:click="$nuxt.$emit('add-teammember-modal')"></bib-button>
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-bookmark">
          <bib-icon icon="bookmark" class="m-auto"></bib-icon>
        </div>
        <div id="project-id-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
          <bib-button pop="horizontal-dots" id="project-id-horizontal-dots">
            <template v-slot:menu>
              <div class="list" id="project-id-list">
                <span class="list__item" id="project-id-list-item1">Show project details</span>
                <hr id="project-id-hr">
                <span class="list__item" id="project-id-list-item2">
                  <bib-icon icon="heart-like" class="mr-075"></bib-icon> Add to favorites
                </span>
                <span class="list__item" id="project-id-list-item3">
                  <bib-icon icon="user-add" class="mr-075"></bib-icon> Share with
                </span>
                <span class="list__item" id="project-id-list-item4">
                  <bib-icon icon="pencil" class="mr-075"></bib-icon> Rename
                </span>
                <div class="mt-1" id="project-id-div"></div>
                <span class="list__item" id="project-id-list-item5">
                  <bib-icon icon="warning" class="mr-075"></bib-icon> Report
                </span>
                <hr id="project-id-hr2">
                <span class="list__item danger" id="project-id-list-item6">Delete </span>
              </div>
            </template>
          </bib-button>
        </div>
      </div>
    </nav>
    <div class="menu " id='project-idmenu-content'>
      <bib-tabs :value="activeTab.value" @change="tabChange" :tabs="TABS" />
    </div>
    <div id="project-id-tab-content" class="project-id-tab-content position-relative ">
      <task-overview v-if="activeTab.value == TAB_TITLES.overview" :fields="TABLE_FIELDS" :tasks="projectTasks"  :currentProject="project" />
      <task-view v-if="activeTab.value == TAB_TITLES.tasks" :fields="taskFields" :tasks="projectTasks" :sections="projectSections" :gridType="gridType" />
      <task-conversations v-if="activeTab.value == TAB_TITLES.conversations" :fields="TABLE_FIELDS" :tasks="projectTasks" />
      <!-- <task-timeline-view v-if="activeTab.value == TAB_TITLES.timeline" :fields="TABLE_FIELDS" :tasks="tasks" />
      <task-calendar-view v-if="activeTab.value == TAB_TITLES.calendar" :fields="TABLE_FIELDS" :tasks="tasks" /> -->
      <task-team v-if="activeTab.value == TAB_TITLES.team" :fields="TABLE_FIELDS" :tasks="projectTasks" />
      <task-files v-if="activeTab.value == TAB_TITLES.files" :fields="TABLE_FIELDS" :tasks="projectTasks" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";

export default {
  name: 'ProjectId',
  data() {
    return {
      activeTab: DEFAULT_TAB,
      TABS,
      TAB_TITLES,
      TABLE_FIELDS,
      gridType: "list",
    }
  },

  computed: {
    ...mapGetters({
      token: 'token/getToken',
      project: 'project/getSingleProject',
      projectSections: 'section/getProjectSections',
      projectTasks: "task/tasksForListView",
      taskFields: "task/tableFields",
    }),
  },

  created() {
    this.$nuxt.$on("change-grid-type", (type) => {
      this.gridType = type;
    });

    this.$nuxt.$on("set-active-task", (task) => {
      this.activeTask = task;
    });

    if (process.client) {
      
      this.$axios.$get(`project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then((res) => {
        if (res) {
          this.$store.dispatch('project/setSingleProject', res.data)
        }
      }).catch(err => {
        console.log("There was some issue in project API " + err);
      })

    }

  },
  mounted() {
    this.$store.dispatch("section/fetchProjectSections", this.$route.params.id);
    this.$store.dispatch("task/fetchTasks", {id: this.$route.params.id, filter: 'all'});
  },

  methods: {
    
    async fetchProject() {
      const proj = await this.$axios.$get(`project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      })
      if (proj) {
        // console.log(proj)
        this.$store.dispatch('project/setSingleProject', proj.data)
      }
      const sec = await this.$axios.$get(`section/project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if (sec) {
        // console.log(sec)
        this.sections = sec.data
      }
    },
    tabChange(value) {
      this.activeTab = value;
    },
  }
}

</script>
<style lang="scss" scoped>
.project-id-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.shape-circle {
  .menu {
    margin-left: auto;
    margin-right: auto
  }
}

</style>
