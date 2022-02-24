<template>
  <div id="task-page-wrapper">
    <!-- <div id="project-name" style="border-bottom: 1px solid #dcdcdf" class="p-05 text-secondary font-sm">{{task.title ? task.title : 'My Project'}}</div> -->
    <nav id="task-page-nav" class="d-flex align-center gap-05 pt-05 pb-05">
      <nuxt-link to="/" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <span id="task-page-title" class="font-lg font-w-700 ">{{title}}</span>
    </nav>
    <task-view :fields="taskFields" :tasks="tasks" :sections="sections" :gridType="gridType" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {

  name: 'Tasks',

  data() {
    return {
      title: "Tasks",
      gridType: "list",
    }
  },
  computed: {
    ...mapGetters({
      tasks: "task/tasksForListView",
      taskFields: "task/tableFields",
      token: "token/getToken",
      // project: "project/getSingleProject",
      sections: [],
    }),
  },
  async mounted() {
    const sec = await this.$axios.$get(`section/project/${this.$route.params.id}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    })
    if (sec) {
      // console.log(sec)
      this.sections = sec.data
    }
  }
}

</script>
<style lang="scss" scoped>
</style>
