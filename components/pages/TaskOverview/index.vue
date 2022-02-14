<template>
  <div>
    <!-- <task-actions /> -->
    
  </div>
</template>

<script>
import { DUMMY_TASKS, TASK_FIELDS } from "~/dummy/tasks.js";
import {mapGetters} from 'vuex';

export default {
  props: {
    gridType: String,
  },
  data() {
    return {
      tableFields: TASK_FIELDS,
      tableSections: DUMMY_TASKS,
      flag: false,
    };
  },
  computed: {
    ...mapGetters({
      token: 'token/getToken'
    }),
  },
  methods: {
    toggleSidebar() {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
    },

    statusClass(status) {
      if (status === "Past Due") return "text-red";
      if (status === "In-progress") return "text-blue";
    },

    priorityClass(priority) {
      if (priority === "Urgent") return "text-red";
      if (priority === "Top") return "text-orange";
      return "text-green";
    },

    
  },
};
</script>