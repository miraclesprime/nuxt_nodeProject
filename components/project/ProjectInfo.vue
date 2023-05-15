<template>
  <span :id="'project-info-'+ projectId" class="project-title text-dark text-truncate">{{project ? project.title : ''}}</span>
</template>
<script>
import { mapGetters } from 'vuex';

export default {

  name: 'ProjectInfo',

  props: {
    projectId: Number,
  },
  data() {
    return {
    }
  },

  computed: {
    ...mapGetters({
      projects: 'project/getAllProjects'
    }),
    project() {
      if (this.projectId) {
        return this.projects.find((el) => el.id == this.projectId)
      } else {
        return { title: ""}
      }
    }
  },

}

</script>
<style lang="scss" scoped>
.project-title {
  min-width: 6rem;
  max-width: 10rem;
}

</style>
