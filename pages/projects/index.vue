<template>
  <div>
    <div id="project-name" class="project-heading p-05 text-secondary font-sm">
      <bib-icon icon="arrowhead-left" class="p-05 project-top-icon" :scale="2"></bib-icon> 
      Projects
    </div>

    <project-actions />
     <bib-table
        :fields="tableFields"
        class="border-gray4 bg-white"
        :sections="projects"
      >
        <template #cell(title)="data">
          <div class="justify-between text-dark" @click="$router.push(`/projects/${data.value.id}`)">
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

    // Change Tab
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
  }
}

</script>
<style lang="scss" scoped>

details {
  summary::-webkit-details-marker {
    display: none;
  }
}

.project-heading {
  border-bottom: 1px solid #dcdcdf; 
  padding-bottom: 10px;
  font-size: 20px
}

.project-top-icon {
  padding-bottom: 10px;
  font-size: 20px
}


</style>
