<template>
  <div>
    
    <div id="project-name" style="border-bottom: 1px solid #dcdcdf" class="p-05 text-secondary font-sm">{{project.title ? project.title : 'My Project'}}</div>
    <task-modals @create-project="
        (project) => {
          createProject(project);
        }
      " ref="modals"></task-modals>
  </div>
</template>
<script>
import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";
import { DUMMY_TASK_FIELDS } from "~/dummy/tasks.js";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      activeTab: DEFAULT_TAB,
      tableFields: DUMMY_TASK_FIELDS,
      TABS,
      TAB_TITLES,
      TABLE_FIELDS,
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
    this.$nextTick(async () => {
      this.$store.dispatch('project/fetchProjects')
    })
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
