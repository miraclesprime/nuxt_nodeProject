<template>
  <div>
    <nav class="d-flex align-center gap-05 pt-05 pb-05">
      <nuxt-link to="/projects" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <bib-avatar></bib-avatar>
      <span class="font-lg font-w-700  mr-1 ">{{project.title}}</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <span class=" badge-status">{{project.status.text}}</span>
      <div class="ml-auto d-flex gap-05 align-center">
        <bib-avatar></bib-avatar>
        <bib-button label="invite" variant="light" pill></bib-button>
        <div class="shape-circle bg-light width-2 height-2 d-flex cursor-pointer">
          <bib-icon icon="bookmark" class="m-auto"></bib-icon>
        </div>
        <!-- <div class="shape-circle bg-light width-2 height-2 d-flex ">
          <bib-icon icon="elipsis" class="m-auto">
            </bib-icon>
        </div> -->
        <div class="shape-circle bg-light width-2 height-2 d-flex justify-center align-center">
          <bib-button pop="horizontal-dots" >
            <template v-slot:menu>
              <div class="list">
                <span class="list__item">Show project details</span>
                <hr>
                <span class="list__item">
                  <bib-icon icon="heart-like" class="mr-075"></bib-icon> Add to favorites
                </span>
                <span class="list__item">
                  <bib-icon icon="user-add" class="mr-075"></bib-icon> Share with
                </span>
                <span class="list__item">
                  <bib-icon icon="pencil" class="mr-075"></bib-icon> Rename
                </span>
                <div class="mt-1"></div>
                <span class="list__item">
                  <bib-icon icon="warning" class="mr-075"></bib-icon> Report
                </span>
                <hr>
                <span class="list__item danger">Delete </span>
              </div>
            </template>
          </bib-button>
        </div>
      </div>
    </nav>
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
      sections: 'section/getAllSections',
      tasks: "task/tasksForListView",
      taskFields: "task/tableFields",
    })
  },

  created() {
    this.$root.$on("change-grid-type", (type) => {
      this.gridType = type;
    });

    this.$root.$on("set-active-task", (task) => {
      this.activeTask = task;
    });
  },

  mounted() {
    /*let proj = this.$axios.$get(`project/${this.$route.params.id}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    })
    let sec = this.$axios.$get(`section/project/${this.$route.params.id}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    })
    this.$store.dispatch('section/setSections', sec.data)
    this.$store.dispatch('project/setSingleProject', proj.data)*/
  },
  methods: {
    tabChange(value) {
      this.activeTab = value;
    },
  }
}

</script>
<style lang="scss" scoped>
.button--pop {
  .menu { margin-left: auto; margin-right: auto; padding: 0 0.25rem; }
}
</style>
