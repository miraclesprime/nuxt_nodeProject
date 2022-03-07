<template>
  <div id="projects-wrapper">
    <!-- <div id="project-name" class="project-heading p-05 text-secondary font-sm"> -->
    <nav id="projects-nav-wrapper" class="d-flex align-center gap-05 pt-05 pb-05">
      <nuxt-link to="/" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <!-- <bib-icon icon="arrowhead-left" class="p-05 project-top-icon" :scale="2"></bib-icon> -->
      <span class="font-lg font-w-700  mr-1" id="projects-title-head">Projects</span>
    </nav>
    <!-- </div> -->
    <project-actions @sortValue='sortName=$event' @viewValue='viewName=$event' />
    <loading :loading="loading"></loading>
    <bib-table :fields="tableFields" class="border-gray4 bg-white" :sections="projects" :key="'sort-'+ sortName ? sortName : 'sName' + 'view-' + viewName ? viewName : 'vName'  ">
      <template #cell(title)="data">
        <div class="justify-between text-dark" :id="'projects-' + data.value.title" @click="goToProjectId(data.value)">
          <span :id="'projects-' + data.value.title + '-text'">{{data.value.title}}</span>
        </div>
      </template>
      <template #cell(userId)="data">
        <div class="d-flex gap-05" id="projects-userInfo-wrap">
          <span class="text-dark" id="projects-userInfo-text">
            <user-info :id="data.value ? data.value.userId : ''" /></span>
        </div>
      </template>
      <template #cell(status)="data">
        <div class="justify-between text-dark" :id="'projects-' + data.value.status.text">
          <span :id="'projects-' + data.value.status.text + '-text'" v-format-status="data.value.statusId ? data.value.statusId : ''">{{ data.value.status.text }}</span>
        </div>
      </template>
      <template #cell(createdAt)="data">
        <div class="justify-between text-dark" :id="'projects-' + data.value.createdAt">
          <span :id="'projects-' + data.value.createdAt + '-text'" v-format-date="data.value.createdAt"></span>
        </div>
      </template>
      <template #cell(dueDate)="data">
        <div class="justify-between text-dark" :id="'projects-' + data.value.dueDate">
          <span :id="'projects-' + data.value.dueDate + '-text'" v-format-date="data.value.dueDate"></span>
        </div>
      </template>
      <template #cell(priority)="data">
        <div class="justify-between text-dark" :id="'projects-' + data.value.priority.text">
          <span :id="'projects-' + data.value.priority.text + '-text'" v-format-priority="data.value.priorityId ? data.value.priorityId : ''">{{data.value.priority.text}}</span>
        </div>
      </template>
    </bib-table>
  </div>
</template>
<script>
// import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";
import { PROJECT_FIELDS } from '../../dummy/project';
import { mapGetters } from 'vuex';
import ProjectActions from '../../components/project/ProjectActions.vue';
import UserInfo from '../../components/elements/UserInfo.vue';

export default {
  components: { ProjectActions, UserInfo },
  data() {
    return {
      sortName: '',
      viewName: '',
      loading: true,
      tableFields: PROJECT_FIELDS,
      gridType: "list",
      activeTask: {
        assignee: null,
        priority: null,
        status: null,
      },
      project: {
        title: "Project One"
      },
      projectName: ''
    }
  },
  mounted() {
    this.$store.dispatch('project/fetchProjects').then(p => { this.loading = false })
  },
  computed: {
    ...mapGetters({
      projects: 'project/getAllProjects'
    })
  },

  methods: {
    tabChange(value) {
      this.activeTab = value;
    },
    goToProjectId(project) {
      // console.log(project)
      // this.$store.dispatch('project/setSingleProject', project)
      this.$router.push("/projects/" + project.id)
    },
  }
}

</script>
<style lang="scss" scoped>
details {
  summary::-webkit-details-marker {
    display: none;
  }
}

</style>
