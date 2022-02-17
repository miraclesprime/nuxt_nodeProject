<template>
  <div>

    <!-- <div id="project-name" class="project-heading p-05 text-secondary font-sm"> -->
    <nav class="d-flex align-center gap-05 pt-05 pb-05">
      <nuxt-link to="/" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <!-- <bib-icon icon="arrowhead-left" class="p-05 project-top-icon" :scale="2"></bib-icon> -->
      <span class="font-lg font-w-700  mr-1 ">Projects</span>
    </nav>
    <!-- </div> -->
    <project-actions />
    <bib-table :fields="tableFields" class="border-gray4 bg-white" :sections="projects">
      <template #cell(title)="data">
        <div class="justify-between text-dark" @click="goToProjectId(data.value)">
          <span>{{data.value.title}}</span>
        </div>
      </template>
      <template #cell(userId)="data">
        <div class="d-flex gap-05">
          <bib-avatar class="mt-auto mb-auto" :src="data.value.preview" size="1.5rem"></bib-avatar>
          <span class="text-dark">{{ data.value.userId }}</span>
        </div>
      </template>
      <template #cell(status)="data">
        <div class="justify-between text-dark">
          <span>{{data.value.status.text}}</span>
        </div>
      </template>
      <template #cell(createdAt)="data">
        <div class="justify-between text-dark">
          <span>{{new Date(data.value.createdAt).toLocaleString("en-US")}}</span>
        </div>
      </template>
      <template #cell(dueDate)="data">
        <div class="justify-between text-dark">
          <span>{{new Date(data.value.dueDate).toLocaleString("en-US")}}</span>
        </div>
      </template>
      <template #cell(priority)="data">
        <div class="justify-between text-dark">
          <span>{{data.value.priority.text}}</span>
        </div>
      </template>
    </bib-table>
    <task-modals @create-project="
        (project) => {
          createProject(project);
        }
      " ref="modals"></task-modals>
  </div>
</template>
<script>
// import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";
import { PROJECT_FIELDS } from '../../dummy/project';
import { mapGetters } from 'vuex';
import ProjectActions from '../../components/elements/Project/ProjectActions.vue';

export default {
  components: { ProjectActions },
  data() {
    return {
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
  methods: {

    tabChange(value) {
      this.activeTab = value;
    },

  },

  computed: {
    ...mapGetters({
      projects: 'project/getAllProjects'
    })
  },

  mounted() {
    this.$store.dispatch('project/fetchProjects')
  },
  methods: {
    goToProjectId(project) {
      // console.log(project)
      this.$store.dispatch('project/setSingleProject', project)
      this.$router.push("/projects/" + project.id)
    }
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
