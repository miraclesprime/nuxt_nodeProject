<template>
  <div id="task-page-wrapper">
    <!-- <nav id="task-page-nav" class="d-flex align-center gap-05 pt-05 pb-05">
      <nuxt-link to="/" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <span id="task-page-title" class="font-lg font-w-700 ">{{title}}</span>
    </nav> -->
    <page-title title="Tasks"></page-title>
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
      tasks: [],
      gridType: "list",
      sections: [],
    }
  },
  computed: {
    ...mapGetters({
      // tasks: "task/tasksForListView",
      taskFields: "task/tableFields",
      token: "token/getToken",
      user: "user/getUser"
      // project: "project/getSingleProject",
    }),
  },
  created() {
    if (process.client) {
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$axios.$get("task/company/" + compid, {
        headers: { 'Authorization': "Bearer " + localStorage.getItem("accessToken") }
      }).then(res => {
        this.tasks = res.data;
      });
    }
  },
}

</script>
<style lang="scss" scoped>
</style>
