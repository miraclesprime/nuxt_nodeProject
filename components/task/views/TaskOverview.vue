<template>
  <div id="task-overview-view-wrapper">

    <div id="task-overview-view-inner" class="border-gray4">
      <!-- <section-title></section-title> -->
    </div>
    
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    gridType: String,
  },
  data() {
    return {
      flag: false,
      tasks: []
    };
  },

  computed: {
    ...mapGetters({
      token: 'token/getToken',
    })
  },

  mounted(){
    this.$axios.$get("task/project/1",{
      headers: {
        "Authorization": "Bearer "+ this.token
      }
    }).then(r=>{
      this.tasks = r
    }).catch(e=> console.log(e))
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
