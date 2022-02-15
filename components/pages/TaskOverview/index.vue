<template>
  <div>

    <div class="border-gray4">
      <section-title></section-title>
    </div>
    <nav class="d-flex align-center pt-025 pb-025">
      <nuxt-link to="/projects">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <bib-avatar shape="rounded"></bib-avatar>
      <span class="font-lg font-w-700 p-05 mr-1 rounded ">Project Name</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <span class="font-sm pl-1 pr-1 pt-025 pb-025 bg-light text-grey">Status</span>
      <div class="ml-auto d-flex">
        <bib-avatar></bib-avatar>
        <bib-button label="invite" variant="light" pill class="ml-05" ></bib-button>
        <div class="shape-circle bg-light width-2 height-2 d-flex ml-05">
          <bib-icon icon="bookmark" class="m-auto"></bib-icon>
        </div>
        <div class="shape-circle bg-light width-2 height-2 d-flex ml-05">
          <bib-icon icon="elipsis" class="m-auto"></bib-icon>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
import { DUMMY_TASKS, DUMMY_TASK_FIELDS } from "~/dummy/tasks.js";
import { mapGetters } from 'vuex';

export default {
  props: {
    gridType: String,
  },
  data() {
    return {
      flag: false,
    };
  },

  created() {
    // this.getData();
  },
  mounted() {
    this.$store.dispatch("section/fetchSections");
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
