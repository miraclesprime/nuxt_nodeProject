<template>
  <div>

    <div class="border-gray4">
      <section-title></section-title>
    </div>
    
  </div>
</template>
<script>

export default {
  props: {
    gridType: String,
  },
  data() {
    return {
      flag: false,
    };
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
